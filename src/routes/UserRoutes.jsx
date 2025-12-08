import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../features/home/pages/HomePage';
import ResponsiveWalletWrapper from '../features/wallet/components/ResponsiveWalletWrapper';
import MobileKycPage from '../features/wallet/pages/MobileKycPage';
import PointsPage from '../features/points/pages/PointsPage';
import ResponsiveLotteryWrapper from '../features/lottery/components/ResponsiveLotteryWrapper';
import MienBacGamePage from '../features/lottery/pages/MienBacGamePage';
import MienTrungNamGamePage from '../features/lottery/pages/MienTrungNamGamePage';
import BettingHistoryPage from '../features/lottery/pages/BettingHistoryPage';
import ContactPage from '../features/contact/pages/ContactPage';
import NotificationDetailPage from '../features/notification/pages/NotificationDetailPage';
import MobileNotificationPage from '../features/notification/pages/MobileNotificationPage';
import MobileLoginPage from '../features/auth/pages/MobileLoginPage';
import MobileRegisterPage from '../features/auth/pages/MobileRegisterPage';
import ResponsiveAccountWrapper from '../features/wallet/components/ResponsiveAccountWrapper';
import ProtectedRoute from '../components/common/ProtectedRoute';
import NotFoundPage from '../components/common/NotFoundPage';
import LiveCasinoPage from '../features/casino/pages/LiveCasinoPage';
import LiveCasinoGamePage from '../features/casino/pages/LiveCasinoGamePage';
import PromotionDetailWrapper from '../features/promotions/pages/PromotionDetailWrapper';

/**
 * User Routes - Used when accessing tathiet168.com
 * Admin routes are blocked/redirected
 */
const UserRoutes = () => {
  return (
    <Routes>
      {/* Home Page */}
      <Route path="/" element={<HomePage />} />
      
      {/* Wallet */}
      <Route 
        path="/wallet" 
        element={
          <ProtectedRoute>
            <ResponsiveWalletWrapper />
          </ProtectedRoute>
        } 
      />
      
      {/* KYC */}
      <Route 
        path="/kyc" 
        element={
          <ProtectedRoute>
            <MobileKycPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Points */}
      <Route 
        path="/points" 
        element={
          <ProtectedRoute>
            <PointsPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Lottery */}
      <Route 
        path="/lottery" 
        element={<ResponsiveLotteryWrapper />} 
      />
      <Route 
        path="/lottery/mien-bac" 
        element={
          <ProtectedRoute>
            <MienBacGamePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/lottery/mien-trung-nam" 
        element={
          <ProtectedRoute>
            <MienTrungNamGamePage />
          </ProtectedRoute>
        } 
      />

      {/* Live Casino */}
      <Route path="/casino/live" element={<LiveCasinoPage />} />
      <Route
        path="/casino/live/:gameId"
        element={
          <ProtectedRoute>
            <LiveCasinoGamePage />
          </ProtectedRoute>
        }
      />
      
      {/* Betting History */}
      <Route 
        path="/betting-history" 
        element={
          <ProtectedRoute>
            <BettingHistoryPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Contact */}
      <Route path="/contact" element={<ContactPage />} />
      
      {/* Auth */}
      <Route path="/login" element={<MobileLoginPage />} />
      <Route path="/register" element={<MobileRegisterPage />} />
      
      {/* Promotions */}
      <Route 
        path="/promotions" 
        element={
          <ProtectedRoute>
            <ResponsiveWalletWrapper initialTab="promotions" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/promotions/:id" 
        element={<PromotionDetailWrapper />} 
      />
      
      {/* Notifications */}
      <Route path="/notifications" element={<MobileNotificationPage />} />
      <Route path="/notifications/:id" element={<NotificationDetailPage />} />
      
      {/* Account */}
      <Route 
        path="/account" 
        element={
          <ProtectedRoute>
            <ResponsiveAccountWrapper />
          </ProtectedRoute>
        } 
      />
      
      {/* Block admin routes - redirect to home */}
      <Route path="/admin/*" element={<Navigate to="/" replace />} />
      
      {/* 404 Route - Must be last */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default UserRoutes;

