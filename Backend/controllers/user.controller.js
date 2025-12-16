const pool = require('../config/database');

// @desc    Search users
// @route   GET /api/users/search?q=query
// @access  Private
exports.searchUsers = async (req, res) => {
    try {
        const { q } = req.query;
        const currentUserId = req.user.id;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Please provide search query'
            });
        }

        // Search users by name or email (excluding current user)
        const result = await pool.query(
            `SELECT id, name, email, avatar, status
       FROM users
       WHERE (LOWER(name) LIKE LOWER($1) OR LOWER(email) LIKE LOWER($1))
       AND id != $2
       LIMIT 10`,
            [`%${q}%`, currentUserId]
        );

        res.json({
            success: true,
            users: result.rows
        });
    } catch (error) {
        console.error('Search users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error searching users'
        });
    }
};

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Private
exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;

        const result = await pool.query(
            'SELECT id, name, email, avatar, status, created_at FROM users WHERE id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching user profile'
        });
    }
};

// @desc    Get all users (for contact list)
// @route   GET /api/users
// @access  Private
exports.getAllUsers = async (req, res) => {
    try {
        const currentUserId = req.user.id;

        const result = await pool.query(
            'SELECT id, name, email, avatar, status FROM users WHERE id != $1 ORDER BY name',
            [currentUserId]
        );

        res.json({
            success: true,
            users: result.rows
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching users'
        });
    }
};
