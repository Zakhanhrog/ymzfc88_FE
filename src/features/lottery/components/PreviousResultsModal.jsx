import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import lotteryResultService from '../../../services/lotteryResultService';

const PreviousResultsModal = ({ isOpen, onClose, region, province = null }) => {
  const [lotteryData, setLotteryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchPreviousResults();
    }
  }, [isOpen, region, province]);

  const fetchPreviousResults = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await lotteryResultService.getPreviousDayResult(region, province);
      
      if (response.success && response.data) {
        const formattedData = lotteryResultService.formatLotteryResult(response.data);
        setLotteryData(formattedData);
      } else {
        setError(response.message || 'Chưa có kết quả');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tải kết quả');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const getRegionName = (region) => {
    switch (region) {
      case 'mienBac':
        return 'XSMB';
      case 'mienTrungNam':
        return 'XSMTN';
      default:
        return 'XSKT';
    }
  };

  const getRegionFullName = (region) => {
    switch (region) {
      case 'mienBac':
        return 'Miền Bắc';
      case 'mienTrungNam':
        return 'Miền Trung Nam';
      default:
        return 'Kết quả xổ số';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 text-white px-3 py-2 flex items-center justify-between">
          <h3 className="text-sm font-bold">
            Kết quả {getRegionName(region)} ngày {lotteryData ? formatDate(lotteryData.date) : ''}
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
          >
            <Icon icon="mdi:close" className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-100px)]">
          {loading && (
            <div></div>
          )}

          {error && (
            <div className="text-center py-8">
              <Icon icon="mdi:alert-circle" className="w-12 h-12 text-red-500 mx-auto mb-2" />
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {lotteryData && (
            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
              
              <table className="w-full">
                <tbody>
                  {/* Special Prize */}
                  <tr className="border-b border-gray-200">
                    <td className="w-20 px-2 py-1 bg-gray-50 border-r border-gray-300 text-left">
                      <span className="text-sm font-medium text-red-600 font-bold">Đặc biệt</span>
                    </td>
                    <td className="px-2 py-1">
                      <div className="flex flex-wrap gap-1">
                        <div className="w-16 h-8 px-2 text-center border border-gray-400 bg-white text-black rounded text-sm font-bold flex items-center justify-center">
                          {lotteryData.results["Giải đặc biệt"]}
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Other Prizes */}
                  {Object.entries(lotteryData.results).map(([prize, numbers]) => {
                    if (prize === "Giải đặc biệt") return null;
                    
                    const prizeNumber = prize.replace('Giải ', '');
                    const isMultiple = typeof numbers === 'string' && numbers.includes(',');
                    const numberArray = isMultiple ? numbers.split(', ').map(n => n.trim()) : [numbers];
                    
                    return (
                      <tr key={prize} className="border-b border-gray-200">
                        <td className="w-20 px-2 py-1 bg-gray-50 border-r border-gray-300 text-left">
                          <span className="text-sm font-medium text-black font-bold">
                            Giải {prizeNumber}
                          </span>
                        </td>
                        <td className="px-2 py-1">
                          <div className="flex flex-wrap gap-1">
                            {numberArray.map((num, index) => (
                              <div 
                                key={index} 
                                className="w-16 h-8 px-2 text-center border border-gray-400 bg-white text-black rounded text-sm font-bold flex items-center justify-center"
                              >
                                {num}
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PreviousResultsModal;
