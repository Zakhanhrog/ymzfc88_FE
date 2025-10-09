import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import HomePage from './features/home/pages/HomePage';
import UserWalletPage from './features/wallet/pages/UserWalletPage';
import PointsPage from './features/points/pages/PointsPage';
import LotteryPage from './features/lottery/pages/LotteryPage';

// Admin Pages
import AdminLoginPage from './features/admin/pages/AdminLoginPage';
import AdminDashboardPage from './features/admin/pages/AdminDashboardPage';
import AdminPointManagementPage from './features/admin/pages/AdminPointManagementPage';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/wallet" element={<UserWalletPage />} />
              <Route path="/points" element={<PointsPage />} />
              <Route path="/lottery" element={<LotteryPage />} />
          
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;


