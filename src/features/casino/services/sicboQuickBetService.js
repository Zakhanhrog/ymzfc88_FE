import axios from 'axios';
import { API_BASE_URL } from '../../../utils/constants';

const API_URL = `${API_BASE_URL}/sicbo/quick-bets`;

const sicboQuickBetService = {
  getActiveQuickBets: async (tableNumber = null) => {
    try {
      const params = tableNumber ? { table: tableNumber } : {};
      const response = await axios.get(API_URL, { params });
      return {
        success: true,
        data: response.data?.data || [],
      };
    } catch (error) {
      console.error('Error fetching Sicbo quick bet configs:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy cấu hình quick bet Sicbo',
      };
    }
  },
};

export default sicboQuickBetService;


