import { BrowserRouter as Router } from 'react-router-dom';
import { App as AntApp } from 'antd';
import { useEffect } from 'react';
import { getPortalType, isLocalhost } from './utils/subdomain';
import AdminRoutes from './routes/AdminRoutes';
import UserRoutes from './routes/UserRoutes';

const redirectToSubdomain = (portal, hostname, protocol, port, pathname) => {
  const subdomain = `${portal}.${hostname}`;
  const cleanedPath = pathname.replace(`/${portal}`, '') || '/login';
  window.location.href = `${protocol}//${subdomain}${port}${cleanedPath}`;
};

function App() {
  const portalType = getPortalType();

  useEffect(() => {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    const protocol = window.location.protocol;
    const port = window.location.port ? `:${window.location.port}` : '';
    const isLocal = isLocalhost();

    if (isLocal) {
      return;
    }

    if (portalType === 'user') {
      if (pathname.startsWith('/admin')) {
        redirectToSubdomain('admin', hostname, protocol, port, pathname);
      } else if (pathname.startsWith('/agent')) {
        redirectToSubdomain('agent', hostname, protocol, port, pathname);
      } else if (pathname.startsWith('/staff')) {
        redirectToSubdomain('staff', hostname, protocol, port, pathname);
      }
    }
  }, [portalType]);

  const renderRoutes = () => {
    if (portalType === 'admin' || portalType === 'agent' || portalType === 'staff') {
      return <AdminRoutes />;
    }
    return <UserRoutes />;
  };

  return (
    <AntApp>
      <Router>
        <div className="App">
          {renderRoutes()}
        </div>
      </Router>
    </AntApp>
  );
}

export default App;


