import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";
import dns from "dns";
import userRoute from "./routes/user.route.js";
import connectDB from "./db.js";
import Message from "./models/message.models.js";
import messageRoute from "./routes/message.route.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();
const PORT = process.env.PORT || 3000;
connectDB();

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

  socket.on("send_message", async (data) => {
    console.log("Send message data", data);

    const newMessage = new Message({
      room: data.room,
      author: data.author,
      message: data.message,
      time: data.time,
    });

    await newMessage.save();
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
app.use(express.json());
app.use("/user", userRoute);
app.use("/messages", messageRoute);

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
