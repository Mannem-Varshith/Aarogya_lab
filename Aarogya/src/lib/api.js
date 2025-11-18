import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

/**
 * @typedef {Object} ApiResponse
 * @property {'success' | 'error'} status
 * @property {string} [message]
 * @property {any} [data]
 */

// Create axios instance with default config
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Add token to requests if available
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle response errors
api.interceptors.response.use(
    response => response,
    error => {
        // Handle authentication errors
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: async (phone, password, role) => {
        try {
            console.log('Making login request with:', { phone, role });
            const response = await api.post('/auth/login', { phone, password, role });
            console.log('Login response:', response.data);
            
            if (response.data && response.data.status === 'success') {
                console.log('API Response data structure:', response.data);
                console.log('API Response data.data:', response.data.data);
                console.log('API Response user:', response.data.data?.user);
                // Store token in localStorage
                if (response.data.data && response.data.data.token) {
                    localStorage.setItem('token', response.data.data.token);
                }
                return {
                    success: true,
                    data: response.data.data
                };
            } else {
                throw new Error(response.data?.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: error.message || 'Network error occurred'
            };
        }
    },

    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    getProfile: async () => {
        const response = await api.get('/auth/profile');
        return response.data;
    },

    updateProfile: async (userData) => {
        const response = await api.put('/auth/profile', userData);
        return response.data;
    }
};

// Reports API
export const reportsAPI = {
    uploadReport: async (data) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });
        const response = await api.post('/reports', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    getReports: async (filters = {}) => {
        const response = await api.get('/reports', { params: filters });
        return response.data;
    },

    getReportById: async (id) => {
        const response = await api.get(`/reports/${id}`);
        return response.data;
    },

    updateReport: async (id, data) => {
        const response = await api.put(`/reports/${id}`, data);
        return response.data;
    },

    deleteReport: async (id) => {
        const response = await api.delete(`/reports/${id}`);
        return response.data;
    }
};

// Patients API
export const patientsAPI = {
    getPatients: async (filters = {}) => {
        const response = await api.get('/patients', { params: filters });
        return response.data;
    },

    getPatientById: async (id) => {
        const response = await api.get(`/patients/${id}`);
        return response.data;
    },

    updatePatient: async (id, data) => {
        const response = await api.put(`/patients/${id}`, data);
        return response.data;
    }
};

// Dashboard API
export const dashboardAPI = {
    getDashboardStats: async () => {
        const response = await api.get('/dashboard/stats');
        return response.data;
    },

    getRecentReports: async () => {
        const response = await api.get('/dashboard/recent-reports');
        return response.data;
    },

    getPendingTests: async () => {
        const response = await api.get('/dashboard/pending-tests');
        return response.data;
    }
};

export default api;