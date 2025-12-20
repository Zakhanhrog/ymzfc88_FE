import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../../../components/ui/Sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/Tabs';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import Loading from '../../../components/common/Loading';
import notificationService from '../services/notificationService';
import moment from 'moment';
import 'moment/locale/vi';

moment.locale('vi');

const NotificationSheet = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('system');
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen, activeTab]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.getMyNotifications(0, 100);
      
      if (response && response.success && response.data) {
        const notificationList = Array.isArray(response.data) 
          ? response.data 
          : (response.data.content || response.data.notifications || []);
        
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
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  // Phân loại notifications
  const systemNotifications = notifications.filter(notif => {
    const type = (notif.type || '').toUpperCase();
    const title = (notif.title || '').toLowerCase();
    const message = (notif.message || '').toLowerCase();
    
    // Kiểm tra type trước
    if (['SYSTEM', 'MAINTENANCE', 'SECURITY', 'ACCOUNT', 'ANNOUNCEMENT', 'PROMOTION'].includes(type)) {
      return true;
    }
    
    // Kiểm tra nội dung nếu type không rõ ràng
    const bettingKeywords = ['cược', 'bet', 'thắng', 'thua', 'hoàn trả', 'refund', 'sicbo', 'xoc dia', 'lô đề'];
    const isBetting = bettingKeywords.some(keyword => 
      title.includes(keyword) || message.includes(keyword)
    );
    
    return !isBetting;
  });

  const bettingNotifications = notifications.filter(notif => {
    const type = (notif.type || '').toUpperCase();
    const title = (notif.title || '').toLowerCase();
    const message = (notif.message || '').toLowerCase();
    
    // Kiểm tra type trước
    if (['TRANSACTION', 'BET', 'BETTING', 'WIN', 'LOSS', 'REFUND'].includes(type)) {
      return true;
    }
    
    // Kiểm tra nội dung
    const bettingKeywords = ['cược', 'bet', 'thắng', 'thua', 'hoàn trả', 'refund', 'sicbo', 'xoc dia', 'lô đề', 'điểm', 'phiên'];
    return bettingKeywords.some(keyword => 
      title.includes(keyword) || message.includes(keyword)
    );
  });

  const getNotificationIcon = (type, priority) => {
    const normalized = (type || '').toUpperCase();
    const priorityLevel = priority?.toUpperCase() || 'INFO';
    
    // Icon dựa trên type - nhỏ gọn hơn
    switch (normalized) {
      case 'TRANSACTION':
        return <Icon icon="mdi:cash-refund" className="w-4 h-4 text-emerald-600" />;
      case 'BET':
      case 'BETTING':
        return <Icon icon="mdi:dice-multiple" className="w-4 h-4 text-purple-600" />;
      case 'WIN':
        return <Icon icon="mdi:trophy" className="w-4 h-4 text-amber-500" />;
      case 'LOSS':
        return <Icon icon="mdi:trending-down" className="w-4 h-4 text-red-500" />;
      case 'REFUND':
        return <Icon icon="mdi:undo" className="w-4 h-4 text-blue-600" />;
      case 'MAINTENANCE':
        return <Icon icon="mdi:wrench" className="w-4 h-4 text-orange-500" />;
      case 'SECURITY':
        return <Icon icon="mdi:shield-alert" className="w-4 h-4 text-red-600" />;
      case 'PROMOTION':
        return <Icon icon="mdi:gift" className="w-4 h-4 text-pink-500" />;
      case 'ACCOUNT':
        return <Icon icon="mdi:account" className="w-4 h-4 text-indigo-600" />;
      case 'ANNOUNCEMENT':
        return <Icon icon="mdi:bullhorn" className="w-4 h-4 text-cyan-600" />;
      default:
        // Icon dựa trên priority nếu không có type cụ thể
        if (priorityLevel === 'URGENT') {
          return <Icon icon="mdi:alert-circle" className="w-4 h-4 text-red-600" />;
        } else if (priorityLevel === 'WARNING') {
          return <Icon icon="mdi:alert" className="w-4 h-4 text-yellow-500" />;
        }
        return <Icon icon="mdi:information" className="w-4 h-4 text-blue-500" />;
    }
  };

  const getIconBgColor = (type) => {
    const normalized = (type || '').toUpperCase();
    switch (normalized) {
      case 'TRANSACTION':
        return 'bg-emerald-50';
      case 'BET':
      case 'BETTING':
        return 'bg-purple-50';
      case 'WIN':
        return 'bg-amber-50';
      case 'LOSS':
        return 'bg-red-50';
      case 'REFUND':
        return 'bg-blue-50';
      case 'MAINTENANCE':
        return 'bg-orange-50';
      case 'SECURITY':
        return 'bg-red-50';
      case 'PROMOTION':
        return 'bg-pink-50';
      case 'ACCOUNT':
        return 'bg-indigo-50';
      case 'ANNOUNCEMENT':
        return 'bg-cyan-50';
      default:
        return 'bg-blue-50';
    }
  };

  const getPriorityBadge = (priority) => {
    const priorityLevel = (priority || '').toUpperCase();
    switch (priorityLevel) {
      case 'URGENT':
        return (
          <Badge variant="destructive" className="text-[10px] font-medium px-1.5 py-0.5">
            Khẩn
          </Badge>
        );
      case 'WARNING':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-[10px] font-medium px-1.5 py-0.5">
            Cảnh báo
          </Badge>
        );
      default:
        return null;
    }
  };

  const NotificationCard = ({ notification }) => {
    const isUnread = !notification.isRead;
    const iconBg = getIconBgColor(notification.type);
    
    return (
      <Card 
        className={`
          group relative overflow-hidden transition-all duration-200 cursor-pointer
          ${isUnread 
            ? 'border-l-2 border-l-blue-500 bg-blue-50/20 hover:bg-blue-50/40' 
            : 'border border-gray-200 bg-white hover:bg-gray-50'
          }
        `}
        onClick={() => {
          if (isUnread) {
            handleMarkAsRead(notification.id);
          }
          navigate(`/notifications/${notification.id}`);
          onClose();
        }}
      >
        <div className="p-3">
          <div className="flex items-start gap-2.5">
            {/* Icon - nhỏ gọn hơn */}
            <div className={`
              flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
              ${isUnread ? `${iconBg}` : 'bg-gray-100'}
              transition-colors
            `}>
              {getNotificationIcon(notification.type, notification.priority)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex-1 min-w-0">
                  <h3 className={`
                    font-semibold text-xs leading-tight
                    ${isUnread ? 'text-gray-900' : 'text-gray-700'}
                    group-hover:text-blue-600 transition-colors
                  `}>
                    {notification.title}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {getPriorityBadge(notification.priority)}
                  {isUnread && (
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  )}
                </div>
              </div>

              {notification.message && (
                <p className="text-[11px] text-gray-600 line-clamp-2 mb-2 leading-relaxed">
                  {notification.message}
                </p>
              )}

              <div className="flex items-center justify-between pt-1.5 border-t border-gray-100">
                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                  <Icon icon="mdi:clock-outline" className="w-3 h-3" />
                  <span>{moment(notification.createdAt).fromNow()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const EmptyState = ({ message = "Chưa có thông báo nào" }) => (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
        <Icon icon="mdi:bell-off-outline" className="w-6 h-6 text-gray-400" />
      </div>
      <p className="text-gray-500 text-xs font-medium mb-0.5">{message}</p>
      <p className="text-gray-400 text-[10px]">Thông báo mới sẽ hiển thị ở đây</p>
    </div>
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const systemUnreadCount = systemNotifications.filter(n => !n.isRead).length;
  const bettingUnreadCount = bettingNotifications.filter(n => !n.isRead).length;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-sm p-0 flex flex-col bg-white" 
        showCloseButton={false}
      >
        <SheetHeader className="px-4 pt-4 pb-0 bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-base font-semibold text-gray-900">
              Thông báo
            </SheetTitle>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="inline-flex items-center px-2 py-1 rounded text-[10px] font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  <Icon icon="mdi:check-all" className="w-3 h-3 mr-1" />
                  Tất cả
                </button>
              )}
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <Icon icon="mdi:close" className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
          {unreadCount > 0 && (
            <div className="mt-1">
              <Badge className="bg-blue-500 text-white border-0 text-[10px] font-medium px-2 py-0.5">
                {unreadCount} chưa đọc
              </Badge>
            </div>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex flex-col bg-white">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col h-full px-4 pt-0"
          >
            <TabsList className="grid w-full grid-cols-2 h-8 bg-gray-100">
              <TabsTrigger 
                value="system" 
                className="text-xs data-[state=active]:shadow-sm"
              >
                <div className="flex items-center gap-1.5">
                  <Icon icon="mdi:bell-outline" className="w-3.5 h-3.5" />
                  <span>Hệ thống</span>
                  {systemUnreadCount > 0 && (
                    <Badge className="bg-white/20 text-white border-0 text-[9px] font-bold px-1 py-0 min-w-[16px] h-[16px] flex items-center justify-center data-[state=active]:bg-white/30">
                      {systemUnreadCount}
                    </Badge>
                  )}
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="betting"
                className="text-xs data-[state=active]:shadow-sm"
              >
                <div className="flex items-center gap-1.5">
                  <Icon icon="mdi:dice-multiple-outline" className="w-3.5 h-3.5" />
                  <span>Cược</span>
                  {bettingUnreadCount > 0 && (
                    <Badge className="bg-white/20 text-white border-0 text-[9px] font-bold px-1 py-0 min-w-[16px] h-[16px] flex items-center justify-center data-[state=active]:bg-white/30">
                      {bettingUnreadCount}
                    </Badge>
                  )}
                </div>
              </TabsTrigger>
            </TabsList>
            <TabsContent 
              value="system" 
              className="flex-1 overflow-y-auto mt-2 px-0 pb-4 data-[state=active]:flex data-[state=active]:flex-col"
            >
              <div className="space-y-2 py-1">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loading />
                  </div>
                ) : systemNotifications.length === 0 ? (
                  <EmptyState message="Chưa có thông báo hệ thống" />
                ) : (
                  systemNotifications.map((notification) => (
                    <NotificationCard key={notification.id} notification={notification} />
                  ))
                )}
              </div>
            </TabsContent>
            <TabsContent 
              value="betting"
              className="flex-1 overflow-y-auto mt-2 px-0 pb-4 data-[state=active]:flex data-[state=active]:flex-col"
            >
              <div className="space-y-2 py-1">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loading />
                  </div>
                ) : bettingNotifications.length === 0 ? (
                  <EmptyState message="Chưa có thông báo cược" />
                ) : (
                  bettingNotifications.map((notification) => (
                    <NotificationCard key={notification.id} notification={notification} />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationSheet;

