const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = require('./app');
const socketHandler = require('./socket/socket');

const port = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Set up socket handlers
socketHandler(io);

// Make io accessible to routes if needed
app.set('io', io);

server.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
    console.log(`📡 WebSocket server is ready`);
    console.log(`🌐 API: http://localhost:${port}`);
});