const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const SECRET = "supersecretkey"; // change in production

// In-memory storage (replace with DB later)
let users = [];
let messages = [];

/* =========================
   🔐 AUTH ROUTES
========================= */

// REGISTER
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "All fields required" });
    }

    const exists = users.find(u => u.username === username);
    if (exists) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    users.push({
        username,
        password: hashed
    });

    res.json({ message: "User registered successfully" });
});

// LOGIN
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ username }, SECRET, { expiresIn: "1d" });

    res.json({
        token,
        username
    });
});

/* =========================
   🔌 SOCKET AUTH
========================= */

io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error("No token"));
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        socket.username = decoded.username;
        next();
    } catch (err) {
        return next(new Error("Unauthorized"));
    }
});

/* =========================
   💬 SOCKET EVENTS
========================= */

io.on("connection", (socket) => {
    console.log("User connected:", socket.username);

    // Send old messages (for persistence simulation)
    socket.emit("load messages", messages);

    // Receive new code snippet
    socket.on("chat message", (data) => {
        const msgData = {
            user: socket.username,
            title: data.title || "",
            message: data.message,
            lang: data.lang || "text",
            time: new Date().toLocaleTimeString()
        };

        // Save message
        messages.push(msgData);

        // Broadcast
        io.emit("chat message", msgData);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.username);
    });
});

/* =========================
   🚀 START SERVER
========================= */

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
