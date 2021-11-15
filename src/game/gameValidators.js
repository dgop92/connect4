const { DEFAULT_GAME_TABLE } = require("./gameState");

function getGameTableFromRawData(n, m) {
  let rows = DEFAULT_GAME_TABLE.ROWS;
  let columns = DEFAULT_GAME_TABLE.COLUMNS;

  const nAsNumber = Number(n);
  if (Number.isInteger(nAsNumber) && nAsNumber >= 6 && nAsNumber <= 8) {
    rows = nAsNumber;
  }

  const mAsNumber = Number(m);
  if (Number.isInteger(mAsNumber) && mAsNumber >= 6 && mAsNumber <= 8) {
    columns = mAsNumber;
  }

  return [rows, columns];
}

module.exports = {
  getGameTableFromRawData,
};
