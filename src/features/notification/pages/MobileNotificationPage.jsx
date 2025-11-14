import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Layout from '../../../components/common/Layout';
import Loading from '../../../components/common/Loading';
import notificationService from '../services/notificationService';
import moment from 'moment';
import 'moment/locale/vi';

moment.locale('vi');

const MobileNotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const mobileContainerStyle = { width: '100%', maxWidth: '640px', margin: '0 auto' };

  useEffect(() => {
    loadNotifications();
  }, []);

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
    const normalized = (type || '').toUpperCase();
    switch (normalized) {
      case 'SUCCESS':
        return <Icon icon="mdi:check-circle" className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />;
      case 'ERROR':
        return <Icon icon="mdi:close-circle" className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />;
      case 'WARNING':
        return <Icon icon="mdi:alert-circle" className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />;
      case 'TRANSACTION':
        return <Icon icon="mdi:cash-refund" className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />;
      case 'INFO':
      default:
        return <Icon icon="mdi:information" className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />;
    }
  };

  const renderNotificationVisual = (type) => {
    const normalized = (type || '').toUpperCase();
    if (normalized === 'TRANSACTION') {
      return (
        <img
          src="/iconacc/imgi_26_withdraw.avif"
          alt="Transaction"
          className="w-7 h-7 object-contain"
        />
      );
    }
    return getNotificationIcon(type);
  };

  const getNotificationTheme = (type) => {
    const normalized = (type || '').toUpperCase();
    switch (normalized) {
      case 'SUCCESS':
        return { accent: '#22c55e', accentLight: 'rgba(34, 197, 94, 0.12)', border: '#bbf7d0', badgeBg: 'rgba(34, 197, 94, 0.18)' };
      case 'ERROR':
        return { accent: '#ef4444', accentLight: 'rgba(239, 68, 68, 0.12)', border: '#fecaca', badgeBg: 'rgba(239, 68, 68, 0.18)' };
      case 'WARNING':
        return { accent: '#f97316', accentLight: 'rgba(249, 115, 22, 0.12)', border: '#fed7aa', badgeBg: 'rgba(249, 115, 22, 0.18)' };
      case 'TRANSACTION':
        return { accent: '#16a34a', accentLight: 'rgba(22, 163, 74, 0.12)', border: '#bbf7d0', badgeBg: 'rgba(22, 163, 74, 0.18)' };
      case 'INFO':
      default:
        return { accent: '#3b82f6', accentLight: 'rgba(59, 130, 246, 0.12)', border: '#bfdbfe', badgeBg: 'rgba(59, 130, 246, 0.18)' };
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    window.location.assign(`/notifications/${notification.id}`);
  };

  return (
    <Layout>
      <div className="md:hidden w-full bg-gray-50 min-h-screen pb-24 pt-4">
        {loading ? (
          <div className="py-10" style={mobileContainerStyle}>
            <Loading />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12" style={mobileContainerStyle}>
            <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="w-16 h-16 rounded-full bg-white border border-dashed border-gray-300 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-gray-400">🔔</span>
            </div>
            <p className="text-gray-500">Chưa có thông báo nào</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4" style={mobileContainerStyle}>
            {notifications.map((notification) => {
              const theme = getNotificationTheme(notification.type);
              return (
              <div
                key={notification.id}
                role="button"
                tabIndex={0}
                onClick={() => handleNotificationClick(notification)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleNotificationClick(notification);
                  }
                }}
                className="px-3.5 pt-3 bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-200"
                style={{
                  borderColor: theme.border,
                  boxShadow: !notification.isRead ? `0 6px 20px rgba(59, 130, 246, 0.08)` : undefined,
                }}
              >
                <div className="space-y-2 relative">
                  {!notification.isRead && (
                    <span className="absolute top-0 right-0 text-xs font-semibold text-blue-500 uppercase tracking-wide">
                      Mới
                    </span>
                  )}
                  <div className="flex items-start gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: theme.badgeBg || theme.accentLight,
                          color: theme.accent,
                        }}
                    >
                      {renderNotificationVisual(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide"
                          style={{
                            background: theme.accentLight,
                            color: theme.accent,
                          }}
                        >
                          {(() => {
                            const labelMap = {
                              SUCCESS: 'THÀNH CÔNG',
                              ERROR: 'LỖI',
                              WARNING: 'CẢNH BÁO',
                              TRANSACTION: 'GIAO DỊCH',
                              INFO: 'THÔNG TIN',
                              MAINTENANCE: 'BẢO TRÌ',
                              SYSTEM: 'HỆ THỐNG'
                            };
                            const label = labelMap[(notification.type || '').toUpperCase()];
                            return label || (notification.type || 'THÔNG TIN');
                          })()}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-base truncate">
                        {notification.title}
                      </h3>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {notification.message && (
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                        {notification.message}
                      </p>
                    )}
                    {notification.details && (
                      <div className="text-sm text-gray-500 bg-gray-50 rounded-xl p-3">
                        {notification.details}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <p>{moment(notification.createdAt).fromNow()}</p>
                    <div className="flex items-center gap-1 text-blue-500 font-semibold">
                      <span>Xem thêm</span>
                      <Icon icon="mdi:chevron-right" className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MobileNotificationPage;

