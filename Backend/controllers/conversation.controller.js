const pool = require('../config/database');

// @desc    Get all conversations for logged in user
// @route   GET /api/conversations
// @access  Private
exports.getConversations = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT DISTINCT ON (c.id)
        c.id,
        c.name,
        c.type,
        c.updated_at,
        u.id as other_user_id,
        u.name as other_user_name,
        u.avatar as other_user_avatar,
        u.status as other_user_status,
        m.content as last_message,
        m.created_at as last_message_time,
        m.sender_id as last_message_sender_id,
        (SELECT COUNT(*) FROM messages 
         WHERE conversation_id = c.id 
         AND sender_id != $1 
         AND read_status = false) as unread_count
      FROM conversations c
      INNER JOIN conversation_participants cp ON c.id = cp.conversation_id
      LEFT JOIN conversation_participants cp2 ON c.id = cp2.conversation_id AND cp2.user_id != $1
      LEFT JOIN users u ON cp2.user_id = u.id
      LEFT JOIN LATERAL (
        SELECT content, created_at, sender_id
        FROM messages
        WHERE conversation_id = c.id
        ORDER BY created_at DESC
        LIMIT 1
      ) m ON true
      WHERE cp.user_id = $1
      ORDER BY c.id, c.updated_at DESC`,
            [userId]
        );

        // Format the response
        const conversations = result.rows.map(row => ({
            id: row.id,
            name: row.type === 'direct' ? row.other_user_name : row.name,
            type: row.type,
            avatar: row.type === 'direct' ? row.other_user_avatar : row.name?.charAt(0),
            otherUserId: row.other_user_id,
            status: row.type === 'direct' ? row.other_user_status : 'active',
            lastMessage: row.last_message || '',
            lastMessageTime: row.last_message_time,
            lastMessageSenderId: row.last_message_sender_id,
            unreadCount: parseInt(row.unread_count) || 0,
            updatedAt: row.updated_at
        }));

        res.json({
            success: true,
            conversations
        });
    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching conversations'
        });
    }
};

// @desc    Create new conversation
// @route   POST /api/conversations
// @access  Private
exports.createConversation = async (req, res) => {
    const client = await pool.connect();

    try {
        const { participantIds, type = 'direct', name } = req.body;
        const userId = req.user.id;

        // Validation
        if (!participantIds || participantIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide participant IDs'
            });
        }

        await client.query('BEGIN');

        // Check if direct conversation already exists
        if (type === 'direct' && participantIds.length === 1) {
            const existingConv = await client.query(
                `SELECT c.id FROM conversations c
         INNER JOIN conversation_participants cp1 ON c.id = cp1.conversation_id
         INNER JOIN conversation_participants cp2 ON c.id = cp2.conversation_id
         WHERE c.type = 'direct'
         AND cp1.user_id = $1
         AND cp2.user_id = $2
         LIMIT 1`,
                [userId, participantIds[0]]
            );

            if (existingConv.rows.length > 0) {
                await client.query('COMMIT');
                return res.json({
                    success: true,
                    conversation: { id: existingConv.rows[0].id },
                    message: 'Conversation already exists'
                });
            }
        }

        // Create conversation
        const convResult = await client.query(
            'INSERT INTO conversations (name, type) VALUES ($1, $2) RETURNING id',
            [name || null, type]
        );

        const conversationId = convResult.rows[0].id;

        // Add current user as participant
        await client.query(
            'INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1, $2)',
            [conversationId, userId]
        );

        // Add other participants
        for (const participantId of participantIds) {
            await client.query(
                'INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1, $2)',
                [conversationId, participantId]
            );
        }

        await client.query('COMMIT');

        res.status(201).json({
            success: true,
            conversation: { id: conversationId }
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Create conversation error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating conversation'
        });
    } finally {
        client.release();
    }
};

// @desc    Get conversation details
// @route   GET /api/conversations/:id
// @access  Private
exports.getConversation = async (req, res) => {
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
                message: 'Not authorized to access this conversation'
            });
        }

        // Get conversation details
        const result = await pool.query(
            `SELECT c.*, 
        json_agg(json_build_object(
          'id', u.id,
          'name', u.name,
          'avatar', u.avatar,
          'status', u.status
        )) as participants
      FROM conversations c
      INNER JOIN conversation_participants cp ON c.id = cp.conversation_id
      INNER JOIN users u ON cp.user_id = u.id
      WHERE c.id = $1
      GROUP BY c.id`,
            [conversationId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found'
            });
        }

        res.json({
            success: true,
            conversation: result.rows[0]
        });
    } catch (error) {
        console.error('Get conversation error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching conversation'
        });
    }
};

// @desc    Get messages for a conversation
// @route   GET /api/conversations/:id/messages
// @access  Private
exports.getMessages = async (req, res) => {
    try {
        const conversationId = req.params.id;
        const userId = req.user.id;
        const { limit = 50, offset = 0 } = req.query;

        // Check if user is participant
        const participant = await pool.query(
            'SELECT * FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2',
            [conversationId, userId]
        );

        if (participant.rows.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this conversation'
            });
        }

        // Get messages
        const result = await pool.query(
            `SELECT m.*, 
        u.name as sender_name,
        u.avatar as sender_avatar
      FROM messages m
      INNER JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = $1
      ORDER BY m.created_at DESC
      LIMIT $2 OFFSET $3`,
            [conversationId, limit, offset]
        );

        res.json({
            success: true,
            messages: result.rows.reverse() // Reverse to show oldest first
        });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching messages'
        });
    }
};
