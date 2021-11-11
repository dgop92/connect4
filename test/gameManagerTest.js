const { expect } = require("chai");
const { GamesManager } = require("../src/game/gameBase");
const { DEFAULT_GAME_TABLE } = require("../src/game/gameState");

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
  describe("#movePlayersToInGame", () => {
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
  describe("#disconnectPlayer", () => {
    it("should disconnect player", () => {
      const gd = new GamesManager();
      addPlayers(gd);
      const gameRoom = gd.getGameRoom("dev");
      gameRoom.movePlayersToInGame();
      gameRoom.disconnectPlayer("minijuan");

      expect(gameRoom.inGamePlayers.minijuan.connected).to.equal(false);
    });
  });
  describe("#startGame", () => {
    it("should start game and set the turns and colors", () => {
      const gd = new GamesManager();
      addPlayers(gd);
      const gameRoom = gd.getGameRoom("dev");
      gameRoom.startGame(DEFAULT_GAME_TABLE.ROWS, DEFAULT_GAME_TABLE.COLUMNS);

      console.log(gameRoom.playerTurns);

      expect(gameRoom.currentPlayerTurn.color).to.equal(
        gameRoom.inGamePlayers[gameRoom.playerTurns[0]].color
      );

      console.log(gd.getGameRoom("dev").inGamePlayers);
    });
  });
  describe("start game", () => {
    it("should start game and set the turns and colors", () => {
      const gd = new GamesManager();
      addPlayers(gd);
      const gameRoom = gd.getGameRoom("dev");
      gameRoom.startGame(DEFAULT_GAME_TABLE.ROWS, DEFAULT_GAME_TABLE.COLUMNS);

      console.log(gameRoom.playerTurns);

      expect(gameRoom.currentPlayerTurn.color).to.equal(
        gameRoom.inGamePlayers[gameRoom.playerTurns[0]].color
      );

      console.log(gd.getGameRoom("dev").inGamePlayers);
    });
  });
  describe("check getPlayers", () => {
    it("should check the existence of players in the lobby and 'in game'", () => {
      const gd = new GamesManager();
      addPlayers(gd);
      const gameRoom = gd.getGameRoom("dev");

      gameRoom.getLobbyPlayers().forEach((player) => {
        expect(player).to.have.property("color");
        expect(player).to.have.property("username");
      });

      console.log(gd.getGameRoom("dev").getLobbyPlayers());

      gameRoom.startGame(DEFAULT_GAME_TABLE.ROWS, DEFAULT_GAME_TABLE.COLUMNS);

      const usernames = [];
      gameRoom.getInGamePlayers().forEach((player) => {
        expect(player).to.have.property("color");
        expect(player).to.have.property("username");
        usernames.push(player.username);
      });
      expect(usernames).to.have.members(["juan", "pedro", "minijuan"]);

      console.log(gd.getGameRoom("dev").getInGamePlayers());
    });
  });
});
