import AdminStaffManagement from './AdminStaffManagement';

const AdminAgentManagement = () => (
  <AdminStaffManagement
    initialRole="AGENT"
    allowRoleFilter={false}
    readOnly
    title="Quản lý đại lý"
    description="Danh sách người dùng được phân quyền đại lý."
  />
);

export default AdminAgentManagement;


