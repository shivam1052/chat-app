import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "PUT"],
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);

  //routes

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User Id :- ${socket.id} joined room :- ${data}`);
  });

  socket.on("send_message", (data) => {
    console.log("Send message data", data);
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("typing", (data) => {
    socket.to(data.room).emit("show_typing", data);
  });

  socket.on("stop_typing", (data) => {
    socket.to(data.room).emit("hide_typing");
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

app.use(cors());

server.listen(3000, () => console.log("Server is running on port 3000"));
