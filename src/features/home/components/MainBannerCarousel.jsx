import { Card, Carousel } from '../../../components/ui';

const MainBannerCarousel = ({ banners }) => {
  return (
    <Card className="w-full shadow-lg overflow-hidden">
      <Carousel 
        autoplay
        autoplaySpeed={4000}
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

