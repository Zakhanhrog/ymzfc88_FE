/**
 * Format date to Vietnamese locale
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format currency to Vietnamese Dong
 */
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '0 VNĐ';
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format (Vietnamese)
 */
export const isValidPhoneNumber = (phone) => {
  const phoneRegex = /(0[3|5|7|8|9])+([0-9]{8})\b/;
  return phoneRegex.test(phone);
};

/**
 * Generate random ID
 */
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Calculate betting odds
 */
export const calculatePayout = (amount, odds) => {
  if (!amount || !odds) return 0;
  return amount * odds;
};

/**
 * Get time difference in human readable format
 */
export const getTimeAgo = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);
  
  if (diffInSeconds < 60) return 'Vừa xong';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
  return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
};
