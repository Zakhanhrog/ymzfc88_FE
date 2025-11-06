import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import PromotionMobilePage from '../pages/PromotionMobilePage';

const PromotionMobileWrapper = () => {
  const location = useLocation();

  // Memoize the route checks to avoid unnecessary re-renders
  const routeInfo = useMemo(() => {
    const isPromotionsPage = location.pathname === '/promotions';
    
    return { isPromotionsPage };
  }, [location.pathname]);

  // For mobile, show slide-in page
  if (routeInfo.isPromotionsPage) {
    return <PromotionMobilePage isOpen={true} onClose={() => window.history.back()} />;
  }

  return null;
};

export default PromotionMobileWrapper;
