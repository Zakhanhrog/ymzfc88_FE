import axios from 'axios';
import { getPortalType } from '../../../utils/subdomain';

const ADMIN_PORTAL_KEY = 'adminPortalType';
const STAFF_PORTAL_ROLES = [
  'STAFF_MKT',
  'STAFF_XNK',
  'STAFF_TX1',
  'STAFF_TX2',
  'STAFF_XD'
];

const isUserAuthorizedForPortal = (portal, user) => {
  if (!user) return false;
  if (portal === 'agent') {
    return user.staffRole === 'AGENT';
  }
  if (portal === 'staff') {
    return STAFF_PORTAL_ROLES.includes(user.staffRole);
  }
  return user.role === 'ADMIN';
};

const API_BASE_URL = 'http://localhost:8080/api';

const adminAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào header
adminAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Admin authentication service
export const adminAuthService = {
  // Login admin
  login: async (credentials) => {
    try {
      const portalType = getPortalType();
      const payload = {
        usernameOrEmail: credentials.username,
        password: credentials.password,
        portal: portalType?.toUpperCase?.() || 'ADMIN'
      };

      const response = await adminAPI.post('/admin/login', {
        ...payload
      });

      const { data } = response.data;

      if (!isUserAuthorizedForPortal(portalType, data.user)) {
        throw new Error('Bạn không có quyền truy cập vào cổng này');
      }

      const session = {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        fullName: data.user.fullName,
        role: data.user.role,
        staffRole: data.user.staffRole,
        portal: portalType,
        token: data.accessToken
      };

      localStorage.setItem(ADMIN_PORTAL_KEY, portalType);
      localStorage.setItem('adminToken', data.accessToken);
      localStorage.setItem('adminRefreshToken', data.refreshToken);
      localStorage.setItem('adminData', JSON.stringify(session));
      
      return { success: true, data: session };
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Đăng nhập thất bại');
      }
      throw new Error('Lỗi kết nối đến máy chủ');
    }
  },

  // Logout admin
  logout: () => {
    localStorage.removeItem(ADMIN_PORTAL_KEY);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRefreshToken');
    localStorage.removeItem('adminData');
  },

  // Check if admin is authenticated
  isAuthenticated: (portal = getPortalType()) => {
    const storedPortal = localStorage.getItem(ADMIN_PORTAL_KEY);
    const token = localStorage.getItem('adminToken');
    if (!token || !storedPortal) {
      return false;
    }
    if (portal && storedPortal !== portal) {
      return false;
    }
    return true;
  },

  isAuthorizedForPortal: (portal = getPortalType()) => {
    const session = adminAuthService.getCurrentAdmin();
    if (!session) {
      return false;
    }

    return isUserAuthorizedForPortal(portal, session);
  },

  // Get current admin data
  getCurrentAdmin: () => {
    const adminData = localStorage.getItem('adminData');
    return adminData ? JSON.parse(adminData) : null;
  },

  // Get admin token
  getToken: () => {
    return localStorage.getItem('adminToken');
  },

  getCurrentPortal: () => {
    return localStorage.getItem(ADMIN_PORTAL_KEY) || null;
  }
};
