import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button, Input } from '../../ui';
import NotificationDropdown from '../../../features/notification/components/NotificationDropdown';
import MobileNotificationModal from '../../../features/notification/components/MobileNotificationModal';
import MobileProfilePage from '../../../features/profile/components/MobileProfilePage';
import { useNotificationCount } from '../../../hooks/useNotificationCount';
import { authService } from '../../../features/auth/services/authService';
import { message } from '../../../utils/notification';

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
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { unreadCount } = useNotificationCount(isLoggedIn);
  const [loginFormData, setLoginFormData] = useState({
    usernameOrEmail: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Listen for custom notification events from QuickActionsSection
  useEffect(() => {
    const handleShowNotificationModal = () => {
      setShowNotificationModal(true);
    };

    window.addEventListener('showNotificationModal', handleShowNotificationModal);
    
    return () => {
      window.removeEventListener('showNotificationModal', handleShowNotificationModal);
    };
  }, []);

  const handleHeaderLogin = async (e) => {
    e.preventDefault();
    
    if (!loginFormData.usernameOrEmail || !loginFormData.password) {
      message.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    setLoginLoading(true);
    message.info('Đang xử lý đăng nhập...');
    
    try {
      const response = await authService.login(loginFormData);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      message.success('Đăng nhập thành công!');
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      message.error(error.message || 'Đăng nhập thất bại!');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLoginFormChange = (e) => {
    const { name, value } = e.target;
    setLoginFormData(prev => ({ ...prev, [name]: value }));
  };

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
              <div className="hidden md:flex items-center gap-3">
                {/* Username */}
                <button
                  onClick={() => navigate('/wallet')}
                  className="text-gray-700 font-medium hover:underline transition-all text-sm"
                  title="Xem thông tin ví cá nhân"
                >
                  {userName}
                </button>
                
                {/* Balance */}
                <div className="flex items-center gap-2 border border-gray-300 px-3 py-1.5 rounded-full bg-white">
                  <span className="font-semibold text-[#34D399] text-sm">
                    {userBalance.toLocaleString()} điểm
                  </span>
                  <button
                    onClick={onRefreshBalance}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-0 w-4 h-4 flex items-center justify-center"
                  >
                    <Icon icon="mdi:refresh" className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Nạp tiền */}
                <button
                  onClick={() => navigate('/wallet?tab=deposit-withdraw')}
                  className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors px-2.5 py-1.5"
                >
                  <Icon icon="mdi:account" className="w-4 h-4" />
                  <span className="font-medium text-sm">Nạp tiền</span>
                </button>
                
                {/* Rút tiền */}
                <button
                  onClick={() => navigate('/wallet?tab=withdraw')}
                  className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors px-2.5 py-1.5"
                >
                  <Icon icon="mdi:gift" className="w-4 h-4" />
                  <span className="font-medium text-sm">Rút tiền</span>
                </button>
                
                {/* Notification */}
                <NotificationDropdown />
                
                {/* Logout */}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={onLogout}
                  icon={<Icon icon="mdi:logout" className="w-4 h-4" />}
                  className="text-sm font-medium"
                >
                  Đăng xuất
                </Button>
              </div>

              {/* Mobile Logged In Layout */}
              <div className="md:hidden flex items-center gap-1.5">
                {/* Balance with integrated deposit button */}
                <div className="flex items-center gap-1 border border-gray-300 pl-2.5 pr-1 py-1 rounded-full bg-white">
                  <img src="/images/icons/imgi_35_icon-bank.png" alt="Bank" className="w-3.5 h-3.5" />
                  <span className="font-semibold text-[#34D399] text-xs">
                    {userBalance.toLocaleString()}
                  </span>
                  {/* Integrated deposit button */}
                  <button
                    onClick={() => navigate('/wallet?tab=deposit-withdraw')}
                    className="bg-green-600 text-white px-1.5 py-0.5 rounded-full text-[10px] font-medium hover:bg-green-700 transition-colors ml-0.5"
                  >
                    Nạp
                  </button>
                </div>
                
                {/* User icon */}
                <button 
                  onClick={() => setShowProfileModal(true)}
                  className="w-7 h-7 flex items-center justify-center"
                >
                  <Icon icon="mdi:account-circle" className="w-5 h-5 text-gray-600" />
                </button>
                
                {/* Notification icon */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotificationModal(true)}
                    data-notification-button
                    className="w-7 h-7 flex items-center justify-center"
                  >
                    <Icon icon="mdi:forum" className="w-5 h-5 text-gray-600" />
                  </button>
                  {/* Notification badge */}
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-green-500 text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Auth Buttons with Login Form */
            <div className="hidden md:flex items-center gap-2">
              {/* Login Inputs */}
              <form onSubmit={handleHeaderLogin} className="flex items-center gap-2">
                <Input
                  name="usernameOrEmail"
                  value={loginFormData.usernameOrEmail}
                  onChange={handleLoginFormChange}
                  placeholder="Tên đăng nhập"
                  className="h-9 w-32 bg-gray-100 border-gray-300 rounded-xl text-sm focus:border-gray-300 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={loginFormData.password}
                    onChange={handleLoginFormChange}
                    placeholder="Mật khẩu"
                    className="h-9 w-32 bg-gray-100 border-gray-300 rounded-xl text-sm focus:border-gray-300 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} className="w-4 h-4" />
                  </button>
                </div>
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  loading={loginLoading}
                  className="text-sm font-medium px-3 md:px-4 h-9 md:h-10 bg-gradient-to-r from-green-400 to-emerald-600 text-white border-0 hover:from-green-500 hover:to-emerald-700 rounded-xl"
                >
                  Đăng nhập
                </Button>
              </form>
              <Button
                variant="primary"
                size="sm"
                onClick={onRegisterOpen}
                className="text-sm font-semibold px-3 md:px-4 h-9 md:h-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 border-0 hover:from-yellow-500 hover:to-orange-600 rounded-xl"
              >
                Đăng ký
              </Button>
            </div>
          )}
          {!isLoggedIn && (
            /* Mobile Auth Buttons */
            <div className="md:hidden flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onLoginOpen}
                className="text-sm font-medium px-3 h-9 bg-gradient-to-r from-green-400 to-emerald-600 text-white border-0 hover:from-green-500 hover:to-emerald-700 rounded-xl"
              >
                Đăng nhập
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={onRegisterOpen}
                className="text-sm font-semibold px-3 h-9 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 border-0 hover:from-yellow-500 hover:to-orange-600 rounded-xl"
              >
                Đăng ký
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Notification Modal */}
      <MobileNotificationModal 
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
      />

      {/* Mobile Profile Modal */}
      <MobileProfilePage 
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userName={userName}
        userBalance={userBalance}
        onRefreshBalance={onRefreshBalance}
        onLogout={onLogout}
      />
    </header>
  );
};

export default Header;

