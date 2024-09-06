import React from 'react';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import { Stomp } from '@stomp/stompjs';
import { useStoreState, useStoreActions } from 'easy-peasy';

import useGameManager from './useGameManager';
import DrawingBoard from '../DrawingBoard';

const GameManager = ( { roomCode, isHost, stompClient, setGameUpdateHandler } ) => {

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
  
    const {
        sendPictionaryUpdateMessage,
    } = useGameManager( {roomCode, stompClient, setGameUpdateHandler} );

    return (
        <Box 
            sx={{
                minHeight: '800px',
                width: '100%',
                border: '1px solid black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
           }}
        >

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

        </Box>
    );
};

GameManager.propTypes = {
    roomCode: PropTypes.string.isRequired,
    isHost: PropTypes.bool.isRequired,
    stompClient: PropTypes.instanceOf(Stomp.client).isRequired,
    setGameUpdateHandler: PropTypes.func.isRequired,
};

export default GameManager;
