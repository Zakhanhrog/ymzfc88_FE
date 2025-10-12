import { Card, Button } from '../../../components/ui';
import { Icon } from '@iconify/react';
import { THEME_COLORS } from '../../../utils/theme';

const Banner = () => {
  return (
    <div className="mb-6">
      {/* Hero Banner */}
      <Card 
        className="text-white mb-4 bg-gradient-to-r from-[#D30102] to-[#B00001]"
        bodyClassName="p-8"
      >
        <div className="grid grid-cols-3 gap-6 items-center">
          <div className="col-span-2">
            <h1 className="text-3xl font-bold mb-2 text-white">
              Chào mừng đến với BettingHub
            </h1>
            <p className="text-lg mb-4 text-white opacity-90">
              Nền tảng cá cược thể thao hàng đầu với tỷ lệ cược tốt nhất
            </p>
            <div className="flex gap-4">
              <Button 
                variant="secondary"
                size="lg"
                className="font-bold hover:shadow-xl"
              >
                Bắt đầu cược ngay
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="text-white border-white hover:bg-white hover:text-[#D30102]"
              >
                Tìm hiểu thêm
              </Button>
            </div>
          </div>
          <div className="text-center">
            <div className="text-6xl mb-2">🏆</div>
            <div className="text-xl font-semibold text-white">
              Cược thông minh, thắng lớn!
            </div>
          </div>
        </div>
      </Card>

      {/* Features */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center h-full">
          <Icon icon="mdi:rocket" className="text-4xl mb-3 text-[#D30102] mx-auto" />
          <h3 className="text-lg font-semibold mb-2">Cược nhanh chóng</h3>
          <p className="text-gray-600">
            Đặt cược chỉ trong vài giây với giao diện thân thiện
          </p>
        </Card>
        <Card className="text-center h-full">
          <Icon icon="mdi:gift" className="text-4xl mb-3 text-[#B00001] mx-auto" />
          <h3 className="text-lg font-semibold mb-2">Khuyến mãi hấp dẫn</h3>
          <p className="text-gray-600">
            Nhận bonus 100% cho lần nạp đầu tiên
          </p>
        </Card>
        <Card className="text-center h-full">
          <Icon icon="mdi:shield-check" className="text-4xl mb-3 text-[#D30102] mx-auto" />
          <h3 className="text-lg font-semibold mb-2">An toàn bảo mật</h3>
          <p className="text-gray-600">
            Hệ thống bảo mật cao cấp, giao dịch an toàn 100%
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Banner;
