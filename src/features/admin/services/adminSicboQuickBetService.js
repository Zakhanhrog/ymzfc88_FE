import axios from 'axios';
import { API_BASE_URL } from '../../../utils/constants';

const ADMIN_API_URL = `${API_BASE_URL}/admin/sicbo/quick-bets`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const adminSicboQuickBetService = {
  getAll: async () => {
    try {
      const response = await axios.get(ADMIN_API_URL, {
        headers: getAuthHeaders(),
      });
      return {
        success: true,
        data: response.data.data || [],
      };
    } catch (error) {
      console.error('Error fetching Sicbo quick bet configs:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy cấu hình quick bet Sicbo',
      };
    }
  },

  batchUpdate: async (payloads) => {
    try {
      const response = await axios.put(`${ADMIN_API_URL}/batch`, payloads, {
        headers: getAuthHeaders(),
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Error batch updating Sicbo quick bet configs:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi cập nhật quick bet Sicbo',
      };
    }
  },
};

export default adminSicboQuickBetService;


