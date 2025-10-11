import { Icon } from '@iconify/react';
import { getNumbersForGameType } from '../utils/numberGenerator';

/**
 * Component chọn số - GIỮ NGUYÊN 100% UI logic
 */
const NumberSelectionPanel = ({
  selectedGameType,
  selectedNumbers,
  numberInput,
  setNumberInput,
  selectionMode,
  setSelectionMode,
  onNumberSelect,
  onNumberInput,
  onClearSelection,
  onRemoveNumber
}) => {
  const numbers = getNumbersForGameType(selectedGameType);
  
  // Các game type chỉ cho nhập tay (không có chọn nhanh)
  const isInputOnly = selectedGameType === 'loto-4s' || selectedGameType === 'loto4s' || selectedGameType === '4s-dac-biet';
  
  // Các game type là xiên
  const isXien = selectedGameType === 'loto-xien-2' || selectedGameType === 'loto-xien-3' || selectedGameType === 'loto-xien-4';

  return (
    <div>
      {/* Selection Mode Tabs - Ẩn khi chỉ cho nhập tay */}
      {!isInputOnly && (
        <div className="flex border-b border-gray-200 mb-4">
          <button
            onClick={() => setSelectionMode('quick')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors text-base ${
              selectionMode === 'quick'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Chọn số nhanh
          </button>
          <button
            onClick={() => setSelectionMode('input')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors text-base ${
              selectionMode === 'input'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Nhập số
          </button>
        </div>
      )}

      {/* Selection Content */}
      {isInputOnly ? (
        /* Loto 4s và 4s đặc biệt: CHỈ CHO NHẬP TAY */
        <div>
          <div className="mb-3">
            <h3 className="text-base font-medium text-gray-800 mb-2">
              {selectedGameType === '4s-dac-biet' ? '4s đặc biệt - Nhập tay (0000-9999):' : 'Loto 4 số - Nhập tay (0000-9999):'}
            </h3>
            <p className="text-sm text-gray-600">
              Giữa mỗi cược cần phân cách bởi dấu , hoặc khoảng trống. Ví dụ: 0001, 0123, 9999 hoặc 0001 0123 9999
            </p>
          </div>
          <div className="space-y-3">
            <textarea
              value={numberInput}
              onChange={(e) => setNumberInput(e.target.value)}
              placeholder="Nhập các số 4 chữ số (0000-9999)..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
            />
            <button
              onClick={onNumberInput}
              className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-base"
            >
              Áp dụng số đã nhập
            </button>
          </div>
        </div>
      ) : selectionMode === 'quick' ? (
        /* Number Grid - Chọn nhanh */
        <div className={`grid gap-1.5 ${
          selectedGameType === 'loto-3s' || selectedGameType === 'loto3s' || selectedGameType === '3s-giai-nhat' || selectedGameType === '3s-dac-biet'
            ? 'grid-cols-10 max-h-96 overflow-y-auto' 
            : 'grid-cols-10'
        }`}>
          {numbers.map((number) => (
            <button
              key={number}
              onClick={() => onNumberSelect(number)}
              className={`w-10 h-10 rounded-lg font-medium transition-all text-base ${
                selectedNumbers.includes(number)
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {number}
            </button>
          ))}
        </div>
      ) : (
        /* Number Input - Nhập số */
        <div>
          <div className="mb-3">
            <h3 className="text-base font-medium text-gray-800 mb-2">Cách chơi:</h3>
            <p className="text-sm text-gray-600">
              {isXien && selectedGameType === 'loto-xien-2' ? 
                'Nhập các cặp số, mỗi cặp cách nhau bởi dấu ;. Ví dụ: 78,40; 80,99' :
                isXien && selectedGameType === 'loto-xien-3' ? 
                'Nhập các cụm 3 số, mỗi cụm cách nhau bởi dấu ;. Ví dụ: 78,40,12; 80,99,23' :
                isXien && selectedGameType === 'loto-xien-4' ? 
                'Nhập các cụm 4 số, mỗi cụm cách nhau bởi dấu ;. Ví dụ: 78,40,12,56; 80,99,23,45' :
                selectedGameType === '3s-giai-nhat' ? 
                'Giữa mỗi cược cần phân cách bởi dấu , hoặc khoảng trống. Ví dụ: 001,845,999 hoặc 001 845 999' :
                selectedGameType === '3s-dac-biet' ? 
                'Giữa mỗi cược cần phân cách bởi dấu , hoặc khoảng trống. Ví dụ: 001,845,999 hoặc 001 845 999' :
                'Giữa mỗi cược cần phân cách bởi dấu , hoặc khoảng trống. Ví dụ: 10,20,30 hoặc 10 20 30'
              }
            </p>
          </div>
          <div className="space-y-3">
            <textarea
              value={numberInput}
              onChange={(e) => setNumberInput(e.target.value)}
              placeholder={isXien && selectedGameType === 'loto-xien-2' ? 
                'Nhập các cặp số (00-99). Ví dụ: 78,40; 80,99' :
                isXien && selectedGameType === 'loto-xien-3' ? 
                'Nhập các cụm 3 số (00-99). Ví dụ: 78,40,12; 80,99,23' :
                isXien && selectedGameType === 'loto-xien-4' ? 
                'Nhập các cụm 4 số (00-99). Ví dụ: 78,40,12,56; 80,99,23,45' :
                selectedGameType === '3s-giai-nhat' ? 
                'Nhập các số 3 chữ số (000-999)...' :
                selectedGameType === '3s-dac-biet' ? 
                'Nhập các số 3 chữ số (000-999)...' : 
                'Nhập các số bạn muốn chọn...'
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
            />
            <button
              onClick={onNumberInput}
              className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-base"
            >
              Áp dụng số đã nhập
            </button>
          </div>
        </div>
      )}

      {/* Selected Numbers Display */}
      {selectedNumbers.length > 0 && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-medium text-gray-800">
              Số đã chọn ({selectedNumbers.length})
            </h3>
            <button
              onClick={onClearSelection}
              className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
            >
              <Icon icon="mdi:delete-outline" className="w-4 h-4" />
              Xóa tất cả
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedNumbers.map((number, index) => (
              <div
                key={index}
                className="bg-red-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-base"
              >
                <span>{number}</span>
                <button
                  onClick={() => onRemoveNumber(number)}
                  className="hover:bg-red-600 rounded-full p-0.5"
                >
                  <Icon icon="mdi:close" className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NumberSelectionPanel;

