const { DEFAULT_GAME_TABLE } = require("./gameState");

function getGameTableFromRawData(n, m) {
  let rows = DEFAULT_GAME_TABLE.ROWS;
  let columns = DEFAULT_GAME_TABLE.COLUMNS;

  if (Number.isInteger(n) && n >= 6 && n <= 8) {
    rows = n;
  }

  if (Number.isInteger(m) && m >= 6 && m <= 8) {
    columns = m;
  }

  return [rows, columns];
}

module.exports = {
  getGameTableFromRawData,
};
