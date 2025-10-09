import { Card, Tabs } from 'antd';
import {
  WalletOutlined,
  ArrowDownOutlined,
  CreditCardOutlined,
  HistoryOutlined,
  SettingOutlined,
  SafetyCertificateOutlined,
  StarOutlined
} from '@ant-design/icons';
import WalletBalance from './WalletBalance';
import TransactionHistory from './TransactionHistory';
import DepositWithdraw from './DepositWithdraw';
import WithdrawForm from './WithdrawForm';
import KycVerification from './KycVerification';
import UserPointsPage from './UserPointsPage';

const WalletTabsContent = ({ activeTab, onTabChange }) => {
  const tabItems = [
    {
      key: 'balance',
      label: (
        <span className="flex items-center gap-2">
          <WalletOutlined />
          Số dư ví
        </span>
      ),
      children: <WalletBalance onTabChange={onTabChange} />
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
    <Card 
      className="shadow-md"
      style={{ borderRadius: '16px' }}
      styles={{ body: { padding: window.innerWidth < 768 ? '12px' : '24px' } }}
    >
      <Tabs
        activeKey={activeTab}
        onChange={onTabChange}
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
  );
};

export default WalletTabsContent;

