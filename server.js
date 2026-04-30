const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(express.static("public"));

const SECRET = "secretkey";

let users = [];

// REGISTER
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Enter username & password" });
    }

    const hashed = await bcrypt.hash(password, 10);
    users.push({ username, password: hashed });

    res.json({ message: "Registered successfully" });
});

// LOGIN
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) return res.status(400).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ username }, SECRET);

    res.json({ token, username });
});

// SOCKET AUTH
io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) return next(new Error("No token"));

    try {
        const decoded = jwt.verify(token, SECRET);
        socket.username = decoded.username;
        next();
    } catch {
        next(new Error("Invalid token"));
    }
});

// SOCKET
io.on("connection", (socket) => {
    console.log("Connected:", socket.username);

    socket.on("chat message", (msg) => {
        io.emit("chat message", {
            user: socket.username,
            message: msg
        });
    });
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
