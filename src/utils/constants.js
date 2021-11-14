const MAX_PLAYERS_PER_GAME = 2;

const listenerNames = {
  PLAYER_MOVEMENT: "player-movement",
  REQUEST_START_GAME: "request-start-game",
};

const emitNames = {
  JOIN_LOBBY: "join-lobby",
  MOVE_TO_LOBBY: "move-to-lobby",
  GAME_STARTED: "game-started",
  LEAVE_LOBBY: "leave-lobby",
  PLAYER_TURN: "player-turn",
  PLAYER_WON: "player-won",
  TIED_GAME: "tied-game",
  TURN_LOST: "turn-lost",
  TURN_TICK: "turn-tick",
  INVALID_PLAY: "invalid-play",
  UPDATE_GAME: "update-game",
};

module.exports = {
  listenerNames,
  emitNames,
  MAX_PLAYERS_PER_GAME,
};
