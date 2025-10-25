import axios from 'axios';

const API_BASE_URL = 'https://api.loto79.online/api';

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
   * Cập nhật số đã chọn của bet
   * CHỈ cho phép cập nhật khi bet có status = PENDING
   */
  async updateBetSelectedNumbers(betId, selectedNumbers = []) {
    try {
      const response = await adminAPI.post(
        `/admin/bets/${betId}/update-selected-numbers`,
        selectedNumbers
      );
      return response.data;
    } catch (error) {
      console.error('Error updating bet selected numbers:', error);
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
   * Kiểm tra kết quả tất cả bet đang chờ (manual trigger)
   */
  async checkAllBetResults() {
    try {
      const response = await adminAPI.post('/admin/bets/check-results');
      return response.data;
    } catch (error) {
      console.error('Error checking bet results:', error);
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

  /**
   * Format số đã chọn theo loại cược
   * Đặc biệt xử lý cho các loại cược phức tạp như xiên
   */
  formatSelectedNumbers(betType, selectedNumbers) {
    if (!selectedNumbers || selectedNumbers.length === 0) {
      return 'Không có';
    }

    // Các loại cược xiên - hiển thị theo cụm
    if (betType === 'loto-xien-2') {
      // Xiên 2: hiển thị theo cặp (mỗi 2 số = 1 cụm)
      const groups = [];
      for (let i = 0; i < selectedNumbers.length; i += 2) {
        if (i + 1 < selectedNumbers.length) {
          groups.push(`(${selectedNumbers[i]}, ${selectedNumbers[i + 1]})`);
        } else {
          groups.push(`(${selectedNumbers[i]})`);
        }
      }
      return groups.join(' + ');
    }

    if (betType === 'loto-xien-3') {
      // Xiên 3: hiển thị theo nhóm 3 số
      const groups = [];
      for (let i = 0; i < selectedNumbers.length; i += 3) {
        const group = selectedNumbers.slice(i, i + 3);
        groups.push(`(${group.join(', ')})`);
      }
      return groups.join(' + ');
    }

    if (betType === 'loto-xien-4') {
      // Xiên 4: hiển thị theo nhóm 4 số
      const groups = [];
      for (let i = 0; i < selectedNumbers.length; i += 4) {
        const group = selectedNumbers.slice(i, i + 4);
        groups.push(`(${group.join(', ')})`);
      }
      return groups.join(' + ');
    }

    // Các loại cược khác - hiển thị bình thường
    return selectedNumbers.join(', ');
  }

  /**
   * Parse số đã chọn từ string về array
   * Xử lý cả định dạng xiên và bình thường
   */
  parseSelectedNumbers(betType, selectedNumbersString) {
    if (!selectedNumbersString || selectedNumbersString.trim() === '') {
      return [];
    }

    // Loại bỏ khoảng trắng và split theo dấu phẩy
    let numbers = selectedNumbersString.split(',')
      .map(n => n.trim())
      .filter(n => n.length > 0);

    // Đối với xiên, có thể có format như "12, 34, 56, 78" hoặc "(12, 34), (56, 78)"
    if (betType.includes('xien')) {
      // Nếu có dấu ngoặc đơn, parse theo format xiên
      if (selectedNumbersString.includes('(')) {
        const groups = selectedNumbersString.split('+')
          .map(g => g.trim())
          .map(g => g.replace(/[()]/g, ''))
          .filter(g => g.length > 0);
        
        numbers = [];
        groups.forEach(group => {
          const groupNumbers = group.split(',')
            .map(n => n.trim())
            .filter(n => n.length > 0);
          numbers.push(...groupNumbers);
        });
      }
    }

    return numbers;
  }
}

export default new AdminBetService();

