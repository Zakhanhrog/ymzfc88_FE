import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.loto79.online/api';

// Tạo axios instance với cấu hình mặc định
const apiClient = axios.create({
  baseURL: API_BASE_URL,
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

export const contactService = {
  /**
   * Lấy tất cả contact links (public endpoint)
   */
  async getContactLinks() {
    try {
      const response = await apiClient.get('/public/contact-links');
      return response.data;
    } catch (error) {
      console.error('Error fetching contact links:', error);
      throw error;
    }
  },

  /**
   * Lấy tất cả contact links (admin endpoint)
   */
  async getContactLinksAdmin() {
    try {
      const response = await apiClient.get('/admin/system-settings/contact-links');
      return response.data;
    } catch (error) {
      console.error('Error fetching contact links:', error);
      throw error;
    }
  },

  /**
   * Cập nhật contact link
   */
  async updateContactLink(linkType, linkUrl) {
    try {
      console.log(`Updating contact link: ${linkType} = ${linkUrl}`);
      
      // Debug token
      const adminToken = localStorage.getItem('adminToken');
      const userToken = localStorage.getItem('token');
      console.log('Admin token exists:', !!adminToken);
      console.log('User token exists:', !!userToken);
      
      const response = await apiClient.post(`/admin/system-settings/contact-links/${linkType}`, {
        linkUrl: linkUrl
      });
      console.log('Contact link updated successfully:', response);
      return response.data;
    } catch (error) {
      console.error('Error updating contact link:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      throw error;
    }
  },

  /**
   * Lấy tất cả system settings (cho admin)
   */
  async getAllSettings() {
    try {
      const response = await apiClient.get('/admin/system-settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching system settings:', error);
      throw error;
    }
  },

  /**
   * Cập nhật system setting
   */
  async updateSetting(settingKey, settingValue, description, category) {
    try {
      const response = await apiClient.post('/admin/system-settings', {
        settingKey,
        settingValue,
        description,
        category
      });
      return response.data;
    } catch (error) {
      console.error('Error updating system setting:', error);
      throw error;
    }
  }
};

export default contactService;
