import { createStore } from 'easy-peasy';

import drawingModel from './models/drawingModel';
import roomChatModel from './models/roomChatModel';
import userAuthModel from './models/userAuth';

const store = createStore({
  drawing: drawingModel,
  roomChat: roomChatModel,
  userAuth: userAuthModel,
});

export default store;