const express = require("express");
const http = require("http");
const {Server} = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

const PORT = process.env.PORT || 3000;

const rooms = new Map();

io.on("connection", (socket) => {
  console.log("New client connected");

  // Find an available room or create a new one
  let joinedRoom = null;
  for (const [roomId, players] of rooms.entries()) {
    if (players.length === 1) {
      joinedRoom = roomId;
      players.push(socket.id);
      break;
    }
  }
  if (!joinedRoom) {
    joinedRoom = `room-${rooms.size + 1}`;
    rooms.set(joinedRoom, [socket.id]);
  }
  socket.join(joinedRoom);
  // console.log(joinedRoom);

  // Emit the joinedRoom event to the client
  console.log(`Client ${socket.id} joined room ${joinedRoom}`);
  socket.emit("joinedRoom", {room: joinedRoom, players: rooms.get(joinedRoom)});

  const players = rooms.get(joinedRoom);
  if (players.length === 2) {
    io.to(joinedRoom).emit("start");
  }

  socket.on("move", (data) => {
    socket.to(joinedRoom).emit("move", data);
  });

  socket.on("gameOver", (data) => {
    socket.to(joinedRoom).emit("gameOver", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    const players = rooms.get(joinedRoom);
    players.splice(players.indexOf(socket.id), 1);
    if (players.length === 0) {
      rooms.delete(joinedRoom);
    }
  });
});

// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const Controller = require("./controllers/controller");

app.post("/register", Controller.register);
app.post("/login", Controller.login);


server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));