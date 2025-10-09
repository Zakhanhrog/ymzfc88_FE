import { Button, Avatar, Dropdown } from 'antd';
import { 
  UserOutlined, 
  ReloadOutlined, 
  LogoutOutlined, 
  GiftOutlined 
} from '@ant-design/icons';
import NotificationDropdown from '../../../features/notification/components/NotificationDropdown';
import { THEME_COLORS, BORDER_RADIUS } from '../../../utils/theme';
import { NAVBAR_STYLES, FONT_SIZE, FONT_WEIGHT } from '../../../utils/typography';

const UserMenu = ({ 
  isMobile, 
  userName, 
  userBalance, 
  onRefreshBalance,
  onLogout,
  onNavigate
}) => {
  // Desktop view - full layout
  if (!isMobile) {
    return (
      <div className="flex items-center gap-3">
        {/* Username riêng biệt - có thể click */}
        <span 
          className="cursor-pointer hover:underline transition-all duration-200" 
          style={{ ...NAVBAR_STYLES.username }}
          onClick={() => onNavigate('/wallet')}
          title="Xem thông tin ví cá nhân"
        >
          {userName}
        </span>
        
        {/* Balance với icon reload trong ô riêng */}
        <div className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-full bg-white">
          <span style={{ ...NAVBAR_STYLES.balance }}>
            {new Intl.NumberFormat('vi-VN', {
              style: 'decimal',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }).format(userBalance / 1000)}
          </span>
          <Button 
            type="text"
            size="small"
            icon={<ReloadOutlined />}
            onClick={onRefreshBalance}
            className="text-gray-400 hover:text-gray-600"
            style={{
              padding: '0',
              height: '20px',
              width: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />
        </div>
        
        {/* Nạp tiền button */}
        <Button 
          onClick={() => onNavigate('/wallet?tab=deposit-withdraw')}
          className="flex items-center gap-2 border-0 shadow-none"
          style={{
            background: 'transparent',
            color: THEME_COLORS.secondaryLight,
            fontSize: NAVBAR_STYLES.navButton.fontSize,
            fontWeight: NAVBAR_STYLES.navButton.fontWeight,
            fontFamily: NAVBAR_STYLES.navButton.fontFamily,
            padding: '8px 12px',
            height: 'auto'
          }}
        >
          <UserOutlined style={{ fontSize: '20px', color: THEME_COLORS.secondaryLight }} />
          <span>Nạp tiền</span>
        </Button>
        
        {/* Rút tiền button */}
        <Button 
          onClick={() => onNavigate('/wallet?tab=withdraw')}
          className="flex items-center gap-2 border-0 shadow-none"
          style={{
            background: 'transparent',
            color: THEME_COLORS.secondaryLight,
            fontSize: NAVBAR_STYLES.navButton.fontSize,
            fontWeight: NAVBAR_STYLES.navButton.fontWeight,
            fontFamily: NAVBAR_STYLES.navButton.fontFamily,
            padding: '8px 12px',
            height: 'auto'
          }}
        >
          <GiftOutlined style={{ fontSize: '20px', color: THEME_COLORS.secondaryLight }} />
          <span>Rút tiền</span>
        </Button>
        
        {/* Notification Icon */}
        <NotificationDropdown />
        
        {/* Đăng xuất button */}
        <Button 
          onClick={onLogout}
          className="shadow-none hover:bg-gray-50"
          style={{
            background: 'white',
            color: '#9ca3af',
            fontSize: FONT_SIZE.base,
            fontWeight: FONT_WEIGHT.normal,
            padding: '6px 18px',
            height: '36px',
            border: '1px solid #e5e7eb',
            borderRadius: BORDER_RADIUS.round,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          Đăng xuất
        </Button>
      </div>
    );
  }

  // Mobile view - compact layout với avatar dropdown
  return (
    <div className="flex items-center gap-3">
      <span className="text-gray-700 text-base font-semibold">
        {new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(userBalance).replace('₫', 'đ')}
      </span>
      
      {/* Notification Icon for mobile */}
      <NotificationDropdown />
      
      {/* Avatar với dropdown cho mobile */}
      <Dropdown
        menu={{
          items: [
            {
              key: 'wallet',
              icon: <UserOutlined />,
              label: 'Ví của tôi',
              onClick: () => onNavigate('/wallet')
            },
            {
              key: 'deposit',
              icon: <ReloadOutlined />,
              label: 'Nạp tiền',
              onClick: () => onNavigate('/wallet?tab=deposit-withdraw')
            },
            {
              type: 'divider'
            },
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: 'Đăng xuất',
              onClick: onLogout
            }
          ]
        }}
        trigger={['click']}
        placement="bottomRight"
      >
        <Avatar 
          size={36}
          icon={<UserOutlined />}
          className="cursor-pointer bg-gray-500 hover:bg-gray-600 transition-colors"
          style={{
            backgroundColor: '#6b7280',
            color: 'white'
          }}
        />
      </Dropdown>
    </div>
  );
};

export default UserMenu;

