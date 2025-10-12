import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../ui';
import NotificationDropdown from '../../../features/notification/components/NotificationDropdown';

const Header = ({ 
  isLoggedIn, 
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
    <header className="fixed top-0 left-0 right-0 h-[60px] md:h-[70px] bg-white border-b border-gray-200 z-20 px-4 md:px-6">
      <div className="w-full h-full flex items-center justify-between">
        {/* Left: Logo & Menu Toggle */}
        <div className="flex items-center gap-4">
          {/* Desktop Menu Toggle */}
          <button
            onClick={onSidebarToggle}
            className="hidden md:flex w-11 h-11 items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors ml-[-8px]"
          >
            <img 
              src="/images/icons/imgi_3_nav-menu.png" 
              alt="Menu" 
              className={`w-6 h-6 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-0' : 'rotate-180'}`}
            />
          </button>
          
          <div className="cursor-pointer" onClick={() => navigate('/')}>
            <img 
              src="/images/logos/logo.webp" 
              alt="Logo" 
              className="h-7 md:h-9 w-auto object-contain transition-transform duration-300 hover:scale-110"
              style={{ maxHeight: '28px' }}
            />
          </div>
        </div>
        
        {/* Right: User Menu / Auth Buttons */}
        <div className="flex items-center gap-2 md:gap-4">
          {isLoggedIn ? (
            <>
              {/* Desktop Logged In Layout */}
              <div className="hidden md:flex items-center gap-4">
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
                    {userBalance.toLocaleString()} điểm
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
              </div>

              {/* Mobile Logged In Layout */}
              <div className="md:hidden flex items-center gap-2">
                {/* Balance with integrated deposit button */}
                <div className="flex items-center gap-1 border border-gray-300 pl-3 pr-1 py-1 rounded-full bg-white">
                  <img src="/images/icons/imgi_35_icon-bank.png" alt="Bank" className="w-4 h-4" />
                  <span className="font-bold text-[#D30102] text-sm">
                    {userBalance.toLocaleString()}
                  </span>
                  {/* Integrated deposit button */}
                  <button
                    onClick={() => navigate('/wallet?tab=deposit-withdraw')}
                    className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium hover:bg-red-700 transition-colors ml-1"
                  >
                    Nạp Tiền
                  </button>
                </div>
                
                {/* User icon */}
                <button className="w-8 h-8 flex items-center justify-center">
                  <Icon icon="mdi:account-circle" className="w-6 h-6 text-gray-600" />
                </button>
                
                {/* Notification icon */}
                <div className="relative">
                  <button className="w-8 h-8 flex items-center justify-center">
                    <Icon icon="mdi:forum" className="w-6 h-6 text-gray-600" />
                  </button>
                  {/* Notification badge */}
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">9</span>
                </div>
              </div>
            </>
          ) : (
            /* Auth Buttons */
            <div className="flex gap-2 md:gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onLoginOpen}
                className="shadow-md hover:shadow-lg text-sm md:text-base px-3 md:px-4"
              >
                Đăng nhập
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={onRegisterOpen}
                className="shadow-md hover:shadow-lg text-sm md:text-base px-3 md:px-4"
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

