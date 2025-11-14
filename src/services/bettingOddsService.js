import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

/**
 * Service để call API betting odds cho user
 */
const bettingOddsService = {
  /**
   * Lấy tất cả tỷ lệ cược đang active
   */
  getAllActiveBettingOdds: async () => {
    try {
      const response = await axios.get(`${API_URL}/betting-odds`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error getting all active betting odds:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy tỷ lệ cược'
      };
    }
  },

  /**
   * Lấy tỷ lệ cược theo region (MIEN_BAC hoặc MIEN_TRUNG_NAM)
   */
  getBettingOddsByRegion: async (region) => {
    try {
      const response = await axios.get(`${API_URL}/betting-odds/region/${region}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error(`Error getting betting odds for region ${region}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy tỷ lệ cược'
      };
    }
  },

  /**
   * Lấy tỷ lệ cược cho Miền Bắc
   */
  getMienBacBettingOdds: async () => {
    return bettingOddsService.getBettingOddsByRegion('MIEN_BAC');
  },

  /**
   * Lấy tỷ lệ cược cho Miền Trung & Nam
   */
  getMienTrungNamBettingOdds: async () => {
    return bettingOddsService.getBettingOddsByRegion('MIEN_TRUNG_NAM');
  }
};

export default bettingOddsService;

