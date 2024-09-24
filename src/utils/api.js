import axios from 'axios';
import { SERVER_BASE_URL } from '../constant/url';

const api = {
    
    async get({ url }) {
        try {
            const response = await axios.get(SERVER_BASE_URL + url, { withCredentials : true });
            return response;
        } catch (error) {
            console.error('Error in GET request : ', error);
            throw error;
        }
    },
    async post({ url, body }) {
        try {
            const response = await axios.post(SERVER_BASE_URL + url, body, { withCredentials : true });
            return response.data;
        } catch (error) {
            console.error('Error in POST request : ', error);
            throw error;
        }
    }

}

export default api;