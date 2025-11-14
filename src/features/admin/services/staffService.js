import axios from 'axios';

const API_BASE_URL = 'https://api.tathiet168.com/api';

const staffAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

staffAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export const staffService = {
  getMktUsers: async (params = {}) => {
    try {
      const response = await staffAPI.get('/staff/mkt/users', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể tải danh sách người dùng');
    }
  },

  getMktFinanceOverview: async (params = {}) => {
    try {
      const response = await staffAPI.get('/staff/mkt/finance/overview', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể tải báo cáo tài chính');
    }
  },

  getMktGameOverview: async () => {
    try {
      const response = await staffAPI.get('/staff/mkt/game/overview');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể tải báo cáo game');
    }
  },
};

export default staffService;

