import { createStore } from 'easy-peasy';
import drawingModel from './models/drawingModel';

const store = createStore({
  drawing: drawingModel,
});

export default store;