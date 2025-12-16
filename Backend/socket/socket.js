const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const socketHandler = (io) => {
    // Middleware to authenticate socket connections
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error('Authentication error'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id;

            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', async (socket) => {
        console.log(`✅ User connected: ${socket.userId} (Socket ID: ${socket.id})`);

        // Update user status to online
        try {
            await pool.query(
                'UPDATE users SET status = $1 WHERE id = $2',
                ['online', socket.userId]
            );

            // Broadcast user online status to all clients
            io.emit('user-status-change', {
                userId: socket.userId,
                status: 'online'
            });
        } catch (error) {
            console.error('Error updating user status:', error);
        }

        // Join user to their personal room
        socket.join(`user:${socket.userId}`);

        // Join conversation room
        socket.on('join-conversation', (conversationId) => {
            socket.join(`conversation:${conversationId}`);
            console.log(`User ${socket.userId} joined conversation ${conversationId}`);
        });

        // Leave conversation room
        socket.on('leave-conversation', (conversationId) => {
            socket.leave(`conversation:${conversationId}`);
            console.log(`User ${socket.userId} left conversation ${conversationId}`);
        });

        // Send message (real-time)
        socket.on('send-message', async (data) => {
            try {
                const { conversationId, content, tempId } = data;

                // Verify user is participant
                const participant = await pool.query(
                    'SELECT * FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2',
                    [conversationId, socket.userId]
                );

                if (participant.rows.length === 0) {
                    socket.emit('error', { message: 'Not authorized' });
                    return;
                }

                // Insert message
                const result = await pool.query(
                    `INSERT INTO messages (conversation_id, sender_id, content) 
           VALUES ($1, $2, $3) 
           RETURNING *`,
                    [conversationId, socket.userId, content]
                );

                // Get sender info
                const senderInfo = await pool.query(
                    'SELECT name, avatar FROM users WHERE id = $1',
                    [socket.userId]
                );

                const message = {
                    ...result.rows[0],
                    sender_name: senderInfo.rows[0].name,
                    sender_avatar: senderInfo.rows[0].avatar,
                    tempId
                };

                // Emit to all users in the conversation
                io.to(`conversation:${conversationId}`).emit('new-message', message);

                // Also emit to conversation list for other participants
                const participants = await pool.query(
                    'SELECT user_id FROM conversation_participants WHERE conversation_id = $1',
                    [conversationId]
                );

                participants.rows.forEach(p => {
                    io.to(`user:${p.user_id}`).emit('conversation-updated', {
                        conversationId,
                        lastMessage: content,
                        lastMessageTime: message.created_at,
                        lastMessageSenderId: socket.userId
                    });
                });

            } catch (error) {
                console.error('Send message error:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        // Typing indicator
        socket.on('typing', (data) => {
            const { conversationId, userName } = data;
            socket.to(`conversation:${conversationId}`).emit('user-typing', {
                conversationId,
                userId: socket.userId,
                userName
            });
        });

        // Stop typing indicator
        socket.on('stop-typing', (data) => {
            const { conversationId } = data;
            socket.to(`conversation:${conversationId}`).emit('user-stopped-typing', {
                conversationId,
                userId: socket.userId
            });
        });

        // Mark message as read
        socket.on('mark-as-read', async (data) => {
            try {
                const { messageId, conversationId } = data;

                await pool.query(
                    'UPDATE messages SET read_status = true WHERE id = $1',
                    [messageId]
                );

                // Notify sender that message was read
                const message = await pool.query(
                    'SELECT sender_id FROM messages WHERE id = $1',
                    [messageId]
                );

                if (message.rows.length > 0) {
                    io.to(`user:${message.rows[0].sender_id}`).emit('message-read', {
                        messageId,
                        conversationId,
                        readBy: socket.userId
                    });
                }
            } catch (error) {
                console.error('Mark as read error:', error);
            }
        });

        // Handle disconnect
        socket.on('disconnect', async () => {
            console.log(`❌ User disconnected: ${socket.userId}`);

            try {
                // Update user status to offline
                await pool.query(
                    'UPDATE users SET status = $1 WHERE id = $2',
                    ['offline', socket.userId]
                );

                // Broadcast user offline status to all clients
                io.emit('user-status-change', {
                    userId: socket.userId,
                    status: 'offline'
                });
            } catch (error) {
                console.error('Error updating user status on disconnect:', error);
            }
        });
    });
};

module.exports = socketHandler;
