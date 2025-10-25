import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  message, 
  Spin,
  Button,
  Divider,
  Tag
} from 'antd';
import {
  BellOutlined,
  LoadingOutlined,
  ArrowLeftOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import notificationService from '../services/notificationService';
import moment from 'moment';
import 'moment/locale/vi';

moment.locale('vi');

const { Title, Text, Paragraph } = Typography;

const NotificationDetailMobilePage = ({ isOpen, onClose }) => {
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  // Load notification detail
  const loadNotificationDetail = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotificationById(id);
      if (response.success) {
        setNotification(response.data);
        // Mark as read if not already read
        if (!response.data.isRead) {
          await notificationService.markAsRead(id);
        }
      } else {
        throw new Error('Không thể tải thông báo');
      }
    } catch (error) {
      message.error('Không thể tải chi tiết thông báo: ' + (error.message || error.response?.data?.message));
      onClose();
    } finally {
      setLoading(false);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    if (isOpen && id) {
      loadNotificationDetail();
    }
  }, [isOpen, id]);

  const getNotificationIcon = (type) => {
    const icons = {
      INFO: <InfoCircleOutlined style={{ color: '#1890ff', fontSize: '20px' }} />,
      SUCCESS: <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '20px' }} />,
      WARNING: <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: '20px' }} />,
      ERROR: <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '20px' }} />,
    };
    return icons[type] || <BellOutlined style={{ color: '#666', fontSize: '20px' }} />;
  };

  const getNotificationTypeColor = (type) => {
    const colors = {
      INFO: 'blue',
      SUCCESS: 'green',
      WARNING: 'orange',
      ERROR: 'red',
    };
    return colors[type] || 'default';
  };

  const getNotificationTypeText = (type) => {
    const texts = {
      INFO: 'Thông tin',
      SUCCESS: 'Thành công',
      WARNING: 'Cảnh báo',
      ERROR: 'Lỗi',
    };
    return texts[type] || 'Thông báo';
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-white overflow-y-auto notification-detail-mobile-container"
      style={{ 
        overflowY: 'auto !important',
        scrollbarWidth: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <Button 
            icon={<ArrowLeftOutlined />}
            onClick={onClose}
            className="flex items-center text-gray-600 hover:text-gray-800"
            type="text"
          />
          <Title level={5} className="mb-0 text-gray-800 text-center flex-1">
            Chi tiết thông báo
          </Title>
          <div className="w-8"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <div 
        className="p-4 pb-20 overflow-y-auto notification-detail-mobile-content"
        style={{ 
          overflowY: 'auto !important',
          scrollbarWidth: 'auto',
          WebkitOverflowScrolling: 'touch',
          height: 'calc(100vh - 80px)'
        }}
      >
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : notification ? (
          <div className="space-y-4">
            {/* Header with icon and type */}
            <Card className="shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                {getNotificationIcon(notification.type)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Title level={3} className="text-gray-800 mb-0">
                      {notification.title}
                    </Title>
                    <Tag color={getNotificationTypeColor(notification.type)} size="small">
                      {getNotificationTypeText(notification.type)}
                    </Tag>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <span className="flex items-center">
                      <CalendarOutlined className="mr-1" />
                      {moment(notification.createdAt).format('DD/MM/YYYY HH:mm')}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Message */}
            <Card className="shadow-sm">
              <Title level={4} className="text-gray-800 mb-3">Nội dung thông báo</Title>
              <Paragraph className="text-gray-600 leading-relaxed">
                {notification.message}
              </Paragraph>
            </Card>

            {/* Additional Info */}
            {notification.data && (
              <Card className="shadow-sm">
                <Title level={4} className="text-gray-800 mb-3">Thông tin bổ sung</Title>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(notification.data, null, 2)}
                  </pre>
                </div>
              </Card>
            )}

            {/* Status */}
            <Card className="shadow-sm bg-blue-50 border-blue-200">
              <Title level={5} className="text-blue-800 mb-2">Trạng thái</Title>
              <Text className="text-blue-700">
                {notification.isRead ? 'Đã đọc' : 'Chưa đọc'}
              </Text>
            </Card>
          </div>
        ) : (
          <div className="text-center py-20">
            <Title level={3} className="text-gray-600">Không tìm thấy thông báo</Title>
            <Button 
              type="primary" 
              onClick={onClose}
              className="mt-4"
            >
              Quay lại
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDetailMobilePage;

