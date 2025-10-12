import LotteryPage from '../pages/LotteryPage';
import MobileLotteryPage from '../pages/MobileLotteryPage';

const ResponsiveLotteryWrapper = () => {
  return (
    <>
      {/* Desktop Version */}
      <div className="hidden md:block">
        <LotteryPage />
      </div>
      
      {/* Mobile Version */}
      <div className="md:hidden">
        <MobileLotteryPage />
      </div>
    </>
  );
};

export default ResponsiveLotteryWrapper;
