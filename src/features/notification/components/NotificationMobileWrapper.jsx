import React, { useMemo, Suspense } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Spin } from 'antd';

// Lazy load mobile components for better performance
const NotificationDetailMobilePage = React.lazy(() => import('../pages/NotificationDetailMobilePage'));

const NotificationMobileWrapper = () => {
  const location = useLocation();
  const { id } = useParams();

  // Memoize the route checks to avoid unnecessary re-renders
  const routeInfo = useMemo(() => {
    const isNotificationDetailPage = location.pathname.startsWith('/notifications/') && id;
    
    return { isNotificationDetailPage };
  }, [location.pathname, id]);

  // For mobile, show slide-in page with Suspense for lazy loading
  if (routeInfo.isNotificationDetailPage) {
    return (
      <Suspense fallback={<div className="flex justify-center items-center h-64"><Spin size="large" /></div>}>
        <NotificationDetailMobilePage isOpen={true} onClose={() => window.history.back()} />
      </Suspense>
    );
  }

  return null;
};

export default NotificationMobileWrapper;

