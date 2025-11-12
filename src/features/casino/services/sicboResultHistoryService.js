import axios from 'axios';
import { API_BASE_URL } from '../../../utils/constants';

const API_URL = `${API_BASE_URL}/sicbo/result-history`;

const sicboResultHistoryService = {
  getRecent: async ({ tableNumber, limit = 90 } = {}) => {
    const params = new URLSearchParams();
    if (tableNumber != null) {
      params.set('table', String(tableNumber));
    }
    params.set('limit', String(limit));

    try {
      const response = await axios.get(`${API_URL}?${params.toString()}`);
      return {
        success: true,
        data: response.data?.data ?? [],
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải cầu Sicbo',
      };
    }
  },
};

export default sicboResultHistoryService;


