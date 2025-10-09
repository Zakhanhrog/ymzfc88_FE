import Layout from '../../../components/common/Layout';
import MainBannerCarousel from '../components/MainBannerCarousel';
import NotificationMarquee from '../components/NotificationMarquee';
import QuickActionButtons from '../components/QuickActionButtons';
import CategoryButtons from '../components/CategoryButtons';

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
  
  // 3 banner phụ từ folder banner
  const sideBanners = [
    {
      id: 1,
      url: '/banner/imgi_148_ddc4f0b5-3df9-4997-8ebe-a0a037db9354.webp',
      alt: 'Banner phụ 1'
    },
    {
      id: 2,
      url: '/banner/imgi_149_40874e55-d637-4d69-852e-0199a44d4150.webp',
      alt: 'Banner phụ 2'
    },
    {
      id: 3,
      url: '/banner/imgi_150_24406232-8114-4e87-b707-4e49bbb0ccf7.webp',
      alt: 'Banner phụ 3'
    }
  ];

  return (
    <Layout>
      <div className="w-full">
        {/* Banner Section */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          {/* Banner chính - 5 cột */}
          <div className="col-span-5">
            <MainBannerCarousel banners={mainBanners} />
          </div>

          {/* Banner phụ - 1 cột */}
          <div className="col-span-1">
            <div className="space-y-1 h-[350px] flex flex-col justify-between border border-gray-300 rounded-lg shadow-lg p-2 bg-transparent">
              {sideBanners.map((banner) => (
                <div key={banner.id} className="h-[120px] bg-gray-100 rounded-lg p-1.5 shadow-sm">
                  <div className="w-full h-full rounded-lg overflow-hidden">
                    <img 
                      src={banner.url} 
                      alt={banner.alt}
                      className="w-full h-full object-contain cursor-pointer rounded-lg"
                      onClick={() => console.log(`${banner.alt} clicked`)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notification Marquee */}
        <NotificationMarquee />

        {/* Quick Action Buttons */}
        <QuickActionButtons />

        {/* Category Buttons */}
        <CategoryButtons />
      </div>
    </Layout>
  );
};

export default HomePage;

