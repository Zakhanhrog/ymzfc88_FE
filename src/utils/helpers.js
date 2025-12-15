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

/**
 * Format points (1000 = 1 điểm)
 * Converts amount in VND to points and formats it
 * Format: dấu chấm (.) cho hàng nghìn, dấu phẩy (,) cho phần thập phân
 */
export const formatPoints = (amount) => {
  if (!amount && amount !== 0) return '0 điểm';
  
  // Convert VND to points: 1000 VND = 1 điểm
  const points = Number(amount) / 1000;
  
  // Format with Vietnamese locale - đảm bảo dấu chấm cho hàng nghìn, dấu phẩy cho thập phân
  const formatted = new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: true
  }).format(points);
  
  return formatted + ' điểm';
};

/**
 * Format points display (value is already in points, no conversion needed)
 * Use this when the value from backend is already in points
 * Format: dấu chấm (.) cho hàng nghìn, dấu phẩy (,) cho phần thập phân
 */
export const formatPointsDisplay = (points) => {
  if (!points && points !== 0) return '0 điểm';
  
  // Value is already in points, just format it
  const formatted = new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: true
  }).format(Number(points));
  
  return formatted + ' điểm';
};

/**
 * Format points only (no "điểm" suffix)
 * Use this when the value from backend is already in points
 * Format: dấu chấm (.) cho hàng nghìn, dấu phẩy (,) cho phần thập phân
 */
export const formatPointsOnly = (points) => {
  if (!points && points !== 0) return '0';
  const formatter = new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: true
  });
  return formatter.format(Number(points ?? 0));
};

/**
 * Format VND to points (dividing by 1000) without "điểm" suffix
 * Format: dấu chấm (.) cho hàng nghìn, dấu phẩy (,) cho phần thập phân
 */
export const formatPointsFromVND = (amount) => {
  if (!amount && amount !== 0) return '0';
  const points = Number(amount) / 1000;
  const formatter = new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: true
  });
  return formatter.format(points);
};
