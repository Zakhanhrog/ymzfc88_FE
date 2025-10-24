import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileBetHistory from '../components/MobileBetHistory';
import { useBetHistory } from '../hooks/useBetHistory';
import { useAuth } from '../../../hooks/useAuth';

const BettingHistoryPage = () => {
  const navigate = useNavigate();
  const [region, setRegion] = useState('mien-bac');
  
  const {
    betHistory,
    loadingHistory,
    onRefresh,
    onDismissBet,
    onCancelBet,
    onLoadMore,
    hasMore,
    loadingMore
  } = useBetHistory(region);

  const { user } = useAuth();
  
  // Mock user points data
  const userPoints = user?.points || 0;
  const loadingPoints = false;
  const refreshPoints = () => {};

  const handleClose = () => {
    navigate(-1); // Quay lại trang trước
  };

  const handleRefresh = async () => {
    await onRefresh();
    await refreshPoints();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <MobileBetHistory
        betHistory={betHistory}
        loadingHistory={loadingHistory}
        userPoints={userPoints}
        loadingPoints={loadingPoints}
        onRefresh={handleRefresh}
        onDismissBet={onDismissBet}
        onCancelBet={onCancelBet}
        onLoadMore={onLoadMore}
        hasMore={hasMore}
        loadingMore={loadingMore}
        onClose={handleClose}
        region={region}
      />
    </div>
  );
};

export default BettingHistoryPage;
