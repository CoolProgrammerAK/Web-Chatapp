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
let users2 = [];
const adduser = (nuser, id) => {
  !users.some((user) => nuser.ip === user.ip) && users.push({ ...nuser, id });
};

const addonlineuser = (nuser, id) => {
  !users2.some((user) => id === user.id) && users2.push({ ...nuser, id });
};

const removeuser = (id) => {
  users = users.filter((user) => user.id !== id);
  users2 = users2.filter((user) => user.id !== id);
};

const getvisitors = () => {
  return users;
};

const getusers = () => {
  return users2;
};
io.of("/live").on("connection", (socket) => {
  socket.on("new_visiter", (user) => {
    socket.user = user;
    adduser(socket.user, socket.id);
    io.of("live").emit("visitors", getvisitors());
  });
  socket.on("disconnect", () => {
    removeuser(socket.id);
    io.of("/live").emit("visitors", getvisitors());
  });
});

// io.of("/rooms").on("connection", (socket) => {
//   socket.on("join_room", (room) => {
//     socket.join(room);
//   });
//   socket.on("message", ({ room, message }) => {
//     socket.to(room).emit("message", {
//       message,
//       name: "friend",
//     });
//   });

//   socket.on("typing", ({ room }) => {
//     socket.to(room).emit("typing", "Someone is typing");
//   });

//   socket.on("stopped_typing", ({ room }) => {
//     socket.to(room).emit("stopped_typing");
//   });
// });

io.of("/public").on("connection", (socket) => {
  socket.on("join_room", (room) => {
    socket.join(room);
  });

  socket.on("new_user", (user) => {
    socket.emit("server_message", {
      name: "TimeChat",
      message:
        user.room !== "public"
          ? "Welcome to " + user.room + " room of TimeChat"
          : "Welcome to TimeChat !",
    });
    socket.broadcast.to(user.room).emit("server_message", {
      name: "TimeChat",
      message:
        user.room !== "public"
          ? `${user.name} just joined this room`
          : `${user.name} just joined the chat`,
    });
    socket.user = user;
    addonlineuser(socket.user, socket.id);
    io.of("/public").emit("users", getusers());
  });
  socket.on("message", ({message,room,name}) => {
    socket.broadcast.to(room).emit("message", {
      name:name,
      message:
       message
    });
  });

  socket.on("typing", (room) => {
    const name = socket.user?.name;
    socket.broadcast.to(room).emit("typing", `${name} is typing`);
  });

  socket.on("stopped_typing", (room) => {
    socket.broadcast.to(room).emit("stopped_typing");
  });
  socket.on("disconnect", () => {
    const { user } = socket;
    if (user) {
      socket.broadcast.to(user.room).emit("server_message", {
        name: "TimeChat",
        message: `${user.name} just left the chat`,
      });
    }
    removeuser(socket.id);
    
    io.of("/public").emit("users", getusers());
  });
});

server.listen(5000, () => {
  console.log("listening on *:3000");
});
