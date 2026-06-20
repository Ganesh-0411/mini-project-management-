import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Attach token to requests
axios.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

// Auth API
export const login = async (userData) => {
    const response = await axios.post(`${API_URL}/api/auth/login`, userData);
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

export const register = async (userData) => {
    const response = await axios.post(`${API_URL}/api/auth/register`, userData);
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('user');
};

// Task API
export const getTasks = async (params = {}) => {
    // params can include: page, limit, search, status, sortBy, order
    const response = await axios.get(`${API_URL}/tasks`, { params });
    return response.data;
};

export const getTaskStats = async () => {
    const response = await axios.get(`${API_URL}/tasks/stats`);
    return response.data;
};

export const createTask = async (taskData) => {
    const response = await axios.post(`${API_URL}/tasks`, taskData);
    return response.data;
};

export const updateTaskStatus = async (id, status) => {
    const response = await axios.put(`${API_URL}/tasks/${id}`, { status });
    return response.data;
};

export const deleteTask = async (id) => {
    const response = await axios.delete(`${API_URL}/tasks/${id}`);
    return response.data;
};
