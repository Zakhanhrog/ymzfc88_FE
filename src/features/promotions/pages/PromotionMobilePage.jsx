import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  message, 
  Empty,
  Button
} from 'antd';
import {
  GiftOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/common/Layout';
import Loading from '../../../components/common/Loading';
import promotionService from '../../../services/promotionService';

const { Title, Text } = Typography;

const PromotionMobilePage = ({ isOpen, onClose }) => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
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
  }, []); // Chỉ chạy một lần khi mount

  if (!isOpen) return null;

  return (
    <Layout>
      <div className="md:hidden w-full bg-gray-50 pb-20 pt-3">
      {/* Content */}
        <div className="px-0 pt-3">
        {loading ? (
          <Loading />
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
                    className="shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden p-0"
                    bodyStyle={{ padding: 0 }}
                  >
                    <div 
                      className="relative h-36 p-5 flex flex-col justify-between"
                      style={{
                        backgroundImage: promotion.imageUrl 
                          ? `url(${promotion.imageUrl.startsWith('http') ? promotion.imageUrl : `http://localhost:8080/api${promotion.imageUrl}`})`
                          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
                          >
                      {/* Content overlay */}
                      <div className="relative z-10">
                        {/* Title - Oswald font, smaller */}
                        <Title 
                          level={4} 
                          className="text-white mb-1 !text-white drop-shadow-lg font-oswald !text-base !font-bold uppercase"
                          style={{ fontFamily: "'Oswald', sans-serif" }}
                        >
                          {promotion.title}
                        </Title>

                        {/* Description - Larger than title, keep current font */}
                        <Text className="block text-lg md:text-xl font-bold mb-4 text-white drop-shadow-md uppercase">
                          {promotion.description || promotion.shortDescription || 'Ưu đãi hấp dẫn đang diễn ra, tham gia ngay!'}
                        </Text>

                        {/* CTA Button */}
                          <Button 
                            onClick={() => navigate(`/promotions/${promotion.id}`)}
                          className="!bg-gradient-to-r !from-yellow-400 !to-amber-500 !border-none hover:!from-yellow-500 hover:!to-amber-600 !text-gray-900 !font-semibold"
                          style={{ 
                            borderRadius: '8px',
                            background: 'linear-gradient(to right, #facc15, #f59e0b)',
                            border: 'none',
                            color: '#111827'
                          }}
                          >
                          Xem khuyến mãi
                          </Button>
                        </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
    </Layout>
  );
};

export default PromotionMobilePage;
