/**
 * Asset Version Manager
 * Tăng version này mỗi khi thay đổi ảnh/assets trong public folder
 * để force browser refresh cache
 */
export const ASSET_VERSION = '1.0.1';

/**
 * Thêm version param vào URL để cache busting
 * @param {string} url - URL của asset
 * @returns {string} URL với version param
 */
export const versionAsset = (url) => {
  if (!url) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${ASSET_VERSION}`;
};

export default versionAsset;

