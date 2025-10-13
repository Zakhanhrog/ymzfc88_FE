import { Card } from '../../../components/ui';

const SideBanners = ({ banners }) => {
  return (
    <div className="space-y-4">
      {banners.map((banner) => (
        <Card
          key={banner.id}
          className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
          bodyClassName="p-0"
        >
          <div className={`relative h-24 bg-gradient-to-r ${banner.gradient} flex items-center justify-center overflow-hidden`}>
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <h3 className="relative text-white font-bold text-base text-center px-2 drop-shadow-lg">
              {banner.title}
            </h3>
            {/* Decorative elements */}
            <div className="absolute top-2 right-2 w-8 h-8 bg-white bg-opacity-20 rounded-full"></div>
            <div className="absolute bottom-2 left-2 w-6 h-6 bg-white bg-opacity-15 rounded-full"></div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SideBanners;

