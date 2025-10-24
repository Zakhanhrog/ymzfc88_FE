import { useNavigate } from 'react-router-dom';

const QuickActionsSection = () => {
  const navigate = useNavigate();

  const handleDeposit = () => {
    navigate('/wallet?tab=deposit-withdraw');
  };

  const handleWithdraw = () => {
    navigate('/wallet?tab=withdraw');
  };

  const handlePromotions = () => {
    navigate('/promotions');
  };

  const handleLoto79 = () => {
    navigate('/lottery');
  };

  const handleHistory = () => {
    navigate('/betting-history');
  };

  const handleNotifications = () => {
    // Trigger notification modal like in header
    const event = new CustomEvent('showNotificationModal');
    window.dispatchEvent(event);
  };

  return (
    <div className="px-0 pb-2 pt-4 md:hidden">
      <div className="flex justify-between gap-1">
        {/* Nạp Tiền */}
        <button
          onClick={handleDeposit}
          className="hover:scale-105 transition-all duration-300"
        >
          <img 
            src="/headmb/imgi_13_func-deposit.png" 
            alt="Nạp Tiền" 
            className="w-16 h-auto rounded-2xl"
          />
        </button>

        {/* Rút Tiền */}
        <button
          onClick={handleWithdraw}
          className="hover:scale-105 transition-all duration-300"
        >
          <img 
            src="/headmb/imgi_14_func-withdraw.png" 
            alt="Rút Tiền" 
            className="w-16 h-auto rounded-2xl"
          />
        </button>

        {/* Thông báo */}
        <button
          onClick={handleNotifications}
          className="flex flex-col items-center hover:scale-105 transition-all duration-300"
        >
          <img 
            src="/headmb/sm-check.png" 
            alt="Notifications" 
            className="w-8 h-8 mb-1"
          />
          <span className="text-gray-800 font-medium text-xs">Thông báo</span>
        </button>

        {/* Khuyến mãi */}
        <button
          onClick={handlePromotions}
          className="flex flex-col items-center hover:scale-105 transition-all duration-300"
        >
          <img 
            src="/headmb/sm-wheel.png" 
            alt="Promotions"
            className="w-8 h-8 mb-1"
          />
          <span className="text-gray-800 font-medium text-xs">Khuyến mãi</span>
        </button>

        {/* Loto79 */}
        <button
          onClick={handleLoto79}
          className="flex flex-col items-center hover:scale-105 transition-all duration-300"
        >
          <img 
            src="/headmb/sm-vip.png" 
            alt="Loto79" 
            className="w-8 h-8 mb-1"
          />
          <span className="text-gray-800 font-medium text-xs">Loto79</span>
        </button>

        {/* Lịch sử */}
        <button
          onClick={handleHistory}
          className="flex flex-col items-center hover:scale-105 transition-all duration-300"
        >
          <img 
            src="/headmb/sm-red.png" 
            alt="History" 
            className="w-8 h-8 mb-1"
          />
          <span className="text-gray-800 font-medium text-xs">Lịch sử</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActionsSection;
