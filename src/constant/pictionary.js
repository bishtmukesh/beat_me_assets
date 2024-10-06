export const PICTIONARY_UPDATE_TYPES = {
    DELETE: 'delete',
    UNDO: 'undo',
    ADD_TO_SEGMENT: 'add_to_segment',
    END_SEGMENT: 'end_segment',
    ADD_FLOOD_FILL: "add_flood_fill",
    ALLOW_DRAW: 'allow_draw',
    SET_GUESS_WORD: 'set_guess_word',
    GUESS_WORD: 'guess_word',
};

export const PICTIONARY_GAME_STATES = {
    GAME_READY: "game_ready",
    GAME_STARTED: "game_started",
}

export const PICTIONARY_START_STATE = PICTIONARY_GAME_STATES.GAME_READY;