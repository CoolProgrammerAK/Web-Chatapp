const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
let users = [];
const adduser = (nuser, id) => {
  !users.some((user) => id === user.id) && users.push({ ...nuser, id });
};

const removeuser = (id) => {
  users = users.filter((user) => user.id !== id);
};

const getOnlineusers = () => {
  return users;
};

io.on("connection", (socket) => {
  socket.on("new_user", (user) => {
    
    socket.emit("server_message", {
      name: "TimeChat",
      message: "Welcome to TimeChat !",
    });
    socket.broadcast.emit("server_message", {
      name: "TimeChat",
      message: `${user.name} just joined the chat`,
    });
    socket.user = user;
    adduser(socket.user, socket.id);
    io.emit("users", getOnlineusers());
  });
  socket.on("message", (message) => {
    message.name = socket.user.name;
    socket.broadcast.emit("message", message);
  });

  socket.on("typing", () => {
    const name = socket.user.name;
    socket.broadcast.emit("typing", `${name} is typing`);
  });

  socket.on("stopped_typing", () => {
    socket.broadcast.emit("stopped_typing");
  });
  socket.on("disconnect", () => {
    const { user } = socket;
    if (user) {
      socket.broadcast.emit("server_message", {
        name: "TimeChat",
        message: `${user.name} just left the chat`,
      });
    }
    removeuser(socket.id);
    io.emit("users", getOnlineusers());
  });
});

server.listen(7000, () => {
  console.log("listening on *:3000");
});
