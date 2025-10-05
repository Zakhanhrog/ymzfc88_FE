// Theme colors configuration - Chỉ cần thay đổi ở đây là đồng bộ toàn bộ ứng dụng
export const THEME_COLORS = {
  // Main colors
  primary: '#D30102',
  primaryHover: '#E90C17',
  primaryLight: '#FA230D',
  primaryLighter: '#FEF2F2',
  
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
  textGray: '#6B7280',
  borderGray: '#e5e7eb',
  bgGray: '#f9fafb',
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
