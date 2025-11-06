import WalletBalance from './WalletBalance';
import TransactionHistory from './TransactionHistory';
import DepositWithdraw from './DepositWithdraw';
import WithdrawForm from './WithdrawForm';
import KycVerification from './KycVerification';
import UserPointsPage from './UserPointsPage';
import PromotionContent from './PromotionContent';

const WalletContent = ({ activeTab, onTabChange }) => {
  // Bank Account component - placeholder
  const BankAccount = () => (
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
      return <BankAccount />;
    case 'settings':
      return (
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Cài đặt tài khoản</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-600">Trang cài đặt tài khoản đang được phát triển...</p>
          </div>
        </div>
      );
    default:
      return <WalletBalance onTabChange={onTabChange} />;
  }
};

export default WalletContent;

