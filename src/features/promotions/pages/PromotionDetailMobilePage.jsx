import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  message, 
  Button,
  Divider
} from 'antd';
import {
  GiftOutlined,
  ArrowLeftOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../../components/common/Layout';
import Loading from '../../../components/common/Loading';
import promotionService from '../../../services/promotionService';

const { Title, Text, Paragraph } = Typography;

const PromotionDetailMobilePage = ({ isOpen, onClose }) => {
  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(false);
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
    if (id) {
      loadPromotionDetail();
    }
  }, [id]); // Chỉ phụ thuộc vào id, không phụ thuộc vào isOpen

  if (!isOpen) return null;

  return (
    <Layout>
      <div className="md:hidden w-full bg-white pb-20 pt-3">
      {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
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
        <div className="p-4">
        {loading ? (
          <Loading />
        ) : promotion ? (
          <div className="space-y-4">
            {/* Image */}
            {promotion.imageUrl && (
              <div className="relative h-48 overflow-hidden rounded-lg">
                <img
                  alt={promotion.title}
                  src={promotion.imageUrl.startsWith('http') ? promotion.imageUrl : `http://localhost:8080/api${promotion.imageUrl}`}
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
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
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
    </Layout>
  );
};

export default PromotionDetailMobilePage;
