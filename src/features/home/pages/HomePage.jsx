import { useEffect, useState, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Layout from '../../../components/common/Layout';
import MainBannerCarousel from '../components/MainBannerCarousel';
import MobileBannerCarousel from '../components/MobileBannerCarousel';
import NotificationMarquee from '../components/NotificationMarquee';
import PopularGamesCarousel from '../components/PopularGamesCarousel';
import CasinoLiveSection from '../components/CasinoLiveSection';
import CategoryGamesGrid from '../components/CategoryGamesGrid';
import AdditionalGamesGrid from '../components/AdditionalGamesGrid';
import MobilePopularGames from '../components/MobilePopularGames';
import MobileCasinoLiveSection from '../components/MobileCasinoLiveSection';
import MobileCategoryGamesSection from '../components/MobileCategoryGamesSection';
import CategoryButtons from '../components/CategoryButtons';
import MainNavigationBar from '../components/MainNavigationBar';
import { getProvinceImagePathWithMapping } from '../../lottery/utils/imageUtils';
import { getProvincesByDay, getTodayProvinces } from '../../lottery/data/provincesData';
import LotteryCarousel from '../../lottery/components/LotteryCarousel';
import WeekdayNavigation from '../components/WeekdayNavigation';
import { bannerService } from '../../../services/bannerService';
import lotteryResultService from '../../../services/lotteryResultService';

// Cache keys
const CACHE_KEYS = {
  MAIN_BANNERS: 'homepage_main_banners',
  SIDE_BANNERS: 'homepage_side_banners',
  MIEN_BAC_RESULT: 'homepage_mien_bac_result',
};

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

// Helper function to get cached data
const getCachedData = (key) => {
  try {
    const cached = sessionStorage.getItem(key);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is still valid
    if (now - timestamp < CACHE_DURATION) {
      return data;
    }
    
    // Cache expired, remove it
    sessionStorage.removeItem(key);
    return null;
  } catch (error) {
    return null;
  }
};

// Helper function to set cached data
const setCachedData = (key, data) => {
  try {
    sessionStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    // Ignore storage errors
  }
};

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState('bac');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay()); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const [mainBanners, setMainBanners] = useState([]);
  const [sideBanners, setSideBanners] = useState([]);
  const [mienBacResult, setMienBacResult] = useState(null);
  const [mienBacLoading, setMienBacLoading] = useState(true);

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

  // Load Miền Bắc result with caching
  useEffect(() => {
    const loadMienBacResult = async () => {
      // Check cache first
      const cached = getCachedData(CACHE_KEYS.MIEN_BAC_RESULT);
      if (cached) {
        setMienBacResult(cached);
        setMienBacLoading(false);
        return;
      }

      try {
        setMienBacLoading(true);
        const response = await lotteryResultService.getLatestPublishedResult('mienBac', null);
        
        if (response.success && response.data) {
          const prize = lotteryResultService.getSpecialPrize(response.data);
          if (prize && prize.length > 0) {
            setMienBacResult(prize);
            setCachedData(CACHE_KEYS.MIEN_BAC_RESULT, prize);
          }
        }
      } catch (error) {
        // Silent error handling
      } finally {
        setMienBacLoading(false);
      }
    };

    loadMienBacResult();
  }, []);

  // Load banners from API with caching
  useEffect(() => {
    const loadBanners = async () => {
      // Check cache first
      const cachedMain = getCachedData(CACHE_KEYS.MAIN_BANNERS);
      const cachedSide = getCachedData(CACHE_KEYS.SIDE_BANNERS);
      
      if (cachedMain) {
        setMainBanners(cachedMain);
      }
      if (cachedSide) {
        setSideBanners(cachedSide);
      }
      
      // If both are cached, skip API call
      if (cachedMain && cachedSide) {
        return;
      }

      try {
        const [mainResponse, sideResponse] = await Promise.all([
          cachedMain ? Promise.resolve({ success: false }) : bannerService.getActiveBannersByType('MAIN_BANNER'),
          cachedSide ? Promise.resolve({ success: false }) : bannerService.getActiveBannersByType('SIDEBAR_BANNER')
        ]);
        
        if (mainResponse.success) {
          const mappedBanners = mainResponse.data.map(banner => ({
            id: banner.id,
            url: banner.imageUrl.startsWith('http') ? banner.imageUrl : `https://api.tathiet168.com/api${banner.imageUrl}`,
            alt: `Banner ${banner.displayOrder}`
          }));
          setMainBanners(mappedBanners);
          setCachedData(CACHE_KEYS.MAIN_BANNERS, mappedBanners);
        }
        
        if (sideResponse.success) {
          const mappedBanners = sideResponse.data.map(banner => ({
            id: banner.id,
            url: banner.imageUrl.startsWith('http') ? banner.imageUrl : `https://api.tathiet168.com/api${banner.imageUrl}`,
            alt: `Banner ${banner.displayOrder}`
          }));
          setSideBanners(mappedBanners);
          setCachedData(CACHE_KEYS.SIDE_BANNERS, mappedBanners);
        }
      } catch (error) {
        // Silent error handling
      }
    };
    
    loadBanners();
  }, []);


  // Lấy tỉnh theo ngày được chọn - memoized
  const selectedDayProvinces = useMemo(() => getProvincesByDay(selectedDay), [selectedDay]);
  
  // Fallback data nếu không có dữ liệu - memoized
  const fallbackTrung = useMemo(() => [
    {
      id: 'da-nang-fallback',
      name: 'Xổ Số Đà Nẵng',
      province: 'Đà Nẵng',
      image: '/images/games/mien-trung/thu-4/DA-NANG.jpg'
    },
    {
      id: 'khanh-hoa-fallback',
      name: 'Xổ Số Khánh Hòa',
      province: 'Khánh Hòa',
      image: '/images/games/mien-trung/thu-4/KHANH-HOA.jpg'
    }
  ], []);
  
  const fallbackNam = useMemo(() => [
    {
      id: 'can-tho-fallback',
      name: 'Xổ Số Cần Thơ',
      province: 'Cần Thơ',
      image: '/images/games/mien-nam/T4/CAN-THO.jpg'
    },
    {
      id: 'dong-nai-fallback',
      name: 'Xổ Số Đồng Nai',
      province: 'Đồng Nai',
      image: '/images/games/mien-nam/T4/DONG-NAI.jpg'
    },
    {
      id: 'soc-trang-fallback',
      name: 'Xổ Số Sóc Trăng',
      province: 'Sóc Trăng',
      image: '/images/games/mien-nam/T4/SOC-TRANG.jpg'
    }
  ], []);

  // Lottery regions data - Miền Bắc luôn cố định, Miền Trung và Nam thay đổi theo ngày - memoized
  const regions = useMemo(() => ({
    bac: {
      name: 'Miền Bắc',
      color: 'from-green-500 to-green-600',
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
      games: selectedDayProvinces?.trung || fallbackTrung
    },
    nam: {
      name: 'Miền Nam',
      color: 'from-green-500 to-green-600', 
      games: selectedDayProvinces?.nam || fallbackNam
    }
  }), [selectedDayProvinces, fallbackTrung, fallbackNam]);

  const handleGameSelect = useCallback((gameId) => {
    if (gameId === 'mien-bac') {
      navigate('/lottery/mien-bac');
    } else {
      // Tất cả các cổng game Miền Trung và Nam đều vào trang chung với tên cổng
      const allGames = regions.trung.games.concat(regions.nam.games);
      const game = allGames.find(g => g.id === gameId);
      if (game) {
        navigate(`/lottery/mien-trung-nam?port=${gameId}&name=${encodeURIComponent(game.name)}`);
      }
      }
    }, [navigate, regions]);

  const handleDaySelect = useCallback((dayKey) => {
    // Update selected day and refresh provinces data
    setSelectedDay(dayKey);
    // The regions will automatically update based on selectedDay
  }, []);

  return (
    <Layout>
      <div className="w-full">
        {/* Main Navigation Bar - Only show on homepage */}
        {location.pathname === '/' && (
          <>
        <MainNavigationBar />
            {/* Spacer for fixed mobile navigation */}
            <div className="md:hidden h-[65px]"></div>
          </>
        )}
        
        {/* Banner Section */}
        
        {/* Desktop Banner Layout */}
        <div className={`hidden md:grid gap-4 mb-6 ${sidebarCollapsed ? 'grid-cols-12' : 'grid-cols-6'}`} style={{ gridAutoRows: '1fr' }}>
          <div className={sidebarCollapsed ? 'col-span-10' : 'col-span-5'} style={{ width: '100%', display: 'flex', alignItems: 'stretch' }}>
            <div className="w-full h-full overflow-hidden rounded-lg">
              <MainBannerCarousel banners={mainBanners} />
            </div>
          </div>

          <div className={sidebarCollapsed ? 'col-span-2' : 'col-span-1'} style={{ display: 'flex', alignItems: 'stretch' }}>
            <div className="w-full border border-gray-300 rounded-lg shadow-lg p-2 bg-transparent flex flex-col">
              <div className="w-full flex flex-col gap-1 flex-1">
                {sideBanners.map((banner) => (
                  <div key={banner.id} className="w-full overflow-hidden rounded-lg flex-1" style={{ minHeight: 0 }}>
                    <img 
                      src={banner.url} 
                      alt={banner.alt}
                      className="w-full h-full object-contain cursor-pointer rounded-lg"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Banner Layout */}
        <div className="md:hidden mb-1">
          <MobileBannerCarousel banners={mainBanners} />
        </div>

        {/* Notification Marquee */}
        <NotificationMarquee />


        {/* Lottery Interface */}
        
        {/* Desktop Lottery Interface */}
        <div className="hidden">
          <div className="flex gap-4">
            {/* Weekday Sidebar */}
            <div className="w-1/6">
              <div className="p-2 bg-white rounded-lg h-full">
                <div className="h-full flex flex-col gap-2">
                  {[
                    { day: 'Thứ 2', dayIndex: 1, color: 'bg-gray-100 hover:bg-gray-200' },
                    { day: 'Thứ 3', dayIndex: 2, color: 'bg-gray-100 hover:bg-gray-200' },
                    { day: 'Thứ 4', dayIndex: 3, color: 'bg-gray-100 hover:bg-gray-200' },
                    { day: 'Thứ 5', dayIndex: 4, color: 'bg-gray-100 hover:bg-gray-200' },
                    { day: 'Thứ 6', dayIndex: 5, color: 'bg-gray-100 hover:bg-gray-200' },
                    { day: 'Thứ 7', dayIndex: 6, color: 'bg-gray-100 hover:bg-gray-200' },
                    { day: 'Chủ Nhật', dayIndex: 0, color: 'bg-gray-100 hover:bg-gray-200' }
                  ].map((item, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedDay(item.dayIndex)}
                      className={`${selectedDay === item.dayIndex ? 'bg-green-500 text-white shadow-lg' : `${item.color} hover:scale-105 hover:shadow-md`} rounded-lg p-2 cursor-pointer transition-all duration-300 transform flex-1 flex items-center justify-center`}
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
                      <span className="text-green-700 text-xs font-semibold">Miền Bắc</span>
                    </div>
                    <div className="p-3 rounded-lg h-48" style={{ backgroundColor: '#F5F5F5' }}>
                      <div 
                        className="group cursor-pointer transition-all duration-300 transform relative overflow-hidden rounded-lg shadow-none hover:shadow-[0_0_30px_rgba(211,1,2,0.5)] p-0 bg-white rounded-lg h-full"
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
                      <LotteryCarousel
                        games={regions.trung.games}
                        regionName="Miền Trung"
                        maxVisible={2}
                        onGameSelect={handleGameSelect}
                      />
                    </div>
                  </div>

                   {/* Miền Nam - 4 games in one frame */}
                   <div className="w-4/6">
                    <div className="text-left mb-2">
                      <span className="text-gray-600 text-xs font-semibold">Miền Nam</span>
                    </div>
                    <div className="p-3 rounded-lg h-48" style={{ backgroundColor: '#F5F5F5' }}>
                      <LotteryCarousel
                        games={regions.nam.games}
                        regionName="Miền Nam"
                        maxVisible={4}
                        onGameSelect={handleGameSelect}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Mobile Lottery Interface */}
        <div className="hidden">
          <div className="h-[calc(100vh-400px)] flex flex-col">
            {/* Fixed Header Section - No Scroll */}
            <div className="flex-shrink-0">
              {/* Miền Bắc Card - Above Weekday Bar */}
              <div className="mb-3">
                <div className="bg-white border border-green-300 rounded-lg p-4">
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
                          <span className="bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">HOT</span>
                        </div>
                        <div className="text-sm text-gray-600">Ngày: {new Date().toLocaleDateString('vi-VN')}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <button 
                      className="bg-green-500 text-white text-xs px-3 py-1 rounded-lg hover:bg-green-600 transition-colors"
                      onClick={() => handleGameSelect(regions.bac.games[0].id)}
                    >
                      Đặt cược
                    </button>
                    <div className="flex space-x-1">
                      {mienBacLoading ? (
                        // Loading skeleton
                        [0, 1, 2, 3, 4].map((index) => (
                          <div key={index} className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                        ))
                      ) : mienBacResult ? (
                        // Real result - Enhanced styling
                        mienBacResult.map((number, index) => (
                          <div key={index} className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 text-white text-sm rounded-full flex items-center justify-center font-bold shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 border-2 border-green-300">
                            {number}
                          </div>
                        ))
                      ) : (
                        // Fallback to hardcoded if no result - Enhanced styling
                        ['0', '7', '0', '8', '1'].map((number, index) => (
                          <div key={index} className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 text-white text-sm rounded-full flex items-center justify-center font-bold shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 border-2 border-green-300">
                            {number}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Weekday Bar */}
              <div className="mb-3">
                <div className="flex gap-1">
                  {[
                    { day: 'T2', dayIndex: 1, color: 'bg-gray-100 hover:bg-gray-200' },
                    { day: 'T3', dayIndex: 2, color: 'bg-gray-100 hover:bg-gray-200' },
                    { day: 'T4', dayIndex: 3, color: 'bg-gray-100 hover:bg-gray-200' },
                    { day: 'T5', dayIndex: 4, color: 'bg-gray-100 hover:bg-gray-200' },
                    { day: 'T6', dayIndex: 5, color: 'bg-gray-100 hover:bg-gray-200' },
                    { day: 'T7', dayIndex: 6, color: 'bg-gray-100 hover:bg-gray-200' },
                    { day: 'CN', dayIndex: 0, color: 'bg-gray-100 hover:bg-gray-200' }
                  ].map((item, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedDay(item.dayIndex)}
                      className={`${selectedDay === item.dayIndex ? 'bg-green-500 text-white shadow-lg' : `${item.color} hover:scale-105 hover:shadow-md`} rounded-lg p-1 cursor-pointer transition-all duration-300 transform flex-1 text-center`}
                    >
                      <div className="text-xs font-semibold">{item.day}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Scrollable Game Area - Only this section scrolls */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 px-2">
              <div className="space-y-3 pb-4">
                {/* Miền Trung Section */}
                <div>
                  <div className="text-left mb-2">
                    <span className="text-gray-600 text-xs font-semibold">Miền Trung</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {regions.trung.games.map((game) => (
                      <div
                        key={game.id}
                        className="h-20 rounded-3xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
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
                        className="h-20 rounded-3xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
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

        {/* Mobile Casino Live Section */}
        <div className="md:hidden">
          <MobileCasinoLiveSection />
        </div>

        {/* Mobile Popular Games */}
        <div className="md:hidden">
          <MobilePopularGames />
        </div>

        {/* Mobile Category Games (Thể thao & Sòng bài) */}
        <div className="md:hidden">
          <MobileCategoryGamesSection />
        </div>

        {/* Desktop Components */}
        {/* Popular Games Carousel */}
        <div className="hidden md:block">
          <PopularGamesCarousel />
        </div>

        {/* Casino Live Section */}
        <div className="hidden md:block">
          <CasinoLiveSection />
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
        <div className="hidden md:block">
          <CategoryButtons />
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;

