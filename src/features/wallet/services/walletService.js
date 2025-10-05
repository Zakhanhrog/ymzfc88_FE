// API services for wallet functionality
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

class WalletService {
  // Helper method để lấy headers
  getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  // Helper method để xử lý response
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Log response để debug
      console.log('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      
      // Xử lý các loại lỗi cụ thể
      if (response.status === 500) {
        throw new Error('Đã xảy ra lỗi máy chủ, vui lòng thử lại sau');
      } else if (response.status === 404) {
        throw new Error('Không tìm thấy dữ liệu');
      } else if (response.status === 401) {
        // Chuyển hướng đến trang login nếu chưa đăng nhập
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
      } else if (response.status === 403) {
        throw new Error('Bạn không có quyền thực hiện thao tác này');
      } else if (response.status === 400) {
        // Bad request - thường là validation error
        const errorMessage = errorData.message || 'Dữ liệu không hợp lệ';
        if (errorData.errors && Array.isArray(errorData.errors)) {
          // Nếu có danh sách lỗi validation chi tiết
          throw new Error(errorData.errors.join(', '));
        }
        throw new Error(errorMessage);
      }
      
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  }

  // Lấy thông tin user (bao gồm số dư)
  async getUserInfo() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  }

  // Lấy số dư ví
  async getWalletBalance() {
    try {
      const response = await fetch(`${API_BASE_URL}/wallet/balance`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      throw error;
    }
  }

  // Lấy danh sách phương thức thanh toán
  async getPaymentMethods() {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/payment-methods`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  }

  // Lấy phương thức thanh toán theo loại
  async getPaymentMethodsByType(type) {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/payment-methods/${type}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching payment methods by type:', error);
      throw error;
    }
  }

  // Tạo lệnh nạp tiền
  async createDepositOrder(depositData) {
    try {
      // Log dữ liệu gửi đi để debug
      console.log('Sending deposit data:', depositData);
      
      const response = await fetch(`${API_BASE_URL}/transactions/deposit`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(depositData)
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error creating deposit order:', error);
      throw error;
    }
  }

  // Tạo lệnh rút tiền với UserPaymentMethod
  async createWithdrawOrder(withdrawData) {
    try {
      // Log dữ liệu gửi đi để debug
      console.log('Sending withdraw data:', withdrawData);
      
      const response = await fetch(`${API_BASE_URL}/transactions/user-withdraw`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(withdrawData)
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error creating withdraw order:', error);
      throw error;
    }
  }

  // Tạo lệnh rút tiền (legacy method)
  async createLegacyWithdrawOrder(withdrawData) {
    try {
      // Log dữ liệu gửi đi để debug
      console.log('Sending legacy withdraw data:', withdrawData);
      
      const response = await fetch(`${API_BASE_URL}/transactions/withdraw`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(withdrawData)
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error creating legacy withdraw order:', error);
      throw error;
    }
  }

  // Lấy lịch sử giao dịch
  async getTransactionHistory(page = 0, size = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/history?page=${page}&size=${size}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  }

  // Lấy giao dịch theo loại
  async getTransactionsByType(type) {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/history/${type}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching transactions by type:', error);
      throw error;
    }
  }

  // Lấy chi tiết giao dịch
  async getTransactionDetail(transactionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching transaction detail:', error);
      throw error;
    }
  }

  // ============ USER PAYMENT METHODS MANAGEMENT ============

  // Lấy danh sách phương thức thanh toán cá nhân của user
  async getUserPaymentMethods() {
    try {
      const response = await fetch(`${API_BASE_URL}/user/payment-methods`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching user payment methods:', error);
      throw error;
    }
  }

  // Tạo phương thức thanh toán cá nhân mới
  async createUserPaymentMethod(paymentMethodData) {
    try {
      console.log('Creating user payment method:', paymentMethodData);
      
      const response = await fetch(`${API_BASE_URL}/user/payment-methods`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(paymentMethodData)
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error creating user payment method:', error);
      throw error;
    }
  }

  // Cập nhật phương thức thanh toán cá nhân
  async updateUserPaymentMethod(id, paymentMethodData) {
    try {
      console.log('Updating user payment method:', id, paymentMethodData);
      
      const response = await fetch(`${API_BASE_URL}/user/payment-methods/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(paymentMethodData)
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error updating user payment method:', error);
      throw error;
    }
  }

  // Xóa phương thức thanh toán cá nhân
  async deleteUserPaymentMethod(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/payment-methods/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error deleting user payment method:', error);
      throw error;
    }
  }

  // Đặt phương thức thanh toán làm mặc định
  async setDefaultUserPaymentMethod(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/payment-methods/${id}/set-default`, {
        method: 'PUT',
        headers: this.getHeaders()
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error setting default user payment method:', error);
      throw error;
    }
  }

}

const walletService = new WalletService();

export default walletService;