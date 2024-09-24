import { action } from 'easy-peasy';

const roomChatModel = {
    chats: [],
  
    addChat: action((state, newChat) => {
        state.chats.push(newChat);
    }),
  
    clearChats: action((state) =>  {
        state.chats = [];
    }),
};

export default roomChatModel;