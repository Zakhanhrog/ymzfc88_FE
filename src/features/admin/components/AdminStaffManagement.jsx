import { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from '../../../utils/notification';
import adminService from '../services/adminService';
import StaffFilters from './staff-management/StaffFilters';
import StaffTable from './staff-management/StaffTable';
import CreateStaffModal from './staff-management/CreateStaffModal';
import EditStaffModal from './staff-management/EditStaffModal';
import PasswordModal from './staff-management/PasswordModal';
import C2PasswordModal from './staff-management/C2PasswordModal';

const STAFF_ROLE_OPTIONS = [
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Nhân viên TX 1', value: 'STAFF_TX1' },
  { label: 'Nhân viên TX 2', value: 'STAFF_TX2' },
  { label: 'Nhân viên Xóc Đĩa', value: 'STAFF_XD' },
  { label: 'Nhân viên MKT', value: 'STAFF_MKT' },
  { label: 'Nhân viên XNK', value: 'STAFF_XNK' },
];

const DEFAULT_PAGE_SIZE = 20;

const AdminStaffManagement = ({
  initialRole = 'STAFF',
  allowRoleFilter = true,
  title = 'Quản lý nhân viên',
  description,
  readOnly = false,
  useRoleAssignmentCreateOptions = false,
}) => {
  const [roleFilter, setRoleFilter] = useState(initialRole);
  const [loading, setLoading] = useState(false);
  const [staff, setStaff] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showC2Modal, setShowC2Modal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const filterOptions = useMemo(() => {
    if (!allowRoleFilter) {
      return [];
    }
    if (readOnly) {
      return [
        { label: 'Tất cả nhân viên', value: 'STAFF' },
        { label: 'Admin', value: 'ADMIN' },
        ...STAFF_ROLE_OPTIONS,
      ];
    }
    return [
      { label: 'Tất cả nhân viên', value: 'STAFF' },
      ...STAFF_ROLE_OPTIONS,
    ];
  }, [allowRoleFilter, readOnly]);

  const requestRole = useMemo(() => {
    if (readOnly) {
      if (!roleFilter || roleFilter === 'ALL' || roleFilter === 'STAFF') {
        return 'STAFF';
      }
      return roleFilter;
    }
    if (!roleFilter || roleFilter === 'ALL' || roleFilter === 'STAFF') {
      return 'STAFF';
    }
    return roleFilter;
  }, [roleFilter, readOnly]);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminService.getStaffUsers({
        staffRole: requestRole,
        page: pagination.current - 1,
        size: pagination.pageSize,
      });
      const payload = response?.data ?? {};
      setStaff(payload.items ?? []);
      setPagination((prev) => ({
        ...prev,
        total: payload.totalItems ?? 0,
      }));
    } catch (error) {
      message.error(error.message || 'Không thể tải danh sách nhân viên');
    } finally {
      setLoading(false);
    }
  }, [requestRole, pagination.current, pagination.pageSize]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleRoleFilterChange = (value) => {
    if (readOnly) {
      setRoleFilter(value || 'STAFF');
    } else {
      setRoleFilter(value || 'ALL');
    }
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));
  };

  const handlePaginationChange = (page, pageSize) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize: pageSize || prev.pageSize,
    }));
  };

  const handleUpdateStaffRole = useCallback(async (userId, staffRole) => {
    try {
      await adminService.updateStaffRole(userId, staffRole);
      message.success('Cập nhật phân quyền thành công');
      fetchStaff();
    } catch (error) {
      message.error(error.message || 'Không thể cập nhật phân quyền');
    }
  }, [fetchStaff]);

  const handleOpenEdit = (record) => {
    setSelectedStaff(record);
    setShowEditModal(true);
  };

  const handleOpenPassword = (record) => {
    setSelectedStaff(record);
    setShowPasswordModal(true);
  };

  const handleOpenC2 = (record) => {
    setSelectedStaff(record);
    setShowC2Modal(true);
  };

  const handleUpdateStaff = async (formData) => {
    try {
      const payload = { ...formData };
      if (formData.staffRole === 'ADMIN') {
        payload.role = 'ADMIN';
        delete payload.staffRole;
      } else {
        payload.role = 'USER';
        payload.staffRole = formData.staffRole || null;
      }
      const response = await adminService.updateUser(selectedStaff.id, payload);
      if (response.success) {
        message.success('Cập nhật thông tin thành công');
        setShowEditModal(false);
        setSelectedStaff(null);
        fetchStaff();
      }
    } catch (error) {
      message.error(error.message || 'Không thể cập nhật thông tin');
    }
  };

  const handleUpdatePassword = async (newPassword) => {
    try {
      const response = await adminService.resetUserPassword(selectedStaff.id, newPassword);
      if (response.success) {
        message.success('Đổi mật khẩu thành công');
        setShowPasswordModal(false);
        setSelectedStaff(null);
      }
    } catch (error) {
      message.error(error.message || 'Không thể đổi mật khẩu');
    }
  };

  const handleUpdateC2Password = async (newC2Password) => {
    try {
      const response = await adminService.updateUserC2Password(selectedStaff.id, newC2Password);
      if (response.success) {
        message.success('Đổi mật khẩu C2 thành công');
        setShowC2Modal(false);
        setSelectedStaff(null);
      }
    } catch (error) {
      message.error(error.message || 'Không thể đổi mật khẩu C2');
    }
  };

  const handleCreateStaff = async (formData) => {
    try {
      const payload = { ...formData };
      
      // Nếu là ADMIN thì set role = 'ADMIN', không có staffRole
      if (formData.staffRole === 'ADMIN') {
        payload.role = 'ADMIN';
        delete payload.staffRole;
      } else {
        payload.role = 'USER';
        payload.staffRole = formData.staffRole;
      }
      
      const response = await adminService.createUser(payload);
      if (response.success) {
        message.success('Tạo tài khoản nhân viên thành công!');
        setShowCreateModal(false);
        fetchStaff();
      }
    } catch (error) {
      message.error(error.message || 'Không thể tạo tài khoản nhân viên');
    }
  };

  return (
    <div className="space-y-4">
      <StaffFilters
        roleFilter={roleFilter}
        onRoleFilterChange={handleRoleFilterChange}
        onRefresh={fetchStaff}
        onCreate={() => setShowCreateModal(true)}
        loading={loading}
        allowRoleFilter={allowRoleFilter}
        readOnly={readOnly}
        filterOptions={filterOptions}
      />

      <StaffTable
        data={staff}
        loading={loading}
        pagination={pagination}
        readOnly={readOnly}
        onPaginationChange={handlePaginationChange}
        onUpdateRole={handleUpdateStaffRole}
        onEdit={handleOpenEdit}
        onPassword={handleOpenPassword}
        onC2Password={handleOpenC2}
      />

      {/* Create Staff Modal */}
      <CreateStaffModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateStaff}
        useRoleAssignmentCreateOptions={useRoleAssignmentCreateOptions}
      />

      {/* Edit Staff Modal */}
      <EditStaffModal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedStaff(null);
        }}
        staff={selectedStaff}
        onSubmit={handleUpdateStaff}
      />

      {/* Password Modal */}
      <PasswordModal
        open={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setSelectedStaff(null);
        }}
        staff={selectedStaff}
        onSubmit={handleUpdatePassword}
      />

      {/* C2 Password Modal */}
      <C2PasswordModal
        open={showC2Modal}
        onClose={() => {
          setShowC2Modal(false);
          setSelectedStaff(null);
        }}
        staff={selectedStaff}
        onSubmit={handleUpdateC2Password}
      />
    </div>
  );
};

export default AdminStaffManagement;
