/**
 * Province Mapping Utilities
 * Map tên tỉnh Frontend → Backend và lấy lịch quay
 */

/**
 * Map tên tỉnh Frontend (có dấu) → Backend (không dấu, lowercase)
 * Dựa trên provincesData.js
 */
export const PROVINCE_NAME_MAPPING = {
  // Miền Trung
  'Phú Yên': 'phuyen',
  'TT Huế': 'thuathienhue',
  'Đắk Lắk': 'daklak',
  'Quảng Nam': 'quangnam',
  'Đà Nẵng': 'danang',
  'Khánh Hòa': 'khanhhoa',
  'Bình Định': 'binhdinh',
  'Quảng Bình': 'quangbinh',
  'Quảng Trị': 'quangtri',
  'Gia Lai': 'gialai',
  'Ninh Thuận': 'ninhthuan',
  'Đắk Nông': 'daknong',
  'Quảng Ngãi': 'quangngai',
  'Kon Tum': 'kontum',
  
  // Miền Nam
  'Cà Mau': 'camau',
  'Đồng Tháp': 'dongthap',
  'TP HCM': 'hcm',
  'Bạc Liêu': 'baclieu',
  'Bến Tre': 'bentre',
  'Vũng Tàu': 'vungtau',
  'Cần Thơ': 'cantho',
  'Đồng Nai': 'dongnai',
  'Sóc Trăng': 'soctrang',
  'An Giang': 'angiang',
  'Bình Thuận': 'binhthuan',
  'Tây Ninh': 'tayninh',
  'Bình Dương': 'binhduong',
  'Trà Vinh': 'travinh',
  'Vĩnh Long': 'vinhlong',
  'Bình Phước': 'binhphuoc',
  'Hậu Giang': 'haugiang',
  'Long An': 'longan',
  'Đà Lạt': 'dalat',
  'Kiên Giang': 'kiengiang',
  'Tiền Giang': 'tiengiang'
};

/**
 * Normalize province name (Frontend → Backend)
 * @param {string} provinceName - Tên tỉnh từ Frontend (VD: "Gia Lai", "Khánh Hòa", "Xổ Số Gia Lai")
 * @returns {string} Tên tỉnh chuẩn hóa (VD: "gialai", "khanhhoa")
 */
export const normalizeProvinceName = (provinceName) => {
  if (!provinceName) return null;
  
  // Loại bỏ "Xổ Số" prefix nếu có
  let cleanName = provinceName.replace(/^Xổ\s*Số\s*/i, '').trim();
  
  const normalized = PROVINCE_NAME_MAPPING[cleanName];
  if (!normalized) {
    console.warn(`Province name "${provinceName}" (cleaned: "${cleanName}") not found in mapping`);
    return cleanName.toLowerCase().replace(/\s+/g, '');
  }
  
  return normalized;
};

/**
 * Lịch quay xổ số theo ngày trong tuần
 * Key: 0=CN, 1=T2, 2=T3, 3=T4, 4=T5, 5=T6, 6=T7
 * Value: Array of province names (Backend format)
 */
export const PROVINCE_SCHEDULE = {
  1: ['phuyen', 'thuathienhue', 'camau', 'dongthap', 'hcm'], // Thứ 2
  2: ['daklak', 'quangnam', 'baclieu', 'bentre', 'vungtau'], // Thứ 3
  3: ['danang', 'khanhhoa', 'cantho', 'dongnai', 'soctrang'], // Thứ 4
  4: ['binhdinh', 'quangbinh', 'quangtri', 'angiang', 'binhthuan', 'tayninh'], // Thứ 5
  5: ['gialai', 'ninhthuan', 'binhduong', 'travinh', 'vinhlong'], // Thứ 6
  6: ['danang', 'daknong', 'quangngai', 'binhphuoc', 'haugiang', 'hcm', 'longan'], // Thứ 7
  0: ['khanhhoa', 'kontum', 'thuathienhue', 'dalat', 'kiengiang', 'tiengiang'] // Chủ Nhật
};

/**
 * Lấy danh sách tỉnh quay theo ngày trong tuần
 * @param {number} dayOfWeek - 0 (Sunday) đến 6 (Saturday)
 * @returns {string[]} Array of province names (Backend format)
 */
export const getProvincesForDay = (dayOfWeek) => {
  return PROVINCE_SCHEDULE[dayOfWeek] || [];
};

/**
 * Lấy lịch quay của một tỉnh cụ thể
 * @param {string} provinceName - Tên tỉnh (Backend format: "gialai", "khanhhoa")
 * @returns {number[]} Array of dayOfWeek (0-6)
 */
export const getProvinceScheduleDays = (provinceName) => {
  const schedule = [];
  
  for (const [day, provinces] of Object.entries(PROVINCE_SCHEDULE)) {
    if (provinces.includes(provinceName)) {
      schedule.push(parseInt(day));
    }
  }
  
  return schedule;
};

