/**
 * Utilities để format bet data
 * GIỮ NGUYÊN 100% logic từ MienBacGamePage.jsx
 */

/**
 * Format bet type để hiển thị (Miền Bắc)
 */
export const formatBetTypeMienBac = (betType) => {
  const betTypeMap = {
    'loto2s': 'Loto 2s',
    'loto-2-so': 'Loto 2 số',
    'loto-xien-2': 'Loto xiên 2',
    'loto-xien-3': 'Loto xiên 3',
    'loto-xien-4': 'Loto xiên 4',
    'loto-3s': 'Loto 3s',
    'loto-4s': 'Loto 4s',
    'giai-nhat': 'Giải nhất',
    'dac-biet': 'Đặc biệt',
    'dau-dac-biet': 'Đầu Đặc biệt',
    'de-giai-7': 'Đề giải 7',
    'dau-duoi': 'Đầu / đuôi',
    '3s-giai-nhat': '3s giải nhất',
    '3s-giai-6': '3s giải 6',
    '3s-dau-duoi-mien-trung-nam': '3s đầu đuôi',
    '3s-dac-biet': '3s đặc biệt',
    '4s-dac-biet': '4s đặc biệt',
    'loto-truot-4': 'Loto trượt 4',
    'loto-truot-5': 'Loto trượt 5',
    'loto-truot-6': 'Loto trượt 6',
    'loto-truot-7': 'Loto trượt 7',
    'loto-truot-8': 'Loto trượt 8',
    'loto-truot-9': 'Loto trượt 9',
    'loto-truot-10': 'Loto trượt 10'
  };
  return betTypeMap[betType] || betType;
};

/**
 * Format bet type để hiển thị (Miền Trung Nam)
 */
export const formatBetTypeMienTrungNam = (betType) => {
  const betTypeMap = {
    'loto-2-so': 'Loto 2 số',
    'loto-xien-2': 'Loto xiên 2',
    'loto-xien-3': 'Loto xiên 3',
    'loto-xien-4': 'Loto xiên 4',
    'loto-3s': 'Loto 3 số',
    'loto-3-so': 'Loto 3 số',
    'loto-4s': 'Loto 4 số',
    'loto-4-so': 'Loto 4 số',
    'giai-nhat': 'Giải nhất',
    'dac-biet': 'Đặc biệt',
    'dau-dac-biet': 'Đầu đặc biệt',
    'de-giai-7': 'Đề giải 7',
    'de-giai-8': 'Đề giải 8',
    'dau-duoi': 'Đầu / đuôi',
    '3s-giai-7': '3s giải 7',
    '3-so-giai-nhat': '3 số giải nhất',
    '3-so-giai-6': '3 số giải 6',
    '3s-dau-duoi-mien-trung-nam': '3s đầu đuôi',
    '3-so-dau-duoi': '3 số đầu đuôi',
    '3s-dac-biet': '3s đặc biệt',
    '3-so-dac-biet': '3 số đặc biệt',
    '4s-dac-biet': '4s đặc biệt',
    '4-so-dac-biet': '4 số đặc biệt',
    'loto-truot-4': 'Loto trượt 4',
    'loto-truot-5': 'Loto trượt 5',
    'loto-truot-6': 'Loto trượt 6',
    'loto-truot-7': 'Loto trượt 7',
    'loto-truot-8': 'Loto trượt 8',
    'loto-truot-9': 'Loto trượt 9',
    'loto-truot-10': 'Loto trượt 10'
  };
  return betTypeMap[betType] || betType;
};

/**
 * Format selected numbers để hiển thị
 */
export const formatSelectedNumbers = (selectedNumbers) => {
  if (Array.isArray(selectedNumbers)) {
    return selectedNumbers;
  }
  try {
    return JSON.parse(selectedNumbers || '[]');
  } catch {
    return [];
  }
};

