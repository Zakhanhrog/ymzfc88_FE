import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Button, 
  Tabs, 
  Table, 
  Tag, 
  Avatar, 
  Space,
  Modal,
  message
} from 'antd';
import {
  WalletOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CreditCardOutlined,
  BankOutlined,
  MobileOutlined,
  SettingOutlined,
  HistoryOutlined,
  GiftOutlined,
  TrophyOutlined,
  UserOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons';
import Layout from '../../../components/common/Layout';
import { THEME_COLORS } from '../../../utils/theme';
import WalletBalance from '../components/WalletBalance';
import TransactionHistory from '../components/TransactionHistory';
import DepositWithdraw from '../components/DepositWithdraw';
import PaymentMethods from '../components/PaymentMethods';
import UserPaymentMethodManagement from '../components/UserPaymentMethodManagement';
import WithdrawForm from '../components/WithdrawForm';

const { TabPane } = Tabs;

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

  const statisticCardStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '16px',
    border: 'none',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  };

  const primaryCardStyle = {
    background: THEME_COLORS.primaryGradient,
    borderRadius: '16px',
    border: 'none',
    boxShadow: '0 8px 32px rgba(211,1,2,0.2)',
  };

  const goldCardStyle = {
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    borderRadius: '16px',
    border: 'none',
    boxShadow: '0 8px 32px rgba(255,215,0,0.2)',
  };

  const greenCardStyle = {
    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    borderRadius: '16px',
    border: 'none',
    boxShadow: '0 8px 32px rgba(76,175,80,0.2)',
  };

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
      key: 'payment-methods',
      label: (
        <span className="flex items-center gap-2">
          <BankOutlined />
          Phương thức nạp tiền
        </span>
      ),
      children: <PaymentMethods />
    },
    {
      key: 'withdraw-methods',
      label: (
        <span className="flex items-center gap-2">
          <CreditCardOutlined />
          Phương thức rút tiền
        </span>
      ),
      children: <UserPaymentMethodManagement />
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
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header thông tin người dùng */}
        <Card 
          className="mb-6 shadow-lg"
          style={{ 
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none'
          }}
          styles={{ body: { padding: '24px' } }}
        >
          <Row align="middle" justify="space-between">
            <Col>
              <Space size="large" align="center">
                <Avatar 
                  size={80} 
                  icon={<UserOutlined />} 
                  style={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    border: '3px solid rgba(255,255,255,0.3)'
                  }}
                />
                <div>
                  <h2 className="text-white text-2xl font-bold mb-1">
                    Chào mừng, {userInfo.username}
                  </h2>
                  <div className="text-white/80 space-y-1">
                    <div>Email: {userInfo.email}</div>
                    <div>SĐT: {userInfo.phone}</div>
                    <Tag color="gold" className="mt-2">
                      <TrophyOutlined /> VIP {userInfo.vipLevel}
                    </Tag>
                  </div>
                </div>
              </Space>
            </Col>
            <Col>
              <Button 
                type="primary"
                size="large"
                icon={<SettingOutlined />}
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                style={{ borderRadius: '12px' }}
              >
                Cài đặt tài khoản
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Tabs chính */}
        <Card 
          className="shadow-lg"
          style={{ borderRadius: '16px' }}
          styles={{ body: { padding: '24px' } }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            type="card"
            size="large"
            className="wallet-tabs"
            items={tabItems}
          />
        </Card>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .wallet-tabs .ant-tabs-tab {
            border-radius: 12px 12px 0 0 !important;
            border: none !important;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
            margin-right: 8px !important;
            font-weight: 600 !important;
            transition: all 0.3s ease !important;
          }
          
          .wallet-tabs .ant-tabs-tab:hover {
            background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%) !important;
            transform: translateY(-2px) !important;
          }
          
          .wallet-tabs .ant-tabs-tab-active {
            background: ${THEME_COLORS.primaryGradient} !important;
            color: white !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 20px rgba(211,1,2,0.3) !important;
          }
          
          .wallet-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
            color: white !important;
          }
          
          .wallet-tabs .ant-tabs-content {
            padding: 24px 0 !important;
          }
          
          .wallet-tabs .ant-tabs-tabpane {
            background: transparent !important;
          }
        `
      }} />
    </Layout>
  );
};

export default UserWalletPage;