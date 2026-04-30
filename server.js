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

// temporary user store
let users = [];

// REGISTER
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);
    users.push({ username, password: hashed });

    res.json({ message: "User registered" });
});

// LOGIN
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) return res.status(400).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ username }, SECRET);

    res.json({ token, username });
});

// SOCKET AUTH
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    try {
        const user = jwt.verify(token, SECRET);
        socket.username = user.username;
        next();
    } catch {
        next(new Error("Unauthorized"));
    }
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.username);

    socket.on("chat message", (msg) => {
        io.emit("chat message", {
            user: socket.username,
            message: msg
        });
    });
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
