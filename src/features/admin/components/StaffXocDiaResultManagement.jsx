import TabPageHeader from './TabPageHeader';
import AdminXocDiaResultManagement from './AdminXocDiaResultManagement';

const StaffXocDiaResultManagement = () => (
  <div className="space-y-6">
    <TabPageHeader
      title="Nhân viên Xóc Đĩa"
      description="Nhập kết quả và theo dõi tình trạng phiên cho bàn Xóc Đĩa"
    />
    <AdminXocDiaResultManagement />
  </div>
);

export default StaffXocDiaResultManagement;

