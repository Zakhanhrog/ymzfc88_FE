import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const WalletSidebar = ({ activeTab, onTabChange, userBalance, userInfo, kycVerified }) => {
  const navigate = useNavigate();
  const [shimmerKey, setShimmerKey] = useState(null);

  const menuItems = [
    {
      key: 'balance',
      label: 'Tổng Quan',
      icon: '/iconacc/imgi_24_overview.avif',
      section: 'Giao Dịch'
    },
    {
      key: 'deposit-withdraw',
      label: 'Nạp Tiền',
      icon: '/iconacc/imgi_25_deposit.avif',
      section: 'Giao Dịch'
    },
    {
      key: 'withdraw',
      label: 'Rút Tiền',
      icon: '/iconacc/imgi_26_withdraw.avif',
      section: 'Giao Dịch'
    },
    {
      key: 'bank-account',
      label: 'Tài Khoản Ngân Hàng',
      icon: '/iconacc/imgi_27_bank.avif',
      section: 'Giao Dịch'
    },
    {
      key: 'transaction-history',
      label: 'Lịch Sử Cược/Giao Dịch',
      icon: '/iconacc/imgi_28_history.avif',
      section: 'Giao Dịch'
    },
    {
      key: 'account',
      label: 'Xác thực tài khoản (KYC)',
      icon: '/iconacc/imgi_29_account.avif',
      section: 'Thông Tin'
    },
    {
      key: 'settings',
      label: 'Tài khoản',
      icon: '/iconacc/imgi_24_overview.avif',
      section: 'Thông Tin'
    },
    {
      key: 'promotions',
      label: 'Khuyến Mãi',
      icon: '/iconacc/imgi_30_promotion.avif',
      section: 'Thông Tin'
    }
  ];

  const sections = ['Giao Dịch', 'Thông Tin'];

  // Trigger shimmer animation when activeTab changes
  useEffect(() => {
    if (activeTab) {
      setShimmerKey(activeTab);
      // Reset after animation completes
      const timer = setTimeout(() => {
        setShimmerKey(null);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  const handleItemClick = (key) => {
    if (key === 'bank-account') {
      // Navigate to bank account page or show bank account form
      onTabChange('bank-account');
    } else if (key === 'promotions') {
      // Use onTabChange to show promotions in wallet layout
      onTabChange('promotions');
    } else if (key === 'account') {
      // For account tab, use onTabChange to set the tab
      onTabChange('account');
    } else if (key === 'settings') {
      onTabChange('settings');
    } else {
      onTabChange(key);
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-fit flex flex-col flex-shrink-0 rounded-2xl">
      {/* Wallet Balance Section */}
      <div 
        className="p-4 border-b border-gray-200 rounded-t-2xl relative overflow-hidden"
        style={{
          backgroundImage: 'url(/iconacc/bg_acc.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/90 mb-1">Số dư ví</p>
            <p className="text-xl font-bold text-white">
              {userBalance.toLocaleString()} điểm
            </p>
          </div>
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white/30">
            <img 
              src="/iconacc/imgi_29_account.avif" 
              alt="Account"
              className="w-7 h-7"
            />
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="overflow-y-auto">
        {sections.map((section) => (
          <div key={section} className="py-2">
            <div className="px-4 py-2">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                {section}
              </h3>
            </div>
            {menuItems
              .filter(item => item.section === section)
              .map((item) => {
                const isActive = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => handleItemClick(item.key)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all duration-200 rounded-lg mx-2 relative overflow-hidden
                      ${isActive 
                        ? 'bg-gradient-to-r from-green-300/80 to-emerald-500/80 text-white shadow-lg shadow-green-300/50 border border-green-200/50' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-green-600'
                      }
                    `}
                  >
                    {isActive && shimmerKey === item.key && (
                      <div key={`shimmer-${item.key}`} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-once pointer-events-none"></div>
                    )}
                    <img 
                      src={item.icon} 
                      alt={item.label}
                      className={`w-6 h-6 relative z-10 ${isActive ? 'opacity-100' : 'opacity-60'}`}
                    />
                    <span className={`text-base font-medium relative z-10 ${isActive ? 'text-white' : ''}`}>{item.label}</span>
                  </button>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalletSidebar;