/**
 * Kiểm tra ngày cụ thể có phải ngày quay của tỉnh không
 * @param {string} provinceName - Tên tỉnh (Backend format)
 * @param {Date} date - Ngày cần check
 * @returns {boolean}
 */
export const isProvinceDrawDay = (provinceName, date) => {
  const dayOfWeek = date.getDay(); // 0-6
  const provincesThatDay = getProvincesForDay(dayOfWeek);
  return provincesThatDay.includes(provinceName);
};

/**
 * Tìm ngày quay TIẾP THEO của tỉnh (từ ngày chỉ định)
 * @param {string} provinceName - Tên tỉnh (Backend format)
 * @param {Date} fromDate - Ngày bắt đầu tìm (default: hôm nay)
 * @returns {Date} Ngày quay tiếp theo
 */
export const getNextDrawDate = (provinceName, fromDate = new Date()) => {
  const schedule = getProvinceScheduleDays(provinceName);
  
  if (schedule.length === 0) {
    // Nếu không có lịch, mặc định là ngày mai
    const tomorrow = new Date(fromDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }
  
  // Tìm ngày quay gần nhất trong tương lai
  let currentDate = new Date(fromDate);
  currentDate.setDate(currentDate.getDate() + 1); // Bắt đầu từ ngày mai
  
  for (let i = 0; i < 7; i++) {
    const dayOfWeek = currentDate.getDay();
    if (schedule.includes(dayOfWeek)) {
      return currentDate;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Fallback: trả về 7 ngày sau
  const fallback = new Date(fromDate);
  fallback.setDate(fallback.getDate() + 7);
  return fallback;
};

/**
 * Kiểm tra xem có cần khóa giờ cược không (dựa trên lịch tỉnh)
 * Logic: Chỉ khóa giờ nếu HÔM NAY là ngày quay của tỉnh đó
 * 
 * @param {string} provinceName - Tên tỉnh (Backend format)
 * @param {boolean} isMienTrung - True nếu là Miền Trung
 * @returns {object} { shouldLock, lockStartTime, lockEndTime, resultDate }
 */
export const checkBettingTimeLock = (provinceName, isMienTrung = false) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // 1. Check hôm nay có phải ngày quay của tỉnh này không?
  const isTodayDrawDay = isProvinceDrawDay(provinceName, today);
  
  if (!isTodayDrawDay) {
    // Hôm nay không quay → KHÔNG khóa giờ
    const nextDrawDate = getNextDrawDate(provinceName, today);
    return {
      shouldLock: false,
      lockStartTime: null,
      lockEndTime: null,
      resultDate: nextDrawDate.toISOString().split('T')[0],
      message: `Hôm nay không quay ${provinceName}. Cược cho kỳ tiếp theo.`
    };
  }
  
  // 2. Hôm nay là ngày quay → Check giờ hiện tại
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute; // Phút từ 00:00
  
  // Xác định khung giờ khóa
  const lockStart = isMienTrung ? 17 * 60 : 16 * 60; // 17:00 (Trung) / 16:00 (Nam)
  const lockEnd = 18 * 60 + 45; // 18:45
  
  if (currentTime >= lockStart && currentTime < lockEnd) {
    // Đang trong giờ khóa
    const lockStartStr = isMienTrung ? '17:00' : '16:00';
    return {
      shouldLock: true,
      lockStartTime: lockStartStr,
      lockEndTime: '18:45',
      resultDate: today.toISOString().split('T')[0],
      message: `Đang khóa cược từ ${lockStartStr} đến 18:45 (hôm nay là ngày quay)`
    };
  }
  
  // 3. Sau giờ khóa (18:45+) → Cho phép đánh cho kỳ tiếp theo
  if (currentTime >= lockEnd) {
    const nextDrawDate = getNextDrawDate(provinceName, today);
    return {
      shouldLock: false,
      lockStartTime: null,
      lockEndTime: null,
      resultDate: nextDrawDate.toISOString().split('T')[0],
      message: 'Đang đặt cược cho kỳ quay tiếp theo'
    };
  }
  
  // 4. Trước giờ khóa → Cho phép đánh cho hôm nay
  return {
    shouldLock: false,
    lockStartTime: null,
    lockEndTime: null,
    resultDate: today.toISOString().split('T')[0],
    message: 'Đặt cược cho kỳ quay hôm nay'
  };
};

/**
 * Map tên tỉnh sang region (Miền Trung hoặc Miền Nam)
 * Dựa trên BetService.java logic
 */
const MIEN_TRUNG_PROVINCES = [
  'phuyen', 'thuathienhue', 'daklak', 'quangnam', 'danang',
  'khanhhoa', 'binhdinh', 'quangbinh', 'quangtri', 
  'gialai', 'ninhthuan', 'daknong', 'quangngai', 'kontum'
];

/**
 * Kiểm tra tỉnh thuộc Miền Trung hay Miền Nam
 * @param {string} provinceName - Tên tỉnh (Backend format)
 * @returns {boolean} True nếu là Miền Trung
 */
export const isMienTrung = (provinceName) => {
  return MIEN_TRUNG_PROVINCES.includes(provinceName);
};

