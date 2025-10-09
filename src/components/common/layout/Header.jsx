import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../ui';
import NotificationDropdown from '../../../features/notification/components/NotificationDropdown';

const Header = ({ 
  isLoggedIn, 
  isMobile, 
  sidebarCollapsed,
  onSidebarToggle, 
  onLoginOpen, 
  onRegisterOpen,
  userName,
  userBalance,
  onRefreshBalance,
  onLogout
}) => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 h-[80px] bg-white border-b border-gray-200 z-20 px-6">
      <div className="w-full h-full flex items-center justify-between">
        {/* Left: Logo & Menu Toggle */}
        <div className="flex items-center gap-4">
          {!isMobile && (
            <button
              onClick={onSidebarToggle}
              className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Icon icon="mdi:menu" className="w-6 h-6" />
            </button>
          )}
          
          <div className="cursor-pointer" onClick={() => navigate('/')}>
            <img 
              src="/logo.webp" 
              alt="Logo" 
              className="h-9 w-auto object-contain"
              style={{ maxHeight: '36px' }}
            />
          </div>
        </div>
        
        {/* Right: User Menu / Auth Buttons */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              {/* Username */}
              <button
                onClick={() => navigate('/wallet')}
                className="text-gray-700 font-semibold hover:underline transition-all text-base"
                title="Xem thông tin ví cá nhân"
              >
                {userName}
              </button>
              
              {/* Balance */}
              <div className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-full bg-white">
                <span className="font-bold text-[#D30102] text-base">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(userBalance / 1000)}
                </span>
                <button
                  onClick={onRefreshBalance}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-0 w-5 h-5 flex items-center justify-center"
                >
                  <Icon icon="mdi:refresh" className="w-5 h-5" />
                </button>
              </div>
              
              {/* Nạp tiền */}
              <button
                onClick={() => navigate('/wallet?tab=deposit-withdraw')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors px-3 py-2"
              >
                <Icon icon="mdi:account" className="w-5 h-5" />
                <span className="font-medium text-base">Nạp tiền</span>
              </button>
              
              {/* Rút tiền */}
              <button
                onClick={() => navigate('/wallet?tab=withdraw')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors px-3 py-2"
              >
                <Icon icon="mdi:gift" className="w-5 h-5" />
                <span className="font-medium text-base">Rút tiền</span>
              </button>
              
              {/* Notification */}
              <NotificationDropdown />
              
              {/* Logout */}
              <Button
                variant="danger"
                size="sm"
                onClick={onLogout}
                icon={<Icon icon="mdi:logout" className="w-4 h-4" />}
              >
                Đăng xuất
              </Button>
            </>
          ) : (
            /* Auth Buttons */
            <div className="flex gap-3">
              <Button
                variant="outline"
                size={isMobile ? 'sm' : 'md'}
                onClick={onLoginOpen}
                className="shadow-md hover:shadow-lg"
              >
                Đăng nhập
              </Button>
              <Button
                variant="primary"
                size={isMobile ? 'sm' : 'md'}
                onClick={onRegisterOpen}
                className="shadow-md hover:shadow-lg"
              >
                Đăng ký
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

