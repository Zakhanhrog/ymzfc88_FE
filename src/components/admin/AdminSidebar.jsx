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
import Dropdown, { DropdownMenu } from '../ui/Dropdown';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Search, LogOut, Menu, ChevronLeft } from 'lucide-react';
import { Icon } from '@iconify/react';

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
    const userRole = session?.role;
    const staffRole = session?.staffRole;
    const isSubAdmin = userRole === 'SUB_ADMIN';
    const isAdmin = userRole === 'ADMIN';
    
    const baseItems = deepCloneMenuItems(
      adminMenuItems.filter(
        (item) => item.key !== 'agent-portal' && item.key !== 'staff-portal'
      )
    );

    // Ẩn menu "Quản lý admin phụ" nếu không phải ADMIN
    if (!isAdmin) {
      const userManagementItem = baseItems.find((item) => item.key === 'user-management');
      if (userManagementItem?.children) {
        userManagementItem.children = userManagementItem.children.filter(
          (child) => child.key !== 'sub-admin-management'
        );
      }
    }

    // Ẩn các tab kết quả game nếu là SUB_ADMIN
    if (isSubAdmin) {
      const gameManagementItem = baseItems.find((item) => item.key === 'game-management');
      if (gameManagementItem?.children) {
        gameManagementItem.children = gameManagementItem.children.map((child) => {
          if (child.key === 'lottery-management') {
            // Ẩn tab "Kết quả xổ số"
            return {
              ...child,
              children: child.children?.filter(
                (subChild) => subChild.key !== 'game-results'
              )
            };
          }
          if (child.key === 'xoc-dia-management') {
            // Ẩn tab "Kết quả Xóc Đĩa"
            return {
              ...child,
              children: child.children?.filter(
                (subChild) => subChild.key !== 'xoc-dia-results'
              )
            };
          }
          if (child.key === 'sicbo-management') {
            // Ẩn các tab kết quả Tài Xỉu
            return {
              ...child,
              children: child.children?.filter(
                (subChild) => 
                  subChild.key !== 'staff-tx1-sicbo-results' &&
                  subChild.key !== 'staff-tx2-sicbo-results'
              )
            };
          }
          return child;
        });
      }
    } else {
      // Logic cũ cho ADMIN: merge staff result items
      const gameManagementItem = baseItems.find((item) => item.key === 'game-management');
      if (gameManagementItem) {
        const sicboManagementItem = gameManagementItem.children?.find(
          (item) => item.key === 'sicbo-management'
        );
        
        if (sicboManagementItem) {
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
                    staffResultItems.push({ ...child, icon: undefined });
                  }
                });
              }
            });
          }

          if (staffResultItems.length > 0) {
            const existingKeys = new Set(
              (sicboManagementItem.children || []).map((child) => child.key)
            );
            const mergedChildren = [
              ...(sicboManagementItem.children || []),
              ...staffResultItems.filter((item) => !existingKeys.has(item.key))
            ];
            sicboManagementItem.children = mergedChildren;
          }
        }
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
      'sub-admin-management': () => goTo('/dashboard?tab=sub-admin-management'),
      deposits: () => goTo('/dashboard?tab=deposits'),
      withdraws: () => goTo('/dashboard?tab=withdraws'),
      'payment-methods': () => goTo('/dashboard?tab=payment-methods'),
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
      const isDescendantActiveOnly = isDescendantActive && !isSelfActive; // Chỉ có con được chọn, không phải chính nó
      const isActive = isSelfActive || isDescendantActive;

      const iconName = item.icon; // Icon name string từ adminMenuData

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
        const buttonContent = (
          <Button
            type="button"
            onClick={hasChildren ? undefined : handleClick}
            variant="ghost"
            className={cn(
              "w-full h-12 rounded-md transition-all duration-200 [&_svg]:!size-6 [&_svg]:!h-6 [&_svg]:!w-6",
              isSelfActive
                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/30" 
                : isDescendantActiveOnly
                ? "bg-emerald-50 text-emerald-700"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            )}
            title={item.label}
          >
            {iconName ? (
              <Icon icon={iconName} width="24" height="24" style={{ width: '24px', height: '24px', fontSize: '24px' }} />
            ) : (
              <Menu className="!h-6 !w-6" style={{ width: '24px', height: '24px' }} />
            )}
          </Button>
        );

        // Nếu có children, wrap trong Dropdown với hover
        if (hasChildren) {
          const childMenuItems = item.children.map((child) => ({
            label: child.label,
            icon: child.icon ? <Icon icon={child.icon} className="h-4 w-4" /> : null,
            onClick: () => handleNavigate(child.key),
            disabled: false
          }));

          return (
            <div key={item.key} className="py-0.5">
              <Dropdown
                trigger="hover"
                placement="right-start"
                overlay={
                  <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[200px]">
                    <div className="px-3 py-2 border-b border-gray-200">
                      <span className="text-sm font-semibold text-gray-900">{item.label}</span>
                    </div>
                    <div className="flex flex-col">
                      {item.children.map((child) => {
                      const childIconName = child.icon;
                      const isChildActive = activeKey === child.key;
                      const hasGrandChildren = Array.isArray(child.children) && child.children.length > 0;
                      
                      const buttonContent = (
                        <button
                          key={child.key}
                          type="button"
                          onClick={(e) => {
                            if (!hasGrandChildren) {
                              e.stopPropagation();
                              e.preventDefault();
                              handleNavigate(child.key);
                            }
                          }}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                          }}
                          className={cn(
                            "w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-3",
                            isChildActive
                              ? "bg-emerald-50 text-emerald-700 font-medium"
                              : "text-gray-700 hover:bg-gray-100"
                          )}
                        >
                          {childIconName && (
                            <Icon 
                              icon={childIconName} 
                              className={cn(
                                "h-4 w-4 flex-shrink-0",
                                isChildActive ? "text-emerald-600" : "text-gray-500"
                              )} 
                            />
                          )}
                          <span className="flex-1">{child.label}</span>
                          {hasGrandChildren && (
                            <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          )}
                        </button>
                      );

                      // Nếu có children, wrap trong Dropdown
                      if (hasGrandChildren) {
                        return (
                          <Dropdown
                            key={child.key}
                            trigger="hover"
                            placement="right-start"
                            overlay={
                              <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[200px]">
                                {child.children.map((grandChild) => {
                                  const grandChildIconName = grandChild.icon;
                                  const isGrandChildActive = activeKey === grandChild.key;
                                  return (
                                    <button
                                      key={grandChild.key}
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        handleNavigate(grandChild.key);
                                      }}
                                      onMouseDown={(e) => {
                                        e.stopPropagation();
                                      }}
                                      className={cn(
                                        "w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-3",
                                        isGrandChildActive
                                          ? "bg-emerald-50 text-emerald-700 font-medium"
                                          : "text-gray-700 hover:bg-gray-100"
                                      )}
                                    >
                                      {grandChildIconName && (
                                        <Icon 
                                          icon={grandChildIconName} 
                                          className={cn(
                                            "h-4 w-4 flex-shrink-0",
                                            isGrandChildActive ? "text-emerald-600" : "text-gray-500"
                                          )} 
                                        />
                                      )}
                                      <span>{grandChild.label}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            }
                          >
                            {buttonContent}
                          </Dropdown>
                        );
                      }

                      // Nếu không có children, chỉ render button
                      return (
                        <div key={child.key} className="block">
                          {buttonContent}
                        </div>
                      );
                    })}
                    </div>
                  </div>
                }
              >
                {buttonContent}
              </Dropdown>
            </div>
          );
        }

        // Nếu không có children, chỉ render button
        return (
          <div key={item.key} className="py-0.5">
            {buttonContent}
          </div>
        );
      }

      return (
        <div key={item.key}>
          <button
            type="button"
            onClick={handleClick}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-200",
              isSelfActive
                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold shadow-md shadow-emerald-500/30"
                : isDescendantActiveOnly
                ? "bg-emerald-50/50 text-emerald-700 font-medium border-l-2 border-emerald-400"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            )}
            style={{ paddingLeft: `${12 + depth * 16}px` }}
          >
            {iconName && (
              <Icon 
                icon={iconName} 
                className={cn(
                  "h-5 w-5 flex-shrink-0",
                  isSelfActive 
                    ? "text-white" 
                    : isDescendantActiveOnly
                    ? "text-emerald-600"
                    : "text-gray-500"
                )} 
              />
            )}
            <span className="flex-1 text-left">
              {item.label}
            </span>
            {hasChildren && (
              <div className="ml-auto">
                {isOpen ? (
                  <ChevronDown className={cn(
                    "h-4 w-4", 
                    isSelfActive 
                      ? "text-white/80" 
                      : isDescendantActiveOnly
                      ? "text-emerald-600"
                      : "text-gray-400"
                  )} />
                ) : (
                  <ChevronRight className={cn(
                    "h-4 w-4", 
                    isSelfActive 
                      ? "text-white/80" 
                      : isDescendantActiveOnly
                      ? "text-emerald-600"
                      : "text-gray-400"
                  )} />
                )}
              </div>
            )}
          </button>
          {hasChildren && (
            <div
              className={cn(
                "grid transition-all duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)]",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden ml-4 border-l border-gray-200 pl-2 mt-1 space-y-0.5">
              {item.children.map((child) => renderMenuNode(child, depth + 1))}
              </div>
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
          <button
            type="button"
            onClick={onToggleCollapse}
            className="flex items-center justify-center w-full h-full hover:bg-gray-50 rounded transition-colors"
            title="Mở rộng sidebar"
          >
            <img 
              src="/favicon.png" 
              alt="Logo" 
              className="h-8 w-8 object-contain"
            />
          </button>
        ) : (
          <>
            <div className="flex items-center gap-3 flex-1">
              <img 
                src="/images/logos/logo.png" 
                alt="Logo" 
                className="h-10 object-contain"
              />
            </div>
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
