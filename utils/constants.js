const listenerNames = {
  PLAYER_MOVEMENT: "player-movement",
};

const emitNames = {
  GAME_STARTED: "game-started",
  JOIN_LOBBY: "join-lobby",
  LEAVE_LOBBY: "leave-lobby",
  PLAYER_TURN: "player-turn",
  TURN_LOST: "turn-lost",
};

module.exports = {
  listenerNames,
  emitNames
}
