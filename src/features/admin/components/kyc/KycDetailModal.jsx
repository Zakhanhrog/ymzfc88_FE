import { CheckCircle2, XCircle } from 'lucide-react';
import Modal from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { Card, CardContent } from '../../../../components/ui/Card';
import KycStatusTag from './KycStatusTag';

const KycDetailModal = ({ open, onClose, kyc, onApprove, onReject }) => {
  if (!kyc) return null;

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.tathiet168.com';

  return (
    <Modal
      title="Chi tiết xác thực"
      open={open}
      onClose={onClose}
      width="max-w-4xl"
      footer={
        kyc.status === 'PENDING' && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Đóng
            </Button>
            <Button
              onClick={() => {
                onClose();
                onApprove(kyc);
              }}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Duyệt
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onClose();
                onReject(kyc);
              }}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Từ chối
            </Button>
          </div>
        )
      }
    >
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1">Người dùng</p>
                <p className="text-sm text-gray-900">{kyc.username}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1">Email</p>
                <p className="text-sm text-gray-900">{kyc.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1">Họ tên</p>
                <p className="text-sm text-gray-900">{kyc.fullName || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1">Số CCCD</p>
                <p className="text-sm text-gray-900">{kyc.idNumber || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1">Trạng thái</p>
                <KycStatusTag status={kyc.status} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1">Ngày gửi</p>
                <p className="text-sm text-gray-900">
                  {new Date(kyc.submittedAt).toLocaleString('vi-VN')}
                </p>
              </div>
              {kyc.verifiedAt && (
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">Ngày duyệt</p>
                  <p className="text-sm text-gray-900">
                    {new Date(kyc.verifiedAt).toLocaleString('vi-VN')}
                  </p>
                </div>
              )}
              {kyc.rejectedReason && (
                <div className="md:col-span-2">
                  <p className="text-xs font-semibold text-gray-700 mb-1">Lý do từ chối</p>
                  <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                    {kyc.rejectedReason}
                  </p>
                </div>
              )}
              {kyc.adminNotes && (
                <div className="md:col-span-2">
                  <p className="text-xs font-semibold text-gray-700 mb-1">Ghi chú admin</p>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">
                    {kyc.adminNotes}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div>
          <h4 className="font-semibold mb-3 text-center text-gray-900">Ảnh căn cước:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-500 mb-2">Mặt trước</p>
              <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: '200px', width: '350px' }}>
                <img
                  src={`${API_BASE_URL}/api/files/kyc/${kyc.frontImageUrl}`}
                  alt="Mặt trước"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-500 mb-2">Mặt sau</p>
              <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: '200px', width: '350px' }}>
                <img
                  src={`${API_BASE_URL}/api/files/kyc/${kyc.backImageUrl}`}
                  alt="Mặt sau"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default KycDetailModal;

