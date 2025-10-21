import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import PromotionMobilePage from '../pages/PromotionMobilePage';

const PromotionMobileWrapper = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Check if we're on promotions page
  const isPromotionsPage = location.pathname === '/promotions';

  // For mobile, show slide-in page
  if (isPromotionsPage) {
    return <PromotionMobilePage isOpen={true} onClose={() => window.history.back()} />;
  }

  return null;
};

export default PromotionMobileWrapper;
