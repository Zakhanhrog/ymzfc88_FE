import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const adminAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào header
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

// Admin authentication service
export const adminAuthService = {
  // Login admin
  login: async (credentials) => {
    try {
      const response = await adminAPI.post('/admin/login', {
        usernameOrEmail: credentials.username,
        password: credentials.password
      });

      const { data } = response.data;
      
      // Verify user is admin
      if (data.user.role !== 'ADMIN') {
        throw new Error('Bạn không có quyền truy cập admin');
      }

      const adminData = {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        fullName: data.user.fullName,
        role: 'admin',
        token: data.accessToken
      };
      
      localStorage.setItem('adminToken', data.accessToken);
      localStorage.setItem('adminRefreshToken', data.refreshToken);
      localStorage.setItem('adminData', JSON.stringify(adminData));
      
      return { success: true, data: adminData };
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Đăng nhập thất bại');
      }
      throw new Error('Lỗi kết nối đến máy chủ');
    }
  },

  // Logout admin
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRefreshToken');
    localStorage.removeItem('adminData');
  },

  // Check if admin is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('adminToken');
    return !!token;
  },

  // Get current admin data
  getCurrentAdmin: () => {
    const adminData = localStorage.getItem('adminData');
    return adminData ? JSON.parse(adminData) : null;
  },

  // Get admin token
  getToken: () => {
    return localStorage.getItem('adminToken');
  }
};
