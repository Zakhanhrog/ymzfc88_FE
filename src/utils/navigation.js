import { isAdminSubdomain, isLocalhost } from './subdomain';

/**
 * Get the correct admin path based on subdomain/localhost
 * - If on admin subdomain (production): returns path without /admin prefix
 * - If on localhost: returns path with /admin prefix
 * - If on user domain: returns path with /admin prefix (will be redirected)
 * 
 * @param {string} path - Admin path (e.g., '/login', '/dashboard', '/dashboard?tab=users')
 * @returns {string} Correct path based on environment
 */
export const getAdminPath = (path) => {
  // Split path and query string
  const [pathPart, queryString] = path.split('?');
  
  // Remove leading slash if present
  const cleanPath = pathPart.startsWith('/') ? pathPart.slice(1) : pathPart;
  
  // If already has /admin prefix, remove it
  const pathWithoutAdmin = cleanPath.startsWith('admin/') 
    ? cleanPath.slice(6) 
    : cleanPath;
  
  // Build final path
  let finalPath = `/${pathWithoutAdmin}`;
  
  // Add query string if present
  if (queryString) {
    finalPath += `?${queryString}`;
  }
  
  // On localhost: always use /admin prefix
  if (isLocalhost()) {
    return `/admin${finalPath}`;
  }
  
  // If on admin subdomain (production), return path without /admin prefix
  if (isAdminSubdomain()) {
    return finalPath;
  }
  
  // If on user domain, return path with /admin prefix
  return `/admin${finalPath}`;
};

/**
 * Get admin login path
 */
export const getAdminLoginPath = () => getAdminPath('/login');

/**
 * Get admin dashboard path
 */
export const getAdminDashboardPath = () => getAdminPath('/dashboard');

