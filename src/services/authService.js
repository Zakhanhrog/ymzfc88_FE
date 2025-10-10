// Auth Service với auto token refresh
import { API_BASE_URL } from '../utils/constants';

class AuthService {
  constructor() {
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  // Process queue of failed requests after token refresh
  processQueue(error, token = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });

    this.failedQueue = [];
  }

  // Refresh token
  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();

    if (data.success) {
      // Update tokens in localStorage
      localStorage.setItem('authToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      return data.data.accessToken;
    } else {
      throw new Error(data.message || 'Failed to refresh token');
    }
  }

  // Auto-retry request with token refresh
  async makeAuthenticatedRequest(url, options = {}) {
    // Check for admin token first (for admin pages)
    let token = localStorage.getItem('adminToken') || localStorage.getItem('authToken');

    // If no token, try to refresh first
    if (!token) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No authentication token found');
      }
      
      try {
        token = await this.refreshToken();
      } catch (error) {
        this.logout();
        throw new Error('Session expired. Please login again.');
      }
    }

    // Add authorization header
    const requestOptions = {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await fetch(url, requestOptions);

      // If 401/403, try to refresh token
      if (response.status === 401 || response.status === 403) {
        if (this.isRefreshing) {
          // Wait for ongoing refresh
          return new Promise((resolve, reject) => {
            this.failedQueue.push({ resolve, reject });
          }).then(() => {
            // Retry with new token
            const newToken = localStorage.getItem('authToken');
            const newRequestOptions = {
              ...options,
              headers: {
                ...options.headers,
                'Authorization': `Bearer ${newToken}`,
                'Content-Type': 'application/json',
              },
            };
            return fetch(url, newRequestOptions);
          });
        }

        this.isRefreshing = true;

        try {
          const newToken = await this.refreshToken();
          this.processQueue(null, newToken);

          // Retry original request with new token
          const newRequestOptions = {
            ...options,
            headers: {
              ...options.headers,
              'Authorization': `Bearer ${newToken}`,
              'Content-Type': 'application/json',
            },
          };

          return fetch(url, newRequestOptions);
        } catch (refreshError) {
          this.processQueue(refreshError, null);
          // If refresh fails, logout user
          this.logout();
          throw new Error('Session expired. Please login again.');
        } finally {
          this.isRefreshing = false;
        }
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  // Login
  async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (data.success) {
      // Store tokens
      localStorage.setItem('authToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      return data;
    } else {
      throw new Error(data.message || 'Login failed');
    }
  }

  // Logout
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');

    // Redirect to login page
    window.location.href = '/login';
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!(localStorage.getItem('authToken') || localStorage.getItem('adminToken'));
  }

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

export default new AuthService();