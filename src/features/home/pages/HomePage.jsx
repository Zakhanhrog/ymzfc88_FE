import { Card, Carousel } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Layout from '../../../components/common/Layout';

const HomePage = () => {
  const navigate = useNavigate();
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

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="w-full px-4 lg:px-6">
          {/* Banner Layout - Main + Side */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-2">
            {/* Banner chính - 3 cột */}
            <div className="lg:col-span-3">
              <Card 
                className="w-full shadow-lg overflow-hidden"
                bodyStyle={{ padding: 0 }}
                style={{ borderRadius: '12px' }}
              >
                <Carousel 
                  autoplay
                  autoplaySpeed={4000}
                  effect="fade"
                  dots={true}
                  className="banner-carousel"
                >
                  {mainBanners.map((banner) => (
                    <div key={banner.id}>
                      <img 
                        src={banner.url}
                        alt={banner.alt}
                        className="w-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                        style={{ 
                          aspectRatio: window.innerWidth < 768 ? '1156/400' : 'auto',
                          height: window.innerWidth < 768 ? 'auto' : '320px'
                        }}
                        onClick={() => console.log('Main banner clicked:', banner.alt)}
                      />
                    </div>
                  ))}
                </Carousel>
              </Card>
            </div>

            {/* Banner bên phải - 1 cột - Ẩn trên mobile */}
            <div className="space-y-4 hidden lg:block">
              {sideBanners.map((banner) => (
                <Card
                  key={banner.id}
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  bodyStyle={{ padding: 0 }}
                  style={{ borderRadius: '12px', overflow: 'hidden' }}
                  onClick={() => console.log('Side banner clicked:', banner.title)}
                >
                  <div className={`relative h-20 lg:h-24 bg-gradient-to-r ${banner.gradient} flex items-center justify-center overflow-hidden`}>
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <h3 className="relative text-white font-bold text-sm lg:text-base text-center px-2 drop-shadow-lg">
                      {banner.title}
                    </h3>
                    {/* Decorative elements */}
                    <div className="absolute top-2 right-2 w-8 h-8 bg-white bg-opacity-20 rounded-full"></div>
                    <div className="absolute bottom-2 left-2 w-6 h-6 bg-white bg-opacity-15 rounded-full"></div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Thông báo chạy ngang - Full Width */}
          <div className="w-full bg-white py-2 mb-3 overflow-hidden shadow-sm border border-red-200" style={{ borderRadius: '50px' }}>
            <div className="whitespace-nowrap animate-marquee">
              <span className="text-xs font-semibold text-red-600">
                📢 THÔNG BÁO: Khuyến mại nạp đầu 100% qua 10 vòng cược, đại lý thanh toán hàng tuần, nạp lại hàng ngày 5% qua 3 vòng cược, hoàn trả hàng ngày lên đến 1%, CẢM ƠN QUÝ KHÁCH !
              </span>
            </div>
          </div>

          {/* Quick Action Buttons - Mobile Style */}
          <div className="mb-5 px-0.5 md:hidden">
            <div className="flex gap-0.5 justify-between">
              {/* Nạp Tiền - Large card style */}
              <div className="flex-shrink-0 w-[78px] bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-1.5 shadow-sm active:scale-95 transition-transform duration-150">
                {/* Icon với dấu + trang trí */}
                <div className="relative mb-1">
                  <div className="absolute top-0.5 left-0 text-red-300 text-[10px]">+</div>
                  <div className="absolute bottom-0 left-3 text-red-200 text-[7px]">+</div>
                  <div className="absolute top-1 right-0 text-red-300 text-[9px]">+</div>
                  <div className="flex justify-center">
                    <div className="relative w-10 h-10 bg-gradient-to-br from-red-400 to-orange-500 rounded-xl shadow-md flex items-center justify-center transform -rotate-6">
                      <img src="/icon-deposit.png" alt="Nạp Tiền" className="w-5 h-5 object-contain" />
                      <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-white text-[7px] font-bold leading-none">+</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Button pill */}
                <button
                  onClick={() => navigate('/wallet?tab=deposit-withdraw')}
                  className="w-full bg-gradient-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500 rounded-full py-0.5 px-1.5 flex items-center justify-center gap-0.5 shadow-sm transition-all"
                >
                  <span className="text-white font-semibold text-[9px] whitespace-nowrap">Nạp Tiền</span>
                  <div className="w-2.5 h-2.5 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                    <Icon icon="mdi:plus" className="text-white text-[7px]" />
                  </div>
                </button>
              </div>

              {/* Rút Tiền - Large card style */}
              <div className="flex-shrink-0 w-[78px] bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-1.5 shadow-sm active:scale-95 transition-transform duration-150">
                {/* Icon với dấu + trang trí */}
                <div className="relative mb-1">
                  <div className="absolute top-0.5 left-0 text-green-300 text-[10px]">+</div>
                  <div className="absolute bottom-0 left-3 text-green-200 text-[7px]">+</div>
                  <div className="absolute top-1 right-0 text-green-300 text-[9px]">+</div>
                  <div className="flex justify-center">
                    <div className="relative w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-md flex items-center justify-center transform rotate-6">
                      <Icon icon="mdi:cash-multiple" className="text-xl text-white" />
                      <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-600 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-white text-[7px] font-bold leading-none">+</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Button pill */}
                <button
                  onClick={() => navigate('/wallet?tab=withdraw')}
                  className="w-full bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 rounded-full py-0.5 px-1.5 flex items-center justify-center gap-0.5 shadow-sm transition-all"
                >
                  <span className="text-white font-semibold text-[9px] whitespace-nowrap">Rút Tiền</span>
                  <div className="w-2.5 h-2.5 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                    <Icon icon="mdi:arrow-right" className="text-white text-[7px]" />
                  </div>
                </button>
              </div>

              {/* Điểm danh - Simple style */}
              <button
                onClick={() => console.log('Điểm danh clicked')}
                className="flex-shrink-0 w-[52px] active:scale-95 transition-transform duration-150 flex flex-col items-center justify-start gap-1.5"
              >
                <div className="w-11 h-11 bg-white rounded-xl shadow-sm flex items-center justify-center">
                  <img src="/sm-check.png" alt="Điểm danh" className="w-7 h-7 object-contain" />
                </div>
                <span className="text-gray-600 font-normal text-[9px] leading-tight text-center">Điểm<br/>danh</span>
              </button>

              {/* Vòng quay - Simple style */}
              <button
                onClick={() => console.log('Vòng quay clicked')}
                className="flex-shrink-0 w-[52px] active:scale-95 transition-transform duration-150 flex flex-col items-center justify-start gap-1.5"
              >
                <div className="w-11 h-11 bg-white rounded-xl shadow-sm flex items-center justify-center">
                  <img src="/sm-wheel.png" alt="Vòng quay" className="w-7 h-7 object-contain" />
                </div>
                <span className="text-gray-600 font-normal text-[9px] leading-tight text-center">Vòng<br/>quay</span>
              </button>

              {/* VIP - Simple style */}
              <button
                onClick={() => console.log('VIP clicked')}
                className="flex-shrink-0 w-[52px] active:scale-95 transition-transform duration-150 flex flex-col items-center justify-start gap-1.5"
              >
                <div className="w-11 h-11 bg-white rounded-xl shadow-sm flex items-center justify-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-black text-[9px]">VIP</span>
                  </div>
                </div>
                <span className="text-gray-600 font-normal text-[9px] leading-none">VIP</span>
              </button>

              {/* Mỗi Ngày - Simple style */}
              <button
                onClick={() => console.log('Mỗi Ngày clicked')}
                className="flex-shrink-0 w-[52px] active:scale-95 transition-transform duration-150 flex flex-col items-center justify-start gap-1.5"
              >
                <div className="w-11 h-11 bg-white rounded-xl shadow-sm flex items-center justify-center">
                  <img src="/sm-mb.webp" alt="Mỗi Ngày" className="w-7 h-7 object-contain" />
                </div>
                <span className="text-gray-600 font-normal text-[9px] leading-tight text-center">Mỗi<br/>Ngày</span>
              </button>
            </div>
          </div>

          {/* Horizontal Scrolling Categories - Mobile */}
          <div className="mb-1 px-2 md:hidden">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {/* Lịch */}
              <button
                onClick={() => console.log('Lịch clicked')}
                className="flex-shrink-0 bg-white rounded-full px-4 py-2 active:scale-95 transition-transform duration-150 border border-gray-200"
              >
                <div className="flex items-center gap-1.5">
                  <Icon icon="mdi:play-circle" className="text-lg text-gray-400" />
                  <span className="font-normal text-gray-500 whitespace-nowrap text-xs">Lịch</span>
                </div>
              </button>

              {/* THỂ THAO */}
              <button
                onClick={() => console.log('THỂ THAO clicked')}
                className="flex-shrink-0 bg-white rounded-full px-4 py-2 active:scale-95 transition-transform duration-150 border border-gray-200"
              >
                <div className="flex items-center gap-1.5">
                  <Icon icon="mdi:soccer" className="text-lg text-gray-400" />
                  <span className="font-normal text-gray-500 whitespace-nowrap text-xs">THỂ THAO</span>
                </div>
              </button>

              {/* SÒNG BÀI */}
              <button
                onClick={() => console.log('SÒNG BÀI clicked')}
                className="flex-shrink-0 bg-white rounded-full px-4 py-2 active:scale-95 transition-transform duration-150 border border-gray-200"
              >
                <div className="flex items-center gap-1.5">
                  <Icon icon="mdi:cards-playing" className="text-lg text-gray-400" />
                  <span className="font-normal text-gray-500 whitespace-nowrap text-xs">SÒNG BÀI</span>
                </div>
              </button>

              {/* ĐÁ GÀ */}
              <button
                onClick={() => console.log('ĐÁ GÀ clicked')}
                className="flex-shrink-0 bg-white rounded-full px-4 py-2 active:scale-95 transition-transform duration-150 border border-gray-200"
              >
                <div className="flex items-center gap-1.5">
                  <Icon icon="game-icons:rooster" className="text-lg text-gray-400" />
                  <span className="font-normal text-gray-500 whitespace-nowrap text-xs">ĐÁ GÀ</span>
                </div>
              </button>

              {/* SLOTS */}
              <button
                onClick={() => console.log('SLOTS clicked')}
                className="flex-shrink-0 bg-white rounded-full px-4 py-2 active:scale-95 transition-transform duration-150 border border-gray-200"
              >
                <div className="flex items-center gap-1.5">
                  <Icon icon="mdi:slot-machine" className="text-lg text-gray-400" />
                  <span className="font-normal text-gray-500 whitespace-nowrap text-xs">SLOTS</span>
                </div>
              </button>

              {/* GAME BÀI */}
              <button
                onClick={() => console.log('GAME BÀI clicked')}
                className="flex-shrink-0 bg-white rounded-full px-4 py-2 active:scale-95 transition-transform duration-150 border border-gray-200"
              >
                <div className="flex items-center gap-1.5">
                  <Icon icon="mdi:cards" className="text-lg text-gray-400" />
                  <span className="font-normal text-gray-500 whitespace-nowrap text-xs">GAME BÀI</span>
                </div>
              </button>
            </div>
          </div>

          {/* Game Categories */}
          <div className="pt-0 pb-4 px-2">
            {/* Header with buttons */}
            <div className="flex items-center justify-between mb-4">
              {/* Left side - Title */}
              <h2 className="text-lg font-bold text-gray-800">Phổ Biến Nhất</h2>
              
              {/* Right side - Buttons */}
              <div className="flex gap-2">
                <button className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-md active:scale-95 transition-transform">
                  <Icon icon="mdi:magnify" className="text-sm" />
                  <span className="hidden sm:inline">MÃ DỰ THƯỞNG</span>
                </button>
                <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-md active:scale-95 transition-transform">
                  <Icon icon="mdi:trophy" className="text-sm" />
                  <span className="hidden sm:inline">KẾT QUẢ TRAO THƯỞNG</span>
                </button>
              </div>
            </div>
            
            {/* Grid of games */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {/* Casino */}
              <div className="rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 shadow-md">
                <div className="aspect-[4/3] bg-gradient-to-br from-pink-400 to-red-400 flex items-center justify-center p-4">
                  <img 
                    src="https://th2club.net/images/figure_39636407564188.png.avif" 
                    alt="Casino"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Đá Gà */}
              <div className="rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 shadow-md">
                <div className="aspect-[4/3] bg-gradient-to-br from-pink-300 to-red-300 flex items-center justify-center p-4">
                  <img 
                    src="https://th2club.net/images/figure_8840968486572375835.png.avif" 
                    alt="Đá Gà"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Thể thao */}
              <div className="rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 shadow-md">
                <div className="aspect-[4/3] bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center p-4">
                  <img 
                    src="https://th2club.net/images/figure_362857114342923387.png.avif" 
                    alt="Thể thao"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Casino 2 */}
              <div className="rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 shadow-md">
                <div className="aspect-[4/3] bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center p-4">
                  <img 
                    src="https://th2club.net/images/subclass41465988833800.png.avif" 
                    alt="Casino"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Đá Gà 2 */}
              <div className="rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 shadow-md">
                <div className="aspect-[4/3] bg-gradient-to-br from-green-300 to-emerald-400 flex items-center justify-center p-4">
                  <img 
                    src="https://th2club.net/images/taixiu.png" 
                    alt="Đá Gà"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Game Khác */}
              <div className="rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 shadow-md">
                <div className="aspect-[4/3] bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center p-4">
                  <img 
                    src="https://th2club.net/images/subclass6861705028422769039.png.avif" 
                    alt="Game"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
