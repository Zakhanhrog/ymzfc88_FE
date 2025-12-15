import { useState, useEffect } from 'react';
import Modal from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';

const C2PasswordModal = ({ open, onClose, staff, onSubmit }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setPassword('');
      setError('');
    }
  }, [open]);

  const handleSubmit = () => {
    if (!password) {
      setError('Vui lòng nhập mật khẩu C2 mới');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu tối thiểu 6 ký tự');
      return;
    }

    onSubmit(password);
    setPassword('');
    setError('');
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  if (!staff) return null;

  return (
    <Modal
      title="Đổi mật khẩu C2"
      open={open}
      onClose={handleClose}
      width="max-w-md"
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Mật khẩu C2 mới <span className="text-red-500">*</span>
          </label>
          <Input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError('');
            }}
            className={error ? 'border-red-500' : ''}
            placeholder="Nhập mật khẩu C2 mới (tối thiểu 6 ký tự)"
          />
          {error && (
            <p className="text-red-500 text-xs mt-1">{error}</p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default C2PasswordModal;

