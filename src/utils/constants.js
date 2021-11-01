const MAX_PLAYERS_PER_GAME = 2;

const listenerNames = {
  PLAYER_MOVEMENT: "player-movement",
};

const emitNames = {
  GAME_STARTED: "game-started",
  JOIN_LOBBY: "join-lobby",
  LEAVE_LOBBY: "leave-lobby",
  PLAYER_TURN: "player-turn",
  PLAYER_WON: "player-won",
  TURN_LOST: "turn-lost",
  INVALID_PLAY: "invalid-play",
  UPDATE_GAME: "update-game",
};

module.exports = {
  listenerNames,
  emitNames,
  MAX_PLAYERS_PER_GAME,
};
