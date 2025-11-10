/**
 * Utility functions for domain-based routing
 */

/**
 * Check if current domain is admin subdomain
 * @returns {boolean}
 */
export const isAdminDomain = () => {
  if (typeof window === 'undefined') return false;
  
  const hostname = window.location.hostname;
  
  // Check for admin subdomain
  if (hostname.startsWith('admin.')) {
    return true;
  }
  
  // Check for localhost admin (for development)
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // Check if URL contains /admin path
    return window.location.pathname.startsWith('/admin');
  }
  
  return false;
};

/**
 * Get base API URL based on current domain
 * @returns {string}
 */
export const getApiBaseUrl = () => {
  if (typeof window === 'undefined') {
    return import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
  }
  
  // Use environment variable if set
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Auto-detect based on current domain
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  
  // If admin subdomain, use api subdomain
  if (hostname.startsWith('admin.')) {
    return `${protocol}//api.${hostname.replace('admin.', '')}/api`;
  }
  
  // Default API URL
  return 'http://localhost:8080/api';
};

/**
 * Redirect to appropriate domain based on route
 * @param {string} path - Path to redirect to
 */
export const redirectToDomain = (path) => {
  if (typeof window === 'undefined') return;
  
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  const port = window.location.port ? `:${window.location.port}` : '';
  
  // If accessing admin route on user domain
  if (path.startsWith('/admin') && !isAdminDomain()) {
    const adminDomain = hostname.startsWith('localhost') || hostname.startsWith('127.0.0.1')
      ? `${hostname}${port}`
      : `admin.${hostname.replace(/^www\./, '')}`;
    
    window.location.href = `${protocol}//${adminDomain}${path}`;
    return;
  }
  
  // If accessing user route on admin domain
  if (!path.startsWith('/admin') && isAdminDomain()) {
    const userDomain = hostname.startsWith('admin.')
      ? hostname.replace('admin.', '')
      : hostname.replace(/^admin\./, '');
    
    window.location.href = `${protocol}//${userDomain}${path}`;
    return;
  }
};

