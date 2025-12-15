import Modal from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { Check } from 'lucide-react';
import { formatCurrency } from '../../../../utils/helpers';

const ApproveWithdrawModal = ({ 
  withdraw, 
  visible, 
  onClose, 
  onConfirm 
}) => {
  if (!withdraw) return null;

  return (
    <Modal
      open={visible}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Check className="h-5 w-5 text-green-600" />
          <span>Duyệt lệnh rút tiền</span>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="text-sm font-semibold text-green-800 mb-1">Xác nhận duyệt</div>
          <div className="text-xs text-green-700">
            Sau khi duyệt, số tiền sẽ được trừ khỏi tài khoản người dùng và chuyển đến tài khoản đã đăng ký.
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mã giao dịch</label>
            <div className="font-mono text-blue-600 text-sm">{withdraw.transactionCode}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Người dùng</label>
            <div className="font-semibold text-sm">{withdraw.username}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền rút</label>
            <div className="font-bold text-green-600 text-lg">
              {formatCurrency(withdraw.amount)}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tài khoản nhận</label>
            <div>
              <div className="font-semibold text-sm">{withdraw.accountName || 'N/A'}</div>
              <div className="font-mono text-sm text-gray-600">{withdraw.accountNumber || withdraw.methodAccount || 'N/A'}</div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            <Check className="h-4 w-4 mr-2" />
            Xác nhận duyệt
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ApproveWithdrawModal;

