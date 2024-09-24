import React from 'react';
import Box from '@mui/material/Box';
import { useStoreState, useStoreActions } from 'easy-peasy';

import DrawingBoard from '../../components/DrawingBoard';

function TestPage() {
  
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

    const sendPictionaryUpdateMessage = (updateType, point, drawingColor, pencilSize) => {
        console.log("Update Type -> " + updateType + ", point -> " + point + ", drawing color -> " + drawingColor + ", pencil size -> " + pencilSize);
    }

    const setGameUpdateHandler = (handler) => {
        console.log("Handler set");
    }

    return (
        <Box 
            sx={{ 
                marginTop: '30px',
                height: '600px',
                width: '600px', 
            }}
        >
            <DrawingBoard
                width={700}
                height={700}
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
                canDraw={true}
                sendPictionaryUpdateMessage={sendPictionaryUpdateMessage}
                setGameUpdateHandler={setGameUpdateHandler}
            />
            
        </Box>
    );
}

export default TestPage;