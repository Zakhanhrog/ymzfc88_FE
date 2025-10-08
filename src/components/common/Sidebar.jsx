import { Layout, Menu, Tooltip } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { THEME_COLORS } from '../../utils/theme';

const { Sider } = Layout;

// Custom icon component - Không có background
const CustomIcon = ({ icon, iconColor, noMargin }) => (
  <Icon 
    icon={icon} 
    style={{ 
      fontSize: '32px', 
      color: iconColor || THEME_COLORS.secondary,
      marginRight: noMargin ? '0' : '16px'
    }} 
  />
);

// Custom image icon component cho sidebar menu items
const ImageIcon = ({ src, alt, noMargin }) => (
  <img 
    src={src}
    alt={alt}
    style={{ 
      width: '32px',
      height: '32px',
      objectFit: 'contain',
      marginRight: noMargin ? '0' : '16px'
    }} 
  />
);

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
  const gameCategories = [
    { key: 'HOT', label: 'HOT GAMES', icon: 'mdi:fire', iconColor: THEME_COLORS.secondary },
    { key: 'THETHAO', label: 'THỂ THAO', icon: 'mdi:soccer', iconColor: THEME_COLORS.secondary },
    { key: 'SONGBAI', label: 'SÒNG BÀI', icon: 'mdi:cards-playing', iconColor: THEME_COLORS.secondary },
    { key: 'SLOTS', label: 'SLOTS', icon: 'mdi:slot-machine', iconColor: THEME_COLORS.secondary },
    { key: 'DAGA', label: 'ĐÁ GÀ', icon: 'game-icons:rooster', iconColor: THEME_COLORS.secondary },
    { key: 'GAMEBAI', label: 'GAME BÀI', icon: 'mdi:cards', iconColor: THEME_COLORS.secondary },
    { key: 'RACING', label: 'RACING BALL', icon: 'mdi:basketball', iconColor: THEME_COLORS.secondary }
  ];
  const selectedKey = activeGame;

  const handleMenuClick = ({ key }) => {
    if (key === 'deposit') {
      // Điều hướng đến trang ví tiền với tab nạp/rút tiền
      navigate('/wallet?tab=deposit-withdraw');
      return;
    } else if (key === 'daily') {
      console.log('Mỗi Ngày clicked');
    } else if (key === 'lucky-wheel') {
      console.log('Vòng Quay May Mắn clicked');
    } else if (key === 'reward-results') {
      console.log('Kết Quả Trao Thưởng clicked');
    } else if (key === 'red-envelope') {
      console.log('Phong Bì Đỏ clicked');
    } else if (key === 'lottery') {
      console.log('XỔ SỐ clicked');
      // navigate('/lottery');
    } else if (key === 'esports') {
      console.log('E-SPORTS clicked');
      // navigate('/esports');
    } else if (key === 'promotions') {
      console.log('KHUYẾN MÃI clicked');
      // navigate('/promotions');
    } else if (key === 'vip') {
      console.log('VIP clicked');
      // navigate('/vip');
    } else if (key === 'app') {
      console.log('APP clicked');
      // navigate('/app');
    } else if (key === 'external-agent') {
      console.log('ĐẠI LÝ NGOÀI clicked');
      // navigate('/external-agent');
    } else if (key === 'about') {
      console.log('Về Chúng Tôi clicked');
      // navigate('/about');
    } else if (key === 'contact') {
      console.log('Liên Hệ clicked');
      // navigate('/contact');
    } else if (key === 'login') {
      onLoginOpen();
    } else if (key === 'register') {
      onRegisterOpen();
    } else if (key === 'logout') {
      onLogout();
    } else if (key === 'profile') {
      navigate('/wallet');
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
      width={280}
      collapsedWidth={64}
      className="bg-white shadow-lg sidebar-scrollable"
      style={{
        overflowY: 'auto',
        overflowX: 'hidden',
        height: 'calc(100vh - 64px)',
        position: 'fixed',
        left: 0,
        top: '64px',
        zIndex: 5
      }}
    >
      <Menu
        mode="vertical"
        selectedKeys={[selectedKey]}
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
        {!collapsed && (
          <>
            {/* Banner Panel - di chuyển vào trong Menu để scroll cùng */}
            <div style={{ padding: '0 6px', marginBottom: '8px' }}>
              <div 
                className="relative rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                style={{ height: '60px' }}
                onClick={() => console.log('Banner clicked')}
              >
                <img 
                  src="/banner-yua.webp"
                  alt="VUA MIKAMI Banner"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-10 hover:bg-opacity-5 transition-all duration-300"></div>
              </div>
            </div>
            
            
            <div style={{ padding: '0 6px', marginBottom: '8px' }}>
              <Menu.Item 
                key="daily" 
                icon={<ImageIcon src="/sm-check.png" alt="Mỗi Ngày" />}
                className="sidebar-menu-item"
                style={{ 
                  height: '56px', 
                  display: 'flex', 
                  alignItems: 'center',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0 8px',
                  margin: '0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <span style={{ fontSize: '15px', color: THEME_COLORS.secondary, fontWeight: '500' }}>Mỗi Ngày</span>
              </Menu.Item>
            </div>
            
            <div style={{ padding: '0 6px', marginBottom: '8px' }}>
              <Menu.Item 
                key="lucky-wheel" 
                icon={<ImageIcon src="/sm-wheel.png" alt="Vòng Quay May Mắn" />}
                className="sidebar-menu-item"
                style={{ 
                  height: '56px', 
                  display: 'flex', 
                  alignItems: 'center',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0 8px',
                  margin: '0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <span style={{ fontSize: '15px', color: THEME_COLORS.secondary, fontWeight: '500' }}>Vòng Quay May Mắn</span>
              </Menu.Item>
            </div>
            
            <div style={{ padding: '0 6px', marginBottom: '8px' }}>
              <Menu.Item 
                key="reward-results" 
                icon={<ImageIcon src="/sm-mb.webp" alt="Kết Quả Trao Thưởng" />}
                className="sidebar-menu-item"
                style={{ 
                  height: '56px', 
                  display: 'flex', 
                  alignItems: 'center',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0 8px',
                  margin: '0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <span style={{ fontSize: '15px', color: THEME_COLORS.secondary, fontWeight: '500' }}>Kết Quả Trao Thưởng</span>
              </Menu.Item>
            </div>
            
            <div style={{ padding: '0 6px', marginBottom: '8px' }}>
              <Menu.Item 
                key="red-envelope" 
                icon={<ImageIcon src="/sm-red.png" alt="Phong Bì Đỏ" />}
                className="sidebar-menu-item"
                style={{ 
                  height: '56px', 
                  display: 'flex', 
                  alignItems: 'center',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0 8px',
                  margin: '0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <span style={{ fontSize: '15px', color: THEME_COLORS.secondary, fontWeight: '500' }}>Phong Bì Đỏ</span>
              </Menu.Item>
            </div>
            
            <div style={{ padding: '0 6px', marginBottom: '8px' }}>
              <Menu.Item 
                key="deposit" 
                icon={<ImageIcon src="/icon-deposit.png" alt="Nạp Tiền" />}
                className="sidebar-menu-item"
                style={{ 
                  height: '56px', 
                  display: 'flex', 
                  alignItems: 'center',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0 8px',
                  margin: '0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <span style={{ fontSize: '15px', color: THEME_COLORS.secondary, fontWeight: '500' }}>Nạp Tiền</span>
              </Menu.Item>
            </div>            <Menu.Divider style={{ margin: '16px 12px' }} />
            
            {/* Hiển thị tất cả danh mục game trực tiếp */}                {gameCategories.map((category) => (
                  <div key={`wrapper-${category.key}`} style={{ padding: '0 6px', marginBottom: '8px' }}>
                    <Menu.Item 
                      key={category.key}
                      icon={<CustomIcon icon={category.icon} iconColor={category.iconColor} />}
                      className={`sidebar-menu-item game-category-item ${activeGame === category.key ? 'active' : ''}`}
                      style={{ 
                        height: '56px', 
                        display: 'flex', 
                        alignItems: 'center',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '0 8px',
                        margin: '0',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <span style={{ fontSize: '15px', color: THEME_COLORS.secondary, fontWeight: '500' }}>{category.label}</span>
                    </Menu.Item>
                  </div>
                ))}
            
            {/* Các mục bổ sung theo yêu cầu */}
            <div style={{ padding: '0 6px', marginBottom: '8px' }}>
              <Menu.Item 
                key="lottery" 
                icon={<CustomIcon icon="mdi:dice-multiple" iconColor={THEME_COLORS.secondary} />}
                className="sidebar-menu-item"
                style={{ 
                  height: '56px', 
                  display: 'flex', 
                  alignItems: 'center',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0 8px',
                  margin: '0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <span style={{ fontSize: '15px', color: THEME_COLORS.secondary, fontWeight: '500' }}>XỔ SỐ</span>
              </Menu.Item>
            </div>
            
            <div style={{ padding: '0 6px', marginBottom: '8px' }}>
              <Menu.Item 
                key="esports" 
                icon={<CustomIcon icon="mdi:controller" iconColor={THEME_COLORS.secondary} />}
                className="sidebar-menu-item"
                style={{ 
                  height: '56px', 
                  display: 'flex', 
                  alignItems: 'center',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0 8px',
                  margin: '0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <span style={{ fontSize: '15px', color: THEME_COLORS.secondary, fontWeight: '500' }}>E-SPORTS</span>
              </Menu.Item>
            </div>
            
            <div style={{ padding: '0 6px', marginBottom: '8px' }}>
              <Menu.Item 
                key="promotions" 
                icon={<CustomIcon icon="mdi:gift" iconColor={THEME_COLORS.secondary} />}
                className="sidebar-menu-item"
                style={{ 
                  height: '56px', 
                  display: 'flex', 
                  alignItems: 'center',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0 8px',
                  margin: '0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <span style={{ fontSize: '15px', color: THEME_COLORS.secondary, fontWeight: '500' }}>KHUYẾN MÃI</span>
              </Menu.Item>
            </div>
            
            <div style={{ padding: '0 6px', marginBottom: '8px' }}>
              <Menu.Item 
                key="vip" 
                icon={<CustomIcon icon="mdi:crown" iconColor={THEME_COLORS.secondary} />}
                className="sidebar-menu-item"
                style={{ 
                  height: '56px', 
                  display: 'flex', 
                  alignItems: 'center',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0 8px',
                  margin: '0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <span style={{ fontSize: '15px', color: THEME_COLORS.secondary, fontWeight: '500' }}>VIP</span>
              </Menu.Item>
            </div>
            
            <div style={{ padding: '0 6px', marginBottom: '8px' }}>
              <Menu.Item 
                key="app" 
                icon={<CustomIcon icon="mdi:cellphone" iconColor={THEME_COLORS.secondary} />}
                className="sidebar-menu-item"
                style={{ 
                  height: '56px', 
                  display: 'flex', 
                  alignItems: 'center',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0 8px',
                  margin: '0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <span style={{ fontSize: '15px', color: THEME_COLORS.secondary, fontWeight: '500' }}>APP</span>
              </Menu.Item>
            </div>
            
            <div style={{ padding: '0 6px', marginBottom: '8px' }}>
              <Menu.Item 
                key="external-agent" 
                icon={<CustomIcon icon="mdi:swap-horizontal" iconColor={THEME_COLORS.secondary} />}
                className="sidebar-menu-item"
                style={{ 
                  height: '56px', 
                  display: 'flex', 
                  alignItems: 'center',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0 8px',
                  margin: '0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <span style={{ fontSize: '15px', color: THEME_COLORS.secondary, fontWeight: '500' }}>ĐẠI LÝ NGOÀI</span>
              </Menu.Item>
            </div>
            
            <div style={{ padding: '0 6px', marginBottom: '8px' }}>
              <Menu.Item 
                key="about" 
                icon={<CustomIcon icon="mdi:lightbulb" iconColor={THEME_COLORS.secondary} />}
                className="sidebar-menu-item"
                style={{ 
                  height: '56px', 
                  display: 'flex', 
                  alignItems: 'center',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0 8px',
                  margin: '0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <span style={{ fontSize: '15px', color: THEME_COLORS.secondary, fontWeight: '500' }}>Về Chúng Tôi</span>
              </Menu.Item>
            </div>
            
            <div style={{ padding: '0 6px', marginBottom: '8px' }}>
              <Menu.Item 
                key="contact" 
                icon={<CustomIcon icon="mdi:headset" iconColor={THEME_COLORS.secondary} />}
                className="sidebar-menu-item"
                style={{ 
                  height: '56px', 
                  display: 'flex', 
                  alignItems: 'center',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0 8px',
                  margin: '0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <span style={{ fontSize: '15px', color: THEME_COLORS.secondary, fontWeight: '500' }}>Liên Hệ</span>
              </Menu.Item>
            </div>
          </>
        )}
        
        {collapsed && (
          <>                <Tooltip title="Mỗi Ngày" placement="right">
                  <div style={{ padding: '0 6px', marginBottom: '6px', display: 'flex', justifyContent: 'center' }}>
                    <Menu.Item 
                      key="daily" 
                      icon={<ImageIcon src="/sm-check.png" alt="Mỗi Ngày" noMargin />}
                      className="sidebar-menu-item"
                      style={{ 
                        height: '48px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        padding: '0', 
                        width: '48px',
                        border: 'none',
                        borderRadius: '12px',
                        margin: '0',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>
                </Tooltip>
                
                <Tooltip title="Vòng Quay May Mắn" placement="right">
                  <div style={{ padding: '0 6px', marginBottom: '6px', display: 'flex', justifyContent: 'center' }}>
                    <Menu.Item 
                      key="lucky-wheel"
                      icon={<ImageIcon src="/sm-wheel.png" alt="Vòng Quay May Mắn" noMargin />}
                      className="sidebar-menu-item"
                      style={{ 
                        height: '48px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        padding: '0', 
                        width: '48px',
                        border: 'none',
                        borderRadius: '12px',
                        margin: '0',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>
                </Tooltip>
                
                <Tooltip title="Kết Quả Trao Thưởng" placement="right">
                  <div style={{ padding: '0 6px', marginBottom: '6px', display: 'flex', justifyContent: 'center' }}>
                    <Menu.Item 
                      key="reward-results"
                      icon={<ImageIcon src="/sm-mb.webp" alt="Kết Quả Trao Thưởng" noMargin />}
                      className="sidebar-menu-item"
                      style={{ 
                        height: '48px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        padding: '0', 
                        width: '48px',
                        border: 'none',
                        borderRadius: '12px',
                        margin: '0',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>
                </Tooltip>
                
                <Tooltip title="Phong Bì Đỏ" placement="right">
                  <div style={{ padding: '0 6px', marginBottom: '6px', display: 'flex', justifyContent: 'center' }}>
                    <Menu.Item 
                      key="red-envelope"
                      icon={<ImageIcon src="/sm-red.png" alt="Phong Bì Đỏ" noMargin />}
                      className="sidebar-menu-item"
                      style={{ 
                        height: '48px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        padding: '0', 
                        width: '48px',
                        border: 'none',
                        borderRadius: '12px',
                        margin: '0',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>
                </Tooltip>
                
                <Tooltip title="Nạp Tiền" placement="right">
                  <div style={{ padding: '0 6px', marginBottom: '6px', display: 'flex', justifyContent: 'center' }}>
                    <Menu.Item 
                      key="deposit"
                      icon={<ImageIcon src="/icon-deposit.png" alt="Nạp Tiền" noMargin />}
                      className="sidebar-menu-item"
                      style={{ 
                        height: '48px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        padding: '0', 
                        width: '48px',
                        border: 'none',
                        borderRadius: '12px',
                        margin: '0',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>
                </Tooltip>
            
            <Menu.Divider style={{ margin: '12px 8px' }} />                {gameCategories.map((category) => (
                  <Tooltip key={`tooltip-${category.key}`} title={category.label} placement="right">
                    <div style={{ padding: '0 8px', marginBottom: '6px', display: 'flex', justifyContent: 'center' }}>
                      <Menu.Item 
                        key={category.key}
                        icon={<CustomIcon icon={category.icon} iconColor={category.iconColor} noMargin />}
                        className="sidebar-menu-item"
                        style={{ 
                          height: '56px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          padding: '0', 
                          width: '56px',
                          border: 'none',
                          borderRadius: '12px',
                          margin: '0',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: 'none'
                        }}
                      />
                    </div>
                  </Tooltip>
                ))}
            
            {/* Các mục bổ sung cho collapsed mode */}
            <Tooltip title="XỔ SỐ" placement="right">
              <div style={{ padding: '0 8px', marginBottom: '6px', display: 'flex', justifyContent: 'center' }}>
                <Menu.Item 
                  key="lottery"
                  icon={<CustomIcon icon="mdi:dice-multiple" iconColor={THEME_COLORS.secondary} noMargin />}
                  className="sidebar-menu-item"
                  style={{ 
                    height: '56px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    padding: '0', 
                    width: '56px',
                    border: 'none',
                    borderRadius: '12px',
                    margin: '0',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: 'none'
                  }}
                />
              </div>
            </Tooltip>
            
            <Tooltip title="E-SPORTS" placement="right">
              <div style={{ padding: '0 8px', marginBottom: '6px', display: 'flex', justifyContent: 'center' }}>
                <Menu.Item 
                  key="esports"
                  icon={<CustomIcon icon="mdi:controller" iconColor={THEME_COLORS.secondary} noMargin />}
                  className="sidebar-menu-item"
                  style={{ 
                    height: '56px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    padding: '0', 
                    width: '56px',
                    border: 'none',
                    borderRadius: '12px',
                    margin: '0',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: 'none'
                  }}
                />
              </div>
            </Tooltip>
            
            <Tooltip title="KHUYẾN MÃI" placement="right">
              <div style={{ padding: '0 8px', marginBottom: '6px', display: 'flex', justifyContent: 'center' }}>
                <Menu.Item 
                  key="promotions"
                  icon={<CustomIcon icon="mdi:gift" iconColor={THEME_COLORS.secondary} noMargin />}
                  className="sidebar-menu-item"
                  style={{ 
                    height: '56px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    padding: '0', 
                    width: '56px',
                    border: 'none',
                    borderRadius: '12px',
                    margin: '0',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: 'none'
                  }}
                />
              </div>
            </Tooltip>
            
            <Tooltip title="VIP" placement="right">
              <div style={{ padding: '0 8px', marginBottom: '6px', display: 'flex', justifyContent: 'center' }}>
                <Menu.Item 
                  key="vip"
                  icon={<CustomIcon icon="mdi:crown" iconColor={THEME_COLORS.secondary} noMargin />}
                  className="sidebar-menu-item"
                  style={{ 
                    height: '56px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    padding: '0', 
                    width: '56px',
                    border: 'none',
                    borderRadius: '12px',
                    margin: '0',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: 'none'
                  }}
                />
              </div>
            </Tooltip>
            
            <Tooltip title="APP" placement="right">
              <div style={{ padding: '0 8px', marginBottom: '6px', display: 'flex', justifyContent: 'center' }}>
                <Menu.Item 
                  key="app"
                  icon={<CustomIcon icon="mdi:cellphone" iconColor={THEME_COLORS.secondary} noMargin />}
                  className="sidebar-menu-item"
                  style={{ 
                    height: '56px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    padding: '0', 
                    width: '56px',
                    border: 'none',
                    borderRadius: '12px',
                    margin: '0',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: 'none'
                  }}
                />
              </div>
            </Tooltip>
            
            <Tooltip title="ĐẠI LÝ NGOÀI" placement="right">
              <div style={{ padding: '0 8px', marginBottom: '6px', display: 'flex', justifyContent: 'center' }}>
                <Menu.Item 
                  key="external-agent"
                  icon={<CustomIcon icon="mdi:swap-horizontal" iconColor={THEME_COLORS.secondary} noMargin />}
                  className="sidebar-menu-item"
                  style={{ 
                    height: '56px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    padding: '0', 
                    width: '56px',
                    border: 'none',
                    borderRadius: '12px',
                    margin: '0',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: 'none'
                  }}
                />
              </div>
            </Tooltip>
            
            <Tooltip title="Về Chúng Tôi" placement="right">
              <div style={{ padding: '0 8px', marginBottom: '6px', display: 'flex', justifyContent: 'center' }}>
                <Menu.Item 
                  key="about"
                  icon={<CustomIcon icon="mdi:lightbulb" iconColor={THEME_COLORS.secondary} noMargin />}
                  className="sidebar-menu-item"
                  style={{ 
                    height: '56px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    padding: '0', 
                    width: '56px',
                    border: 'none',
                    borderRadius: '12px',
                    margin: '0',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: 'none'
                  }}
                />
              </div>
            </Tooltip>
            
            <Tooltip title="Liên Hệ" placement="right">
              <div style={{ padding: '0 8px', marginBottom: '6px', display: 'flex', justifyContent: 'center' }}>
                <Menu.Item 
                  key="contact"
                  icon={<CustomIcon icon="mdi:headset" iconColor={THEME_COLORS.secondary} noMargin />}
                  className="sidebar-menu-item"
                  style={{ 
                    height: '56px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    padding: '0', 
                    width: '56px',
                    border: 'none',
                    borderRadius: '12px',
                    margin: '0',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: 'none'
                  }}
                />
              </div>
            </Tooltip>
          </>
        )}

      </Menu>
    </Sider>
  );
};

export default Sidebar;
