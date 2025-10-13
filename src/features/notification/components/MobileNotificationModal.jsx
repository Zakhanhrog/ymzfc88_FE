import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import notificationService from '../services/notificationService';
import moment from 'moment';
import 'moment/locale/vi';

moment.locale('vi');

const MobileNotificationModal = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.getMyNotifications(0, 20);
      
      if (response && response.success && response.data) {
        const notificationList = Array.isArray(response.data) 
          ? response.data 
          : (response.data.content || response.data.notifications || []);
        
        setNotifications(notificationList || []);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <Icon icon="mdi:check-circle" className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />;
      case 'error':
        return <Icon icon="mdi:close-circle" className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />;
      case 'warning':
        return <Icon icon="mdi:alert-circle" className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />;
      case 'info':
      default:
        return <Icon icon="mdi:information" className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />;
    }
  };

  return (
    <>
      {/* Overlay */}
      <div className={`md:hidden fixed inset-0 z-40 bg-black transition-opacity duration-300 ${
        isOpen ? 'opacity-30' : 'opacity-0 pointer-events-none'
      }`} onClick={onClose} />
      
      {/* Modal */}
      <div className={`md:hidden fixed inset-0 z-50 bg-white overflow-y-auto transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 sticky top-0">
        <h2 className="text-lg font-bold text-gray-800">Thông báo</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
        >
          <Icon icon="mdi:close" className="text-gray-600 text-lg" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <Icon icon="mdi:bell-off" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Chưa có thông báo nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow ${
                  !notification.isRead ? 'border-l-4 border-l-blue-500' : ''
                }`}
                onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-2 leading-relaxed">
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
      </div>
    </>
  );
};

export default MobileNotificationModal;
