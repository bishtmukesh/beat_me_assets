import api from '../utils/api';
import { SERVER_LOGIN_ENDPOINT, FETCH_AUTHENTICATION_STATUS_ENDPOINT } from '../constant/url';

export const requestJwtToken = async(username, password) => {
    const url = SERVER_LOGIN_ENDPOINT;
    const body = { username, password }

    const response = await api.post({ url, body });

    console.log("Server response -> " + JSON.stringify(response, {}, 2));

    return response;
};

export const fetchUserAuthenticationStatus  = async() => {
    const url = FETCH_AUTHENTICATION_STATUS_ENDPOINT;
    const response = await api.get({ url });

    console.log("Authentication status returned -> " + JSON.stringify(response.data, {}, 2));

    return response.data;
};