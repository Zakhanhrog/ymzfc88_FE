import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  message, 
  Empty,
  Button
} from 'antd';
import {
  EyeOutlined,
  RightOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import promotionService from '../../../services/promotionService';
import Loading from '../../../components/common/Loading';
import { Icon } from '@iconify/react';

const { Title, Text } = Typography;

const PromotionContent = () => {
  const [promotions, setPromotions] = useState([]);
  const [activePromotions, setActivePromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  const autoScrollIntervalRef = useRef(null);
  const navigate = useNavigate();

  // Load promotions - limit to 6
  const loadPromotions = async () => {
    try {
      setLoading(true);
      const response = await promotionService.getActivePromotions();
      // Limit to 6 promotions
      setPromotions(response.slice(0, 6));
      // For now, activePromotions is empty. In the future, this would be fetched from API
      setActivePromotions([]);
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

  // Auto-scroll carousel
  useEffect(() => {
    const otherPromotions = promotions.filter(p => !activePromotions.some(ap => ap.id === p.id));
    if (otherPromotions.length <= 2) return; // No need to auto-scroll if 2 or fewer items

    // Clear existing interval
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
    }

    // Set up auto-scroll
    autoScrollIntervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, otherPromotions.length - 2);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 3000); // Auto-scroll every 3 seconds

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [promotions, activePromotions]);

  // Scroll to current index
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const firstCard = container.children[0];
      if (firstCard) {
        // Get computed styles to account for gap
        const containerStyle = window.getComputedStyle(container);
        const gap = parseFloat(containerStyle.gap) || 24;
        const cardWidth = firstCard.offsetWidth;
        const scrollLeft = currentIndex * (cardWidth + gap);
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [currentIndex]);

  const handlePrev = () => {
    const otherPromotions = promotions.filter(p => !activePromotions.some(ap => ap.id === p.id));
    setCurrentIndex((prev) => Math.max(0, prev - 1));
    // Reset auto-scroll timer
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const maxIndex = Math.max(0, otherPromotions.length - 2);
          return prev >= maxIndex ? 0 : prev + 1;
        });
      }, 3000);
    }
  };

  const handleNext = () => {
    const otherPromotions = promotions.filter(p => !activePromotions.some(ap => ap.id === p.id));
    const maxIndex = Math.max(0, otherPromotions.length - 2);
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
    // Reset auto-scroll timer
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const maxIndex = Math.max(0, otherPromotions.length - 2);
          return prev >= maxIndex ? 0 : prev + 1;
        });
      }, 3000);
    }
  };

  if (loading) {
    return <Loading />;
  }

  // Filter promotions: activePromotions are those user is using, others are available
  const otherPromotions = promotions.filter(p => !activePromotions.some(ap => ap.id === p.id));

  return (
    <div className="p-6">
      {/* Section 1: Khuyến Mãi Đang Sử Dụng */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <img 
            src="/iconacc/imgi_30_promotion.avif" 
            alt="Promotion" 
            className="w-6 h-6 flex-shrink-0"
            style={{ display: 'block' }}
          />
          <Title level={4} className="!mb-0 text-gray-800 font-semibold" style={{ lineHeight: '24px', margin: 0 }}>
            Khuyến Mãi Đang Sử Dụng
          </Title>
        </div>
        
        {activePromotions.length === 0 ? (
          <Card className="bg-gray-100 border-gray-200">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-gray-400 mb-4">
                <svg 
                  className="w-16 h-16" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" 
                  />
                </svg>
              </div>
              <Text className="text-gray-500 text-base">
                Chưa có thông tin khuyến mãi
              </Text>
            </div>
          </Card>
        ) : (
          <Row gutter={[24, 24]}>
            {activePromotions.map((promotion) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={promotion.id}>
                <Card
                  hoverable
                  className="shadow-md hover:shadow-xl transition-all duration-300 h-full"
                  onClick={() => navigate(`/promotions/${promotion.id}`)}
                >
                  {/* Promotion card content */}
                  <div 
                    className="relative h-48 rounded-lg overflow-hidden mb-4"
                    style={{
                      backgroundImage: promotion.imageUrl 
                        ? `url(${promotion.imageUrl.startsWith('http') ? promotion.imageUrl : `http://localhost:8080/api${promotion.imageUrl}`})`
                        : 'linear-gradient(135deg, #1e3a8a 0%, #065f46 100%)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-green-800/60 p-4 flex flex-col justify-between">
                      <div>
                        <Title level={4} className="text-yellow-300 mb-1 !text-yellow-300 font-bold uppercase">
                          {promotion.title}
                        </Title>
                        <Text className="text-yellow-200 text-lg font-bold uppercase">
                          {promotion.description || promotion.shortDescription}
                        </Text>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* Section 2: Các Khuyến Mãi Khác */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img 
              src="/iconacc/imgi_30_promotion.avif" 
              alt="Promotion" 
              className="w-6 h-6 flex-shrink-0"
              style={{ display: 'block' }}
            />
            <Title level={4} className="!mb-0 text-gray-800 font-semibold" style={{ lineHeight: '24px', margin: 0 }}>
              Các Khuyến Mãi Khác
            </Title>
          </div>
          {otherPromotions.length > 2 && (
            <Button 
              type="link" 
              className="text-green-600 hover:text-green-700 p-0"
              onClick={() => navigate('/promotions')}
            >
              Xem Thêm <RightOutlined className="ml-1" />
            </Button>
          )}
        </div>

        {otherPromotions.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Chưa có khuyến mãi nào"
            />
          </div>
        ) : (
          <div className="relative">
            {/* Navigation Buttons */}
            {otherPromotions.length > 2 && (
              <>
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-transparent flex items-center justify-center hover:bg-gray-100/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-full"
                >
                  <Icon icon="mdi:chevron-left" className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentIndex >= Math.max(0, otherPromotions.length - 2)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-transparent flex items-center justify-center hover:bg-gray-100/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-full"
                >
                  <Icon icon="mdi:chevron-right" className="w-5 h-5 text-gray-700" />
                </button>
              </>
            )}

            {/* Carousel Container */}
            <div 
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-hidden scrollbar-hide"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
                scrollBehavior: 'smooth'
              }}
            >
              {otherPromotions.map((promotion) => (
                <div
                  key={promotion.id}
                  className="flex-shrink-0"
                  style={{ width: 'calc(50% - 12px)' }}
                >
                  <Card
                    hoverable
                    className="shadow-md hover:shadow-xl transition-all duration-300 h-full overflow-hidden"
                    bodyStyle={{ padding: 0 }}
                    onClick={() => navigate(`/promotions/${promotion.id}`)}
                  >
                    <div 
                      className="relative h-48 rounded-lg overflow-hidden group flex"
                    >
                      {/* Background Image */}
                      <div 
                        className="absolute inset-0"
                        style={{
                          backgroundImage: promotion.imageUrl 
                            ? `url(${promotion.imageUrl.startsWith('http') ? promotion.imageUrl : `http://localhost:8080/api${promotion.imageUrl}`})`
                            : 'linear-gradient(135deg, #1e3a8a 0%, #065f46 100%)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'right center',
                          backgroundRepeat: 'no-repeat'
                        }}
                      />
                      
                      {/* Left side - Text and Button */}
                      <div className="relative flex-1 pl-6 pr-4 py-4 flex flex-col justify-center items-start min-w-0 z-10">
                        <div className="mb-3 transition-transform duration-300 ease-out group-hover:-translate-y-2 text-left">
                          <Title 
                            level={4} 
                            className="text-white mb-1 !text-white font-bold uppercase !text-lg drop-shadow-lg !mb-1"
                            style={{ 
                              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                              WebkitTextStroke: '0.5px rgba(0, 0, 0, 0.3)',
                              marginBottom: '4px'
                            }}
                          >
                            {promotion.title}
                          </Title>
                          <Text 
                            className="text-white text-2xl font-bold uppercase block drop-shadow-lg"
                            style={{ 
                              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                              WebkitTextStroke: '0.5px rgba(0, 0, 0, 0.3)',
                              lineHeight: '1.2'
                            }}
                          >
                            {promotion.description || promotion.shortDescription || 'Ưu đãi hấp dẫn'}
                          </Text>
                        </div>
                        <div className="transition-all duration-300 ease-out opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
                          <Button 
                            type="primary"
                            className="promotion-apply-button bg-gradient-to-r from-yellow-400 to-amber-500 border-none text-gray-900 font-semibold shadow-lg px-4 py-1.5 h-auto rounded-lg"
                            style={{ 
                              borderRadius: '15px',
                              background: 'linear-gradient(to right, #facc15, #f59e0b)',
                              border: 'none',
                              color: '#111827'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/promotions/${promotion.id}`);
                            }}
                          >
                            Áp dụng ngay
                          </Button>
                        </div>
                      </div>
                      
                      {/* Right side - Image area (empty, image is in background) */}
                      <div className="relative flex-1"></div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionContent;

