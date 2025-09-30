// Admin authentication service
export const adminAuthService = {
  // Login admin
  login: async (credentials) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock admin login validation
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        const adminData = {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          role: 'admin',
          token: 'admin-token-123'
        };
        
        localStorage.setItem('adminToken', adminData.token);
        localStorage.setItem('adminData', JSON.stringify(adminData));
        
        return { success: true, data: adminData };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw new Error('Login failed');
    }
  },

  // Logout admin
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
  },

  // Check if admin is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('adminToken');
    return !!token;
  },

  // Get current admin data
  getCurrentAdmin: () => {
    const adminData = localStorage.getItem('adminData');
    return adminData ? JSON.parse(adminData) : null;
  },

  // Get admin token
  getToken: () => {
    return localStorage.getItem('adminToken');
  }
};
