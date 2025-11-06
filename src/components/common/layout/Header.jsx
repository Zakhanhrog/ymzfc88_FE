import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button, Input } from '../../ui';
import { Dropdown, Empty, Spin } from 'antd';
import NotificationDropdown from '../../../features/notification/components/NotificationDropdown';
import MobileNotificationModal from '../../../features/notification/components/MobileNotificationModal';
import MobileProfilePage from '../../../features/profile/components/MobileProfilePage';
import { useNotificationCount } from '../../../hooks/useNotificationCount';
import { authService } from '../../../features/auth/services/authService';
import { message } from '../../../utils/notification';
import notificationService from '../../../features/notification/services/notificationService';
import moment from 'moment';
import 'moment/locale/vi';

moment.locale('vi');

const Header = ({ 
  isLoggedIn, 
  sidebarCollapsed,
  onSidebarToggle,
  onLoginOpen, 
  onRegisterOpen,
  userName,
  userBalance,
  onRefreshBalance,
  onLogout,
  onMobileMenuToggle
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
  const [notifications, setNotifications] = useState([]);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

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

  // Hide MainNavigationBar when notification modal is open
  useEffect(() => {
    if (showNotificationModal) {
      document.body.setAttribute('data-notification-modal-open', 'true');
    } else {
      document.body.removeAttribute('data-notification-modal-open');
    }
  }, [showNotificationModal]);

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

  const handleNotificationDropdownOpen = (open) => {
    setNotificationDropdownOpen(open);
    if (open) {
      loadNotifications();
    }
  };

  const loadNotifications = async () => {
    setNotificationLoading(true);
    try {
      const response = await notificationService.getMyNotifications(0, 10);
      if (response && response.success && response.data) {
        const notificationList = Array.isArray(response.data) 
          ? response.data 
          : (response.data.content || response.data.notifications || []);
        setNotifications(notificationList || []);
      }
    } catch (error) {
    } finally {
      setNotificationLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
    } catch (error) {
    }
  };

  const notificationContent = (
    <div className="w-80 max-h-96 overflow-y-auto bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-bold text-lg">Thông báo</h3>
      </div>

      {notificationLoading ? (
        <div className="flex justify-center py-8">
          <Spin />
        </div>
      ) : notifications.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Không có thông báo"
          style={{ padding: 32 }}
        />
      ) : (
        <div className="divide-y divide-gray-100">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                !notification.isRead ? 'bg-blue-50' : ''
              }`}
              onClick={() => {
                if (!notification.isRead) {
                  handleMarkAsRead(notification.id);
                }
                navigate(`/notifications/${notification.id}`);
                setNotificationDropdownOpen(false);
              }}
            >
              <div className="flex items-start gap-3">
                <Icon icon="mdi:information" className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-semibold text-sm text-gray-900 line-clamp-2">
                      {notification.title}
                    </p>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    {moment(notification.createdAt).fromNow()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 h-[60px] md:h-[70px] bg-gray-50 border-b border-gray-200 z-20 pl-2 pr-4 md:px-6">
      <div className="w-full h-full flex items-center justify-between">
        {/* Left: Logo & Menu Toggle */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile Menu Toggle */}
          {onMobileMenuToggle && (
            <button
              onClick={onMobileMenuToggle}
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            >
              <Icon icon="mdi:menu" className="w-6 h-6 text-gray-700" />
            </button>
          )}
          
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
              className="h-7 md:h-12 w-auto object-contain transition-transform duration-300 hover:scale-110"
              style={{ maxHeight: '32px' }}
            />
          </div>
        </div>
        
        {/* Right: User Menu / Auth Buttons */}
        <div className="flex items-center gap-2 md:gap-4">
          {isLoggedIn ? (
            <>
              {/* Desktop Logged In Layout */}
              <div className="hidden md:flex items-center gap-2.5">
                {/* Notifications Icon */}
                <Dropdown
                  trigger={['click']}
                  placement="bottomRight"
                  open={notificationDropdownOpen}
                  onOpenChange={handleNotificationDropdownOpen}
                  dropdownRender={() => notificationContent}
                >
                  <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 hover:border-gray-400 rounded-lg transition-colors relative">
                    <Icon icon="mdi:bell" className="w-5 h-5 text-gray-700" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </button>
                </Dropdown>
                
                {/* User Profile and Balance */}
                <button
                  onClick={() => navigate('/account')}
                  className="h-10 flex items-center gap-2.5 bg-white border border-gray-300 hover:border-gray-400 rounded-lg pl-1.5 pr-3.5 transition-colors"
                  title="Xem thông tin ví cá nhân"
                >
                  <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                    <Icon icon="mdi:account" className="w-5 h-5 text-gray-700" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-gray-800 text-xs font-medium truncate max-w-[120px]">
                      {userName}
                    </span>
                    <span className="text-yellow-500 font-semibold text-xs">
                      {userBalance.toLocaleString()} điểm
                    </span>
                  </div>
                </button>
                
                {/* Nạp Tiền Button */}
                <button
                  onClick={() => navigate('/wallet?tab=deposit-withdraw')}
                  className="h-10 px-6 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white font-semibold text-sm rounded-lg transition-all shadow-sm flex items-center"
                >
                  Nạp Tiền
                </button>
                
                {/* Logout */}
                <button
                  onClick={onLogout}
                  className="text-gray-600 hover:text-gray-900 transition-colors p-2"
                  title="Đăng xuất"
                >
                  <Icon icon="mdi:logout" className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Logged In Layout */}
              <div className="md:hidden flex items-center gap-1.5">
                {/* Notification icon */}
                <div className="relative">
                  <button 
                    onClick={() => navigate('/notifications', { replace: false })}
                    data-notification-button
                    className="w-[28px] h-[28px] flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <Icon icon="mdi:bell" className="w-5 h-5 text-gray-700" />
                  </button>
                  {/* Notification badge */}
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </div>
                
                {/* Balance Display with integrated Add button */}
                <div className="flex items-center gap-1.5 pl-2.5 pr-1 h-[28px] bg-gray-200 rounded-lg">
                  <span className="font-semibold text-yellow-500 text-xs">
                    {userBalance.toLocaleString()} điểm
                  </span>
                  {/* Add/Deposit button inside */}
                  <button
                    onClick={() => navigate('/wallet?tab=deposit-withdraw')}
                    className="flex items-center justify-center bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 rounded-md transition-colors flex-shrink-0 my-0.5"
                    style={{ width: '22px', height: '22px' }}
                  >
                    <Icon icon="mdi:plus" className="w-4 h-4 text-gray-900" />
                  </button>
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
                  className="text-sm font-medium px-3 md:px-4 h-8 md:h-9 bg-gradient-to-r from-green-400 to-emerald-600 text-white border-0 hover:from-green-500 hover:to-emerald-700 rounded-lg"
                >
                  Đăng nhập
                </Button>
              </form>
              <Button
                variant="primary"
                size="sm"
                onClick={onRegisterOpen}
                className="text-sm font-semibold px-3 md:px-4 h-8 md:h-9 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 border-0 hover:from-yellow-500 hover:to-orange-600 rounded-lg"
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
                          onClick={() => navigate('/login', { replace: true })}
                          className="text-sm font-medium px-3 h-8 bg-gradient-to-r from-green-400 to-emerald-600 text-white border-0 hover:from-green-500 hover:to-emerald-700 rounded-lg"
              >
                Đăng nhập
              </Button>
              <Button
                variant="primary"
                size="sm"
                          onClick={() => navigate('/register', { replace: true })}
                          className="text-sm font-semibold px-3 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 border-0 hover:from-yellow-500 hover:to-orange-600 rounded-lg"
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

