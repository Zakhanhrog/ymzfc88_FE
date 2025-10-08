  import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Card, 
  Button, 
  Tabs, 
  Tag, 
  Avatar
} from 'antd';
import {
  WalletOutlined,
  ArrowDownOutlined,
  CreditCardOutlined,
  BankOutlined,
  SettingOutlined,
  HistoryOutlined,
  TrophyOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  StarOutlined
} from '@ant-design/icons';
import Layout from '../../../components/common/Layout';
import WalletBalance from '../components/WalletBalance';
import TransactionHistory from '../components/TransactionHistory';
import DepositWithdraw from '../components/DepositWithdraw';
import WithdrawForm from '../components/WithdrawForm';
import KycVerification from '../components/KycVerification';
import UserPointsPage from '../components/UserPointsPage';
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const tabItems = [
    {
      key: 'balance',
      label: (
        <span className="flex items-center gap-2">
          <WalletOutlined />
          Số dư ví
        </span>
      ),
      children: <WalletBalance 
        onTabChange={setActiveTab}
      />
    },
    {
      key: 'deposit-withdraw',
      label: (
        <span className="flex items-center gap-2">
          <CreditCardOutlined />
          Nạp tiền
        </span>
      ),
      children: <DepositWithdraw />
    },
    {
      key: 'withdraw',
      label: (
        <span className="flex items-center gap-2">
          <ArrowDownOutlined />
          Rút tiền
        </span>
      ),
      children: <WithdrawForm />
    },
    {
      key: 'points',
      label: (
        <span className="flex items-center gap-2">
          <StarOutlined />
          Điểm
        </span>
      ),
      children: <UserPointsPage />
    },
    {
      key: 'transaction-history',
      label: (
        <span className="flex items-center gap-2">
          <HistoryOutlined />
          Lịch sử giao dịch
        </span>
      ),
      children: <TransactionHistory />
    },
    {
      key: 'kyc-verification',
      label: (
        <span className="flex items-center gap-2">
          <SafetyCertificateOutlined />
          Xác thực tài khoản
        </span>
      ),
      children: <KycVerification />
    },
    {
      key: 'settings',
      label: (
        <span className="flex items-center gap-2">
          <SettingOutlined />
          Cài đặt tài khoản
        </span>
      ),
      children: (
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Cài đặt tài khoản</h3>
          <p className="text-gray-600">Trang cài đặt tài khoản đang được phát triển...</p>
        </div>
      )
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 px-2 py-4 md:p-6">
        {/* Header thông tin người dùng - Responsive */}
        <Card 
          className="mb-4 shadow-md"
          style={{ 
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            border: 'none'
          }}
          styles={{ body: { padding: window.innerWidth < 768 ? '16px' : '24px' } }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* User Info */}
            <div className="flex items-center gap-3 md:gap-4">
              <Avatar 
                size={window.innerWidth < 768 ? 60 : 80}
                icon={<UserOutlined />} 
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  border: '2px solid rgba(255,255,255,0.3)'
                }}
              />
              <div>
                <h2 className="text-white text-lg md:text-2xl font-bold mb-1">
                  Chào mừng, {userInfo.fullName || userInfo.username}
                </h2>
                <div className="text-white/90 text-xs md:text-sm space-y-0.5">
                  <div>Email: {userInfo.email}</div>
                  {userInfo.phone && <div>SĐT: {userInfo.phone}</div>}
                  {kycVerified && userInfo.idNumber && (
                    <div>Số CCCD: {userInfo.idNumber}</div>
                  )}
                  {kycVerified ? (
                    <Tag color="green" className="mt-1 text-xs">
                      <CheckCircleOutlined /> Đã xác thực
                    </Tag>
                  ) : (
                    <Tag color="orange" className="mt-1 text-xs">
                      <SafetyCertificateOutlined /> Chưa xác thực
                    </Tag>
                  )}
                </div>
              </div>
            </div>
            

          </div>
        </Card>

        {/* Tabs chính */}
        <Card 
          className="shadow-md"
          style={{ borderRadius: '16px' }}
          styles={{ body: { padding: window.innerWidth < 768 ? '12px' : '24px' } }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            type="card"
            size={window.innerWidth < 768 ? 'middle' : 'large'}
            className="wallet-tabs"
            items={tabItems}
            animated={{ 
              inkBar: true, 
              tabPane: true 
            }}
            tabBarStyle={{
              marginBottom: '0px'
            }}
          />
        </Card>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .wallet-tabs .ant-tabs-tab {
            border-radius: 12px !important;
            border: none !important;
            background: #f3f4f6 !important;
            margin-right: 8px !important;
            font-weight: 500 !important;
            font-size: 14px !important;
            padding: 12px 16px !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05) !important;
          }
          
          .wallet-tabs .ant-tabs-tab:hover {
            background: #e5e7eb !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
          }
          
          .wallet-tabs .ant-tabs-tab-active {
            background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%) !important;
            color: white !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 16px rgba(220, 38, 38, 0.3) !important;
          }
          
          .wallet-tabs .ant-tabs-tab-active:hover {
            background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%) !important;
            color: white !important;
            transform: translateY(-2px) !important;
          }
          
          .wallet-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
            color: white !important;
          }
          
          .wallet-tabs .ant-tabs-content {
            padding: 20px 0 !important;
            border-radius: 16px !important;
            background: #ffffff !important;
            margin-top: 8px !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06) !important;
          }
          
          .wallet-tabs .ant-tabs-tabpane {
            background: transparent !important;
            animation: fadeIn 0.3s ease-in-out !important;
          }
          
          .wallet-tabs .ant-tabs-nav {
            margin-bottom: 0 !important;
          }
          
          .wallet-tabs .ant-tabs-nav-wrap {
            background: transparent !important;
            border-radius: 16px !important;
            padding: 8px !important;
          }
          
          .wallet-tabs .ant-tabs-ink-bar {
            display: none !important;
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          /* Mobile responsive tabs */
          @media (max-width: 768px) {
            .wallet-tabs .ant-tabs-tab {
              font-size: 12px !important;
              padding: 8px 12px !important;
              margin-right: 4px !important;
              border-radius: 8px !important;
            }
            
            .wallet-tabs .ant-tabs-nav-wrap {
              padding: 4px !important;
            }
            
            .wallet-tabs .ant-tabs-content {
              margin-top: 4px !important;
              padding: 16px 0 !important;
            }
          }
          
          /* Smooth transition cho tab content */
          .wallet-tabs .ant-tabs-tabpane-active {
            animation: slideInUp 0.3s ease-out !important;
          }
          
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `
      }} />
    </Layout>
  );
};

export default UserWalletPage;