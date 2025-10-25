import React, { useMemo, Suspense } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Spin } from 'antd';

// Lazy load mobile components for better performance
const PromotionMobilePage = React.lazy(() => import('../pages/PromotionMobilePage'));
const PromotionDetailMobilePage = React.lazy(() => import('../pages/PromotionDetailMobilePage'));

const PromotionMobileWrapper = () => {
  const location = useLocation();
  const { id } = useParams();

  // Memoize the route checks to avoid unnecessary re-renders
  const routeInfo = useMemo(() => {
    const isPromotionsPage = location.pathname === '/promotions';
    const isPromotionDetailPage = location.pathname.startsWith('/promotions/') && id;
    
    return { isPromotionsPage, isPromotionDetailPage };
  }, [location.pathname, id]);

  // For mobile, show slide-in page with Suspense for lazy loading
  if (routeInfo.isPromotionsPage) {
    return (
      <Suspense fallback={<div className="flex justify-center items-center h-64"><Spin size="large" /></div>}>
        <PromotionMobilePage isOpen={true} onClose={() => window.history.back()} />
      </Suspense>
    );
  }

  if (routeInfo.isPromotionDetailPage) {
    return (
      <Suspense fallback={<div className="flex justify-center items-center h-64"><Spin size="large" /></div>}>
        <PromotionDetailMobilePage isOpen={true} onClose={() => window.history.back()} />
      </Suspense>
    );
  }

  return null;
};

export default PromotionMobileWrapper;
