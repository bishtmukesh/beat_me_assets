import { action } from 'easy-peasy';
import { TOOL_TYPES } from '../../constant/drawingBoard';

const drawingModel = {
  drawing: [],
  segment: [],
  lastDrawn: -1,
  
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

  deleteDrawing: action((state) =>  {
    state.drawing = [];
    state.segment = [];
    state.lastDrawn = -1;
  }),
};

export default drawingModel;
                                                                                                                                                                                 