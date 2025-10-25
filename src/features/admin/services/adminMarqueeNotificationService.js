import axios from 'axios';

const API_BASE_URL = 'https://api.loto79.online/api';

// Tạo axios instance với cấu hình mặc định
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Interceptor để thêm token vào header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['X-Username'] = localStorage.getItem('adminUsername') || 'admin';
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
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUsername');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const marqueeNotificationService = {
  // Lấy danh sách marquee notification với phân trang
  async getMarqueeNotifications(page = 0, size = 10, keyword = '') {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });
      
      if (keyword) {
        params.append('keyword', keyword);
      }
      
      const response = await apiClient.get(`/marquee-notifications?${params.toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching marquee notifications:', error);
      throw error;
    }
  },

  // Lấy marquee notification theo ID
  async getMarqueeNotificationById(id) {
    try {
      const response = await apiClient.get(`/marquee-notifications/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching marquee notification by ID:', error);
      throw error;
    }
  },

  // Tạo mới marquee notification
  async createMarqueeNotification(data) {
    try {
      const response = await apiClient.post('/marquee-notifications', data);
      return response;
    } catch (error) {
      console.error('Error creating marquee notification:', error);
      throw error;
    }
  },

  // Cập nhật marquee notification
  async updateMarqueeNotification(id, data) {
    try {
      const response = await apiClient.put(`/marquee-notifications/${id}`, data);
      return response;
    } catch (error) {
      console.error('Error updating marquee notification:', error);
      throw error;
    }
  },

  // Xóa marquee notification
  async deleteMarqueeNotification(id) {
    try {
      const response = await apiClient.delete(`/marquee-notifications/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting marquee notification:', error);
      throw error;
    }
  },

  // Thay đổi trạng thái hoạt động
  async toggleActiveStatus(id) {
    try {
      const response = await apiClient.patch(`/marquee-notifications/${id}/toggle-active`);
      return response;
    } catch (error) {
      console.error('Error toggling active status:', error);
      throw error;
    }
  },

  // Cập nhật thứ tự hiển thị
  async updateDisplayOrder(id, displayOrder) {
    try {
      const response = await apiClient.patch(`/marquee-notifications/${id}/display-order?displayOrder=${displayOrder}`);
      return response;
    } catch (error) {
      console.error('Error updating display order:', error);
      throw error;
    }
  },

  // Lấy danh sách marquee notification đang hoạt động (public API)
  async getActiveMarqueeNotifications() {
    try {
      const response = await apiClient.get('/marquee-notifications/public/active');
      return response;
    } catch (error) {
      console.error('Error fetching active marquee notifications:', error);
      throw error;
    }
  }
};
