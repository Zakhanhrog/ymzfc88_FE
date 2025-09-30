import { Card, Carousel } from 'antd';
import Layout from '../../../components/common/Layout';

const HomePage = () => {
  // Danh sách các ảnh banner - bạn có thể thay đổi URL ở đây
  const bannerImages = [
    {
      id: 1,
      url: 'https://sf-static.upanhlaylink.com/img/image_202508286a3ffa006414ea635deec83bc7f9a273.jpg',
      alt: 'Banner 1'
    },
    {
      id: 2,
      url: 'https://sf-static.upanhlaylink.com/img/image_202508280f99bd538c6e590e9b197bff60a41e48.jpg',
      alt: 'Banner 2'
    },
    {
      id: 3,
      url: 'https://sf-static.upanhlaylink.com/img/image_2025082811cade36fe6e76451c972bfcef35048c.jpg',
      alt: 'Banner 3'
    },
    {
      id: 4,
      url: 'https://sf-static.upanhlaylink.com/img/image_202508316c80030e1ec4802ee3c8c88ca632fa04.jpg',
      alt: 'Banner 4'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Banner Carousel - Full Width */}
        <Card 
          className="w-full shadow-lg overflow-hidden"
          bodyStyle={{ 
            padding: 0
          }}
          style={{ margin: 0, borderRadius: 0 }}
        >
          <Carousel 
            autoplay
            autoplaySpeed={3000}
            effect="fade"
            dots={true}
            className="banner-carousel"
          >
            {bannerImages.map((image) => (
              <div key={image.id}>
                <img 
                  src={image.url}
                  alt={image.alt}
                  className="w-full object-cover"
                  style={{ height: '600px', aspectRatio: '3016/1168' }}
                />
              </div>
            ))}
          </Carousel>
        </Card>
        
        {/* Thông báo chạy ngang - Full Width */}
        <div className="w-full bg-blue-100 py-3 mt-4 overflow-hidden">
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
