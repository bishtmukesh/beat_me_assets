export const MAX_USERNAME_LENGTH = 20;
export const MEETARENA_USERNAME = "meetArenaUserName";

export const UNKNOWN_USERNAME = "Unknown";

export const ROOM_CODE_LENGTH = 4;

export const MESSAGE_TYPES = {
    CHAT: "chat",
    PLAYER_LIST: "player_list",
    GAME_UPDATE: "game_update",
    ROOM_UPDATE: "room_update",
};

export const GAME_STATES = {
    // Start state, host to choose the game from the given options
    // Entered the selected game
}

export const PICTIONARY_GAME_STATES = {
    GAME_READY: "game_ready",
    GAME_STARTED: "game_started",
}
export const PICTIONARY_START_STATE = PICTIONARY_GAME_STATES.GAME_READY;

export const ROOM_UPDATE_TYPES = {
    START: 'start',
};