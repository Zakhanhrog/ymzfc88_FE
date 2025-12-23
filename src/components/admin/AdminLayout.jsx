import { useState, useEffect, useMemo, useRef } from 'react';
import { Layout } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './layout/AdminHeader';
import { LAYOUT } from '../../utils/theme';
import { getPortalLoginPath, getPortalDashboardPath } from '../../utils/navigation';
import { getPortalType } from '../../utils/subdomain';
import { adminAuthService } from '../../features/admin/services/adminAuthService';
import { adminMenuItems } from './sidebar/adminMenuData';
import { cn } from '@/lib/utils';
import { X, RefreshCw, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const { Content } = Layout;

const HEADER_HEIGHT = parseInt(LAYOUT.headerHeight, 10) || 64;
const TAB_BAR_HEIGHT = 44;

// Helpers để map route hiện tại sang key & title của menu
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

const getActiveKeyFromLocation = (portalType, location) => {
  const path = stripPortalPrefix(portalType, location.pathname);
  const searchParams = new URLSearchParams(location.search);
  const tab = searchParams.get('tab');

  // Trạng thái tab rỗng theo yêu cầu
  if (tab === 'empty') {
    return null;
  }

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

const buildTitleFromMenu = (portalType, activeKey) => {
  if (!activeKey) return 'Dashboard';

  // Xử lý các tab đặc biệt không có trong menu
  const specialTabs = {
    'admin-profile': 'Thông tin cá nhân',
    'overview': 'Tổng quan',
  };

  if (specialTabs[activeKey]) {
    return specialTabs[activeKey];
  }

  let filteredItems = adminMenuItems;
  if (portalType === 'agent') {
    filteredItems = adminMenuItems.filter((item) => item.key === 'agent-portal');
  } else if (portalType === 'staff') {
    filteredItems = adminMenuItems.filter((item) => item.key === 'staff-portal');
  } else {
    filteredItems = adminMenuItems.filter(
      (item) => item.key !== 'agent-portal' && item.key !== 'staff-portal'
    );
  }

  const item = findMenuItemByKey(filteredItems, activeKey);
  return item?.label || 'Dashboard';
};

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const portalType = getPortalType();
  const location = useLocation();

  // Tính storageKey trước để dùng trong initial state
  const initialStorageKey = `admin_tabs_${portalType || 'default'}`;
  
  const storageKey = useMemo(
    () => `admin_tabs_${portalType || 'default'}`,
    [portalType]
  );

  // Khởi tạo tabs từ sessionStorage ngay từ đầu để tránh mất dữ liệu khi remount
  const [tabs, setTabs] = useState(() => {
    try {
      const stored = sessionStorage.getItem(initialStorageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      // ignore storage errors
    }
    return [];
  });
  
  const [activeTabId, setActiveTabId] = useState(() => {
    // Khởi tạo activeTabId từ location hiện tại
    return `${location.pathname}${location.search || ''}`;
  });
const [isTabless, setIsTabless] = useState(false);

  // State và ref cho scroll tab bar
  const tabsScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    // Check admin authentication
    const isAuthenticated = adminAuthService.isAuthenticated(portalType);
    const isAuthorized = adminAuthService.isAuthorizedForPortal(portalType);
    if (!isAuthenticated || !isAuthorized) {
      adminAuthService.logout();
      navigate(getPortalLoginPath(portalType));
    }
  }, [navigate, portalType]);

  // Đồng bộ tabs khi storageKey thay đổi (khi portalType thay đổi)
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setTabs(parsed);
        }
      }
    } catch (e) {
      // ignore storage errors
    }
  }, [storageKey]);

  // Cập nhật danh sách tab đang mở khi route thay đổi
  useEffect(() => {
    const activeKey = getActiveKeyFromLocation(portalType, location);
    const tabId = `${location.pathname}${location.search || ''}`;
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');

    // Nếu đang ở trạng thái tab rỗng thì không auto mở tab
    if (tabParam === 'empty') {
      setIsTabless(true);
      setTabs([]);
      setActiveTabId(null);
      return;
    }

    // Khi chuyển sang route thực (chọn từ sidebar), thoát chế độ tab rỗng
    if (isTabless) {
      setIsTabless(false);
    }

    const title = buildTitleFromMenu(portalType, activeKey);

    setTabs((prevTabs) => {
      // Kiểm tra xem tab này đã tồn tại chưa
      const existingIndex = prevTabs.findIndex((t) => t.id === tabId);
      
      if (existingIndex !== -1) {
        // Tab đã tồn tại, chỉ cập nhật title nếu cần
        const next = [...prevTabs];
        if (next[existingIndex].title !== title) {
          next[existingIndex] = { ...next[existingIndex], title };
        }
        return next;
      }

      // Tab mới, thêm vào danh sách (giữ nguyên các tab cũ)
      return [
        ...prevTabs,
        {
          id: tabId,
          path: tabId,
          title
        }
      ];
    });

    setActiveTabId(tabId);
  }, [location.pathname, location.search, portalType, isTabless]);

  // Đồng bộ tabs vào sessionStorage để không bị mất khi AdminLayout remount
  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(tabs));
    } catch (e) {
      // ignore storage errors
    }
  }, [tabs, storageKey]);

  const hasTabs = tabs.length > 0;

  // Hàm kiểm tra và cập nhật trạng thái scroll
  const checkScrollPosition = () => {
    const container = tabsScrollRef.current;
    if (!container) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  // Hàm scroll trái
  const scrollLeft = () => {
    const container = tabsScrollRef.current;
    if (!container) return;
    container.scrollBy({ left: -200, behavior: 'smooth' });
    // Check lại position sau khi scroll
    setTimeout(checkScrollPosition, 300);
  };

  // Hàm scroll phải
  const scrollRight = () => {
    const container = tabsScrollRef.current;
    if (!container) return;
    container.scrollBy({ left: 200, behavior: 'smooth' });
    // Check lại position sau khi scroll
    setTimeout(checkScrollPosition, 300);
  };

  // Scroll đến tab active khi cần
  useEffect(() => {
    if (!tabsScrollRef.current || !activeTabId) return;
    
    const container = tabsScrollRef.current;
    const activeTabElement = container.querySelector(`[data-tab-id="${activeTabId}"]`);
    
    if (activeTabElement) {
      const containerRect = container.getBoundingClientRect();
      const tabRect = activeTabElement.getBoundingClientRect();
      
      // Nếu tab nằm ngoài viewport, scroll đến nó
      if (tabRect.left < containerRect.left) {
        activeTabElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      } else if (tabRect.right > containerRect.right) {
        activeTabElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'end' });
      }
    }
    
    // Delay một chút để check lại sau khi scroll
    setTimeout(checkScrollPosition, 300);
  }, [activeTabId, tabs]);

  // Check scroll position khi tabs thay đổi hoặc window resize
  useEffect(() => {
    // Delay một chút để DOM render xong
    const timeoutId = setTimeout(() => {
      checkScrollPosition();
    }, 100);
    
    const container = tabsScrollRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      return () => {
        clearTimeout(timeoutId);
        container.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [tabs]);

  const handleTabClick = (tab) => {
    if (tab.id === activeTabId) return;
    navigate(tab.path);
  };

  const handleCloseTab = (tabId) => {
    setTabs((prevTabs) => {
      const idx = prevTabs.findIndex((t) => t.id === tabId);
      if (idx === -1) return prevTabs;

      const nextTabs = prevTabs.filter((t) => t.id !== tabId);

      // Lưu ngay vào storage
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(nextTabs));
      } catch (e) {
        // ignore storage errors
      }

      if (tabId !== activeTabId) {
        return nextTabs;
      }

      if (nextTabs.length > 0) {
        const nextIndex = idx > 0 ? idx - 1 : 0;
        const nextTab = nextTabs[nextIndex];
        setActiveTabId(nextTab.id);
        navigate(nextTab.path);
        return nextTabs;
      }

      // Đóng tab cuối (thường là Tổng quan): chuyển sang trạng thái không tab
      const emptyPath = getPortalDashboardPath(portalType || 'admin', 'empty');
      setIsTabless(true);
      setActiveTabId(null);
      navigate(emptyPath, { replace: true });
      return [];
    });
  };

  const handleRefresh = () => {
    // Chỉ refresh nội dung trang đang mở (active tab) bằng cách dispatch event
    // Các component con sẽ lắng nghe event này để reload data của chúng
    window.dispatchEvent(new CustomEvent('adminPageRefresh', { 
      detail: { path: activeTabId } 
    }));
    
    // Nếu cần, có thể navigate lại route hiện tại với key để force re-render
    if (activeTabId) {
      navigate(activeTabId, { replace: true, state: { refresh: Date.now() } });
    }
  };

  const handleClearAll = () => {
    // Chỉ giữ lại tab hiện tại, đóng tất cả tab khác
    if (activeTabId && tabs.length > 0) {
      const currentTab = tabs.find(t => t.id === activeTabId);
      if (currentTab) {
        const newTabs = [currentTab];
        setTabs(newTabs);
        try {
          sessionStorage.setItem(storageKey, JSON.stringify(newTabs));
        } catch (e) {
          // ignore storage errors
        }
      }
    }
  };

  return (
    <Layout className="min-h-screen">
      <AdminSidebar 
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />
      
      <Layout
        style={{
        marginLeft: collapsed ? LAYOUT.adminSidebarCollapsedWidth : LAYOUT.adminSidebarWidth, 
        transition: 'margin-left 0.2s' 
        }}
      >
        <AdminHeader 
          collapsed={collapsed}
        />

        {/* Thanh tab các màn hình admin đang mở - nằm sát dưới header */}
        {(hasTabs || isTabless) && (
          <div
            style={{
              position: 'fixed',
              top: HEADER_HEIGHT,
              left: collapsed ? LAYOUT.adminSidebarCollapsedWidth : LAYOUT.adminSidebarWidth,
              width: `calc(100% - ${collapsed ? LAYOUT.adminSidebarCollapsedWidth : LAYOUT.adminSidebarWidth})`,
              height: TAB_BAR_HEIGHT,
              backgroundColor: '#f5f7fb',
              borderBottom: '1px solid #e5e7eb',
              zIndex: 98,
            }}
          >
            <div className="h-full flex items-center justify-between px-4 gap-2">
              {/* Nút scroll trái */}
              {hasTabs && canScrollLeft && (
                <button
                  type="button"
                  onClick={scrollLeft}
                  className="flex-shrink-0 flex items-center justify-center w-4 h-8 rounded-sm bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              )}
              
              <div 
                ref={tabsScrollRef}
                className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1"
                style={{ scrollBehavior: 'smooth' }}
              >
                {hasTabs ? (
                  tabs.map((tab) => {
                    const isActive = tab.id === activeTabId;
                    return (
                      <button
                        key={tab.id}
                        data-tab-id={tab.id}
                        type="button"
                        onClick={() => handleTabClick(tab)}
                        className={cn(
                          'group inline-flex items-center justify-center px-3 py-1.5 text-xs whitespace-nowrap transition-all duration-150 rounded-sm flex-shrink-0',
                          isActive
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                        )}
                      >
                        <div className="relative flex items-center justify-center">
                          {/* Label chỉ hiện khi chưa hover & tab không active */}
                          {!isActive && (
                            <span className="truncate max-w-[180px] font-medium group-hover:opacity-0 group-hover:scale-95 transition-all duration-150">
                              {tab.title}
                            </span>
                          )}

                          {/* Label + nút đóng khi hover (hoặc luôn với tab active) */}
                          <span
                            className={cn(
                              'inline-flex items-center justify-center gap-2 truncate max-w-[180px] font-medium transition-all duration-150',
                              isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 absolute inset-0'
                            )}
                          >
                            <span className="truncate">{tab.title}</span>
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCloseTab(tab.id);
                              }}
                              className="flex items-center justify-center rounded-sm p-[2px] text-white/80 hover:bg-white/20 hover:text-white transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </span>
                          </span>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <span className="text-sm text-gray-500">Hãy chọn mục trên sidebar</span>
                )}
              </div>

              {/* Nút scroll phải */}
              {hasTabs && canScrollRight && (
                <button
                  type="button"
                  onClick={scrollRight}
                  className="flex-shrink-0 flex items-center justify-center w-4 h-8 rounded-sm bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
              
              {/* Nút Refresh và Clear */}
              <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 transition-colors text-xs font-medium"
                  disabled={!hasTabs}
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 transition-colors text-xs font-medium"
                  disabled={!hasTabs}
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Clear</span>
                </button>
              </div>
            </div>
          </div>
        )}
        
        <Content 
          style={{
            margin: `${HEADER_HEIGHT + ((hasTabs || isTabless) ? TAB_BAR_HEIGHT : 0)}px 0 0 0`,
            padding: '16px 24px 24px',
            background: '#f0f2f5',
            minHeight: `calc(100vh - ${LAYOUT.headerHeight})`,
            overflow: 'auto'
          }}
        >
          {isTabless ? null : children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
