import { useState, useEffect } from 'react';
import notificationService from '../features/notification/services/notificationService';

export const useNotificationCount = (isLoggedIn = false) => {
  const [unreadCount, setUnreadCount] = useState(0);

  const loadUnreadCount = async () => {
    // Only call API if user is logged in
    if (!isLoggedIn) {
      setUnreadCount(0);
      return;
    }

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
    
    // Only set interval if user is logged in
    let interval;
    if (isLoggedIn) {
      interval = setInterval(() => {
        loadUnreadCount();
      }, 30000); // Update every 30 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isLoggedIn]);

  const refreshUnreadCount = () => {
    loadUnreadCount();
  };

  return {
    unreadCount,
    refreshUnreadCount
  };
};