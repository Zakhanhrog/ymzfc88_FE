// Admin Menu Data Structure - Không chứa JSX
// Icons sẽ được render trong component

const ICONS = {
  dashboard: '/iconacc/imgi_24_overview.avif',
  analytics: '/images/icons/sm-wheel.png',
  userManagement: '/iconacc/imgi_29_account.avif',
  users: '/iconacc/imgi_29_account.avif',
  kyc: '/images/icons/sm-check.png',
  userRoles: '/images/icons/sm-wheel.png',
  staff: '/icondieuhuongmb/imgi_21_sport.avif',
  agent: '/icondieuhuongmb/imgi_22_casino.avif',
  financialManagement: '/images/icons/imgi_35_icon-bank.png',
  deposits: '/iconacc/imgi_25_deposit.avif',
  withdraws: '/iconacc/imgi_26_withdraw.avif',
  paymentMethods: '/iconacc/imgi_27_bank.avif',
  points: '/iconacc/imgi_34_wallet.svg',
  gameManagement: '/icondieuhuongmb/imgi_32_lobby-game.avif',
  games: '/icondieuhuongmb/imgi_32_lobby-game.avif',
  gameSettings: '/images/icons/sm-mb.webp',
  bettingOdds: '/icondieuhuongmb/imgi_25_lottery.avif',
  betManagement: '/icondieuhuongmb/imgi_27_game-cards.avif',
  gameResults: '/images/icons/sm-red.png',
  xocdiaResults: '/icondieuhuongmb/imgi_28_keno.avif',
  sicboResults: '/icondieuhuongmb/imgi_22_casino.avif',
  xocdiaOdds: '/icondieuhuongmb/imgi_28_keno.avif',
  sicboOdds: '/icondieuhuongmb/imgi_25_lottery.avif',
  contentManagement: '/icondieuhuongmb/imgi_34_promotion.avif',
  banners: '/icondieuhuongmb/imgi_34_promotion.avif',
  news: '/icondieuhuongmb/imgi_35_help.avif',
  notifications: '/iconacc/imgi_28_history.avif',
  marquee: '/images/icons/imgi_3_nav-menu.png',
  systemManagement: '/images/icons/imgi_3_nav-menu.png',
  settings: '/images/icons/sm-check.png',
  contactLinks: '/icondieuhuongmb/imgi_35_help.avif',
  promotions: '/iconacc/imgi_30_promotion.avif',
  telegram: '/iconhotro/imgi_137_telegram.svg',
  agentPortal: '/icondieuhuongmb/imgi_22_casino.avif',
  agentOverview: '/images/icons/sm-wheel.png',
  agentOverviewChart: '/images/icons/sm-mb.webp',
  agentCustomers: '/iconacc/imgi_29_account.avif',
  agentCustomerDetail: '/iconacc/imgi_75_icon-home.avif',
  agentInvite: '/iconacc/imgi_30_promotion.avif',
  agentCommission: '/images/icons/icon-deposit.png',
  staffPortal: '/icondieuhuongmb/imgi_21_sport.avif',
  staffMkt: '/iconacc/imgi_30_promotion.avif',
  staffXnk: '/iconacc/imgi_27_bank.avif',
  staffTx1: '/icondieuhuongmb/imgi_25_lottery.avif',
  staffTx2: '/icondieuhuongmb/imgi_28_keno.avif',
  staffXd: '/icondieuhuongmb/imgi_27_game-cards.avif',
  staffUsers: '/iconacc/imgi_29_account.avif',
  staffFinance: '/images/icons/imgi_35_icon-bank.png',
  staffGames: '/icondieuhuongmb/imgi_32_lobby-game.avif'
};

