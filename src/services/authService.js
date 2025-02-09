import axios from 'axios';
import { getProfilePictureUrl } from '../utils/helpers';

const API_URL = 'http://localhost:5000/api/auth';

export const login = async (data) => {
    const response = await axios.post(`${API_URL}/login`, data);
    if (response.data?.user?.profile_picture) {
        response.data.user.profile_picture = getProfilePictureUrl(response.data.user.profile_picture);
    }
    return response;
};

export const register = (data) => {
    return axios.post(`${API_URL}/register`, data);
};