import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';
const BASE_URL = '/banners';

// Tạo axios instance với cấu hình mặc định
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor để thêm token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    console.log('Admin token from localStorage:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Added Authorization header:', config.headers.Authorization);
    } else {
      console.warn('No admin token found in localStorage');
    }
    console.log('Request config:', config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý lỗi
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminRefreshToken');
      localStorage.removeItem('adminData');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const adminBannerService = {
  createBanner: (formData) => {
    return apiClient.post(`${BASE_URL}/admin`, formData);
  },
  getAllBanners: (page = 0, size = 10, sortBy = 'id', sortDir = 'asc') => 
    apiClient.get(`${BASE_URL}/admin?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`),
  getBannerById: (id) => apiClient.get(`${BASE_URL}/admin/${id}`),
  updateBanner: (id, formData) => {
    return apiClient.put(`${BASE_URL}/admin/${id}`, formData);
  },
  deleteBanner: (id) => apiClient.delete(`${BASE_URL}/admin/${id}`),
};
