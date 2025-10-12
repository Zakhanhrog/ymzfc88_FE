import { useState, useEffect } from 'react';
import betService from '../../../services/betService';

/**
 * Hook quản lý lịch sử bet
 * Tự động load khi có userId và luôn fetch fresh data khi vào trang
 */
export const useBetHistory = (userId, shouldFetch = true) => {
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
    if (userId && shouldFetch) {
      fetchBetHistory();
    }
  }, [userId, shouldFetch]);

  // Auto-refresh khi component mount lại (khi user vào lại trang)
  useEffect(() => {
    if (userId) {
      fetchBetHistory();
    }
  }, [userId]);

  return {
    betHistory,
    loadingHistory,
    fetchBetHistory,
    setBetHistory
  };
};

