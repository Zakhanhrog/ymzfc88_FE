import { useMemo, useEffect, useState } from 'react';
import { Layout, Avatar, Tooltip } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  UserOutlined,
} from '@ant-design/icons';
import { LAYOUT } from '../../../utils/theme';
import { getPortalPath } from '../../../utils/navigation';
import { getPortalType } from '../../../utils/subdomain';
import { adminAuthService } from '../../../features/admin/services/adminAuthService';
import { adminMenuItems } from '../sidebar/adminMenuData';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const { Header } = Layout;

// Helper function to find menu item by key
const findMenuItemByKey = (items, targetKey) => {
  for (const item of items) {
    if (item.key === targetKey) {
      return item;
    }
    if (item.children) {
      const found = findMenuItemByKey(item.children, targetKey);
      if (found) return found;
    }
  }
  return null;
};

// Helper function to build breadcrumb path
const buildBreadcrumb = (menuItems, activeKey, portalType) => {
  const breadcrumb = [];
  
  // Find the active item
  const activeItem = findMenuItemByKey(menuItems, activeKey);
  if (!activeItem) {
    return breadcrumb;
  }
  
  // Find parent items
  const findParent = (items, targetKey, path = []) => {
    for (const item of items) {
      if (item.key === targetKey) {
        return [...path, item];
      }
      if (item.children) {
        const result = findParent(item.children, targetKey, [...path, item]);
        if (result) return result;
      }
    }
    return null;
  };
  
  const fullPath = findParent(menuItems, activeKey);
  if (fullPath) {
    return fullPath.map(item => item.label);
  }
  
  return [activeItem.label];
};

const stripPortalPrefix = (portalType, pathname) => {
  if (!portalType || portalType === 'user') {
    return pathname;
  }
  const prefix = `/${portalType}`;
  if (pathname.startsWith(prefix)) {
    const stripped = pathname.slice(prefix.length);
    return stripped.startsWith('/') ? stripped : `/${stripped}`;
  }
  return pathname;
};

const getActiveKey = (portalType, location) => {
  const path = stripPortalPrefix(portalType, location.pathname);
  const searchParams = new URLSearchParams(location.search);
  const tab = searchParams.get('tab');

  if (path.includes('/points')) {
    return 'points-management';
  }
  if (path.includes('/betting-odds')) {
    return 'betting-odds';
  }
  if (path.includes('/xoc-dia/quick-bets')) {
    return 'xoc-dia-quick-bets';
  }
  if (path.includes('/sicbo/quick-bets')) {
    return 'sicbo-quick-bets';
  }
  if (path.includes('/dashboard')) {
    return tab || 'overview';
  }
  return 'overview';
};

const AdminHeader = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const portalType = getPortalType();

  const session = useMemo(() => adminAuthService.getCurrentAdmin(), []);
  const isAdmin = session?.role === 'ADMIN';
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleProfileClick = () => {
    if (!isAdmin) return;
    const profilePath = getPortalPath(portalType, '/dashboard?tab=admin-profile');
    navigate(profilePath);
  };

  // Get breadcrumb
  const activeKey = useMemo(() => getActiveKey(portalType, location), [portalType, location]);
  const breadcrumbItems = useMemo(() => {
    // Filter menu items based on portal type
    let filteredItems = adminMenuItems;
    if (portalType === 'agent') {
      filteredItems = adminMenuItems.filter(item => item.key === 'agent-portal');
    } else if (portalType === 'staff') {
      filteredItems = adminMenuItems.filter(item => item.key === 'staff-portal');
    } else {
      filteredItems = adminMenuItems.filter(
        item => item.key !== 'agent-portal' && item.key !== 'staff-portal'
      );
    }
    return buildBreadcrumb(filteredItems, activeKey, portalType);
  }, [activeKey, portalType]);

  return (
    <Header 
      className="bg-white shadow-sm border-b border-gray-200"
      style={{
        padding: '0 24px',
        height: LAYOUT.headerHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'fixed',
        width: `calc(100% - ${collapsed ? LAYOUT.adminSidebarCollapsedWidth : LAYOUT.adminSidebarWidth})`,
        top: 0,
        zIndex: 99,
        transition: 'width 0.2s'
      }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        {breadcrumbItems.length > 0 ? (
          breadcrumbItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-gray-400" />
              )}
              <span
                className={cn(
                  "text-sm",
                  index === breadcrumbItems.length - 1
                    ? "font-semibold text-gray-900"
                    : "text-gray-600"
                )}
              >
                {item}
              </span>
            </div>
          ))
        ) : (
          <span className="text-sm font-semibold text-gray-900">Dashboard</span>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-right leading-tight hidden md:block">
          <div className="text-sm font-semibold text-gray-700">
            {currentTime.toLocaleTimeString('vi-VN')}
          </div>
          <div className="text-xs text-gray-500">
            {currentTime.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })}
          </div>
        </div>
        <Tooltip title={isAdmin ? 'Xem thông tin tài khoản' : undefined}>
          <Avatar 
            icon={<UserOutlined />} 
            className="bg-emerald-500"
            size="large"
            onClick={handleProfileClick}
            style={{ cursor: isAdmin ? 'pointer' : 'default' }}
          />
        </Tooltip>
      </div>
    </Header>
  );
};

export default AdminHeader;
