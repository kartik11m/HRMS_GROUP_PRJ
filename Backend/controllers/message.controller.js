const pool = require('../config/database');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
    try {
        const { conversationId, content } = req.body;
        const senderId = req.user.id;

        // Validation
        if (!conversationId || !content) {
            return res.status(400).json({
                success: false,
                message: 'Please provide conversation ID and message content'
            });
        }

        // Check if user is participant
        const participant = await pool.query(
            'SELECT * FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2',
            [conversationId, senderId]
        );

        if (participant.rows.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to send messages in this conversation'
            });
        }

        // Insert message
        const result = await pool.query(
            `INSERT INTO messages (conversation_id, sender_id, content) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
            [conversationId, senderId, content]
        );

        // Get sender info
        const senderInfo = await pool.query(
            'SELECT name, avatar FROM users WHERE id = $1',
            [senderId]
        );

        const message = {
            ...result.rows[0],
            sender_name: senderInfo.rows[0].name,
            sender_avatar: senderInfo.rows[0].avatar
        };

        res.status(201).json({
            success: true,
            message
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error sending message'
        });
    }
};

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
    try {
        const messageId = req.params.id;
        const userId = req.user.id;

        // Get message to verify conversation access
        const messageResult = await pool.query(
            'SELECT conversation_id, sender_id FROM messages WHERE id = $1',
            [messageId]
        );

        if (messageResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        const { conversation_id, sender_id } = messageResult.rows[0];

        // Don't allow marking own messages as read
        if (sender_id === userId) {
            return res.status(400).json({
                success: false,
                message: 'Cannot mark own message as read'
            });
        }

        // Check if user is participant
        const participant = await pool.query(
            'SELECT * FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2',
            [conversation_id, userId]
        );

        if (participant.rows.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        // Update message read status
        await pool.query(
            'UPDATE messages SET read_status = true WHERE id = $1',
            [messageId]
        );

        res.json({
            success: true,
            message: 'Message marked as read'
        });
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Mark all messages in conversation as read
// @route   PUT /api/conversations/:id/read
// @access  Private
exports.markConversationAsRead = async (req, res) => {
    try {
        const conversationId = req.params.id;
        const userId = req.user.id;

        // Check if user is participant
        const participant = await pool.query(
            'SELECT * FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2',
            [conversationId, userId]
        );

        if (participant.rows.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        // Update all unread messages in conversation (except own messages)
        await pool.query(
            'UPDATE messages SET read_status = true WHERE conversation_id = $1 AND sender_id != $2 AND read_status = false',
            [conversationId, userId]
        );

        // Notify the other participant (sender of the messages) that they have been read
        // We need to find who the other participant is.
        // In a direct chat, it's the other user.
        const otherParticipant = await pool.query(
            'SELECT user_id FROM conversation_participants WHERE conversation_id = $1 AND user_id != $2',
            [conversationId, userId]
        );

        if (otherParticipant.rows.length > 0) {
            const io = req.app.get('io');
            otherParticipant.rows.forEach(participant => {
                io.to(`user:${participant.user_id}`).emit('conversation-read', {
                    conversationId,
                    readBy: userId
                });
            });
        }

        res.json({
            success: true,
            message: 'All messages marked as read'
        });
    } catch (error) {
        console.error('Mark conversation as read error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
