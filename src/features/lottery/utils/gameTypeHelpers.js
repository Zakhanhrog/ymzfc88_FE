/**
 * Helper functions cho game types
 * GIỮ NGUYÊN 100% logic
 */

/**
 * Game types cho Miền Bắc
 */
export const MIEN_BAC_GAME_TYPES = [
  { id: 'loto2s', name: 'Loto2s', description: 'Lô 2 số' },
  { id: 'loto-xien-2', name: 'Loto xiên 2', description: 'Xiên 2 số' },
  { id: 'loto-xien-3', name: 'Loto xiên 3', description: 'Xiên 3 số' },
  { id: 'loto-xien-4', name: 'Loto xiên 4', description: 'Xiên 4 số' },
  { id: 'loto-3s', name: 'Loto 3s', description: 'Lô 3 số' },
  { id: 'loto-4s', name: 'Loto 4s', description: 'Lô 4 số' },
  { id: 'giai-nhat', name: 'Giải nhất', description: 'Đề giải nhất' },
  { id: 'de-giai-7', name: 'Đề giải 7', description: 'Đề giải 7 (× 4)' },
  { id: 'dac-biet', name: 'Đặc biệt', description: 'Đề đặc biệt' },
  { id: 'dau-dac-biet', name: 'Đầu Đặc biệt', description: 'Đề đầu đặc biệt' },
  { id: 'dau-duoi', name: 'Đầu / đuôi', description: 'Đầu đuôi' },
  { id: '3s-giai-nhat', name: '3s giải nhất', description: '3 số giải nhất' },
  { id: '3s-giai-6', name: '3s giải 6', description: '3 số giải 6 (× 3)' },
  { id: '3s-dau-duoi', name: '3s đầu đuôi', description: '3 số đầu đuôi' },
  { id: '3s-dac-biet', name: '3s đặc biệt', description: '3 số đặc biệt' },
  { id: '4s-dac-biet', name: '4s đặc biệt', description: '4 số đặc biệt' },
  { id: 'loto-truot-4', name: 'Loto trượt 4', description: 'Lô trượt 4' },
  { id: 'loto-truot-8', name: 'Loto trượt 8', description: 'Lô trượt 8' },
  { id: 'loto-truot-10', name: 'Loto trượt 10', description: 'Lô trượt 10' }
];

/**
 * Game types cho Miền Trung Nam
 */
export const MIEN_TRUNG_NAM_GAME_TYPES = [
  { id: 'loto-2-so', name: 'Loto 2 số', description: 'Lô 2 số' },
  { id: 'loto-xien-2', name: 'Loto xiên 2', description: 'Xiên 2 số' },
  { id: 'loto-xien-3', name: 'Loto xiên 3', description: 'Xiên 3 số' },
  { id: 'loto-xien-4', name: 'Loto xiên 4', description: 'Xiên 4 số' },
  { id: 'loto-3s', name: 'Loto 3s', description: 'Lô 3 số' },
  { id: 'loto-4s', name: 'Loto 4s', description: 'Lô 4 số' },
  { id: 'dac-biet', name: 'Đặc biệt', description: 'Đề đặc biệt' },
  { id: 'dau-duoi', name: 'Đầu / đuôi', description: 'Đầu đuôi' },
  { id: 'dau-dac-biet', name: 'Đầu đặc biệt', description: 'Đề đầu đặc biệt' },
  { id: 'de-giai-8', name: 'Đề giải 8', description: 'Đề giải 8' },
  { id: '3s-giai-7', name: '3s giải 7', description: '3 số giải 7' },
  { id: '3s-dau-duoi', name: '3s đầu đuôi', description: '3 số đầu đuôi' },
  { id: '3s-dac-biet', name: '3s đặc biệt', description: '3 số đặc biệt' },
  { id: '4s-dac-biet', name: '4s đặc biệt', description: '4 số đặc biệt' },
  { id: 'loto-truot-4', name: 'Loto trượt 4', description: 'Lô trượt 4' },
  { id: 'loto-truot-8', name: 'Loto trượt 8', description: 'Lô trượt 8' },
  { id: 'loto-truot-10', name: 'Loto trượt 10', description: 'Lô trượt 10' }
];

/**
 * Bet amount multipliers
 */
export const BET_MULTIPLIERS = [
  { value: 1, label: '1X', color: 'bg-purple-500' },
  { value: 3, label: '3X', color: 'bg-red-500' },
  { value: 5, label: '5X', color: 'bg-orange-500' },
  { value: 10, label: '10X', color: 'bg-green-500' }
];

/**
 * Kiểm tra xem game type có phải là input only không (không có chọn nhanh)
 */
export const isInputOnlyGameType = (gameType) => {
  return gameType === 'loto-4s' || gameType === 'loto4s' || gameType === '4s-dac-biet';
};

/**
 * Kiểm tra xem game type có phải là xiên không
 */
export const isXienGameType = (gameType) => {
  return gameType === 'loto-xien-2' || gameType === 'loto-xien-3' || gameType === 'loto-xien-4';
};

/**
 * Lấy kích thước cụm cho game type xiên
 */
export const getXienGroupSize = (gameType) => {
  if (gameType === 'loto-xien-2') return 2;
  if (gameType === 'loto-xien-3') return 3;
  if (gameType === 'loto-xien-4') return 4;
  return 0;
};

