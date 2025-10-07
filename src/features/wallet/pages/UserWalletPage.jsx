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
  UserOutlined
} from '@ant-design/icons';
import Layout from '../../../components/common/Layout';
import WalletBalance from '../components/WalletBalance';
import TransactionHistory from '../components/TransactionHistory';
import DepositWithdraw from '../components/DepositWithdraw';
import WithdrawForm from '../components/WithdrawForm';

const UserWalletPage = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('balance');
  const [userInfo, setUserInfo] = useState({
    username: 'user123',
    email: 'user@example.com',
    phone: '0901234567',
    vipLevel: 'Gold',
    totalDeposit: 50000000,
    totalWithdraw: 30000000
  });

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
      key: 'transaction-history',
      label: (
        <span className="flex items-center gap-2">
          <HistoryOutlined />
          Lịch sử giao dịch
        </span>
      ),
      children: <TransactionHistory />
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
                  Chào mừng, {userInfo.username}
                </h2>
                <div className="text-white/90 text-xs md:text-sm space-y-0.5">
                  <div>Email: {userInfo.email}</div>
                  <div>SĐT: {userInfo.phone}</div>
                  <Tag color="gold" className="mt-1 text-xs">
                    <TrophyOutlined /> VIP {userInfo.vipLevel}
                  </Tag>
                </div>
              </div>
            </div>
            
            {/* Settings button - Hidden on mobile */}
            <div className="hidden md:block">
              <Button 
                type="primary"
                size="large"
                icon={<SettingOutlined />}
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                style={{ borderRadius: '12px' }}
              >
                Cài đặt tài khoản
              </Button>
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
          />
        </Card>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .wallet-tabs .ant-tabs-tab {
            border-radius: 8px 8px 0 0 !important;
            border: none !important;
            background: #f3f4f6 !important;
            margin-right: 4px !important;
            font-weight: 500 !important;
            font-size: 14px !important;
            padding: 8px 12px !important;
            transition: all 0.3s ease !important;
          }
          
          .wallet-tabs .ant-tabs-tab:hover {
            background: #e5e7eb !important;
          }
          
          .wallet-tabs .ant-tabs-tab-active {
            background: #dc2626 !important;
            color: white !important;
          }
          
          .wallet-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
            color: white !important;
          }
          
          .wallet-tabs .ant-tabs-content {
            padding: 16px 0 !important;
          }
          
          .wallet-tabs .ant-tabs-tabpane {
            background: transparent !important;
          }
          
          /* Mobile responsive tabs */
          @media (max-width: 768px) {
            .wallet-tabs .ant-tabs-tab {
              font-size: 12px !important;
              padding: 6px 8px !important;
              margin-right: 2px !important;
            }
            
            .wallet-tabs .ant-tabs-nav {
              margin-bottom: 12px !important;
            }
          }
        `
      }} />
    </Layout>
  );
};

export default UserWalletPage;