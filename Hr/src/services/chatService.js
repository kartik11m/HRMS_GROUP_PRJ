import api from './api';

// Authentication services
export const authService = {
    register: async (name, email, password, designation, department, phone) => {
        const response = await api.post('/auth/register', { name, email, password, designation, department, phone });
        if (response.data.success) {
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.success) {
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: async () => {
        await api.post('/auth/logout');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    }
};

// Chat services
export const chatService = {
    // Get all conversations
    getConversations: async () => {
        const response = await api.get('/conversations');
        return response.data;
    },

    // Create new conversation
    createConversation: async (participantIds, type = 'direct', name = null) => {
        const response = await api.post('/conversations', {
            participantIds,
            type,
            name
        });
        return response.data;
    },

    // Get conversation details
    getConversation: async (conversationId) => {
        const response = await api.get(`/conversations/${conversationId}`);
        return response.data;
    },

    // Get messages for a conversation
    getMessages: async (conversationId, limit = 50, offset = 0) => {
        const response = await api.get(`/conversations/${conversationId}/messages`, {
            params: { limit, offset }
        });
        return response.data;
    },

    // Send message (via REST API)
    sendMessage: async (conversationId, content) => {
        const response = await api.post('/messages', {
            conversationId,
            content
        });
        return response.data;
    },

    // Mark message as read
    markAsRead: async (messageId) => {
        const response = await api.put(`/messages/${messageId}/read`);
        return response.data;
    },

    // Mark all messages in conversation as read
    markConversationAsRead: async (conversationId) => {
        const response = await api.put(`/conversations/${conversationId}/read`);
        return response.data;
    }
};

// User services
export const userService = {
    // Search users
    searchUsers: async (query) => {
        const response = await api.get('/users/search', {
            params: { q: query }
        });
        return response.data;
    },

    // Get user profile
    getUserProfile: async (userId) => {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    },

    // Get all users
    getAllUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    }
};

export default {
    authService,
    chatService,
    userService
};
