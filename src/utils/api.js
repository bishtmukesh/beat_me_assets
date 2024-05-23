import axios from 'axios';
import { WEBSITE_BASE_URL } from '../constant/url';

const api = {
    
    async get({ url }) {
        try {
            const response = await axios.get(WEBSITE_BASE_URL + url);
            return response;
        } catch (error) {
            console.error('Error in GET request : ', error);
            throw error;
        }
    },
    async post({ url, body }) {
        try {
            const response = await axios.post(WEBSITE_BASE_URL + url, body);
            return response.data;
        } catch (error) {
            console.error('Error in POST request : ', error);
            throw error;
        }
    }

}

export default api;