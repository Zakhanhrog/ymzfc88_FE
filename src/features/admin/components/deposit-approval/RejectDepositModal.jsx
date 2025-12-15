import { useState, useEffect } from 'react';
import Modal from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import Textarea from '../../../../components/ui/Textarea';
import { X, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../../../utils/helpers';

const RejectDepositModal = ({ 
  deposit, 
  visible, 
  onClose, 
  onConfirm 
}) => {
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    if (!visible) {
      setRejectReason('');
    }
  }, [visible]);

  if (!deposit) return null;

  const handleConfirm = () => {
    if (!rejectReason.trim()) {
      return;
    }
    onConfirm(rejectReason);
  };

  return (
    <Modal
      open={visible}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <X className="h-5 w-5 text-red-600" />
          <span>Từ chối lệnh nạp tiền</span>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-yellow-800 mb-1">Cảnh báo</div>
              <div className="text-xs text-yellow-700">
                Bạn đang từ chối lệnh nạp tiền. Hành động này không thể hoàn tác.
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mã giao dịch</label>
            <div className="font-mono text-blue-600 text-sm">{deposit.transactionCode}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Người dùng</label>
            <div className="font-semibold text-sm">{deposit.username}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền</label>
            <div className="font-bold text-green-600 text-sm">
              {formatCurrency(deposit.amount)}
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lý do từ chối <span className="text-red-500">*</span>
          </label>
          <Textarea
            rows={4}
            placeholder="Nhập lý do từ chối..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="resize-none"
          />
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!rejectReason.trim()}
            className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            <X className="h-4 w-4 mr-2" />
            Xác nhận từ chối
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RejectDepositModal;

