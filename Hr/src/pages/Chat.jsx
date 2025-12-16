import React, { useState, useEffect, useRef } from 'react'
import { chatService, userService } from '../services/chatService'
import { getSocket, initializeSocket, joinConversation, leaveConversation, sendSocketMessage, emitTyping, emitStopTyping, disconnectSocket } from '../services/socket'

const MessageStatus = ({ status, isOwnMessage }) => {
  if (!isOwnMessage) return null;

  if (status === 'read') {
    return (
      <div className="flex">
        <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
        </svg>
        <svg className="w-3.5 h-3.5 text-blue-500 -ml-1.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
        </svg>
      </div>
    )
  }

  return (
    <div className="flex">
      <svg className="w-3.5 h-3.5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
      </svg>
    </div>
  )
}

const Chat = () => {
  const [conversations, setConversations] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [typingUsers, setTypingUsers] = useState({})
  const [chatListOpen, setChatListOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const messagesEndRef = useRef(null)
  const socketRef = useRef(null)
  const selectedChatRef = useRef(selectedChat)

  const selectedChatData = conversations.find(c => c.id === selectedChat)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    setCurrentUser(user)
  }, [])

  useEffect(() => {
    selectedChatRef.current = selectedChat
  }, [selectedChat])

  // Initialize socket and load conversations
  useEffect(() => {
    const initializeChat = async () => {
      try {
        socketRef.current = initializeSocket()

        if (socketRef.current) {
          socketRef.current.on('new-message', (message) => {
            setMessages(prev => {
              if (message.tempId) {
                const hasTemp = prev.some(m => m.id === message.tempId)
                if (hasTemp) {
                  return prev.map(m => m.id === message.tempId ? message : m)
                }
              }

              if (prev.some(m => m.id === message.id)) {
                return prev
              }

              return [...prev, message]
            })

            setConversations(prev => prev.map(conv => {
              if (conv.id === message.conversation_id) {
                return {
                  ...conv,
                  lastMessage: message.content,
                  lastMessageTime: message.created_at,
                  unreadCount: conv.id !== selectedChatRef.current ? (conv.unreadCount || 0) + 1 : 0
                }
              }
              return conv
            }))
          })

          socketRef.current.on('user-typing', ({ conversationId, userId, userName }) => {
            if (conversationId === selectedChatRef.current) {
              setTypingUsers(prev => ({ ...prev, [userId]: userName }))
            }
          })

          socketRef.current.on('user-stopped-typing', ({ conversationId, userId }) => {
            if (conversationId === selectedChatRef.current) {
              setTypingUsers(prev => {
                const newTyping = { ...prev }
                delete newTyping[userId]
                return newTyping
              })
            }
          })

          socketRef.current.on('user-status-change', ({ userId, status }) => {
            setConversations(prev => prev.map(conv => {
              if (conv.otherUserId === userId) {
                return { ...conv, status }
              }
              return conv
            }))
          })

          socketRef.current.on('conversation-updated', ({ conversationId, lastMessage, lastMessageTime }) => {
            setConversations(prev => prev.map(conv => {
              if (conv.id === conversationId) {
                return {
                  ...conv,
                  lastMessage,
                  lastMessageTime
                }
              }
              return conv
            }))
          })

          socketRef.current.on('conversation-read', ({ conversationId, readBy }) => {
            if (conversationId === selectedChatRef.current) {
              setMessages(prev => prev.map(msg => {
                if (msg.sender_id === currentUser?.id) {
                  return { ...msg, read_status: true }
                }
                return msg
              }))
            }
          })
        }

        const response = await chatService.getConversations()
        if (response.success) {
          // Normalize backend field names (handle both unreadCount and unread_count)
          const normalizedConversations = response.conversations.map(conv => ({
            ...conv,
            unreadCount: conv.unreadCount ?? conv.unread_count ?? 0
          }))
          setConversations(normalizedConversations)
          if (normalizedConversations.length > 0 && !selectedChat) {
            handleSelectChat(normalizedConversations[0].id)
          }
        }
      } catch (error) {
        console.error('Error initializing chat:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeChat()

    return () => {
      if (selectedChat) {
        leaveConversation(selectedChat)
      }
      disconnectSocket()
    }
  }, [])

  const handleSelectChat = async (conversationId) => {
    try {
      if (selectedChat) {
        leaveConversation(selectedChat)
      }

      setSelectedChat(conversationId)
      setChatListOpen(false)

      // Immediately clear unread count for instant UI feedback (blue dot disappears right away)
      setConversations(prev => prev.map(conv => {
        if (conv.id === conversationId) {
          return { ...conv, unreadCount: 0 }
        }
        return conv
      }))

      joinConversation(conversationId)

      const response = await chatService.getMessages(conversationId)
      if (response.success) {
        setMessages(response.messages)
      }

      // Also notify backend that messages are read
      chatService.markConversationAsRead(conversationId).catch(err => {
        console.error('Error marking conversation as read:', err)
      })
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedChat) return

    const tempId = `temp-${Date.now()}`
    const tempMessage = {
      id: tempId,
      conversation_id: selectedChat,
      sender_id: currentUser.id,
      content: inputMessage,
      created_at: new Date().toISOString(),
      sender_name: currentUser.name,
      sender_avatar: currentUser.avatar,
      sending: true,
      read_status: false
    }

    setMessages(prev => [...prev, tempMessage])
    setInputMessage('')

    emitStopTyping(selectedChat)

    try {
      sendSocketMessage({
        conversationId: selectedChat,
        content: tempMessage.content,
        tempId
      })
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => prev.map(m => m.id === tempId ? { ...m, failed: true, sending: false } : m))
    }
  }

  const handleInputChange = (e) => {
    setInputMessage(e.target.value)
    if (selectedChat) {
      if (e.target.value.length > 0) {
        emitTyping(selectedChat)
      } else {
        emitStopTyping(selectedChat)
      }
    }
  }

  const handleUserSelect = async (user) => {
    try {
      const existingConversation = conversations.find(
        (conv) => conv.otherUserId === user.id
      )

      if (existingConversation) {
        handleSelectChat(existingConversation.id)
      } else {
        const response = await chatService.createConversation([user.id])
        if (response.success) {
          const newConversation = {
            id: response.conversation.id,
            name: user.name,
            avatar: user.name.charAt(0).toUpperCase(),
            otherUserId: user.id,
            lastMessage: null,
            lastMessageTime: null,
            unreadCount: 0,
            status: 'offline'
          }
          setConversations(prev => [newConversation, ...prev])
          handleSelectChat(newConversation.id)
        }
      }
      setSearchQuery('')
      setSearchResults([])
    } catch (error) {
      console.error('Error selecting user or creating conversation:', error)
    }
  }

  const handleSearch = async (e) => {
    const query = e.target.value
    setSearchQuery(query)
    if (query.length > 2) {
      setIsSearching(true)
      try {
        const response = await userService.searchUsers(query)
        if (response.success) {
          setSearchResults(response.users.filter(user => user.id !== currentUser.id))
        }
      } catch (error) {
        console.error('Error searching users:', error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    } else {
      setSearchResults([])
      setIsSearching(false)
    }
  }

  const formatTime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading chat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className={`${chatListOpen ? 'block' : 'hidden'} md:block w-full md:w-80 bg-white border-r border-gray-200 overflow-y-auto`}>
        <div className="p-4 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Messages</h2>
            <button onClick={() => setChatListOpen(false)} className="md:hidden text-gray-600">
              <svg className="w-6 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-5 py-4 shrink-0">
          <div className="relative group">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search users..."
              className="bg-transparent ml-2 w-full text-sm outline-none text-gray-600 placeholder-gray-400 pl-6"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {searchQuery ? (
            <div>
              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  {isSearching ? 'Searching...' : 'No users found'}
                </div>
              ) : (
                <>
                  <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Search Results
                  </div>
                  {searchResults.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleUserSelect(user)}
                      className="w-full p-2.5 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white flex items-center justify-center font-semibold shrink-0 text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 truncate text-sm">{user.name}</h3>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </>
              )}
            </div>
          ) : (
            conversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No conversations yet</p>
                <p className="text-sm mt-2">Search for a user to start chatting</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleSelectChat(conv.id)}
                  className={`w-full p-2.5 text-left transition-colors ${selectedChat === conv.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-semibold shrink-0 text-sm">
                      {conv.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-gray-800 truncate text-sm">{conv.name}</h3>
                        {conv.status === 'online' && (
                          <div className="w-2 h-2 bg-green-500 rounded-full shrink-0"></div>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 truncate">{conv.lastMessage || 'No messages yet'}</p>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-xs text-gray-500">{formatTime(conv.lastMessageTime)}</p>
                        {conv.unreadCount > 0 && (
                          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shrink-0"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )
          )}
        </div>
      </div>

      <div className={`${chatListOpen ? 'hidden' : 'flex'} md:flex flex-1 flex-col bg-[#e5ddd5]`}>
        {selectedChatData ? (
          <>
            <div className="border-b border-gray-200 p-3 md:p-4 flex items-center justify-between bg-white sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                <button onClick={() => setChatListOpen(true)} className="md:hidden text-gray-600 shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 text-white flex items-center justify-center font-semibold shrink-0 text-sm md:text-base">
                  {selectedChatData?.avatar}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate text-sm md:text-base">{selectedChatData?.name}</h3>
                  <p className="text-xs md:text-sm text-gray-500 truncate">
                    {selectedChatData?.status === 'online' ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-4 shrink-0">
                <button className="text-gray-600 hover:text-gray-800 p-1 md:p-2">
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                <button className="text-gray-600 hover:text-gray-800 p-1 md:p-2">
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8 bg-white/80 rounded-lg mx-auto max-w-sm mt-10 shadow-sm">
                  <p>No messages yet</p>
                  <p className="text-sm mt-2">Send a message to start the conversation</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.sender_id === currentUser?.id;
                  return (
                    <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] md:max-w-[70%] rounded-lg px-3 py-2 shadow-sm ${isOwn
                        ? 'bg-[#dcf8c6] text-gray-900 rounded-tr-none'
                        : 'bg-white text-gray-900 rounded-tl-none'
                        } ${msg.sending ? 'opacity-70' : ''} ${msg.failed ? 'border border-red-500' : ''}`}>

                        <p className="text-[14px] leading-[19px] break-words pr-16 min-h-[19px]">
                          {msg.content}
                        </p>

                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-[11px] text-gray-600 leading-none">
                            {formatTime(msg.created_at)}
                          </span>
                          {isOwn && (
                            <MessageStatus
                              status={msg.read_status ? 'read' : 'sent'}
                              isOwnMessage={true}
                            />
                          )}
                        </div>

                        {msg.failed && (
                          <p className="text-[10px] text-red-600 mt-1">Failed</p>
                        )}
                      </div>
                    </div>
                  )
                })
              )}

              {Object.keys(typingUsers).length > 0 && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-600 rounded-lg px-4 py-2 text-sm italic shadow-sm">
                    {Object.values(typingUsers)[0]} is typing...
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-2 md:p-3 bg-[#f0f2f5] flex items-center gap-2">
              <button className="text-gray-500 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h6v2h-6v6h-2v-6H5v-2h6z" />
                </svg>
              </button>

              <div className="flex-1 bg-white rounded-full flex items-center px-4 py-2 shadow-sm border border-gray-200">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={handleInputChange}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message"
                  className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-500"
                />
              </div>

              <button
                onClick={handleSendMessage}
                className="p-3 bg-[#00a884] text-white rounded-full hover:bg-[#008f6f] transition-colors shadow-sm flex items-center justify-center"
              >
                {inputMessage.trim() ? (
                  <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                  </svg>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-[#f0f2f5]">
            <div className="text-center">
              <p className="text-gray-500 text-sm">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chat