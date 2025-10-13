import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../../../components/common/Layout';
import MainBannerCarousel from '../components/MainBannerCarousel';
import MobileBannerCarousel from '../components/MobileBannerCarousel';
import NotificationMarquee from '../components/NotificationMarquee';
import PopularGamesCarousel from '../components/PopularGamesCarousel';
import CategoryGamesGrid from '../components/CategoryGamesGrid';
import AdditionalGamesGrid from '../components/AdditionalGamesGrid';
import QuickActionsSection from '../components/QuickActionsSection';
import CategoryNavigation from '../components/CategoryNavigation';
import MobilePopularGames from '../components/MobilePopularGames';
import CategoryButtons from '../components/CategoryButtons';

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we need to show login modal from ProtectedRoute redirect
  useEffect(() => {
    if (location.state?.showLoginModal) {
      // Trigger login modal by dispatching custom event
      const event = new CustomEvent('showLoginModal', {
        detail: { redirectAfterLogin: location.state.redirectAfterLogin }
      });
      window.dispatchEvent(event);
      
      // Clear the state to prevent showing modal on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  // Banner chính (carousel)
  const mainBanners = [
    {
      id: 1,
      url: '/images/banners/banner1.webp',
      alt: 'Banner khuyến mãi 1'
    },
    {
      id: 2,
      url: '/images/banners/banner2.webp',
      alt: 'Banner khuyến mãi 2'
    },
    {
      id: 3,
      url: '/images/banners/banner3.webp',
      alt: 'Banner khuyến mãi 3'
    },
    {
      id: 4,
      url: '/images/banners/banner4.webp',
      alt: 'Banner khuyến mãi 4'
    },
    {
      id: 5,
      url: '/images/banners/banner5.webp',
      alt: 'Banner khuyến mãi 5'
    }
  ];
  
  // 3 banner phụ từ folder banner
  const sideBanners = [
    {
      id: 1,
      url: '/images/banners/imgi_148_ddc4f0b5-3df9-4997-8ebe-a0a037db9354.webp',
      alt: 'Banner phụ 1'
    },
    {
      id: 2,
      url: '/images/banners/imgi_149_40874e55-d637-4d69-852e-0199a44d4150.webp',
      alt: 'Banner phụ 2'
    },
    {
      id: 3,
      url: '/images/banners/imgi_150_24406232-8114-4e87-b707-4e49bbb0ccf7.webp',
      alt: 'Banner phụ 3'
    }
  ];

  return (
    <Layout>
      <div className="w-full">
        {/* Banner Section */}
        
        {/* Desktop Banner Layout */}
        <div className="hidden md:grid grid-cols-6 gap-4 mb-6">
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
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Banner Layout */}
        <div className="md:hidden mb-1">
          <MobileBannerCarousel banners={mainBanners} />
        </div>

        {/* Notification Marquee */}
        <NotificationMarquee />

        {/* Quick Actions Section */}
        <QuickActionsSection />

        {/* Category Navigation */}
        <CategoryNavigation />

        {/* Mobile Popular Games */}
        <MobilePopularGames />

        {/* Desktop Components */}
        {/* Popular Games Carousel */}
        <div className="hidden md:block">
          <PopularGamesCarousel />
        </div>

        {/* Category Games Grid */}
        <div className="hidden md:block">
          <CategoryGamesGrid />
        </div>

        {/* Spacing between major sections */}
        <div className="hidden md:block h-8"></div>

        {/* Additional Games Grid */}
        <div className="hidden md:block">
          <AdditionalGamesGrid />
        </div>

        {/* Category Buttons */}
        <CategoryButtons />
      </div>
    </Layout>
  );
};

export default HomePage;

