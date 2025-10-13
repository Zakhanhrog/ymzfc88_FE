import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../../../components/common/Layout';
import UserInfoHeader from './UserInfoHeader';
import WalletTabsContent from './WalletTabsContent';
import WalletTabsStyles from './WalletTabsStyles';
import MobileWalletPage from '../pages/MobileWalletPage';
import kycService from '../services/kycService';

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
      <div className="min-h-screen bg-gray-50 px-6 py-4">
        {/* Header thông tin người dùng - Responsive */}
        <UserInfoHeader userInfo={userInfo} kycVerified={kycVerified} />

        {/* Tabs chính */}
        <WalletTabsContent activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Wallet Tabs Styles */}
      <WalletTabsStyles />
    </Layout>
  );
};

export default ResponsiveWalletWrapper;
