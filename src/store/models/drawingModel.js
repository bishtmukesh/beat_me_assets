import { action } from 'easy-peasy';

import { TOOL_TYPES } from '../../constant/drawingBoard';
import { UNDO_LIMIT } from '../../constant/drawingBoard';

const drawingModel = {
    drawing: [],
    segment: [],
    lastDrawn: -1,
    prevStates: [],
    
    updateSegment: action((state, newInput) => {
        state.segment.push(newInput);
    }),
    
    updateLastDrawn: action((state, lastIndexDrawn) => {
        state.lastDrawn = lastIndexDrawn;
    }),

    endSegment: action((state, pencilStats) => {
        const { pencilSize, drawingColor } = pencilStats;
        state.drawing.push({ tool: TOOL_TYPES.PENCIL, pencilSize, drawingColor, points : state.segment });
        state.segment = [];
        state.lastDrawn = -1;
    }),
    
    saveBoardState: action((state, imageData) => {
        if (!(imageData instanceof ImageData)) return;

        if (state.prevStates.length === UNDO_LIMIT + 1) {
            state.prevStates.shift();
        }

        state.prevStates.push(imageData);
    }),

    undoDrawing: action((state) => {
        state.prevStates.pop();
    }),

    addFloodFill: action((state, floodFillParams) => {
        const { startPoint, drawingColor } = floodFillParams;
        state.drawing.push({ tool: TOOL_TYPES.FLOOD_FILL, drawingColor, startPoint });
        state.segment = [];
        state.lastDrawn = -1;
    }),

    removeLastSegment: action((state) =>  {
        if (state.drawing.length > 0) {
            state.drawing.pop(); 
        }

        state.segment = [];
        state.lastDrawn = -1;
    }),

    deleteDrawing: action((state, imageData) =>  {
        state.drawing = [];
        state.segment = [];
        state.lastDrawn = -1;
        state.prevStates = imageData instanceof ImageData ? [imageData] : [];
    }),

};

export default drawingModel;
                                                                                                                                                                                 