import { useState, useEffect } from 'react';
import Modal from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import Switch from '../../../../components/ui/Switch';
import { Textarea } from '../../../../components/ui/Textarea';

const MarqueeNotificationModal = ({
  open,
  onClose,
  mode, // 'create' or 'edit'
  notification, // for edit mode
  onSubmit,
  loading
}) => {
  const [formData, setFormData] = useState({
    content: '',
    isActive: true,
    displayOrder: 0,
    textColor: '#FF0000',
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    speed: 50
  });

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && notification) {
        setFormData({
          content: notification.content || '',
          isActive: notification.isActive !== undefined ? notification.isActive : true,
          displayOrder: notification.displayOrder || 0,
          textColor: notification.textColor || '#FF0000',
          backgroundColor: notification.backgroundColor || '#FFFFFF',
          fontSize: notification.fontSize || 16,
          speed: notification.speed || 50
        });
      } else {
        setFormData({
          content: '',
          isActive: true,
          displayOrder: 0,
          textColor: '#FF0000',
          backgroundColor: '#FFFFFF',
          fontSize: 16,
          speed: 50
        });
      }
    }
  }, [open, mode, notification]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.content) {
      alert('Vui lòng nhập nội dung thông báo');
      return;
    }

    if (formData.content.length > 1000) {
      alert('Nội dung không được vượt quá 1000 ký tự');
      return;
    }

    onSubmit(formData);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'edit' ? 'Chỉnh sửa thông báo' : 'Thêm thông báo mới'}
      width="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Nội dung thông báo *
          </label>
          <Textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={4}
            placeholder="Nhập nội dung thông báo (có thể sử dụng HTML và emoji)..."
            className="w-full"
            maxLength={1000}
            required
          />
          <p className="text-xs text-gray-400 mt-1 text-right">
            {formData.content.length}/1000
          </p>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Trạng thái hoạt động
          </label>
          <Switch
            checked={formData.isActive}
            onChange={(checked) => setFormData({ ...formData, isActive: checked })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Thứ tự hiển thị
            </label>
            <Input
              type="number"
              min="0"
              value={formData.displayOrder}
              onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
              placeholder="Thứ tự hiển thị"
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Cỡ chữ (px)
            </label>
            <Input
              type="number"
              min="12"
              max="48"
              value={formData.fontSize}
              onChange={(e) => setFormData({ ...formData, fontSize: parseInt(e.target.value) || 16 })}
              placeholder="Cỡ chữ"
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Tốc độ (px/s)
            </label>
            <Input
              type="number"
              min="10"
              max="200"
              value={formData.speed}
              onChange={(e) => setFormData({ ...formData, speed: parseInt(e.target.value) || 50 })}
              placeholder="Tốc độ chạy"
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Màu chữ
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={formData.textColor}
                onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                className="w-16 h-10 p-1 border rounded-lg cursor-pointer"
              />
              <Input
                type="text"
                value={formData.textColor}
                onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                placeholder="#FF0000"
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Màu nền
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={formData.backgroundColor}
                onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                className="w-16 h-10 p-1 border rounded-lg cursor-pointer"
              />
              <Input
                type="text"
                value={formData.backgroundColor}
                onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                placeholder="#FFFFFF"
                className="flex-1"
              />
            </div>
          </div>
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

export default MarqueeNotificationModal;

