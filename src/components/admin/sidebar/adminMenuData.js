// Admin Menu Data Structure - Không chứa JSX
// Icons sẽ được render trong component

export const adminMenuItems = [
  {
    key: 'dashboard',
    icon: 'DashboardOutlined',
    label: 'Dashboard',
    children: [
      {
        key: 'overview',
        icon: 'BarChartOutlined',
        label: 'Tổng quan',
      },
      {
        key: 'analytics',
        icon: 'FileTextOutlined',
        label: 'Thống kê',
      }
    ]
  },
  {
    key: 'user-management',
    icon: 'TeamOutlined',
    label: 'Quản lý người dùng',
    children: [
      {
        key: 'users',
        icon: 'UserOutlined',
        label: 'Danh sách người dùng',
      },
      {
        key: 'kyc-verification',
        icon: 'SafetyCertificateOutlined',
        label: 'Xác thực tài khoản',
      },
      {
        key: 'user-roles',
        icon: 'SafetyOutlined',
        label: 'Phân quyền',
      },
      {
        key: 'user-activities',
        icon: 'BarChartOutlined',
        label: 'Hoạt động người dùng',
      }
    ]
  },
  {
    key: 'financial-management',
    icon: 'DollarOutlined',
    label: 'Quản lý tài chính',
    children: [
      {
        key: 'deposits',
        icon: 'ArrowUpOutlined',
        label: 'Duyệt nạp tiền',
      },
      {
        key: 'withdraws',
        icon: 'ArrowDownOutlined',
        label: 'Duyệt rút tiền',
      },
      {
        key: 'transactions',
        icon: 'ShoppingOutlined',
        label: 'Lịch sử giao dịch',
      },
      {
        key: 'payment-methods',
        icon: 'CreditCardOutlined',
        label: 'Phương thức thanh toán',
      },
      {
        key: 'points-management',
        icon: 'StarOutlined',
        label: 'Quản lý điểm',
      }
    ]
  },
  {
    key: 'game-management',
    icon: 'TrophyOutlined',
    label: 'Quản lý game',
    children: [
      {
        key: 'games',
        icon: 'TrophyOutlined',
        label: 'Danh sách game',
      },
      {
        key: 'bet-management',
        icon: 'ShoppingOutlined',
        label: 'Quản lý cược',
      },
      {
        key: 'game-results',
        icon: 'BarChartOutlined',
        label: 'Kết quả game',
      },
      {
        key: 'game-settings',
        icon: 'SettingOutlined',
        label: 'Cài đặt game',
      },
      {
        key: 'betting-odds',
        icon: 'PercentageOutlined',
        label: 'Tỷ lệ cược',
      }
    ]
  },
  {
    key: 'content-management',
    icon: 'FileTextOutlined',
    label: 'Quản lý nội dung',
    children: [
      {
        key: 'banners',
        icon: 'FileTextOutlined',
        label: 'Banner',
      },
      {
        key: 'news',
        icon: 'MessageOutlined',
        label: 'Tin tức',
      },
      {
        key: 'notifications',
        icon: 'BellOutlined',
        label: 'Thông báo',
      }
    ]
  },
  {
    key: 'system-management',
    icon: 'SettingOutlined',
    label: 'Quản lý hệ thống',
    children: [
      {
        key: 'settings',
        icon: 'SettingOutlined',
        label: 'Cài đặt hệ thống',
      },
      {
        key: 'contact-links',
        icon: 'LinkOutlined',
        label: 'Links liên hệ',
      },
      {
        key: 'promotions',
        icon: 'GiftOutlined',
        label: 'Khuyến mãi',
      },
      {
        key: 'maintenance',
        icon: 'ToolOutlined',
        label: 'Bảo trì',
      },
      {
        key: 'logs',
        icon: 'FileTextOutlined',
        label: 'Nhật ký hệ thống',
      }
    ]
  }
];
