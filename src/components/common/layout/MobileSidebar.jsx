import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const MobileSidebar = ({ isOpen, onClose, isLoggedIn, userName, userBalance }) => {
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300); // Match animation duration
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleClose();
  };

  // Reset isClosing when sidebar opens
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  const menuItems = [
    {
      icon: '/sidebarmb/sm-check.png',
      label: 'Mỗi Ngày',
      path: '/points',
      requireAuth: true
    },
    {
      icon: '/sidebarmb/sm-red.png',
      label: 'Phong bì đỏ',
      path: '/envelope',
      requireAuth: true
    },
    {
      icon: '/sidebarmb/sm-wheel.png',
      label: 'Vòng quay',
      path: '/wheel',
      requireAuth: true
    },
    {
      icon: '/sidebarmb/sm-vip.png',
      label: 'VIP',
      path: '/vip',
      requireAuth: true
    }
  ];

  if (!isOpen && !isClosing) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-[60] md:hidden ${
          isClosing ? 'animate-fade-out' : 'animate-fade-in'
        }`}
        onClick={handleClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 bottom-0 w-60 bg-[#F5F5F5] shadow-xl z-[70] overflow-y-auto md:hidden ${
        isClosing ? 'animate-slide-out-left' : 'animate-slide-in-left'
      }`}>
        {/* Header */}
        <div className="px-4 py-3 bg-white">
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Icon icon="mdi:chevron-left" className="w-6 h-6 text-gray-700" />
            </button>
            <Icon icon="mdi:account-circle" className="w-8 h-8 text-gray-400" />
            <div className="flex-1">
              <div className="text-sm text-gray-600">Xin chào, {isLoggedIn ? userName : 'thienlongsp'}</div>
            </div>
          </div>
          
          {isLoggedIn && (
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                {userBalance.toLocaleString()}
              </span>
              <button className="p-1">
                <Icon icon="mdi:refresh" className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          )}
        </div>

        {/* Menu Items Grid 2x2 */}
        <div className="px-3 pt-2 pb-1">
          <div className="grid grid-cols-2 gap-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigate(item.path)}
                disabled={item.requireAuth && !isLoggedIn}
                className={`flex flex-col items-center justify-center gap-1 py-2 rounded-2xl transition-all ${
                  item.requireAuth && !isLoggedIn
                    ? 'bg-gray-200 opacity-50 cursor-not-allowed'
                    : 'bg-white hover:shadow-lg active:scale-95'
                }`}
              >
                <img src={item.icon} alt={item.label} className="w-9 h-9" />
                <span className="text-xs font-medium text-gray-800">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mã dự thưởng Banner */}
        <div className="px-3 py-2">
          <button 
            onClick={() => handleNavigate('/promotions')}
            className="w-full"
          >
            <img 
              src="/sidebarmb/maduthuong.png" 
              alt="Mã dự thưởng" 
              className="w-full h-auto hover:scale-105 transition-transform"
            />
          </button>
        </div>

        {/* Khuyến mãi */}
        <div className="px-3 py-1">
          <button
            onClick={() => handleNavigate('/promotions')}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-xl hover:shadow-md transition-all active:scale-95"
          >
            <img src="/sidebarmb/imgi_44_nav-promo.png" alt="Khuyến mãi" className="w-7 h-7" />
            <span className="text-[15px] font-medium text-gray-800">Khuyến mãi</span>
          </button>
        </div>

        {/* Về chúng tôi */}
        <div className="px-3 py-1">
          <button
            onClick={() => handleNavigate('/about')}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-xl hover:shadow-md transition-all active:scale-95"
          >
            <Icon icon="mdi:lightbulb-outline" className="w-7 h-7 text-gray-600" />
            <span className="text-[15px] font-medium text-gray-800">Về chúng tôi</span>
          </button>
        </div>

        {/* PHIM 18+ */}
        <div className="px-3 py-1">
          <button
            onClick={() => handleNavigate('/adult')}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-xl hover:shadow-md transition-all active:scale-95"
          >
            <div className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">18</span>
              <span className="text-white text-[8px]">+</span>
            </div>
            <span className="text-[15px] font-medium text-gray-800">PHIM 18+</span>
          </button>
        </div>

        {/* Tải ứng dụng */}
        <div className="px-3 py-1">
          <button
            onClick={() => handleNavigate('/download')}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-xl hover:shadow-md transition-all active:scale-95"
          >
            <img src="/sidebarmb/icon-deposit.png" alt="AE 888" className="w-7 h-7" />
            <div className="flex flex-col items-start">
              <span className="text-[15px] font-medium text-gray-800">Tải ứng dụng</span>
              <span className="text-[11px] text-gray-500">Unlock💰Fun & Features</span>
            </div>
          </button>
        </div>

        {/* Banner Vua Mikami */}
        <div className="px-3 py-2">
          <button 
            onClick={() => handleNavigate('/promotions')}
            className="w-full"
          >
            <img 
              src="/sidebarmb/banner-yua.webp" 
              alt="Vua Mikami" 
              className="w-full h-auto rounded-xl hover:scale-105 transition-transform"
            />
          </button>
        </div>

        {/* Rút Tiền / Nạp Tiền */}
        <div className="px-3 py-2 pb-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNavigate('/wallet?tab=withdraw')}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white rounded-lg hover:shadow-md active:scale-95 transition-all"
            >
              <Icon icon="mdi:bank" className="w-5 h-5 text-gray-600" />
              <span className="text-base font-medium text-gray-800">Rút Tiền</span>
            </button>
            <button
              onClick={() => handleNavigate('/wallet?tab=deposit-withdraw')}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white rounded-lg hover:shadow-md active:scale-95 transition-all"
            >
              <Icon icon="mdi:wallet-plus" className="w-5 h-5 text-red-500" />
              <span className="text-base font-medium text-red-500">Nạp Tiền</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;

