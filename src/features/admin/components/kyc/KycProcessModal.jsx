import { useState } from 'react';
import Modal from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';

const KycProcessModal = ({
  open,
  onClose,
  kyc,
  action,
  onConfirm
}) => {
  const [rejectedReason, setRejectedReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [errors, setErrors] = useState({});

  const handleConfirm = () => {
    if (action === 'reject' && !rejectedReason.trim()) {
      setErrors({ rejectedReason: 'Vui lòng nhập lý do từ chối' });
      return;
    }

    onConfirm(rejectedReason, adminNotes);
    // Reset form
    setRejectedReason('');
    setAdminNotes('');
    setErrors({});
  };

  const handleClose = () => {
    setRejectedReason('');
    setAdminNotes('');
    setErrors({});
    onClose();
  };

  if (!kyc) return null;

  return (
    <Modal
      title={action === 'approve' ? 'Duyệt xác thực' : 'Từ chối xác thực'}
      open={open}
      onClose={handleClose}
      width="max-w-lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
          >
            Hủy
          </Button>
          <Button
            variant={action === 'reject' ? 'destructive' : 'default'}
            onClick={handleConfirm}
          >
            {action === 'approve' ? 'Duyệt' : 'Từ chối'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-700">
          Bạn có chắc chắn muốn {action === 'approve' ? 'duyệt' : 'từ chối'} yêu cầu xác thực của{' '}
          <strong>{kyc.username}</strong>?
        </p>

        {action === 'reject' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Lý do từ chối <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={rejectedReason}
              onChange={(e) => {
                setRejectedReason(e.target.value);
                if (errors.rejectedReason) setErrors({ ...errors, rejectedReason: null });
              }}
              className={`w-full px-3 py-2 border rounded-md resize-none ${
                errors.rejectedReason ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Nhập lý do từ chối..."
            />
            {errors.rejectedReason && (
              <p className="text-red-500 text-xs mt-1">{errors.rejectedReason}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Ghi chú của admin
          </label>
          <textarea
            rows={3}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Thêm ghi chú (tùy chọn)..."
          />
        </div>
      </div>
    </Modal>
  );
};

export default KycProcessModal;

