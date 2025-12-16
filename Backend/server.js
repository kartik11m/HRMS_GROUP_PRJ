import http from "http"; // server configuration
import app from "./app.js";
import "./db/db.js";
import { Server } from "socket.io";
import socketHandler from "./socket/socket.js";

const port = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Frontend URL
        methods: ["GET", "POST"],
        credentials: true
    },
});

// Set up socket handlers
socketHandler(io);

// Make io accessible to routes if needed
app.set('io', io);

// Initialize database tables REMOVED as it is likely handled inside app.js or separate init
// But Origin had it here. app.js imports { initDb } and calls it.
// Origin server.js ALSO defined initDb below (lines 208-222) and called it.
// This seems redundant or conflicting.
// However, to be safe, I will comment it out if app.js already does it.
// app.js (Origin) calls initDb().
// So I don't need it here.

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});