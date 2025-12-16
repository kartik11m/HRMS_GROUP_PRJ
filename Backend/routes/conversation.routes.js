import express from 'express';
import { getConversations, createConversation, getConversation, getMessages } from '../controllers/conversation.controller.js';
import { markConversationAsRead } from '../controllers/message.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

router.get('/', getConversations);
router.post('/', createConversation);
router.get('/:id', getConversation);
router.get('/:id/messages', getMessages);
router.put('/:id/read', markConversationAsRead);

export default router;
