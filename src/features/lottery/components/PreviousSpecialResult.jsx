import React, { useState, useEffect } from 'react';
import lotteryResultService from '../../../services/lotteryResultService';
import PreviousResultsModal from './PreviousResultsModal';

const PreviousSpecialResult = ({ region, province = null }) => {
  const [specialPrize, setSpecialPrize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPreviousResult = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await lotteryResultService.getPreviousDayResult(region, province);
        
        if (response.success && response.data) {
          const prize = lotteryResultService.getSpecialPrize(response.data);
          setSpecialPrize(prize);
        } else {
          setError(response.message || 'Không có kết quả hôm trước');
        }
      } catch (err) {
        setError('Có lỗi xảy ra khi tải kết quả');
      } finally {
        setLoading(false);
      }
    };

    fetchPreviousResult();
  }, [region, province]);

  if (loading) {
    return (
      <div className="text-right">
        <div className="text-xs text-gray-500 mb-1">Kỳ hôm trước, giải đặc biệt</div>
        <div className="flex gap-1 justify-end">
          {[0, 1, 2, 3, 4].map((index) => (
            <div key={index} className="w-5 h-5 md:w-7 md:h-7 bg-gray-200 border border-gray-300 rounded-full animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !specialPrize) {
    return (
      <div className="text-right">
        <div className="text-xs text-gray-500 mb-1">Kỳ hôm trước, giải đặc biệt</div>
        <div className="text-xs text-gray-400">Chưa có kết quả</div>
      </div>
    );
  }

  return (
    <div className="text-right">
      <div className="text-xs text-gray-500 mb-1">Kỳ hôm trước, giải đặc biệt</div>
      <div className="flex gap-1 justify-end mb-1">
        {specialPrize.map((num, index) => (
          <div key={index} className="w-5 h-5 md:w-7 md:h-7 bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center text-gray-700 font-bold text-xs md:text-sm">
            {num}
          </div>
        ))}
      </div>
      <button
        onClick={() => setShowModal(true)}
        className="text-xs text-red-600 hover:text-red-800 underline font-medium hover:no-underline transition-all duration-200"
      >
        Xem kết quả
      </button>
      
      <PreviousResultsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        region={region}
        province={province}
      />
    </div>
  );
};

export default PreviousSpecialResult;
