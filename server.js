const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve frontend
app.use(express.static("public"));

let users = {};

// Socket connection
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (username) => {
        users[socket.id] = username;
        io.emit("message", `${username} joined the chat`);
        io.emit("userList", Object.values(users));
    });

    socket.on("chatMessage", (msg) => {
        if (users[socket.id]) {
            io.emit("message", `${users[socket.id]}: ${msg}`);
        }
    });

    socket.on("disconnect", () => {
        if (users[socket.id]) {
            io.emit("message", `${users[socket.id]} left the chat`);
            delete users[socket.id];
            io.emit("userList", Object.values(users));
        }
    });
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
