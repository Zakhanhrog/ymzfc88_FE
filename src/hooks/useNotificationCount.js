import { useState, useEffect } from 'react';
import notificationService from '../features/notification/services/notificationService';

export const useNotificationCount = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  const loadUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.data);
      }
    } catch (error) {
      console.error('Error loading unread count:', error);
      // Set to 0 if there's an error or user is not logged in
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(() => {
      loadUnreadCount();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const refreshUnreadCount = () => {
    loadUnreadCount();
  };

  return {
    unreadCount,
    refreshUnreadCount
  };
};