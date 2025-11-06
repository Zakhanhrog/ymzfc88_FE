import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Layout from '../../../components/common/Layout';
import MobileWalletBalance from '../components/MobileWalletBalance';
import MobileTransactionHistory from '../components/MobileTransactionHistory';
import DepositWithdraw from '../components/DepositWithdraw';
import WithdrawForm from '../components/WithdrawForm';
import KycVerification from '../components/KycVerification';
import kycService from '../services/kycService';

const MobileWalletPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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

  const getTabTitle = () => {
    switch (activeTab) {
      case 'balance': return 'Số dư ví';
      case 'deposit-withdraw': return 'Nạp tiền';
      case 'withdraw': return 'Rút tiền';
      case 'transaction-history': return 'Lịch sử giao dịch';
      case 'kyc-verification':
      case 'account': return 'Xác thực tài khoản';
      default: return 'Ví tiền';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'balance':
        return <MobileWalletBalance onTabChange={setActiveTab} />;
      case 'deposit-withdraw':
        return <DepositWithdraw />;
      case 'withdraw':
        return <WithdrawForm />;
      case 'transaction-history':
        return <MobileTransactionHistory />;
      case 'kyc-verification':
      case 'account':
        return <KycVerification />;
      default:
        return <MobileWalletBalance onTabChange={setActiveTab} />;
    }
  };

  return (
    <Layout>
      <div className="md:hidden w-full bg-gray-50 pb-20 pt-3">
        {/* Mobile Content */}
        <div>
          {renderTabContent()}
        </div>
      </div>
    </Layout>
  );
};

export default MobileWalletPage;
