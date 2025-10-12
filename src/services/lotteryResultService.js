import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Configure axios instance for public API
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Service để quản lý kết quả xổ số - LẤY TỪ DATABASE
class LotteryResultService {
  /**
   * Lấy kết quả xổ số mới nhất đã published theo region và province
   */
  async getLatestPublishedResult(region, province = null) {
    try {
      const params = province ? `?province=${province}` : '';
      const response = await publicApi.get(`/public/lottery-results/${region}/latest${params}`);
      
      if (response.data.success && response.data.data) {
        // Parse results JSON nếu cần
        const result = response.data.data;
        if (typeof result.results === 'string') {
          result.results = JSON.parse(result.results);
        }
        return {
          success: true,
          data: result
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Chưa có kết quả'
      };
    } catch (error) {
      console.error('Error getting latest published result:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi lấy kết quả xổ số'
      };
    }
  }

  /**
   * Lấy kết quả xổ số theo region, province và ngày
   */
  async getLotteryResult(region, province = null, drawDate = null) {
    try {
      // Nếu không có drawDate, lấy kết quả mới nhất
      if (!drawDate) {
        return await this.getLatestPublishedResult(region, province);
      }
      
      const params = province ? `?province=${province}` : '';
      const response = await publicApi.get(`/public/lottery-results/${region}/${drawDate}${params}`);
      
      if (response.data.success && response.data.data) {
        const result = response.data.data;
        if (typeof result.results === 'string') {
          result.results = JSON.parse(result.results);
        }
        return {
          success: true,
          data: result
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Không tìm thấy kết quả'
      };
    } catch (error) {
      console.error('Error getting lottery result:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi lấy kết quả xổ số'
      };
    }
  }

  /**
   * Format kết quả để hiển thị
   */
  formatLotteryResult(result) {
    if (!result || !result.results) {
      return null;
    }

    const results = typeof result.results === 'string' 
      ? JSON.parse(result.results) 
      : result.results;

    const formattedResults = {
      "Giải đặc biệt": results["dac-biet"],
      "Giải nhất": results["giai-nhat"],
      "Giải nhì": Array.isArray(results["giai-nhi"]) 
        ? results["giai-nhi"].join(", ") 
        : results["giai-nhi"],
      "Giải ba": results["giai-ba"].join(", "),
      "Giải tư": results["giai-tu"].join(", "),
      "Giải năm": Array.isArray(results["giai-nam"]) 
        ? results["giai-nam"].join(", ") 
        : results["giai-nam"],
      "Giải sáu": results["giai-sau"].join(", "),
      "Giải bảy": Array.isArray(results["giai-bay"]) 
        ? results["giai-bay"].join(", ") 
        : results["giai-bay"]
    };

    // Thêm giải tám cho miền Trung Nam
    if (result.region === 'mienTrungNam' && results["giai-tam"]) {
      formattedResults["Giải tám"] = Array.isArray(results["giai-tam"])
        ? results["giai-tam"].join(", ")
        : results["giai-tam"];
    }

    return {
      date: result.drawDate,
      region: result.region,
      province: result.province,
      results: formattedResults
    };
  }
}

const lotteryResultService = new LotteryResultService();
export default lotteryResultService;
