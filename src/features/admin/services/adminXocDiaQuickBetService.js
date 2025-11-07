import axios from 'axios';
import { API_BASE_URL } from '../../../utils/constants';

const ADMIN_API_URL = `${API_BASE_URL}/admin/xoc-dia/quick-bets`;

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

const adminXocDiaQuickBetService = {
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
      console.error('Error fetching Xóc Đĩa quick bet configs:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy cấu hình quick bet',
      };
    }
  },

  create: async (payload) => {
    try {
      const response = await axios.post(ADMIN_API_URL, payload, {
        headers: getAuthHeaders(),
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Error creating Xóc Đĩa quick bet config:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi tạo quick bet',
      };
    }
  },

  update: async (id, payload) => {
    try {
      const response = await axios.put(`${ADMIN_API_URL}/${id}`, payload, {
        headers: getAuthHeaders(),
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error(`Error updating Xóc Đĩa quick bet config ${id}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi cập nhật quick bet',
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
      console.error('Error batch updating Xóc Đĩa quick bet configs:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi cập nhật quick bet',
      };
    }
  },

  remove: async (id) => {
    try {
      const response = await axios.delete(`${ADMIN_API_URL}/${id}`, {
        headers: getAuthHeaders(),
      });
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error(`Error deleting Xóc Đĩa quick bet config ${id}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi xoá quick bet',
      };
    }
  },
};

export default adminXocDiaQuickBetService;


