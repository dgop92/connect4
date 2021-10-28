const { shuffleArray, getRandomColors } = require("./gameUtils");

const getDefaultInGameUserData = (username, color) => ({
  username: username,
  connected: true,
  color: color,
});

class GameRoom {
  constructor() {
    this.lobbyPlayers = [];
    this.inGamePlayers = [];
    this.currentTurn = null;
  }

  addPlayer(username) {
    this.lobbyPlayers.push({ username: username });
  }

  findPlayerByUsername(username) {
    return this.inGamePlayers.find((player) => player.username === username);
  }

  disconnectPlayer(username) {
    this.findPlayerByUsername(username).connected = false;
  }

  removePlayer(username) {
    this.lobbyPlayers = this.lobbyPlayers.filter(
      (playerData) => playerData.username != username
    );
  }

  isRoomEmpty() {
    const playersInLobby = this.lobbyPlayers.length > 0;
    const playersAllConected = this.inGamePlayers.every(
      (player) => player.connected === false
    );
    return !playersAllConected && !playersInLobby;
  }

  isRoomInGame() {
    return this.inGamePlayers.some((player) => player.connected === true);
  }

  isGameAbandoned() {
    return (
      this.inGamePlayers.filter((player) => player.connected === true)
        .length === 1
    );
  }

  startGame() {
    this.movePlayersToInGame();
    this.currentTurn = this.inGamePlayers[0].username;
  }

  movePlayersToInGame() {
    const colors = getRandomColors();
    this.inGamePlayers = this.lobbyPlayers.map((playerData, index) =>
      getDefaultInGameUserData(playerData.username, colors[index])
    );
    this.lobbyPlayers = [];
    shuffleArray(this.inGamePlayers);
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

  addPlayer(username, roomName) {
    const gameRoom = this.getOrCreateGameRoom(roomName);
    gameRoom.addPlayer(username);
  }

  removePlayerInLobby(username, roomName) {
    const gameRoom = this.gameRooms.get(roomName);
    gameRoom.removePlayer(username);
    if (gameRoom.lobbyPlayers.length === 0) {
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
