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
};

export default sicboBetService;


