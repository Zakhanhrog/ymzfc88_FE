import { Card, CardContent, Tabs } from '../../../components/ui';
import { Icon } from '@iconify/react';
import TransactionHistory from './TransactionHistory';
import DepositWithdraw from './DepositWithdraw';
import WithdrawForm from './WithdrawForm';
import KycVerification from './KycVerification';
import UserPointsPage from './UserPointsPage';
import AccountSettings from './AccountSettings';

const WalletTabsContent = ({ activeTab, onTabChange, onProfileUpdate }) => {
  const tabItems = [
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
      label: 'Tài khoản',
      icon: <Icon icon="mdi:account-cog" />,
      children: <AccountSettings onProfileUpdate={onProfileUpdate} />
    }
  ];

  return (
    <Card className="border border-gray-200 shadow-lg">
      <CardContent className="p-0">
        <Tabs
          activeKey={activeTab}
          onChange={onTabChange}
          className="wallet-tabs"
          items={tabItems}
        />
      </CardContent>
    </Card>
  );
};

export default WalletTabsContent;

