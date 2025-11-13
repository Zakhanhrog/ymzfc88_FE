import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../../../components/common/Layout';
import WalletSidebar from './WalletSidebar';
import WalletContent from './WalletContent';
import MobileWalletPage from '../pages/MobileWalletPage';
import PromotionMobileWrapper from '../../promotions/components/PromotionMobileWrapper';
import kycService from '../services/kycService';
import walletService from '../services/walletService';

const ResponsiveWalletWrapper = ({ initialTab }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(initialTab || 'balance');
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    phone: '',
    fullName: '',
    referralCode: '',
    idNumber: ''
  });
  const [kycVerified, setKycVerified] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    // Check mobile synchronously on initialization to prevent flash
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });
  const [userBalance, setUserBalance] = useState(0);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch user info from localStorage
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserInfo({
          username: userData.username || '',
          email: userData.email || '',
          phone: userData.phoneNumber || userData.phone || '',
          fullName: userData.fullName || '',
          referralCode: userData.referralCode || userData.inviteCode || '',
          idNumber: ''
        });
      } catch (error) {
      }
    }
  }, []);

  // Fetch wallet balance
  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const response = await walletService.getWalletBalance();
        if (response.success && response.data) {
          setUserBalance(response.data.points || 0);
        }
      } catch (error) {
        // Fallback to localStorage
        const user = localStorage.getItem('user');
        if (user) {
          try {
            const userData = JSON.parse(user);
            setUserBalance(userData.points || 0);
          } catch (e) {
            setUserBalance(0);
          }
        }
      }
    };
    
    fetchWalletBalance();
  }, [activeTab]);

  // Fetch KYC status
  useEffect(() => {
    const fetchKycStatus = async () => {
      try {
        const response = await kycService.getKycStatus();
        if (response.success && response.data) {
          if (response.data.status === 'APPROVED') {
            setKycVerified(true);
          }
          if (response.data.fullName) {
            setUserInfo(prev => ({
              ...prev,
              fullName: response.data.fullName,
              idNumber: response.data.idNumber || ''
            }));
          }
        }
      } catch (error) {
      }
    };
    
    fetchKycStatus();
  }, [activeTab]);

  // Effect để set active tab từ URL params hoặc initialTab hoặc pathname
  useEffect(() => {
    // Check if we're on /promotions route
    if (location.pathname === '/promotions') {
      setActiveTab('promotions');
      return;
    }
    
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    } else if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [searchParams, initialTab, location.pathname]);

  // Handler để cập nhật tab và URL
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Nếu đang ở /account, giữ nguyên URL, chỉ cập nhật tab
    if (location.pathname === '/account') {
      // Không cần cập nhật URL vì đã ở /account
    } else if (tab === 'promotions') {
      // Navigate to /promotions route
      navigate('/promotions', { replace: true });
    } else {
      // Nếu đang ở /wallet, cập nhật URL với query param
      navigate(`/wallet?tab=${tab}`, { replace: true });
    }
  };

  const handleProfileUpdate = (data) => {
    setUserInfo(prev => ({
      ...prev,
      username: data.username ?? prev.username,
      email: data.email ?? prev.email,
      phone: data.phoneNumber ?? prev.phone,
      fullName: data.fullName ?? prev.fullName,
      referralCode: data.referralCode ?? prev.referralCode,
    }));
  };

  // Return mobile version
  if (isMobile) {
    // If on promotions route, show PromotionMobileWrapper
    if (location.pathname === '/promotions') {
      return <PromotionMobileWrapper />;
    }
    return <MobileWalletPage />;
  }

  // Return desktop version
  return (
    <Layout>
      <div className="min-h-[calc(100vh-70px)] bg-gray-50 flex">
        {/* Sidebar */}
        <WalletSidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          userBalance={userBalance}
          userInfo={userInfo}
          kycVerified={kycVerified}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 pb-6">
            <WalletContent
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onProfileUpdate={handleProfileUpdate}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResponsiveWalletWrapper;
