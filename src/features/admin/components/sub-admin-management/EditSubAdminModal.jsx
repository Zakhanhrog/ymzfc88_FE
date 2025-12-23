import { useState, useEffect } from 'react';
import Modal from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';

const STATUS_OPTIONS = [
  { label: 'Hoạt động', value: 'ACTIVE' },
  { label: 'Tạm khóa', value: 'INACTIVE' },
  { label: 'Tạm dừng', value: 'SUSPENDED' },
  { label: 'Bị cấm', value: 'BANNED' }
];

const EditSubAdminModal = ({
  open,
  onClose,
  subAdmin,
  onSubmit,
  onUpdateStatus
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    status: 'ACTIVE'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (subAdmin) {
      setFormData({
        fullName: subAdmin.fullName || '',
        email: subAdmin.email || '',
        phoneNumber: subAdmin.phoneNumber || '',
        status: subAdmin.status || 'ACTIVE'
      });
      setErrors({});
    }
  }, [subAdmin, open]);

  const handleSubmit = () => {
    const newErrors = {};
    
    if (!formData.fullName) newErrors.fullName = 'Vui lòng nhập họ và tên';
    if (!formData.email) newErrors.email = 'Vui lòng nhập email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
    if (!formData.status) newErrors.status = 'Vui lòng chọn trạng thái';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  const handleStatusChange = (status) => {
    if (onUpdateStatus) {
      onUpdateStatus(subAdmin.id, status);
    }
  };

  const handleClose = () => {
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      status: 'ACTIVE'
    });
    setErrors({});
    onClose();
  };

  if (!subAdmin) return null;

  return (
    <Modal
      title="Chỉnh sửa admin phụ"
      open={open}
      onClose={handleClose}
      width="max-w-2xl"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>
            Cập nhật
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Lưu ý:</strong> Không thể thay đổi tên đăng nhập và mật khẩu. Để đổi mật khẩu C2, vui lòng sử dụng nút "Mật khẩu C2" trong bảng.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tên đăng nhập
            </label>
            <Input
              type="text"
              value={subAdmin.username || ''}
              disabled
              className="bg-gray-50 cursor-not-allowed"
              placeholder="username"
            />
            <p className="text-xs text-gray-500 mt-1">Không thể thay đổi</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              className={errors.email ? 'border-red-500' : ''}
              placeholder="email@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.fullName}
              onChange={(e) => {
                setFormData({ ...formData, fullName: e.target.value });
                if (errors.fullName) setErrors({ ...errors, fullName: null });
              }}
              className={errors.fullName ? 'border-red-500' : ''}
              placeholder="Nguyễn Văn A"
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Số điện thoại
            </label>
            <Input
              type="text"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              placeholder="0987654321"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Trạng thái <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.status}
            onChange={(value) => {
              setFormData({ ...formData, status: value });
              if (errors.status) setErrors({ ...errors, status: null });
              // Tự động cập nhật status khi thay đổi
              handleStatusChange(value);
            }}
            options={STATUS_OPTIONS}
            className={errors.status ? 'border-red-500' : ''}
          />
          {errors.status && (
            <p className="text-red-500 text-xs mt-1">{errors.status}</p>
          )}
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-600">
            <strong>ID:</strong> #{subAdmin.id} | 
            <strong className="ml-2">Tạo lúc:</strong> {subAdmin.createdAt ? new Date(subAdmin.createdAt).toLocaleString('vi-VN') : 'N/A'} |
            <strong className="ml-2">Cập nhật lúc:</strong> {subAdmin.updatedAt ? new Date(subAdmin.updatedAt).toLocaleString('vi-VN') : 'N/A'}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default EditSubAdminModal;

