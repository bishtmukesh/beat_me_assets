import React from 'react';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import { Stomp } from '@stomp/stompjs';
import { useStoreState, useStoreActions } from 'easy-peasy';

import useGameManager from './useGameManager';
import DrawingBoard from '../DrawingBoard';

const GameManager = ( { roomCode, isHost, stompClient, setGameUpdateHandler } ) => {

  	const drawing = useStoreState(state => state.drawing.drawing);
    const segment = useStoreState(state => state.drawing.segment);
    const lastDrawn = useStoreState(state => state.drawing.lastDrawn);
    const updateLastDrawn = useStoreActions(actions => actions.drawing.updateLastDrawn);
    const updateSegment = useStoreActions(actions => actions.drawing.updateSegment);
    const endSegment = useStoreActions(actions => actions.drawing.endSegment);
    const addFloodFill = useStoreActions(actions => actions.drawing.addFloodFill);
    const removeLastSegment = useStoreActions(actions => actions.drawing.removeLastSegment);
    const deleteDrawing = useStoreActions(actions => actions.drawing.deleteDrawing);
  
    const {
        sendPictionaryUpdateMessage,
    } = useGameManager( {roomCode, stompClient, setGameUpdateHandler} );

    return (
        <Box 
            sx={{
               minHeight: '800px',
                width: '100%',
                border: '1px solid black'
           }}
        >

            <DrawingBoard
                width={600}
                height={600}
                drawing={drawing}
                segment={segment}
                lastDrawn={lastDrawn}
                updateLastDrawn={updateLastDrawn}
                updateSegment={updateSegment}
                endSegment={endSegment}
                addFloodFill={addFloodFill}
                removeLastSegment={removeLastSegment}
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
