import TabPageHeader from './TabPageHeader';
import { SicboResultTablePanel } from './AdminSicboResultManagement';

const StaffSicboResultManagement = ({ tableNumber }) => (
  <div className="space-y-6">
    <TabPageHeader
      title={`Nhân viên bàn TX${tableNumber}`}
      description={`Nhập kết quả và theo dõi tình trạng phiên cho bàn Tài Xỉu ${tableNumber}`}
    />
    <SicboResultTablePanel tableNumber={tableNumber} />
  </div>
);

export default StaffSicboResultManagement;

