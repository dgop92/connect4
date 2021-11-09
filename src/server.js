/* eslint-disable no-param-reassign */
const { createServer } = require("http");
const { Server } = require("socket.io");
const { GamesManager } = require("./game/gameBase");
const { getGameTableFromRawData } = require("./game/gameValidators");
const { emitNames, listenerNames, MAX_PLAYERS_PER_GAME } = require("./utils/constants");

const wsHttpServer = createServer();
const io = new Server(wsHttpServer, {
  cors: {
    origin: process.env.CLIENT_URLS.split(","),
    methods: ["GET", "POST"],
  },
});

const gamesManager = new GamesManager();

io.on("connection", (socket) => {
  const { username, roomName, n, m } = socket.handshake.query;
  const [nRows, nColumns] = getGameTableFromRawData(n, m);
  socket.data.username = username;
  socket.join(roomName);
  gamesManager.addPlayerToLobby(username, roomName, socket);

  const roomClients = io.sockets.adapter.rooms.get(roomName).size;
  const roomGame = gamesManager.getGameRoom(roomName);

  io.to(roomName).emit(emitNames.JOIN_LOBBY, {
    players: roomGame.getLobbyPlayers(),
    nClients: roomClients,
  });

  socket.on("disconnect", () => {
    if (roomGame.isRoomInGame()) {
      roomGame.disconnectPlayer(username);
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
  if (roomClients >= MAX_PLAYERS_PER_GAME) {
    roomGame.startGame(nRows, nColumns);
    io.to(roomName).emit(emitNames.GAME_STARTED);
    io.to(roomName).emit(emitNames.UPDATE_GAME, {
      state: roomGame.gameState.getSerializableState(),
    });
    roomGame.setTurnToPlayer();
  }

  socket.on(listenerNames.PLAYER_MOVEMENT, ({ columnIndex }, turnPlayedCallback) => {
    // improvement ?¿
    console.log(username);
    console.log(roomGame.currentPlayerTurn.socket.handshake.query.username);
    if (username === roomGame.currentPlayerTurn.socket.handshake.query.username) {
      console.log(`played by  ${username}`);
      roomGame.turnPlayed(columnIndex, turnPlayedCallback, io);
    }
  });
});

module.exports = {
  wsHttpServer,
};
