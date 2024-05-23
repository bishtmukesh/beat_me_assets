import api from '../utils/api';
import { API1, API2 } from '../constant/url';

export const api1 = async () => {
    const url = API1;
    const response = await api.get({url : url});

    return response;
};

export const api2 = async (name) => {
    const url = API2;
    const body = {name : name};
    const response = await api.post({url : url, body : body});

    return response;
};