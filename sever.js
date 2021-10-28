const { emitNames } = require("./constants");
const { GamesManager } = require("./gameBase");

const io = require("socket.io")(8080, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"],
  },
});

const gamesManager = new GamesManager();

io.on("connection", (socket) => {
  const { username, roomName } = socket.handshake.query;

  socket.join(roomName);
  gamesManager.addPlayer(username, roomName);

  const roomClients = io.sockets.adapter.rooms.get(roomName).size;
  const roomGame = gamesManager.getGameRoom(roomName);
  console.log(roomGame.lobbyPlayers);
  console.log(roomGame.inGamePlayers);

  io.to(roomName).emit(emitNames.JOIN_LOBBY, {
    user: username,
    nClients: roomClients,
  });

  socket.on("disconnect", () => {
    if (roomGame.isRoomInGame()) {
      roomGame.disconnectPlayer(username);
      gamesManager.shouldDestroyGameRoom(roomName);
    } else {
      socket.to(roomName).emit(emitNames.LEAVE_LOBBY, {
        user: username,
        nClients: roomClients,
      });
      gamesManager.removePlayerInLobby(username, roomName);
    }
  });

  // Automatic game start
  if (roomClients >= 3) {
    console.log("Just one ?¡");
    roomGame.startGame();
    io.to(roomName).emit(emitNames.GAME_STARTED, {
      roomName: roomName,
      inGamePlayers: roomGame.inGamePlayers,
    });
    console.log(roomGame.lobbyPlayers);
    console.log(roomGame.inGamePlayers);
  }
});

/* const gameSpaces = io.of(/^\/game-\w+$/);

gameSpaces.on("connection", (socket) => {
  const gameSpace = socket.nsp;

  console.log(gameSpace.name);
  console.log(gameSpace.sockets.size);
});

console.log("Server running"); */
