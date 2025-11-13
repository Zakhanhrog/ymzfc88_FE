import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DashboardOutlined, LogoutOutlined, DownOutlined } from '@ant-design/icons';
import { adminAuthService } from '../../features/admin/services/adminAuthService';
import { adminMenuItems } from './sidebar/adminMenuData';
import { LAYOUT } from '../../utils/theme';
import LogoutConfirmModal from '../common/LogoutConfirmModal';
import { getPortalLoginPath, getPortalPath } from '../../utils/navigation';
import { getPortalType } from '../../utils/subdomain';

const convertMenuItems = (items) => {
  return items.map(item => ({
    ...item,
    icon: undefined,
    children: item.children ? convertMenuItems(item.children) : undefined
  }));
};

const arraysEqual = (a = [], b = []) => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

const PORTAL_TITLES = {
  admin: 'ADMIN PANEL',
  agent: 'AGENT PORTAL',
  staff: 'STAFF PORTAL'
};

const AGENT_ALLOWED_KEYS = new Set([
  'agent-portal',
  'agent-dashboard',
  'agent-customer-list',
  'agent-invite-codes',
  'agent-commission'
]);

const STAFF_ROLE_ALLOWED_KEYS = {
  STAFF_MKT: new Set([
    'staff-portal',
    'staff-mkt',
    'staff-mkt-users',
    'staff-mkt-finance',
    'staff-mkt-games'
  ]),
  STAFF_XNK: new Set([
    'staff-portal',
    'staff-xnk',
    'staff-xnk-users',
    'staff-xnk-finance',
    'staff-xnk-games'
  ]),
  STAFF_TX1: new Set([
    'staff-portal',
    'staff-tx1',
    'staff-tx1-overview'
  ]),
  STAFF_TX2: new Set([
    'staff-portal',
    'staff-tx2',
    'staff-tx2-overview'
  ]),
  STAFF_XD: new Set([
    'staff-portal',
    'staff-xd',
    'staff-xd-overview'
  ])
};

const filterMenuByKeys = (items, allowedKeys) => {
  return items
    .map(item => {
      const shouldInclude = allowedKeys.has(item.key);
      const children = item.children
        ? filterMenuByKeys(item.children, allowedKeys)
        : undefined;

      if (!shouldInclude && (!children || children.length === 0)) {
        return null;
      }

      return {
        ...item,
        children
      };
    })
    .filter(Boolean);
};

