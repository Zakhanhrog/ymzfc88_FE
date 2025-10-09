import { Card, Carousel } from 'antd';

const MainBannerCarousel = ({ banners }) => {
  return (
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
        {banners.map((banner) => (
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
  );
};

export default MainBannerCarousel;

