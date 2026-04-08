import { Server } from "socket.io";

const io = new Server(5000, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let users = [];

const addOnlineUsers = (user, socketId) => {
  const checkUser = users.find((u) => u.user._id === user._id);

  if (!checkUser) {
    users.push({ user, socketId });
  }
};

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("addOnlineUsers", (user) => {
    addOnlineUsers(user, socket.id);
    io.emit("getOnlineUsers", users);
  });

  socket.on("disconnect", () => {
    console.log("User disconnect", socket.id);
    users = users.filter((u) => u.socketId !== socket.id);
    io.emit(`getOnlineUsers`, users);
  });
});