const getMenuForPortal = (portalType, session) => {
  if (portalType === 'agent') {
    const filtered = filterMenuByKeys(adminMenuItems, AGENT_ALLOWED_KEYS);
    const agentSection = filtered.find((item) => item.key === 'agent-portal');
    const flattened = agentSection?.children
      ? agentSection.children.map((child) => ({ ...child, children: undefined }))
      : [];
    return flattened;
  }

  if (portalType === 'staff') {
    const staffRole = session?.staffRole;

    if (staffRole === 'STAFF_XNK') {
      const allowedTopKeys = new Set([
        'user-management',
        'financial-management',
        'game-management'
      ]);
      const excludedGameKeys = new Set([
        'game-results',
        'xoc-dia-results',
        'sicbo-results'
      ]);
      const excludedChildKeys = new Set([
        'user-roles',
        'staff-management',
        'agent-management',
        'agent-report',
        'payment-methods'
      ]);

      return adminMenuItems
        .filter((item) => allowedTopKeys.has(item.key))
        .map((item) => {
          const clonedChildren = item.children
            ? item.children
                .filter((child) =>
                  !excludedChildKeys.has(child.key) &&
                  (item.key === 'game-management'
                    ? !excludedGameKeys.has(child.key)
                    : true)
                )
                .map((child) => ({ ...child }))
            : undefined;

          return {
            ...item,
            children: clonedChildren
          };
        })
        .filter((item) => !item.children || item.children.length > 0);
    }

    const allowedKeys = staffRole ? STAFF_ROLE_ALLOWED_KEYS[staffRole] : null;
    if (allowedKeys) {
      const filtered = filterMenuByKeys(adminMenuItems, allowedKeys);
      const staffSection = filtered.find((item) => item.key === 'staff-portal');
      return staffSection?.children ?? [];
    }
    // No allowed menu -> return empty array
    return [];
  }

  if (portalType === 'admin') {
    return adminMenuItems.filter(
      (item) => item.key !== 'agent-portal' && item.key !== 'staff-portal'
    );
  }

  return adminMenuItems;
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

const isKeyInTree = (item, targetKey) => {
  if (item.key === targetKey) {
    return true;
  }
  if (!item.children) {
    return false;
  }
  return item.children.some((child) => isKeyInTree(child, targetKey));
};

const collectParentKeys = (items, targetKey, trail = []) => {
  for (const item of items) {
    if (item.key === targetKey) {
      return trail;
    }
    if (item.children && item.children.length > 0) {
      const nextTrail = [...trail, item.key];
      const result = collectParentKeys(item.children, targetKey, nextTrail);
      if (result) {
        return result;
      }
    }
  }
  return [];
};

const AdminSidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const portalType = getPortalType();
  const session = adminAuthService.getCurrentAdmin();
  const menuData = useMemo(
    () => getMenuForPortal(portalType, session),
    [portalType, session]
  );
  const menuItems = useMemo(() => convertMenuItems(menuData), [menuData]);
  const portalLoginPath = useMemo(() => getPortalLoginPath(portalType), [portalType]);
  const buildPath = useCallback((path) => getPortalPath(portalType, path), [portalType]);
  const goTo = useCallback((path) => navigate(buildPath(path)), [navigate, buildPath]);
  const portalTitle = PORTAL_TITLES[portalType] || PORTAL_TITLES.admin;

  const activeKey = useMemo(
    () => getActiveKey(portalType, location),
    [portalType, location]
  );
  const initialParents = useMemo(
    () => collectParentKeys(menuData, activeKey),
    [menuData, activeKey]
  );
  const [openGroups, setOpenGroups] = useState(initialParents);
  const [closedGroups, setClosedGroups] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const prevActiveKeyRef = useRef(activeKey);
  const prevInitialParentsRef = useRef(initialParents);

  useEffect(() => {
    const hasActiveChanged = prevActiveKeyRef.current !== activeKey;
    const hasParentsChanged = !arraysEqual(prevInitialParentsRef.current, initialParents);

    if (hasActiveChanged || hasParentsChanged) {
      setOpenGroups(initialParents);
      setClosedGroups([]);
    }

    if (hasActiveChanged) {
      prevActiveKeyRef.current = activeKey;
    }

    if (hasParentsChanged) {
      prevInitialParentsRef.current = initialParents;
    }
  }, [activeKey, initialParents]);

  useEffect(() => {
    if (collapsed) {
      setOpenGroups([]);
      setClosedGroups([]);
    }
  }, [collapsed]);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      adminAuthService.logout();
      setShowLogoutModal(false);
      navigate(portalLoginPath);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const menuActions = useMemo(
    () => ({
      overview: () => goTo('/dashboard'),
      'agent-dashboard': () => goTo('/dashboard?tab=agent-dashboard'),
      analytics: () => goTo('/dashboard?tab=analytics'),
      users: () => goTo('/dashboard?tab=users'),
      'kyc-verification': () => goTo('/dashboard?tab=kyc-verification'),
      'user-roles': () => goTo('/dashboard?tab=user-roles'),
      'staff-management': () => goTo('/dashboard?tab=staff-management'),
      'agent-management': () => goTo('/dashboard?tab=agent-management'),
      deposits: () => goTo('/dashboard?tab=deposits'),
      withdraws: () => goTo('/dashboard?tab=withdraws'),
      'payment-methods': () => goTo('/dashboard?tab=payment-methods'),
      'points-management': () => goTo('/points'),
      'agent-customer-list': () => goTo('/dashboard?tab=agent-customer-list'),
      'agent-dashboard': () => goTo('/dashboard?tab=agent-dashboard'),
      'agent-invite-codes': () => goTo('/dashboard?tab=agent-invite-codes'),
      'agent-commission': () => goTo('/dashboard?tab=agent-commission'),
      'agent-report': () => goTo('/dashboard?tab=agent-report'),
      'staff-mkt-users': () => goTo('/dashboard?tab=staff-mkt-users'),
      'staff-mkt-finance': () => goTo('/dashboard?tab=staff-mkt-finance'),
      'staff-mkt-games': () => goTo('/dashboard?tab=staff-mkt-games'),
      'staff-xnk-users': () => goTo('/dashboard?tab=staff-xnk-users'),
      'staff-xnk-finance': () => goTo('/dashboard?tab=staff-xnk-finance'),
      'staff-xnk-games': () => goTo('/dashboard?tab=staff-xnk-games'),
      'staff-tx1-overview': () => goTo('/dashboard?tab=staff-tx1-overview'),
      'staff-tx2-overview': () => goTo('/dashboard?tab=staff-tx2-overview'),
      'staff-xd-overview': () => goTo('/dashboard?tab=staff-xd-overview'),
      games: () => goTo('/dashboard?tab=games'),
      'bet-management': () => goTo('/dashboard?tab=bet-management'),
      'game-history': () => goTo('/dashboard?tab=game-history'),
      'game-results': () => goTo('/dashboard?tab=game-results'),
      'xoc-dia-results': () => goTo('/dashboard?tab=xoc-dia-results'),
      'sicbo-results': () => goTo('/dashboard?tab=sicbo-results'),
      'game-settings': () => goTo('/dashboard?tab=game-settings'),
      'betting-odds': () => goTo('/betting-odds'),
      'xoc-dia-quick-bets': () => goTo('/xoc-dia/quick-bets'),
      'sicbo-quick-bets': () => goTo('/sicbo/quick-bets'),
      banners: () => goTo('/dashboard?tab=banners'),
      news: () => goTo('/dashboard?tab=news'),
      notifications: () => goTo('/dashboard?tab=notifications'),
      'marquee-notifications': () => goTo('/dashboard?tab=marquee-notifications'),
      settings: () => goTo('/dashboard?tab=settings'),
      'contact-links': () => goTo('/dashboard?tab=contact-links'),
      promotions: () => goTo('/dashboard?tab=promotions'),
      'telegram-settings': () => goTo('/dashboard?tab=telegram-settings')
    }),
    [goTo]
  );

  const handleNavigate = useCallback(
    (key) => {
      const action = menuActions[key];
      if (action) {
        action();
      }
    },
    [menuActions]
  );

  const renderMenuNode = useCallback(
    (item, depth = 0) => {
      const hasChildren = Array.isArray(item.children) && item.children.length > 0;
      const isTopLevel = depth === 0;
      const isDescendantActive =
        hasChildren && item.children.some((child) => isKeyInTree(child, activeKey));
      const isForcedClosed = closedGroups.includes(item.key);
      const isOpen = !isForcedClosed && (openGroups.includes(item.key) || isDescendantActive);
      const isSelfActive = activeKey === item.key;
      const isActive = isSelfActive || isDescendantActive;

      const baseClasses = collapsed
        ? 'w-full flex items-center justify-center py-3 rounded-lg transition-colors'
        : 'w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors';
      const stateClasses = isActive
        ? 'bg-emerald-500/10 text-emerald-200'
        : 'text-slate-300 hover:text-white hover:bg-white/5';

      const paddingStyle = collapsed
        ? undefined
        : { paddingLeft: 12 + depth * 12 };

      const content = (
        <>
          {collapsed ? (
            <span className="text-xs font-semibold uppercase">
              {item.label ? item.label.charAt(0) : ''}
            </span>
          ) : (
            <span
              className={`flex-1 text-left text-sm ${isTopLevel ? 'font-semibold uppercase tracking-wide' : 'font-medium'}`}
            >
              {item.label}
            </span>
          )}
          {!collapsed && hasChildren && (
            <DownOutlined
              className={`ml-auto text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          )}
        </>
      );

      const handleClick = () => {
        if (hasChildren) {
          const currentlyOpen = !isForcedClosed && (openGroups.includes(item.key) || isDescendantActive);
          if (currentlyOpen) {
            setClosedGroups((prev) =>
              prev.includes(item.key) ? prev : [...prev, item.key]
            );
            setOpenGroups((prev) => prev.filter((groupKey) => groupKey !== item.key));
          } else {
            setClosedGroups((prev) => prev.filter((groupKey) => groupKey !== item.key));
            setOpenGroups((prev) =>
              prev.includes(item.key) ? prev : [...prev, item.key]
            );
          }
        } else {
          handleNavigate(item.key);
        }
      };

      return (
        <div key={item.key} className="space-y-1">
          <button
            type="button"
            onClick={handleClick}
            className={`${baseClasses} ${stateClasses}`}
            style={paddingStyle}
          >
            {content}
          </button>
          {hasChildren && isOpen && (
            <div className="space-y-1">
              {item.children.map((child) => renderMenuNode(child, depth + 1))}
            </div>
          )}
        </div>
      );
    },
    [collapsed, openGroups, activeKey, handleNavigate, closedGroups]
  );

  const sidebarWidth = useMemo(
    () =>
      parseInt(
        collapsed ? LAYOUT.adminSidebarCollapsedWidth : LAYOUT.adminSidebarWidth,
        10
      ),
    [collapsed]
  );

  return (
    <aside
      className="fixed left-0 top-0 z-[100] flex h-screen flex-col border-r border-white/10 bg-[#001529] shadow-lg transition-[width] duration-200"
      style={{ width: sidebarWidth }}
    >
      <div
        className="flex items-center border-b border-white/10 bg-[#002140]"
        style={{
          height: LAYOUT.headerHeight,
          padding: collapsed ? '0' : '0 24px',
          justifyContent: collapsed ? 'center' : 'flex-start'
        }}
      >
        {collapsed ? (
          <DashboardOutlined style={{ fontSize: '24px', color: '#fff' }} />
        ) : (
          <div className="text-lg font-semibold text-white">{portalTitle}</div>
        )}
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1 custom-scrollbar">
          {menuItems.length > 0 ? (
            menuItems.map((item) => renderMenuNode(item))
          ) : (
            <div className="flex h-full items-center justify-center px-3 text-center text-sm text-slate-400">
              Không có menu khả dụng cho tài khoản này.
            </div>
          )}
        </nav>

        <div className="border-t border-white/10 px-2 py-3">
          <button
            type="button"
            onClick={handleLogout}
            className={`w-full rounded-lg px-3 py-2 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/10 ${
              collapsed ? 'flex items-center justify-center' : 'flex items-center gap-3'
            }`}
          >
            <LogoutOutlined />
            {!collapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </div>

      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        loading={isLoggingOut}
      />
    </aside>
  );
};

export default AdminSidebar;
