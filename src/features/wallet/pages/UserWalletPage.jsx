import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../../../components/common/Layout';
import UserInfoHeader from '../components/UserInfoHeader';
import WalletTabsContent from '../components/WalletTabsContent';
import WalletTabsStyles from '../components/WalletTabsStyles';
import kycService from '../services/kycService';

const UserWalletPage = () => {
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
        console.error('Error parsing user data:', error);
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
          // Cập nhật thông tin từ KYC nếu có
          if (response.data.fullName) {
            setUserInfo(prev => ({
              ...prev,
              fullName: response.data.fullName,
              idNumber: response.data.idNumber || ''
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching KYC status:', error);
      }
    };
    
    fetchKycStatus();
  }, [activeTab]); // Re-fetch when tab changes

  // Effect để set active tab từ URL params
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 px-2 py-4 md:p-6">
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

export default UserWalletPage;
