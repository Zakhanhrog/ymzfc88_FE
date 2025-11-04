import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

const WalletSidebar = ({ activeTab, onTabChange, userBalance, userInfo, kycVerified }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      key: 'balance',
      label: 'Tổng Quan',
      icon: 'mdi:view-dashboard',
      section: 'Giao Dịch'
    },
    {
      key: 'deposit-withdraw',
      label: 'Nạp Tiền',
      icon: 'mdi:plus-circle',
      section: 'Giao Dịch'
    },
    {
      key: 'withdraw',
      label: 'Rút Tiền',
      icon: 'mdi:arrow-down-circle',
      section: 'Giao Dịch'
    },
    {
      key: 'bank-account',
      label: 'Tài Khoản Ngân Hàng',
      icon: 'mdi:bank',
      section: 'Giao Dịch'
    },
    {
      key: 'transaction-history',
      label: 'Lịch Sử Cược/Giao Dịch',
      icon: 'mdi:history',
      section: 'Giao Dịch'
    },
    {
      key: 'account',
      label: 'Tài Khoản',
      icon: 'mdi:account',
      section: 'Thông Tin'
    },
    {
      key: 'promotions',
      label: 'Khuyến Mãi',
      icon: 'mdi:gift',
      section: 'Thông Tin'
    }
  ];

  const sections = ['Giao Dịch', 'Thông Tin'];

  const handleItemClick = (key) => {
    if (key === 'bank-account') {
      // Navigate to bank account page or show bank account form
      onTabChange('bank-account');
    } else if (key === 'promotions') {
      navigate('/promotions');
    } else {
      onTabChange(key);
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-70px)] flex flex-col flex-shrink-0">
      {/* Wallet Balance Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="mb-3">
          <p className="text-sm text-gray-600 mb-1">Số dư ví</p>
          <p className="text-xl font-bold text-green-600">
            {userBalance.toLocaleString()} điểm
          </p>
        </div>
        <a 
          href="#" 
          className="text-green-600 text-sm hover:text-green-700 flex items-center gap-1"
        >
          Xem Đặc Quyền VIP
          <Icon icon="mdi:arrow-right" className="w-4 h-4" />
        </a>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-200 flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
          <Icon icon="mdi:account" className="w-6 h-6 text-gray-700" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">
            {kycVerified ? 'VIP' : 'PHỔ THÔNG'}
          </p>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto">
        {sections.map((section) => (
          <div key={section} className="py-2">
            <div className="px-4 py-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
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
                      w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                      ${isActive 
                        ? 'bg-green-50 text-green-600 border-r-2 border-green-600' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-green-600'
                      }
                    `}
                  >
                    <Icon 
                      icon={item.icon} 
                      className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-gray-500'}`}
                    />
                    <span className="text-sm font-medium">{item.label}</span>
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

