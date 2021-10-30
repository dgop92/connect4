const { emitNames, listenerNames } = require("./utils/constants");
const { GamesManager } = require("./game/gameBase");

const MAX_PLAYERS = 2;

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
  gamesManager.addPlayerToLobby(username, roomName, socket);

  const roomClients = io.sockets.adapter.rooms.get(roomName).size;
  const roomGame = gamesManager.getGameRoom(roomName);
  console.log(roomGame.lobbyPlayers);
  console.log(roomGame.inGamePlayers);

  io.to(roomName).emit(emitNames.JOIN_LOBBY, {
    players: roomGame.getLobbyPlayers(),
    nClients: roomClients,
  });

  socket.on("disconnect", () => {
    if (roomGame.isRoomInGame()) {
      roomGame.disconnectPlayer(username);
      console.log(gamesManager.gameRooms.keys())
      gamesManager.shouldDestroyGameRoom(roomName);
    } else {
      socket.to(roomName).emit(emitNames.LEAVE_LOBBY, {
        players: roomGame.getLobbyPlayers(),
        nClients: roomClients,
      });
      gamesManager.removePlayerFromLobby(username, roomName);
    }
  });

  // Automatic game start
  if (roomClients >= MAX_PLAYERS) {
    console.log("Just one ?¡");
    roomGame.startGame();
    io.to(roomName).emit(emitNames.GAME_STARTED);
    roomGame.setTurnToPlayer();
    console.log(roomGame.lobbyPlayers);
    console.log(roomGame.inGamePlayers);
  }

  socket.on(
    listenerNames.PLAYER_MOVEMENT,
    ({ columnIndex: columnIndex }, turnPlayedCallback) => {
      // improvement ?¿
      console.log("se llamo el play")
      console.log(username)
      console.log(roomGame.currentPlayerTurn.socket.handshake.query.username)
      if (username === roomGame.currentPlayerTurn.socket.handshake.query.username) {
        console.log("played by  " + username);
        roomGame.turnPlayed(columnIndex, turnPlayedCallback);
      }
    }
  );
});

/* const gameSpaces = io.of(/^\/game-\w+$/);

gameSpaces.on("connection", (socket) => {
  const gameSpace = socket.nsp;

  console.log(gameSpace.name);
  console.log(gameSpace.sockets.size);
});

console.log("Server running"); */
