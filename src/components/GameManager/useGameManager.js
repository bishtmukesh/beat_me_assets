import { useCallback } from 'react';
import { Stomp } from '@stomp/stompjs';
import PropTypes from 'prop-types';

import { PICTIONARY_UPDATE_MESSAGE_ENDPOINT, ROOM_UPDATE_MESSAGE_ENDPOINT } from '../../constant/url';
import { DRAWING_UPDATE_TYPES } from '../../constant/drawingBoard';
import { MESSAGE_TYPES, PICTIONARY_GAME_STATES, ROOM_UPDATE_TYPES } from '../../constant/room';
 
const useGameManager = ( { roomCode, stompClient, setPictionaryGameState, setRoomUpdateHandler} ) => {
    
    const sendPictionaryUpdateMessage = useCallback((updateType, point, drawingColor, pencilSize) => {
        if (stompClient && stompClient.connected) {
            if (updateType === DRAWING_UPDATE_TYPES.ADD_TO_SEGMENT || updateType === DRAWING_UPDATE_TYPES.ADD_FLOOD_FILL) {
                stompClient.send(PICTIONARY_UPDATE_MESSAGE_ENDPOINT, {}, JSON.stringify({ roomCode, updateType, point, drawingColor, pencilSize }));
            } else {
                stompClient.send(PICTIONARY_UPDATE_MESSAGE_ENDPOINT, {}, JSON.stringify({ roomCode, updateType }));
            }
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