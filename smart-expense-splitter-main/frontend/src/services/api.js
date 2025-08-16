import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Let the AuthContext handle authentication errors gracefully
    // Don't automatically redirect here
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

// User API
export const userAPI = {
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/user/id/${id}`),
  getUserByEmail: (email) => api.get(`/user/email/${email}`),
};

// Group API
export const groupAPI = {
  createGroup: (groupData, creatorId) => api.post(`/groups?creatorId=${creatorId}`, groupData),
  addUserToGroup: (groupId, userId) => api.post(`/groups/${groupId}/users/${userId}`),
  getUserGroups: (userId) => api.get(`/users/${userId}/groups`),
  getGroupById: (id) => api.get(`/groups/${id}`),
};

// Expense API
export const expenseAPI = {
  addExpense: (groupId, payerId, expenseData) =>
    api.post(`/expenses/add?groupId=${groupId}&payerId=${payerId}`, expenseData),
  getGroupExpenses: (groupId) => api.get(`/expenses/group/${groupId}`),
  getUserExpenses: (userId) => api.get(`/expenses/user/${userId}`),
  deleteExpense: (expenseId) => api.delete(`/expenses/${expenseId}`),
};

// Settlement API
export const settlementAPI = {
  getGroupSettlements: (groupId) => api.get(`/settlement/group/${groupId}`),
  getUserSettlements: (userId) => api.get(`/settlement/user/${userId}`),
};

export default api;
