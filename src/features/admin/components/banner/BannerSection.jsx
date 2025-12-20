import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';
import BannerCard from './BannerCard';

const BannerSection = ({ title, banners, aspectRatio, onEdit, onDelete }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {banners.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>Chưa có banner nào</p>
          </div>
        ) : (
          <div className={`grid gap-4 ${
            aspectRatio === '4:1' 
              ? 'grid-cols-1 lg:grid-cols-2' // Banner chính: 1-2 cột để hiển thị to
              : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3' // Banner sidebar: nhiều cột, hiển thị ngang
          }`}>
            {banners.map((banner) => (
              <BannerCard
                key={banner.id}
                banner={banner}
                aspectRatio={aspectRatio}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BannerSection;

