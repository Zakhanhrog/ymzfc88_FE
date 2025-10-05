import { Card, Carousel } from 'antd';
import Layout from '../../../components/common/Layout';

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

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Banner Layout - Main + Side */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
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
                      className="w-full h-64 lg:h-80 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                      onClick={() => console.log('Main banner clicked:', banner.alt)}
                    />
                  </div>
                ))}
              </Carousel>
            </Card>
          </div>

          {/* Banner bên phải - 1 cột */}
          <div className="space-y-4">
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
        <div className="w-full bg-blue-100 py-3 mb-6 overflow-hidden">
          <div className="whitespace-nowrap animate-marquee">
            <span className="text-base font-semibold text-blue-800">
              📢 THÔNG BÁO: Khuyến mại nạp đầu 100% qua 10 vòng cược, đại lý thanh toán hàng tuần, nạp lại hàng ngày 5% qua 3 vòng cược, hoàn trả hàng ngày lên đến 1%, CẢM ƠN QUÝ KHÁCH !
            </span>
          </div>
        </div>

        {/* Game Categories */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold text-center mb-2 text-blue-600">GAME CỰC CHẤT</h2>
          <p className="text-center text-gray-600 mb-8">THAM GIA TRANH TÀI</p>
          
          {/* Top Row - 3 items */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Casino */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group">
              <div className="h-44 bg-gradient-to-br from-pink-400 to-red-400 flex items-center justify-center p-3 overflow-hidden">
                <img 
                  src="https://th2club.net/images/figure_39636407564188.png.avif" 
                  alt="Casino"
                  className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 tracking-wide">CASINO</h3>
              </div>
            </div>

            {/* Thể thao */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group">
              <div className="h-44 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center p-3 overflow-hidden">
                <img 
                  src="https://th2club.net/images/figure_362857114342923387.png.avif" 
                  alt="Thể thao"
                  className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 tracking-wide">THỂ THAO</h3>
              </div>
            </div>

            {/* Lô đề */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group">
              <div className="h-44 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center p-3 overflow-hidden">
                <img 
                  src="https://th2club.net/images/figure_8840968486572375835.png.avif" 
                  alt="Lô đề"
                  className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 tracking-wide">LÔ ĐỀ</h3>
              </div>
            </div>
          </div>

          {/* Bottom Row - 5 items */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* Tài xỉu */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group">
              <div className="h-32 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center p-2 overflow-hidden">
                <img 
                  src="https://th2club.net/images/taixiu.png" 
                  alt="Tài xỉu"
                  className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-wide">TÀI XỈU</h3>
              </div>
            </div>

            {/* Game bài */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group">
              <div className="h-32 bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center p-2 overflow-hidden">
                <img 
                  src="https://th2club.net/images/subclass41465988833800.png.avif" 
                  alt="Game bài"
                  className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 tracking-wide">GAME BÀI</h3>
              </div>
            </div>

            {/* Nổ hũ */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group">
              <div className="h-32 bg-gradient-to-br from-yellow-400 to-red-500 flex items-center justify-center p-2 overflow-hidden">
                <img 
                  src="https://th2club.net/images/subclass6861705028422769039.png.avif" 
                  alt="Nổ hũ"
                  className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-red-600 tracking-wide">NỔ HŨ</h3>
              </div>
            </div>

            {/* Bắn cá */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group">
              <div className="h-32 bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center p-2 overflow-hidden">
                <img 
                  src="https://th2club.net/images/subclass44196810703047.png.avif" 
                  alt="Bắn cá"
                  className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 tracking-wide">BẮN CÁ</h3>
              </div>
            </div>

            {/* Xóc đĩa */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group">
              <div className="h-32 bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center p-2 overflow-hidden">
                <img 
                  src="https://th2club.net/images/xocdia.png" 
                  alt="Xóc đĩa"
                  className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-800 tracking-wide">XÓC ĐĨA</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
