import { Icon } from '@iconify/react';

const LogoutConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  title = 'Xác nhận đăng xuất',
  message = 'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản này không?',
  icon = 'mdi:logout',
  iconContainerClass = 'bg-green-100 text-green-600',
  confirmLabel = 'Đăng xuất',
  confirmLoadingLabel = 'Đang đăng xuất...',
  confirmIcon = 'mdi:logout',
  confirmButtonClass = 'bg-green-500 hover:bg-green-600',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-center p-6 pb-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${iconContainerClass}`}>
            <Icon icon={icon} className="w-8 h-8" />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!loading) {
                  onClose();
                }
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!loading) {
                  onClose();
                }
              }}
              disabled={loading}
              className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation select-none"
            >
              Hủy
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!loading) {
                  onConfirm();
                }
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!loading) {
                  onConfirm();
                }
              }}
              disabled={loading}
              className={`flex-1 py-2.5 px-4 text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-manipulation select-none ${confirmButtonClass}`}
            >
              {loading ? (
                <>
                  <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
                  <span>{confirmLoadingLabel}</span>
                </>
              ) : (
                <>
                  <Icon icon={confirmIcon} className="w-4 h-4" />
                  <span>{confirmLabel}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
