import { Lock, Unlock, Info } from 'lucide-react';
import Alert from '../../../../components/ui/Alert';

const WithdrawalLockTab = () => {
  return (
    <div className="space-y-4">
      <Alert
        type="info"
        message="Quản lý khóa rút tiền cho từng người dùng"
        description="Tính năng này cho phép admin khóa rút tiền cho từng người dùng cụ thể với lý do riêng biệt. Để khóa rút tiền, hãy vào mục 'Quản lý người dùng' và click vào biểu tượng khóa."
        showIcon
      />

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="text-base font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Hướng dẫn khóa rút tiền
        </h4>
        <div className="space-y-2 text-blue-700 text-sm">
          <p>1. Vào mục <strong>"Quản lý người dùng"</strong> trong menu bên trái</p>
          <p>2. Tìm người dùng cần khóa rút tiền</p>
          <p>3. Click vào biểu tượng <strong>🔒</strong> trong cột "Thao tác"</p>
          <p>4. Nhập lý do khóa rút tiền cụ thể cho người dùng đó</p>
          <p>5. Click <strong>"Khóa rút tiền"</strong> để xác nhận</p>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h4 className="text-base font-semibold text-green-800 mb-3 flex items-center gap-2">
          <Unlock className="h-5 w-5" />
          Hướng dẫn mở khóa rút tiền
        </h4>
        <div className="space-y-2 text-green-700 text-sm">
          <p>1. Vào mục <strong>"Quản lý người dùng"</strong></p>
          <p>2. Tìm người dùng đã bị khóa (có tag đỏ "Khóa rút")</p>
          <p>3. Click vào biểu tượng <strong>🔓</strong> để mở khóa ngay lập tức</p>
          <p>4. Không cần nhập lý do khi mở khóa</p>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h4 className="text-base font-semibold text-yellow-800 mb-3 flex items-center gap-2">
          <Info className="h-5 w-5" />
          Lưu ý quan trọng
        </h4>
        <div className="space-y-2 text-yellow-700 text-sm">
          <p>• Lý do khóa rút tiền sẽ được hiển thị cho người dùng khi họ cố gắng rút tiền</p>
          <p>• Mỗi người dùng có thể có lý do khóa rút tiền khác nhau</p>
          <p>• Admin có thể xem lý do khóa rút tiền trong chi tiết người dùng</p>
          <p>• Việc khóa/mở khóa rút tiền sẽ được ghi nhận thời gian</p>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalLockTab;

