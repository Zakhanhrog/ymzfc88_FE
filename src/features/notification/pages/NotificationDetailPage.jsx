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
import Layout from '../../../components/common/Layout';
import NotificationMobileWrapper from '../components/NotificationMobileWrapper';
import moment from 'moment';
import 'moment/locale/vi';

moment.locale('vi');

const { Title, Text, Paragraph } = Typography;

const NotificationDetailPage = () => {
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
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    if (id) {
      loadNotificationDetail();
    }
  }, [id]);

  const getNotificationIcon = (type) => {
    const icons = {
      INFO: <InfoCircleOutlined style={{ color: '#1890ff', fontSize: '24px' }} />,
      SUCCESS: <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '24px' }} />,
      WARNING: <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: '24px' }} />,
      ERROR: <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '24px' }} />,
    };
    return icons[type] || <BellOutlined style={{ color: '#666', fontSize: '24px' }} />;
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

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50">
          <div className="p-4 md:p-8">
            <div className="flex justify-center items-center h-64">
              <Spin size="large" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!notification) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50">
          <div className="p-4 md:p-8">
            <div className="text-center py-20">
              <Title level={3} className="text-gray-600">Không tìm thấy thông báo</Title>
              <Button 
                type="primary" 
                onClick={() => navigate('/')}
                className="mt-4"
              >
                Quay lại trang chủ
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      {/* Mobile Wrapper - Only render on mobile */}
      <div className="md:hidden">
        <NotificationMobileWrapper />
      </div>
      
      {/* Desktop Layout */}
      <div className="hidden md:block">
        <Layout>
          <div className="min-h-screen bg-gray-50">
            <div className="p-4 md:p-8">
              {/* Header */}
              <div className="mb-6">
                <Button 
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate('/')}
                  className="mb-4"
                >
                  Quay lại
                </Button>
                <Title level={2} className="text-xl md:text-3xl font-bold text-gray-800 mb-4">
                  <BellOutlined className="mr-3 text-blue-600" />
                  Chi tiết thông báo
                </Title>
              </div>

              {/* Notification Detail */}
              <div className="max-w-4xl mx-auto">
                <Card className="shadow-lg">
                  {/* Header with icon and type */}
                  <div className="flex items-start gap-4 mb-6">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Title level={2} className="text-gray-800 mb-0">
                          {notification.title}
                        </Title>
                        <Tag color={getNotificationTypeColor(notification.type)}>
                          {getNotificationTypeText(notification.type)}
                        </Tag>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <CalendarOutlined className="mr-1" />
                          {moment(notification.createdAt).format('DD/MM/YYYY HH:mm')}
                        </span>
                        <span className="flex items-center">
                          {moment(notification.createdAt).fromNow()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Divider />

                  {/* Content */}
                  <div className="space-y-6">
                    {/* Message */}
                    <div>
                      <Title level={4} className="text-gray-800 mb-3">Nội dung thông báo</Title>
                      <Paragraph className="text-gray-600 text-lg leading-relaxed">
                        {notification.message}
                      </Paragraph>
                    </div>

                    {/* Additional Info */}
                    {notification.data && (
                      <div>
                        <Title level={4} className="text-gray-800 mb-3">Thông tin bổ sung</Title>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                            {JSON.stringify(notification.data, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Status */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <Title level={5} className="text-blue-800 mb-2">Trạng thái</Title>
                      <Text className="text-blue-700">
                        {notification.isRead ? 'Đã đọc' : 'Chưa đọc'}
                      </Text>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </Layout>
      </div>
    </>
  );
};

export default NotificationDetailPage;

