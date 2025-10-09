import { Layout, Menu, Tooltip } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { CustomIcon, ImageIcon } from './sidebar/SidebarIcon';
import SidebarBanner from './sidebar/SidebarBanner';
import SidebarMenuItem from './sidebar/SidebarMenuItem';
import { gameCategories, specialMenuItems, additionalMenuItems } from './sidebar/sidebarMenuData';
import { LAYOUT, THEME_COLORS } from '../../utils/theme';

const { Sider } = Layout;

const Sidebar = ({ 
  collapsed, 
  onCollapse, 
  activeGame, 
  onGameSelect,
  onLoginOpen,
  onRegisterOpen,
  onLogout,
  isLoggedIn 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = ({ key }) => {
    const menuActions = {
      'deposit': () => navigate('/wallet?tab=deposit-withdraw'),
      'daily': () => console.log('Mỗi Ngày clicked'),
      'lucky-wheel': () => console.log('Vòng Quay May Mắn clicked'),
      'reward-results': () => console.log('Kết Quả Trao Thưởng clicked'),
      'red-envelope': () => console.log('Phong Bì Đỏ clicked'),
      'lottery': () => console.log('XỔ SỐ clicked'),
      'esports': () => console.log('E-SPORTS clicked'),
      'promotions': () => console.log('KHUYẾN MÃI clicked'),
      'vip': () => console.log('VIP clicked'),
      'app': () => console.log('APP clicked'),
      'external-agent': () => console.log('ĐẠI LÝ NGOÀI clicked'),
      'about': () => console.log('Về Chúng Tôi clicked'),
      'contact': () => console.log('Liên Hệ clicked'),
      'login': onLoginOpen,
      'register': onRegisterOpen,
      'logout': onLogout,
      'profile': () => navigate('/wallet')
    };

    if (menuActions[key]) {
      menuActions[key]();
    } else {
      onGameSelect(key);
    }
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      trigger={null}
      width={parseInt(LAYOUT.sidebarWidth)}
      collapsedWidth={parseInt(LAYOUT.sidebarCollapsedWidth)}
      className="bg-white shadow-lg sidebar-scrollable"
      style={{
        overflowY: 'auto',
        overflowX: 'hidden',
        height: `calc(100vh - ${LAYOUT.headerHeight})`,
        position: 'fixed',
        left: 0,
        top: LAYOUT.headerHeight,
        zIndex: 5
      }}
    >
      <Menu
        mode="vertical"
        selectedKeys={[activeGame]}
        className="sidebar-menu"
        style={{ 
          border: 'none', 
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          background: 'white'
        }}
        onClick={handleMenuClick}
      >
        {!collapsed ? (
          <>
            {/* Banner */}
            <SidebarBanner 
              imageUrl="/banner-yua.webp"
              alt="VUA MIKAMI Banner"
                onClick={() => console.log('Banner clicked')}
            />
            
            {/* Special menu items với icon hình ảnh */}
            {specialMenuItems.map((item) => (
              <div key={`wrapper-${item.key}`} style={{ padding: '0 6px', marginBottom: '8px' }}>
                <SidebarMenuItem
                  itemKey={item.key}
                  icon={<ImageIcon src={item.image} alt={item.label} />}
                  label={item.label}
                  collapsed={false}
                />
              </div>
            ))}
            
            <Menu.Divider style={{ margin: '16px 12px' }} />
            
            {/* Game categories */}
            {gameCategories.map((category) => (
              <div key={`wrapper-${category.key}`} style={{ padding: '0 6px', marginBottom: '8px' }}>
                <SidebarMenuItem
                  itemKey={category.key}
                  icon={<CustomIcon icon={category.icon} iconColor={category.iconColor} />}
                  label={category.label}
                  collapsed={false}
                  isGameCategory={true}
                />
              </div>
            ))}
            
            {/* Additional menu items */}
            {additionalMenuItems.map((item) => (
              <div key={`wrapper-${item.key}`} style={{ padding: '0 6px', marginBottom: '8px' }}>
                <SidebarMenuItem
                  itemKey={item.key}
                  icon={<CustomIcon icon={item.icon} iconColor={THEME_COLORS.secondary} />}
                  label={item.label}
                  collapsed={false}
                />
              </div>
            ))}
          </>
        ) : (
          <>
            {/* Collapsed mode - with tooltips */}
            {specialMenuItems.map((item) => (
              <Tooltip key={`tooltip-${item.key}`} title={item.label} placement="right">
                <div style={{ padding: '0 6px', marginBottom: '6px', display: 'flex', justifyContent: 'center' }}>
                  <SidebarMenuItem
                    itemKey={item.key}
                    icon={<ImageIcon src={item.image} alt={item.label} noMargin />}
                    collapsed={true}
                />
              </div>
            </Tooltip>
            ))}
            
            <Menu.Divider style={{ margin: '12px 8px' }} />
            
            {/* Game categories collapsed */}
            {gameCategories.map((category) => (
              <Tooltip key={`tooltip-${category.key}`} title={category.label} placement="right">
                <div style={{ padding: '0 8px', marginBottom: '6px', display: 'flex', justifyContent: 'center' }}>
                  <SidebarMenuItem
                    itemKey={category.key}
                    icon={<CustomIcon icon={category.icon} iconColor={category.iconColor} noMargin />}
                    collapsed={true}
                    isGameCategory={true}
                    style={{ height: '56px', width: '56px' }}
                  />
                </div>
              </Tooltip>
            ))}
            
            {/* Additional items collapsed */}
            {additionalMenuItems.map((item) => (
              <Tooltip key={`tooltip-${item.key}`} title={item.label} placement="right">
              <div style={{ padding: '0 8px', marginBottom: '6px', display: 'flex', justifyContent: 'center' }}>
                  <SidebarMenuItem
                    itemKey={item.key}
                    icon={<CustomIcon icon={item.icon} iconColor={THEME_COLORS.secondary} noMargin />}
                    collapsed={true}
                    style={{ height: '56px', width: '56px' }}
                />
              </div>
            </Tooltip>
            ))}
          </>
        )}
      </Menu>
    </Sider>
  );
};

export default Sidebar;
