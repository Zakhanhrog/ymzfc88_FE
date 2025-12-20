import TransactionHistory from './TransactionHistory';
import DepositWithdraw from './DepositWithdraw';
import WithdrawForm from './WithdrawForm';
import KycVerification from './KycVerification';
import UserPointsPage from './UserPointsPage';
import PromotionContent from './PromotionContent';
import AccountSettings from './AccountSettings';

const WalletContent = ({ activeTab, onTabChange, onProfileUpdate }) => {
  switch (activeTab) {
    case 'deposit-withdraw':
      return <DepositWithdraw />;
    case 'withdraw':
      return <WithdrawForm />;
    case 'points':
      return <UserPointsPage />;
    case 'transaction-history':
      return <TransactionHistory />;
    case 'kyc-verification':
      return <KycVerification />;
    case 'promotions':
      return <PromotionContent />;
    case 'settings':
    case 'account':
      return <AccountSettings onProfileUpdate={onProfileUpdate} />;
    default:
      return <AccountSettings onProfileUpdate={onProfileUpdate} />;
  }
};

export default WalletContent;

