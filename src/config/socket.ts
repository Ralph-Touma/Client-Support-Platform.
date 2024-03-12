import { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer | null = null;

export const initIo = (server: any) => {
  io = new SocketIOServer(server, {
   
    cors: {
      origin: "*", 
    },
  });

  io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);
   
  });

  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized!");
  }
  return io;
};
