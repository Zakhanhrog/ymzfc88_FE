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
  CalendarOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import promotionService from '../../../services/promotionService';

const { Title, Text, Paragraph } = Typography;

const PromotionDetailMobilePage = ({ isOpen, onClose }) => {
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
      onClose();
    } finally {
      setLoading(false);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    if (isOpen && id) {
      loadPromotionDetail();
    }
  }, [isOpen, id]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-white overflow-y-auto promotion-detail-mobile-container"
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
            Chi tiết khuyến mãi
          </Title>
          <div className="w-8"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <div 
        className="p-4 pb-20 overflow-y-auto promotion-detail-mobile-content"
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
        ) : promotion ? (
          <div className="space-y-4">
            {/* Image */}
            {promotion.imageUrl && (
              <div className="relative h-48 overflow-hidden rounded-lg">
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
                  <GiftOutlined className="text-4xl" />
                </div>
              </div>
            )}

            {/* Title and Status */}
            <Card className="shadow-sm">
              <Title level={3} className="text-gray-800 mb-3">
                {promotion.title}
              </Title>
              <div className="flex items-center space-x-3">
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
                  Đang diễn ra
                </span>
                <span className="flex items-center text-sm text-gray-500">
                  <CalendarOutlined className="mr-1" />
                  Khuyến mãi
                </span>
              </div>
            </Card>

            {/* Description */}
            <Card className="shadow-sm">
              <Title level={4} className="text-gray-800 mb-3">Mô tả chi tiết</Title>
              <Paragraph className="text-gray-600 leading-relaxed">
                {promotion.description}
              </Paragraph>
            </Card>

            {/* Terms */}
            {promotion.terms && (
              <Card className="shadow-sm">
                <Title level={4} className="text-gray-800 mb-3">Điều khoản và điều kiện</Title>
                <Paragraph className="text-gray-600 leading-relaxed">
                  {promotion.terms}
                </Paragraph>
              </Card>
            )}

            {/* Contact Info */}
            <Card className="shadow-sm bg-blue-50 border-blue-200">
              <Title level={5} className="text-blue-800 mb-2">Thông tin liên hệ</Title>
              <Text className="text-blue-700">
                Để được hỗ trợ về khuyến mãi này, vui lòng liên hệ với chúng tôi qua hotline hoặc chat trực tuyến.
              </Text>
            </Card>
          </div>
        ) : (
          <div className="text-center py-20">
            <Title level={3} className="text-gray-600">Không tìm thấy khuyến mãi</Title>
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

export default PromotionDetailMobilePage;
