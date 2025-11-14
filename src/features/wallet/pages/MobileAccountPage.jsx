import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Layout from '../../../components/common/Layout';
import LogoutConfirmModal from '../../../components/common/LogoutConfirmModal';
import pointService from '../../../services/pointService';

const MobileAccountPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userBalance, setUserBalance] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      
      // Gọi API /auth/me để lấy thông tin user mới nhất
      const response = await fetch('https://api.tathiet168.com/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        if (userData.success && userData.data) {
          const user = userData.data;
          setUserInfo(user);
          setUserBalance(user.points || 0);
          localStorage.setItem('user', JSON.stringify(user));
          return;
        }
      }
      
      // Fallback: lấy từ localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setUserInfo(user);
      setUserBalance(user.points || 0);
    } catch (error) {
      console.error('Error fetching user info:', error);
      // Fallback: lấy từ localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setUserInfo(user);
      setUserBalance(user.points || 0);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      // Call logout API if needed
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          await fetch('https://api.tathiet168.com/api/auth/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });
        } catch (apiError) {
          console.error('Logout API error:', apiError);
          // Continue with local logout even if API fails
        }
      }
      
      // Remove all tokens and user data
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('adminUser');
      setShowLogoutModal(false);
      
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout locally even if API fails
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('adminUser');
      setShowLogoutModal(false);
      setIsLoggingOut(false);
    }
  };

  const menuItems = [
    {
      key: 'balance',
      label: 'Tổng Quan',
      icon: '/iconacc/imgi_24_overview.avif',
      section: 'Giao Dịch',
      action: () => navigate('/wallet?tab=balance')
    },
    {
      key: 'deposit-withdraw',
      label: 'Nạp Tiền',
      icon: '/iconacc/imgi_25_deposit.avif',
      section: 'Giao Dịch',
      action: () => navigate('/wallet?tab=deposit-withdraw')
    },
    {
      key: 'withdraw',
      label: 'Rút Tiền',
      icon: '/iconacc/imgi_26_withdraw.avif',
      section: 'Giao Dịch',
      action: () => navigate('/wallet?tab=withdraw')
    },
    {
      key: 'transaction-history',
      label: 'Lịch Sử Cược/Giao Dịch',
      icon: '/iconacc/imgi_28_history.avif',
      section: 'Giao Dịch',
      action: () => navigate('/wallet?tab=transaction-history')
    },
    {
      key: 'kyc-verification',
      label: 'Xác thực tài khoản (KYC)',
      icon: '/iconacc/imgi_29_account.avif',
      section: 'Thông Tin',
      action: () => navigate('/wallet?tab=kyc-verification')
    },
    {
      key: 'account',
      label: 'Tài khoản',
      icon: '/iconacc/imgi_24_overview.avif',
      section: 'Thông Tin',
      action: () => navigate('/wallet?tab=account')
    },
    {
      key: 'promotions',
      label: 'Khuyến Mãi',
      icon: '/iconacc/imgi_30_promotion.avif',
      section: 'Thông Tin',
      action: () => navigate('/promotions')
    }
  ];

  const sections = ['Giao Dịch', 'Thông Tin'];

  const getActiveSection = () => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    return tab || 'balance';
  };

  const activeTab = getActiveSection();

  const referralCode = userInfo?.referralCode;

  return (
    <Layout>
      <div className="md:hidden w-full bg-gray-50 pb-20">
        {/* Main Content Card */}
        <div className="bg-white rounded-2xl mt-3">
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
              <div className="flex-1">
                <p className="text-white/90 text-xs mb-1">Số dư ví</p>
                <p className="text-white text-lg font-bold mb-2">
                  {userBalance.toLocaleString()} điểm
                </p>
                {referralCode ? (
                  <p className="text-white/90 text-xs">
                    Mã mời: <span className="font-semibold text-white">{referralCode}</span>
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-1 border-2 border-white/30">
                  <img 
                    src="/iconacc/imgi_29_account.avif" 
                    alt="Account"
                    className="w-8 h-8"
                  />
                </div>
                <span className="text-white/90 text-xs font-medium">PHỔ THÔNG</span>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="p-4">
            {sections.map((section, sectionIndex) => (
              <div key={section}>
                {sectionIndex > 0 && (
                  <div className="border-t border-gray-200 my-3"></div>
                )}
                
                {/* Section Header - only show for first section */}
                {sectionIndex === 0 && (
                  <>
                    <div className="mb-3">
                      <button
                        onClick={() => menuItems.find(item => item.section === section && item.key === 'balance')?.action()}
                        className="w-full flex items-center gap-3 p-2.5 text-left hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <img 
                          src="/iconacc/imgi_24_overview.avif" 
                          alt="Tổng Quan"
                          className="w-6 h-6"
                        />
                        <span className="text-gray-900 text-base font-medium">Tổng Quan</span>
                      </button>
                    </div>
                    <h3 className="text-gray-600 text-xs font-medium mb-2 px-1">
                      {section}
                    </h3>
                  </>
                )}

                {sectionIndex > 0 && (
                  <h3 className="text-gray-600 text-xs font-medium mb-2 px-1">
                    {section}
                  </h3>
                )}

                {menuItems
                  .filter(item => item.section === section && (sectionIndex === 0 ? item.key !== 'balance' : true))
                  .map((item) => (
                    <button
                      key={item.key}
                      onClick={item.action}
                      className="w-full flex items-center gap-3 p-2.5 text-left hover:bg-gray-50 rounded-lg transition-colors mb-0.5"
                    >
                      <img 
                        src={item.icon} 
                        alt={item.label}
                        className="w-6 h-6"
                      />
                      <span className="text-gray-900 text-base font-medium">{item.label}</span>
                    </button>
                  ))}
              </div>
            ))}
          </div>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Icon icon="mdi:logout" className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900 text-base font-medium">Đăng Xuất</span>
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirm Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        loading={isLoggingOut}
      />
    </Layout>
  );
};

export default MobileAccountPage;

