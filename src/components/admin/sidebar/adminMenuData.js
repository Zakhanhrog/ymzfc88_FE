// Icon names từ Material Design Icons (mdi) - sẽ được render bằng @iconify/react trong component
const ICONS = {
  dashboard: 'mdi:view-dashboard',
  analytics: 'mdi:chart-line',
  userManagement: 'mdi:account-group',
  users: 'mdi:account',
  kyc: 'mdi:shield-check',
  userRoles: 'mdi:shield-account',
  staff: 'mdi:account-cog',
  agent: 'mdi:account-supervisor',
  financialManagement: 'mdi:wallet',
  deposits: 'mdi:bank-plus',
  withdraws: 'mdi:bank-minus',
  paymentMethods: 'mdi:credit-card-multiple',
  points: 'mdi:coin',
  gameManagement: 'mdi:dice-multiple',
  games: 'mdi:trophy',
  gameSettings: 'mdi:cog',
  bettingOdds: 'mdi:ticket-confirmation',
  betManagement: 'mdi:clipboard-list',
  gameResults: 'mdi:calendar-check',
  xocdiaResults: 'mdi:dice-6',
  sicboResults: 'mdi:dice-5',
  xocdiaOdds: 'mdi:bowl',
  sicboOdds: 'mdi:dice-multiple',
  contentManagement: 'mdi:file-document-multiple',
  banners: 'mdi:image-multiple',
  streamConfigs: 'mdi:video-box',
  news: 'mdi:newspaper',
  notifications: 'mdi:bell',
  marquee: 'mdi:scroll-text',
  systemManagement: 'mdi:cog',
  settings: 'mdi:cog',
  contactLinks: 'mdi:phone',
  promotions: 'mdi:gift',
  telegram: 'mdi:telegram',
  agentPortal: 'mdi:office-building',
  agentOverview: 'mdi:view-dashboard',
  agentOverviewChart: 'mdi:chart-box',
  agentCustomers: 'mdi:account-group',
  agentCustomerDetail: 'mdi:account-details',
  agentInvite: 'mdi:tag',
  agentCommission: 'mdi:cash-multiple',
  agentReport: 'mdi:chart-box-outline',
  staffPortal: 'mdi:office-building-outline',
  staffMkt: 'mdi:store',
  staffXnk: 'mdi:bank',
  staffTx1: 'mdi:dice-5',
  staffTx2: 'mdi:dice-5',
  staffXd: 'mdi:dice-6',
  staffUsers: 'mdi:account-group',
  staffFinance: 'mdi:wallet-outline',
  staffGames: 'mdi:gamepad-variant'
};

