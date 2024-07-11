import { action } from 'easy-peasy';

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
    state.drawing.push({ pencilSize, drawingColor, points : state.segment });
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