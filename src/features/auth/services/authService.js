import axios from 'axios';

// Cấu hình axios base URL (thay đổi theo API thực tế)
const API_BASE_URL = 'https://api.bettinghub.com';

const authAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào header
authAPI.interceptors.request.use(
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

// Mock API functions (thay thế bằng API thực tế)
export const authService = {
  // Đăng nhập
  login: async (credentials) => {
    try {
      // Tạm thời mock response
      await new Promise(resolve => setTimeout(resolve, 1000)); // Giả lập delay API
      
      if (credentials.email === 'admin@bettinghub.com' && credentials.password === '123456') {
        const mockResponse = {
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: 1,
            email: credentials.email,
            name: 'Admin User',
            role: 'user'
          }
        };
        return mockResponse;
      } else {
        throw new Error('Email hoặc mật khẩu không chính xác');
      }
    } catch (error) {
      throw error;
    }
  },

  // Đăng ký
  register: async (userData) => {
    try {
      // Tạm thời mock response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: Date.now(),
          email: userData.email,
          name: userData.name,
          role: 'user'
        }
      };
      return mockResponse;
    } catch (error) {
      throw error;
    }
  },

  // Đăng xuất
  logout: async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return true;
    } catch (error) {
      throw error;
    }
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: async () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      throw error;
    }
  }
};

export default authService;
