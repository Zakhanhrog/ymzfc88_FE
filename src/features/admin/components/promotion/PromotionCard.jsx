import { Gift, Edit, Eye, EyeOff, Trash2 } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import Modal from '../../../../components/ui/Modal';
import { API_BASE_URL } from '../../../../utils/constants';

const PromotionCard = ({ promotion, onEdit, onToggleStatus, onDelete }) => {
  const imageUrl = promotion.imageUrl?.startsWith('http') 
    ? promotion.imageUrl 
    : `https://api.tathiet168.com/api${promotion.imageUrl}`;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-green-500 to-pink-500">
        {promotion.imageUrl ? (
          <img
            src={imageUrl}
            alt={promotion.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`absolute inset-0 flex items-center justify-center ${promotion.imageUrl ? 'hidden' : ''}`}>
          <Gift className="text-white text-6xl" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 flex-1 line-clamp-2">
            {promotion.title}
          </h3>
          <span className={`ml-2 px-2 py-1 rounded-full text-xs whitespace-nowrap ${
            promotion.isActive 
              ? 'bg-green-100 text-green-600' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {promotion.isActive ? 'Đang hiển thị' : 'Đã ẩn'}
          </span>
        </div>

        {promotion.description && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-3">
            {promotion.description}
          </p>
        )}

        {promotion.details && (
          <div 
            className="text-sm text-gray-600 mb-2 line-clamp-3"
            dangerouslySetInnerHTML={{ 
              __html: (promotion.details || '').replace(
                /src="(\/uploads\/[^"]+)"/g,
                `src="${API_BASE_URL}$1"`
              )
            }}
          />
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-2">
          <span>Thứ tự: {promotion.displayOrder}</span>
          <span>{new Date(promotion.createdAt).toLocaleDateString('vi-VN')}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(promotion)}
          className="flex-1"
        >
          <Edit className="h-4 w-4 mr-1" />
          Sửa
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onToggleStatus(promotion.id)}
          className="flex-1"
        >
          {promotion.isActive ? (
            <>
              <EyeOff className="h-4 w-4 mr-1" />
              Ẩn
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-1" />
              Hiện
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (window.confirm('Bạn có chắc chắn muốn xóa khuyến mãi này?')) {
              onDelete(promotion.id);
            }
          }}
          className="text-red-600 hover:text-red-700 hover:border-red-300"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PromotionCard;

