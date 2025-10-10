import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import lotteryResultService from '../../services/lotteryResultService';

const LotteryResultModal = ({ isOpen, onClose, region }) => {
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && region) {
      loadLotteryResult();
    }
  }, [isOpen, region]);

  const loadLotteryResult = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await lotteryResultService.getFormattedLotteryResult(region);
      
      if (response.success) {
        setResultData(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tải kết quả');
      console.error('Error loading lottery result:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const getRegionDisplayName = (region) => {
    switch (region) {
      case 'mienBac':
        return 'XSMB';
      case 'mienTrungNam':
        return 'Miền Trung & Nam';
      default:
        return region;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">
              Kết quả {getRegionDisplayName(region)} ngày {resultData?.date || '...'}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <Icon icon="mdi:close" className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Icon icon="mdi:loading" className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Đang tải kết quả...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <Icon icon="mdi:alert-circle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600">{error}</p>
              <button
                onClick={loadLotteryResult}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Thử lại
              </button>
            </div>
          ) : resultData ? (
            <div className="space-y-4">
              {/* Thông tin kỳ quay */}
              <div className="text-center text-gray-600 mb-6">
                <p className="text-lg font-semibold">{resultData.period}</p>
                <p className="text-sm">{resultData.region}</p>
              </div>

              {/* Bảng kết quả */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                        Giải thưởng
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                        Số trúng thưởng
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(resultData.results).map(([prize, numbers], index) => (
                      <tr key={prize} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-300 px-4 py-3 font-medium">
                          {prize}
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            {prize === 'Giải đặc biệt' ? (
                              <span className="bg-red-500 text-white px-3 py-1 rounded-full font-bold text-lg">
                                {numbers}
                              </span>
                            ) : prize === 'Giải nhất' ? (
                              <span className="bg-orange-500 text-white px-3 py-1 rounded-full font-bold">
                                {numbers}
                              </span>
                            ) : (
                              numbers.split(', ').map((number, idx) => (
                                <span
                                  key={idx}
                                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium"
                                >
                                  {number.trim()}
                                </span>
                              ))
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Thông tin bổ sung */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon icon="mdi:information" className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Lưu ý:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Kết quả được cập nhật từ nguồn chính thức</li>
                      <li>Giải đặc biệt có tỷ lệ thưởng cao nhất</li>
                      <li>Thời gian công bố kết quả: 18h30 hàng ngày</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg">
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LotteryResultModal;
