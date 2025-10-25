import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  message, 
  Spin,
  Button,
  Divider
} from 'antd';
import {
  GiftOutlined,
  LoadingOutlined,
  ArrowLeftOutlined,
  CalendarOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import promotionService from '../../../services/promotionService';
import Layout from '../../../components/common/Layout';
import PromotionMobileWrapper from '../components/PromotionMobileWrapper';

const { Title, Text, Paragraph } = Typography;

const PromotionDetailPage = () => {
  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  // Load promotion detail
  const loadPromotionDetail = async () => {
    try {
      setLoading(true);
      const response = await promotionService.getPromotionById(id);
      setPromotion(response);
    } catch (error) {
      message.error('Không thể tải chi tiết khuyến mãi: ' + (error.response?.data?.message || error.message));
      navigate('/promotions');
    } finally {
      setLoading(false);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    if (id) {
      loadPromotionDetail();
    }
  }, [id]);

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

  if (!promotion) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50">
          <div className="p-4 md:p-8">
            <div className="text-center py-20">
              <Title level={3} className="text-gray-600">Không tìm thấy khuyến mãi</Title>
              <Button 
                type="primary" 
                onClick={() => navigate('/promotions')}
                className="mt-4"
              >
                Quay lại danh sách
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
        <PromotionMobileWrapper />
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
              onClick={() => navigate('/promotions')}
              className="mb-4"
            >
              Quay lại
            </Button>
            <Title level={2} className="text-xl md:text-3xl font-bold text-gray-800 mb-4">
              <GiftOutlined className="mr-3 text-red-600" />
              Chi tiết khuyến mãi
            </Title>
          </div>

          {/* Promotion Detail */}
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg">
              {/* Image */}
              {promotion.imageUrl && (
                <div className="mb-6">
                  <div className="relative h-64 md:h-96 overflow-hidden rounded-lg">
                    <img
                      alt={promotion.title}
                      src={promotion.imageUrl.startsWith('http') ? promotion.imageUrl : `https://api.loto79.online/api${promotion.imageUrl}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div 
                      className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400"
                      style={{ display: 'none' }}
                    >
                      <GiftOutlined className="text-6xl" />
                    </div>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <Title level={2} className="text-gray-800 mb-2">
                    {promotion.title}
                  </Title>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full">
                      Đang diễn ra
                    </span>
                    <span className="flex items-center">
                      <CalendarOutlined className="mr-1" />
                      Khuyến mãi
                    </span>
                  </div>
                </div>

                <Divider />

                {/* Description */}
                <div>
                  <Title level={4} className="text-gray-800 mb-3">Mô tả chi tiết</Title>
                  <Paragraph className="text-gray-600 text-lg leading-relaxed">
                    {promotion.description}
                  </Paragraph>
                </div>

                {/* Additional Info */}
                {promotion.terms && (
                  <div>
                    <Title level={4} className="text-gray-800 mb-3">Điều khoản và điều kiện</Title>
                    <Paragraph className="text-gray-600 leading-relaxed">
                      {promotion.terms}
                    </Paragraph>
                  </div>
                )}

                {/* Contact Info */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <Title level={5} className="text-blue-800 mb-2">Thông tin liên hệ</Title>
                  <Text className="text-blue-700">
                    Để được hỗ trợ về khuyến mãi này, vui lòng liên hệ với chúng tôi qua hotline hoặc chat trực tuyến.
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

export default PromotionDetailPage;
