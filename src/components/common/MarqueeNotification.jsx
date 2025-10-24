import React, { useState, useEffect } from 'react';
import { marqueeNotificationService } from '../../services/marqueeNotificationService';

const MarqueeNotification = () => {
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
      }
    } catch (error) {
      console.error('Error loading marquee notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || notifications.length === 0) {
    return null;
  }

  return (
    <div className="marquee-notifications-container">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className="marquee-notification"
          style={{
            backgroundColor: notification.backgroundColor,
            color: notification.textColor,
            fontSize: `${notification.fontSize}px`,
            marginBottom: index < notifications.length - 1 ? '8px' : '0',
            borderRadius: '8px',
            padding: '8px 16px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            position: 'relative',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            width: '100%'
          }}
        >
          <div
            className="marquee-content"
            style={{
              display: 'inline-block',
              whiteSpace: 'nowrap',
              animation: `marquee ${Math.max(5, 200 - notification.speed)}s linear infinite`,
              animationDelay: `${index * 2}s`,
              willChange: 'transform'
            }}
            dangerouslySetInnerHTML={{ __html: notification.content }}
          />
        </div>
      ))}
      
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100vw);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        .marquee-notifications-container {
          width: 100%;
          max-width: 100%;
          overflow: hidden;
          position: relative;
        }
        
        .marquee-notification {
          width: 100%;
          position: relative;
          overflow: hidden;
        }
        
        .marquee-content {
          display: inline-block;
          white-space: nowrap;
          will-change: transform;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        
        .marquee-content:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default MarqueeNotification;
