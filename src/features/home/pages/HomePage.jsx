import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Layout from '../../../components/common/Layout';
import MainBannerCarousel from '../components/MainBannerCarousel';
import MobileBannerCarousel from '../components/MobileBannerCarousel';
import NotificationMarquee from '../components/NotificationMarquee';
import PopularGamesCarousel from '../components/PopularGamesCarousel';
import CategoryGamesGrid from '../components/CategoryGamesGrid';
import AdditionalGamesGrid from '../components/AdditionalGamesGrid';
import QuickActionsSection from '../components/QuickActionsSection';
import MobilePopularGames from '../components/MobilePopularGames';
import CategoryButtons from '../components/CategoryButtons';
import { getProvinceImagePathWithMapping } from '../../lottery/utils/imageUtils';

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState('bac');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  // Lottery regions data
  const regions = {
    bac: {
      name: 'Miền Bắc',
      color: 'from-red-500 to-red-600',
      games: [
        {
          id: 'mien-bac',
          name: 'Xổ Số Miền Bắc',
          image: getProvinceImagePathWithMapping('Miền Bắc'),
          description: 'Xổ số miền Bắc hàng ngày'
        }
      ]
    },
    trung: {
      name: 'Miền Trung', 
      color: 'from-blue-500 to-blue-600',
      games: [
        {
          id: 'gia-lai',
          name: 'Xổ Số Gia Lai', 
          image: getProvinceImagePathWithMapping('Gia Lai'),
          description: 'Xổ số Gia Lai'
        },
        {
          id: 'ninh-thuan',
          name: 'Xổ Số Ninh Thuận',
          image: getProvinceImagePathWithMapping('Ninh Thuận'), 
          description: 'Xổ số Ninh Thuận'
        }
      ]
    },
    nam: {
      name: 'Miền Nam',
      color: 'from-green-500 to-green-600', 
      games: [
        {
          id: 'binh-duong',
          name: 'Xổ Số Bình Dương',
          image: getProvinceImagePathWithMapping('Bình Dương'),
          description: 'Xổ số Bình Dương'
        },
        {
          id: 'tra-vinh',
          name: 'Xổ Số Trà Vinh',
          image: getProvinceImagePathWithMapping('Trà Vinh'),
          description: 'Xổ số Trà Vinh'
        },
        {
          id: 'vinh-long',
          name: 'Xổ Số Vĩnh Long',
          image: getProvinceImagePathWithMapping('Vĩnh Long'),
          description: 'Xổ số Vĩnh Long'
        }
      ]
    }
  };

  const handleGameSelect = (gameId) => {
    if (gameId === 'mien-bac') {
      navigate('/lottery/mien-bac');
    } else if (['binh-duong', 'gia-lai', 'ninh-thuan', 'tra-vinh', 'vinh-long'].includes(gameId)) {
      // Tất cả các cổng game Miền Trung và Nam đều vào trang chung với tên cổng
      const gameName = regions.trung.games.concat(regions.nam.games).find(game => game.id === gameId)?.name || '';
      navigate(`/lottery/mien-trung-nam?port=${gameId}&name=${encodeURIComponent(gameName)}`);
    }
  };

  return (
    <Layout>
      <div className="w-full">
        {/* Banner Section */}
        
        {/* Desktop Banner Layout */}
        <div className={`hidden md:grid gap-4 mb-6 ${sidebarCollapsed ? 'grid-cols-12' : 'grid-cols-6'}`}>
          <div className={sidebarCollapsed ? 'col-span-10' : 'col-span-5'}>
            <div className={`${sidebarCollapsed ? 'h-[420px]' : 'h-[350px]'} overflow-hidden rounded-lg`}>
              <MainBannerCarousel banners={mainBanners} />
            </div>
          </div>

          <div className={sidebarCollapsed ? 'col-span-2' : 'col-span-1'}>
            <div className={`space-y-1 ${sidebarCollapsed ? 'h-[420px]' : 'h-[350px]'} flex flex-col justify-between border border-gray-300 rounded-lg shadow-lg p-2 bg-transparent`}>
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

        {/* Lottery Interface */}
        
        {/* Desktop Lottery Interface */}
        <div className="hidden md:block mt-6">
          <div className="flex gap-4">
            {/* Weekday Sidebar */}
            <div className="w-1/6">
              <div className="p-2 bg-white rounded-lg h-full">
                <div className="h-full flex flex-col gap-2">
                  {[
                    { day: 'Thứ 2', color: 'bg-gray-100 hover:bg-gray-200' },
                    { day: 'Thứ 3', color: 'bg-gray-100 hover:bg-gray-200' },
                    { day: 'Thứ 4', color: 'bg-gray-100 hover:bg-gray-200' },
                    { day: 'Thứ 5', color: 'bg-gray-100 hover:bg-gray-200' },
                    { day: 'Thứ 6', color: 'bg-gray-100 hover:bg-gray-200' },
                    { day: 'Thứ 7', color: 'bg-gray-100 hover:bg-gray-200' },
                    { day: 'Chủ Nhật', color: 'bg-red-100 hover:bg-red-200 text-red-700' }
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`${item.color} rounded-lg p-2 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-md flex-1 flex items-center justify-center`}
                    >
                      <div className="text-center">
                        <div className="text-sm font-semibold">{item.day}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Lottery Content */}
            <div className="w-5/6">
              <div className="pt-3 pb-16 px-4 bg-white rounded-lg">
                {/* Grouped by regions */}
                <div className="flex gap-3 items-stretch">
                  {/* Miền Bắc - Single frame */}
                  <div className="w-1/6">
                    <div className="text-left mb-2">
                      <span className="text-red-700 text-xs font-semibold">Miền Bắc</span>
                    </div>
                    <div className="p-3 rounded-lg h-48" style={{ backgroundColor: '#F5F5F5' }}>
                      <div 
                        className="group cursor-pointer transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden rounded-lg shadow-none hover:shadow-[0_0_30px_rgba(211,1,2,0.5)] p-0 bg-white rounded-lg h-full"
                        onClick={() => handleGameSelect(regions.bac.games[0].id)}
                      >
                        <img
                          src={regions.bac.games[0].image}
                          alt={regions.bac.games[0].name}
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Miền Trung - 2 games in one frame */}
                  <div className="w-2/6">
                    <div className="text-left mb-2">
                      <span className="text-gray-600 text-xs font-semibold">Miền Trung</span>
                    </div>
                    <div className="p-3 rounded-lg h-48" style={{ backgroundColor: '#F5F5F5' }}>
                      <div className="grid grid-cols-2 gap-1 h-full">
                        {regions.trung.games.map((game) => (
                          <div
                            key={game.id}
                            className="group cursor-pointer transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden rounded-lg shadow-none hover:shadow-[0_0_30px_rgba(211,1,2,0.5)] p-0 bg-white rounded-lg h-full"
                            onClick={() => handleGameSelect(game.id)}
                          >
                            <img
                              src={game.image}
                              alt={game.name}
                              className="w-full h-full object-contain rounded-lg"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Miền Nam - 3 games in one frame */}
                  <div className="w-3/6">
                    <div className="text-left mb-2">
                      <span className="text-gray-600 text-xs font-semibold">Miền Nam</span>
                    </div>
                    <div className="p-3 rounded-lg h-48" style={{ backgroundColor: '#F5F5F5' }}>
                      <div className="grid grid-cols-3 gap-1 h-full">
                        {regions.nam.games.map((game) => (
                          <div
                            key={game.id}
                            className="group cursor-pointer transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden rounded-lg shadow-none hover:shadow-[0_0_30px_rgba(211,1,2,0.5)] p-0 bg-white rounded-lg h-full"
                            onClick={() => handleGameSelect(game.id)}
                          >
                            <img
                              src={game.image}
                              alt={game.name}
                              className="w-full h-full object-contain rounded-lg"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Lottery Interface */}
        <div className="md:hidden mt-0">
          <div className="flex gap-2 h-[calc(100vh-410px)]">
            {/* Game Categories Sidebar */}
            <div className="w-1/5">
              <div className="bg-white rounded-lg p-2 h-full">
                <div className="overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {/* HOT GAMES */}
                  <div className="flex flex-col items-center p-1 bg-gray-100 rounded-lg mb-1 aspect-square">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <Icon icon="mdi:fire" className="text-gray-600 text-lg" />
                    </div>
                    <span className="text-xs text-gray-700 text-center">HOT</span>
                  </div>
                  
                  {/* THỂ THAO */}
                  <div className="flex flex-col items-center p-1 bg-gray-50 rounded-lg mb-1 aspect-square">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <Icon icon="mdi:soccer" className="text-gray-600 text-lg" />
                    </div>
                    <span className="text-xs text-gray-700 text-center">Thể Thao</span>
                  </div>
                  
                  {/* SÒNG BÀI */}
                  <div className="flex flex-col items-center p-1 bg-gray-50 rounded-lg mb-1 aspect-square">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <Icon icon="mdi:cards-playing" className="text-gray-600 text-lg" />
                    </div>
                    <span className="text-xs text-gray-700 text-center">Sòng Bài</span>
                  </div>
                  
                  {/* SLOTS */}
                  <div className="flex flex-col items-center p-1 bg-gray-50 rounded-lg mb-1 aspect-square">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <Icon icon="mdi:slot-machine" className="text-gray-600 text-lg" />
                    </div>
                    <span className="text-xs text-gray-700 text-center">Slots</span>
                  </div>
                  
                  {/* ĐÁ GÀ */}
                  <div className="flex flex-col items-center p-1 bg-gray-50 rounded-lg mb-1 aspect-square">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <Icon icon="game-icons:rooster" className="text-gray-600 text-lg" />
                    </div>
                    <span className="text-xs text-gray-700 text-center">Đá Gà</span>
                  </div>
                  
                  {/* GAME BÀI */}
                  <div className="flex flex-col items-center p-1 bg-gray-50 rounded-lg mb-1 aspect-square">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <Icon icon="mdi:cards" className="text-gray-600 text-lg" />
                    </div>
                    <span className="text-xs text-gray-700 text-center">Game Bài</span>
                  </div>
                  
                  {/* RACING BALL */}
                  <div className="flex flex-col items-center p-1 bg-gray-50 rounded-lg mb-1 aspect-square">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <Icon icon="mdi:basketball" className="text-gray-600 text-lg" />
                    </div>
                    <span className="text-xs text-gray-700 text-center">Racing</span>
                  </div>
                  
                  {/* XỔ SỐ */}
                  <div className="flex flex-col items-center p-1 bg-gray-50 rounded-lg mb-1 aspect-square">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <Icon icon="mdi:dice-multiple" className="text-gray-600 text-lg" />
                    </div>
                    <span className="text-xs text-gray-700 text-center">Xổ Số</span>
                  </div>
                  
                  {/* E-SPORTS */}
                  <div className="flex flex-col items-center p-1 bg-gray-50 rounded-lg mb-1 aspect-square">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <Icon icon="mdi:controller" className="text-gray-600 text-lg" />
                    </div>
                    <span className="text-xs text-gray-700 text-center">E-Sports</span>
                  </div>
                  
                  {/* KHUYẾN MÃI */}
                  <div className="flex flex-col items-center p-1 bg-gray-50 rounded-lg mb-1 aspect-square">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <Icon icon="mdi:gift" className="text-gray-600 text-lg" />
                    </div>
                    <span className="text-xs text-gray-700 text-center">Khuyến Mãi</span>
                  </div>
                  
                  {/* VIP */}
                  <div className="flex flex-col items-center p-1 bg-gray-50 rounded-lg mb-1 aspect-square">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <Icon icon="mdi:crown" className="text-gray-600 text-lg" />
                    </div>
                    <span className="text-xs text-gray-700 text-center">VIP</span>
                  </div>
                  
                  {/* APP */}
                  <div className="flex flex-col items-center p-1 bg-gray-50 rounded-lg aspect-square">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <Icon icon="mdi:cellphone" className="text-gray-600 text-lg" />
                    </div>
                    <span className="text-xs text-gray-700 text-center">APP</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Lottery Content */}
            <div className="w-4/5">
              <div className="px-2 py-2 bg-white rounded-lg h-full">
                {/* Miền Bắc Card - Above Weekday Bar */}
                <div className="mb-3">
                  <div className="bg-white border border-red-300 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden">
                          <img
                            src={regions.bac.games[0].image}
                            alt={regions.bac.games[0].name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-base font-semibold text-gray-800">Miền Bắc</span>
                            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">HOT</span>
                          </div>
                          <div className="text-sm text-gray-600">Ngày: {new Date().toLocaleDateString('vi-VN')}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <button 
                        className="bg-red-500 text-white text-xs px-3 py-1 rounded-lg hover:bg-red-600 transition-colors"
                        onClick={() => handleGameSelect(regions.bac.games[0].id)}
                      >
                        Đặt cược
                      </button>
                      <div className="flex space-x-1">
                        {['0', '7', '0', '8', '1'].map((number, index) => (
                          <div key={index} className="w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            {number}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Weekday Bar */}
                <div className="mb-3">
                  <div className="flex gap-1">
                    {[
                      { day: 'T2', color: 'bg-gray-100 hover:bg-gray-200' },
                      { day: 'T3', color: 'bg-gray-100 hover:bg-gray-200' },
                      { day: 'T4', color: 'bg-gray-100 hover:bg-gray-200' },
                      { day: 'T5', color: 'bg-gray-100 hover:bg-gray-200' },
                      { day: 'T6', color: 'bg-gray-100 hover:bg-gray-200' },
                      { day: 'T7', color: 'bg-gray-100 hover:bg-gray-200' },
                      { day: 'CN', color: 'bg-red-100 hover:bg-red-200 text-red-700' }
                    ].map((item, index) => (
                      <div
                        key={index}
                        className={`${item.color} rounded-lg p-1 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-md flex-1 text-center`}
                      >
                        <div className="text-xs font-semibold">{item.day}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Mobile Game Layout - Region Headers with Games */}
                <div className="space-y-3">

                  {/* Miền Trung Section */}
                  <div>
                    <div className="text-left mb-2">
                      <span className="text-gray-600 text-xs font-semibold">Miền Trung</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {regions.trung.games.map((game) => (
                        <div
                          key={game.id}
                          className="h-20 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
                          onClick={() => handleGameSelect(game.id)}
                        >
                          <img
                            src={game.image}
                            alt={game.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Miền Nam Section */}
                  <div>
                    <div className="text-left mb-2">
                      <span className="text-gray-600 text-xs font-semibold">Miền Nam</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {regions.nam.games.map((game) => (
                        <div
                          key={game.id}
                          className="h-20 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
                          onClick={() => handleGameSelect(game.id)}
                        >
                          <img
                            src={game.image}
                            alt={game.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Popular Games */}
        <div className="hidden">
          <MobilePopularGames />
        </div>

        {/* Desktop Components */}
        {/* Popular Games Carousel */}
        <div className="hidden">
          <PopularGamesCarousel />
        </div>

        {/* Category Games Grid */}
        <div className="hidden">
          <CategoryGamesGrid />
        </div>

        {/* Spacing between major sections */}
        <div className="hidden h-8"></div>

        {/* Additional Games Grid */}
        <div className="hidden">
          <AdditionalGamesGrid />
        </div>

        {/* Category Buttons */}
        <div className="hidden">
          <CategoryButtons />
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;

