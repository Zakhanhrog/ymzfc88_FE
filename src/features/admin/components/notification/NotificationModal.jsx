import { useState, useEffect } from 'react';
import Modal from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import { RadioGroup, RadioButton } from '../../../../components/ui/Radio';
import { Textarea } from '../../../../components/ui/Textarea';
import DatePicker from '../../../../components/ui/DatePicker';
import { Send, AlertCircle, AlertTriangle, Info, Globe, User, HelpCircle } from 'lucide-react';
import moment from 'moment';

const NotificationModal = ({
  open,
  onClose,
  users = [],
  onSubmit,
  loading
}) => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    priority: 3,
    type: 'SYSTEM',
    scope: 'broadcast',
    targetUserId: null,
    expiresAt: null
  });

  useEffect(() => {
    if (!open) {
      setFormData({
        title: '',
        message: '',
        priority: 3,
        type: 'SYSTEM',
        scope: 'broadcast',
        targetUserId: null,
        expiresAt: null
      });
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title) {
      alert('Vui lòng nhập tiêu đề');
      return;
    }
    
    if (!formData.message) {
      alert('Vui lòng nhập nội dung');
      return;
    }

    if (formData.scope === 'individual' && !formData.targetUserId) {
      alert('Vui lòng chọn người dùng');
      return;
    }

    const notificationData = {
      title: formData.title,
      message: formData.message,
      priority: formData.priority,
      type: formData.type,
      targetUserId: formData.scope === 'individual' ? formData.targetUserId : null,
      expiresAt: formData.expiresAt ? moment(formData.expiresAt).toISOString() : null,
    };

    onSubmit(notificationData);
  };

  const typeOptions = [
    { value: 'SYSTEM', label: 'Hệ thống' },
    { value: 'MAINTENANCE', label: 'Bảo trì' },
    { value: 'PROMOTION', label: 'Khuyến mãi' },
    { value: 'SECURITY', label: 'Bảo mật' },
    { value: 'TRANSACTION', label: 'Giao dịch' },
    { value: 'ACCOUNT', label: 'Tài khoản' },
    { value: 'ANNOUNCEMENT', label: 'Thông báo chung' },
  ];

  const userOptions = users.map(user => ({
    value: user.id,
    label: `${user.username} (${user.email})`
  }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          <span>Tạo thông báo mới</span>
        </div>
      }
      width="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Tiêu đề thông báo *
          </label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Nhập tiêu đề thông báo..."
            className="w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Nội dung thông báo *
          </label>
          <Textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={4}
            placeholder="Nhập nội dung thông báo..."
            className="w-full"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Mức độ ưu tiên *
            </label>
            <div className="flex flex-col gap-2">
              <RadioButton
                value={1}
                checked={formData.priority === 1}
                onChange={() => setFormData({ ...formData, priority: 1 })}
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span>Khẩn cấp (Đỏ)</span>
                </div>
              </RadioButton>
              <RadioButton
                value={2}
                checked={formData.priority === 2}
                onChange={() => setFormData({ ...formData, priority: 2 })}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span>Cảnh báo (Vàng)</span>
                </div>
              </RadioButton>
              <RadioButton
                value={3}
                checked={formData.priority === 3}
                onChange={() => setFormData({ ...formData, priority: 3 })}
              >
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-green-500" />
                  <span>Thông thường (Xanh)</span>
                </div>
              </RadioButton>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Loại thông báo *
            </label>
            <Select
              value={formData.type}
              onChange={(value) => setFormData({ ...formData, type: value })}
              options={typeOptions}
              placeholder="Chọn loại thông báo"
              className="w-full"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Phạm vi gửi *
          </label>
          <div className="flex flex-col gap-2">
            <RadioButton
              value="broadcast"
              checked={formData.scope === 'broadcast'}
              onChange={() => setFormData({ ...formData, scope: 'broadcast', targetUserId: null })}
            >
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>Toàn hệ thống (Gửi cho tất cả)</span>
              </div>
            </RadioButton>
            <RadioButton
              value="individual"
              checked={formData.scope === 'individual'}
              onChange={() => setFormData({ ...formData, scope: 'individual' })}
            >
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Cá nhân (Gửi cho 1 người)</span>
              </div>
            </RadioButton>
          </div>
        </div>

        {formData.scope === 'individual' && (
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Chọn người dùng *
            </label>
            <Select
              value={formData.targetUserId}
              onChange={(value) => setFormData({ ...formData, targetUserId: value })}
              options={userOptions}
              placeholder="Chọn người dùng..."
              className="w-full"
            />
          </div>
        )}

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center gap-1">
            Thời gian hết hạn
            <HelpCircle className="h-4 w-4 text-gray-400" title="Để trống nếu thông báo không hết hạn" />
          </label>
          <DatePicker
            value={formData.expiresAt}
            onChange={(date) => setFormData({ ...formData, expiresAt: date })}
            placeholder="Chọn thời gian hết hạn (tùy chọn)"
            format="DD/MM/YYYY HH:mm"
            className="w-full"
          />
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
            className="flex-1 bg-[#4CAF50] text-white hover:bg-[#45a049] rounded-2xl gap-2"
            disabled={loading}
          >
            <Send className="h-4 w-4" />
            {loading ? 'Đang gửi...' : 'Gửi thông báo'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default NotificationModal;

