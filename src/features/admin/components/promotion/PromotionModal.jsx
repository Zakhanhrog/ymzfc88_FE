import { useState, useEffect } from 'react';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Textarea } from '../../../../components/ui/Textarea';
import Switch from '../../../../components/ui/Switch';
import Modal from '../../../../components/ui/Modal';
import RichTextEditor from '../../../../components/admin/RichTextEditor';
import { Upload, X } from 'lucide-react';
import promotionService from '../../../../services/promotionService';
import { message } from '../../../../utils/notification';
import { API_BASE_URL } from '../../../../utils/constants';

const PromotionModal = ({ open, onClose, promotion, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    details: '',
    imageUrl: '',
    isActive: true,
    displayOrder: 0
  });
  const [uploading, setUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  // Load promotion data when editing
  useEffect(() => {
    if (promotion && open) {
      setFormData({
        title: promotion.title || '',
        description: promotion.description || '',
        details: promotion.details || '',
        imageUrl: promotion.imageUrl || '',
        isActive: promotion.isActive !== undefined ? promotion.isActive : true,
        displayOrder: promotion.displayOrder || 0
      });
      setUploadedImageUrl(promotion.imageUrl);
    } else if (open) {
      setFormData({
        title: '',
        description: '',
        details: '',
        imageUrl: '',
        isActive: true,
        displayOrder: 0
      });
      setUploadedImageUrl(null);
    }
  }, [promotion, open]);

  const normalizeHtml = (html) => {
    if (!html) return html;
    return html.replace(
      new RegExp(API_BASE_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
      ''
    );
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await promotionService.uploadPromotionImage(file);
      setUploadedImageUrl(imageUrl);
      setFormData(prev => ({ ...prev, imageUrl }));
      message.success('Upload ảnh thành công');
    } catch (error) {
      message.error('Upload ảnh thất bại: ' + (error.response?.data?.error || error.message));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const imageUrl = uploadedImageUrl || formData.imageUrl;
    if (!imageUrl) {
      message.error('Vui lòng chọn ảnh khuyến mãi!');
      return;
    }

    const normalizedDetails = normalizeHtml(formData.details);
    const submitData = {
      ...formData,
      details: normalizedDetails,
      imageUrl: imageUrl
    };

    try {
      if (promotion) {
        await promotionService.updatePromotion(promotion.id, submitData);
        message.success('Cập nhật khuyến mãi thành công!');
      } else {
        await promotionService.createPromotion(submitData);
        message.success('Tạo khuyến mãi thành công!');
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      message.error('Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  const displayImageUrl = uploadedImageUrl || formData.imageUrl;
  const fullImageUrl = displayImageUrl?.startsWith('http') 
    ? displayImageUrl 
    : displayImageUrl 
      ? `https://api.tathiet168.com/api${displayImageUrl}`
      : null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={promotion ? 'Chỉnh sửa khuyến mãi' : 'Thêm khuyến mãi mới'}
      width="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Tiêu đề *
          </label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Nhập tiêu đề khuyến mãi"
            required
            maxLength={255}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Mô tả
          </label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Nhập mô tả khuyến mãi"
            rows={4}
            maxLength={10000}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Chi tiết
          </label>
          <RichTextEditor
            value={formData.details}
            onChange={(value) => setFormData(prev => ({ ...prev, details: value }))}
            placeholder="Nhập chi tiết khuyến mãi (có thể format văn bản và chèn ảnh)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Ảnh khuyến mãi *
          </label>
          <div className="space-y-2">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                disabled={uploading}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                    Đang upload...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Chọn ảnh
                  </>
                )}
              </Button>
            </label>
            {fullImageUrl && (
              <div className="relative inline-block">
                <img
                  src={fullImageUrl}
                  alt="Preview"
                  className="max-w-[200px] max-h-[200px] object-contain rounded border"
                />
                <button
                  type="button"
                  onClick={() => {
                    setUploadedImageUrl(null);
                    setFormData(prev => ({ ...prev, imageUrl: '' }));
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Trạng thái
            </label>
            <div className="flex items-center h-10">
              <Switch
                checked={formData.isActive}
                onChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
              <span className="ml-2 text-sm text-gray-600">
                {formData.isActive ? 'Hiển thị' : 'Ẩn'}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Thứ tự hiển thị
            </label>
            <Input
              type="number"
              value={formData.displayOrder}
              onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
              placeholder="0"
              min={0}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button
            type="submit"
          >
            {promotion ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PromotionModal;

