import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { formatBetTypeMienBac, formatBetTypeMienTrungNam, formatSelectedNumbers } from '../utils/betFormatter';
import CancelBetModal from './CancelBetModal';

/**
 * Component lịch sử cược cho giao diện mobile
 */
const MobileBetHistory = ({
  betHistory,
  loadingHistory,
  userPoints,
  loadingPoints,
  onRefresh,
  onDismissBet,
  onCancelBet, // Thêm callback để hủy cược
  onLoadMore,
  hasMore,
  loadingMore,
  onClose,
  region = 'mien-bac' // 'mien-bac' or 'mien-trung-nam'
}) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBet, setSelectedBet] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const handleLoadMore = () => {
    if (onLoadMore) {
      onLoadMore();
    }
  };

  const handleCancelBet = (bet) => {
    setSelectedBet(bet);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBet || !onCancelBet) return;
    
    setCancelling(true);
    try {
      await onCancelBet(selectedBet.id);
      setShowCancelModal(false);
      setSelectedBet(null);
    } catch (error) {
      console.error('Error cancelling bet:', error);
    } finally {
      setCancelling(false);
    }
  };

  const handleCloseModal = () => {
    if (!cancelling) {
      setShowCancelModal(false);
      setSelectedBet(null);
    }
  };
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col h-screen">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <Icon icon="mdi:arrow-left" className="w-6 h-6 text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">Lịch sử cược</h2>
        </div>
        <button
          onClick={onRefresh}
          className="p-2 hover:bg-gray-100 rounded-full"
          disabled={loadingHistory}
        >
          <Icon 
            icon={loadingHistory ? "mdi:loading" : "mdi:refresh"} 
            className={`w-5 h-5 text-gray-600 ${loadingHistory ? 'animate-spin' : ''}`} 
          />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* User Points */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="text-sm text-gray-600">
            Số dư: {loadingPoints ? 'Đang tải...' : `${userPoints.toLocaleString()} điểm`}
          </div>
        </div>

        {/* Bet History List */}
        <div className="p-4 pb-8">
          {loadingHistory ? (
            <div className="text-center py-8">
              <Icon icon="mdi:loading" className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-3" />
              <p className="text-sm text-gray-600">Đang tải lịch sử...</p>
            </div>
          ) : betHistory.length === 0 ? (
            <div className="text-center py-12">
              <Icon icon="mdi:history" className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-sm text-gray-600">Chưa có lịch sử cược</p>
            </div>
          ) : (
            <div className="space-y-3">
              {betHistory.map((bet, index) => (
                <div key={`${bet.id}-${bet.createdAt}-${index}`} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                  {/* Header with time and action buttons */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-gray-500">
                      {new Date(bet.createdAt).toLocaleString('vi-VN')}
                    </div>
                    <div className="flex items-center gap-1">
                      {bet.status === 'PENDING' && onCancelBet && (
                        <button
                          onClick={() => handleCancelBet(bet)}
                          className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-colors"
                          title="Hủy cược (trước 18:10)"
                        >
                          Hủy
                        </button>
                      )}
                      {bet.status !== 'PENDING' && (
                        <button
                          onClick={() => onDismissBet(bet.id)}
                          className="p-1 hover:bg-gray-100 rounded-full"
                          title="Xóa khỏi lịch sử"
                        >
                          <Icon icon="mdi:close" className="w-4 h-4 text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Bet Info - Compact Layout */}
                  <div className="space-y-1.5">
                    {/* First row: Bet type and Status */}
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-700">
                        {region === 'mien-bac' 
                          ? formatBetTypeMienBac(bet.betType)
                          : formatBetTypeMienTrungNam(bet.betType)
                        }
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        bet.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        bet.status === 'WON' ? 'bg-green-100 text-green-800' :
                        bet.status === 'LOST' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {bet.status === 'PENDING' ? 'Chờ kết quả' :
                         bet.status === 'WON' ? 'Thắng cược' :
                         bet.status === 'LOST' ? 'Thua cược' : bet.status}
                      </span>
                    </div>
                    
                    {/* Second row: Numbers and Bet amount */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-gray-600">
                        <span className="font-medium">Số:</span> {formatSelectedNumbers(bet.selectedNumbers)?.join(', ')}
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium">Cược:</span> {bet.totalAmount?.toLocaleString() || 0}đ
                      </div>
                    </div>
                    
                    {/* Win Amount and Winning Numbers - Only show if WON */}
                    {bet.status === 'WON' && (bet.winAmount || bet.winningNumbers) && (
                      <div className="flex items-center justify-between text-sm">
                        {bet.winAmount && (
                          <div className="text-green-600 font-medium">
                            <span className="font-medium">Thắng:</span> +{bet.winAmount.toLocaleString()}đ
                          </div>
                        )}
                        {bet.winningNumbers && (
                          <div className="text-green-600">
                            <span className="font-medium">Số trúng:</span> {formatSelectedNumbers(bet.winningNumbers)?.join(', ')}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Load More Button */}
              {hasMore && (
                <div className="mt-4 text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className={`px-6 py-3 rounded-lg font-medium text-base transition-colors ${
                      loadingMore
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {loadingMore ? (
                      <div className="flex items-center gap-2">
                        <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
                        <span>Đang tải...</span>
                      </div>
                    ) : (
                      'Xem thêm'
                    )}
                  </button>
                </div>
              )}
              
            </div>
          )}
        </div>
      </div>

      {/* Cancel Bet Modal */}
      <CancelBetModal
        isOpen={showCancelModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmCancel}
        betInfo={selectedBet}
        loading={cancelling}
      />
    </div>
  );
};

export default MobileBetHistory;
