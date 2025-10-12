import { useNavigate } from 'react-router-dom';

const QuickActionsSection = () => {
  const navigate = useNavigate();

  const handleDeposit = () => {
    navigate('/wallet?tab=deposit-withdraw');
  };

  const handleWithdraw = () => {
    navigate('/wallet?tab=withdraw');
  };

  const handleCheckIn = () => {
    // Handle check-in functionality
    console.log('Check-in clicked');
  };

  const handleSpin = () => {
    // Handle spin wheel functionality
    console.log('Spin wheel clicked');
  };

  const handleVIP = () => {
    // Handle VIP functionality
    console.log('VIP clicked');
  };

  const handleDaily = () => {
    // Handle daily tasks functionality
    console.log('Daily tasks clicked');
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

        {/* Điểm danh */}
        <button
          onClick={handleCheckIn}
          className="flex flex-col items-center hover:scale-105 transition-all duration-300"
        >
          <img 
            src="/headmb/sm-check.png" 
            alt="Check-in" 
            className="w-8 h-8 mb-1"
          />
          <span className="text-gray-800 font-medium text-xs">Điểm danh</span>
        </button>

        {/* Vòng quay */}
        <button
          onClick={handleSpin}
          className="flex flex-col items-center hover:scale-105 transition-all duration-300"
        >
          <img 
            src="/headmb/sm-wheel.png" 
            alt="Spin" 
            className="w-8 h-8 mb-1"
          />
          <span className="text-gray-800 font-medium text-xs">Vòng quay</span>
        </button>

        {/* VIP */}
        <button
          onClick={handleVIP}
          className="flex flex-col items-center hover:scale-105 transition-all duration-300"
        >
          <img 
            src="/headmb/sm-vip.png" 
            alt="VIP" 
            className="w-8 h-8 mb-1"
          />
          <span className="text-gray-800 font-medium text-xs">VIP</span>
        </button>

        {/* Mỗi Ngày */}
        <button
          onClick={handleDaily}
          className="flex flex-col items-center hover:scale-105 transition-all duration-300"
        >
          <img 
            src="/headmb/sm-red.png" 
            alt="Daily" 
            className="w-8 h-8 mb-1"
          />
          <span className="text-gray-800 font-medium text-xs">Mỗi Ngày</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActionsSection;
