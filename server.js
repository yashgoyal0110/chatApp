const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
var cors = require('cors');

var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 
};

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
app.use(cors(corsOptions));

let socketIds = [];  

app.get("/", (req, res) => {
  res.send("Chat Server is running");
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socketIds.push(socket.id);
  console.log("Connected users:", socketIds);

  socket.on("sendMessage", (message) => {
    console.log("Received message:", message);
    const senderIndex = socketIds.indexOf(socket.id);

      if (senderIndex === 0) {
        io.to(socketIds[1]).emit('message', message);
      } else if (senderIndex === 1) {
        io.to(socketIds[0]).emit('message', message);
      } else if (senderIndex === 2) {
        io.to(socketIds[0]).emit('message', message);
        io.to(socketIds[1]).emit('message', message);
      }
     else {
      console.log("Not all users are connected.");
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);

    socketIds = socketIds.filter(id => id !== socket.id);
    console.log("Updated connected users:", socketIds);
  });
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
