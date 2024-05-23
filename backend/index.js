import express from "express";
import { createServer } from "http";
import cors from 'cors';
import { Server } from "socket.io";

const port = 8080;

const app = express();
const server = createServer(app);


const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    }
});

app.get("/", (req, res) => {
    res.send("Hello world");
});

const users = {}

io.on("connection", (socket) => {
    console.log("New User Connected", socket.id);

    socket.on("join-room", (id,username) => {
        socket.join(id);
        users[socket.id] = {id,username}
        io.to(id).emit("update-users",Object.values(users).filter(user=>user.id === id))
    });

    socket.on("message", ({id, message }) => {
        if (id && message) {
            socket.to(id).emit("receive-message", message);
        } else {
            console.log('Received invalid message payload', { id, message });
        }
    });

    socket.on('disconnect', () => {
        const user = users[socket.id]
        if(user){
            const {id,username} = user
            delete users[socket.id]
            io.to(id).emit("update-users",Object.values(users).filter(user => user.id === id))
            io.emit('userDisconnected', socket.username);
        }
    });
});

server.listen(port, () => {
    console.log(`Server started at port ${port}`);
});
