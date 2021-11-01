const GAME_TABLE = {
  ROWS: 6,
  COLUMNS: 7,
};

function getEmptyRow(n) {
  return Array.from({ length: n }, () => null);
}

function createGameTableState(n, m) {
  return Array.from({ length: n }, () => getEmptyRow(m));
}

class GameState {
  constructor() {
    this.state = createGameTableState(GAME_TABLE.ROWS, GAME_TABLE.COLUMNS);
  }

  isColumnFull(j) {
    return this.state[0][j] !== null;
  }

  addPiece(data) {
    const { j, ...anotherData } = data;
    let positionToInsert = GAME_TABLE.ROWS - 1;
    for (let i = 0; i < this.state.length; i += 1) {
      const piece = this.state[i][j];
      if (piece !== null) {
        positionToInsert = i - 1;
        break;
      }
    }
    this.state[positionToInsert][j] = anotherData;
    return { i: positionToInsert, j };
  }

  checkIfPlayerWon(color, newPieceData) {
    const { i, j } = newPieceData;
    const row = this.state[i];
    const column = this.state.map((currentRow) => currentRow[j]);
    const wonOnVerticalHorizontal =
      this.checkConnect4InArray(row, color) || this.checkConnect4InArray(column, color);
    return false;
  }

  checkConnect4InArray(arr, color) {
    return false;
  }

  getSerializableState() {
    return {
      table: this.state,
      m: GAME_TABLE.COLUMNS,
      n: GAME_TABLE.ROWS,
    };
  }
}

module.exports = {
  GameState,
  GAME_TABLE,
};
