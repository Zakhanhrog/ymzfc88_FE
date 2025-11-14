import { useEffect, useRef, useState } from 'react';
import notificationService from '../features/notification/services/notificationService';

export const useNotificationCount = (isLoggedIn = false, pollIntervalMs = 30000) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const intervalRef = useRef(null);

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

  const refreshUnreadCount = () => {
    loadUnreadCount();
  };

  useEffect(() => {
    if (!isLoggedIn) {
      setUnreadCount(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    loadUnreadCount();
    if (pollIntervalMs > 0) {
      intervalRef.current = setInterval(loadUnreadCount, pollIntervalMs);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, pollIntervalMs]);

  return {
    unreadCount,
    refreshUnreadCount
  };
};