export const adminMenuItems = [
  // 1. DASHBOARD - Tổng quan và thống kê
  {
    key: 'dashboard',
    icon: ICONS.dashboard,
    label: 'DASHBOARD',
    children: [
      {
        key: 'overview',
        icon: ICONS.dashboard,
        label: 'Tổng quan',
      },
      {
        key: 'analytics',
        icon: ICONS.analytics,
        label: 'Thống kê',
      }
    ]
  },
  // 2. QUẢN LÝ NGƯỜI DÙNG - Sắp xếp theo thứ tự: danh sách -> xác thực -> nhân viên -> đại lý -> lịch sử
  {
    key: 'user-management',
    icon: ICONS.userManagement,
    label: 'QUẢN LÝ NGƯỜI DÙNG',
    children: [
      {
        key: 'users',
        icon: ICONS.users,
        label: 'Danh sách người dùng',
      },
      {
        key: 'kyc-verification',
        icon: ICONS.kyc,
        label: 'Xác thực tài khoản (KYC)',
      },
      {
        key: 'login-history',
        icon: ICONS.notifications,
        label: 'Lịch sử đăng nhập',
      },
      {
        key: 'staff-management',
        icon: ICONS.staff,
        label: 'Quản lý nhân viên',
      },
      {
        key: 'agent-report',
        icon: ICONS.agentReport,
        label: 'Báo cáo đại lý',
      },
      {
        key: 'sub-admin-management',
        icon: ICONS.staff,
        label: 'Quản lý admin phụ',
      }
    ]
  },
  // 3. QUẢN LÝ TÀI CHÍNH - Sắp xếp theo thứ tự: nạp -> rút -> phương thức -> cấu hình -> điểm
  {
    key: 'financial-management',
    icon: ICONS.financialManagement,
    label: 'QUẢN LÝ TÀI CHÍNH',
    children: [
      {
        key: 'deposits',
        icon: ICONS.deposits,
        label: 'Duyệt nạp tiền',
      },
      {
        key: 'withdraws',
        icon: ICONS.withdraws,
        label: 'Duyệt rút tiền',
      },
      {
        key: 'payment-methods',
        icon: ICONS.paymentMethods,
        label: 'Phương thức thanh toán',
      },
      {
        key: 'points-management',
        icon: ICONS.points,
        label: 'Quản lý điểm',
      }
    ]
  },
  // 4. QUẢN LÝ GAME
  {
    key: 'game-management',
    icon: ICONS.gameManagement,
    label: 'QUẢN LÝ GAME',
    children: [
      // XỔ SỐ
      {
        key: 'lottery-management',
        icon: ICONS.bettingOdds,
        label: 'XỔ SỐ',
        children: [
          {
            key: 'betting-odds',
        label: 'Tỷ lệ cược xổ số',
      },
          {
            key: 'bet-management',
            label: 'Quản lý lệnh cược xổ số',
          },
          {
            key: 'game-results',
            label: 'Kết quả xổ số',
          },
        ]
      },
      // XÓC ĐĨA
      {
        key: 'xoc-dia-management',
        icon: ICONS.xocdiaOdds,
        label: 'XÓC ĐĨA',
        children: [
          {
            key: 'xoc-dia-quick-bets',
        label: 'Tỷ lệ cược Xóc Đĩa',
      },
          {
            key: 'xoc-dia-results',
            label: 'Kết quả Xóc Đĩa',
          },
        ]
      },
      // TÀI XỈU
      {
        key: 'sicbo-management',
        icon: ICONS.sicboOdds,
        label: 'TÀI XỈU',
        children: [
          {
            key: 'sicbo-quick-bets',
        label: 'Tỷ lệ cược Tài xỉu',
      },
          {
            key: 'staff-tx1-sicbo-results',
            label: 'Kết quả bàn TX1',
          },
      {
            key: 'staff-tx2-sicbo-results',
            label: 'Kết quả bàn TX2',
      },
        ]
      },
      // Báo cáo và lịch sử chung
      {
        key: 'user-game-bets',
        icon: ICONS.points,
        label: 'Báo cáo thắng/thua',
      },
      {
        key: 'game-history',
        icon: ICONS.betManagement,
        label: 'Lịch sử game',
      }
    ]
  },
  // 5. QUẢN LÝ NỘI DUNG - Sắp xếp theo thứ tự: banner -> stream -> thông báo
  {
    key: 'content-management',
    icon: ICONS.contentManagement,
    label: 'QUẢN LÝ NỘI DUNG',
    children: [
      {
        key: 'banners',
        icon: ICONS.banners,
        label: 'Banner quảng cáo',
      },
      {
        key: 'stream-configs',
        icon: ICONS.streamConfigs,
        label: 'Cấu hình Stream',
      },
      {
        key: 'notifications',
        icon: ICONS.notifications,
        label: 'Thông báo',
      },
      {
        key: 'marquee-notifications',
        icon: ICONS.marquee,
        label: 'Thông báo chạy (Marquee)',
      }
    ]
  },
  // 6. QUẢN LÝ HỆ THỐNG - Sắp xếp theo thứ tự: cài đặt -> khuyến mãi -> liên hệ -> telegram
  {
    key: 'system-management',
    icon: ICONS.systemManagement,
    label: 'QUẢN LÝ HỆ THỐNG',
    children: [
      {
        key: 'settings',
        icon: ICONS.settings,
        label: 'Cài đặt hệ thống',
      },
      {
        key: 'promotions',
        icon: ICONS.promotions,
        label: 'Khuyến mãi',
      },
      {
        key: 'contact-links',
        icon: ICONS.contactLinks,
        label: 'Links liên hệ',
      },
      {
        key: 'telegram-settings',
        icon: ICONS.telegram,
        label: 'Cài đặt Telegram',
      }
    ]
  },
  // 7. ĐẠI LÝ - Portal riêng cho đại lý
  {
    key: 'agent-portal',
    icon: ICONS.agentPortal,
    label: 'ĐẠI LÝ',
    children: [
      {
        key: 'agent-customer-list',
        icon: ICONS.agentCustomers,
        label: 'Danh sách khách hàng',
      },
      {
        key: 'agent-invite-codes',
        icon: ICONS.agentInvite,
        label: 'Quản lý mã mời',
      },
      {
        key: 'agent-commission',
        icon: ICONS.agentCommission,
        label: 'Quản lý hoa hồng',
      }
    ]
  },
  // 8. NHÂN VIÊN - Portal riêng cho nhân viên, sắp xếp theo loại nhân viên
  {
    key: 'staff-portal',
    icon: ICONS.staffPortal,
    label: 'NHÂN VIÊN',
    children: [
      {
        key: 'staff-mkt',
        icon: ICONS.staffMkt,
        label: 'Nhân viên MKT',
        children: [
          {
            key: 'staff-mkt-users',
            icon: ICONS.staffUsers,
            label: 'Quản lý người dùng',
          },
          {
            key: 'staff-mkt-finance',
            icon: ICONS.staffFinance,
            label: 'Quản lý tài chính',
          },
          {
            key: 'staff-mkt-games',
            icon: ICONS.staffGames,
            label: 'Quản lý game',
          }
        ]
      },
      {
        key: 'staff-xnk',
        icon: ICONS.staffXnk,
        label: 'Nhân viên XNK',
        children: [
          {
            key: 'staff-xnk-users',
            icon: ICONS.staffUsers,
            label: 'Quản lý người dùng',
          },
          {
            key: 'staff-xnk-finance',
            icon: ICONS.staffFinance,
            label: 'Quản lý tài chính',
          },
          {
            key: 'staff-xnk-games',
            icon: ICONS.staffGames,
            label: 'Quản lý game',
          }
        ]
      },
      {
        key: 'staff-tx1',
        icon: ICONS.staffTx1,
        label: 'Nhân viên bàn TX1',
        children: [
          {
            key: 'staff-tx1-sicbo-results',
            icon: ICONS.sicboResults,
            label: 'Kết quả bàn TX1',
          },
          {
            key: 'staff-tx1-history',
            icon: ICONS.staffTx1,
            label: 'Lịch sử kết quả TX1',
          }
        ]
      },
      {
        key: 'staff-tx2',
        icon: ICONS.staffTx2,
        label: 'Nhân viên bàn TX2',
        children: [
          {
            key: 'staff-tx2-sicbo-results',
            icon: ICONS.sicboResults,
            label: 'Kết quả bàn TX2',
          },
          {
            key: 'staff-tx2-history',
            icon: ICONS.staffTx2,
            label: 'Lịch sử kết quả TX2',
          }
        ]
      },
      {
        key: 'staff-xd',
        icon: ICONS.staffXd,
        label: 'Nhân viên Xóc Đĩa',
        children: [
          {
            key: 'staff-xd-results',
            icon: ICONS.xocdiaResults,
            label: 'Kết quả bàn Xóc Đĩa',
  },
  {
            key: 'staff-xd-history',
            icon: ICONS.staffXd,
            label: 'Lịch sử kết quả Xóc Đĩa',
          }
        ]
      }
    ]
  }
];
