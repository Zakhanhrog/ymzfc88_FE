import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, message, Spin } from 'antd';
import {
  MessageOutlined,
  FacebookOutlined,
  SendOutlined,
  PhoneOutlined,
  CustomerServiceOutlined
} from '@ant-design/icons';
import contactService from '../../../services/contactService';
import Layout from '../../../components/common/Layout';

const { Title, Text } = Typography;

const ContactPage = () => {
  const [contactLinks, setContactLinks] = useState({});
  const [loading, setLoading] = useState(true);

  const contactCards = [
    {
      id: 1,
      key: 'livechat',
      title: 'Livechat 24/24',
      icon: <MessageOutlined className="text-2xl" />,
      description: 'Hỗ trợ trực tuyến 24/7',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      iconBg: 'bg-blue-100'
    },
    {
      id: 2,
      key: 'facebook',
      title: 'Kênh Facebook',
      icon: <FacebookOutlined className="text-2xl" />,
      description: 'Theo dõi trang Facebook chính thức',
      color: 'from-blue-600 to-blue-700',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      iconBg: 'bg-blue-100'
    },
    {
      id: 3,
      key: 'messenger',
      title: 'Messenger Facebook',
      icon: <SendOutlined className="text-2xl" />,
      description: 'Chat trực tiếp qua Messenger',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700',
      iconBg: 'bg-indigo-100'
    },
    {
      id: 4,
      key: 'telegram',
      title: 'Telegram',
      icon: <MessageOutlined className="text-2xl" />,
      description: 'Liên hệ qua Telegram',
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-700',
      iconBg: 'bg-cyan-100'
    },
    {
      id: 5,
      key: 'hotline',
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
      const links = await contactService.getContactLinks();
      setContactLinks(links);
    } catch (error) {
      console.error('Error loading contact links:', error);
      message.error('Không thể tải danh sách liên hệ');
    } finally {
      setLoading(false);
    }
  };

  // Handle card click
  const handleCardClick = (card) => {
    const link = contactLinks[card.key];
    if (link && link !== '#') {
      // Mở link trong tab mới
      window.open(link, '_blank');
    } else {
      message.info('Link chưa được cấu hình');
    }
  };

  // Load data when component mounts
  useEffect(() => {
    loadContactLinks();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">

      {/* Content */}
      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Title level={2} className="text-xl md:text-3xl font-bold text-gray-800 mb-4">
            <CustomerServiceOutlined className="mr-3 text-blue-600" />
            Liên hệ hỗ trợ
          </Title>
          <Text className="text-lg text-gray-600">
            Chọn phương thức liên hệ phù hợp với bạn
          </Text>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* Mobile Layout - Single Column */}
            <div className="md:hidden space-y-4">
              {contactCards.map((card) => (
                <Card
                  key={card.id}
                  className="shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-0"
                  bodyStyle={{ padding: '20px' }}
                  onClick={() => handleCardClick(card)}
                >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full ${card.iconBg} flex items-center justify-center ${card.textColor}`}>
                  {card.icon}
                </div>
                <div className="flex-1">
                  <Title level={4} className={`mb-1 ${card.textColor}`}>
                    {card.title}
                  </Title>
                  <Text type="secondary" className="text-sm">
                    {card.description}
                  </Text>
                </div>
                <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${card.color} flex items-center justify-center`}>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Card>
          ))}
        </div>

            {/* Desktop Layout - Grid */}
            <div className="hidden md:block">
              <Row gutter={[24, 24]}>
                {contactCards.map((card) => (
                  <Col xs={24} sm={12} lg={8} xl={8} key={card.id}>
                    <Card
                      className="shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border-0 h-full"
                      bodyStyle={{ padding: '32px' }}
                      onClick={() => handleCardClick(card)}
                    >
                  <div className="text-center">
                    <div className={`w-20 h-20 rounded-full ${card.iconBg} flex items-center justify-center ${card.textColor} mx-auto mb-4`}>
                      {card.icon}
                    </div>
                    <Title level={3} className={`mb-2 ${card.textColor}`}>
                      {card.title}
                    </Title>
                    <Text type="secondary" className="text-base mb-4 block">
                      {card.description}
                    </Text>
                    <div className={`w-full h-1 rounded-full bg-gradient-to-r ${card.color}`}></div>
                  </div>
                </Card>
              </Col>
                ))}
              </Row>
            </div>
          </>
        )}
      </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
