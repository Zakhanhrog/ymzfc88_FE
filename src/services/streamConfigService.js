import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Tạo axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào header (nếu cần)
apiClient.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('token');
    const token = adminToken || userToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const streamConfigService = {
  /**
   * Lấy stream config theo game type và table number (public endpoint)
   */
  getStreamConfigByGame: async (gameType, tableNumber = null) => {
    try {
      const params = tableNumber ? { tableNumber } : {};
      const response = await apiClient.get(`/stream-configs/public/game/${gameType}`, { params });
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error getting stream config:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy stream config',
        data: null
      };
    }
  },

  /**
   * Lấy tất cả stream configs đang active (public endpoint)
   */
  getActiveStreamConfigs: async () => {
    try {
      const response = await apiClient.get('/stream-configs/public/active');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error getting active stream configs:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy stream configs',
        data: []
      };
    }
  },

  // Admin endpoints
  /**
   * Lấy tất cả stream configs (admin only)
   */
  getAllStreamConfigs: async () => {
    try {
      const response = await apiClient.get('/stream-configs/admin');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error getting all stream configs:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy stream configs',
        data: []
      };
    }
  },

  /**
   * Tạo stream config mới (admin only)
   */
  createStreamConfig: async (configData) => {
    try {
      const response = await apiClient.post('/stream-configs/admin', configData);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error creating stream config:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi tạo stream config'
      };
    }
  },

  /**
   * Cập nhật stream config (admin only)
   */
  updateStreamConfig: async (id, configData) => {
    try {
      const response = await apiClient.put(`/stream-configs/admin/${id}`, configData);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error updating stream config:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi cập nhật stream config'
      };
    }
  },

  /**
   * Xóa stream config (admin only)
   */
  deleteStreamConfig: async (id) => {
    try {
      await apiClient.delete(`/stream-configs/admin/${id}`);
      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting stream config:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi xóa stream config'
      };
    }
  }
};

export default streamConfigService;

