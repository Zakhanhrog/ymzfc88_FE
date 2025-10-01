import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import viVN from 'antd/locale/vi_VN';

// Pages
import HomePage from './features/home/pages/HomePage';

// Admin Pages
import AdminLoginPage from './features/admin/pages/AdminLoginPage';
import AdminDashboardPage from './features/admin/pages/AdminDashboardPage';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';

// Global styles
import 'antd/dist/reset.css';

function App() {
  return (
    <ConfigProvider locale={viVN}>
      <AntApp>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<HomePage />} />
              
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
              
              {/* Login và Register giờ là modal, không cần routes */}
            </Routes>
          </div>
        </Router>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;


