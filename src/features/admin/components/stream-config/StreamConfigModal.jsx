import { useState, useEffect } from 'react';
import Modal from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import Switch from '../../../../components/ui/Switch';
import { Textarea } from '../../../../components/ui/Textarea';

const StreamConfigModal = ({
  open,
  onClose,
  mode, // 'create' or 'edit'
  config, // for edit mode
  gameTypes = [],
  onSubmit,
  loading
}) => {
  const [formData, setFormData] = useState({
    gameType: '',
    tableNumber: '',
    streamKey: '',
    isActive: true,
    description: ''
  });

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && config) {
        setFormData({
          gameType: config.gameType || '',
          tableNumber: config.tableNumber || '',
          streamKey: config.streamKey || '',
          isActive: config.isActive !== undefined ? config.isActive : true,
          description: config.description || ''
        });
      } else {
        setFormData({
          gameType: '',
          tableNumber: '',
          streamKey: '',
          isActive: true,
          description: ''
        });
      }
    }
  }, [open, mode, config]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.gameType) {
      alert('Vui lòng chọn game');
      return;
    }
    
    if (!formData.streamKey) {
      alert('Vui lòng nhập stream key');
      return;
    }

    // Validate stream key
    if (!/^[a-z0-9-]+$/.test(formData.streamKey)) {
      alert('Stream key chỉ được chứa chữ thường, số và dấu gạch ngang');
      return;
    }

    if (formData.streamKey.length < 3) {
      alert('Stream key phải có ít nhất 3 ký tự');
      return;
    }

    if (formData.streamKey.length > 50) {
      alert('Stream key không được vượt quá 50 ký tự');
      return;
    }

    const configData = {
      gameType: formData.gameType,
      tableNumber: formData.tableNumber ? parseInt(formData.tableNumber) : null,
      streamKey: formData.streamKey,
      isActive: formData.isActive,
      description: formData.description
    };

    onSubmit(configData);
  };

  const handleStreamKeyChange = (e) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setFormData({ ...formData, streamKey: value });
  };

  const gameTypeOptions = gameTypes.map(type => ({
    value: type.value,
    label: type.label
  }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'edit' ? 'Chỉnh sửa Stream Config' : 'Thêm Stream Config mới'}
      width="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Game *
          </label>
          <Select
            value={formData.gameType}
            onChange={(value) => setFormData({ ...formData, gameType: value })}
            options={gameTypeOptions}
            placeholder="Chọn game"
            className="w-full"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Bàn số (để trống nếu không có bàn)
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Chỉ dùng cho game có nhiều bàn chơi (ví dụ: Tài Xỉu). Xóc Đĩa thường để trống.
          </p>
          <Input
            type="number"
            min="1"
            max="99"
            value={formData.tableNumber}
            onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
            placeholder="Bàn số (ví dụ: 1, 2, 3...)"
            className="w-full"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Stream Key *
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Stream key dùng trong OBS. Ví dụ: xocdia, sicbo-table1, xocdia-table2
          </p>
          <Input
            type="text"
            value={formData.streamKey}
            onChange={handleStreamKeyChange}
            placeholder="xocdia"
            className="w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Mô tả
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Ghi chú về stream config này để dễ quản lý
          </p>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            placeholder="Mô tả stream config (ví dụ: Stream chính cho Xóc Đĩa, Stream bàn 1 Tài Xỉu...)"
            maxLength={200}
            className="w-full"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">
            {formData.description.length}/200
          </p>
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

export default StreamConfigModal;

