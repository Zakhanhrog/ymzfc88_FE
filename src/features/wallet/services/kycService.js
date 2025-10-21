const API_BASE_URL = 'http://localhost:8080/api';

const getAuthHeader = () => {
  // Ưu tiên userToken cho user endpoints, adminToken cho admin endpoints
  const userToken = localStorage.getItem('token');
  const adminToken = localStorage.getItem('adminToken');
  
  // Ưu tiên user token trước (vì đây là kycService cho user)
  const token = userToken || adminToken;
  
  return {
    'Authorization': `Bearer ${token}`
  };
};

const kycService = {
  // User: Submit KYC verification
  submitKyc: async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/kyc/submit`, {
        method: 'POST',
        headers: {
          ...getAuthHeader()
        },
        body: formData // FormData với frontImage, backImage, idNumber, fullName
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Gửi yêu cầu xác thực thất bại');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // User: Get KYC status
  getKycStatus: async () => {
    try {
      const headers = {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      };
      
      const response = await fetch(`${API_BASE_URL}/kyc/status`, {
        method: 'GET',
        headers: headers
      });

      if (!response.ok) {
        if (response.status === 403) {
          return { success: false, data: null };
        }
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Lấy trạng thái xác thực thất bại');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // Return default response instead of throwing
      return { success: false, data: null };
    }
  },

  // Admin: Get all KYC requests
  getAllKycRequests: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/kyc/admin/all`, {
        method: 'GET',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Bạn không có quyền truy cập. Vui lòng đăng nhập lại.');
        }
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Lấy danh sách xác thực thất bại');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Admin: Get pending KYC requests
  getPendingKycRequests: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/kyc/admin/pending`, {
        method: 'GET',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Bạn không có quyền truy cập. Vui lòng đăng nhập lại.');
        }
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Lấy danh sách chờ duyệt thất bại');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Admin: Process KYC (approve or reject)
  processKyc: async (kycId, action, rejectedReason = '', adminNotes = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/kyc/admin/process`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          kycId,
          action, // 'approve' or 'reject'
          rejectedReason,
          adminNotes
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Xử lý yêu cầu xác thực thất bại');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }
};

export default kycService;

