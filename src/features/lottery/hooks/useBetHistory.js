import { useState, useEffect } from 'react';
import betService from '../../../services/betService';

/**
 * Hook quản lý lịch sử bet
 * GIỮ NGUYÊN 100% logic từ MienBacGamePage.jsx
 */
export const useBetHistory = (userId, shouldFetch = false) => {
  const [betHistory, setBetHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchBetHistory = async () => {
    if (!userId) return;
    
    setLoadingHistory(true);
    try {
      const response = await betService.getUserBets(userId, { page: 0, size: 10 });
      setBetHistory(response.content || []);
    } catch (error) {
      console.error('Error fetching bet history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (shouldFetch) {
      fetchBetHistory();
    }
  }, [userId, shouldFetch]);

  return {
    betHistory,
    loadingHistory,
    fetchBetHistory,
    setBetHistory
  };
};

