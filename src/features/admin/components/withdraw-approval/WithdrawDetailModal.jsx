import Modal from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';
import StatusTag from '../StatusTag';
import { Check, X, Banknote } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../../utils/helpers';

const WithdrawDetailModal = ({ 
  withdraw, 
  visible, 
  onClose, 
  onApprove, 
  onReject 
}) => {
  if (!withdraw) return null;

  const getStatusConfig = (status) => {
    switch (status) {
      case 'PENDING':
        return { bgColor: 'bg-yellow-50', textColor: 'text-yellow-700', borderColor: 'border-yellow-200', label: 'Chờ duyệt' };
      case 'APPROVED':
        return { bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200', label: 'Đã duyệt' };
      case 'REJECTED':
        return { bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200', label: 'Đã từ chối' };
      case 'PROCESSING':
        return { bgColor: 'bg-blue-50', textColor: 'text-blue-700', borderColor: 'border-blue-200', label: 'Đang xử lý' };
      case 'COMPLETED':
        return { bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200', label: 'Hoàn thành' };
      case 'CANCELLED':
        return { bgColor: 'bg-gray-50', textColor: 'text-gray-700', borderColor: 'border-gray-200', label: 'Đã hủy' };
      default:
        return { bgColor: 'bg-gray-50', textColor: 'text-gray-700', borderColor: 'border-gray-200', label: status };
    }
  };

  const statusConfig = getStatusConfig(withdraw.status);

  return (
    <Modal
      open={visible}
      onClose={onClose}
      title="Chi tiết lệnh rút tiền"
      className="max-w-3xl"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mã giao dịch</label>
            <div className="font-mono text-blue-600 text-sm">{withdraw.transactionCode}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <StatusTag 
              status={withdraw.status} 
              customConfig={{ [withdraw.status]: statusConfig }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Người dùng</label>
            <div className="text-sm">{withdraw.username}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="text-sm">{withdraw.userEmail}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền</label>
            <div className="font-bold text-green-600 text-lg">
              {formatCurrency(withdraw.amount)}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phí giao dịch</label>
            <div className="text-orange-600 text-sm">
              {formatCurrency(withdraw.fee || 0)}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian tạo</label>
            <div className="text-sm">{formatDate(withdraw.createdAt)}</div>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
            <div className="text-sm">{withdraw.description || 'Không có'}</div>
          </div>
          {withdraw.rejectReason && (
            <div className="col-span-2">
              <label className="block text-sm font-medium text-red-700 mb-1">Lý do từ chối</label>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {withdraw.rejectReason}
              </div>
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Banknote className="h-4 w-4" />
              Thông tin tài khoản nhận
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên tài khoản</label>
                <div className="font-semibold text-sm">{withdraw.accountName || 'N/A'}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số tài khoản/SĐT</label>
                <div className="font-mono text-sm">{withdraw.methodAccount || withdraw.accountNumber || 'N/A'}</div>
              </div>
              {withdraw.bankCode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mã ngân hàng</label>
                  <div className="text-sm">{withdraw.bankCode}</div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phương thức</label>
                <div className="text-sm">
                  {withdraw.paymentMethod?.name || 'N/A'}
                  {withdraw.paymentMethod?.typeName && (
                    <span className="text-gray-500 ml-2">({withdraw.paymentMethod.typeName})</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {withdraw.status === 'PENDING' && (
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                onClose();
                onApprove(withdraw.id);
              }}
              className="gap-2 bg-green-600 text-white hover:bg-green-700 border-green-600"
            >
              <Check className="h-4 w-4" />
              Duyệt ngay
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                onClose();
                onReject(withdraw.id);
              }}
              className="gap-2 text-red-600 border-red-600 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
              Từ chối
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default WithdrawDetailModal;

