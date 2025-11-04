import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../../../components/common/Layout';
import WalletSidebar from './WalletSidebar';
import WalletContent from './WalletContent';
import MobileWalletPage from '../pages/MobileWalletPage';
import kycService from '../services/kycService';
import walletService from '../services/walletService';

const ResponsiveWalletWrapper = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('balance');
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    phone: '',
    fullName: '',
    idNumber: ''
  });
  const [kycVerified, setKycVerified] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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

  // Effect để set active tab từ URL params
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Return mobile version
  if (isMobile) {
    return <MobileWalletPage />;
  }

  // Return desktop version
  return (
    <Layout>
      <div className="min-h-[calc(100vh-70px)] bg-gray-50 flex">
        {/* Sidebar */}
        <WalletSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          userBalance={userBalance}
          userInfo={userInfo}
          kycVerified={kycVerified}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 pb-6">
            <WalletContent activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResponsiveWalletWrapper;
