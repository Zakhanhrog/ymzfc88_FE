import axios from 'axios';

// Cấu hình axios base URL cho backend local
const API_BASE_URL = 'http://localhost:8080/api';

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

// API functions sử dụng backend thực tế
export const authService = {
  // Đăng nhập
  login: async (credentials) => {
    try {
      const response = await authAPI.post('/auth/login', {
        usernameOrEmail: credentials.usernameOrEmail,
        password: credentials.password
      });

      const { data } = response.data;
      return {
        token: data.accessToken,
        refreshToken: data.refreshToken,
        user: {
          id: data.user.id,
          email: data.user.email,
          username: data.user.username,
          fullName: data.user.fullName,
          role: data.user.role.toLowerCase()
        }
      };
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Đăng nhập thất bại');
      }
      throw new Error('Lỗi kết nối đến máy chủ');
    }
  },

  // Đăng ký
  register: async (userData) => {
    try {
      // Sử dụng username do user nhập vào
      const response = await authAPI.post('/auth/register', {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.password,
        fullName: userData.name || userData.fullName,
        phoneNumber: userData.phone || userData.phoneNumber
      });

      // Chỉ trả về thông báo thành công, không tự động đăng nhập
      return {
        success: true,
        message: response.data.message || 'Đăng ký thành công'
      };
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Đăng ký thất bại');
      }
      throw new Error('Lỗi kết nối đến máy chủ');
    }
  },

  // Đăng xuất
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authAPI.post('/auth/logout', { refreshToken });
      }
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return true;
    } catch (error) {
      // Vẫn clear localStorage dù API thất bại
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return true;
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
