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

const getSocketId = (userId) => {
  const user = users.find((u) => u.user._id === userId);
  return user ? user.socketId : null;
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

  socket.on("createContact", ({ currentUser, receiver }) => {
    const receiverSocketId = getSocketId(receiver._id);
    console.log("receiverSocketId", receiverSocketId);
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit("getCreateUser", currentUser);
    }
  });

  socket.on("sendMessage", ({ newMessage, receiver, sender }) => {
    const receiverSocketId = getSocketId(receiver._id);
    console.log(receiverSocketId);

    if (receiverSocketId) {
      socket
        .to(receiverSocketId)
        .emit("getNewMessage", { newMessage, sender, receiver });
    }
  });
});
