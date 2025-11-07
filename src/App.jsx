import { BrowserRouter as Router } from 'react-router-dom';
import { App as AntApp } from 'antd';
import { useEffect } from 'react';
import { isAdminSubdomain } from './utils/subdomain';
import AdminRoutes from './routes/AdminRoutes';
import UserRoutes from './routes/UserRoutes';

function App() {
  // Redirect if accessing wrong domain
  useEffect(() => {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    const protocol = window.location.protocol;
    const port = window.location.port ? `:${window.location.port}` : '';
    
    const isAdmin = isAdminSubdomain();
    
    // If on user domain but accessing admin routes - redirect to admin subdomain
    if (!isAdmin && pathname.startsWith('/admin')) {
      // On production: redirect to admin subdomain
      if (!hostname.includes('localhost') && !hostname.includes('127.0.0.1')) {
        const adminDomain = `admin.${hostname}`;
        // Remove /admin prefix for admin subdomain
        const adminPath = pathname.replace('/admin', '') || '/login';
        window.location.href = `${protocol}//${adminDomain}${port}${adminPath}`;
        return;
      }
    }
  }, []);

  return (
    <AntApp>
      <Router>
        <div className="App">
          {isAdminSubdomain() ? <AdminRoutes /> : <UserRoutes />}
        </div>
      </Router>
    </AntApp>
  );
}

export default App;


