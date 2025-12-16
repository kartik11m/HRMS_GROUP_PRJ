const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All routes are protected
router.use(authMiddleware);

router.post('/', messageController.sendMessage);
router.put('/:id/read', messageController.markAsRead);

module.exports = router;
