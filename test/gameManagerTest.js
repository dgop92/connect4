const expect = require("chai").expect;
const { GamesManager } = require("../game/gameBase");

function addPlayers(gameManager) {
  gameManager.addPlayerToLobby("pedro", "dev");
  gameManager.addPlayerToLobby("juan", "dev");
  gameManager.addPlayerToLobby("minijuan", "dev");
  gameManager.addPlayerToLobby("willy", "go");
}

describe("GameDataManager", function () {
  describe("add room", function () {
    it("should create room when a user is added", function () {
      const gd = new GamesManager();
      gd.addPlayerToLobby("pedro", "dev");
      expect(gd.gameRooms.has("dev")).to.equal(true);
    });
  });
  describe("addUsers", function () {
    it("should add users to a specific room given", function () {
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
  describe("remove empty room", function () {
    it("should delete a room when there is no players", function () {
      const gd = new GamesManager();
      gd.addPlayerToLobby("pedro", "dev");
      gd.removePlayerFromLobby("pedro", "dev");
      expect(gd.gameRooms.has("dev")).to.equal(false);
    });
  });
  describe("move players", function () {
    it("should move all players to inGame list", function () {
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
  describe("disconnect player", function () {
    it("should disconnect player", function () {
      const gd = new GamesManager();
      addPlayers(gd);
      const gameRoom = gd.getGameRoom("dev");
      gameRoom.movePlayersToInGame();
      gameRoom.disconnectPlayer("minijuan");

      expect(gameRoom.inGamePlayers["minijuan"].connected).to.equal(false);
    });
  });
  describe("start game", function () {
    it("should start game and set the turns and colors", function () {
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
