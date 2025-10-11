import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const adminAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào header
adminAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Service cho admin quản lý bet
 */
class AdminBetService {

  /**
   * Lấy danh sách bet với filter
   */
  async getAllBets(params = {}) {
    try {
      const response = await adminAPI.get('/admin/bets', {
        params: {
          status: params.status || null,
          betType: params.betType || null,
          region: params.region || null,
          userId: params.userId || null,
          searchTerm: params.searchTerm || null,
          page: params.page || 0,
          size: params.size || 20
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting bets:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Lấy chi tiết bet
   */
  async getBetById(betId) {
    try {
      const response = await adminAPI.get(`/admin/bets/${betId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting bet:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Nhập kết quả xổ số cho bet
   * CHỈ cho phép nhập khi bet có status = PENDING
   * Hệ thống sẽ tự động check thắng/thua khi đến thời gian
   */
  async updateBetResult(betId, winningNumbers = []) {
    try {
      const response = await adminAPI.post(
        `/admin/bets/${betId}/update-result`,
        {
          winningNumbers
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating bet result:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Xóa bet
   * CHỈ cho phép xóa khi bet có status = PENDING
   */
  async deleteBet(betId) {
    try {
      const response = await adminAPI.delete(`/admin/bets/${betId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting bet:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Lấy thống kê bet
   */
  async getBetStatistics() {
    try {
      const response = await adminAPI.get('/admin/bets/statistics');
      return response.data;
    } catch (error) {
      console.error('Error getting bet statistics:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Format số tiền
   */
  formatMoney(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount);
  }

  /**
   * Format ngày giờ
   */
  formatDateTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Lấy label cho status
   */
  getStatusLabel(status) {
    const labels = {
      PENDING: 'Đang chờ',
      WON: 'Thắng',
      LOST: 'Thua',
      CANCELLED: 'Đã hủy'
    };
    return labels[status] || status;
  }

  /**
   * Lấy class CSS cho status
   */
  getStatusClass(status) {
    const classes = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      WON: 'bg-green-100 text-green-800',
      LOST: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-gray-100 text-gray-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  /**
   * Lấy tên loại cược
   */
  getBetTypeName(betType) {
    const names = {
      'loto2s': 'Lô 2 số',
      'loto-2-so': 'Lô 2 số',
      'loto3s': 'Lô 3 số',
      'loto-3s': 'Lô 3 số',
      'loto4s': 'Lô 4 số',
      'loto-4s': 'Lô 4 số',
      'loto-xien-2': 'Xiên 2',
      'loto-xien-3': 'Xiên 3',
      'loto-xien-4': 'Xiên 4',
      '3s-dac-biet': '3 số đặc biệt',
      '4s-dac-biet': '4 số đặc biệt',
      'giai-nhat': 'Giải nhất',
      '3s-giai-nhat': '3D Giải nhất',
      '3s-giai-6': '3 số Giải 6',
      'de-giai-7': 'Đề Giải 7',
      'dau-duoi': 'Đầu đuôi',
      '3s-dau-duoi': '3 số đầu đuôi',
      'dac-biet': 'Đặc biệt',
      'dau-dac-biet': 'Đầu đặc biệt',
      'de-giai-8': 'Đề Giải 8',
      'dau-duoi-mien-trung-nam': 'Đầu đuôi MTN',
      '3s-dau-duoi-mien-trung-nam': '3 số đầu đuôi MTN',
      '3s-giai-7': '3 số Giải 7',
      'loto-truot-4': 'Lô trượt 4',
      'loto-truot-8': 'Lô trượt 8',
      'loto-truot-10': 'Lô trượt 10'
    };
    return names[betType] || betType;
  }

  /**
   * Lấy tên khu vực
   */
  getRegionName(region) {
    const names = {
      'mienBac': 'Miền Bắc',
      'mienTrungNam': 'Miền Trung Nam'
    };
    return names[region] || region;
  }
}

export default new AdminBetService();

