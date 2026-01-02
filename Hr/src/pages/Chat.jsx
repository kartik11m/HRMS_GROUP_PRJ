<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react'
import { chatService, userService } from '../services/chatService'
import { getSocket, initializeSocket, joinConversation, leaveConversation, sendSocketMessage, emitTyping, emitStopTyping, disconnectSocket } from '../services/socket'
=======
import React, { useState, useEffect } from 'react'
import io from "socket.io-client";
import axios from "axios";
import { Search, MoreVertical, Send, Phone, Video, Info, ArrowLeft, Clock, Check, CheckCheck, Trash2, Edit2, MoreHorizontal } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
>>>>>>> af8e894881da2d14929bcae57d583ad190a15920

const MessageStatus = ({ status, isOwnMessage }) => {
  if (!isOwnMessage) return null;

<<<<<<< HEAD
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
=======
const Chat = () => {
  const [searchParams] = useSearchParams();
  const requestedUserId = searchParams.get('userId');

  const [recentChats, setRecentChats] = useState([]); // Recent conversations
  const [allUsers, setAllUsers] = useState([]); // All users for search
  const [displayedContacts, setDisplayedContacts] = useState([]); // What is actually shown
  const [searchQuery, setSearchQuery] = useState(""); // Search input state
  const [loading, setLoading] = useState(true); // Loading state
  const [onlineUserIds, setOnlineUserIds] = useState(new Set()); // Track online users

  // User & Selection State
  const [selectedChat, setSelectedChat] = useState(null);
  const [inputMessage, setInputMessage] = useState('')
  const [chatListOpen, setChatListOpen] = useState(true)
  const [currentUser, setCurrentUser] = useState(null);

  // Helper: robust time formatting (handles ISO and DB strings and converts to local time)
  const formatTime = (isoOrDate) => {
    try {
      if (!isoOrDate) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // If it's already a Date instance, use it
      if (isoOrDate instanceof Date) {
        return isoOrDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }

      let s = String(isoOrDate).trim();

      // If it is a simple 'HH:MM AM/PM' string coming from client, return as-is (but normalized)
      if (/^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(s)) {
        // Make sure to uppercase AM/PM and pad hour
        return s.toUpperCase();
      }

      // Detect ISO with timezone or offset
      const hasTZ = /[Zz]|[+\-]\d{2}:?\d{2}/.test(s);
      const hasT = s.includes('T');

      let d;

      // DB common formats:
      // 1) 'YYYY-MM-DD HH:mm:ss' -> treat as local time (no timezone)
      // 2) 'YYYY-MM-DDTHH:mm:ss' (no TZ) -> treat as local time
      // 3) ISO with Z or offset -> use Date(s)

      const dbSpaceFormat = /^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}(:\d{2})?/;
      const isoNoTZ = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/;

      if (hasTZ) {
        d = new Date(s);
      } else if (dbSpaceFormat.test(s) || isoNoTZ.test(s)) {
        // Parse as local time exactly (do not append Z)
        // Extract components
        const parts = s.replace('T', ' ').split(' ');
        const dateParts = parts[0].split('-');
        const timeParts = (parts[1] || '').split(':');
        const year = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1;
        const day = parseInt(dateParts[2], 10);
        const hour = parseInt(timeParts[0] || '0', 10);
        const minute = parseInt(timeParts[1] || '0', 10);
        const second = parseInt(timeParts[2] || '0', 10);
        d = new Date(year, month, day, hour, minute, second);
      } else if (hasT) {
        // fallback parse
        d = new Date(s);
      } else {
        // For any other string, fallback to Date
        d = new Date(s);
      }

      if (isNaN(d.getTime())) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  // Conversation state
  const [conversation, setConversation] = useState([]);

  // --- 1. INITIAL DATA FETCHING ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        // Parse User
        let currentUserId = null;
        if (userStr) {
          const parsed = JSON.parse(userStr);
          setCurrentUser(parsed);
          currentUserId = parsed.id;
        }

        if (!token || !currentUserId) {
          setLoading(false);
          return;
        }

        // Notify server we are online
        socket.emit("user_connected", currentUserId);

        const config = { headers: { Authorization: `Bearer ${token}` } };

        // A. Fetch Recent Chats (Primary List)
        try {
          const recentRes = await axios.get(`http://localhost:3000/api/chats/${currentUserId}`, config);
          const recent = recentRes.data.map(user => ({
            id: user.id,
            name: user.name,
            role: user.role,
            message: user.message,
            time: user.time ? formatTime(user.time) : "",
            avatar: user.name ? user.name.charAt(0).toUpperCase() : "?",
            unread: false, // You might want real unread count from DB later
            isRecent: true
          }));
          setRecentChats(recent);
          if (recent.length > 0) setSelectedChat(recent[0].id);
        } catch (error) {
          console.error("Error fetching recent chats:", error);
        }

        // B. Fetch All Users (Directory for Search)
        try {
          const usersRes = await axios.get("http://localhost:3000/api/users", config);
          const all = (usersRes.data.users || [])
            .filter(u => u.id !== currentUserId)
            .map(user => ({
              id: user.id,
              name: user.fullname,
              role: user.email,
              message: "Start a new conversation",
              time: "",
              avatar: user.fullname ? user.fullname.charAt(0).toUpperCase() : "?",
              unread: false,
              isRecent: false
            }));
          setAllUsers(all);
          // If page was opened with ?userId=... select that chat automatically
          if (requestedUserId) {
            setSelectedChat(requestedUserId);
            setChatListOpen(false);
          }
        } catch (err) {
          if (err.response && err.response.status === 401) {
            if (err.response.data && err.response.data.message === "Token expired") {
              alert("Session expired. Please log in again.");
            }
            // Token invalid/expired - force logout
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return;
          }
          console.error("Error fetching users for chat:", err);
        }

      } catch (err) {
        console.error("Failed to load chat data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- 2. ONLINE PRESENCE LISTENER & RECONNECTION ---
  useEffect(() => {
    // 1. Listen for the list of online users
    const handleOnlineUsers = (userIds) => {
      // Force all IDs to strings for consistent checking
      const idSet = new Set(userIds.map(id => String(id)));
      setOnlineUserIds(idSet);
    };

    socket.on("online_users", handleOnlineUsers);

    // 2. Handle Reconnection (Important if server restarts)
    const handleConnect = () => {
      if (currentUser && currentUser.id) {
        console.log("Reconnected to server, sending identity:", currentUser.id);
        socket.emit("user_connected", currentUser.id);
      }
    };

    socket.on("connect", handleConnect);

    // 3. Emit immediately if we already have a user and socket is connected
    if (currentUser && currentUser.id && socket.connected) {
      socket.emit("user_connected", currentUser.id);
    }

    return () => {
      socket.off("online_users", handleOnlineUsers);
      socket.off("connect", handleConnect);
    };
  }, [currentUser]); // Re-run if user changes

  // --- 3. FILTERING & DISPLAY LOGIC ---
  useEffect(() => {
    let sourceList = [];

    if (!searchQuery.trim()) {
      // Default View: Show Recent Chats ONLY
      // If no recent chats, show directory (UX choice)
      sourceList = recentChats.length > 0 ? recentChats : allUsers;
    } else {
      // Search View: Search across ALL users (Directory)
      sourceList = allUsers;
    }

    // Apply presence status to whatever list we are showing
    const listWithStatus = sourceList.map(contact => ({
      ...contact,
      status: onlineUserIds.has(String(contact.id)) ? "online" : "offline"
    }));

    // Filter by Query if it exists
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = listWithStatus.filter(c =>
        (c.name && c.name.toLowerCase().includes(lowerQuery)) ||
        (c.role && c.role.toLowerCase().includes(lowerQuery))
      );
      setDisplayedContacts(filtered);
    } else {
      setDisplayedContacts(listWithStatus);
    }

  }, [searchQuery, recentChats, allUsers, onlineUserIds]);

  // If a chat was requested via query param but that user is not in our lists, fetch them
  useEffect(() => {
    const addRequestedUser = async () => {
      if (!requestedUserId) return;
      const exists = allUsers.find(u => String(u.id) === String(requestedUserId)) || recentChats.find(r => String(r.id) === String(requestedUserId));
      if (exists) return;

      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch(`http://localhost:3000/api/users/${requestedUserId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        const u = data.user;
        if (u) {
          setAllUsers(prev => [...prev, { id: u.id, name: u.fullname, role: u.email, message: 'Start a new conversation', time: '', avatar: u.fullname ? u.fullname.charAt(0).toUpperCase() : '?' }]);
        }
      } catch (err) {
        console.error('Failed to fetch requested chat user', err);
      }
    };
    addRequestedUser();
  }, [requestedUserId, allUsers, recentChats]);


  // --- 4. REAL-TIME MESSAGING LOGIC ---
  useEffect(() => {
    const fetchHistory = async () => {
      if (!selectedChat || !currentUser) return;

      // Mark local as read
      setRecentChats(prev => prev.map(c => c.id === selectedChat ? { ...c, unread: false } : c));

      try {
        const res = await axios.get(`http://localhost:3000/api/messages/${currentUser.id}/${selectedChat}`);
        const history = res.data.map(msg => ({
          id: msg.id,
          text: msg.message,
          sender: msg.sender_id === currentUser.id ? "me" : "other",
          time: formatTime(msg.created_at),
          status: msg.status,
          is_edited: msg.is_edited,
          is_deleted: msg.is_deleted
        }));
        setConversation(history);

        // Mark last message from OTHER as read if it isn't already
        const lastMsg = history[history.length - 1];
        if (lastMsg && lastMsg.sender === 'other' && lastMsg.status !== 'read') {
          socket.emit("message_read", { messageId: lastMsg.id, senderId: selectedChat });
        }

      } catch (err) { console.error("Error loading history", err); }
    };
    fetchHistory();
  }, [selectedChat, currentUser]);

  const selectedChatData = displayedContacts.find(m => m.id === selectedChat) || allUsers.find(u => u.id === selectedChat);
  // Enhance selected data with current online status
  const activeChatUser = selectedChatData ? {
    ...selectedChatData,
    status: onlineUserIds.has(String(selectedChatData.id)) ? "online" : "offline"
  } : null;

  // Listen for incoming messages

  // Listen for incoming messages
  useEffect(() => {
  const handleReceiveMessage = (data) => {
    console.log("📥 Chat: Received Message:", data);

    // DEBUG: Log emission
    if (data.id) console.log("📤 Emitting message_delivered for:", data.id);
    else console.warn("⚠️ Received message without ID, cannot emit delivered");

    // Update active conversation if applicable
    const isChattingWithSender =
      String(data.senderId) === String(selectedChat) &&
      String(data.receiverId) === String(currentUser?.id);

    const isChattingWithReceiver =
      String(data.senderId) === String(currentUser?.id) &&
      String(data.receiverId) === String(selectedChat);

    if (isChattingWithSender || isChattingWithReceiver) {
      setConversation((prev) => [
        ...prev,
        {
          id: data.id || Date.now(),
          text: data.message,
          sender: String(data.senderId) === String(currentUser?.id) ? "me" : "other",
          time: formatTime(data.created_at),
          status: "read", // We are watching it now, so it's read
        },
      ]);
      if (data.id) socket.emit("message_read", { messageId: data.id, senderId: data.senderId });
    }

    // Always mark as delivered
    if (data.id) socket.emit("message_delivered", { messageId: data.id, senderId: data.senderId });

    // Toast notification
    if (
      String(data.receiverId) === String(currentUser?.id) &&
      String(data.senderId) !== String(currentUser?.id)
    ) {
      toast.success(`New message from ${data.author || "User " + data.senderId}`, {
        icon: "💬",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }

    // Update Sidebar List (Reorder & Unread)
    setRecentChats((prev) => {
      const senderId =
        String(data.senderId) === String(currentUser?.id) ? data.receiverId : data.senderId;
      const senderIndex = prev.findIndex((c) => String(c.id) === String(senderId));

      let updatedContacts = [...prev];
      let sender;

      if (senderIndex !== -1) {
        [sender] = updatedContacts.splice(senderIndex, 1);
      } else {
        const userDetails = allUsers.find((u) => String(u.id) === String(senderId));
        if (!userDetails) {
          console.warn(`Sender ${senderId} not found in allUsers directory. Using fallback.`);
          sender = {
            id: senderId,
            name: "New Contact",
            avatar: "?",
            role: "Employee",
            status: "online",
            isRecent: true,
            unread: false,
          };
        } else {
          sender = { ...userDetails, unread: false };
        }
      }

      const isUnread = String(senderId) !== String(selectedChat);

      updatedContacts.unshift({
        ...sender,
        unread: isUnread || sender.unread || false,
        message: data.message,
        time: formatTime(data.created_at),
      });

      return updatedContacts;
    });
  };

  socket.on("receive_message", handleReceiveMessage);

  return () => {
    socket.off("receive_message", handleReceiveMessage);
  };
}, [socket, selectedChat, currentUser, allUsers, formatTime]);

  // --- 5. NEW: Listeners for Status, Edit, Delete ---
  // Ref to store updates that arrive before the message ID is synced
  const pendingUpdates = React.useRef(new Map());

  // --- 5. NEW: Listeners for Status, Edit, Delete ---
  useEffect(() => {
    // Status update (delivered/read)
    const handleStatusUpdate = (data) => {
      console.log("📥 Chat: Status Update Received:", data);
      setConversation(prev => {
        const exists = prev.some(msg => msg.id === data.id);
        if (!exists) { // Message ID mismatch (still tempId?)
          console.log("⏳ Message not found yet (race condition?), caching update:", data.id, data.status);
          pendingUpdates.current.set(String(data.id), data.status);
          return prev;
        }
        return prev.map(msg =>
          msg.id === data.id ? { ...msg, status: data.status } : msg
        );
      });
    };

    const handleMessageUpdated = (data) => {
      setConversation(prev => prev.map(msg =>
        msg.id === data.id ? { ...msg, text: data.text, is_edited: true } : msg
      ));
    };

    const handleMessageDeleted = (data) => {
      setConversation(prev => prev.map(msg =>
        msg.id === data.id ? { ...msg, text: "This message was deleted", is_deleted: true } : msg
      ));
    };

    const handleMessageSent = (data) => {
      console.log("📥 Chat: Message Sent Confirmed:", data);

      setConversation(prev => prev.map(msg => {
        if (String(msg.id) === String(data.tempId)) {
          // Check if we have pending status updates for this ID
          const pendingStatus = pendingUpdates.current.get(String(data.id));
          if (pendingStatus) {
            console.log("🔄 Applying pending status update:", pendingStatus);
            pendingUpdates.current.delete(String(data.id));
            return { ...msg, id: data.id, status: pendingStatus, time: data.created_at ? formatTime(data.created_at) : msg.time };
          }
          return { ...msg, id: data.id, status: 'sent', time: data.created_at ? formatTime(data.created_at) : msg.time };
        }
        return msg;
      }));

      // Also update the sidebar/recent chats entry for the receiver so time matches DB
      if (data && data.receiverId) {
        setRecentChats(prev => {
          const idx = prev.findIndex(c => String(c.id) === String(data.receiverId));
          if (idx !== -1) {
            const updated = [...prev];
            updated[idx] = {
              ...updated[idx],
              time: data.created_at ? formatTime(data.created_at) : updated[idx].time
            };
            return updated;
          }
          return prev;
        });
      }
    };

    socket.on("message_status_update", handleStatusUpdate);
    socket.on("message_updated", handleMessageUpdated);
    socket.on("message_deleted", handleMessageDeleted);
    socket.on("message_sent", handleMessageSent);

    return () => {
      socket.off("message_status_update", handleStatusUpdate);
      socket.off("message_updated", handleMessageUpdated);
      socket.off("message_deleted", handleMessageDeleted);
      socket.off("message_sent", handleMessageSent);
    };
  }, []);

  const handleEditMessage = async (msgId, newText, receiverId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/api/messages/${msgId}`, { message: newText }, { headers: { Authorization: `Bearer ${token}` } });

      setConversation(prev => prev.map(m => m.id === msgId ? { ...m, text: newText, is_edited: true } : m));
      socket.emit("edit_message", { id: msgId, text: newText, receiverId });
      toast.success("Message edited");
    } catch (err) {
      toast.error("Failed to edit message");
    }
  };

  const handleDeleteMessage = async (msgId, receiverId) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/messages/${msgId}`, { headers: { Authorization: `Bearer ${token}` } });

      setConversation(prev => prev.map(m => m.id === msgId ? { ...m, text: "This message was deleted", is_deleted: true } : m));
      socket.emit("delete_message", { id: msgId, receiverId });
      toast.success("Message deleted");
    } catch (err) {
      toast.error("Failed to delete message");
    }
  };


  const handleSendMessage = async () => {
    if (inputMessage.trim() && currentUser && selectedChat) {
      const tempId = Date.now();
      const messageData = {
        id: tempId, // Send temp ID to server
        room: selectedChat,
        senderId: currentUser.id,
        receiverId: selectedChat,
        author: currentUser.fullname,
        message: inputMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      await socket.emit("send_message", messageData);

      setConversation(prev => [
        ...prev,
        { id: tempId, text: inputMessage, sender: "me", time: messageData.time, status: 'sending' }
      ]);

      // Optimistic Sidebar Update
      setRecentChats(prev => {
        const receiverIndex = prev.findIndex(c => c.id === selectedChat);
        let newList = [...prev];
        let receiver = null;

        if (receiverIndex !== -1) {
          [receiver] = newList.splice(receiverIndex, 1);
        } else {
          const found = allUsers.find(u => u.id === selectedChat);
          if (found) receiver = { ...found, isRecent: true };
        }

        if (receiver) {
          receiver = {
            ...receiver,
            message: "You: " + inputMessage,
            time: messageData.time,
            unread: false
          };
          newList.unshift(receiver);
        }
        return newList;
      });

      setInputMessage('');
    }
>>>>>>> af8e894881da2d14929bcae57d583ad190a15920
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
      <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-[#0C1014] transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-[#88AAFF] mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-[#AACCFF]">Loading chat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-[#0C1014] transition-colors duration-300">
      <div className={`${chatListOpen ? 'block' : 'hidden'} md:block w-full md:w-80 bg-white dark:bg-[#0C1014] border-r border-gray-200 dark:border-[#1F2429] overflow-y-auto transition-colors duration-300`}>
        <div className="p-4 border-b border-gray-200 dark:border-[#1F2429] sticky top-0 bg-white dark:bg-[#0C1014] transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-[#AACCFF]">Messages</h2>
            <button onClick={() => setChatListOpen(false)} className="md:hidden text-gray-600 dark:text-[#88AAFF]">
              <svg className="w-6 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-5 py-4 shrink-0">
          <div className="relative group">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#88AAFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search users..."
              className="bg-transparent ml-2 w-full text-sm outline-none text-gray-600 dark:text-[#AACCFF] placeholder-gray-400 dark:placeholder-[#88AAFF]/60 pl-6"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-[#1F2429]">
          {searchQuery ? (
            <div>
              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-[#88AAFF] text-sm">
                  {isSearching ? 'Searching...' : 'No users found'}
                </div>
              ) : (
                <>
                  <div className="px-4 py-2 bg-gray-50 dark:bg-[#1F2429] text-xs font-semibold text-gray-500 dark:text-[#88AAFF] uppercase tracking-wider">
                    Search Results
                  </div>
                  {searchResults.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleUserSelect(user)}
                      className="w-full p-2.5 text-left hover:bg-gray-50 dark:hover:bg-[#88AAFF]/10 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white flex items-center justify-center font-semibold shrink-0 text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 dark:text-[#AACCFF] truncate text-sm">{user.name}</h3>
                          <p className="text-xs text-gray-500 dark:text-[#88AAFF] truncate">{user.email}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </>
              )}
            </div>
          ) : (
            conversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-[#88AAFF]">
                <p>No conversations yet</p>
                <p className="text-sm mt-2">Search for a user to start chatting</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleSelectChat(conv.id)}
                  className={`w-full p-2.5 text-left transition-colors ${selectedChat === conv.id ? 'bg-blue-50 dark:bg-[#88AAFF]/20' : 'hover:bg-gray-50 dark:hover:bg-[#88AAFF]/10'}`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 dark:from-[#2C50AB] dark:to-[#88AAFF] text-white flex items-center justify-center font-semibold shrink-0 text-sm">
                      {conv.avatar}
                    </div>
<<<<<<< HEAD
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-gray-800 dark:text-[#AACCFF] truncate text-sm">{conv.name}</h3>
                        {conv.status === 'online' && (
                          <div className="w-2 h-2 bg-green-500 rounded-full shrink-0"></div>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-[#88AAFF]/80 truncate">{conv.lastMessage || 'No messages yet'}</p>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-xs text-gray-500 dark:text-[#88AAFF]/60">{formatTime(conv.lastMessageTime)}</p>
                        {conv.unreadCount > 0 && (
                          <div className="w-2.5 h-2.5 bg-blue-500 dark:bg-[#88AAFF] rounded-full shrink-0"></div>
                        )}
                      </div>
=======
                    {/* Status Dot */}
                    <div className={`absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${contact.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className={`text-sm truncate ${contact.unread ? 'font-bold text-gray-900' : 'font-semibold text-gray-800'}`}>
                        {contact.name}
                      </h3>
                      {contact.time && <span className="text-[10px] text-gray-400 font-medium shrink-0 ml-2">{contact.time}</span>}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className={`text-xs truncate max-w-40 ${contact.unread ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                        {contact.message || contact.role}
                      </p>
                      {contact.unread && (
                        <span className="shrink-0 w-2 h-2 bg-blue-600 rounded-full ml-2"></span>
                      )}
>>>>>>> af8e894881da2d14929bcae57d583ad190a15920
                    </div>
                  </div>
                </button>
              ))
            )
          )}
        </div>
      </div>

      <div className={`${chatListOpen ? 'hidden' : 'flex'} md:flex flex-1 flex-col bg-[#e5ddd5] dark:bg-[#0C1014] transition-colors duration-300`}>
        {selectedChatData ? (
          <>
            <div className="border-b border-gray-200 dark:border-[#1F2429] p-3 md:p-4 flex items-center justify-between bg-white dark:bg-[#0C1014] sticky top-0 z-10 shadow-sm dark:shadow-none transition-colors duration-300">
              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                <button onClick={() => setChatListOpen(true)} className="md:hidden text-gray-600 dark:text-[#88AAFF] shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 dark:from-[#2C50AB] dark:to-[#88AAFF] text-white flex items-center justify-center font-semibold shrink-0 text-sm md:text-base">
                  {selectedChatData?.avatar}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-800 dark:text-[#AACCFF] truncate text-sm md:text-base">{selectedChatData?.name}</h3>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-[#88AAFF] truncate">
                    {selectedChatData?.status === 'online' ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-4 shrink-0">
                <button className="text-gray-600 dark:text-[#88AAFF] hover:text-gray-800 dark:hover:text-[#AACCFF] p-1 md:p-2">
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                <button className="text-gray-600 dark:text-[#88AAFF] hover:text-gray-800 dark:hover:text-[#AACCFF] p-1 md:p-2">
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                </button>
              </div>
            </div>

<<<<<<< HEAD
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] dark:bg-none dark:bg-[#0C1014] bg-repeat transition-colors duration-300">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-[#88AAFF] py-8 bg-white/80 dark:bg-[#1F2429] rounded-lg mx-auto max-w-sm mt-10 shadow-sm">
                  <p>No messages yet</p>
                  <p className="text-sm mt-2">Send a message to start the conversation</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.sender_id === currentUser?.id;
                  return (
                    <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] md:max-w-[70%] rounded-lg px-3 py-2 shadow-sm ${isOwn
                        ? 'bg-[#dcf8c6] dark:bg-[#005c4b] text-gray-900 dark:text-white rounded-tr-none'
                        : 'bg-white dark:bg-[#262626] text-gray-900 dark:text-[#AACCFF] rounded-tl-none'
                        } ${msg.sending ? 'opacity-70' : ''} ${msg.failed ? 'border border-red-500' : ''}`}>

                        <p className="text-[14px] leading-[19px] break-words pr-16 min-h-[19px]">
                          {msg.content}
                        </p>

                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-[11px] text-gray-600 dark:text-gray-400 leading-none">
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
                          <p className="text-[10px] text-red-600 dark:text-red-400 mt-1">Failed</p>
                        )}
                      </div>
                    </div>
                  )
                })
              )}

              {Object.keys(typingUsers).length > 0 && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-[#262626] text-gray-600 dark:text-[#88AAFF] rounded-lg px-4 py-2 text-sm italic shadow-sm">
                    {Object.values(typingUsers)[0]} is typing...
=======
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <Toaster />
              {/* <div className="text-center my-4">
                <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-wider">Today</span>
              </div> */}
              {conversation.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"} group`}>
                  <div className={`relative max-w-[70%] md:max-w-[60%] rounded-2xl px-5 py-3 shadow-sm ${msg.sender === "me" ? "bg-blue-600 text-white rounded-tr-sm" : "bg-white text-gray-800 border border-gray-100 rounded-tl-sm"}`}>

                    {/* Message Text */}
                    <p className={`text-sm leading-relaxed ${msg.is_deleted ? 'italic opacity-60' : ''}`}>
                      {msg.text}
                      {msg.is_edited && !msg.is_deleted && <span className="text-[10px] opacity-60 ml-1">(edited)</span>}
                    </p>

                    {/* Metadata: Time + Ticks */}
                    <div className={`flex items-center justify-end gap-1 mt-1.5 ${msg.sender === "me" ? "text-blue-100" : "text-gray-400"}`}>
                      <p className="text-[10px] font-medium opacity-70">{msg.time}</p>

                      {/* Ticks for My Messages */}
                      {msg.sender === "me" && !msg.is_deleted && (
                        <span className="flex items-center">
                          {/* Sending (Clock) */}
                          {msg.status === 'sending' && <Clock size={12} className="opacity-70" />}
                          {/* Single Tick (Sent) */}
                          {msg.status === 'sent' && <Check size={14} className="opacity-70" />}
                          {/* Double Tick (Delivered/Read) */}
                          {(msg.status === 'delivered' || msg.status === 'read') && (
                            <CheckCheck size={14} className={msg.status === 'read' ? 'text-blue-200' : 'opacity-70'} />
                          )}
                          {/* Default fallback if status missing but "me" */}
                          {!msg.status && <Check size={14} className="opacity-70" />}
                        </span>
                      )}
                    </div>

                    {/* Action Menu (Hover) */}
                    {msg.sender === "me" && !msg.is_deleted && (
                      <div className="absolute top-2 right-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white shadow-md rounded-lg p-1 border border-gray-100">
                        <button onClick={() => {
                          const newText = prompt("Edit message:", msg.text);
                          if (newText && newText !== msg.text) handleEditMessage(msg.id, newText, selectedChat);
                        }} className="p-1.5 hover:bg-gray-100 rounded text-gray-600" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDeleteMessage(msg.id, selectedChat)} className="p-1.5 hover:bg-red-50 text-red-500 rounded" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
>>>>>>> af8e894881da2d14929bcae57d583ad190a15920
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-2 md:p-3 bg-[#f0f2f5] dark:bg-[#0C1014] flex items-center gap-2 border-t border-transparent dark:border-[#1F2429] transition-colors duration-300">
              <button className="text-gray-500 dark:text-[#88AAFF] hover:text-gray-600 dark:hover:text-[#AACCFF] p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#1F2429] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h6v2h-6v6h-2v-6H5v-2h6z" />
                </svg>
              </button>

              <div className="flex-1 bg-white dark:bg-[#1F2429] rounded-full flex items-center px-4 py-2 shadow-sm border border-gray-200 dark:border-[#1F2429] transition-colors duration-300">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={handleInputChange}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message"
                  className="flex-1 bg-transparent outline-none text-sm text-gray-800 dark:text-[#AACCFF] placeholder-gray-500 dark:placeholder-[#88AAFF]/60"
                />
              </div>

              <button
                onClick={handleSendMessage}
                className="p-3 bg-[#00a884] dark:bg-[#2C50AB] text-white rounded-full hover:bg-[#008f6f] dark:hover:bg-[#88AAFF] transition-colors shadow-sm flex items-center justify-center"
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
          <div className="flex-1 flex items-center justify-center bg-[#f0f2f5] dark:bg-[#0C1014] transition-colors duration-300">
            <div className="text-center">
              <p className="text-gray-500 dark:text-[#88AAFF] text-sm">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chat