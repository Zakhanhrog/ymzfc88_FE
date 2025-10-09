import { useState, useEffect } from 'react';
import { Badge, Dropdown, List, Empty, Button, Spin, Tag, Typography, Space, Divider } from 'antd';
import { BellOutlined, CheckOutlined, CheckCircleOutlined, InfoCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import notificationService from '../services/notificationService';
import moment from 'moment';
import 'moment/locale/vi';

moment.locale('vi');

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(() => {
      loadUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleVisibleChange = (visible) => {
    if (visible) {
      loadNotifications();
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.data);
      }
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.getMyNotifications(0, 10);
      console.log('📬 Notification Response:', response); // DEBUG
      
      if (response && response.success && response.data) {
        // Check if response.data is array or paginated object
        const notificationList = Array.isArray(response.data) 
          ? response.data 
          : (response.data.content || response.data.notifications || []);
        
        console.log('📬 Notifications List:', notificationList); // DEBUG
        setNotifications(notificationList || []);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      INFO: <InfoCircleOutlined style={{ color: '#1890ff' }} />,
      SUCCESS: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      WARNING: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      ERROR: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
    };
    return icons[type] || <BellOutlined style={{ color: '#666' }} />;
  };

  const notificationContent = (
    <div className="w-80 max-h-96 overflow-y-auto bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-bold text-lg">Thông báo</h3>
        {unreadCount > 0 && (
          <Button type="link" size="small" onClick={handleMarkAllAsRead}>
            Đánh dấu đã đọc
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Spin />
        </div>
      ) : notifications.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Không có thông báo"
          style={{ padding: 32 }}
        />
      ) : (
        <div className="divide-y divide-gray-100">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                !notification.isRead ? 'bg-blue-50' : ''
              }`}
              onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
            >
              <div className="flex items-start gap-3">
                {getNotificationIcon(notification.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-semibold text-sm text-gray-900 line-clamp-1">
                      {notification.title}
                    </p>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400">
                    {moment(notification.createdAt).fromNow()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Dropdown
      trigger={['click']}
      placement="bottomRight"
      overlay={notificationContent}
      onVisibleChange={handleVisibleChange}
    >
      <Badge count={unreadCount}>
        <BellOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
      </Badge>
    </Dropdown>
  );
};

export default NotificationDropdown;
