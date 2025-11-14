// API services for admin functionality
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

class AdminService {
  // Helper method để lấy headers
  getHeaders() {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  // Helper method để xử lý response
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  }

  // Đăng nhập admin
  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error admin login:', error);
      throw error;
    }
  }

  // Lấy thống kê dashboard
  async getDashboardStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // Lấy danh sách giao dịch (admin)
  async getTransactions(page = 0, size = 10, filters = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...filters
      });

      const response = await fetch(`${API_BASE_URL}/admin/transactions?${queryParams}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  // Duyệt giao dịch
  async approveTransaction(transactionId, adminNote = '') {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/transactions/${transactionId}/approve`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ adminNote })
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error approving transaction:', error);
      throw error;
    }
  }

  // Từ chối giao dịch
  async rejectTransaction(transactionId, adminNote) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/transactions/${transactionId}/reject`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ adminNote })
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error rejecting transaction:', error);
      throw error;
    }
  }

  // Lấy danh sách phương thức thanh toán (admin)
  async getPaymentMethods() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/payment-methods`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  }

  // Tạo phương thức thanh toán
  async createPaymentMethod(methodData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/payment-methods`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(methodData)
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error creating payment method:', error);
      throw error;
    }
  }

  // Cập nhật phương thức thanh toán
  async updatePaymentMethod(methodId, methodData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/payment-methods/${methodId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(methodData)
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error updating payment method:', error);
      throw error;
    }
  }

  // Xóa phương thức thanh toán
  async deletePaymentMethod(methodId) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/payment-methods/${methodId}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  }

  // Lấy danh sách người dùng
  async getUsers(page = 0, size = 10, search = '') {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        search
      });

      const response = await fetch(`${API_BASE_URL}/admin/users?${queryParams}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Cập nhật trạng thái người dùng
  async updateUserStatus(userId, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({ status })
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }
}

const adminService = new AdminService();

export default adminService;