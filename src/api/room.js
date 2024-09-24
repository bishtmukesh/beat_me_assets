import api from '../utils/api';
import { GENERATE_ROOM_CODE_URL } from '../constant/url';

export const generateRoomCodeApi = async() => {
    const url = GENERATE_ROOM_CODE_URL;
    const response = await api.post({ url });

    return response.roomCode;
};