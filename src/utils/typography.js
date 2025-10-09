// ============================================
// TYPOGRAPHY SYSTEM - Hệ thống chữ tập trung
// Chỉ cần thay đổi ở đây là đồng bộ toàn bộ ứng dụng
// ============================================

import { THEME_COLORS } from './theme';

// Font Family
export const FONT_FAMILY = {
  primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  secondary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  monospace: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
  sidebar: 'Tahoma, "Microsoft Sans Serif", Arial, sans-serif', // Font cho sidebar
};

// Font Size - Tăng cỡ chữ để dễ đọc hơn
export const FONT_SIZE = {
  // Extra Small
  xs: '12px',      // Chú thích rất nhỏ
  xs2: '13px',     // Chú thích nhỏ
  
  // Small  
  sm: '14px',      // Label, caption nhỏ
  sm2: '15px',     // Text phụ
  
  // Base - TEXT CHÍNH
  base: '16px',    // Text chuẩn cho body, form ⭐ TĂNG TỪ 14px → 16px
  base2: '17px',   // Text chuẩn lớn hơn ⭐
  
  // Medium
  md: '18px',      // Heading nhỏ, button text
  md2: '20px',     // Heading nhỏ nổi bật
  
  // Large
  lg: '22px',      // Heading vừa
  lg2: '24px',     // Heading vừa nổi bật
  
  // Extra Large
  xl: '28px',      // Heading lớn
  xl2: '32px',     // Heading lớn nổi bật
  
  // 2X Large
  '2xl': '36px',   // Heading rất lớn
  '2xl2': '40px',  // Heading rất lớn nổi bật
  
  // 3X Large
  '3xl': '44px',   // Display heading
  '3xl2': '52px',  // Display heading lớn
  
  // 4X Large (cho banner, hero)
  '4xl': '60px',
  '5xl': '68px',
};

// Font Weight
export const FONT_WEIGHT = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,      // Text thường
  medium: 500,      // Text nhấn mạnh nhẹ
  semibold: 600,    // Heading, button
  bold: 700,        // Heading quan trọng
  extrabold: 800,   // Display heading
  black: 900,       // Hero text
};

// Line Height
export const LINE_HEIGHT = {
  none: 1,
  tight: 1.25,      // Heading
  snug: 1.375,      // Heading phụ
  normal: 1.5,      // Body text chuẩn
  relaxed: 1.625,   // Paragraph
  loose: 2,         // Text có khoảng cách lớn
};

// Letter Spacing
export const LETTER_SPACING = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
};

// Text Colors - Liên kết với THEME_COLORS
export const TEXT_COLORS = {
  // Primary text
  primary: THEME_COLORS.textPrimary,        // #1f2937 - Text chính
  secondary: THEME_COLORS.textSecondary,    // #6B7280 - Text phụ
  tertiary: THEME_COLORS.textLight,         // #9ca3af - Text nhạt
  
  // Brand colors
  brand: THEME_COLORS.primary,              // #D30102 - Màu brand
  brandLight: THEME_COLORS.secondaryLight,  // #B2C0D1 - Màu brand nhạt
  
  // Semantic colors
  success: THEME_COLORS.success,            // Xanh lá
  warning: THEME_COLORS.warning,            // Vàng
  error: THEME_COLORS.error,                // Đỏ
  info: THEME_COLORS.info,                  // Xanh dương
  
  // Special
  white: '#ffffff',
  black: '#000000',
  muted: '#6b7280',
  disabled: '#d1d5db',
};

// ============================================
// TYPOGRAPHY PRESETS - Sẵn sàng sử dụng
// ============================================

// Headings
export const HEADING_STYLES = {
  h1: {
    fontSize: FONT_SIZE['3xl'],
    fontWeight: FONT_WEIGHT.bold,
    lineHeight: LINE_HEIGHT.tight,
    color: TEXT_COLORS.primary,
    fontFamily: FONT_FAMILY.primary,
  },
  h2: {
    fontSize: FONT_SIZE['2xl'],
    fontWeight: FONT_WEIGHT.bold,
    lineHeight: LINE_HEIGHT.tight,
    color: TEXT_COLORS.primary,
    fontFamily: FONT_FAMILY.primary,
  },
  h3: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.semibold,
    lineHeight: LINE_HEIGHT.snug,
    color: TEXT_COLORS.primary,
    fontFamily: FONT_FAMILY.primary,
  },
  h4: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    lineHeight: LINE_HEIGHT.snug,
    color: TEXT_COLORS.primary,
    fontFamily: FONT_FAMILY.primary,
  },
  h5: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
    lineHeight: LINE_HEIGHT.normal,
    color: TEXT_COLORS.primary,
    fontFamily: FONT_FAMILY.primary,
  },
  h6: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.medium,
    lineHeight: LINE_HEIGHT.normal,
    color: TEXT_COLORS.primary,
    fontFamily: FONT_FAMILY.primary,
  },
};

