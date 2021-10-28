const expect = require("chai").expect;
const { GamesManager } = require("../game/gameBase");

describe("GameDataManager", function () {
  describe("add room", function () {
    it("should create room when a user is added", function () {
      const gd = new GamesManager();
      gd.addPlayer("pedro", "dev");
      expect(gd.gameRooms.has("dev")).to.equal(true);
    });
  });
  describe("addUsers", function () {
    it("should add users to a specific room given", function () {
      const gd = new GamesManager();
      gd.addPlayer("pedro", "dev");
      gd.addPlayer("juan", "dev");
      gd.addPlayer("minijuan", "guwl");
      expect(gd.getGameRoom("dev").lobbyPlayers).to.deep.equal([
        { username: "pedro" },
        { username: "juan" },
      ]);
    });
  });
  describe("remove empty room", function () {
    it("should delete a room when there is no players", function () {
      const gd = new GamesManager();
      gd.addPlayer("pedro", "dev");
      gd.removePlayerInLobby("pedro", "dev");
      expect(gd.gameRooms.has("dev")).to.equal(false);
    });
  });
  describe("move players", function () {
    it("should move all players to inGame list", function () {
      const gd = new GamesManager();
      gd.addPlayer("pedro", "dev");
      gd.addPlayer("minijuan", "dev");
      gd.addPlayer("cam", "dev");
      gd.getGameRoom("dev").movePlayersToInGame();
      expect(gd.getGameRoom("dev").lobbyPlayers.length).to.equal(0);
      expect(
        gd.getGameRoom("dev").inGamePlayers.map((p) => p.username)
      ).to.have.members(["pedro", "minijuan", "cam"]);
    });
  });
  describe("disconnect player", function () {
    it("should disconnect player", function () {
      const gd = new GamesManager();
      gd.addPlayer("pedro", "dev");
      gd.addPlayer("minijuan", "dev");
      gd.addPlayer("cam", "dev");
      gd.getGameRoom("dev").movePlayersToInGame("minijuan");
      gd.getGameRoom("dev").disconnectPlayer("minijuan");
      expect(
        gd.getGameRoom("dev").findPlayerByUsername("minijuan").connected
      ).to.equal(false);
    });
  });
  describe("start game", function () {
    it("should start game and set the turns and colors", function () {
      const gd = new GamesManager();
      gd.addPlayer("pedro", "dev");
      gd.addPlayer("minijuan", "dev");
      gd.addPlayer("cam", "dev");
      gd.getGameRoom("dev").startGame();
      expect(gd.getGameRoom("dev").currentTurn).to.equal(
        gd.getGameRoom("dev").inGamePlayers[0].username
      );

      console.log(gd.getGameRoom("dev").inGamePlayers);
    });
  });
});
