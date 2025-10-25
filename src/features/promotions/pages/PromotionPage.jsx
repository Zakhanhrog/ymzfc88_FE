import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  message, 
  Spin,
  Empty,
  Button
} from 'antd';
import {
  GiftOutlined,
  LoadingOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import promotionService from '../../../services/promotionService';
import Layout from '../../../components/common/Layout';
import PromotionMobileWrapper from '../components/PromotionMobileWrapper';

const { Title, Text } = Typography;

const PromotionPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load promotions
  const loadPromotions = async () => {
    try {
      setLoading(true);
      const response = await promotionService.getActivePromotions();
      setPromotions(response);
    } catch (error) {
      message.error('Không thể tải danh sách khuyến mãi: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    loadPromotions();
  }, []);

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

  return (
    <>
      {/* Mobile Wrapper - Only render on mobile */}
      <div className="md:hidden">
        <PromotionMobileWrapper />
      </div>
      
      {/* Desktop Layout */}
      <div className="hidden md:block">
        <Layout>
          <div className="min-h-screen bg-gray-50">
        {/* Content */}
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Title level={2} className="text-xl md:text-3xl font-bold text-gray-800 mb-4">
              <GiftOutlined className="mr-3 text-red-600" />
              Khuyến mãi
            </Title>
            <Text className="text-lg text-gray-600">
              Các chương trình khuyến mãi hấp dẫn dành cho bạn
            </Text>
          </div>

          {/* Promotions List */}
          {promotions.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Chưa có khuyến mãi nào"
              />
            </div>
          ) : (
            <Row gutter={[24, 24]}>
              {promotions.map((promotion) => (
                <Col xs={24} sm={12} lg={8} xl={6} key={promotion.id}>
                  <Card
                    hoverable
                    className="shadow-md hover:shadow-xl transition-all duration-300 h-full"
                    cover={
                      promotion.imageUrl ? (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            alt={promotion.title}
                            src={promotion.imageUrl.startsWith('http') ? promotion.imageUrl : `https://api.loto79.online/api${promotion.imageUrl}`}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div 
                            className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400"
                            style={{ display: 'none' }}
                          >
                            <GiftOutlined className="text-4xl" />
                          </div>
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                          <GiftOutlined className="text-white text-6xl" />
                        </div>
                      )
                    }
                  >
                    <Card.Meta
                      title={
                        <Title level={4} className="text-gray-800 mb-2">
                          {promotion.title}
                        </Title>
                      }
                      description={
                        <div>
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                            <span>Khuyến mãi</span>
                            <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">
                              Đang diễn ra
                            </span>
                          </div>
                          <Button 
                            type="primary" 
                            icon={<EyeOutlined />}
                            onClick={() => navigate(`/promotions/${promotion.id}`)}
                            className="w-full"
                          >
                            Xem chi tiết
                          </Button>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>
      </Layout>
      </div>
    </>
  );
};

export default PromotionPage;
