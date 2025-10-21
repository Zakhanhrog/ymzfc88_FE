import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Button, 
  Input, 
  message, 
  Spin,
  Space,
  Divider
} from 'antd';
import {
  MessageOutlined,
  FacebookOutlined,
  SendOutlined,
  PhoneOutlined,
  EditOutlined,
  SaveOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import contactService from '../../../services/contactService';

const { Title, Text } = Typography;

const ContactLinksManagement = () => {
  const [contactLinks, setContactLinks] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [editingLink, setEditingLink] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Định nghĩa các thẻ contact
  const contactCards = [
    {
      id: 'livechat',
      title: 'Livechat 24/24',
      icon: <MessageOutlined className="text-2xl" />,
      description: 'Hỗ trợ trực tuyến 24/7',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      iconBg: 'bg-blue-100'
    },
    {
      id: 'facebook',
      title: 'Kênh Facebook',
      icon: <FacebookOutlined className="text-2xl" />,
      description: 'Theo dõi trang Facebook chính thức',
      color: 'from-blue-600 to-blue-700',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      iconBg: 'bg-blue-100'
    },
    {
      id: 'messenger',
      title: 'Messenger Facebook',
      icon: <SendOutlined className="text-2xl" />,
      description: 'Chat trực tiếp qua Messenger',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700',
      iconBg: 'bg-indigo-100'
    },
    {
      id: 'telegram',
      title: 'Telegram',
      icon: <MessageOutlined className="text-2xl" />,
      description: 'Liên hệ qua Telegram',
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-700',
      iconBg: 'bg-cyan-100'
    },
    {
      id: 'hotline',
      title: 'Hotline',
      icon: <PhoneOutlined className="text-2xl" />,
      description: 'Gọi điện trực tiếp',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      iconBg: 'bg-green-100'
    }
  ];

  // Load contact links
  const loadContactLinks = async () => {
    try {
      setLoading(true);
      const links = await contactService.getContactLinksAdmin();
      setContactLinks(links);
    } catch (error) {
      message.error('Không thể tải danh sách links: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật link
  const updateLink = async (linkType, linkUrl) => {
    try {
      setUpdating(prev => ({ ...prev, [linkType]: true }));
      await contactService.updateContactLink(linkType, linkUrl);
      setContactLinks(prev => ({ ...prev, [linkType]: linkUrl }));
      setEditingLink(null);
      message.success('Cập nhật link thành công!');
    } catch (error) {
      message.error('Không thể cập nhật link: ' + (error.response?.data?.message || error.message));
    } finally {
      setUpdating(prev => ({ ...prev, [linkType]: false }));
    }
  };

  // Bắt đầu edit
  const startEdit = (linkType) => {
    setEditingLink(linkType);
    setEditValue(contactLinks[linkType] || '');
  };

  // Hủy edit
  const cancelEdit = () => {
    setEditingLink(null);
    setEditValue('');
  };

  // Lưu edit
  const saveEdit = () => {
    if (editValue.trim()) {
      updateLink(editingLink, editValue.trim());
    } else {
      message.warning('Vui lòng nhập link hợp lệ');
    }
  };

  // Load data khi component mount
  useEffect(() => {
    loadContactLinks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Title level={2} className="mb-2">
            Quản lý Links Liên hệ
          </Title>
          <Text type="secondary" className="text-lg">
            Cài đặt link cho các thẻ liên hệ trên trang liên hệ
          </Text>
        </div>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={loadContactLinks}
          loading={loading}
        >
          Làm mới
        </Button>
      </div>

      {/* Contact Cards */}
      <Row gutter={[24, 24]}>
        {contactCards.map((card) => (
          <Col xs={24} sm={12} lg={8} xl={8} key={card.id}>
            <Card
              className="shadow-md hover:shadow-xl transition-all duration-300 h-full"
              bodyStyle={{ padding: '24px' }}
            >
              <div className="text-center">
                <div className={`w-20 h-20 rounded-full ${card.iconBg} flex items-center justify-center ${card.textColor} mx-auto mb-4`}>
                  {card.icon}
                </div>
                <Title level={4} className={`mb-2 ${card.textColor}`}>
                  {card.title}
                </Title>
                <Text type="secondary" className="text-base mb-4 block">
                  {card.description}
                </Text>
                
                <Divider />
                
                {/* Link Display/Edit */}
                <div className="mb-4">
                  {editingLink === card.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        placeholder="Nhập link..."
                        size="large"
                      />
                      <Space>
                        <Button 
                          type="primary" 
                          icon={<SaveOutlined />}
                          onClick={saveEdit}
                          loading={updating[card.id]}
                          size="small"
                        >
                          Lưu
                        </Button>
                        <Button 
                          onClick={cancelEdit}
                          size="small"
                        >
                          Hủy
                        </Button>
                      </Space>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-2">
                        <Text strong>Link hiện tại:</Text>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg mb-3">
                        <Text 
                          code 
                          className="break-all"
                          style={{ fontSize: '12px' }}
                        >
                          {contactLinks[card.id] || 'Chưa có link'}
                        </Text>
                      </div>
                      <Button 
                        type="primary" 
                        icon={<EditOutlined />}
                        onClick={() => startEdit(card.id)}
                        size="small"
                      >
                        Chỉnh sửa
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className={`w-full h-1 rounded-full bg-gradient-to-r ${card.color}`}></div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Instructions */}
      <Card>
        <Title level={4}>Hướng dẫn sử dụng:</Title>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Nhấn "Chỉnh sửa" để thay đổi link cho từng thẻ liên hệ</li>
          <li>Link có thể là URL website, link Telegram, số điện thoại (tel:), hoặc link Facebook Messenger</li>
          <li>Đối với Hotline, có thể sử dụng định dạng: <code>tel:+84901234567</code></li>
          <li>Đối với Messenger, có thể sử dụng link: <code>https://m.me/yourpage</code></li>
          <li>Đối với Telegram, có thể sử dụng link: <code>https://t.me/yourusername</code></li>
          <li>Thay đổi sẽ có hiệu lực ngay lập tức trên trang liên hệ</li>
        </ul>
      </Card>
    </div>
  );
};

export default ContactLinksManagement;
