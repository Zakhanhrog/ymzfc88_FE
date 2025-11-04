import { Carousel } from '../../../components/ui';

const MainBannerCarousel = ({ banners }) => {
  return (
    <Carousel 
      autoplay
      autoplaySpeed={4000}
      dots={false}
      className="banner-carousel w-full h-full"
    >
      {banners.map((banner) => (
        <div key={banner.id} className="w-full h-full overflow-hidden rounded-lg">
          <img 
            src={banner.url}
            alt={banner.alt}
            className="w-full h-full object-contain cursor-pointer rounded-lg"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      ))}
    </Carousel>
  );
};

export default MainBannerCarousel;

