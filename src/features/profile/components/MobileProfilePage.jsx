import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

const MobileProfilePage = ({ isOpen, onClose, userName, userBalance, onRefreshBalance, onLogout }) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'deposit',
      title: 'Nạp Tiền',
      icon: 'mdi:credit-card-plus',
      color: 'text-orange-500',
      onClick: () => navigate('/wallet?tab=deposit-withdraw')
    },
    {
      id: 'withdraw',
      title: 'Rút Tiền',
      icon: 'mdi:credit-card-minus',
      color: 'text-pink-500',
      onClick: () => navigate('/wallet?tab=withdraw')
    }
  ];

  const menuItems = [
    {
      id: 'withdrawal-account',
      title: 'Tài khoản rút tiền',
      icon: 'mdi:bank',
      onClick: () => navigate('/wallet?tab=withdrawal-account')
    },
    {
      id: 'my-wallet',
      title: 'Ví tiền của tôi',
      icon: 'mdi:wallet',
      onClick: () => navigate('/wallet?tab=balance')
    },
    {
      id: 'transaction-history',
      title: 'Lịch Sử Giao Dịch',
      icon: 'mdi:history',
      onClick: () => navigate('/wallet?tab=transaction-history')
    },
    {
      id: 'kyc-verification',
      title: 'Xác thực tài khoản (KYC)',
      icon: 'mdi:shield-check',
      onClick: () => navigate('/kyc')
    },
    {
      id: 'notifications',
      title: 'Thông báo',
      icon: 'mdi:chevron-down',
      hasNotification: true,
      onClick: () => {
        onClose();
        // Open notification modal
        setTimeout(() => {
          const notificationButton = document.querySelector('[data-notification-button]');
          if (notificationButton) {
            notificationButton.click();
          }
        }, 300);
      }
    }
  ];

  return (
    <>
      {/* Overlay */}
      <div className={`md:hidden fixed inset-0 z-40 bg-black transition-opacity duration-300 ${
        isOpen ? 'opacity-30' : 'opacity-0 pointer-events-none'
      }`} onClick={onClose} />
      
      {/* Modal */}
      <div className={`md:hidden fixed inset-0 z-50 bg-gray-100 overflow-y-auto transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 sticky top-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <Icon icon="mdi:account" className="w-5 h-5 text-gray-600" />
            </div>
            <span className="font-medium text-gray-800">Cá nhân</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <Icon icon="mdi:close" className="text-gray-600 text-lg" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* User Info & Balance Card */}
          <div className="bg-white rounded-lg p-4 pb-3 shadow-sm">
            {/* User Greeting */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-300 rounded-full flex items-center justify-center">
                  <Icon icon="mdi:account" className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-800">
                  Xin chào, {userName || 'thienlongsp'}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 transition-colors"
              >
                Đăng xuất
              </button>
            </div>

            {/* Balance */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">điểm</p>
                <p className="text-xl font-bold text-gray-900">
                  {userBalance ? userBalance.toLocaleString() : '0.00'}
                </p>
              </div>
              <button
                onClick={onRefreshBalance}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <Icon icon="mdi:refresh" className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={action.onClick}
                  className="flex flex-col items-center gap-1.5 p-2 hover:bg-gray-50 rounded-lg transition-colors flex-1"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center ${action.color}`}>
                    <Icon icon={action.icon} className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 text-center">
                    {action.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Menu List */}
          <div className="bg-white rounded-lg shadow-sm">
            {menuItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  item.onClick();
                  if (item.id !== 'notifications') {
                    onClose();
                  }
                }}
                className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors ${
                  index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Icon icon={item.icon} className="w-5 h-5 text-gray-600" />
                </div>
                <span className="flex-1 text-left font-medium text-gray-800">
                  {item.title}
                </span>
                {item.hasNotification && (
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                )}
                <Icon icon="mdi:chevron-right" className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileProfilePage;
