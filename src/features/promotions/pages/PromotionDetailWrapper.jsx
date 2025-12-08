import React from 'react';
import PromotionDetailPage from './PromotionDetailPage';
import PromotionDetailMobilePage from './PromotionDetailMobilePage';

const PromotionDetailWrapper = () => {
  return (
    <>
      {/* Mobile Layout */}
      <div className="md:hidden">
        <PromotionDetailMobilePage />
      </div>
      
      {/* Desktop Layout */}
      <div className="hidden md:block">
        <PromotionDetailPage />
      </div>
    </>
  );
};

export default PromotionDetailWrapper;

