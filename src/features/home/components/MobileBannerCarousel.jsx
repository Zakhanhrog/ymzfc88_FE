import { Carousel } from '../../../components/ui';

const MobileBannerCarousel = ({ banners }) => {
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
              className="w-full h-auto object-cover cursor-pointer"
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default MobileBannerCarousel;
