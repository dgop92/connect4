const { emitNames } = require("./constants");

const MAX_TIME_PER_TURN = 30; // in seconds

function callTurn(socket, turnEnded) {
  let turnCounter = 0;
  const turnIntervalId = null;
  socket.emit(emitNames.PLAYER_TURN);
  turnIntervalId = setInterval(() => {
    turnCounter += 1;
    if (turnCounter === 30) {
      clearInterval(turnIntervalId);
    }
  }, 1000);
  return turnIntervalId;
}
