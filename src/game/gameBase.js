/* eslint max-classes-per-file: ["error", 2] */

const { emitNames } = require("../utils/constants");
const { GameState } = require("./gameState");
const { shuffleArray, playerColors } = require("./gameUtils");

const getDefaultInGameUserData = () => ({
  connected: true,
  cumulativeTime: 0,
});

const MAX_TIME_PER_TURN = 30; // in seconds

class GameRoom {
  constructor(roomName, ioBack) {
    this.roomName = roomName;
    this.ioBack = ioBack;
    this.lobbyPlayers = {};
    this.inGamePlayers = {};

    this.playerTurns = [];
    this.currentIndexTurn = 0;
    this.currentPlayerTurn = null;

    this.turnCounter = 0;
    this.turnIntervalId = 0;

    this.gameState = null;
    this.avaliableColors = Object.values(playerColors);
    shuffleArray(this.avaliableColors);

    this.onTurnTimeTick = () => {};
  }

  addPlayerToLobby(username, socket) {
    // TODO set max players
    const color = this.avaliableColors.pop();
    this.lobbyPlayers[username] = { socket, color };
  }

  // TODO create common method
  getLobbyPlayers({ removeSerializableData = true } = {}) {
    return Object.keys(this.lobbyPlayers).map((username) => {
      const playerData = this.lobbyPlayers[username];
      if (removeSerializableData) {
        const { socket, ...currentPlayerData } = playerData;
        return { ...currentPlayerData, username };
      }
      return { ...playerData, username };
    });
  }

  getInGamePlayers({ removeSerializableData = true } = {}) {
    return Object.keys(this.inGamePlayers).map((username) => {
      const playerData = this.inGamePlayers[username];
      if (removeSerializableData) {
        const { socket, ...currentPlayerData } = playerData;
        return { ...currentPlayerData, username };
      }
      return { ...playerData, username };
    });
  }

  disconnectPlayer(username) {
    this.inGamePlayers[username].connected = false;
  }

  removePlayerFromLobby(username) {
    delete this.lobbyPlayers[username];
  }

  isRoomInGame() {
    return Object.keys(this.inGamePlayers).some(
      (username) => this.inGamePlayers[username].connected === true
    );
  }

  isGameAbandoned() {
    return (
      Object.keys(this.inGamePlayers).filter(
        (username) => this.inGamePlayers[username].connected === true
      ).length === 0
    );
  }

  startGame(n, m) {
    this.movePlayersToInGame();
    this.setNextTurn();
    this.gameState = new GameState(n, m);
  }

  setNextTurn() {
    this.currentPlayerTurn =
      this.inGamePlayers[this.playerTurns[this.currentIndexTurn]];
    this.currentIndexTurn += 1;
    if (this.currentIndexTurn === Object.keys(this.inGamePlayers).length) {
      this.currentIndexTurn = 0;
    }
  }

  movePlayersToInGame() {
    const lobbyPlayersUsernames = this.getLobbyPlayers().map(
      (player) => player.username
    );
    lobbyPlayersUsernames.forEach((username) => {
      this.inGamePlayers[username] = {
        ...this.lobbyPlayers[username],
        ...getDefaultInGameUserData(),
      };
    });
    this.lobbyPlayers = {};
    this.playerTurns = Object.keys(this.inGamePlayers);
    shuffleArray(this.playerTurns);
  }

  setOnTurnTimeTick(func) {
    this.onTurnTimeTick = func;
  }

  setTurnToPlayer() {
    this.ioBack
      .to(this.roomName)
      .emit(emitNames.PLAYER_TURN, this.getCurrentTurnPlayer());

    this.turnIntervalId = setInterval(() => {
      this.turnCounter += 1;
      this.onTurnTimeTick(this.turnCounter);
      if (this.turnCounter === MAX_TIME_PER_TURN) {
        this.currentPlayerTurn.cumulativeTime += this.turnCounter;
        this.resetTurnInterval();
        this.ioBack
          .to(this.roomName)
          .emit(emitNames.TURN_LOST, this.getCurrentTurnPlayer());
        this.setNextTurn();
        this.setTurnToPlayer();
      }
    }, 1000);
  }

  resetTurnInterval() {
    console.log("clear int");
    clearInterval(this.turnIntervalId);
    this.turnCounter = 0;
  }

  turnPlayed(columnIndex, turnPlayedCallback) {
    // const socket = this.currentPlayerTurn.socket;
    const data = { j: columnIndex, color: this.currentPlayerTurn.color };
    if (this.gameState.isColumnFull(columnIndex)) {
      this.currentPlayerTurn.socket.emit(emitNames.INVALID_PLAY, {
        errorMessage: "This column is full",
      });
    } else {
      const newPieceData = this.gameState.addPiece(data);
      this.currentPlayerTurn.cumulativeTime += this.turnCounter;
      const playerWon = this.gameState.checkIfPlayerWon(
        this.currentPlayerTurn.color,
        newPieceData
      );
      if (playerWon) {
        this.ioBack.to(this.roomName).emit(emitNames.PLAYER_WON, {
          state: this.gameState.getSerializableState(),
        });
      } else {
        turnPlayedCallback({ timeConsumed: this.turnCounter });
        this.resetTurnInterval();
        this.setNextTurn();
        this.ioBack.to(this.roomName).emit(emitNames.UPDATE_GAME, {
          state: this.gameState.getSerializableState(),
          players: this.getInGamePlayers(),
        });
        this.setTurnToPlayer();
      }
    }
  }

  getCurrentTurnPlayer() {
    const playerData = this.currentPlayerTurn;
    const { socket, ...currentPlayerData } = playerData;
    const username = this.playerTurns[this.currentIndexTurn];
    return { ...currentPlayerData, username };
  }
}

class GamesManager {
  constructor(ioBack) {
    this.gameRooms = new Map();
    this.ioBack = ioBack;
  }

  getOrCreateGameRoom(roomName) {
    return (
      this.gameRooms.get(roomName) ||
      this.gameRooms.set(roomName, new GameRoom(roomName, this.ioBack)).get(roomName)
    );
  }

  getGameRoom(roomName) {
    return this.gameRooms.get(roomName);
  }

  /* 

  addPlayer and removePlayer must be invoked from gameManager
  because they manage creation and deletion of game rooms
  
  */

  addPlayerToLobby(username, roomName, socket) {
    const gameRoom = this.getOrCreateGameRoom(roomName);
    gameRoom.addPlayerToLobby(username, socket);
  }

  removePlayerFromLobby(username, roomName) {
    const gameRoom = this.gameRooms.get(roomName);
    gameRoom.removePlayerFromLobby(username);
    if (Object.keys(gameRoom.lobbyPlayers).length === 0) {
      this.gameRooms.delete(roomName);
    }
  }

  shouldDestroyGameRoom(roomName) {
    const gameRoom = this.gameRooms.get(roomName);
    if (gameRoom.isGameAbandoned()) {
      clearInterval(gameRoom.turnIntervalId);
      this.gameRooms.delete(roomName);
    }
  }
}

module.exports = {
  GamesManager,
};
