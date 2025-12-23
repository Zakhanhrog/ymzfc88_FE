import { useState } from 'react';
import Modal from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';

const CreateSubAdminModal = ({
  open,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    c2Password: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    const newErrors = {};
    
    if (!formData.username) newErrors.username = 'Vui lòng nhập tên đăng nhập';
    else if (formData.username.length < 3) newErrors.username = 'Tên đăng nhập tối thiểu 3 ký tự';
    
    if (!formData.email) newErrors.email = 'Vui lòng nhập email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
    
    if (!formData.password) newErrors.password = 'Vui lòng nhập mật khẩu';
    else if (formData.password.length < 6) newErrors.password = 'Mật khẩu tối thiểu 6 ký tự';
    
    if (!formData.fullName) newErrors.fullName = 'Vui lòng nhập họ và tên';
    
    if (!formData.c2Password) newErrors.c2Password = 'Vui lòng nhập mật khẩu bảo vệ';
    else if (formData.c2Password.length < 6) newErrors.c2Password = 'Mật khẩu bảo vệ tối thiểu 6 ký tự';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
    // Reset form
    setFormData({
      username: '',
      email: '',
      password: '',
      fullName: '',
      phoneNumber: '',
      c2Password: ''
    });
    setErrors({});
  };

  const handleClose = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      fullName: '',
      phoneNumber: '',
      c2Password: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      title="Tạo admin phụ"
      open={open}
      onClose={handleClose}
      width="max-w-2xl"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>
            Tạo admin phụ
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Lưu ý:</strong> Admin phụ có quyền tương tự admin nhưng không thể truy cập các tab kết quả game (kết quả xổ số, kết quả Tài Xỉu, kết quả Xóc Đĩa).
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tên đăng nhập <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.username}
              onChange={(e) => {
                setFormData({ ...formData, username: e.target.value });
                if (errors.username) setErrors({ ...errors, username: null });
              }}
              className={errors.username ? 'border-red-500' : ''}
              placeholder="username"
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
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
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              className={errors.password ? 'border-red-500' : ''}
              placeholder="Mật khẩu"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
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
            Mật khẩu bảo vệ (C2) <span className="text-red-500">*</span>
            <span className="text-xs text-gray-500 ml-2">
              (Mật khẩu bảo vệ được dùng để đăng nhập vào portal admin)
            </span>
          </label>
          <Input
            type="password"
            value={formData.c2Password}
            onChange={(e) => {
              setFormData({ ...formData, c2Password: e.target.value });
              if (errors.c2Password) setErrors({ ...errors, c2Password: null });
            }}
            className={errors.c2Password ? 'border-red-500' : ''}
            placeholder="Mật khẩu bảo vệ C2"
          />
          {errors.c2Password && (
            <p className="text-red-500 text-xs mt-1">{errors.c2Password}</p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CreateSubAdminModal;

