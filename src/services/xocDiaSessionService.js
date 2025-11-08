import { API_BASE_URL } from '../utils/constants';
import authService from './authService';

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  return {
    success: data?.success ?? false,
    data: data?.data ?? null,
    message: data?.message,
  };
};

const xocDiaSessionService = {
  getCurrentSession: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/xoc-dia/session/current`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return parseResponse(response);
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Không thể lấy thông tin phiên Xóc Đĩa',
        data: null,
      };
    }
  },

  startNewSession: async () => {
    try {
      const response = await authService.makeAuthenticatedRequest(
        `${API_BASE_URL}/admin/xoc-dia/session/start`,
        {
          method: 'POST',
        }
      );
      return parseResponse(response);
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Không thể bắt đầu phiên mới',
        data: null,
      };
    }
  },

  submitResult: async (resultCode) => {
    try {
      const response = await authService.makeAuthenticatedRequest(
        `${API_BASE_URL}/admin/xoc-dia/session/result`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ resultCode }),
        }
      );
      return parseResponse(response);
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Không thể lưu kết quả phiên',
        data: null,
      };
    }
  },

  getAdminCurrentSession: async () => {
    try {
      const response = await authService.makeAuthenticatedRequest(
        `${API_BASE_URL}/admin/xoc-dia/session/current`,
        {
          method: 'GET',
        }
      );
      return parseResponse(response);
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Không thể lấy trạng thái phiên Xóc Đĩa',
        data: null,
      };
    }
  },
};

export default xocDiaSessionService;

