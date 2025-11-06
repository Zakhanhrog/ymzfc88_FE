import React, { useState, useEffect } from 'react';
import { FONT_SIZE, FONT_WEIGHT } from '../../../utils/typography';
import { THEME_COLORS } from '../../../utils/theme';
import { marqueeNotificationService } from '../../../services/marqueeNotificationService';
import DynamicMarquee from '../../../components/common/DynamicMarquee';

const CACHE_KEY = 'marquee_notifications';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCachedNotifications = () => {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();
    
    if (now - timestamp < CACHE_DURATION) {
      return data;
    }
    
    sessionStorage.removeItem(CACHE_KEY);
    return null;
  } catch (error) {
    return null;
  }
};

const setCachedNotifications = (data) => {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    // Ignore storage errors
  }
};

const NotificationMarquee = ({ message }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMarqueeNotifications();
  }, []);

  const loadMarqueeNotifications = async () => {
    // Check cache first
    const cached = getCachedNotifications();
    if (cached) {
      setNotifications(cached);
      setLoading(false);
      return;
    }

    try {
      const response = await marqueeNotificationService.getActiveMarqueeNotifications();
      if (response.success) {
        setNotifications(response.data);
        setCachedNotifications(response.data);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Không hiển thị gì nếu đang loading hoặc không có dữ liệu
  if (loading || notifications.length === 0) {
    return null;
  }

  return (
    <div className="marquee-notifications-container">
      {notifications.map((notification, index) => (
        <DynamicMarquee
          key={notification.id}
          content={notification.content}
          speed={notification.speed}
          textColor={notification.textColor}
          backgroundColor={notification.backgroundColor}
          fontSize={notification.fontSize}
        />
      ))}
      
      <style jsx>{`
        .marquee-notifications-container {
          width: 100%;
          overflow: hidden;
          position: relative;
        }
        
        .marquee-notifications-container > div {
          margin-bottom: 2px;
        }
        
        .marquee-notifications-container > div:last-child {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
};

export default NotificationMarquee;

