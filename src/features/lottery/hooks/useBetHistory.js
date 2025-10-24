import { useState, useEffect } from 'react';
import betService from '../../../services/betService';

/**
 * Hook quản lý lịch sử bet
 * Tự động load khi component mount
 */
export const useBetHistory = (region = 'mien-bac') => {
  const [betHistory, setBetHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchBetHistory = async (page = 0, isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoadingHistory(true);
    }
    
    try {
      const response = await betService.getMyBets(page, 20);
      const newBets = response.data || [];
      
      if (page === 0) {
        // First load or refresh
        setBetHistory(newBets);
      } else {
        // Load more
        setBetHistory(prev => [...prev, ...newBets]);
      }
      
      setCurrentPage(page);
      setHasMore(newBets.length === 20); // If we get less than 20, no more data
    } catch (error) {
      console.error('Error fetching bet history:', error);
    } finally {
      setLoadingHistory(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchBetHistory(0);
  }, []);

  const onRefresh = async () => {
    await fetchBetHistory();
  };

  const onDismissBet = async (betId) => {
    try {
      await betService.dismissBetResult(betId);
      await fetchBetHistory();
    } catch (error) {
      console.error('Error dismissing bet:', error);
    }
  };

  const onCancelBet = async (betId) => {
    try {
      await betService.cancelBet(betId);
      await fetchBetHistory();
    } catch (error) {
      console.error('Error cancelling bet:', error);
    }
  };

  const onLoadMore = async () => {
    if (hasMore && !loadingMore) {
      await fetchBetHistory(currentPage + 1, true);
    }
  };

  return {
    betHistory,
    loadingHistory,
    onRefresh,
    onDismissBet,
    onCancelBet,
    onLoadMore,
    hasMore,
    loadingMore
  };
};

