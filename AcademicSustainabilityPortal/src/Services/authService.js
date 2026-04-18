import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  signup: (email, password, name) => api.post('/auth/signup', { email, password, name }),
  getCurrentUser: () => api.get('/auth/me'),
};

export const issueService = {
  getAllIssues: () => api.get('/issues'),
  createIssue: (data) => api.post('/issues', data),
  updateIssue: (id, data) => api.put(`/issues/${id}`, data),
  deleteIssue: (id) => api.delete(`/issues/${id}`),
};

export const dashboardService = {
  getMetrics: () => api.get('/dashboard/metrics'),
  getFocusAreas: () => api.get('/dashboard/focus-areas'),
};

export const userService = {
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (currentPassword, newPassword) =>
    api.put('/users/password', { currentPassword, newPassword }),
};

export default api;
