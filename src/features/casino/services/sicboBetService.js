import { API_BASE_URL } from '../../../utils/constants';
import authService from '../../../services/authService';

const sicboBetService = {
  placeBets: async (payload) => {
    try {
      const response = await authService.makeAuthenticatedRequest(`${API_BASE_URL}/sicbo/bets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const cloned = response.clone();
      const data = await cloned.json().catch(() => ({}));

      if (!response.ok) {
        const errorMessage = data?.message || 'Không thể đặt cược';
        return {
          success: false,
          message: errorMessage,
          data: data?.data ?? null,
        };
      }

      return {
        success: data?.success ?? response.ok,
        data: data?.data ?? null,
        message: data?.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Không thể đặt cược',
        data: null,
      };
    }
  },

  fetchBetHistory: async ({ page = 0, size = 10 } = {}) => {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
    });

    try {
      const response = await authService.makeAuthenticatedRequest(
        `${API_BASE_URL}/sicbo/bets/history?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const cloned = response.clone();
      const data = await cloned.json().catch(() => ({}));

      if (!response.ok) {
        return {
          success: false,
          message: data?.message || 'Không thể tải lịch sử cược',
          data: null,
        };
      }

      return {
        success: data?.success ?? true,
        message: data?.message,
        data: data?.data ?? null,
      };
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Không thể tải lịch sử cược',
        data: null,
      };
    }
  },
};

export default sicboBetService;


