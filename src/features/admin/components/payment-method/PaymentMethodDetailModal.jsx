import Modal from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';
import Tag from '../../../../components/ui/Tag';
import Switch from '../../../../components/ui/Switch';
import { Edit, Clock } from 'lucide-react';

const PaymentMethodDetailModal = ({
  paymentMethod,
  paymentTypes,
  open,
  onClose,
  onEdit,
  onToggleStatus
}) => {
  if (!paymentMethod) return null;

  const getPaymentTypeConfig = (type) => {
    return paymentTypes.find(pt => pt.value === type) || { label: type, icon: '💳', color: 'default' };
  };

  const config = getPaymentTypeConfig(paymentMethod.type);

  return (
    <Modal
      title="Chi tiết phương thức thanh toán"
      open={open}
      onClose={onClose}
      className="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="text-center">
          <div className="mb-4">
            <Tag color={config.color} className="text-base px-4 py-2">
              {config.label}
            </Tag>
          </div>
          <h3 className="text-xl font-semibold mb-1">{paymentMethod.name}</h3>
          <p className="text-gray-500 text-sm">{paymentMethod.accountNumber}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên chủ tài khoản</label>
            <div className="text-sm">{paymentMethod.accountName}</div>
          </div>

          {paymentMethod.bankCode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mã ngân hàng</label>
              <div className="text-sm">{paymentMethod.bankCode}</div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giới hạn giao dịch</label>
            <div className="text-sm space-y-1">
              <div>Tối thiểu: {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(paymentMethod.minAmount)}</div>
              <div>Tối đa: {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(paymentMethod.maxAmount)}</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phí giao dịch</label>
            <div className="text-sm space-y-1">
              {paymentMethod.feePercent > 0 && (
                <div className="text-orange-600">Phí %: {paymentMethod.feePercent}%</div>
              )}
              {paymentMethod.feeFixed > 0 && (
                <div className="text-blue-600">
                  Phí cố định: {new Intl.NumberFormat('vi-VN').format(paymentMethod.feeFixed)} VNĐ
                </div>
              )}
              {paymentMethod.feePercent === 0 && paymentMethod.feeFixed === 0 && (
                <div className="text-green-600">Miễn phí</div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian xử lý</label>
            <div className="text-sm flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {paymentMethod.processingTime || 'Ngay lập tức'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự hiển thị</label>
            <div className="text-sm">{paymentMethod.displayOrder}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <Switch
              checked={paymentMethod.isActive}
              onChange={() => onToggleStatus(paymentMethod.id)}
            />
          </div>

          {paymentMethod.description && (
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <div className="text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">
                {paymentMethod.description}
              </div>
            </div>
          )}

          {paymentMethod.qrCode && (
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mã QR</label>
              <div className="mt-2">
                <img
                  src={paymentMethod.qrCode}
                  alt="QR Code"
                  className="max-w-[200px] rounded-lg"
                  onError={(e) => {
                    e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxY4Q9gLQQKC7egIpQIV8DGbbABBa6AK1ApX4EjNwfAUnAVLEChOBBIlMGGWiGdHjPfvfmfX3TgBmyRqZjuX5/eGsM93GQyGp3R6RDdyBLOKr9lf0vJAOEo8g3vAAmWu8qwUBm2KsNG+ZbdIbyPcC8R3kX8mQg+l+GjMhP5Z2X4Q5l9VaLfdK6KI1EfxJHoDsSR6A7EkegOqCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPgcZC5RaYaT9yk+kQUEUTNxJF4UYiYEfjnTBhZtcUvQe9Y/W3W5H7T6aKfCNR5BuJQRNz5kYj4m8kilXajcTlWZ65Zo7WzjfYQ0EAAAAASUVORK5CYII=';
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tạo</label>
            <div className="text-sm">{new Date(paymentMethod.createdAt).toLocaleString('vi-VN')}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cập nhật cuối</label>
            <div className="text-sm">{new Date(paymentMethod.updatedAt).toLocaleString('vi-VN')}</div>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              onClose();
              onEdit(paymentMethod);
            }}
            className="flex-1 gap-2"
          >
            <Edit className="h-4 w-4" />
            Chỉnh sửa
          </Button>
          <Button
            variant={paymentMethod.isActive ? 'outline' : 'default'}
            onClick={() => onToggleStatus(paymentMethod.id)}
            className={paymentMethod.isActive ? 'flex-1' : 'flex-1 bg-[#4CAF50] text-white hover:bg-[#45a049]'}
          >
            {paymentMethod.isActive ? 'Tạm khóa' : 'Kích hoạt'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentMethodDetailModal;

