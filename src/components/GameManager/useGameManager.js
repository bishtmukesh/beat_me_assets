import { useCallback } from 'react';
import { Stomp } from '@stomp/stompjs';
import PropTypes from 'prop-types';

import { PICTIONARY_UPDATE_MESSAGE_ENDPOINT } from '../../constant/url';
import { DRAWING_UPDATE_TYPES } from '../../constant/drawingBoard';
 
const useGameManager = ( { roomCode, stompClient, setGameUpdateHandler } ) => {
    
    const sendPictionaryUpdateMessage = useCallback((updateType, point, drawingColor, pencilSize) => {
        if (stompClient && stompClient.connected) {
            if (updateType === DRAWING_UPDATE_TYPES.ADD_TO_SEGMENT) {
                stompClient.send(PICTIONARY_UPDATE_MESSAGE_ENDPOINT, {}, JSON.stringify({ roomCode, updateType, point, drawingColor, pencilSize }));
            } else {
                stompClient.send(PICTIONARY_UPDATE_MESSAGE_ENDPOINT, {}, JSON.stringify({ roomCode, updateType }));
            }
        }
    }, [roomCode, stompClient]);

    return {
        sendPictionaryUpdateMessage,
        setGameUpdateHandler,
    };
}

useGameManager.useGameManager = {
    roomCode: PropTypes.string.isRequired,
    stompClient: PropTypes.instanceOf(Stomp.client).isRequired,
    setGameUpdateHandler: PropTypes.func.isRequired,
};

export default useGameManager;