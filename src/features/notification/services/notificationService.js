const API_URL = 'http://localhost:8080/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  const adminToken = localStorage.getItem('adminToken');
  
  // Prioritize user token for user-facing services
  const activeToken = token || adminToken;
  
  if (activeToken) {
    return {
      'Authorization': `Bearer ${activeToken}`,
      'Content-Type': 'application/json',
    };
  }
  return {
    'Content-Type': 'application/json',
  };
};

const notificationService = {
  // Admin: Tạo thông báo mới
  createNotification: async (notificationData) => {
    try {
      const response = await fetch(`${API_URL}/notifications/admin/create`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(notificationData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Lỗi khi tạo thông báo');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Admin: Lấy tất cả thông báo
  getAllNotifications: async (page = 0, size = 20) => {
    try {
      const response = await fetch(
        `${API_URL}/notifications/admin/all?page=${page}&size=${size}`,
        {
          method: 'GET',
          headers: getAuthHeader(),
        }
      );

      if (!response.ok) {
        throw new Error('Lỗi khi tải danh sách thông báo');
      }

      return await response.json();
    } catch (error) {
      console.error('Get all notifications error:', error);
      throw error;
    }
  },

  // Admin: Xóa thông báo
  deleteNotification: async (notificationId) => {
    try {
      const response = await fetch(
        `${API_URL}/notifications/admin/${notificationId}`,
        {
          method: 'DELETE',
          headers: getAuthHeader(),
        }
      );

      if (!response.ok) {
        throw new Error('Lỗi khi xóa thông báo');
      }

      return await response.json();
    } catch (error) {
      console.error('Delete notification error:', error);
      throw error;
    }
  },

  // User: Lấy thông báo của mình
  getMyNotifications: async (page = 0, size = 10) => {
    try {
      const response = await fetch(
        `${API_URL}/notifications/my?page=${page}&size=${size}`,
        {
          method: 'GET',
          headers: getAuthHeader(),
        }
      );

      if (!response.ok) {
        throw new Error('Lỗi khi tải thông báo');
      }

      return await response.json();
    } catch (error) {
      console.error('Get my notifications error:', error);
      throw error;
    }
  },

  // User: Đếm thông báo chưa đọc
  getUnreadCount: async () => {
    try {
      const response = await fetch(`${API_URL}/notifications/unread-count`, {
        method: 'GET',
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error('Lỗi khi đếm thông báo chưa đọc');
      }

      return await response.json();
    } catch (error) {
      console.error('Get unread count error:', error);
      throw error;
    }
  },

  // User: Đánh dấu đã đọc
  markAsRead: async (notificationId) => {
    try {
      const response = await fetch(
        `${API_URL}/notifications/${notificationId}/read`,
        {
          method: 'PUT',
          headers: getAuthHeader(),
        }
      );

      if (!response.ok) {
        throw new Error('Lỗi khi đánh dấu đã đọc');
      }

      return await response.json();
    } catch (error) {
      console.error('Mark as read error:', error);
      throw error;
    }
  },

  // User: Đánh dấu tất cả đã đọc
  markAllAsRead: async () => {
    try {
      const response = await fetch(`${API_URL}/notifications/read-all`, {
        method: 'PUT',
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error('Lỗi khi đánh dấu tất cả đã đọc');
      }

      return await response.json();
    } catch (error) {
      console.error('Mark all as read error:', error);
      throw error;
    }
  },

  // User: Lấy chi tiết thông báo
  getNotificationById: async (notificationId) => {
    try {
      const response = await fetch(
        `${API_URL}/notifications/${notificationId}`,
        {
          method: 'GET',
          headers: getAuthHeader(),
        }
      );

      if (!response.ok) {
        throw new Error('Lỗi khi tải chi tiết thông báo');
      }

      return await response.json();
    } catch (error) {
      console.error('Get notification by ID error:', error);
      throw error;
    }
  },
};

export default notificationService;

