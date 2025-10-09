import Layout from '../../../components/common/Layout';
import MainBannerCarousel from '../components/MainBannerCarousel';
import SideBanners from '../components/SideBanners';
import NotificationMarquee from '../components/NotificationMarquee';
import QuickActionButtons from '../components/QuickActionButtons';
import CategoryButtons from '../components/CategoryButtons';
import GameGrid from '../components/GameGrid';

const HomePage = () => {
  // Banner chính (carousel)
  const mainBanners = [
    {
      id: 1,
      url: '/banner1.webp',
      alt: 'Banner khuyến mãi 1'
    },
    {
      id: 2,
      url: '/banner2.webp',
      alt: 'Banner khuyến mãi 2'
    },
    {
      id: 3,
      url: '/banner3.webp',
      alt: 'Banner khuyến mãi 3'
    },
    {
      id: 4,
      url: '/banner4.webp',
      alt: 'Banner khuyến mãi 4'
    },
    {
      id: 5,
      url: '/banner5.webp',
      alt: 'Banner khuyến mãi 5'
    }
  ];

  // Banner bên phải
  const sideBanners = [
    {
      id: 1,
      title: 'NẠP ĐẦU 100%',
      url: 'https://img.alltocon.com/img/ae888/ads/622163a9-9274-4ca6-909c-76a6be75d923.webp',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      id: 2,
      title: 'NẠP ĐẦU 120%',
      url: 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=300&h=200&fit=crop',
      gradient: 'from-red-400 to-pink-500'
    },
    {
      id: 3,
      title: 'NẠP ĐẦU THƯỞNG 150%',
      url: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=300&h=200&fit=crop',
      gradient: 'from-purple-400 to-red-500'
    }
  ];

  const notificationMessage = '📢 THÔNG BÁO: Khuyến mại nạp đầu 100% qua 10 vòng cược, đại lý thanh toán hàng tuần, nạp lại hàng ngày 5% qua 3 vòng cược, hoàn trả hàng ngày lên đến 1%, CẢM ƠN QUÝ KHÁCH !';

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="w-full px-4 lg:px-6">
          {/* Banner Layout - Main + Side */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-2">
            {/* Banner chính - 3 cột */}
            <div className="lg:col-span-3">
              <MainBannerCarousel banners={mainBanners} />
            </div>

            {/* Banner bên phải - 1 cột - Ẩn trên mobile */}
            <SideBanners banners={sideBanners} />
          </div>

          {/* Thông báo chạy ngang - Full Width */}
          <NotificationMarquee message={notificationMessage} />

          {/* Quick Action Buttons - Mobile Style */}
          <QuickActionButtons />

          {/* Horizontal Scrolling Categories - Mobile */}
          <CategoryButtons />

          {/* Game Categories */}
          <GameGrid />
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
