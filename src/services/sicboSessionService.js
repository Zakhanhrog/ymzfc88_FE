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

const sicboSessionService = {
  getCurrentSession: async (tableNumber = 1) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sicbo/session/current?table=${tableNumber}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return parseResponse(response);
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Không thể lấy thông tin phiên Sicbo',
        data: null,
      };
    }
  },

  startNewSession: async (tableNumber = 1) => {
    try {
      const response = await authService.makeAuthenticatedRequest(
        `${API_BASE_URL}/admin/sicbo/session/start`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tableNumber: Number(tableNumber) }),
        }
      );
      return parseResponse(response);
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Không thể bắt đầu phiên Sicbo mới',
        data: null,
      };
    }
  },

  submitResult: async (resultCode, tableNumber = 1) => {
    try {
      const response = await authService.makeAuthenticatedRequest(
        `${API_BASE_URL}/admin/sicbo/session/result`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ resultCode, tableNumber: Number(tableNumber) }),
        }
      );
      return parseResponse(response);
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Không thể lưu kết quả phiên Sicbo',
        data: null,
      };
    }
  },

  getAdminCurrentSession: async (tableNumber = 1) => {
    try {
      const response = await authService.makeAuthenticatedRequest(
        `${API_BASE_URL}/admin/sicbo/session/current?table=${tableNumber}`,
        {
          method: 'GET',
        }
      );
      return parseResponse(response);
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Không thể lấy trạng thái phiên Sicbo',
        data: null,
      };
    }
  },
};

export default sicboSessionService;


