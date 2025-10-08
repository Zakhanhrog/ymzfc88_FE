// Point API Service với auto token refresh
import authService from './authService.js';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Admin API instance với adminToken
const adminAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm adminToken vào header
adminAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to handle API response for fetch
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to handle axios response
const handleAxiosResponse = (response) => {
  return response.data;
};

const pointService = {
  // User endpoints
  getMyPoints: async () => {
    const response = await authService.makeAuthenticatedRequest(`${API_BASE_URL}/points/my-points`, {
      method: 'GET',
    });
    return handleResponse(response);
  },

  getMyPointHistory: async (page = 0, size = 10) => {
    const response = await authService.makeAuthenticatedRequest(
      `${API_BASE_URL}/points/my-history?page=${page}&size=${size}`,
      { method: 'GET' }
    );
    return handleResponse(response);
  },

  // Admin endpoints
  adjustUserPoints: async (adjustmentData) => {
    const response = await authService.makeAuthenticatedRequest(`${API_BASE_URL}/points/admin/adjust`, {
      method: 'POST',
      body: JSON.stringify(adjustmentData),
    });
    return handleResponse(response);
  },

  getUserPoints: async (userId) => {
    const response = await authService.makeAuthenticatedRequest(`${API_BASE_URL}/points/admin/user/${userId}`, {
      method: 'GET',
    });
    return handleResponse(response);
  },

  getUserPointHistory: async (userId, page = 0, size = 10) => {
    const response = await authService.makeAuthenticatedRequest(
      `${API_BASE_URL}/points/admin/user/${userId}/history?page=${page}&size=${size}`,
      { method: 'GET' }
    );
    return handleResponse(response);
  },

  getAllPointHistory: async (page = 0, size = 10, filters = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (filters.startDate) {
      params.append('startDate', filters.startDate);
    }
    if (filters.endDate) {
      params.append('endDate', filters.endDate);
    }
    if (filters.userId) {
      params.append('userId', filters.userId);
    }

    const response = await authService.makeAuthenticatedRequest(
      `${API_BASE_URL}/points/admin/all-history?${params}`,
      { method: 'GET' }
    );
    return handleResponse(response);
  },
};

export default pointService;