import axios from 'axios';
import { API_BASE_URL } from '../../../utils/constants';

// Configure axios instance for admin API
const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to include auth token
adminApi.interceptors.request.use(
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
 * Service để quản lý kết quả xổ số (Admin)
 */
class AdminLotteryResultService {
  
  /**
   * Lấy tất cả kết quả (phân trang)
   */
  async getAllLotteryResults(page = 0, size = 20) {
    try {
      const response = await adminApi.get(`/admin/lottery-results`, {
        params: { page, size }
      });
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error getting lottery results:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi lấy kết quả xổ số'
      };
    }
  }

  /**
   * Lấy kết quả theo region
   */
  async getLotteryResultsByRegion(region, page = 0, size = 20) {
    try {
      const response = await adminApi.get(`/admin/lottery-results/region/${region}`, {
        params: { page, size }
      });
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error getting lottery results by region:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra'
      };
    }
  }

  /**
   * Lấy kết quả theo region và province
   */
  async getLotteryResultsByRegionAndProvince(region, province, page = 0, size = 20) {
    try {
      const response = await adminApi.get(
        `/admin/lottery-results/region/${region}/province/${province}`,
        { params: { page, size } }
      );
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error getting lottery results:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra'
      };
    }
  }

  /**
   * Lấy kết quả theo ID
   */
  async getLotteryResult(id) {
    try {
      const response = await adminApi.get(`/admin/lottery-results/${id}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error getting lottery result:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra'
      };
    }
  }

  /**
   * Lấy kết quả theo province (bỏ qua region)
   */
  async getLotteryResultsByProvince(province, page = 0, size = 20) {
    try {
      const response = await adminApi.get(`/admin/lottery-results/province/${province}`, {
        params: { page, size }
      });
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error getting lottery results by province:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra'
      };
    }
  }

  /**
   * Tạo kết quả mới
   */
  async createLotteryResult(data) {
    try {
      // Xử lý province: nếu region là mienBac hoặc province là empty string, set null
      const requestData = {
        ...data,
        province: (data.region === 'mienBac' || !data.province) ? null : data.province
      };
      
      const response = await adminApi.post('/admin/lottery-results', requestData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Tạo kết quả thành công'
      };
    } catch (error) {
      console.error('Error creating lottery result:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi tạo kết quả'
      };
    }
  }

  /**
   * Cập nhật kết quả
   */
  async updateLotteryResult(id, data) {
    try {
      // Xử lý province: nếu region là mienBac hoặc province là empty string, set null
      const requestData = {
        ...data,
        province: (data.region === 'mienBac' || !data.province) ? null : data.province
      };
      
      const response = await adminApi.put(`/admin/lottery-results/${id}`, requestData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Cập nhật kết quả thành công'
      };
    } catch (error) {
      console.error('Error updating lottery result:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật kết quả'
      };
    }
  }

  /**
   * Xóa kết quả
   */
  async deleteLotteryResult(id) {
    try {
      const response = await adminApi.delete(`/admin/lottery-results/${id}`);
      return {
        success: true,
        message: response.data.message || 'Xóa kết quả thành công'
      };
    } catch (error) {
      console.error('Error deleting lottery result:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi xóa kết quả'
      };
    }
  }

  /**
   * Publish kết quả
   */
  async publishResult(id) {
    try {
      const response = await adminApi.post(`/admin/lottery-results/${id}/publish`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Công bố kết quả thành công'
      };
    } catch (error) {
      console.error('Error publishing lottery result:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi công bố kết quả'
      };
    }
  }

  /**
   * Unpublish kết quả
   */
  async unpublishResult(id) {
    try {
      const response = await adminApi.post(`/admin/lottery-results/${id}/unpublish`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Hủy công bố kết quả thành công'
      };
    } catch (error) {
      console.error('Error unpublishing lottery result:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi hủy công bố kết quả'
      };
    }
  }

  /**
   * Tạo template kết quả mẫu cho Miền Bắc
   */
  getMienBacTemplate() {
    return {
      "dac-biet": "00000",
      "giai-nhat": "00000",
      "giai-nhi": ["00000", "00000"],
      "giai-ba": ["00000", "00000", "00000", "00000", "00000", "00000"],
      "giai-tu": ["0000", "0000", "0000", "0000"],
      "giai-nam": ["0000", "0000", "0000", "0000", "0000", "0000"],
      "giai-sau": ["000", "000", "000"],
      "giai-bay": ["00", "00", "00", "00"]
    };
  }

  /**
   * Tạo template kết quả mẫu cho Miền Trung Nam
   */
  getMienTrungNamTemplate() {
    return {
      "dac-biet": "000000",
      "giai-nhat": "00000",
      "giai-nhi": ["00000"],
      "giai-ba": ["00000", "00000"],
      "giai-tu": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"],
      "giai-nam": ["0000"],
      "giai-sau": ["0000", "0000", "0000"],
      "giai-bay": ["000"],
      "giai-tam": ["00"]
    };
  }

  /**
   * Trigger auto-import lottery results từ API
   */
  async triggerAutoImport() {
    try {
      const response = await adminApi.post('/admin/lottery-results/auto-import');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Tự động import kết quả thành công'
      };
    } catch (error) {
      console.error('Error triggering auto import:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi tự động import kết quả'
      };
    }
  }

  /**
   * Trigger auto-import kết quả cho ngày hôm nay (LOGIC MỚI)
   */
  async triggerAutoImportToday() {
    try {
      console.log('🔄 [DEBUG] Triggering auto import for today...');
      const response = await adminApi.post('/admin/lottery-results/auto-import-today');
      
      console.log('✅ [DEBUG] Auto import today response:', response.data);
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Tự động import kết quả hôm nay thành công'
      };
    } catch (error) {
      console.error('❌ [DEBUG] Error triggering auto import today:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi import kết quả hôm nay'
      };
    }
  }
}

export default new AdminLotteryResultService();

