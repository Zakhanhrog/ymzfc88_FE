import axios from 'axios';
import { API_BASE_URL } from '../../../utils/constants';

const API_URL = `${API_BASE_URL}/sicbo/quick-bets`;

const sicboQuickBetService = {
  getActiveQuickBets: async () => {
    try {
      const response = await axios.get(API_URL);
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


