import { useState } from 'react';
import betService from '../../../services/betService';
import { showNotification } from '../../../utils/notification';

/**
 * Hook xử lý đặt cược
 * GIỮ NGUYÊN 100% logic từ MienBacGamePage.jsx
 */
export const useBetPlacement = () => {
  const [placingBet, setPlacingBet] = useState(false);
  const [recentBet, setRecentBet] = useState(null);

  const placeBet = async (betData, onSuccess) => {
    setPlacingBet(true);
    try {
      const response = await betService.placeBet(betData);
      setRecentBet(response);
      showNotification('Đặt cược thành công!', 'success');
      
      if (onSuccess) {
        onSuccess(response);
      }
      
      return response;
    } catch (error) {
      console.error('Error placing bet:', error);
      showNotification(
        error.response?.data?.message || 'Đặt cược thất bại. Vui lòng thử lại.',
        'error'
      );
      throw error;
    } finally {
      setPlacingBet(false);
    }
  };

  return {
    placingBet,
    recentBet,
    setRecentBet,
    placeBet
  };
};

