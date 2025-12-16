const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversation.controller');
const messageController = require('../controllers/message.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All routes are protected
router.use(authMiddleware);

router.get('/', conversationController.getConversations);
router.post('/', conversationController.createConversation);
router.get('/:id', conversationController.getConversation);
router.get('/:id/messages', conversationController.getMessages);
router.put('/:id/read', messageController.markConversationAsRead);

module.exports = router;
