import { useState, useEffect } from 'react';
import ResponsiveWalletWrapper from './ResponsiveWalletWrapper';
import MobileAccountPage from '../pages/MobileAccountPage';

const ResponsiveAccountWrapper = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // For mobile, show MobileAccountPage
  if (isMobile) {
    return <MobileAccountPage />;
  }

  // For desktop, show ResponsiveWalletWrapper with balance tab (Tổng Quan) as default
  return <ResponsiveWalletWrapper initialTab="balance" />;
};

export default ResponsiveAccountWrapper;

