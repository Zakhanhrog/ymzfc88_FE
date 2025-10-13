import { Carousel } from '../../../components/ui';

const MainBannerCarousel = ({ banners }) => {
  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg bg-transparent border border-gray-300">
      <Carousel 
        autoplay
        autoplaySpeed={4000}
        dots={false}
        className="banner-carousel bg-transparent"
      >
        {banners.map((banner) => (
          <div key={banner.id}>
            <img 
              src={banner.url}
              alt={banner.alt}
              className="w-full object-cover cursor-pointer"
              style={{ 
                height: '350px'
              }}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default MainBannerCarousel;

