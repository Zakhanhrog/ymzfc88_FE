import axios from 'axios';

const API_URL = 'http://localhost:8080/api/admin';

/**
 * Service để call API betting odds cho admin
 */
const adminBettingOddsService = {
  /**
   * Lấy tất cả tỷ lệ cược
   */
  getAllBettingOdds: async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/betting-odds`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error getting all betting odds:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy tỷ lệ cược'
      };
    }
  },

  /**
   * Lấy tỷ lệ cược theo region
   */
  getBettingOddsByRegion: async (region) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/betting-odds/region/${region}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
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
   * Lấy tỷ lệ cược theo ID
   */
  getBettingOddsById: async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/betting-odds/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error(`Error getting betting odds with id ${id}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi lấy tỷ lệ cược'
      };
    }
  },

  /**
   * Tạo mới tỷ lệ cược
   */
  createBettingOdds: async (data) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(`${API_URL}/betting-odds`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error creating betting odds:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi tạo tỷ lệ cược'
      };
    }
  },

  /**
   * Cập nhật tỷ lệ cược
   */
  updateBettingOdds: async (id, data) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(`${API_URL}/betting-odds/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error(`Error updating betting odds with id ${id}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi cập nhật tỷ lệ cược'
      };
    }
  },

  /**
   * Cập nhật hàng loạt tỷ lệ cược
   */
  batchUpdateBettingOdds: async (dataList) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(`${API_URL}/betting-odds/batch`, dataList, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error batch updating betting odds:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi cập nhật hàng loạt tỷ lệ cược'
      };
    }
  },

  /**
   * Xóa tỷ lệ cược
   */
  deleteBettingOdds: async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.delete(`${API_URL}/betting-odds/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error(`Error deleting betting odds with id ${id}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi xóa tỷ lệ cược'
      };
    }
  }
};

export default adminBettingOddsService;

