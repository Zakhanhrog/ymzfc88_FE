import React, { useState, useEffect } from 'react';
import { FONT_SIZE, FONT_WEIGHT } from '../../../utils/typography';
import { THEME_COLORS } from '../../../utils/theme';
import { marqueeNotificationService } from '../../../services/marqueeNotificationService';
import DynamicMarquee from '../../../components/common/DynamicMarquee';

const NotificationMarquee = ({ message }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMarqueeNotifications();
  }, []);

  const loadMarqueeNotifications = async () => {
    try {
      const response = await marqueeNotificationService.getActiveMarqueeNotifications();
      if (response.success) {
        setNotifications(response.data);
      } else {
        console.warn('Failed to load marquee notifications:', response.message);
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error loading marquee notifications:', error);
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

