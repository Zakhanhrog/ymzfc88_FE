import {
  DashboardOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  IdcardOutlined,
  UserSwitchOutlined,
  SolutionOutlined,
  ApartmentOutlined,
  ClusterOutlined,
  DollarCircleOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  BankOutlined,
  WalletOutlined,
  AppstoreOutlined,
  SettingOutlined,
  FundProjectionScreenOutlined,
  HistoryOutlined,
  TrophyOutlined,
  LineChartOutlined,
  TableOutlined,
  CalendarOutlined,
  NotificationOutlined,
  SoundOutlined,
  SlidersOutlined,
  PhoneOutlined,
  GiftOutlined,
  ThunderboltOutlined,
  ReadOutlined,
  FileTextOutlined,
  TagsOutlined,
  BarChartOutlined,
  ShopOutlined,
  ExperimentOutlined,
  CustomerServiceOutlined,
  FormOutlined,
  FundOutlined,
  PictureOutlined,
  BellOutlined
} from '@ant-design/icons';

const ICONS = {
  dashboard: DashboardOutlined,
  analytics: PieChartOutlined,
  userManagement: TeamOutlined,
  users: UserOutlined,
  kyc: SafetyCertificateOutlined,
  userRoles: IdcardOutlined,
  staff: UserSwitchOutlined,
  agent: SolutionOutlined,
  financialManagement: DollarCircleOutlined,
  deposits: ArrowDownOutlined,
  withdraws: ArrowUpOutlined,
  paymentMethods: BankOutlined,
  depositGateway: ThunderboltOutlined,
  points: WalletOutlined,
  gameManagement: AppstoreOutlined,
  games: TrophyOutlined,
  gameSettings: SettingOutlined,
  bettingOdds: LineChartOutlined,
  betManagement: TableOutlined,
  gameResults: CalendarOutlined,
  xocdiaResults: CalendarOutlined,
  sicboResults: CalendarOutlined,
  xocdiaOdds: LineChartOutlined,
  sicboOdds: LineChartOutlined,
  contentManagement: NotificationOutlined,
  banners: PictureOutlined,
  streamConfigs: ThunderboltOutlined,
  news: ReadOutlined,
  notifications: BellOutlined,
  marquee: SoundOutlined,
  systemManagement: SlidersOutlined,
  settings: SettingOutlined,
  contactLinks: PhoneOutlined,
  promotions: GiftOutlined,
  telegram: CustomerServiceOutlined,
  agentPortal: ClusterOutlined,
  agentOverview: DashboardOutlined,
  agentOverviewChart: BarChartOutlined,
  agentCustomers: TeamOutlined,
  agentCustomerDetail: SolutionOutlined,
  agentInvite: TagsOutlined,
  agentCommission: DollarCircleOutlined,
  agentReport: FundOutlined,
  staffPortal: ApartmentOutlined,
  staffMkt: ShopOutlined,
  staffXnk: BankOutlined,
  staffTx1: ExperimentOutlined,
  staffTx2: ExperimentOutlined,
  staffXd: ExperimentOutlined,
  staffUsers: TeamOutlined,
  staffFinance: DollarCircleOutlined,
  staffGames: AppstoreOutlined
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
        key: 'deposit-gateway-configs',
        icon: ICONS.depositGateway,
        label: 'Cấu hình cổng nạp tự động',
      },
      {
        key: 'points-management',
        icon: ICONS.points,
        label: 'Quản lý điểm',
      }
    ]
  },
  // 4. QUẢN LÝ GAME - Sắp xếp theo thứ tự: danh sách -> cài đặt -> tỷ lệ cược -> quản lý cược -> kết quả -> lịch sử
  {
    key: 'game-management',
    icon: ICONS.gameManagement,
    label: 'QUẢN LÝ GAME',
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
      // Tỷ lệ cược
      {
        key: 'betting-odds',
        icon: ICONS.bettingOdds,
        label: 'Tỷ lệ cược xổ số',
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
      },
      // Quản lý cược
      {
        key: 'bet-management',
        icon: ICONS.betManagement,
        label: 'Quản lý lệnh cược xổ số',
      },
      {
        key: 'user-game-bets',
        icon: ICONS.points,
        label: 'Báo cáo thắng/thua',
      },
      // Kết quả game
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
      // Lịch sử
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
