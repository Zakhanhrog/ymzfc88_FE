import axios from 'axios';

const API_BASE_URL = 'https://api.loto79.online/api';
const BASE_URL = '/banners';

// Tạo axios instance với cấu hình mặc định
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor để xử lý lỗi
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const bannerService = {
  getActiveBanners: () => apiClient.get(`${BASE_URL}/public/active`),
  getActiveBannersByType: (bannerType) => apiClient.get(`${BASE_URL}/public/type/${bannerType}`),
};
