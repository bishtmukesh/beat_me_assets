import React from 'react';
import Box from '@mui/material/Box';
import { useStoreState, useStoreActions } from 'easy-peasy';

import DrawingBoard from '../../components/DrawingBoard';

function TestPage() {
  
    const drawing = useStoreState(state => state.drawing.drawing);
    const segment = useStoreState(state => state.drawing.segment);
    const lastDrawn = useStoreState(state => state.drawing.lastDrawn);
    const updateLastDrawn = useStoreActions(actions => actions.drawing.updateLastDrawn);
    const updateSegment = useStoreActions(actions => actions.drawing.updateSegment);
    const endSegment = useStoreActions(actions => actions.drawing.endSegment);
    const addFloodFill = useStoreActions(actions => actions.drawing.addFloodFill);
    const removeLastSegment = useStoreActions(actions => actions.drawing.removeLastSegment);
    const deleteDrawing = useStoreActions(actions => actions.drawing.deleteDrawing);

    const sendPictionaryUpdateMessage = (updateType, point, drawingColor, pencilSize) => {
        console.log("Update Type -> " + updateType + ", point -> " + point + ", drawing color -> " + drawingColor + ", pencil size -> " + pencilSize);
    }

    const setGameUpdateHandler = (handler) => {
        console.log("Handler set");
    }

    return (
        <Box sx={{ marginTop: '30px' }}>
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
                canDraw={true}
                sendPictionaryUpdateMessage={sendPictionaryUpdateMessage}
                setGameUpdateHandler={setGameUpdateHandler}
            />
            
        </Box>
    );
}

export default TestPage;