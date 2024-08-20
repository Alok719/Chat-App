import { Server } from "socket.io";
import http from "http";
import express from "express";
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {}; //{userId:socketId}
export const getReceiverSocketId = (receiverId) => {
  const socketId = userSocketMap[receiverId];
  // console.log("socketId:", socketId);
  // console.log("recieverID:", receiverId);
  // console.log(`Fetching socket ID for ${receiverId}: ${socketId}`);
  return socketId;
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  // console.log("User connected with userId:", userId);
  if (userId != "undefined") {
    userSocketMap[userId] = socket.id;
    // console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
    // console.log(`a user connected :`, socket.id);
  }

  //
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  // console.log("Online users:", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    // console.log(`the user disconnected :`, socket.id);

    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
