import axios from 'axios';

const API_URL = 'http://localhost:5000/api/friends';

// Get token from local storage
const getToken = () => {
    const token = localStorage.getItem('token');
    return token;
};

// Create axios instance with auth header
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
axiosInstance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const friendService = {
    // Get friend suggestions
    getSuggestions: async () => {
        try {
            const response = await axiosInstance.get('/suggestions');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Send friend request
    sendRequest: async (receiverId) => {
        try {
            const response = await axiosInstance.post('/request', { receiverId });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get pending friend requests
    getPendingRequests: async () => {
        try {
            const response = await axiosInstance.get('/requests');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Accept friend request
    acceptRequest: async (requestId) => {
        try {
            const response = await axiosInstance.put(`/accept/${requestId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get all friends
    getAllFriends: async () => {
        try {
            const response = await axiosInstance.get('/all');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Reject friend request
    rejectRequest: async (requestId) => {
        try {
            const response = await axiosInstance.put(`/reject/${requestId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Add unfriend method
    unfriend: async (friendId) => {
        try {
            const response = await axiosInstance.delete(`/unfriend/${friendId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}; 