export const adminMenuItems = [
  {
    key: 'dashboard',
    icon: ICONS.dashboard,
    label: 'Dashboard',
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
  {
    key: 'user-management',
    icon: ICONS.userManagement,
    label: 'Quản lý người dùng',
    children: [
      {
        key: 'users',
        icon: ICONS.users,
        label: 'Danh sách người dùng',
      },
      {
        key: 'kyc-verification',
        icon: ICONS.kyc,
        label: 'Xác thực tài khoản',
      },
      {
        key: 'user-roles',
        icon: ICONS.userRoles,
        label: 'Phân quyền',
      },
      {
        key: 'staff-management',
        icon: ICONS.staff,
        label: 'Quản lý nhân viên',
      },
      {
        key: 'agent-management',
        icon: ICONS.agent,
        label: 'Quản lý đại lý',
      }
    ]
  },
  {
    key: 'financial-management',
    icon: ICONS.financialManagement,
    label: 'Quản lý tài chính',
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
  {
    key: 'game-management',
    icon: ICONS.gameManagement,
    label: 'Quản lý game',
    children: [
      {
        key: 'games',
        icon: ICONS.games,
        label: 'Danh sách game',
      },
      {
        key: 'game-settings',
        icon: ICONS.gameSettings,
        label: 'Cài đặt game',
      },
      {
        key: 'betting-odds',
        icon: ICONS.bettingOdds,
        label: 'Tỷ lệ cược xổ số',
      },
      {
        key: 'bet-management',
        icon: ICONS.betManagement,
        label: 'Quản lý lệnh cược xổ số',
      },
      {
        key: 'game-results',
        icon: ICONS.gameResults,
        label: 'Kết quả xổ số',
      },
      {
        key: 'xoc-dia-results',
        icon: ICONS.xocdiaResults,
        label: 'Kết quả Xóc Đĩa',
      },
      {
        key: 'sicbo-results',
        icon: ICONS.sicboResults,
        label: 'Kết quả Tài xỉu',
      },
      {
        key: 'xoc-dia-quick-bets',
        icon: ICONS.xocdiaOdds,
        label: 'Tỷ lệ cược Xóc Đĩa',
      },
      {
        key: 'sicbo-quick-bets',
        icon: ICONS.sicboOdds,
        label: 'Tỷ lệ cược Tài xỉu',
      }
    ]
  },
  {
    key: 'agent-portal',
    icon: ICONS.agentPortal,
    label: 'Đại lý',
    children: [
      {
        key: 'agent-overview',
        icon: ICONS.agentOverview,
        label: 'Thống kê tổng quan',
      },
      {
        key: 'agent-analytics',
        icon: ICONS.agentOverviewChart,
        label: 'Thống kê',
      },
      {
        key: 'agent-customer-list',
        icon: ICONS.agentCustomers,
        label: 'Danh sách khách hàng',
      },
      {
        key: 'agent-customer-detail',
        icon: ICONS.agentCustomerDetail,
        label: 'Chi tiết khách hàng',
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
  {
    key: 'staff-portal',
    icon: ICONS.staffPortal,
    label: 'Nhân viên',
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
            key: 'staff-tx1-overview',
            icon: ICONS.staffTx1,
            label: 'Tổng quan bàn TX1',
          }
        ]
      },
      {
        key: 'staff-tx2',
        icon: ICONS.staffTx2,
        label: 'Nhân viên bàn TX2',
        children: [
          {
            key: 'staff-tx2-overview',
            icon: ICONS.staffTx2,
            label: 'Tổng quan bàn TX2',
          }
        ]
      },
      {
        key: 'staff-xd',
        icon: ICONS.staffXd,
        label: 'Nhân viên Xóc Đĩa',
        children: [
          {
            key: 'staff-xd-overview',
            icon: ICONS.staffXd,
            label: 'Tổng quan bàn Xóc Đĩa',
          }
        ]
      }
    ]
  },
  {
    key: 'content-management',
    icon: ICONS.contentManagement,
    label: 'Quản lý nội dung',
    children: [
      {
        key: 'banners',
        icon: ICONS.banners,
        label: 'Banner quảng cáo',
      },
      {
        key: 'news',
        icon: ICONS.news,
        label: 'Tin tức',
      },
      {
        key: 'notifications',
        icon: ICONS.notifications,
        label: 'Thông báo',
      },
      {
        key: 'marquee-notifications',
        icon: ICONS.marquee,
        label: 'Thông báo chạy',
      }
    ]
  },
  {
    key: 'system-management',
    icon: ICONS.systemManagement,
    label: 'Quản lý hệ thống',
    children: [
      {
        key: 'settings',
        icon: ICONS.settings,
        label: 'Cài đặt hệ thống',
      },
      {
        key: 'contact-links',
        icon: ICONS.contactLinks,
        label: 'Links liên hệ',
      },
      {
        key: 'promotions',
        icon: ICONS.promotions,
        label: 'Khuyến mãi',
      },
      {
        key: 'telegram-settings',
        icon: ICONS.telegram,
        label: 'Cài đặt Telegram',
      }
    ]
  }
];
