const DEFAULT_GAME_TABLE = {
  ROWS: 6,
  COLUMNS: 7,
  MIN_COLUMNS: 6,
  MIN_ROWS: 6,
  MAX_COLUMNS: 8,
  MAX_ROWS: 8,
};

function getEmptyRow(n) {
  return Array.from({ length: n }, () => null);
}

function createGameTableState(n, m) {
  return Array.from({ length: n }, () => getEmptyRow(m));
}

function checkConnect4InArray(arr, color) {
  // cannot define a connect 4 with length less than 4
  if (arr.length <= 3) {
    return false;
  }
  let consecutiveColor = 0;
  return arr.some((cellData) => {
    if (cellData?.color === color) {
      consecutiveColor += 1;
    } else {
      consecutiveColor = 0;
    }

    if (consecutiveColor === 4) {
      return true;
    }

    return false;
  });
}

class GameState {
  constructor(n, m) {
    this.n = n;
    this.m = m;
    this.state = createGameTableState(this.n, this.m);
  }

  isColumnFull(j) {
    return this.state[0][j] !== null;
  }

  addPiece(data) {
    const { j, ...anotherData } = data;
    let positionToInsert = this.n - 1;
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
    const mainDiagonal = this.getMainDiagonal(i, j);
    const secondaryDiagonal = this.getSecondaryDiagonal(i, j);

    const wonOnHorizontal = checkConnect4InArray(row, color);
    const wonOnVertical = checkConnect4InArray(column, color);
    const wonOnMainDiagonal = checkConnect4InArray(mainDiagonal, color);
    const wonOnSecondaryDiagonal = checkConnect4InArray(secondaryDiagonal, color);
    return (
      wonOnHorizontal || wonOnVertical || wonOnMainDiagonal || wonOnSecondaryDiagonal
    );
  }

  getMainDiagonal(iPos, jPos) {
    let i = iPos;
    let j = jPos;
    while (i > 0 && j > 0) {
      i -= 1;
      j -= 1;
    }
    const arr = [];
    while (i < this.n && j < this.m) {
      arr.push(this.state[i][j]);
      i += 1;
      j += 1;
    }
    return arr;
  }

  getSecondaryDiagonal(iPos, jPos) {
    let i = iPos;
    let j = jPos;
    while (i > 0 && j < this.m - 1) {
      i -= 1;
      j += 1;
    }
    const arr = [];
    while (i < this.n && j >= 0) {
      arr.push(this.state[i][j]);
      i += 1;
      j -= 1;
    }
    return arr;
  }

  getSerializableState() {
    return {
      table: this.state,
      m: this.m,
      n: this.n,
    };
  }
}

module.exports = {
  GameState,
  DEFAULT_GAME_TABLE,
  checkConnect4InArray,
};
