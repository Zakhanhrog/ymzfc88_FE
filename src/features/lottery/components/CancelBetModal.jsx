import { useState } from 'react';
import { Icon } from '@iconify/react';

const CancelBetModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  betInfo,
  loading = false 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Icon icon="mdi:alert-circle" className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Xác nhận hủy cược</h3>
              <p className="text-sm text-gray-500">Hành động này không thể hoàn tác</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
            disabled={loading}
          >
            <Icon icon="mdi:close" className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {betInfo && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Thời gian:</span> {new Date(betInfo.createdAt).toLocaleString('vi-VN')}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Loại cược:</span> {betInfo.betType}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Số đã chọn:</span> {betInfo.selectedNumbers?.join(', ')}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Số tiền cược:</span> {betInfo.totalAmount?.toLocaleString() || 0}đ
              </div>
            </div>
          )}

          <div className="text-sm text-gray-700 mb-4">
            Bạn có chắc chắn muốn hủy cược này? Số tiền cược sẽ được hoàn lại vào tài khoản của bạn.
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <Icon icon="mdi:check" className="w-4 h-4" />
                  <span>Xác nhận hủy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelBetModal;
