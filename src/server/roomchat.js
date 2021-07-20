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


io.on("connection", (socket) => {
  socket.on("join_room", (room) => {
    socket.join(room);
  });
  socket.on("message", ({ room, message }) => {
    socket.to(room).emit('message',{
        message,name:'friend'
    });
  });

  socket.on("typing", ({ room}) => {
    socket.to(room).emit('typing',"Someone is typing");
  });

  socket.on("stopped_typing", ({ room}) => {
    socket.to(room).emit('stopped_typing');
  });
});

server.listen(6000, () => {
  console.log("listening on *:3000");
});
