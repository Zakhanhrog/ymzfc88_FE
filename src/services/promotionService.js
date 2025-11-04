import axios from 'axios';

// Tạo axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào header
apiClient.interceptors.request.use(
  (config) => {
    // Sử dụng adminToken cho admin endpoints
    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('token');
    const token = adminToken || userToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn, đăng xuất user/admin
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

const promotionService = {
  /**
   * Lấy tất cả promotions đang hoạt động (public)
   */
  async getActivePromotions() {
    try {
      const response = await apiClient.get('/promotions');
      return response.data;
    } catch (error) {
      console.error('Error fetching active promotions:', error);
      throw error;
    }
  },

  /**
   * Lấy promotions đang hoạt động với phân trang (public)
   */
  async getActivePromotionsPaged(page = 0, size = 10) {
    try {
      const response = await apiClient.get(`/promotions/paged?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching active promotions with pagination:', error);
      throw error;
    }
  },

  /**
   * Lấy promotion theo ID (public)
   */
  async getPromotionById(id) {
    try {
      const response = await apiClient.get(`/promotions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching promotion by ID:', error);
      throw error;
    }
  },

  // ================ ADMIN METHODS ================

  /**
   * Lấy tất cả promotions (admin)
   */
  async getAllPromotions() {
    try {
      const response = await apiClient.get('/admin/promotions');
      return response.data;
    } catch (error) {
      console.error('Error fetching all promotions:', error);
      throw error;
    }
  },

  /**
   * Lấy tất cả promotions với phân trang (admin)
   */
  async getAllPromotionsPaged(page = 0, size = 10) {
    try {
      const response = await apiClient.get(`/admin/promotions/paged?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all promotions with pagination:', error);
      throw error;
    }
  },

  /**
   * Tạo promotion mới (admin)
   */
  async createPromotion(promotionData) {
    try {
      console.log('Creating promotion:', promotionData);
      const response = await apiClient.post('/admin/promotions', promotionData);
      console.log('Promotion created successfully:', response);
      return response.data;
    } catch (error) {
      console.error('Error creating promotion:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      throw error;
    }
  },

  /**
   * Cập nhật promotion (admin)
   */
  async updatePromotion(id, promotionData) {
    try {
      console.log(`Updating promotion ${id}:`, promotionData);
      const response = await apiClient.put(`/admin/promotions/${id}`, promotionData);
      console.log('Promotion updated successfully:', response);
      return response.data;
    } catch (error) {
      console.error('Error updating promotion:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      throw error;
    }
  },

  /**
   * Xóa promotion (admin)
   */
  async deletePromotion(id) {
    try {
      console.log(`Deleting promotion ${id}`);
      const response = await apiClient.delete(`/admin/promotions/${id}`);
      console.log('Promotion deleted successfully:', response);
      return response.data;
    } catch (error) {
      console.error('Error deleting promotion:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      throw error;
    }
  },

  /**
   * Toggle trạng thái promotion (admin)
   */
  async togglePromotionStatus(id) {
    try {
      console.log(`Toggling promotion status ${id}`);
      const response = await apiClient.patch(`/admin/promotions/${id}/toggle`);
      console.log('Promotion status toggled successfully:', response);
      return response.data;
    } catch (error) {
      console.error('Error toggling promotion status:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      throw error;
    }
  },

  /**
   * Upload ảnh promotion
   */
  async uploadPromotionImage(file) {
    try {
      console.log('Uploading promotion image:', file.name);
      
      // Convert file to base64
      const base64 = await this.fileToBase64(file);
      
      console.log('Sending request to:', '/files/promotions/upload');
      console.log('Request data:', { image: base64.substring(0, 50) + '...', fileName: file.name });
      
      const response = await apiClient.post('/files/promotions/upload', {
        image: base64,
        fileName: file.name
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Upload promotion image response:', response);
      console.log('Response data keys:', Object.keys(response || {}));
      
      // Kiểm tra response structure (response interceptor đã trả về response.data)
      if (response && response.imageUrl) {
        return response.imageUrl;
      } else if (response && response.url) {
        return response.url;
      } else if (typeof response === 'string') {
        return response;
      } else {
        console.error('Unexpected response structure:', response);
        throw new Error('Invalid response from server: ' + JSON.stringify(response));
      }
    } catch (error) {
      console.error('Error uploading promotion image:', error);
      throw error;
    }
  },

  /**
   * Convert file to base64
   */
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Remove data:image/jpeg;base64, prefix
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }
};

export default promotionService;
