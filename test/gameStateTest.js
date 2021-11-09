const { expect } = require("chai");
const { GameState, DEFAULT_GAME_TABLE } = require("../src/game/gameState");
const { getGameTableFromRawData } = require("../src/game/gameValidators");

describe("GameState", () => {
  describe("#addPiece", () => {
    it("should add piece to the bottom", () => {
      const gs = new GameState(DEFAULT_GAME_TABLE.ROWS, DEFAULT_GAME_TABLE.COLUMNS);
      const { i: iPos, j: jPos } = gs.addPiece({ j: 0, color: "red" });
      expect(iPos).to.equal(DEFAULT_GAME_TABLE.ROWS - 1);
      expect(jPos).to.equal(0);
      expect(gs.state[DEFAULT_GAME_TABLE.ROWS - 1][0].color).to.equal("red");
    });
  });
  describe("add piece over piece", () => {
    it("should add piece over piece", () => {
      const gs = new GameState(DEFAULT_GAME_TABLE.ROWS, DEFAULT_GAME_TABLE.COLUMNS);
      gs.addPiece({ j: 0, color: "red" });
      gs.addPiece({ j: 0, color: "blue" });
      gs.addPiece({ j: 0, color: "red" });
      expect(gs.state[DEFAULT_GAME_TABLE.ROWS - 3][0].color).to.equal("red");
    });
  });
  describe("#isColumnFull", () => {
    it("should return true if column is full", () => {
      const gs = new GameState(DEFAULT_GAME_TABLE.ROWS, DEFAULT_GAME_TABLE.COLUMNS);
      for (let i = 0; i < DEFAULT_GAME_TABLE.ROWS; i += 1) {
        gs.addPiece({ j: 0, color: "red" });
      }
      expect(gs.isColumnFull(0)).to.equal(true);
      expect(gs.isColumnFull(1)).to.equal(false);
    });
  });
  describe("#getGameTableFromRawData", () => {
    it("should handle any number of rows and columns without errors", () => {
      const inputData = [
        {
          n: 6,
          m: 8,
          rows: 6,
          columns: 8,
        },
        {
          n: 3,
          m: 2,
          rows: DEFAULT_GAME_TABLE.ROWS,
          columns: DEFAULT_GAME_TABLE.COLUMNS,
        },
        {
          n: 12,
          m: 9,
          rows: DEFAULT_GAME_TABLE.ROWS,
          columns: DEFAULT_GAME_TABLE.COLUMNS,
        },
        {
          n: undefined,
          m: "house",
          rows: DEFAULT_GAME_TABLE.ROWS,
          columns: DEFAULT_GAME_TABLE.COLUMNS,
        },
      ];
      inputData.forEach((data) => {
        const [rows, columns] = getGameTableFromRawData(data.n, data.m);
        expect(rows).to.equal(data.rows);
        expect(columns).to.equal(data.columns);
      });
    });
  });
});
