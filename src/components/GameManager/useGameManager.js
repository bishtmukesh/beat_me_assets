import { useCallback } from 'react';
import { Stomp } from '@stomp/stompjs';
import PropTypes from 'prop-types';

import { PICTIONARY_UPDATE_MESSAGE_ENDPOINT, ROOM_UPDATE_MESSAGE_ENDPOINT } from '../../constant/url';
import { MESSAGE_TYPES, ROOM_UPDATE_TYPES } from '../../constant/room';
import { PICTIONARY_GAME_STATES } from '../../constant/pictionary';
 
const useGameManager = ({ 
    roomCode, 
    stompClient, 
    setPictionaryGameState, 
    setRoomUpdateHandler
}) => {

    const sendPictionaryUpdateMessage = useCallback(({ updateType, point, drawingColor, pencilSize, guessedWord } = {}) => {
        if (stompClient && stompClient.connected) {
            stompClient.send(PICTIONARY_UPDATE_MESSAGE_ENDPOINT, {}, JSON.stringify({ roomCode, updateType, point, drawingColor, pencilSize, guessedWord }));
        }
    }, [roomCode, stompClient]);

    const sendRoomUpdateMessage = useCallback((updateType) => {
        if (stompClient && stompClient.connected) {
            stompClient.send(ROOM_UPDATE_MESSAGE_ENDPOINT, {}, JSON.stringify({ updateType, roomCode }));
        }
    }, [roomCode, stompClient]);

    const handleRoomUpdate = useCallback((message) => {
        if(message.messageType === MESSAGE_TYPES.ROOM_UPDATE) {
            if (message.updateType === ROOM_UPDATE_TYPES.START) {
                setPictionaryGameState(PICTIONARY_GAME_STATES.GAME_STARTED);
            } else if (message.updateType === ROOM_UPDATE_TYPES.ROOM_INFO) {
                if (message.gameState) {
                    setPictionaryGameState(message.gameState);
                }
            }
        } 
    }, [setPictionaryGameState]);

    setRoomUpdateHandler(handleRoomUpdate);

    return {
        sendPictionaryUpdateMessage,
        sendRoomUpdateMessage,
    };
}

useGameManager.useGameManager = {
    roomCode: PropTypes.string.isRequired,
    stompClient: PropTypes.instanceOf(Stomp.client).isRequired,
    setPictionaryGameState: PropTypes.func.isRequired,
    setRoomUpdateHandler: PropTypes.func.isRequired,
};

export default useGameManager;