// Body Text
export const BODY_STYLES = {
  large: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.normal,
    lineHeight: LINE_HEIGHT.relaxed,
    color: TEXT_COLORS.primary,
    fontFamily: FONT_FAMILY.primary,
  },
  base: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.normal,
    lineHeight: LINE_HEIGHT.normal,
    color: TEXT_COLORS.primary,
    fontFamily: FONT_FAMILY.primary,
  },
  small: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.normal,
    lineHeight: LINE_HEIGHT.normal,
    color: TEXT_COLORS.secondary,
    fontFamily: FONT_FAMILY.primary,
  },
};

// Button Text
export const BUTTON_TEXT_STYLES = {
  large: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    lineHeight: LINE_HEIGHT.none,
    letterSpacing: LETTER_SPACING.wide,
    fontFamily: FONT_FAMILY.primary,
  },
  medium: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.semibold,
    lineHeight: LINE_HEIGHT.none,
    letterSpacing: LETTER_SPACING.normal,
    fontFamily: FONT_FAMILY.primary,
  },
  small: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    lineHeight: LINE_HEIGHT.none,
    letterSpacing: LETTER_SPACING.normal,
    fontFamily: FONT_FAMILY.primary,
  },
};

// Label & Caption
export const LABEL_STYLES = {
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    lineHeight: LINE_HEIGHT.normal,
    color: TEXT_COLORS.secondary,
    fontFamily: FONT_FAMILY.primary,
  },
  caption: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.normal,
    lineHeight: LINE_HEIGHT.normal,
    color: TEXT_COLORS.tertiary,
    fontFamily: FONT_FAMILY.primary,
  },
  helper: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.normal,
    lineHeight: LINE_HEIGHT.normal,
    color: TEXT_COLORS.muted,
    fontFamily: FONT_FAMILY.primary,
  },
};

// Menu & Navigation
export const MENU_STYLES = {
  menuItem: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.medium,
    lineHeight: LINE_HEIGHT.normal,
    color: TEXT_COLORS.secondary,
    fontFamily: FONT_FAMILY.primary,
  },
  menuItemActive: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.semibold,
    lineHeight: LINE_HEIGHT.normal,
    color: TEXT_COLORS.brand,
    fontFamily: FONT_FAMILY.primary,
  },
  submenuItem: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.normal,
    lineHeight: LINE_HEIGHT.normal,
    color: TEXT_COLORS.secondary,
    fontFamily: FONT_FAMILY.primary,
  },
};

// Sidebar specific
export const SIDEBAR_STYLES = {
  menuLabel: {
    fontSize: FONT_SIZE.base2,        // 17px
    fontWeight: FONT_WEIGHT.medium,   // 500
    lineHeight: LINE_HEIGHT.normal,   // 1.5
    color: TEXT_COLORS.brandLight,    // #B2C0D1
    fontFamily: FONT_FAMILY.sidebar,  // Tahoma
  },
  menuLabelActive: {
    fontSize: FONT_SIZE.base2,
    fontWeight: FONT_WEIGHT.bold,     // 700 - đậm hơn khi active
    lineHeight: LINE_HEIGHT.normal,
    color: TEXT_COLORS.brand,         // #D30102 - đỏ
    fontFamily: FONT_FAMILY.sidebar,  // Tahoma
  },
  gameCategoryActive: {
    fontSize: FONT_SIZE.base2,
    fontWeight: FONT_WEIGHT.bold,
    lineHeight: LINE_HEIGHT.normal,
    color: THEME_COLORS.primary,      // Màu đỏ cho game categories
    fontFamily: FONT_FAMILY.sidebar,
  },
};

// Header/Navbar specific
export const NAVBAR_STYLES = {
  username: {
    fontSize: FONT_SIZE.md,           // 16px
    fontWeight: FONT_WEIGHT.semibold, // 600
    lineHeight: LINE_HEIGHT.normal,
    color: TEXT_COLORS.brandLight,
    fontFamily: FONT_FAMILY.primary,
  },
  balance: {
    fontSize: FONT_SIZE.sm,           // 12px
    fontWeight: FONT_WEIGHT.normal,
    lineHeight: LINE_HEIGHT.normal,
    color: TEXT_COLORS.muted,
    fontFamily: FONT_FAMILY.primary,
  },
  navButton: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    lineHeight: LINE_HEIGHT.none,
    fontFamily: FONT_FAMILY.primary,
  },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Get typography style theo variant
export const getTypographyStyle = (variant) => {
  const allStyles = {
    ...HEADING_STYLES,
    ...BODY_STYLES,
    ...BUTTON_TEXT_STYLES,
    ...LABEL_STYLES,
    ...MENU_STYLES,
    ...SIDEBAR_STYLES,
    ...NAVBAR_STYLES,
  };
  
  return allStyles[variant] || BODY_STYLES.base;
};

// Tạo class string từ typography preset
export const getTypographyClass = (variant) => {
  const style = getTypographyStyle(variant);
  return Object.entries(style)
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ');
};

// Export all
export default {
  FONT_FAMILY,
  FONT_SIZE,
  FONT_WEIGHT,
  LINE_HEIGHT,
  LETTER_SPACING,
  TEXT_COLORS,
  HEADING_STYLES,
  BODY_STYLES,
  BUTTON_TEXT_STYLES,
  LABEL_STYLES,
  MENU_STYLES,
  SIDEBAR_STYLES,
  NAVBAR_STYLES,
  getTypographyStyle,
  getTypographyClass,
};

