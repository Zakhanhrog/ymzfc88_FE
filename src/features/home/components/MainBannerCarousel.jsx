import { Carousel } from '../../../components/ui';

const MainBannerCarousel = ({ banners }) => {
  return (
    <Carousel 
      autoplay
      autoplaySpeed={4000}
      dots={false}
      className="banner-carousel"
    >
      {banners.map((banner) => (
        <div key={banner.id}>
          <img 
            src={banner.url}
            alt={banner.alt}
            className="w-full h-auto cursor-pointer rounded-lg"
          />
        </div>
      ))}
    </Carousel>
  );
};

export default MainBannerCarousel;

