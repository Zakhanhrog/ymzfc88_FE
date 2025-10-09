// ============================================
// DESIGN SYSTEM - Hệ thống thiết kế tập trung
// Chỉ cần thay đổi ở đây là đồng bộ toàn bộ ứng dụng
// ============================================

// Theme colors configuration
export const THEME_COLORS = {
  // Main colors
  primary: '#D30102',
  primaryHover: '#E90C17',
  primaryLight: '#FA230D',
  primaryLighter: '#FEF2F2',
  primaryDark: '#B20101',
  
  // Gradients
  primaryGradient: 'linear-gradient(135deg, #D30102 0%, #FA230D 100%)',
  bannerGradient: 'linear-gradient(135deg, #D30102 0%, #E90C17 50%, #FF1744 100%)',
  
  // Sidebar icon gradients
  iconGradient1: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  iconGradient2: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  iconGradient3: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  iconGradient4: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  iconGradient5: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
  
  // Secondary colors
  secondary: '#8b9dc3',
  secondaryHover: '#7a8bb3',
  secondaryLight: '#B2C0D1',
  
  // Neutral colors
  white: '#ffffff',
  black: '#000000',
  textPrimary: '#1f2937',
  textSecondary: '#6B7280',
  textLight: '#9ca3af',
  borderGray: '#e5e7eb',
  borderLight: '#f3f4f6',
  bgGray: '#f9fafb',
  bgLight: '#f3f4f6',
  bgWhite: '#ffffff',
  
  // Status colors
  success: '#10b981',
  successLight: '#d1fae5',
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  error: '#ef4444',
  errorLight: '#fee2e2',
  info: '#3b82f6',
  infoLight: '#dbeafe',
};

// Spacing system (px)
export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  xxl: '32px',
  xxxl: '48px',
};

// Border radius
export const BORDER_RADIUS = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  xxl: '20px',
  round: '50px',
  circle: '50%',
};

// Shadows
export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
};

// Typography
export const TYPOGRAPHY = {
  fontFamily: {
    base: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
    xxxl: '32px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Transitions
export const TRANSITIONS = {
  fast: 'all 0.15s ease',
  normal: 'all 0.3s ease',
  slow: 'all 0.5s ease',
};

// Layout dimensions
export const LAYOUT = {
  headerHeight: '64px',
  sidebarWidth: '280px',
  sidebarCollapsedWidth: '64px',
  adminSidebarWidth: '280px',
  adminSidebarCollapsedWidth: '80px',
  mobileBottomNavHeight: '80px',
  maxContentWidth: '1280px',
};

// Z-index levels
export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

// Button styles
export const getButtonStyle = (variant = 'primary') => {
  const styles = {
    primary: {
      backgroundColor: THEME_COLORS.primary,
      borderColor: THEME_COLORS.primary,
      color: 'white',
      hover: {
        backgroundColor: THEME_COLORS.primaryHover,
      }
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: THEME_COLORS.primary,
      color: THEME_COLORS.primary,
      hover: {
        backgroundColor: THEME_COLORS.primaryLighter,
        color: THEME_COLORS.primaryHover,
      }
    },
    link: {
      color: THEME_COLORS.primary,
    }
  };
  
  return styles[variant] || styles.primary;
};

// Avatar style
export const getAvatarStyle = () => ({
  backgroundColor: THEME_COLORS.primary,
});

// Logo gradient style
export const getLogoStyle = () => ({
  background: THEME_COLORS.primaryGradient,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
});

// Input icon style
export const getInputIconStyle = () => ({
  color: THEME_COLORS.primary,
});

// Form button styles with hover
export const getFormButtonStyle = () => ({
  base: {
    borderRadius: '16px',
    border: 'none',
    backgroundColor: THEME_COLORS.primary,
  },
  hover: {
    backgroundColor: THEME_COLORS.primaryHover,
  }
});

export default THEME_COLORS;
