import { API_BASE_URL } from '../utils/constants';

class BetService {
  /**
   * Đặt cược mới
   */
  async placeBet(betData) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vui lòng đăng nhập để đặt cược');
      }

      const response = await fetch(`${API_BASE_URL}/bets/place`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(betData)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Có lỗi xảy ra khi đặt cược');
      }

      return result;
    } catch (error) {
      console.error('Error placing bet:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách bet của user
   */
  async getMyBets(page = 0, size = 20) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vui lòng đăng nhập');
      }

      const response = await fetch(`${API_BASE_URL}/bets/my-bets?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Có lỗi xảy ra khi lấy danh sách cược');
      }

      return result;
    } catch (error) {
      console.error('Error getting my bets:', error);
      throw error;
    }
  }

  /**
   * Lấy bet theo ID
   */
  async getBetById(betId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vui lòng đăng nhập');
      }

      const response = await fetch(`${API_BASE_URL}/bets/${betId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Có lỗi xảy ra khi lấy thông tin cược');
      }

      return result;
    } catch (error) {
      console.error('Error getting bet by id:', error);
      throw error;
    }
  }

  /**
   * Lấy bet gần đây của user
   */
  async getRecentBets(limit = 10, page = 1) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vui lòng đăng nhập');
      }

      const response = await fetch(`${API_BASE_URL}/bets/recent?limit=${limit}&page=${page}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Có lỗi xảy ra khi lấy cược gần đây');
      }

      return result;
    } catch (error) {
      console.error('Error getting recent bets:', error);
      throw error;
    }
  }

  /**
   * Lấy thống kê bet của user
   */
  async getBetStatistics() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vui lòng đăng nhập');
      }

      const response = await fetch(`${API_BASE_URL}/bets/statistics`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Có lỗi xảy ra khi lấy thống kê');
      }

      return result;
    } catch (error) {
      console.error('Error getting bet statistics:', error);
      throw error;
    }
  }

  /**
   * Hủy bet - CHỨC NĂNG ĐÃ BỊ VÔ HIỆU HÓA
   * Đặt cược rồi thì không được hủy để tránh xung đột logic
   * @deprecated Chức năng này đã bị vô hiệu hóa
   */
  async cancelBet(betId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vui lòng đăng nhập');
      }

      const response = await fetch(`${API_BASE_URL}/bets/${betId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Có lỗi xảy ra khi hủy cược');
      }

      return result;
    } catch (error) {
      console.error('Error cancelling bet:', error);
      throw error;
    }
  }

  /**
   * Kiểm tra kết quả cho 1 bet cụ thể
   */
  async checkSingleBetResult(betId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vui lòng đăng nhập');
      }

      const response = await fetch(`${API_BASE_URL}/bets/${betId}/check-result`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Có lỗi xảy ra khi kiểm tra kết quả');
      }

      return result;
    } catch (error) {
      console.error('Error checking bet result:', error);
      throw error;
    }
  }

  /**
   * Đánh dấu bet đã xem kết quả (dismiss)
   */
  async dismissBetResult(betId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vui lòng đăng nhập');
      }

      const response = await fetch(`${API_BASE_URL}/bets/${betId}/dismiss`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Có lỗi xảy ra khi đóng kết quả');
      }

      return result;
    } catch (error) {
      console.error('Error dismissing bet result:', error);
      throw error;
    }
  }

  /**
   * Kiểm tra kết quả bet (admin - để test)
   */
  async checkBetResults() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vui lòng đăng nhập');
      }

      const response = await fetch(`${API_BASE_URL}/bets/check-results`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Có lỗi xảy ra khi kiểm tra kết quả');
      }

      return result;
    } catch (error) {
      console.error('Error checking bet results:', error);
      throw error;
    }
  }

  /**
   * Format bet data để gửi lên server
   */
  formatBetData(region, betType, selectedNumbers, betAmount, pricePerPoint, odds) {
    return {
      region,
      betType,
      selectedNumbers,
      betAmount,
      pricePerPoint,
      odds
    };
  }

  /**
   * Format bet status để hiển thị
   */
  formatBetStatus(status) {
    const statusMap = {
      'PENDING': { text: 'Chờ kết quả', color: 'text-yellow-600', bg: 'bg-yellow-100' },
      'WON': { text: 'Thắng', color: 'text-green-600', bg: 'bg-green-100' },
      'LOST': { text: 'Thua', color: 'text-red-600', bg: 'bg-red-100' }
      // 'CANCELLED' đã bị loại bỏ - không cho phép hủy cược
    };

    return statusMap[status] || statusMap['PENDING'];
  }

  /**
   * Format bet type để hiển thị
   */
  formatBetType(betType) {
    const typeMap = {
      'loto2s': 'Lô 2 số',
      'loto-2-so': 'Lô 2 số',
      'loto-xien-2': 'Xiên 2',
      'loto-xien-3': 'Xiên 3',
      'loto-xien-4': 'Xiên 4',
      'loto-3s': 'Lô 3 số',
      'loto-4s': 'Lô 4 số',
      'dac-biet': 'Đặc biệt',
      'giai-nhat': 'Giải nhất',
      'dau-duoi': 'Đầu đuôi'
    };

    return typeMap[betType] || betType;
  }

  /**
   * Format region để hiển thị
   */
  formatRegion(region) {
    const regionMap = {
      'mienBac': 'Miền Bắc',
      'mienTrungNam': 'Miền Trung & Nam'
    };

    return regionMap[region] || region;
  }
}

const betService = new BetService();
export default betService;
