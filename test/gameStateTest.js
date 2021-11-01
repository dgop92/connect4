const { expect } = require("chai");
const { GameState, GAME_TABLE } = require("../src/game/gameState");

describe("GameState", () => {
  describe("#addPiece", () => {
    it("should add piece to the bottom", () => {
      const gs = new GameState();
      const { i: iPos, j: jPos } = gs.addPiece({ j: 0, color: "red" });
      expect(iPos).to.equal(GAME_TABLE.ROWS - 1);
      expect(jPos).to.equal(0);
      expect(gs.state[GAME_TABLE.ROWS - 1][0].color).to.equal("red");
    });
  });
  describe("add piece over piece", () => {
    it("should add piece over piece", () => {
      const gs = new GameState();
      gs.addPiece({ j: 0, color: "red" });
      gs.addPiece({ j: 0, color: "blue" });
      gs.addPiece({ j: 0, color: "red" });
      expect(gs.state[GAME_TABLE.ROWS - 3][0].color).to.equal("red");
    });
  });
  describe("#isColumnFull", () => {
    it("should return true if column is full", () => {
      const gs = new GameState();
      for (let i = 0; i < GAME_TABLE.ROWS; i += 1) {
        gs.addPiece({ j: 0, color: "red" });
      }
      expect(gs.isColumnFull(0)).to.equal(true);
      expect(gs.isColumnFull(1)).to.equal(false);
    });
  });
});
