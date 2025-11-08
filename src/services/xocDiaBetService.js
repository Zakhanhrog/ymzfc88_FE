import { API_BASE_URL } from '../utils/constants';
import authService from './authService';

const parseJsonResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  return {
    success: data?.success ?? false,
    data: data?.data ?? null,
    message: data?.message,
  };
};

const xocDiaBetService = {
  placeBets: async (payload) => {
    try {
      const response = await authService.makeAuthenticatedRequest(`${API_BASE_URL}/xoc-dia/bets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      return parseJsonResponse(response);
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Không thể đặt cược',
        data: null,
      };
    }
  },
};

export default xocDiaBetService;


