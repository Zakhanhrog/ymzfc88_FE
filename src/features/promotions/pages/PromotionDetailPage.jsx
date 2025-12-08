import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Typography, 
  message, 
  Button,
  Spin,
  Empty
} from 'antd';
import {
  ArrowLeftOutlined,
  GiftOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import Layout from '../../../components/common/Layout';
import Loading from '../../../components/common/Loading';
import promotionService from '../../../services/promotionService';
import { API_BASE_URL } from '../../../utils/constants';
import moment from 'moment';
import 'moment/locale/vi';

moment.locale('vi');

const { Title, Text } = Typography;

const PromotionDetailPage = () => {
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
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loading />
        </div>
      </Layout>
    );
  }

  if (!promotion) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Empty description="Không tìm thấy khuyến mãi" />
        </div>
      </Layout>
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
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="max-w-4xl mx-auto p-6 md:p-8">
            {/* Back Button */}
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/promotions')}
              className="mb-4"
            >
              Quay lại danh sách khuyến mãi
            </Button>

            <Card className="shadow-lg">
              {/* Header Image */}
              {promotion.imageUrl && (
                <div className="mb-6 -mx-6 -mt-6">
                  <img
                    src={getImageUrl(promotion.imageUrl)}
                    alt={promotion.title}
                    className="w-full h-64 md:h-96 object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Title */}
              <Title level={1} className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {promotion.title}
              </Title>

              {/* Meta Information */}
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2 text-gray-500">
                  <CalendarOutlined />
                  <Text className="text-sm">
                    {moment(promotion.createdAt).format('DD/MM/YYYY HH:mm')}
                  </Text>
                </div>
                {promotion.isActive && (
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-semibold">
                    Đang diễn ra
                  </span>
                )}
              </div>

              {/* Description */}
              {promotion.description && (
                <div className="mb-6">
                  <Text className="text-lg text-gray-700 leading-relaxed">
                    {promotion.description}
                  </Text>
                </div>
              )}

              {/* Details - Rich Text Content */}
              {promotion.details && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Title level={3} className="text-xl font-semibold mb-4">
                    Chi tiết khuyến mãi
                  </Title>
                  <div
                    className="prose prose-lg max-w-none promotion-details"
                    dangerouslySetInnerHTML={{ __html: processDetailsHtml(promotion.details) }}
                    style={{
                      lineHeight: '1.8',
                      color: '#374151'
                    }}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4">
                <Button
                  type="primary"
                  size="large"
                  icon={<GiftOutlined />}
                  onClick={() => navigate('/wallet?tab=deposit-withdraw')}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 border-none"
                >
                  Nạp tiền ngay
                </Button>
                <Button
                  size="large"
                  onClick={() => navigate('/promotions')}
                >
                  Xem khuyến mãi khác
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Styles for rich text content - Desktop */}
      <style>{`
        .promotion-details img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 8px;
          margin: 16px 0;
        }
        .promotion-details p {
          margin-bottom: 16px;
        }
        .promotion-details h1,
        .promotion-details h2,
        .promotion-details h3,
        .promotion-details h4,
        .promotion-details h5,
        .promotion-details h6 {
          font-weight: bold;
          margin-top: 24px;
          margin-bottom: 12px;
        }
        .promotion-details h1 { font-size: 2em; }
        .promotion-details h2 { font-size: 1.75em; }
        .promotion-details h3 { font-size: 1.5em; }
        .promotion-details h4 { font-size: 1.25em; }
        .promotion-details ul,
        .promotion-details ol {
          padding-left: 24px;
          margin-bottom: 16px;
        }
        .promotion-details li {
          margin-bottom: 8px;
        }
        .promotion-details a {
          color: #10b981;
          text-decoration: underline;
        }
        .promotion-details a:hover {
          color: #059669;
        }
        .promotion-details blockquote {
          border-left: 4px solid #10b981;
          padding-left: 20px;
          margin: 16px 0;
          color: #6b7280;
          font-style: italic;
        }
        .promotion-details table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
        }
        .promotion-details table td,
        .promotion-details table th {
          border: 1px solid #e5e7eb;
          padding: 12px;
        }
        .promotion-details table th {
          background-color: #f9fafb;
          font-weight: bold;
        }
        .promotion-details code {
          background-color: #f3f4f6;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
        }
        .promotion-details pre {
          background-color: #f3f4f6;
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 16px 0;
        }
        .promotion-details pre code {
          background-color: transparent;
          padding: 0;
        }
      `}</style>
    </Layout>
  );
};

export default PromotionDetailPage;

