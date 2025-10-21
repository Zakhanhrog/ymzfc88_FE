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

// Admin management service
export const adminService = {
  // ============ TRANSACTION MANAGEMENT ============

  // Lấy giao dịch pending
  getPendingTransactions: async (page = 0, size = 10) => {
    try {
      const response = await adminAPI.get(`/admin/transactions/pending?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy giao dịch chờ duyệt');
    }
  },

  // Lấy tất cả giao dịch với filter
  getTransactionsWithFilters: async (filters = {}, page = 0, size = 10) => {
    try {
      const params = new URLSearchParams({
        page,
        size,
        ...filters
      });
      const response = await adminAPI.get(`/admin/transactions?${params}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy danh sách giao dịch');
    }
  },

  // Xử lý giao dịch (approve/reject)
  processTransaction: async (transactionId, action, adminNote = '', actualAmount = null) => {
    try {
      const requestData = {
        transactionId,
        action: action.toUpperCase(),
        adminNote
      };
      
      if (actualAmount !== null) {
        requestData.actualAmount = actualAmount;
      }

      const response = await adminAPI.post('/admin/transactions/process', requestData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi xử lý giao dịch');
    }
  },

  // Lấy chi tiết giao dịch
  getTransactionDetail: async (transactionId) => {
    try {
      const response = await adminAPI.get(`/admin/transactions/${transactionId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy chi tiết giao dịch');
    }
  },

  // ============ PAYMENT METHOD MANAGEMENT ============

  // Lấy tất cả payment methods
  getAllPaymentMethods: async () => {
    try {
      const response = await adminAPI.get('/admin/payment-methods');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy danh sách phương thức thanh toán');
    }
  },

  // Tạo payment method mới
  createPaymentMethod: async (paymentMethodData) => {
    try {
      const response = await adminAPI.post('/admin/payment-methods', paymentMethodData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi tạo phương thức thanh toán');
    }
  },

  // Cập nhật payment method
  updatePaymentMethod: async (id, paymentMethodData) => {
    try {
      const response = await adminAPI.put(`/admin/payment-methods/${id}`, paymentMethodData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật phương thức thanh toán');
    }
  },

  // Xóa payment method
  deletePaymentMethod: async (id) => {
    try {
      const response = await adminAPI.delete(`/admin/payment-methods/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi xóa phương thức thanh toán');
    }
  },

  // Toggle trạng thái payment method
  togglePaymentMethodStatus: async (id) => {
    try {
      const response = await adminAPI.put(`/admin/payment-methods/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi thay đổi trạng thái phương thức thanh toán');
    }
  },

  // ============ USER MANAGEMENT ============

  // Lấy danh sách users
  getAllUsers: async (page = 0, size = 100) => {
    try {
      const response = await adminAPI.get(`/admin/users`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy danh sách người dùng');
    }
  },

  // Lấy danh sách users với phân trang và filter
  getUsersWithFilters: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await adminAPI.get(`/admin/users/paginated?${params}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy danh sách người dùng');
    }
  },

  // Tạo người dùng mới
  createUser: async (userData) => {
    try {
      const response = await adminAPI.post('/admin/users', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi tạo người dùng');
    }
  },

  // Cập nhật thông tin người dùng
  updateUser: async (userId, userData) => {
    try {
      const response = await adminAPI.put(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật người dùng');
    }
  },

  // Xóa người dùng
  deleteUser: async (userId) => {
    try {
      const response = await adminAPI.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi xóa người dùng');
    }
  },

  // Lấy thông tin user theo ID
  getUserById: async (userId) => {
    try {
      const response = await adminAPI.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy thông tin người dùng');
    }
  },

  // Cập nhật trạng thái user
  updateUserStatus: async (userId, status) => {
    try {
      const response = await adminAPI.put(`/admin/users/${userId}/status?status=${status}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái người dùng');
    }
  },

  // Reset mật khẩu người dùng
  resetUserPassword: async (userId, newPassword) => {
    try {
      const response = await adminAPI.post(`/admin/users/${userId}/reset-password?newPassword=${newPassword}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi reset mật khẩu');
    }
  },

  // Note: updateUserBalance đã bị xóa khỏi BE - hệ thống chỉ dùng points
  // Admin có thể cộng/trừ points qua PointService thay thế

  // Lấy thống kê người dùng
  getUserStats: async () => {
    try {
      const response = await adminAPI.get('/admin/users/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy thống kê người dùng');
    }
  },

  // Lấy người dùng hoạt động gần đây
  getRecentActiveUsers: async (limit = 10) => {
    try {
      const response = await adminAPI.get(`/admin/users/recent-active?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy người dùng hoạt động gần đây');
    }
  },

  // ============ DEPOSIT MANAGEMENT ============

  // Lấy danh sách yêu cầu nạp tiền
  getDepositRequests: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await adminAPI.get(`/admin/deposits?${params}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy danh sách nạp tiền');
    }
  },

  // Duyệt nạp tiền
  approveDeposit: async (depositId) => {
    try {
      const response = await adminAPI.post(`/admin/deposits/${depositId}/approve`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi duyệt nạp tiền');
    }
  },

  // Từ chối nạp tiền
  rejectDeposit: async (depositId, reason) => {
    try {
      const response = await adminAPI.post(`/admin/deposits/${depositId}/reject`, { reason });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi từ chối nạp tiền');
    }
  },

  // Lấy thống kê nạp tiền
  getDepositStatistics: async () => {
    try {
      const response = await adminAPI.get('/admin/deposits/statistics');
      return response.data;
    } catch (error) {
      console.error('Error loading deposit statistics:', error);
      return { success: true, data: {} };
    }
  },

  // ============ WITHDRAW MANAGEMENT ============

  // Lấy danh sách yêu cầu rút tiền
  getWithdrawRequests: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await adminAPI.get(`/admin/withdraws?${params}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy danh sách rút tiền');
    }
  },

  // Duyệt rút tiền
  approveWithdraw: async (withdrawId) => {
    try {
      const response = await adminAPI.post(`/admin/withdraws/${withdrawId}/approve`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi duyệt rút tiền');
    }
  },

  // Từ chối rút tiền
  rejectWithdraw: async (withdrawId, reason) => {
    try {
      const response = await adminAPI.post(`/admin/withdraws/${withdrawId}/reject`, { reason });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi từ chối rút tiền');
    }
  },

  // Lấy thống kê rút tiền
  getWithdrawStatistics: async () => {
    try {
      const response = await adminAPI.get('/admin/withdraws/statistics');
      return response.data;
    } catch (error) {
      console.error('Error loading withdraw statistics:', error);
      return { success: true, data: {} };
    }
  },

  // ============ DASHBOARD STATS ============

  // Lấy thống kê dashboard
  getDashboardStats: async () => {
    try {
      const response = await adminAPI.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy thống kê dashboard');
    }
  },

  // Lấy thông tin admin profile
  getAdminProfile: async () => {
    try {
      const response = await adminAPI.get('/admin/profile');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy thông tin admin');
    }
  },

  // ============ WITHDRAWAL LOCK MANAGEMENT ============

  // Khóa rút tiền cho người dùng
  lockWithdrawal: async (userId, reason) => {
    try {
      const response = await adminAPI.post(`/admin/users/${userId}/lock-withdrawal?reason=${encodeURIComponent(reason)}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi khóa rút tiền');
    }
  },

  // Mở khóa rút tiền cho người dùng
  unlockWithdrawal: async (userId) => {
    try {
      const response = await adminAPI.post(`/admin/users/${userId}/unlock-withdrawal`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi mở khóa rút tiền');
    }
  },

  // Kiểm tra trạng thái khóa rút tiền
  getWithdrawalLockStatus: async (userId) => {
    try {
      const response = await adminAPI.get(`/admin/users/${userId}/withdrawal-lock-status`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy trạng thái khóa rút tiền');
    }
  },

  // ============ SYSTEM SETTINGS MANAGEMENT ============

  // Lấy tất cả cài đặt hệ thống
  getAllSystemSettings: async () => {
    try {
      const response = await adminAPI.get('/admin/system-settings');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy cài đặt hệ thống');
    }
  },

  // Lấy cài đặt theo category
  getSystemSettingsByCategory: async (category) => {
    try {
      const response = await adminAPI.get(`/admin/system-settings/category/${category}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy cài đặt theo category');
    }
  },

  // Lấy cài đặt theo key
  getSystemSettingByKey: async (key) => {
    try {
      const response = await adminAPI.get(`/admin/system-settings/${key}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy cài đặt');
    }
  },

  // Tạo hoặc cập nhật cài đặt
  createOrUpdateSystemSetting: async (settingData) => {
    try {
      const response = await adminAPI.post('/admin/system-settings', settingData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật cài đặt');
    }
  },

  // Xóa cài đặt
  deleteSystemSetting: async (key) => {
    try {
      const response = await adminAPI.delete(`/admin/system-settings/${key}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi xóa cài đặt');
    }
  },

  // Khởi tạo cài đặt mặc định
  initializeDefaultSettings: async () => {
    try {
      const response = await adminAPI.post('/admin/system-settings/initialize');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi khởi tạo cài đặt mặc định');
    }
  }
};

export default adminService;