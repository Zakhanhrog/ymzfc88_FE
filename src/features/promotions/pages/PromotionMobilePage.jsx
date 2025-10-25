import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  message, 
  Spin,
  Empty,
  Button
} from 'antd';
import {
  GiftOutlined,
  CloseOutlined,
  LoadingOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import promotionService from '../../../services/promotionService';

const { Title, Text } = Typography;

const PromotionMobilePage = ({ isOpen, onClose }) => {
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
    if (isOpen) {
      loadPromotions();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-white overflow-y-auto promotion-mobile-container"
      style={{ 
        overflowY: 'auto !important',
        scrollbarWidth: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <Title level={5} className="mb-0 text-gray-800 text-left">
            Khuyến mãi
          </Title>
          <Button 
            onClick={onClose}
            className="flex items-center text-gray-600 hover:text-gray-800"
            type="text"
            icon={<CloseOutlined />}
          />
        </div>
      </div>

      {/* Content */}
      <div 
        className="p-4 pb-20 overflow-y-auto promotion-mobile-content"
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
        ) : (
          <>
            {/* Promotions List */}
            {promotions.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Chưa có khuyến mãi nào"
                />
              </div>
            ) : (
              <div className="space-y-4">
                {promotions.map((promotion) => (
                  <Card
                    key={promotion.id}
                    className="shadow-md hover:shadow-lg transition-all duration-300"
                    cover={
                      promotion.imageUrl ? (
                        <div className="relative h-48 overflow-hidden">
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
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-500">Khuyến mãi</span>
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
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PromotionMobilePage;
