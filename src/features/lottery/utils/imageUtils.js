/**
 * Utility functions for image handling
 */
import { provincesSchedule } from '../data/provincesData';

/**
 * Chuyển đổi tên tỉnh thành tên file ảnh
 * @param {string} provinceName - Tên tỉnh (ví dụ: "Bình Dương", "Vĩnh Long")
 * @returns {string} - Tên file ảnh (ví dụ: "binhduong.png", "vinhlong.png")
 */
export const getProvinceImagePath = (provinceName) => {
  if (!provinceName) return '';
  
  // Chuyển đổi tên tỉnh thành slug
  const slug = provinceName
    .normalize("NFD") // Chuẩn hóa thành NFD (Canonical Decomposition)
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
    .toLowerCase() // Chuyển thành chữ thường
    .replace(/\s+/g, "") // Loại bỏ khoảng trắng
    .replace(/[^a-z0-9]/g, ""); // Loại bỏ ký tự đặc biệt
  
  return `/images/games/${slug}.png`;
};

/**
 * Mapping cụ thể cho các tỉnh có tên file khác với slug
 */
const PROVINCE_IMAGE_MAPPING = {
  'binhduong': 'binhduong.png',
  'gialai': 'gialai.png', 
  'mienbac': 'mienbac.png',
  'ninhthuan': 'ninhthuan.png',
  'travinh': 'travinh.png',
  'vinhlong': 'vinhlong.png'
};

/**
 * Lấy đường dẫn ảnh với mapping cụ thể
 * @param {string} provinceName - Tên tỉnh
 * @returns {string} - Đường dẫn ảnh
 */
export const getProvinceImagePathWithMapping = (provinceName) => {
  if (!provinceName) return '';
  
  // Loại bỏ "Xổ Số" và các từ không cần thiết
  let cleanName = provinceName
    .replace(/^Xổ\s+Số\s+/i, '') // Loại bỏ "Xổ Số " ở đầu
    .replace(/\s+Xổ\s+Số.*$/i, '') // Loại bỏ " Xổ Số ..." ở cuối
    .trim();
  
  const slug = cleanName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");
  
  const imageFile = PROVINCE_IMAGE_MAPPING[slug] || `${slug}.png`;
  const imagePath = `/images/games/${imageFile}`;
  
  return imagePath;
};

/**
 * Lấy đường dẫn ảnh tỉnh từ dữ liệu provincesData
 * @param {string} provinceName - Tên tỉnh (ví dụ: "Xổ Số Đà Nẵng", "Đà Nẵng")
 * @returns {string} - Đường dẫn ảnh
 */
export const getProvinceImageFromData = (provinceName) => {
  if (!provinceName) return '';
  
  // Tìm trong tất cả các ngày
  for (const dayKey in provincesSchedule) {
    const dayData = provincesSchedule[dayKey];
    
    // Tìm trong miền trung
    if (dayData.trung) {
      for (const province of dayData.trung) {
        if (province.name === provinceName || province.province === provinceName) {
          return province.image;
        }
      }
    }
    
    // Tìm trong miền nam
    if (dayData.nam) {
      for (const province of dayData.nam) {
        if (province.name === provinceName || province.province === provinceName) {
          return province.image;
        }
      }
    }
  }
  
  // Nếu không tìm thấy, fallback về hàm cũ
  return getProvinceImagePathWithMapping(provinceName);
};

