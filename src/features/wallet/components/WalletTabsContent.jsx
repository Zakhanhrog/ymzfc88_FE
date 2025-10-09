import { Card, Tabs } from '../../../components/ui';
import { Icon } from '@iconify/react';
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
      label: 'Số dư ví',
      icon: <Icon icon="mdi:wallet" />,
      children: <WalletBalance onTabChange={onTabChange} />
    },
    {
      key: 'deposit-withdraw',
      label: 'Nạp tiền',
      icon: <Icon icon="mdi:credit-card" />,
      children: <DepositWithdraw />
    },
    {
      key: 'withdraw',
      label: 'Rút tiền',
      icon: <Icon icon="mdi:arrow-down-circle" />,
      children: <WithdrawForm />
    },
    {
      key: 'points',
      label: 'Điểm',
      icon: <Icon icon="mdi:star" />,
      children: <UserPointsPage />
    },
    {
      key: 'transaction-history',
      label: 'Lịch sử giao dịch',
      icon: <Icon icon="mdi:history" />,
      children: <TransactionHistory />
    },
    {
      key: 'kyc-verification',
      label: 'Xác thực tài khoản',
      icon: <Icon icon="mdi:shield-check" />,
      children: <KycVerification />
    },
    {
      key: 'settings',
      label: 'Cài đặt tài khoản',
      icon: <Icon icon="mdi:cog" />,
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
      className="shadow-md rounded-2xl"
      bodyClassName={window.innerWidth < 768 ? 'p-3' : 'p-6'}
    >
      <Tabs
        activeKey={activeTab}
        onChange={onTabChange}
        className="wallet-tabs"
        items={tabItems}
      />
    </Card>
  );
};

export default WalletTabsContent;

