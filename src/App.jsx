import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { App as AntApp } from 'antd';

// Pages
import HomePage from './features/home/pages/HomePage';
import UserWalletPage from './features/wallet/pages/UserWalletPage';
import PointsPage from './features/points/pages/PointsPage';
import LotteryPage from './features/lottery/pages/LotteryPage';
import MienBacGamePage from './features/lottery/pages/MienBacGamePage';
import MienTrungNamGamePage from './features/lottery/pages/MienTrungNamGamePage';

// Admin Pages
import AdminLoginPage from './features/admin/pages/AdminLoginPage';
import AdminDashboardPage from './features/admin/pages/AdminDashboardPage';
import AdminPointManagementPage from './features/admin/pages/AdminPointManagementPage';
import AdminBettingOddsPage from './features/admin/pages/AdminBettingOddsPage';
import AdminLotteryResultManagement from './features/admin/components/AdminLotteryResultManagement';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import ProtectedRoute from './components/common/ProtectedRoute';

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
                    <UserWalletPage />
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
                    <LotteryPage />
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
              </Routes>
        </div>
      </Router>
    </AntApp>
  );
}

export default App;


