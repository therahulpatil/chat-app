<!DOCTYPE html>
<html>
<head>
    <title>Chat App</title>
    <style>
        body {
            font-family: Arial;
            background: #0f172a;
            color: white;
            margin: 0;
        }

        .container {
            max-width: 500px;
            margin: auto;
            padding: 20px;
        }

        input, button {
            width: 100%;
            padding: 10px;
            margin: 5px 0;
            border-radius: 8px;
            border: none;
        }

        button {
            background: #3b82f6;
            color: white;
            cursor: pointer;
        }

        #chat {
            display: none;
        }

        #messages {
            height: 300px;
            overflow-y: scroll;
            background: #1e293b;
            padding: 10px;
            border-radius: 10px;
        }

        .msg {
            margin: 5px 0;
        }

        .me {
            color: #22c55e;
        }

        .other {
            color: #60a5fa;
        }
    </style>
</head>
<body>

<div class="container">

    <!-- LOGIN -->
    <div id="auth">
        <h2>Login / Register</h2>
        <input id="username" placeholder="Username">
        <input id="password" type="password" placeholder="Password">
        <button onclick="register()">Register</button>
        <button onclick="login()">Login</button>
    </div>

    <!-- CHAT -->
    <div id="chat">
        <h2>Chat Room</h2>
        <div id="messages"></div>
        <input id="msg" placeholder="Type message...">
        <button onclick="send()">Send</button>
    </div>

</div>

<script src="/socket.io/socket.io.js"></script>
<script>
let socket;
let token;
let username;

async function register() {
    await fetch("/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            username: usernameInput.value,
            password: passwordInput.value
        })
    });
    alert("Registered!");
}

async function login() {
    const res = await fetch("/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            username: usernameInput.value,
            password: passwordInput.value
        })
    });

    const data = await res.json();

    token = data.token;
    username = data.username;

    startChat();
}

function startChat() {
    document.getElementById("auth").style.display = "none";
    document.getElementById("chat").style.display = "block";

    socket = io({
        auth: { token }
    });

    socket.on("chat message", (data) => {
        const div = document.createElement("div");
        div.classList.add("msg");

        if (data.user === username) {
            div.classList.add("me");
        } else {
            div.classList.add("other");
        }

        div.textContent = data.user + ": " + data.message;
        messages.appendChild(div);
    });
}

function send() {
    socket.emit("chat message", msg.value);
    msg.value = "";
}

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const msg = document.getElementById("msg");
const messages = document.getElementById("messages");
</script>

</body>
</html>
