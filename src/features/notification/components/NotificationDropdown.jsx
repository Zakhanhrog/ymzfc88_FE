import React, { useState, useEffect } from 'react';
import { Badge, Dropdown, List, Empty, Button, Spin, Tag, Typography, Space, Divider } from 'antd';
import {
  BellOutlined,
  CheckOutlined,
  AlertOutlined,
  WarningOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import notificationService from '../services/notificationService';
import moment from 'moment';
import 'moment/locale/vi';

moment.locale('vi');

const { Text, Paragraph } = Typography;

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    loadUnreadCount();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      loadUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (dropdownVisible) {
      loadNotifications();
    }
  }, [dropdownVisible]);

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
      if (response.success && response.data) {
        setNotifications(response.data.content);
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
      // Update UI
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

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'URGENT':
        return <AlertOutlined style={{ color: '#ff4d4f' }} />;
      case 'WARNING':
        return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'INFO':
      default:
        return <InfoCircleOutlined style={{ color: '#52c41a' }} />;
    }
  };

  const getPriorityColor = (priorityColor) => {
    return priorityColor || '#52c41a';
  };

  const notificationContent = (
    <div
      style={{
        width: 400,
        maxHeight: 500,
        overflow: 'auto',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          backgroundColor: '#fff',
          zIndex: 1,
        }}
      >
        <Text strong style={{ fontSize: '16px' }}>
          <BellOutlined /> Thông báo
        </Text>
        {unreadCount > 0 && (
          <Button
            type="link"
            size="small"
            onClick={handleMarkAllAsRead}
            icon={<CheckOutlined />}
          >
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <Spin spinning={loading}>
        {notifications.length === 0 ? (
          <Empty
            description="Không có thông báo"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ padding: '40px 0' }}
          />
        ) : (
          <List
            dataSource={notifications}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  backgroundColor: item.isRead ? '#fff' : '#f6ffed',
                  borderLeft: `4px solid ${getPriorityColor(item.priorityColor)}`,
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fafafa';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = item.isRead ? '#fff' : '#f6ffed';
                }}
                onClick={() => !item.isRead && handleMarkAsRead(item.id)}
              >
                <List.Item.Meta
                  avatar={
                    <div
                      style={{
                        fontSize: '24px',
                        marginTop: '4px',
                      }}
                    >
                      {getPriorityIcon(item.priority)}
                    </div>
                  }
                  title={
                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong style={{ fontSize: '14px' }}>
                          {item.title}
                        </Text>
                        {!item.isRead && (
                          <Badge status="processing" />
                        )}
                      </div>
                      <Tag color={item.priorityColor} style={{ fontSize: '11px' }}>
                        {item.priorityLabel}
                      </Tag>
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                      <Paragraph
                        ellipsis={{ rows: 2 }}
                        style={{ fontSize: '13px', marginBottom: 0, color: '#666' }}
                      >
                        {item.message}
                      </Paragraph>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {moment(item.createdAt).fromNow()}
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Spin>

      {/* Footer */}
      {notifications.length > 0 && (
        <div
          style={{
            padding: '8px 16px',
            borderTop: '1px solid #f0f0f0',
            textAlign: 'center',
            position: 'sticky',
            bottom: 0,
            backgroundColor: '#fff',
          }}
        >
          <Button type="link" onClick={() => setDropdownVisible(false)}>
            Đóng
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Dropdown
      dropdownRender={() => notificationContent}
      trigger={['click']}
      open={dropdownVisible}
      onOpenChange={setDropdownVisible}
      placement="bottomRight"
    >
      <Badge count={unreadCount} offset={[-5, 5]} overflowCount={99}>
        <Button
          type="text"
          icon={<BellOutlined style={{ fontSize: '20px' }} />}
          style={{
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      </Badge>
    </Dropdown>
  );
};

export default NotificationDropdown;

