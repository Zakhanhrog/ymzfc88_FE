import WalletBalance from './WalletBalance';
import TransactionHistory from './TransactionHistory';
import DepositWithdraw from './DepositWithdraw';
import WithdrawForm from './WithdrawForm';
import KycVerification from './KycVerification';
import UserPointsPage from './UserPointsPage';
import PromotionContent from './PromotionContent';
import AccountSettings from './AccountSettings';

const WalletContent = ({ activeTab, onTabChange, onProfileUpdate }) => {
  const BankAccountPlaceholder = () => (
    <div className="p-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-gray-600">Quản lý tài khoản ngân hàng của bạn</p>
      </div>
    </div>
  );

  switch (activeTab) {
    case 'balance':
      return <WalletBalance onTabChange={onTabChange} />;
    case 'deposit-withdraw':
      return <DepositWithdraw />;
    case 'withdraw':
      return <WithdrawForm />;
    case 'points':
      return <UserPointsPage />;
    case 'transaction-history':
      return <TransactionHistory />;
    case 'kyc-verification':
    case 'account':
      return <KycVerification />;
    case 'promotions':
      return <PromotionContent />;
    case 'bank-account':
      return <BankAccountPlaceholder />;
    case 'settings':
      return <AccountSettings onProfileUpdate={onProfileUpdate} />;
    default:
      return <WalletBalance onTabChange={onTabChange} />;
  }
};

export default WalletContent;

