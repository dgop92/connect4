const { expect } = require("chai");
const { GamesManager } = require("../src/game/gameBase");

function addPlayers(gameManager) {
  gameManager.addPlayerToLobby("pedro", "dev");
  gameManager.addPlayerToLobby("juan", "dev");
  gameManager.addPlayerToLobby("minijuan", "dev");
  gameManager.addPlayerToLobby("willy", "go");
}

describe("GameDataManager", () => {
  describe("add room", () => {
    it("should create room when a user is added", () => {
      const gd = new GamesManager();
      gd.addPlayerToLobby("pedro", "dev");
      expect(gd.gameRooms.has("dev")).to.equal(true);
    });
  });
  describe("addUsers", () => {
    it("should add users to a specific room given", () => {
      const gd = new GamesManager();
      addPlayers(gd);
      const gameRoom = gd.getGameRoom("dev");
      expect(Object.keys(gameRoom.lobbyPlayers)).to.have.members([
        "juan",
        "pedro",
        "minijuan",
      ]);
    });
  });
  describe("remove empty room", () => {
    it("should delete a room when there is no players", () => {
      const gd = new GamesManager();
      gd.addPlayerToLobby("pedro", "dev");
      gd.removePlayerFromLobby("pedro", "dev");
      expect(gd.gameRooms.has("dev")).to.equal(false);
    });
  });
  describe("move players", () => {
    it("should move all players to inGame list", () => {
      const gd = new GamesManager();
      addPlayers(gd);
      const gameRoom = gd.getGameRoom("dev");
      gameRoom.movePlayersToInGame();

      expect(Object.keys(gameRoom.lobbyPlayers).length).to.equal(0);
      expect(Object.keys(gameRoom.inGamePlayers)).to.have.members([
        "juan",
        "pedro",
        "minijuan",
      ]);

      console.log(gd.getGameRoom("dev").inGamePlayers);
    });
  });
  describe("disconnect player", () => {
    it("should disconnect player", () => {
      const gd = new GamesManager();
      addPlayers(gd);
      const gameRoom = gd.getGameRoom("dev");
      gameRoom.movePlayersToInGame();
      gameRoom.disconnectPlayer("minijuan");

      expect(gameRoom.inGamePlayers.minijuan.connected).to.equal(false);
    });
  });
  describe("start game", () => {
    it("should start game and set the turns and colors", () => {
      const gd = new GamesManager();
      addPlayers(gd);
      const gameRoom = gd.getGameRoom("dev");
      gameRoom.startGame();

      console.log(gameRoom.playerTurns);

      expect(gameRoom.currentPlayerTurn.color).to.equal(
        gameRoom.inGamePlayers[gameRoom.playerTurns[0]].color
      );

      console.log(gd.getGameRoom("dev").inGamePlayers);
    });
  });
});
