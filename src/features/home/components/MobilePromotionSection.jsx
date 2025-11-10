import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Button, message } from 'antd';
import promotionService from '../../../services/promotionService';

const { Title, Text } = Typography;

const MobilePromotionSection = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // Load promotions
  useEffect(() => {
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

    loadPromotions();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(promotions.length - 1, prev + 1));
  };

  if (loading || promotions.length === 0) {
    return null;
  }

  const currentPromotion = promotions[currentIndex];

  return (
    <div className="w-full pt-0.5 pb-0 mb-0.5">
      <div className="w-full px-0 pb-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-2 px-0">
          <div className="flex items-center gap-2 px-0">
            <h2 className="text-base font-black text-gray-800 pl-2 pr-8 py-2 rounded-md bg-gradient-to-r from-green-400 via-green-200 to-transparent uppercase relative flex items-center tracking-wide font-oswald" style={{ fontWeight: 900, fontFamily: "'Oswald', sans-serif" }}>
              <span className="absolute left-0 w-1 h-5 bg-green-300 rounded-r-md"></span>
              <span className="relative pl-1" style={{ fontFamily: "'Oswald', sans-serif" }}>KHUYẾN MÃI</span>
            </h2>
            
            {/* Navigation Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="w-6 h-6 bg-white rounded-none flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Icon icon="mdi:chevron-left" className="text-gray-600 text-base" />
              </button>
              
              <button
                onClick={handleNext}
                disabled={currentIndex >= promotions.length - 1}
                className="w-6 h-6 bg-white rounded-none flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Icon icon="mdi:chevron-right" className="text-gray-600 text-base" />
              </button>
            </div>
          </div>

          {/* View Details Button */}
          <button 
            onClick={() => navigate('/promotions')}
            className="text-green-600 hover:text-green-700 text-xs font-medium transition-colors px-0"
          >
            Xem chi tiết
          </button>
        </div>

        {/* Promotion Card - Show only one at a time */}
        <div className="relative w-full px-0">
          <Card
            className="shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden p-0"
            bodyStyle={{ padding: 0 }}
          >
            <div 
              className="relative h-36 p-5 flex flex-col justify-between"
              style={{
                backgroundImage: currentPromotion.imageUrl 
                  ? `url(${currentPromotion.imageUrl.startsWith('http') ? currentPromotion.imageUrl : `https://api.tathiet168.com/api${currentPromotion.imageUrl}`})`
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
                  {currentPromotion.title}
                </Title>

                {/* Description - Larger than title, keep current font */}
                <Text className="block text-lg md:text-xl font-bold mb-4 text-white drop-shadow-md uppercase">
                  {currentPromotion.description || currentPromotion.shortDescription || 'Ưu đãi hấp dẫn đang diễn ra, tham gia ngay!'}
                </Text>

                {/* CTA Button */}
                <Button 
                  onClick={() => navigate(`/promotions/${currentPromotion.id}`)}
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
        </div>
      </div>
    </div>
  );
};

export default MobilePromotionSection;

