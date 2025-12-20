import Modal from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';
import StatusTag from '../StatusTag';
import { Check, X, FileImage } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../../utils/helpers';

const DepositDetailModal = ({ 
  deposit, 
  visible, 
  onClose, 
  onApprove, 
  onReject 
}) => {
  if (!deposit) return null;

  const getImageUrl = (deposit) => {
    if (deposit.billImage) {
      return `data:image/jpeg;base64,${deposit.billImage}`;
    }
    if (deposit.billImageUrl) {
      const filename = deposit.billImageUrl.split('/').pop();
      return `https://api.tathiet168.com/api/files/bills/${filename}`;
    }
    return null;
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'PENDING':
        return { bgColor: 'bg-yellow-50', textColor: 'text-yellow-700', borderColor: 'border-yellow-200', label: 'Chờ duyệt' };
      case 'APPROVED':
        return { bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200', label: 'Đã duyệt' };
      case 'REJECTED':
        return { bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200', label: 'Đã từ chối' };
      case 'CANCELLED':
        return { bgColor: 'bg-gray-50', textColor: 'text-gray-700', borderColor: 'border-gray-200', label: 'Đã hủy' };
      default:
        return { bgColor: 'bg-gray-50', textColor: 'text-gray-700', borderColor: 'border-gray-200', label: status };
    }
  };

  const imageUrl = getImageUrl(deposit);
  const statusConfig = getStatusConfig(deposit.status);

  return (
    <Modal
      open={visible}
      onClose={onClose}
      title="Chi tiết lệnh nạp tiền"
      className="max-w-3xl"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mã giao dịch</label>
            <div className="font-mono text-blue-600 text-sm">{deposit.transactionCode}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <StatusTag 
              status={deposit.status} 
              customConfig={{ [deposit.status]: statusConfig }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Người dùng</label>
            <div className="text-sm">{deposit.username}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="text-sm">{deposit.userEmail}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền</label>
            <div className="font-bold text-green-600 text-lg">
              {formatCurrency(deposit.amount)}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phương thức</label>
            <div className="text-sm">{deposit.paymentMethod?.name || 'N/A'}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số tài khoản</label>
            <div className="text-sm">{deposit.paymentMethod?.accountNumber || 'N/A'}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian tạo</label>
            <div className="text-sm">{formatDate(deposit.createdAt)}</div>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
            <div className="text-sm">{deposit.description || 'Không có'}</div>
          </div>
          {deposit.rejectReason && (
            <div className="col-span-2">
              <label className="block text-sm font-medium text-red-700 mb-1">Lý do từ chối</label>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {deposit.rejectReason}
              </div>
            </div>
          )}
        </div>

        {imageUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <FileImage className="h-4 w-4" />
                Ảnh bill chuyển khoản
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <img
                  src={imageUrl}
                  alt="Bill chuyển khoản"
                  className="max-w-full max-h-96 mx-auto rounded-lg"
                  onError={(e) => {
                    e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAHpenRVWQAAAABJRU5ErkJggg==';
                  }}
                />
                {deposit.billImageName && (
                  <p className="mt-2 text-gray-500 text-xs">
                    Tên file: {deposit.billImageName}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {deposit.status === 'PENDING' && (
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                onClose();
                onApprove(null, deposit.id);
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
                onReject(null, deposit.id);
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

export default DepositDetailModal;

