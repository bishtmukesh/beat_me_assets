import { createStore } from 'easy-peasy';
import drawingModel from './models/drawingModel';
import roomChatModel from './models/roomChatModel';

const store = createStore({
  drawing: drawingModel,
  roomChat: roomChatModel,
});

export default store;