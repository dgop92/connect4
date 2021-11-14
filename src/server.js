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

const gamesManager = new GamesManager(io);

io.on("connection", (socket) => {
  const { username, roomName, n, m } = socket.handshake.query;
  const earlyRoomClients = io.sockets.adapter.rooms.get(roomName)?.size || 0;

  if (earlyRoomClients === MAX_PLAYERS_PER_GAME) {
    // so far if the lobby is full, you are disconnected TODO: improve
    socket.disconnect();
  } else {
    const [nRows, nColumns] = getGameTableFromRawData(n, m);
    socket.emit(emitNames.MOVE_TO_LOBBY);

    socket.data.username = username;
    socket.join(roomName);
    gamesManager.addPlayerToLobby(username, roomName, socket);

    const roomGame = gamesManager.getGameRoom(roomName);
    const roomClients = io.sockets.adapter.rooms.get(roomName)?.size || 0;

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

    // if there is only one player in the room, that means this socket is teh creator
    if (roomClients === 1) {
      socket.on(listenerNames.REQUEST_START_GAME, () => {
        const currentRoomClients = io.sockets.adapter.rooms.get(roomName)?.size;
        if (currentRoomClients === MAX_PLAYERS_PER_GAME) {
          roomGame.startGame(nRows, nColumns);
          io.to(roomName).emit(emitNames.GAME_STARTED);
          io.to(roomName).emit(emitNames.UPDATE_GAME, {
            state: roomGame.gameState.getSerializableState(),
            players: roomGame.getInGamePlayers(),
          });
          roomGame.setTurnToPlayer();
        }
      });
    }

    roomGame.setOnTurnTimeTick((time) =>
      io.to(roomName).emit(emitNames.TURN_TICK, { time })
    );

    socket.on(listenerNames.PLAYER_MOVEMENT, ({ columnIndex }, turnPlayedCallback) => {
      // improvement ?¿
      if (
        username === roomGame.currentPlayerTurn.socket.data.username &&
        !roomGame.gameFinished
      ) {
        roomGame.turnPlayed(columnIndex, turnPlayedCallback);
      }
    });
  }
});

module.exports = {
  wsHttpServer,
};
