import { API_BASE_URL } from '../utils/constants';

const xocDiaQuickBetService = {
  getActiveQuickBets: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/xoc-dia/quick-bets`);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      const data = await response.json();
      return {
        success: data.success,
        data: data.data || [],
        message: data.message,
      };
    } catch (error) {
      console.error('Error fetching Xóc Đĩa quick bets:', error);
      return {
        success: false,
        message: error.message || 'Không thể tải danh sách quick bet',
        data: [],
      };
    }
  },
};

export default xocDiaQuickBetService;


