import { THEME_COLORS } from '../../../utils/theme';

// Special menu items (with images) - Phần trên cùng
export const specialMenuItems = [
  { key: 'daily', label: 'Mỗi Ngày', image: '/sm-check.png' },
  { key: 'lucky-wheel', label: 'Vòng Quay May Mắn', image: '/sm-wheel.png' },
  { key: 'reward-results', label: 'Kết Quả Trao Thưởng', image: '/sm-mb.webp' },
  { key: 'red-envelope', label: 'Phong Bì Đỏ', image: '/sm-red.png' },
  { key: 'deposit', label: 'Nạp Tiền', image: '/icon-deposit.png' }
];

// Game categories - GỘP TẤT CẢ VÀO ĐÂY (có màu đỏ khi active)
export const gameCategories = [
  { key: 'HOT', label: 'HOT GAMES', icon: 'mdi:fire', iconColor: THEME_COLORS.secondary },
  { key: 'THETHAO', label: 'THỂ THAO', icon: 'mdi:soccer', iconColor: THEME_COLORS.secondary },
  { key: 'SONGBAI', label: 'SÒNG BÀI', icon: 'mdi:cards-playing', iconColor: THEME_COLORS.secondary },
  { key: 'SLOTS', label: 'SLOTS', icon: 'mdi:slot-machine', iconColor: THEME_COLORS.secondary },
  { key: 'DAGA', label: 'ĐÁ GÀ', icon: 'game-icons:rooster', iconColor: THEME_COLORS.secondary },
  { key: 'GAMEBAI', label: 'GAME BÀI', icon: 'mdi:cards', iconColor: THEME_COLORS.secondary },
  { key: 'RACING', label: 'RACING BALL', icon: 'mdi:basketball', iconColor: THEME_COLORS.secondary },
  // Gộp thêm các mục khác vào đây
  { key: 'lottery', label: 'XỔ SỐ', icon: 'mdi:dice-multiple', iconColor: THEME_COLORS.secondary },
  { key: 'esports', label: 'E-SPORTS', icon: 'mdi:controller', iconColor: THEME_COLORS.secondary },
  { key: 'promotions', label: 'KHUYẾN MÃI', icon: 'mdi:gift', iconColor: THEME_COLORS.secondary },
  { key: 'vip', label: 'VIP', icon: 'mdi:crown', iconColor: THEME_COLORS.secondary },
  { key: 'app', label: 'APP', icon: 'mdi:cellphone', iconColor: THEME_COLORS.secondary },
  { key: 'external-agent', label: 'ĐẠI LÝ NGOÀI', icon: 'mdi:swap-horizontal', iconColor: THEME_COLORS.secondary },
  { key: 'about', label: 'Về Chúng Tôi', icon: 'mdi:lightbulb', iconColor: THEME_COLORS.secondary },
  { key: 'contact', label: 'Liên Hệ', icon: 'mdi:headset', iconColor: THEME_COLORS.secondary }
];

