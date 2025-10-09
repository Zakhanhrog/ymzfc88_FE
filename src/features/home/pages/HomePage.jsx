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
      gradient: 'from-purple-400 to-pink-500'
    },
    {
      id: 3,
      title: 'KHUYẾN MÃI ĐẶC BIỆT',
      url: 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=300&h=200&fit=crop',
      gradient: 'from-blue-400 to-cyan-500'
    }
  ];

  return (
    <Layout>
      <div className="w-full">
        {/* Notification Marquee */}
        <NotificationMarquee />

        {/* Banner Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Main Banner Carousel - 2 cột */}
          <div className="lg:col-span-2">
            <MainBannerCarousel banners={mainBanners} />
          </div>

          {/* Side Banners - 1 cột */}
          <div className="lg:col-span-1">
            <SideBanners banners={sideBanners} />
          </div>
        </div>

        {/* Quick Action Buttons */}
        <QuickActionButtons />

        {/* Category Buttons */}
        <CategoryButtons />

        {/* Game Grid */}
        <GameGrid />
      </div>
    </Layout>
  );
};

export default HomePage;

