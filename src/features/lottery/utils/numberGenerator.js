/**
 * Utilities để generate số cho các loại game
 * GIỮ NGUYÊN 100% logic từ MienBacGamePage.jsx
 */

/**
 * Generate danh sách số cho loto 2 số (00-99)
 */
export const generateLoto2sNumbers = () => {
  return Array.from({ length: 100 }, (_, i) => i.toString().padStart(2, '0'));
};

/**
 * Generate danh sách số cho loto 3 số (000-999)
 */
export const generateLoto3sNumbers = () => {
  return Array.from({ length: 1000 }, (_, i) => i.toString().padStart(3, '0'));
};

/**
 * Generate danh sách số cho đầu/đuôi (00-99) - CHỈNH SỬA: dùng 2 chữ số
 */
export const generateDauDuoiNumbers = () => {
  return Array.from({ length: 100 }, (_, i) => i.toString().padStart(2, '0'));
};

/**
 * Lấy danh sách số dựa trên loại game
 */
export const getNumbersForGameType = (gameType) => {
  // Loto 3 số: 000-999
  if (gameType === 'loto-3s' || gameType === 'loto3s' || gameType === '3s-giai-nhat' || gameType === '3s-giai-6' || gameType === '3s-dau-duoi' || gameType === '3s-dac-biet' || gameType === '3s-giai-7') {
    return generateLoto3sNumbers();
  }
  
  // Đầu/đuôi: 0-9
  if (gameType === 'dau-duoi') {
    return generateDauDuoiNumbers();
  }
  
  // Mặc định: Loto 2 số (00-99)
  return generateLoto2sNumbers();
};

/**
 * Format số để hiển thị
 */
export const formatNumber = (number, gameType) => {
  if (gameType === 'loto-4s' || gameType === 'loto4s' || gameType === '4s-dac-biet') {
    return number.padStart(4, '0');
  }
  if (gameType === 'loto-3s' || gameType === 'loto3s' || gameType === '3s-giai-nhat' || gameType === '3s-giai-6' || gameType === '3s-dau-duoi' || gameType === '3s-dac-biet' || gameType === '3s-giai-7') {
    return number.padStart(3, '0');
  }
  return number.padStart(2, '0');
};

