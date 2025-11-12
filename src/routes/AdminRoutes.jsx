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
import { isLocalhost, getPortalType } from '../utils/subdomain';

const createPathHelpers = (portalType, isLocal) => {
  const base = isLocal ? `/${portalType}` : '';
  const withBase = (path = '') => `${base}${path}`;
  const loginPath = withBase('/login');
  const dashboardPath = withBase('/dashboard');
  const pointsPath = withBase('/points');
  const bettingOddsPath = withBase('/betting-odds');
  const xocDiaQuickBetPath = withBase('/xoc-dia/quick-bets');
  const sicboQuickBetPath = withBase('/sicbo/quick-bets');
  const lotteryResultsPath = withBase('/lottery-results');
  const rootPath = base || '/';

  return {
    base,
    rootPath,
    loginPath,
    dashboardPath,
    pointsPath,
    bettingOddsPath,
    xocDiaQuickBetPath,
    sicboQuickBetPath,
    lotteryResultsPath
  };
};

const AdminRoutes = () => {
  const portalType = getPortalType();
  const isLocal = isLocalhost();
  const paths = createPathHelpers(portalType, isLocal);

  return (
    <Routes>
      <Route path={paths.rootPath} element={<Navigate to={paths.loginPath} replace />} />
      <Route path={paths.loginPath} element={<AdminLoginPage />} />
      <Route
        path={paths.dashboardPath}
        element={
          <AdminProtectedRoute>
            <AdminDashboardPage />
          </AdminProtectedRoute>
        }
      />
      <Route
        path={paths.pointsPath}
        element={
          <AdminProtectedRoute>
            <AdminPointManagementPage />
          </AdminProtectedRoute>
        }
      />
      <Route
        path={paths.bettingOddsPath}
        element={
          <AdminProtectedRoute>
            <AdminBettingOddsPage />
          </AdminProtectedRoute>
        }
      />
      <Route
        path={paths.xocDiaQuickBetPath}
        element={
          <AdminProtectedRoute>
            <AdminXocDiaQuickBetPage />
          </AdminProtectedRoute>
        }
      />
      <Route
        path={paths.sicboQuickBetPath}
        element={
          <AdminProtectedRoute>
            <AdminSicboQuickBetPage />
          </AdminProtectedRoute>
        }
      />
      <Route
        path={paths.lotteryResultsPath}
        element={
          <AdminProtectedRoute>
            <AdminLotteryResultManagement />
          </AdminProtectedRoute>
        }
      />

      {/* Backward compatibility routes for admin portal */}
      {portalType === 'admin' && !isLocal && (
        <>
          <Route path="/admin" element={<Navigate to={paths.loginPath} replace />} />
          <Route path="/admin/login" element={<Navigate to={paths.loginPath} replace />} />
          <Route path="/admin/dashboard" element={<Navigate to={paths.dashboardPath} replace />} />
          <Route path="/admin/points" element={<Navigate to={paths.pointsPath} replace />} />
          <Route path="/admin/betting-odds" element={<Navigate to={paths.bettingOddsPath} replace />} />
          <Route path="/admin/xoc-dia/quick-bets" element={<Navigate to={paths.xocDiaQuickBetPath} replace />} />
          <Route path="/admin/sicbo/quick-bets" element={<Navigate to={paths.sicboQuickBetPath} replace />} />
          <Route path="/admin/lottery-results" element={<Navigate to={paths.lotteryResultsPath} replace />} />
        </>
      )}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AdminRoutes;

