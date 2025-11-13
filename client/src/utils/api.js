import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cima_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('cima_token');
      localStorage.removeItem('cima_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getReports = async () => {
  const response = await api.get('/api/reports');
  return response.data;
};

export const createReport = async (reportData) => {
  const response = await api.post('/api/reports', reportData);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/api/auth/register', userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await api.post('/api/auth/login', userData);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post('/api/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await api.post('/api/auth/reset-password', data);
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/api/admin/users');
  return response.data;
};

export const deleteReport = async (reportId) => {
  const response = await api.delete(`/api/admin/reports/${reportId}`);
  return response.data;
};

export const promoteUser = async (userId) => {
  const response = await api.patch(`/api/admin/users/${userId}/promote`);
  return response.data;
};

export default api;
