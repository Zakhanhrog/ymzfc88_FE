import AdminStaffManagement from './AdminStaffManagement';

const AdminRoleAssignment = () => (
  <AdminStaffManagement
    initialRole="ALL"
    allowRoleFilter
    title="Phân quyền người dùng"
    description="Gán người dùng vào nhóm đại lý hoặc các đội nhân viên. Chọn phân quyền trong bảng để cập nhật."
  />
);

export default AdminRoleAssignment;


