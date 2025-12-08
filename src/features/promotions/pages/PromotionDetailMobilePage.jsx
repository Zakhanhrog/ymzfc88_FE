import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  message, 
  Button,
  Empty
} from 'antd';
import {
  GiftOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import Layout from '../../../components/common/Layout';
import Loading from '../../../components/common/Loading';
import MobileDepositHeader from '../../../components/common/layout/MobileDepositHeader';
import promotionService from '../../../services/promotionService';
import { API_BASE_URL } from '../../../utils/constants';
import moment from 'moment';
import 'moment/locale/vi';

moment.locale('vi');

const { Title, Text } = Typography;

const PromotionDetailMobilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPromotionDetail();
  }, [id]);

  const loadPromotionDetail = async () => {
    try {
      setLoading(true);
      const response = await promotionService.getPromotionById(id);
      if (response && response.data) {
        setPromotion(response.data);
      } else if (response) {
        // Nếu response không có data wrapper
        setPromotion(response);
      }
    } catch (error) {
      message.error('Không thể tải chi tiết khuyến mãi: ' + (error.response?.data?.message || error.message));
      navigate('/promotions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <MobileDepositHeader title="Chi tiết khuyến mãi" backPath="/promotions" />
        <Layout>
          <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-[56px]">
            <Loading />
          </div>
        </Layout>
      </>
    );
  }

  if (!promotion) {
    return (
      <>
        <MobileDepositHeader title="Chi tiết khuyến mãi" backPath="/promotions" />
        <Layout>
          <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-[56px]">
            <Empty description="Không tìm thấy khuyến mãi" />
          </div>
        </Layout>
      </>
    );
  }

  // Xử lý image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${API_BASE_URL}${imageUrl}`;
  };

  // Convert relative URLs trong HTML thành full URLs để hiển thị ảnh
  const processDetailsHtml = (html) => {
    if (!html) return html;
    // Thay thế tất cả relative URL trong thẻ img thành full URL
    return html.replace(
      /src="(\/uploads\/[^"]+)"/g,
      `src="${API_BASE_URL}$1"`
    );
  };

  return (
    <>
      <MobileDepositHeader title="Chi tiết khuyến mãi" backPath="/promotions" />
      <Layout>
        <div className="min-h-screen bg-gray-50 pt-2 pb-20">
          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="w-full">
              {/* Header Image */}
              {promotion.imageUrl && (
                <div className="w-full">
                  <img
                    src={getImageUrl(promotion.imageUrl)}
                    alt={promotion.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Content */}
              <div className="bg-white rounded-t-2xl -mt-4 relative z-10 px-4 py-6 space-y-4">
                {/* Title */}
                <Title level={2} className="text-xl font-bold text-gray-900 mb-2 !mb-2">
                  {promotion.title}
                </Title>

                {/* Meta Information */}
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-gray-500">
                    <CalendarOutlined className="text-sm" />
                    <Text className="text-xs">
                      {moment(promotion.createdAt).format('DD/MM/YYYY HH:mm')}
                    </Text>
                  </div>
                  {promotion.isActive && (
                    <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-xs font-semibold">
                      Đang diễn ra
                    </span>
                  )}
                </div>

                {/* Description */}
                {promotion.description && (
                  <div className="pt-2">
                    <Text className="text-base text-gray-700 leading-relaxed">
                      {promotion.description}
                    </Text>
                  </div>
                )}

                {/* Details - Rich Text Content */}
                {promotion.details && (
                  <div className="pt-4 border-t border-gray-100">
                    <Title level={4} className="text-lg font-semibold mb-3 !mb-3">
                      Chi tiết khuyến mãi
                    </Title>
                    <div
                      className="promotion-details-mobile"
                      dangerouslySetInnerHTML={{ __html: processDetailsHtml(promotion.details) }}
                      style={{
                        lineHeight: '1.7',
                        color: '#374151',
                        fontSize: '15px'
                      }}
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-6 space-y-3">
                  <Button
                    type="primary"
                    block
                    size="large"
                    icon={<GiftOutlined />}
                    onClick={() => navigate('/wallet?tab=deposit-withdraw')}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 border-none h-12 text-base font-semibold"
                  >
                    Nạp tiền ngay
                  </Button>
                  <Button
                    block
                    size="large"
                    onClick={() => navigate('/promotions')}
                    className="h-12 text-base"
                  >
                    Xem khuyến mãi khác
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>

      {/* Styles for rich text content */}
      <style>{`
        .promotion-details-mobile img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 8px;
          margin: 12px 0;
        }
        .promotion-details-mobile p {
          margin-bottom: 12px;
        }
        .promotion-details-mobile h1,
        .promotion-details-mobile h2,
        .promotion-details-mobile h3,
        .promotion-details-mobile h4,
        .promotion-details-mobile h5,
        .promotion-details-mobile h6 {
          font-weight: bold;
          margin-top: 16px;
          margin-bottom: 8px;
        }
        .promotion-details-mobile ul,
        .promotion-details-mobile ol {
          padding-left: 20px;
          margin-bottom: 12px;
        }
        .promotion-details-mobile li {
          margin-bottom: 6px;
        }
        .promotion-details-mobile a {
          color: #10b981;
          text-decoration: underline;
        }
        .promotion-details-mobile blockquote {
          border-left: 4px solid #10b981;
          padding-left: 16px;
          margin: 12px 0;
          color: #6b7280;
        }
        .promotion-details-mobile table {
          width: 100%;
          border-collapse: collapse;
          margin: 12px 0;
        }
        .promotion-details-mobile table td,
        .promotion-details-mobile table th {
          border: 1px solid #e5e7eb;
          padding: 8px;
        }
      `}</style>
    </>
  );
};

export default PromotionDetailMobilePage;

