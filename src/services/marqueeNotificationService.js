import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Tạo axios instance với cấu hình mặc định
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const marqueeNotificationService = {
  // Lấy danh sách marquee notification đang hoạt động (public API)
  async getActiveMarqueeNotifications() {
    try {
      const response = await apiClient.get('/marquee-notifications/public/active');
      return response.data;
    } catch (error) {
      console.error('Error fetching active marquee notifications:', error);
      throw error;
    }
  }
};
