import { Menu } from 'antd';
import { BORDER_RADIUS } from '../../../utils/theme';
import { SIDEBAR_STYLES } from '../../../utils/typography';

const SidebarMenuItem = ({ 
  itemKey, 
  icon, 
  label, 
  collapsed = false,
  isGameCategory = false, // Flag để biết có phải game category không
  style = {} 
}) => {
  const baseStyle = {
    height: collapsed ? '48px' : '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: collapsed ? 'center' : 'flex-start',
    border: 'none',
    borderRadius: BORDER_RADIUS.lg,
    padding: collapsed ? '0' : '0 8px',
    margin: '0',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    width: collapsed ? '48px' : 'auto',
    ...style
  };

  // Thêm class game-category-item nếu là game category
  const className = isGameCategory 
    ? "sidebar-menu-item game-category-item" 
    : "sidebar-menu-item";

  return (
    <Menu.Item 
      key={itemKey}
      icon={icon}
      className={className}
      style={baseStyle}
    >
      {!collapsed && (
        <span style={{ ...SIDEBAR_STYLES.menuLabel }}>
          {label}
        </span>
      )}
    </Menu.Item>
  );
};

export default SidebarMenuItem;

