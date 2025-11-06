/**
 * Check if we're running on localhost
 * @returns {boolean}
 */
export const isLocalhost = () => {
  const hostname = window.location.hostname;
  return hostname === 'localhost' || 
         hostname === '127.0.0.1' || 
         hostname.startsWith('192.168.') || 
         hostname.startsWith('10.0.') ||
         hostname.startsWith('172.16.') ||
         hostname.startsWith('172.17.') ||
         hostname.startsWith('172.18.') ||
         hostname.startsWith('172.19.') ||
         hostname.startsWith('172.20.') ||
         hostname.startsWith('172.21.') ||
         hostname.startsWith('172.22.') ||
         hostname.startsWith('172.23.') ||
         hostname.startsWith('172.24.') ||
         hostname.startsWith('172.25.') ||
         hostname.startsWith('172.26.') ||
         hostname.startsWith('172.27.') ||
         hostname.startsWith('172.28.') ||
         hostname.startsWith('172.29.') ||
         hostname.startsWith('172.30.') ||
         hostname.startsWith('172.31.');
};

/**
 * Utility function to detect subdomain from current hostname
 * @returns {string|null} The subdomain (e.g., 'admin') or null if no subdomain
 */
export const getSubdomain = () => {
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  
  // If hostname has 3+ parts (e.g., admin.tathiet168.com)
  // Return the first part as subdomain
  if (parts.length >= 3) {
    return parts[0];
  }
  
  // Special case: admin.localhost (for local development)
  if (isLocalhost() && parts.length === 2 && parts[0] === 'admin') {
    return 'admin';
  }
  
  // No subdomain (e.g., tathiet168.com or localhost)
  return null;
};

/**
 * Check if current path is admin path
 * @returns {boolean}
 */
export const isAdminPath = () => {
  return window.location.pathname.startsWith('/admin');
};

/**
 * Check if current domain is admin subdomain
 * On localhost: also check if path starts with /admin or subdomain is admin
 * @returns {boolean}
 */
export const isAdminSubdomain = () => {
  // Check subdomain first
  const subdomain = getSubdomain();
  if (subdomain === 'admin') {
    return true;
  }
  
  // On localhost: also check if path starts with /admin
  if (isLocalhost()) {
    return isAdminPath();
  }
  
  return false;
};

/**
 * Check if current domain is user domain (no subdomain)
 * @returns {boolean}
 */
export const isUserDomain = () => {
  return !isAdminSubdomain();
};

