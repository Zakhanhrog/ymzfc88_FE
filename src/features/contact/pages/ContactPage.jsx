import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, message } from 'antd';
import contactService from '../../../services/contactService';
import Layout from '../../../components/common/Layout';
import Loading from '../../../components/common/Loading';

const { Title, Text } = Typography;

const ContactPage = () => {
  const [contactLinks, setContactLinks] = useState({});
  const [loading, setLoading] = useState(true);

  const contactCards = [
    {
      id: 1,
      key: 'livechat',
      title: 'Livechat 24/24',
      icon: '/iconhotro/imgi_138_livechat.svg',
      description: 'Hỗ trợ trực tuyến 24/7',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      id: 2,
      key: 'facebook',
      title: 'Kênh Facebook',
      icon: '/iconhotro/imgi_139_facebook.svg',
      description: 'Theo dõi trang Facebook chính thức',
      color: 'from-blue-600 to-blue-700',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      id: 3,
      key: 'messenger',
      title: 'Messenger Facebook',
      icon: '/iconhotro/imgi_140_messenger.svg',
      description: 'Chat trực tiếp qua Messenger',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700'
    },
    {
      id: 4,
      key: 'telegram',
      title: 'Telegram',
      icon: '/iconhotro/imgi_141_telegram_chanel.svg',
      description: 'Liên hệ qua Telegram',
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-700'
    },
    {
      id: 5,
      key: 'hotline',
      title: 'Hotline',
      icon: '/iconhotro/imgi_138_livechat.svg', // Sử dụng livechat icon cho hotline
      description: 'Gọi điện trực tiếp',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
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
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">

      {/* Content */}
      <div className="px-0 md:p-8 pt-3 md:pt-8">
        {loading ? (
          <Loading />
        ) : (
          <>
            {/* Mobile Layout - Single Column */}
            <div className="md:hidden space-y-3">
              {contactCards.map((card) => (
                <Card
                  key={card.id}
                  className="shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-0"
                  bodyStyle={{ padding: '14px 16px' }}
                  onClick={() => handleCardClick(card)}
                >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <img src={card.icon} alt={card.title} className="w-10 h-10" />
                </div>
                <div className="flex-1 min-w-0">
                  <Title level={4} className={`mb-0.5 text-sm ${card.textColor} !mb-0`}>
                    {card.title}
                  </Title>
                  <Text type="secondary" className="text-xs">
                    {card.description}
                  </Text>
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
                    <div className="w-20 h-20 flex items-center justify-center mx-auto mb-4">
                      <img src={card.icon} alt={card.title} className="w-20 h-20" />
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
