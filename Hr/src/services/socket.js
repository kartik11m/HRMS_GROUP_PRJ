import { io } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';

let socket = null;

export const initializeSocket = () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
        console.warn('No auth token found, cannot initialize socket');
        return null;
    }

    socket = io(WS_URL, {
        auth: {
            token
        },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
    });

    socket.on('connect', () => {
        console.log('✅ Socket connected');
    });

    socket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error);
    });

    socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
    });

    return socket;
};

export const getSocket = () => {
    if (!socket) {
        return initializeSocket();
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

// Socket event emitters
export const joinConversation = (conversationId) => {
    if (socket) {
        socket.emit('join-conversation', conversationId);
    }
};

export const leaveConversation = (conversationId) => {
    if (socket) {
        socket.emit('leave-conversation', conversationId);
    }
};

export const sendSocketMessage = (data) => {
    if (socket) {
        socket.emit('send-message', data);
    }
};

export const emitTyping = (conversationId, userName) => {
    if (socket) {
        socket.emit('typing', { conversationId, userName });
    }
};

export const emitStopTyping = (conversationId) => {
    if (socket) {
        socket.emit('stop-typing', { conversationId });
    }
};

export const markSocketAsRead = (messageId, conversationId) => {
    if (socket) {
        socket.emit('mark-as-read', { messageId, conversationId });
    }
};

export default {
    initializeSocket,
    getSocket,
    disconnectSocket,
    joinConversation,
    leaveConversation,
    sendSocketMessage,
    emitTyping,
    emitStopTyping,
    markSocketAsRead
};
