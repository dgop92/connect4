const { shuffleArray, getRandomColors } = require("./gameUtils");

const getDefaultInGameUserData = (color) => ({
  connected: true,
  color: color,
});

class GameRoom {
  constructor() {
    this.lobbyPlayers = {};
    this.inGamePlayers = {};
    this.playerTurns = [];
    this.currentPlayerTurn = null;
  }

  addPlayerToLobby(username, socket) {
    this.lobbyPlayers[username] = { socket: socket };
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
      ).length === 1
    );
  }

  startGame() {
    this.movePlayersToInGame();
    this.currentPlayerTurn = this.inGamePlayers[this.playerTurns[0]];
  }

  movePlayersToInGame() {
    const colors = getRandomColors();
    let index = 0;
    for (let username of Object.keys(this.lobbyPlayers)) {
      this.inGamePlayers[username] = {
        ...this.lobbyPlayers[username],
        ...getDefaultInGameUserData(colors[index]),
      };
      index++;
    }
    this.lobbyPlayers = {};
    this.playerTurns = Object.keys(this.inGamePlayers);
    shuffleArray(this.playerTurns);
  }
}

class GamesManager {
  constructor() {
    this.gameRooms = new Map();
  }

  getOrCreateGameRoom(roomName) {
    return (
      this.gameRooms.get(roomName) ||
      this.gameRooms.set(roomName, new GameRoom()).get(roomName)
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
    if (this.gameRooms.get(roomName).isGameAbandoned()) {
      this.gameRooms.delete(roomName);
    }
  }
}

module.exports = {
  GamesManager,
};
