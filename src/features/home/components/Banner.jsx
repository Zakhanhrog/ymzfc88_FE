import { Card, Button, Row, Col } from 'antd';
import { RocketOutlined, GiftOutlined, SafetyOutlined } from '@ant-design/icons';
import { THEME_COLORS } from '../../../utils/theme';

const Banner = () => {
  return (
    <div className="mb-6">
      {/* Hero Banner */}
      <Card 
        className="text-white mb-4"
        style={{
          background: THEME_COLORS.bannerGradient
        }}
        bodyStyle={{ padding: '2rem' }}
      >
        <Row align="middle">
          <Col xs={24} md={16}>
            <h1 className="text-3xl font-bold mb-2 text-white">
              Chào mừng đến với BettingHub
            </h1>
            <p className="text-lg mb-4" style={{ color: '#FFE5E5' }}>
              Nền tảng cá cược thể thao hàng đầu với tỷ lệ cược tốt nhất
            </p>
            <div className="flex gap-4">
              <Button 
                type="primary" 
                size="large"
                className="bg-white border-white font-bold hover:shadow-xl"
                style={{ 
                  color: THEME_COLORS.primary,
                  borderColor: 'white',
                  backgroundColor: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = THEME_COLORS.primaryLighter;
                  e.currentTarget.style.color = THEME_COLORS.primaryHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = THEME_COLORS.primary;
                }}
              >
                Bắt đầu cược ngay
              </Button>
              <Button 
                type="ghost" 
                size="large"
                className="text-white border-white font-semibold"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = THEME_COLORS.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'white';
                }}
              >
                Tìm hiểu thêm
              </Button>
            </div>
          </Col>
          <Col xs={24} md={8} className="text-center">
            <div className="text-6xl mb-2">🏆</div>
            <div className="text-xl font-semibold">
              Cược thông minh, thắng lớn!
            </div>
          </Col>
        </Row>
      </Card>

      {/* Features */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card className="text-center h-full">
            <RocketOutlined className="text-4xl mb-3" style={{ color: THEME_COLORS.primary }} />
            <h3 className="text-lg font-semibold mb-2">Cược nhanh chóng</h3>
            <p className="text-gray-600">
              Đặt cược chỉ trong vài giây với giao diện thân thiện
            </p>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="text-center h-full">
            <GiftOutlined className="text-4xl mb-3" style={{ color: THEME_COLORS.primaryHover }} />
            <h3 className="text-lg font-semibold mb-2">Khuyến mãi hấp dẫn</h3>
            <p className="text-gray-600">
              Nhận bonus 100% cho lần nạp đầu tiên
            </p>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="text-center h-full">
            <SafetyOutlined className="text-4xl mb-3" style={{ color: THEME_COLORS.primaryLight }} />
            <h3 className="text-lg font-semibold mb-2">An toàn bảo mật</h3>
            <p className="text-gray-600">
              Hệ thống bảo mật cao cấp, giao dịch an toàn 100%
            </p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Banner;
