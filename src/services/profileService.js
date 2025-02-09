import axios from 'axios';

const API_URL = 'http://localhost:5000/api/profile';

// Create axios instance with auth header
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const profileService = {
    getProfile: async () => {
        try {
            const response = await axiosInstance.get('/');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    updateProfile: async (profileData) => {
        try {
            const response = await axiosInstance.put('/update', profileData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    uploadProfilePicture: async (file) => {
        try {
            const formData = new FormData();
            formData.append('profile_picture', file);

            const response = await axiosInstance.post('/upload-photo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            // Return the full profile data
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}; 