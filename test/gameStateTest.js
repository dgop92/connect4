const { expect } = require("chai");
const {
  GameState,
  DEFAULT_GAME_TABLE,
  checkConnect4InArray,
} = require("../src/game/gameState");
const { playerColors } = require("../src/game/gameUtils");
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
  describe("#find main diagonal", () => {
    it("should return an array of elements in the main diagonal", () => {
      const gs = new GameState(3, 4);
      gs.state[0][0] = { color: playerColors.RED };
      gs.state[1][1] = { color: playerColors.RED };
      gs.state[2][2] = { color: playerColors.BLUE };

      gs.state[0][2] = { color: playerColors.ORANGE };
      gs.state[1][3] = { color: playerColors.GREEN };

      // console.table(gs.state);

      const arr1 = gs.getMainDiagonal(1, 1).map((e) => e?.color);
      expect(arr1).to.deep.equal([
        playerColors.RED,
        playerColors.RED,
        playerColors.BLUE,
      ]);

      const arr2 = gs.getMainDiagonal(0, 2).map((e) => e?.color);
      expect(arr2).to.deep.equal([playerColors.ORANGE, playerColors.GREEN]);

      const arr3 = gs.getMainDiagonal(2, 0).map((e) => e?.color);
      expect(arr3).to.deep.equal([undefined]);
    });
  });
  describe("#find secondary diagonal", () => {
    it("should return an array of elements in the secondary diagonal", () => {
      const gs = new GameState(3, 4);
      gs.state[0][0] = { color: playerColors.RED };
      gs.state[1][1] = { color: playerColors.RED };
      gs.state[2][2] = { color: playerColors.BLUE };

      gs.state[0][2] = { color: playerColors.ORANGE };
      gs.state[1][3] = { color: playerColors.GREEN };

      // console.table(gs.state);

      const arr1 = gs.getSecondaryDiagonal(1, 1).map((e) => e?.color);
      expect(arr1).to.deep.equal([playerColors.ORANGE, playerColors.RED, undefined]);

      const arr2 = gs.getSecondaryDiagonal(1, 3).map((e) => e?.color);
      expect(arr2).to.deep.equal([playerColors.GREEN, playerColors.BLUE]);

      const arr3 = gs.getSecondaryDiagonal(2, 1).map((e) => e?.color);
      expect(arr3).to.deep.equal([undefined, undefined, undefined]);
    });
  });
  describe("#checkConnect4InArray", () => {
    it("should return true if 4 pieces of the same color are consecutive", () => {
      const inputData = [
        {
          arr: [
            { color: playerColors.ORANGE },
            { color: playerColors.GREEN },
            { color: playerColors.BLUE },
            { color: playerColors.ORANGE },
            { color: playerColors.ORANGE },
          ],
          playerColor: playerColors.ORANGE,
          result: false,
        },
        {
          arr: [
            { color: playerColors.BLUE },
            { color: playerColors.GREEN },
            { color: playerColors.ORANGE },
            { color: playerColors.ORANGE },
            { color: playerColors.ORANGE },
            { color: playerColors.ORANGE },
          ],
          playerColor: playerColors.ORANGE,
          result: true,
        },
        {
          arr: [{ color: playerColors.BLUE }, { color: playerColors.GREEN }],
          playerColor: playerColors.ORANGE,
          result: false,
        },
      ];
      inputData.forEach((data) => {
        const isConnect4 = checkConnect4InArray(data.arr, data.playerColor);
        expect(isConnect4).to.equal(data.result);
      });
    });
  });
  describe("#checkIfPlayerWon", () => {
    it("should return true if 4 pieces from one player are consecutive in the table", () => {
      const gs = new GameState(6, 7);

      // If red player add a piece on position 1 3, he wins
      gs.state[1][1] = { color: playerColors.RED };
      gs.state[1][2] = { color: playerColors.RED };
      gs.state[1][3] = { color: playerColors.RED };
      gs.state[1][4] = { color: playerColors.RED };

      const playerWon = gs.checkIfPlayerWon(playerColors.RED, { i: 1, j: 3 });
      expect(playerWon).to.be.equal(true);

      gs.state[0][3] = { color: playerColors.ORANGE };
      gs.state[2][3] = { color: playerColors.ORANGE };
      gs.state[3][3] = { color: playerColors.ORANGE };
      gs.state[4][3] = { color: playerColors.ORANGE };

      const playerWon2 = gs.checkIfPlayerWon(playerColors.ORANGE, { i: 0, j: 3 });
      expect(playerWon2).to.be.equal(false);

    });
  });
});
