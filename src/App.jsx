import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import viVN from 'antd/locale/vi_VN';

// Pages
import HomePage from './features/home/pages/HomePage';
import UserWalletPage from './features/wallet/pages/UserWalletPage';
import PointsPage from './features/points/pages/PointsPage';

// Admin Pages
import AdminLoginPage from './features/admin/pages/AdminLoginPage';
import AdminDashboardPage from './features/admin/pages/AdminDashboardPage';
import AdminPointManagementPage from './features/admin/pages/AdminPointManagementPage';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';

// Global styles
import 'antd/dist/reset.css';

function App() {
  return (
    <ConfigProvider 
      locale={viVN}
      theme={{
        token: {
          motion: false, // Tắt tất cả animation
        },
      }}
    >
      <AntApp>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/wallet" element={<UserWalletPage />} />
              <Route path="/points" element={<PointsPage />} />
              
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
              
              {/* Login và Register giờ là modal, không cần routes */}
            </Routes>
          </div>
        </Router>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;


