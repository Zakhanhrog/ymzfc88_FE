import {
  isAdminSubdomain,
  isAgentSubdomain,
  isStaffSubdomain,
  isLocalhost
} from './subdomain';

const PORTAL_CONFIG = {
  admin: {
    prefix: 'admin',
    isActive: isAdminSubdomain
  },
  agent: {
    prefix: 'agent',
    isActive: isAgentSubdomain
  },
  staff: {
    prefix: 'staff',
    isActive: isStaffSubdomain
  }
};

const normalizePath = (path) => {
  const sanitized = path.startsWith('/') ? path : `/${path}`;
  const [pathPart, queryString] = sanitized.split('?');
  return {
    pathPart,
    queryString: queryString ? `?${queryString}` : ''
  };
};

const removePortalPrefix = (path, prefix) => {
  const withSlash = `/${prefix}/`;
  if (path.startsWith(withSlash)) {
    return path.slice(withSlash.length - 1);
  }

  if (path.startsWith(`/${prefix}`) && path.length > prefix.length + 1) {
    return path.slice(prefix.length + 1);
  }

  return path;
};

const buildPortalPath = (portal, path) => {
  const config = PORTAL_CONFIG[portal] ?? PORTAL_CONFIG.admin;
  const { pathPart, queryString } = normalizePath(path);
  const sanitizedPath = removePortalPrefix(pathPart, config.prefix);

  if (isLocalhost()) {
    return `/${config.prefix}${sanitizedPath}${queryString}`;
  }

  if (config.isActive()) {
    return `${sanitizedPath}${queryString}`;
  }

  return `/${config.prefix}${sanitizedPath}${queryString}`;
};

export const getPortalPath = (portal, path) => buildPortalPath(portal, path);

export const getAdminPath = (path) => buildPortalPath('admin', path);
export const getAgentPath = (path) => buildPortalPath('agent', path);
export const getStaffPath = (path) => buildPortalPath('staff', path);

export const getPortalLoginPath = (portal) => buildPortalPath(portal, '/login');

export const getAdminLoginPath = () => getPortalLoginPath('admin');
export const getAgentLoginPath = () => getPortalLoginPath('agent');
export const getStaffLoginPath = () => getPortalLoginPath('staff');

export const getPortalDashboardPath = (portal, tab) => {
  if (tab) {
    return buildPortalPath(portal, `/dashboard?tab=${tab}`);
  }
  return buildPortalPath(portal, '/dashboard');
};

export const getAdminDashboardPath = () => getPortalDashboardPath('admin');
export const getAgentDashboardPath = () => getPortalDashboardPath('agent');
export const getStaffDashboardPath = () => getPortalDashboardPath('staff');

