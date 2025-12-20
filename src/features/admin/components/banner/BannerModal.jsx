import { useState, useEffect, useRef } from 'react';
import Modal from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import Switch from '../../../../components/ui/Switch';
import { Upload, X } from 'lucide-react';

const BannerModal = ({
  open,
  onClose,
  mode, // 'create' or 'edit'
  banner, // for edit mode
  bannerTypes,
  onSubmit,
  loading
}) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    bannerType: '',
    displayOrder: '',
    isActive: true,
    image: null,
    imagePreview: null
  });

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && banner) {
        setFormData({
          bannerType: banner.bannerType || '',
          displayOrder: banner.displayOrder || '',
          isActive: banner.isActive !== undefined ? banner.isActive : true,
          image: null,
          imagePreview: banner.imageUrl || null
        });
      } else {
        setFormData({
          bannerType: '',
          displayOrder: '',
          isActive: true,
          image: null,
          imagePreview: null
        });
      }
    }
  }, [open, mode, banner]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Chỉ được upload file ảnh!');
        return;
      }
      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Kích thước ảnh phải nhỏ hơn 2MB!');
        return;
      }
      
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      image: null,
      imagePreview: null
    });
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelectImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.bannerType) {
      alert('Vui lòng chọn loại banner');
      return;
    }
    
    if (!formData.image && !formData.imagePreview && mode === 'create') {
      alert('Vui lòng chọn ảnh banner');
      return;
    }
    
    if (!formData.displayOrder) {
      alert('Vui lòng nhập thứ tự hiển thị');
      return;
    }

    const submitData = new FormData();
    submitData.append('bannerType', formData.bannerType);
    submitData.append('displayOrder', formData.displayOrder);
    submitData.append('isActive', formData.isActive);
    
    if (formData.image) {
      submitData.append('image', formData.image);
    }

    onSubmit(submitData);
  };

  const bannerTypeOptions = bannerTypes.map(type => ({
    value: type.value,
    label: type.label
  }));

  const imageUrl = formData.imagePreview?.startsWith('http') 
    ? formData.imagePreview 
    : formData.imagePreview 
      ? `${import.meta.env.VITE_API_URL || 'https://api.tathiet168.com/api'}${formData.imagePreview}`
      : null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'edit' ? 'Chỉnh sửa Banner' : 'Thêm Banner mới'}
      width="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Loại Banner *
          </label>
          <Select
            value={formData.bannerType}
            onChange={(value) => setFormData({ ...formData, bannerType: value })}
            options={bannerTypeOptions}
            placeholder="Chọn loại banner"
            className="w-full"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Ảnh banner *
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          {imageUrl ? (
            <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden mb-2">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">Chọn ảnh để upload</p>
              <Button
                type="button"
                variant="outline"
                onClick={handleSelectImageClick}
                className="rounded-2xl"
              >
                Chọn ảnh
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Định dạng: JPG, PNG (tối đa 2MB)
              </p>
            </div>
          )}
          {imageUrl && (
            <Button
              type="button"
              variant="outline"
              onClick={handleSelectImageClick}
              className="w-full rounded-2xl mt-2"
            >
              <Upload className="h-4 w-4 mr-2" />
              Thay đổi ảnh
            </Button>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Thứ tự hiển thị *
          </label>
          <Input
            type="number"
            min="1"
            value={formData.displayOrder}
            onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
            placeholder="Thứ tự"
            className="w-full"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Trạng thái
          </label>
          <Switch
            checked={formData.isActive}
            onChange={(checked) => setFormData({ ...formData, isActive: checked })}
          />
          <span className="text-sm text-gray-600 ml-2">
            {formData.isActive ? 'Hoạt động' : 'Tạm dừng'}
          </span>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-2xl"
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-[#4CAF50] text-white hover:bg-[#45a049] rounded-2xl"
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : mode === 'edit' ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BannerModal;

