import { API_BASE_URL } from '../utils/constants';

const xocDiaResultHistoryService = {
  fetchHistories: async ({ limit = 102, order = 'asc' } = {}) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/xoc-dia/result-history?limit=${limit}&order=${order}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const cloned = response.clone();
      const payload = await cloned.json().catch(() => ({}));

      if (!response.ok) {
        const message = payload?.message || 'Không thể tải thống kê kết quả Xóc Đĩa';
        return {
          success: false,
          message,
          data: [],
        };
      }

      return {
        success: payload?.success ?? true,
        data: payload?.data ?? [],
        message: payload?.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Không thể tải thống kê kết quả Xóc Đĩa',
        data: [],
      };
    }
  },
};

export default xocDiaResultHistoryService;


