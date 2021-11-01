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
  }
}

module.exports = {
  GameState,
  GAME_TABLE,
};
