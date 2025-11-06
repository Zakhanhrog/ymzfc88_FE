import React, { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import PromotionMobilePage from '../pages/PromotionMobilePage';
import PromotionDetailMobilePage from '../pages/PromotionDetailMobilePage';

const PromotionMobileWrapper = () => {
  const location = useLocation();
  const { id } = useParams();

  // Memoize the route checks to avoid unnecessary re-renders
  const routeInfo = useMemo(() => {
    const isPromotionsPage = location.pathname === '/promotions';
    const isPromotionDetailPage = location.pathname.startsWith('/promotions/') && id;
    
    return { isPromotionsPage, isPromotionDetailPage };
  }, [location.pathname, id]);

  // For mobile, show slide-in page
  if (routeInfo.isPromotionsPage) {
    return <PromotionMobilePage isOpen={true} onClose={() => window.history.back()} />;
  }

  if (routeInfo.isPromotionDetailPage) {
    return <PromotionDetailMobilePage isOpen={true} onClose={() => window.history.back()} />;
  }

  return null;
};

export default PromotionMobileWrapper;
