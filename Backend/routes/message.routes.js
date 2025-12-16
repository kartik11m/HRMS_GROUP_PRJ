import express from 'express';
import { sendMessage, markAsRead } from '../controllers/message.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

router.post('/', sendMessage);
router.put('/:id/read', markAsRead);

export default router;
