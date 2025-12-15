import { useState, useEffect } from 'react';
import Modal from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';

const STAFF_ROLE_OPTIONS = [
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Nhân viên TX 1', value: 'STAFF_TX1' },
  { label: 'Nhân viên TX 2', value: 'STAFF_TX2' },
  { label: 'Nhân viên Xóc Đĩa', value: 'STAFF_XD' },
  { label: 'Nhân viên MKT', value: 'STAFF_MKT' },
  { label: 'Nhân viên XNK', value: 'STAFF_XNK' },
];

const EditStaffModal = ({ open, onClose, staff, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    status: '',
    staffRole: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (staff) {
      setFormData({
        fullName: staff.fullName || '',
        email: staff.email || '',
        phoneNumber: staff.phoneNumber || '',
        status: staff.status || 'ACTIVE',
        staffRole: staff.role === 'ADMIN' ? 'ADMIN' : (staff.staffRole || '')
      });
      setErrors({});
    }
  }, [staff, open]);

  const handleSubmit = () => {
    const newErrors = {};
    
    if (!formData.fullName) newErrors.fullName = 'Vui lòng nhập họ và tên';
    if (!formData.email) newErrors.email = 'Vui lòng nhập email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
    if (!formData.status) newErrors.status = 'Vui lòng chọn trạng thái';
    if (!formData.staffRole) newErrors.staffRole = 'Vui lòng chọn phân quyền';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      status: '',
      staffRole: ''
    });
    setErrors({});
    onClose();
  };

  if (!staff) return null;

  return (
    <Modal
      title="Chỉnh sửa thông tin nhân viên"
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
              Số điện thoại
            </label>
            <Input
              type="text"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              placeholder="0987654321"
            />
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
              }}
              options={[
                { label: 'Hoạt động', value: 'ACTIVE' },
                { label: 'Tạm khóa', value: 'INACTIVE' },
                { label: 'Tạm dừng', value: 'SUSPENDED' },
                { label: 'Bị cấm', value: 'BANNED' }
              ]}
              className={errors.status ? 'border-red-500' : ''}
            />
            {errors.status && (
              <p className="text-red-500 text-xs mt-1">{errors.status}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Phân quyền <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.staffRole}
            onChange={(value) => {
              setFormData({ ...formData, staffRole: value });
              if (errors.staffRole) setErrors({ ...errors, staffRole: null });
            }}
            options={STAFF_ROLE_OPTIONS}
            className={errors.staffRole ? 'border-red-500' : ''}
            placeholder="Chọn phân quyền"
          />
          {errors.staffRole && (
            <p className="text-red-500 text-xs mt-1">{errors.staffRole}</p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default EditStaffModal;

