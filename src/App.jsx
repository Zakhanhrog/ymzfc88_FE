import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { App as AntApp } from 'antd';

// Pages
import HomePage from './features/home/pages/HomePage';
import ResponsiveWalletWrapper from './features/wallet/components/ResponsiveWalletWrapper';
import MobileKycPage from './features/wallet/pages/MobileKycPage';
import PointsPage from './features/points/pages/PointsPage';
import ResponsiveLotteryWrapper from './features/lottery/components/ResponsiveLotteryWrapper';
import MienBacGamePage from './features/lottery/pages/MienBacGamePage';
import MienTrungNamGamePage from './features/lottery/pages/MienTrungNamGamePage';
import BettingHistoryPage from './features/lottery/pages/BettingHistoryPage';
import ContactPage from './features/contact/pages/ContactPage';
import PromotionPage from './features/promotions/pages/PromotionPage';

// Admin Pages
import AdminLoginPage from './features/admin/pages/AdminLoginPage';
import AdminDashboardPage from './features/admin/pages/AdminDashboardPage';
import AdminPointManagementPage from './features/admin/pages/AdminPointManagementPage';
import AdminBettingOddsPage from './features/admin/pages/AdminBettingOddsPage';
import AdminLotteryResultManagement from './features/admin/components/AdminLotteryResultManagement';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import ProtectedRoute from './components/common/ProtectedRoute';
import NotFoundPage from './components/common/NotFoundPage';

function App() {
  return (
    <AntApp>
      <Router>
        <div className="App">
              <Routes>
              <Route path="/" element={<HomePage />} />
              <Route 
                path="/wallet" 
                element={
                  <ProtectedRoute>
                    <ResponsiveWalletWrapper />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/kyc" 
                element={
                  <ProtectedRoute>
                    <MobileKycPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/points" 
                element={
                  <ProtectedRoute>
                    <PointsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/lottery" 
                element={
                  <ProtectedRoute>
                    <ResponsiveLotteryWrapper />
                  </ProtectedRoute>
                } 
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
              <Route 
                path="/betting-history" 
                element={
                  <ProtectedRoute>
                    <BettingHistoryPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/contact" 
                element={<ContactPage />} 
              />
              <Route 
                path="/promotions" 
                element={<PromotionPage />} 
              />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminProtectedRoute>
                <AdminDashboardPage />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/admin/points" 
            element={
              <AdminProtectedRoute>
                <AdminPointManagementPage />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/admin/betting-odds" 
            element={
              <AdminProtectedRoute>
                <AdminBettingOddsPage />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/admin/lottery-results" 
            element={
              <AdminProtectedRoute>
                <AdminLotteryResultManagement />
              </AdminProtectedRoute>
            } 
          />
          
          {/* 404 Route - Must be last */}
          <Route path="*" element={<NotFoundPage />} />
              </Routes>
        </div>
      </Router>
    </AntApp>
  );
}

export default App;


