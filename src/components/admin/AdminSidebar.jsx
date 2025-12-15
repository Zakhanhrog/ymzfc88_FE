import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { adminAuthService } from '../../features/admin/services/adminAuthService';
import { adminMenuItems } from './sidebar/adminMenuData';
import { LAYOUT } from '../../utils/theme';
import LogoutConfirmModal from '../common/LogoutConfirmModal';
import { getPortalLoginPath, getPortalPath } from '../../utils/navigation';
import { getPortalType } from '../../utils/subdomain';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Search, LogOut, Menu, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';

const convertMenuItems = (items) => {
  return items.map(item => ({
    ...item,
    children: item.children ? convertMenuItems(item.children) : undefined
  }));
};

const deepCloneMenuItems = (items) => {
  return items.map((item) => ({
    ...item,
    children: item.children ? deepCloneMenuItems(item.children) : undefined
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
    'staff-tx1-history',
    'staff-tx1-sicbo-results'
  ]),
  STAFF_TX2: new Set([
    'staff-portal',
    'staff-tx2',
    'staff-tx2-history',
    'staff-tx2-sicbo-results'
  ]),
  STAFF_XD: new Set([
    'staff-portal',
    'staff-xd',
    'staff-xd-history',
    'staff-xd-results'
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
        'xoc-dia-results'
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
    return [];
  }

  if (portalType === 'admin') {
    const baseItems = deepCloneMenuItems(
      adminMenuItems.filter(
        (item) => item.key !== 'agent-portal' && item.key !== 'staff-portal'
      )
    );

    const gameManagementItem = baseItems.find((item) => item.key === 'game-management');
    if (gameManagementItem) {
      const staffPortal = adminMenuItems.find((item) => item.key === 'staff-portal');
      const staffResultItems = [];

      if (staffPortal?.children) {
        staffPortal.children.forEach((section) => {
          if (section.key === 'staff-tx1' || section.key === 'staff-tx2') {
            section.children?.forEach((child) => {
              if (
                child.key === 'staff-tx1-sicbo-results' ||
                child.key === 'staff-tx2-sicbo-results'
              ) {
                staffResultItems.push({ ...child });
              }
            });
          }
        });
      }

      if (staffResultItems.length > 0) {
        const existingKeys = new Set(
          (gameManagementItem.children || []).map((child) => child.key)
        );
        const mergedChildren = [
          ...(gameManagementItem.children || []),
          ...staffResultItems.filter((item) => !existingKeys.has(item.key))
        ];
        gameManagementItem.children = mergedChildren;
      }
    }

    return baseItems;
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

const filterMenuTree = (items, term) => {
  if (!term) {
    return items;
  }
  const normalizedTerm = term.toLowerCase();
  return items
    .map((item) => {
      const children = item.children ? filterMenuTree(item.children, term) : undefined;
      const labelMatch = item.label?.toLowerCase().includes(normalizedTerm);
      const hasChildrenMatch = children && children.length > 0;
      if (labelMatch || hasChildrenMatch) {
        return {
          ...item,
          children
        };
      }
      return null;
    })
    .filter(Boolean);
};

const AdminSidebar = ({ collapsed, onToggleCollapse }) => {
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
  const [searchTerm, setSearchTerm] = useState('');
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
      analytics: () => goTo('/dashboard?tab=analytics'),
      users: () => goTo('/dashboard?tab=users'),
      'kyc-verification': () => goTo('/dashboard?tab=kyc-verification'),
      'staff-management': () => goTo('/dashboard?tab=staff-management'),
      'user-roles': () => goTo('/dashboard?tab=staff-management'),
      'login-history': () => goTo('/dashboard?tab=login-history'),
      deposits: () => goTo('/dashboard?tab=deposits'),
      withdraws: () => goTo('/dashboard?tab=withdraws'),
      'payment-methods': () => goTo('/dashboard?tab=payment-methods'),
      'deposit-gateway-configs': () => goTo('/dashboard?tab=deposit-gateway-configs'),
      'points-management': () => goTo('/points'),
      'agent-customer-list': () => goTo('/dashboard?tab=agent-customer-list'),
      'agent-invite-codes': () => goTo('/dashboard?tab=agent-invite-codes'),
      'agent-commission': () => goTo('/dashboard?tab=agent-commission'),
      'agent-report': () => goTo('/dashboard?tab=agent-report'),
      'staff-mkt-users': () => goTo('/dashboard?tab=staff-mkt-users'),
      'staff-mkt-finance': () => goTo('/dashboard?tab=staff-mkt-finance'),
      'staff-mkt-games': () => goTo('/dashboard?tab=staff-mkt-games'),
      'staff-xnk-users': () => goTo('/dashboard?tab=staff-xnk-users'),
      'staff-xnk-finance': () => goTo('/dashboard?tab=staff-xnk-finance'),
      'staff-xnk-games': () => goTo('/dashboard?tab=staff-xnk-games'),
      'staff-tx1-history': () => goTo('/dashboard?tab=staff-tx1-history'),
      'staff-tx2-history': () => goTo('/dashboard?tab=staff-tx2-history'),
      'staff-xd-history': () => goTo('/dashboard?tab=staff-xd-history'),
      'staff-tx1-sicbo-results': () => goTo('/dashboard?tab=staff-tx1-sicbo-results'),
      'staff-tx2-sicbo-results': () => goTo('/dashboard?tab=staff-tx2-sicbo-results'),
      'staff-xd-results': () => goTo('/dashboard?tab=staff-xd-results'),
      'admin-profile': () => goTo('/dashboard?tab=admin-profile'),
      games: () => goTo('/dashboard?tab=games'),
      'bet-management': () => goTo('/dashboard?tab=bet-management'),
      'game-history': () => goTo('/dashboard?tab=game-history'),
      'user-game-bets': () => goTo('/dashboard?tab=user-game-bets'),
      'game-results': () => goTo('/dashboard?tab=game-results'),
      'xoc-dia-results': () => goTo('/dashboard?tab=xoc-dia-results'),
      'game-settings': () => goTo('/dashboard?tab=game-settings'),
      'betting-odds': () => goTo('/betting-odds'),
      'xoc-dia-quick-bets': () => goTo('/xoc-dia/quick-bets'),
      'sicbo-quick-bets': () => goTo('/sicbo/quick-bets'),
      banners: () => goTo('/dashboard?tab=banners'),
      notifications: () => goTo('/dashboard?tab=notifications'),
      'marquee-notifications': () => goTo('/dashboard?tab=marquee-notifications'),
      'stream-configs': () => goTo('/dashboard?tab=stream-configs'),
      settings: () => goTo('/dashboard?tab=settings'),
      'contact-links': () => goTo('/dashboard?tab=contact-links'),
      promotions: () => goTo('/dashboard?tab=promotions'),
      'telegram-settings': () => goTo('/dashboard?tab=telegram-settings')
    }),
    [goTo]
  );

  const filteredMenuItems = useMemo(
    () => filterMenuTree(menuItems, searchTerm.trim()),
    [menuItems, searchTerm]
  );

  const isFilterMode = Boolean(searchTerm.trim());

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
      const isOpen =
        (isFilterMode && hasChildren) ||
        (!isForcedClosed && (openGroups.includes(item.key) || isDescendantActive));
      const isSelfActive = activeKey === item.key;
      const isActive = isSelfActive || isDescendantActive;

      const IconComponent = item.icon;

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

      if (collapsed) {
        return (
          <div key={item.key} className="py-1">
            <Button
              type="button"
              onClick={handleClick}
              variant="ghost"
              size="icon"
              className={cn(
                "w-full h-10 rounded-lg transition-all",
                isActive 
                  ? "bg-emerald-50 text-emerald-600" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
              title={item.label}
            >
              {IconComponent ? (
                <IconComponent className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        );
      }

      return (
        <div key={item.key}>
          <button
            type="button"
            onClick={handleClick}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
              "hover:bg-gray-50",
              isActive
                ? "bg-emerald-50 text-emerald-700 font-medium border-l-4 border-emerald-500"
                : "text-gray-700 hover:text-gray-900"
            )}
            style={{ paddingLeft: `${12 + depth * 16}px` }}
          >
            {IconComponent && (
              <IconComponent className={cn(
                "h-4 w-4 flex-shrink-0",
                isActive ? "text-emerald-600" : "text-gray-500"
              )} />
            )}
            <span className="flex-1 text-left">
              {item.label}
            </span>
            {hasChildren && (
              <div className="ml-auto">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </div>
            )}
          </button>
          {hasChildren && isOpen && (
            <div className="ml-4 border-l border-gray-200 pl-2 mt-1 space-y-0.5">
              {item.children.map((child) => renderMenuNode(child, depth + 1))}
            </div>
          )}
        </div>
      );
    },
    [collapsed, openGroups, activeKey, handleNavigate, closedGroups, isFilterMode]
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
      className="fixed left-0 top-0 z-[100] flex h-screen flex-col bg-white border-r border-gray-200 shadow-sm transition-[width] duration-200"
      style={{ width: sidebarWidth }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between border-b border-gray-200 bg-white"
        style={{
          height: LAYOUT.headerHeight,
          padding: collapsed ? '0 12px' : '0 16px 0 20px',
        }}
      >
        {collapsed ? (
          <Button
            type="button"
            onClick={onToggleCollapse}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </Button>
        ) : (
          <>
            <h1 className="text-base font-bold text-gray-900">
              {portalTitle}
            </h1>
            <Button
              type="button"
              onClick={onToggleCollapse}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </Button>
          </>
        )}
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-3 pt-3 pb-2 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm..."
              className={cn(
                "w-full rounded-lg border-gray-200 bg-gray-50 pl-8 pr-3 py-2",
                "text-sm text-gray-900 placeholder:text-gray-400",
                "focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500"
              )}
            />
          </div>
        </div>
      )}

      {/* Menu Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1 custom-scrollbar">
          {filteredMenuItems.length > 0 ? (
            filteredMenuItems.map((item) => (
            <div key={item.key} className="mb-1">
                {renderMenuNode(item)}
              </div>
            ))
          ) : (
          <div className="flex h-full items-center justify-center px-4 text-center">
            <p className="text-sm text-gray-400">Không tìm thấy mục phù hợp.</p>
            </div>
          )}
        </nav>

      {/* Logout Button */}
      <div className="border-t border-gray-200 px-2 py-3 bg-gray-50">
        <Button
            type="button"
            onClick={handleLogout}
          variant="ghost"
          className={cn(
            "w-full rounded-lg px-3 py-2.5 h-auto",
            "text-red-600 hover:text-red-700 hover:bg-red-50",
            "transition-all font-medium",
            collapsed ? "justify-center" : "justify-start gap-3"
          )}
          >
          <LogOut className="h-4 w-4" />
            {!collapsed && <span>Đăng xuất</span>}
        </Button>
      </div>

      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        loading={isLoggingOut}
        title="Xác nhận đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi Admin Panel không?"
        icon="mdi:logout"
        iconContainerClass="bg-red-100 text-red-600"
        confirmLabel="Đăng xuất"
        confirmLoadingLabel="Đang đăng xuất..."
        confirmIcon="mdi:logout"
        confirmButtonClass="bg-red-500 hover:bg-red-600"
      />
    </aside>
  );
};

export default AdminSidebar;
