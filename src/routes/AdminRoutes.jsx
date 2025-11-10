import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLoginPage from '../features/admin/pages/AdminLoginPage';
import AdminDashboardPage from '../features/admin/pages/AdminDashboardPage';
import AdminPointManagementPage from '../features/admin/pages/AdminPointManagementPage';
import AdminBettingOddsPage from '../features/admin/pages/AdminBettingOddsPage';
import AdminXocDiaQuickBetPage from '../features/admin/pages/AdminXocDiaQuickBetPage';
import AdminSicboQuickBetPage from '../features/admin/pages/AdminSicboQuickBetPage';
import AdminLotteryResultManagement from '../features/admin/components/AdminLotteryResultManagement';
import AdminProtectedRoute from '../components/admin/AdminProtectedRoute';
import NotFoundPage from '../components/common/NotFoundPage';
import { isLocalhost } from '../utils/subdomain';

/**
 * Admin Routes - Used when accessing admin.tathiet168.com or /admin/* on localhost
 * On production (subdomain): Routes don't have /admin prefix
 * On localhost (path-based): Routes have /admin prefix
 */
const AdminRoutes = () => {
  const isLocal = isLocalhost();
  
  // On localhost: use /admin/* paths
  // On production: use /* paths (no /admin prefix)
  if (isLocal) {
    return (
      <Routes>
        {/* Redirect root to login */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        
        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        
        {/* Admin Dashboard */}
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminProtectedRoute>
              <AdminDashboardPage />
            </AdminProtectedRoute>
          } 
        />
        
        {/* Admin Points Management */}
        <Route 
          path="/admin/points" 
          element={
            <AdminProtectedRoute>
              <AdminPointManagementPage />
            </AdminProtectedRoute>
          } 
        />
        
        {/* Admin Betting Odds */}
        <Route 
          path="/admin/betting-odds" 
          element={
            <AdminProtectedRoute>
              <AdminBettingOddsPage />
            </AdminProtectedRoute>
          } 
        />
        
        {/* Admin Xoc Dia Quick Bets */}
        <Route
          path="/admin/xoc-dia/quick-bets"
          element={
            <AdminProtectedRoute>
              <AdminXocDiaQuickBetPage />
            </AdminProtectedRoute>
          }
        />

        {/* Admin Sicbo Quick Bets */}
        <Route
          path="/admin/sicbo/quick-bets"
          element={
            <AdminProtectedRoute>
              <AdminSicboQuickBetPage />
            </AdminProtectedRoute>
          }
        />
        
        {/* Admin Lottery Results */}
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
    );
  }
  
  // On production: use paths without /admin prefix
  return (
    <Routes>
      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Admin Login */}
      <Route path="/login" element={<AdminLoginPage />} />
      
      {/* Admin Dashboard */}
      <Route 
        path="/dashboard" 
        element={
          <AdminProtectedRoute>
            <AdminDashboardPage />
          </AdminProtectedRoute>
        } 
      />
      
      {/* Admin Points Management */}
      <Route 
        path="/points" 
        element={
          <AdminProtectedRoute>
            <AdminPointManagementPage />
          </AdminProtectedRoute>
        } 
      />
      
      {/* Admin Betting Odds */}
      <Route 
        path="/betting-odds" 
        element={
          <AdminProtectedRoute>
            <AdminBettingOddsPage />
          </AdminProtectedRoute>
        } 
      />
      
      {/* Admin Xoc Dia Quick Bets */}
      <Route
        path="/xoc-dia/quick-bets"
        element={
          <AdminProtectedRoute>
            <AdminXocDiaQuickBetPage />
          </AdminProtectedRoute>
        }
      />

      {/* Admin Sicbo Quick Bets */}
      <Route
        path="/sicbo/quick-bets"
        element={
          <AdminProtectedRoute>
            <AdminSicboQuickBetPage />
          </AdminProtectedRoute>
        }
      />
      
      {/* Admin Lottery Results */}
      <Route 
        path="/lottery-results" 
        element={
          <AdminProtectedRoute>
            <AdminLotteryResultManagement />
          </AdminProtectedRoute>
        } 
      />
      
      {/* Redirect old /admin/* routes to new routes (for backward compatibility) */}
      <Route path="/admin" element={<Navigate to="/login" replace />} />
      <Route path="/admin/login" element={<Navigate to="/login" replace />} />
      <Route path="/admin/dashboard" element={<Navigate to="/dashboard" replace />} />
      <Route path="/admin/points" element={<Navigate to="/points" replace />} />
      <Route path="/admin/betting-odds" element={<Navigate to="/betting-odds" replace />} />
      <Route path="/admin/xoc-dia/quick-bets" element={<Navigate to="/xoc-dia/quick-bets" replace />} />
      <Route path="/admin/sicbo/quick-bets" element={<Navigate to="/sicbo/quick-bets" replace />} />
      <Route path="/admin/lottery-results" element={<Navigate to="/lottery-results" replace />} />
      
      {/* 404 Route - Must be last */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AdminRoutes;

