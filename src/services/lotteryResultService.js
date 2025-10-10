import { mockLotteryResults, getLotteryResult, checkWinningNumbers, formatLotteryResult } from '../data/mockLotteryResults';

// Service để quản lý kết quả xổ số (hiện tại dùng mock data)
class LotteryResultService {
  /**
   * Lấy kết quả xổ số theo region
   */
  async getLotteryResult(region) {
    try {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const result = getLotteryResult(region);
      if (!result) {
        return {
          success: false,
          message: 'Không tìm thấy kết quả cho region này'
        };
      }

      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Error getting lottery result:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi lấy kết quả xổ số'
      };
    }
  }

  /**
   * Lấy kết quả xổ số đã format để hiển thị
   */
  async getFormattedLotteryResult(region) {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const result = formatLotteryResult(region);
      if (!result) {
        return {
          success: false,
          message: 'Không tìm thấy kết quả cho region này'
        };
      }

      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Error getting formatted lottery result:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi lấy kết quả xổ số'
      };
    }
  }

  /**
   * Kiểm tra số trúng thưởng
   */
  async checkWinningNumbers(region, betType, selectedNumbers) {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const result = checkWinningNumbers(region, betType, selectedNumbers);
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Error checking winning numbers:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi kiểm tra kết quả'
      };
    }
  }

  /**
   * Lấy danh sách các region có kết quả
   */
  async getAvailableRegions() {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const regions = Object.keys(mockLotteryResults).map(key => ({
        key,
        name: mockLotteryResults[key].region
      }));

      return {
        success: true,
        data: regions
      };
    } catch (error) {
      console.error('Error getting available regions:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi lấy danh sách region'
      };
    }
  }

  /**
   * Lấy kết quả xổ số theo ngày (mock - chỉ có 1 ngày)
   */
  async getLotteryResultByDate(region, date) {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const result = getLotteryResult(region);
      if (!result) {
        return {
          success: false,
          message: 'Không tìm thấy kết quả cho ngày này'
        };
      }

      // Mock: chỉ có kết quả ngày 2025-10-09
      if (result.date !== date) {
        return {
          success: false,
          message: 'Chưa có kết quả cho ngày này'
        };
      }

      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Error getting lottery result by date:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi lấy kết quả theo ngày'
      };
    }
  }

  /**
   * Lấy lịch sử kết quả (mock - chỉ có 1 kết quả)
   */
  async getLotteryHistory(region, limit = 10) {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const result = getLotteryResult(region);
      if (!result) {
        return {
          success: true,
          data: []
        };
      }

      // Mock: trả về 1 kết quả duy nhất
      return {
        success: true,
        data: [result]
      };
    } catch (error) {
      console.error('Error getting lottery history:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi lấy lịch sử kết quả'
      };
    }
  }
}

const lotteryResultService = new LotteryResultService();
export default lotteryResultService;
