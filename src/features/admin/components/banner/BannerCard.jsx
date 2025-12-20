import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Edit, Trash2 } from 'lucide-react';

const BannerCard = ({ banner, aspectRatio, onEdit, onDelete }) => {
  const imageUrl = banner.imageUrl?.startsWith('http') 
    ? banner.imageUrl 
    : `${import.meta.env.VITE_API_URL || 'https://api.tathiet168.com/api'}${banner.imageUrl}`;

  const getImageContainerClass = () => {
    // Banner chính (4:1): width lớn, height nhỏ
    // Banner sidebar (2:3): tỷ lệ 2:3 nhưng hiển thị ngang - giới hạn chiều cao để ngang hơn
    if (aspectRatio === '4:1') {
      return 'w-full aspect-[4/1] bg-gray-100 relative overflow-hidden rounded-lg';
    } else {
      // Tỷ lệ 2:3 ngang: giới hạn chiều cao và để width tự điều chỉnh theo tỷ lệ
      return 'w-full h-[200px] bg-gray-100 relative overflow-hidden rounded-lg';
    }
  };

  const handleDelete = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa banner này?')) {
      onDelete(banner.id);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow p-0 border-0">
      <div className={`${getImageContainerClass()} group`}>
        {banner.imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={`Banner ${banner.displayOrder}`}
              className={`w-full h-full ${
                aspectRatio === '2:3' ? 'object-contain' : 'object-cover'
              }`}
              style={aspectRatio === '2:3' ? { aspectRatio: '2/3' } : {}}
              onError={(e) => {
                e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3MoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7uz39gV7TeD4n0HIw8QcACtK4oTx4mZgAAAABJRU5ErkJggg==';
              }}
            />
            {/* Overlay với buttons khi hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(banner)}
                className="h-8 w-8 rounded-full bg-white/90 hover:bg-white border-0 shadow-lg"
                title="Chỉnh sửa"
              >
                <Edit className="h-4 w-4 text-gray-700" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={handleDelete}
                className="h-8 w-8 rounded-full bg-red-500/90 hover:bg-red-600 border-0 shadow-lg"
                title="Xóa"
              >
                <Trash2 className="h-4 w-4 text-white" />
              </Button>
            </div>
            {/* Badge hiển thị thông tin */}
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                Thứ tự: {banner.displayOrder} | {aspectRatio}
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            Chưa có ảnh
          </div>
        )}
      </div>
    </Card>
  );
};

export default BannerCard;

