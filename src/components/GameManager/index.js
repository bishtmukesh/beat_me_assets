import React, { useState } from 'react';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import { Stomp } from '@stomp/stompjs';
import { useStoreState, useStoreActions } from 'easy-peasy';

import useGameManager from './useGameManager';
import StartOptions from './StartOptions';
import DrawingBoard from '../DrawingBoard';
import { PICTIONARY_GAME_STATES, PICTIONARY_START_STATE } from '../../constant/room';

const GameManager = ( { roomCode, isHost, stompClient, setGameUpdateHandler, setRoomUpdateHandler } ) => {

    const segment = useStoreState(state => state.drawing.segment);
    const lastDrawn = useStoreState(state => state.drawing.lastDrawn);
    const prevStates = useStoreState(state => state.drawing.prevStates);
    const updateLastDrawn = useStoreActions(actions => actions.drawing.updateLastDrawn);
    const updateSegment = useStoreActions(actions => actions.drawing.updateSegment);
    const endSegment = useStoreActions(actions => actions.drawing.endSegment);
    const saveBoardState = useStoreActions(actions => actions.drawing.saveBoardState);
    const undoDrawing = useStoreActions(actions => actions.drawing.undoDrawing);
    const addFloodFill = useStoreActions(actions => actions.drawing.addFloodFill);
    const deleteDrawing = useStoreActions(actions => actions.drawing.deleteDrawing);
  
    const [pictionaryGameState, setPictionaryGameState] = useState(PICTIONARY_START_STATE);

    const {
        sendPictionaryUpdateMessage,
        sendRoomUpdateMessage,
    } = useGameManager( {roomCode, stompClient, setPictionaryGameState, setRoomUpdateHandler} );

    const renderGameState = () => {
        switch (pictionaryGameState) {
            case PICTIONARY_GAME_STATES.GAME_READY:
                return ( 
                    <StartOptions 
                        setPictionaryGameState={setPictionaryGameState}
                        isHost={isHost}
                        sendRoomUpdateMessage={sendRoomUpdateMessage}
                    />
                )
            case PICTIONARY_GAME_STATES.GAME_STARTED:
                return (
                    <DrawingBoard
                        width={600}
                        height={600}
                        segment={segment}
                        lastDrawn={lastDrawn}
                        prevStates={prevStates}
                        updateLastDrawn={updateLastDrawn}
                        updateSegment={updateSegment}
                        endSegment={endSegment}
                        saveBoardState={saveBoardState}
                        undoDrawing={undoDrawing}
                        addFloodFill={addFloodFill}
                        deleteDrawing={deleteDrawing}
                        canDraw={isHost}
                        sendPictionaryUpdateMessage={sendPictionaryUpdateMessage}
                        setGameUpdateHandler={setGameUpdateHandler}
                    />
                )
            default:
                return (
                    <StartOptions
                        setPictionaryGameState={setPictionaryGameState}
                        isHost={isHost}
                        sendRoomUpdateMessage={sendRoomUpdateMessage}
                    />
                )
        }
    };

    return (
        <Box 
            sx={{
                minHeight: '600px',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
           }}
        >
            {renderGameState()}
        </Box>
    );
};

GameManager.propTypes = {
    roomCode: PropTypes.string.isRequired,
    isHost: PropTypes.bool.isRequired,
    stompClient: PropTypes.instanceOf(Stomp.client).isRequired,
    setGameUpdateHandler: PropTypes.func.isRequired,
    setRoomUpdateHandler: PropTypes.func.isRequired,
};

export default GameManager;
