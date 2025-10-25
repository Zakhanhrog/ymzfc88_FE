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
    navigate(path, { replace: false });
    handleClose();
  };

  // Reset isClosing when sidebar opens
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);


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
              <div className="text-sm text-gray-600">Xin chào, {userName}</div>
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

