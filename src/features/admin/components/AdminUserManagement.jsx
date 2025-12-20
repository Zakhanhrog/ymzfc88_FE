import React, { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import { User, Edit, Key, Lock, Unlock, Shield, Banknote, DollarSign, Plus, Minus } from 'lucide-react';
import { message } from '../../../utils/notification';
import { adminAuthService } from '../services/adminAuthService';
import { getPortalType } from '../../../utils/subdomain';
import { adminService } from '../services/adminService';
import { cn } from '@/lib/utils';
import UserStatsCards from './user-management/UserStatsCards';
import UserFilterForm from './user-management/UserFilterForm';
import UserTable from './user-management/UserTable';
import StatusTag from './StatusTag';
import Modal from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Alert from '../../../components/ui/Alert';
import { Card, CardContent } from '../../../components/ui/Card';

const ROLE_SELECTIONS = [
  { value: 'USER', label: 'Người dùng' },
  { value: 'AGENT', label: 'Đại lý' },
  { value: 'STAFF_MKT', label: 'Nhân viên MKT' },
  { value: 'STAFF_XNK', label: 'Nhân viên XNK' },
  { value: 'STAFF_TX1', label: 'Nhân viên bàn TX1' },
  { value: 'STAFF_TX2', label: 'Nhân viên bàn TX2' },
  { value: 'STAFF_XD', label: 'Nhân viên Xóc Đĩa' },
];

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    role: null,
    status: null,
    searchTerm: '',
    sortBy: 'createdAt',
    sortDirection: 'desc',
    startDate: null,
    endDate: null
  });
  const [userStats, setUserStats] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showC2Modal, setShowC2Modal] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [lockAction, setLockAction] = useState(null); // 'lock' or 'unlock'
  const [showBankModal, setShowBankModal] = useState(false);
  const [showPointModal, setShowPointModal] = useState(false);
  const [userPaymentMethods, setUserPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false);
  const [showC2InfoModal, setShowC2InfoModal] = useState(false);
  const [c2InfoUser, setC2InfoUser] = useState(null);

  // Form states
  const [createFormData, setCreateFormData] = useState({});
  const [createFormErrors, setCreateFormErrors] = useState({});
  const [editFormData, setEditFormData] = useState({});
  const [editFormErrors, setEditFormErrors] = useState({});
  const [passwordFormData, setPasswordFormData] = useState({});
  const [passwordFormErrors, setPasswordFormErrors] = useState({});
  const [c2FormData, setC2FormData] = useState({});
  const [c2FormErrors, setC2FormErrors] = useState({});
  const [lockFormData, setLockFormData] = useState({});
  const [lockFormErrors, setLockFormErrors] = useState({});
  const [bankFormData, setBankFormData] = useState({});
  const [bankFormErrors, setBankFormErrors] = useState({});
  const [pointFormData, setPointFormData] = useState({});
  const [pointFormErrors, setPointFormErrors] = useState({});

  const currentAdminSession = adminAuthService.getCurrentAdmin();
  const currentPortal = useMemo(
    () => currentAdminSession?.portal || getPortalType() || 'admin',
    [currentAdminSession]
  );
  const isStaffPortal = currentPortal === 'staff';
  const isStaffXnk = isStaffPortal && currentAdminSession?.staffRole === 'STAFF_XNK';
  const isAdminPortal = currentPortal === 'admin' && currentAdminSession?.role === 'ADMIN';

  const availableRoleOptions = useMemo(() => {
    if (isStaffXnk) {
      return ROLE_SELECTIONS.filter((option) => option.value === 'USER');
    }
    if (isAdminPortal) {
      return ROLE_SELECTIONS;
    }
    return ROLE_SELECTIONS.filter((option) => option.value === 'USER');
  }, [isAdminPortal, isStaffXnk]);

  // Chỉ cho phép chọn USER và AGENT khi tạo người dùng mới
  const createRoleOptions = useMemo(() => {
    return ROLE_SELECTIONS.filter((option) => 
      option.value === 'USER' || option.value === 'AGENT'
    );
  }, []);

  // Load data
  useEffect(() => {
    loadUsers();
    loadUserStats();
  }, [pagination.current, pagination.pageSize, filters]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page: pagination.current - 1,
        size: pagination.pageSize
      };
      
      // Format dates for API
      if (params.startDate) {
        params.startDate = dayjs(params.startDate).format('YYYY-MM-DD');
      }
      if (params.endDate) {
        params.endDate = dayjs(params.endDate).format('YYYY-MM-DD');
      }
      
      const response = await adminService.getUsersWithFilters(params);
      
      if (response.success) {
        setUsers(response.data.content);
        setPagination(prev => ({
          ...prev,
          total: response.data.totalElements
        }));
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    try {
      const response = await adminService.getUserStats();
      if (response.success) {
        setUserStats(response.data);
      }
    } catch (error) {
    }
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      role: null,
      status: null,
      searchTerm: '',
      sortBy: 'createdAt',
      sortDirection: 'desc',
      startDate: null,
      endDate: null
    });
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // Handle table pagination
  const handleTableChange = (page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize || prev.pageSize
    }));
  };

  const openCreateModal = () => {
    setCreateFormData({
      role: isStaffXnk ? 'USER' : 'USER'
    });
    setCreateFormErrors({});
    setShowCreateModal(true);
  };

  const canManageC2 = (user) => !!user && Boolean(user.staffRole);

  // Create user
  const normalizeRolePayload = (selectedRole) => {
    if (!selectedRole || selectedRole === 'USER') {
      return { role: 'USER' };
    }
    // AGENT và các staff role khác
    return {
      role: 'USER',
      staffRole: selectedRole
    };
  };

  const handleCreateUser = async () => {
    // Validation
    const errors = {};
    if (!createFormData.username) errors.username = 'Vui lòng nhập tên đăng nhập';
    if (!createFormData.email) errors.email = 'Vui lòng nhập email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createFormData.email)) errors.email = 'Email không hợp lệ';
    if (!createFormData.password) errors.password = 'Vui lòng nhập mật khẩu';
    if (!createFormData.fullName) errors.fullName = 'Vui lòng nhập họ và tên';
    
    if (Object.keys(errors).length > 0) {
      setCreateFormErrors(errors);
      return;
    }

    try {
      const selectedRole = isStaffXnk ? 'USER' : createFormData.role;
      const payload = {
        ...createFormData,
        ...normalizeRolePayload(selectedRole)
      };

      if (isStaffXnk) {
        payload.role = 'USER';
        delete payload.staffRole;
      }

      if (!payload.staffRole) {
        delete payload.staffRole;
      }

      if (!payload.c2Password) {
        delete payload.c2Password;
      }

      const response = await adminService.createUser(payload);
      if (response.success) {
        message.success('Tạo người dùng thành công!');
        setShowCreateModal(false);
        setCreateFormData({});
        setCreateFormErrors({});
        loadUsers();
        loadUserStats();
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  // Update user
  const handleUpdateUser = async () => {
    // Validation
    const errors = {};
    if (!editFormData.fullName) errors.fullName = 'Vui lòng nhập họ và tên';
    if (!editFormData.email) errors.email = 'Vui lòng nhập email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFormData.email)) errors.email = 'Email không hợp lệ';
    
    if (Object.keys(errors).length > 0) {
      setEditFormErrors(errors);
      return;
    }

    try {
      const selectedRole = isStaffXnk ? 'USER' : editFormData.role;
      const payload = {
        ...editFormData,
        ...normalizeRolePayload(selectedRole)
      };
      
      if (isStaffXnk) {
        delete payload.role;
        delete payload.staffRole;
      }
      
      if (!payload.staffRole) {
        delete payload.staffRole;
      }

      // Normalize referralCode to uppercase
      if (payload.referralCode) {
        payload.referralCode = payload.referralCode.trim().toUpperCase();
      }
      
      const response = await adminService.updateUser(selectedUser.id, payload);
      if (response.success) {
        message.success('Cập nhật người dùng thành công!');
        setShowEditModal(false);
        setEditFormData({});
        setEditFormErrors({});
        setSelectedUser(null);
        loadUsers();
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    try {
      const response = await adminService.deleteUser(userId);
      if (response.success) {
        message.success('Xóa người dùng thành công!');
        loadUsers();
        loadUserStats();
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  // Update user status
  const handleUpdateStatus = async (userId, status) => {
    try {
      const response = await adminService.updateUserStatus(userId, status);
      if (response.success) {
        message.success('Cập nhật trạng thái thành công!');
        loadUsers();
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  // Reset password
  const handleResetPassword = async () => {
    if (!passwordFormData.newPassword) {
      setPasswordFormErrors({ newPassword: 'Vui lòng nhập mật khẩu mới' });
      return;
    }
    if (passwordFormData.newPassword.length < 6) {
      setPasswordFormErrors({ newPassword: 'Mật khẩu tối thiểu 6 ký tự' });
      return;
    }

    try {
      const response = await adminService.resetUserPassword(selectedUser.id, passwordFormData.newPassword);
      if (response.success) {
        message.success('Reset mật khẩu thành công!');
        setShowPasswordModal(false);
        setPasswordFormData({});
        setPasswordFormErrors({});
        setSelectedUser(null);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleResetC2Password = async () => {
    if (!c2FormData.newC2Password) {
      setC2FormErrors({ newC2Password: 'Vui lòng nhập mật khẩu bảo vệ mới' });
      return;
    }
    if (c2FormData.newC2Password.length < 6) {
      setC2FormErrors({ newC2Password: 'Mật khẩu tối thiểu 6 ký tự' });
      return;
    }

    try {
      const response = await adminService.updateUserC2Password(selectedUser.id, c2FormData.newC2Password);
      if (response.success) {
        message.success('Cập nhật mật khẩu bảo vệ thành công!');
        setShowC2Modal(false);
        setC2FormData({});
        setC2FormErrors({});
        setSelectedUser(null);
        loadUsers();
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  // Update bank info
  const handleUpdateBank = async () => {
    const errors = {};
    if (!bankFormData.name) errors.name = 'Vui lòng nhập tên phương thức';
    if (!bankFormData.type) errors.type = 'Vui lòng chọn loại';
    if (!bankFormData.accountNumber) errors.accountNumber = 'Vui lòng nhập số tài khoản';
    if (!bankFormData.accountName) errors.accountName = 'Vui lòng nhập tên chủ tài khoản';
    if (bankFormData.type === 'BANK' && !bankFormData.bankCode) errors.bankCode = 'Vui lòng chọn ngân hàng';

    if (Object.keys(errors).length > 0) {
      setBankFormErrors(errors);
      return;
    }

    try {
      const response = await adminService.updateUserPaymentMethod(
        selectedUser.id,
        selectedPaymentMethod.id,
        bankFormData
      );
      if (response.success) {
        message.success('Cập nhật thông tin ngân hàng thành công!');
        setShowBankModal(false);
        setBankFormData({});
        setBankFormErrors({});
        setSelectedPaymentMethod(null);
        await loadUserPaymentMethods(selectedUser.id);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  // Adjust points
  const handleAdjustPoints = async () => {
    const errors = {};
    if (!pointFormData.type) errors.type = 'Vui lòng chọn loại thao tác';
    if (!pointFormData.points || parseInt(pointFormData.points) < 1) errors.points = 'Số điểm phải lớn hơn 0';
    if (pointFormData.type === 'ADD' && !pointFormData.moneyType) errors.moneyType = 'Vui lòng chọn loại tiền';
    if (!pointFormData.description) errors.description = 'Vui lòng nhập lý do';

    if (Object.keys(errors).length > 0) {
      setPointFormErrors(errors);
      return;
    }

    try {
      const payload = {
        points: parseInt(pointFormData.points),
        type: pointFormData.type,
        description: pointFormData.description
      };
      
      // Chỉ gửi moneyType khi type = ADD
      if (pointFormData.type === 'ADD' && pointFormData.moneyType) {
        payload.moneyType = pointFormData.moneyType;
      }
      
      const response = await adminService.adjustUserPoints(selectedUser.id, payload);
      if (response.success) {
        message.success(`${pointFormData.type === 'ADD' ? 'Cộng' : 'Trừ'} điểm thành công!`);
        setShowPointModal(false);
        setPointFormData({});
        setPointFormErrors({});
        setSelectedUser(null);
        loadUsers();
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  // Load user payment methods
  const loadUserPaymentMethods = async (userId) => {
    setLoadingPaymentMethods(true);
    try {
      const response = await adminService.getUserPaymentMethods(userId);
      if (response.success) {
        setUserPaymentMethods(response.data || []);
      }
    } catch (error) {
      message.error(error.message || 'Không thể tải danh sách phương thức thanh toán');
    } finally {
      setLoadingPaymentMethods(false);
    }
  };

  // Show modals
  const showEditUserModal = (user) => {
    setSelectedUser(user);
    // Nếu user có staffRole, hiển thị staffRole trong dropdown, không phải role
    setEditFormData({
      ...user,
      role: user.staffRole || user.role,
      referralCode: user.referralCode || ''
    });
    setEditFormErrors({});
    setShowEditModal(true);
  };

  const showBankModalHandler = async (user) => {
    setSelectedUser(user);
    setSelectedPaymentMethod(null);
    setBankFormData({});
    setBankFormErrors({});
    await loadUserPaymentMethods(user.id);
    setShowBankModal(true);
  };

  const showPointModalHandler = (user) => {
    setSelectedUser(user);
    setPointFormData({
      points: '',
      type: 'ADD',
      moneyType: 'MANUAL', // Mặc định là tiền thủ công
      description: ''
    });
    setPointFormErrors({});
    setShowPointModal(true);
  };

  const showUserDetailDrawer = (user) => {
    setSelectedUser(user);
    setShowUserDetail(true);
  };

  const showPasswordResetModal = (user) => {
    setSelectedUser(user);
    setPasswordFormData({});
    setPasswordFormErrors({});
    setShowPasswordModal(true);
  };

  const showC2ResetModal = (user) => {
    setSelectedUser(user);
    setC2FormData({});
    setC2FormErrors({});
    setShowC2Modal(true);
  };

  const handleViewC2Info = (user) => {
    setC2InfoUser(user);
    setShowC2InfoModal(true);
  };


  // Show lock/unlock modal
  const showLockWithdrawalModal = (user, action) => {
    setSelectedUser(user);
    setLockAction(action);
    
    if (action === 'unlock') {
      // Unlock ngay không cần modal
      handleUnlockWithdrawal(user);
    } else {
      // Lock cần modal để nhập lý do
      setShowLockModal(true);
    }
  };

  // Handle unlock withdrawal
  const handleUnlockWithdrawal = async (user) => {
    try {
      await adminService.unlockWithdrawal(user?.id);
      message.success('Mở khóa rút tiền thành công');
      loadUsers();
    } catch (error) {
      message.error(error.message);
    }
  };

  // Handle lock withdrawal with custom reason
  const handleLockWithdrawalWithReason = async () => {
    if (!lockFormData.reason || lockFormData.reason.length < 10) {
      setLockFormErrors({ reason: 'Lý do tối thiểu 10 ký tự' });
      return;
    }
    if (lockFormData.reason.length > 500) {
      setLockFormErrors({ reason: 'Lý do tối đa 500 ký tự' });
      return;
    }

    try {
      const reason = lockFormData.reason || '';
      await adminService.lockWithdrawal(selectedUser?.id, reason);
      message.success('Khóa rút tiền thành công!');
      setShowLockModal(false);
      setLockFormData({});
      setLockFormErrors({});
      setSelectedUser(null);
      loadUsers();
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <UserStatsCards stats={userStats} loading={loading} />

      {/* Filter and Search */}
      <UserFilterForm
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
        onCreateUser={openCreateModal}
        isAdminPortal={isAdminPortal}
        loading={loading}
      />

      {/* User Table */}
      <UserTable
        data={users}
        loading={loading}
        pagination={pagination}
        onPaginationChange={handleTableChange}
        onViewDetail={showUserDetailDrawer}
        onEdit={showEditUserModal}
        onResetPassword={showPasswordResetModal}
        onLockWithdrawal={(user) => showLockWithdrawalModal(user, 'lock')}
        onUnlockWithdrawal={(user) => showLockWithdrawalModal(user, 'unlock')}
        onDelete={handleDeleteUser}
        onViewC2Info={handleViewC2Info}
        onSetC2Password={showC2ResetModal}
        canManageC2={canManageC2}
      />

      {/* Create User Modal */}
      <Modal
        title="Tạo người dùng mới"
        open={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setCreateFormData({});
          setCreateFormErrors({});
        }}
        width="max-w-2xl"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateModal(false);
                setCreateFormData({});
                setCreateFormErrors({});
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleCreateUser}>
              Tạo người dùng
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tên đăng nhập <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  value={createFormData.username || ''}
                  onChange={(e) => {
                    setCreateFormData({ ...createFormData, username: e.target.value });
                    if (createFormErrors.username) setCreateFormErrors({ ...createFormErrors, username: null });
                  }}
                  className={createFormErrors.username ? 'border-red-500 pl-9' : 'pl-9'}
                  placeholder="Nhập tên đăng nhập"
                />
              </div>
              {createFormErrors.username && (
                <p className="text-red-500 text-xs mt-1">{createFormErrors.username}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={createFormData.email || ''}
                onChange={(e) => {
                  setCreateFormData({ ...createFormData, email: e.target.value });
                  if (createFormErrors.email) setCreateFormErrors({ ...createFormErrors, email: null });
                }}
                className={createFormErrors.email ? 'border-red-500' : ''}
                placeholder="Nhập email"
              />
              {createFormErrors.email && (
                <p className="text-red-500 text-xs mt-1">{createFormErrors.email}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <Input
                type="password"
                value={createFormData.password || ''}
                onChange={(e) => {
                  setCreateFormData({ ...createFormData, password: e.target.value });
                  if (createFormErrors.password) setCreateFormErrors({ ...createFormErrors, password: null });
                }}
                className={createFormErrors.password ? 'border-red-500' : ''}
                placeholder="Nhập mật khẩu"
              />
              {createFormErrors.password && (
                <p className="text-red-500 text-xs mt-1">{createFormErrors.password}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Vai trò <span className="text-red-500">*</span>
              </label>
              <Select
                value={createFormData.role || ''}
                onChange={(value) => {
                  setCreateFormData({ ...createFormData, role: value, c2Password: value === 'AGENT' ? createFormData.c2Password : '' });
                  if (createFormErrors.role) setCreateFormErrors({ ...createFormErrors, role: null });
                }}
                disabled={isStaffXnk}
                placeholder="Chọn vai trò"
                options={createRoleOptions.map(opt => ({ label: opt.label, value: opt.value }))}
                className={createFormErrors.role ? 'border-red-500' : ''}
              />
              {createFormErrors.role && (
                <p className="text-red-500 text-xs mt-1">{createFormErrors.role}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={createFormData.fullName || ''}
              onChange={(e) => {
                setCreateFormData({ ...createFormData, fullName: e.target.value });
                if (createFormErrors.fullName) setCreateFormErrors({ ...createFormErrors, fullName: null });
              }}
              className={createFormErrors.fullName ? 'border-red-500' : ''}
              placeholder="Nhập họ và tên"
            />
            {createFormErrors.fullName && (
              <p className="text-red-500 text-xs mt-1">{createFormErrors.fullName}</p>
            )}
          </div>
          {(createFormData.role === 'AGENT' || (createFormData.role && createFormData.role.startsWith('STAFF_'))) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mật khẩu bảo vệ (C2) <span className="text-red-500">*</span>
              </label>
              <Input
                type="password"
                value={createFormData.c2Password || ''}
                onChange={(e) => {
                  setCreateFormData({ ...createFormData, c2Password: e.target.value });
                  if (createFormErrors.c2Password) setCreateFormErrors({ ...createFormErrors, c2Password: null });
                }}
                className={createFormErrors.c2Password ? 'border-red-500' : ''}
                placeholder="Nhập mật khẩu bảo vệ (tối thiểu 6 ký tự)"
              />
              {createFormErrors.c2Password && (
                <p className="text-red-500 text-xs mt-1">{createFormErrors.c2Password}</p>
              )}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Số điện thoại
            </label>
            <Input
              type="text"
              value={createFormData.phoneNumber || ''}
              onChange={(e) => setCreateFormData({ ...createFormData, phoneNumber: e.target.value })}
              placeholder="Nhập số điện thoại"
            />
          </div>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        title="Chỉnh sửa người dùng"
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditFormData({});
          setEditFormErrors({});
          setSelectedUser(null);
        }}
        width="max-w-2xl"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditModal(false);
                setEditFormData({});
                setEditFormErrors({});
                setSelectedUser(null);
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleUpdateUser}>
              Cập nhật
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={editFormData.fullName || ''}
                onChange={(e) => {
                  setEditFormData({ ...editFormData, fullName: e.target.value });
                  if (editFormErrors.fullName) setEditFormErrors({ ...editFormErrors, fullName: null });
                }}
                className={editFormErrors.fullName ? 'border-red-500' : ''}
                placeholder="Nhập họ và tên"
              />
              {editFormErrors.fullName && (
                <p className="text-red-500 text-xs mt-1">{editFormErrors.fullName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={editFormData.email || ''}
                onChange={(e) => {
                  setEditFormData({ ...editFormData, email: e.target.value });
                  if (editFormErrors.email) setEditFormErrors({ ...editFormErrors, email: null });
                }}
                className={editFormErrors.email ? 'border-red-500' : ''}
                placeholder="Nhập email"
              />
              {editFormErrors.email && (
                <p className="text-red-500 text-xs mt-1">{editFormErrors.email}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Số điện thoại
              </label>
              <Input
                type="text"
                value={editFormData.phoneNumber || ''}
                onChange={(e) => setEditFormData({ ...editFormData, phoneNumber: e.target.value })}
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Vai trò
              </label>
              <Select
                value={editFormData.role || ''}
                onChange={(value) => setEditFormData({ ...editFormData, role: value })}
                disabled={isStaffXnk}
                options={[
                  { label: 'Người dùng', value: 'USER' },
                  { label: 'Đại lý', value: 'AGENT' }
                ]}
                placeholder="Chọn vai trò"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Trạng thái
              </label>
              <Select
                value={editFormData.status || ''}
                onChange={(value) => setEditFormData({ ...editFormData, status: value })}
                options={[
                  { label: 'Hoạt động', value: 'ACTIVE' },
                  { label: 'Tạm khóa', value: 'INACTIVE' },
                  { label: 'Tạm dừng', value: 'SUSPENDED' },
                  { label: 'Bị cấm', value: 'BANNED' }
                ]}
                placeholder="Chọn trạng thái"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mã đại lý (Mã mời)
              </label>
              <Input
                type="text"
                value={editFormData.referralCode || ''}
                onChange={(e) => setEditFormData({ ...editFormData, referralCode: e.target.value.toUpperCase() })}
                placeholder="Nhập mã đại lý"
                maxLength={10}
                style={{ textTransform: 'uppercase' }}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* User Detail Modal */}
      <Modal
        title="Chi tiết người dùng"
        open={showUserDetail}
        onClose={() => {
          setShowUserDetail(false);
          setSelectedUser(null);
        }}
        width="max-w-md"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full text-2xl font-bold text-white mb-2"
                style={{ backgroundColor: selectedUser.staffRole === 'AGENT' ? '#52c41a' : '#1890ff' }}
              >
                {selectedUser.fullName?.charAt(0)?.toUpperCase()}
              </div>
              <div className="mt-2">
                <h4 className="text-lg font-semibold mb-1">{selectedUser.fullName}</h4>
                <p className="text-sm text-gray-500">@{selectedUser.username}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4"></div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1">Email:</p>
                <p className="text-sm text-gray-900">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1">Số điện thoại:</p>
                <p className="text-sm text-gray-900">{selectedUser.phoneNumber || 'Chưa cập nhật'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1">Vai trò:</p>
                <div>
                  <StatusTag 
                    status={selectedUser.staffRole === 'AGENT' ? 'AGENT' : 'USER'} 
                    customConfig={{
                      AGENT: { bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200', label: 'Đại lý' },
                      USER: { bgColor: 'bg-blue-50', textColor: 'text-blue-700', borderColor: 'border-blue-200', label: 'Người dùng' }
                    }}
                  />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1">Trạng thái:</p>
                <div>
                  <StatusTag 
                    status={selectedUser.status} 
                    customConfig={{
                      ACTIVE: { bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200', label: 'Hoạt động' },
                      INACTIVE: { bgColor: 'bg-orange-50', textColor: 'text-orange-700', borderColor: 'border-orange-200', label: 'Tạm khóa' },
                      SUSPENDED: { bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200', label: 'Tạm dừng' },
                      BANNED: { bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200', label: 'Bị cấm' }
                    }}
                  />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1">Số dư:</p>
                <p className={`text-sm font-medium ${(selectedUser.points || 0) > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format((selectedUser.points || 0) * 1000)}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1">Ngày tạo:</p>
                <p className="text-sm text-gray-900">{new Date(selectedUser.createdAt).toLocaleString('vi-VN')}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1">Cập nhật cuối:</p>
                <p className="text-sm text-gray-900">{new Date(selectedUser.updatedAt).toLocaleString('vi-VN')}</p>
              </div>
              {selectedUser.lastLogin && (
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">Đăng nhập cuối:</p>
                  <p className="text-sm text-gray-900">{new Date(selectedUser.lastLogin).toLocaleString('vi-VN')}</p>
                </div>
              )}
              {selectedUser.withdrawalLocked && (
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">Trạng thái rút tiền:</p>
                  <div>
                    <StatusTag 
                      status="LOCKED" 
                      customConfig={{
                        LOCKED: { bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200', label: 'Đã khóa rút tiền' }
                      }}
                    />
                  </div>
                  {selectedUser.withdrawalLockReason && (
                    <div className="mt-2">
                      <p className="text-xs font-semibold text-gray-700 mb-1">Lý do khóa:</p>
                      <div className="text-sm text-gray-700 bg-green-50 p-2 rounded-lg mt-1">
                        {selectedUser.withdrawalLockReason}
                      </div>
                    </div>
                  )}
                  {selectedUser.withdrawalLockedAt && (
                    <div className="mt-2">
                      <p className="text-xs font-semibold text-gray-700 mb-1">Thời gian khóa:</p>
                      <p className="text-sm text-gray-900">{new Date(selectedUser.withdrawalLockedAt).toLocaleString('vi-VN')}</p>
                    </div>
                  )}
                </div>
              )}
              {canManageC2(selectedUser) && (
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">Mật khẩu bảo vệ:</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusTag 
                      status={selectedUser.hasC2Password ? 'SET' : 'NOT_SET'} 
                      customConfig={{
                        SET: { bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200', label: 'Đã thiết lập' },
                        NOT_SET: { bgColor: 'bg-gray-50', textColor: 'text-gray-700', borderColor: 'border-gray-200', label: 'Chưa thiết lập' }
                      }}
                    />
                    {selectedUser.c2PasswordUpdatedAt && (
                      <p className="text-xs text-gray-500">
                        Cập nhật {new Date(selectedUser.c2PasswordUpdatedAt).toLocaleString('vi-VN')}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4"></div>

            <div className="space-y-2">
              <Button 
                className="w-full"
                onClick={() => {
                  setShowUserDetail(false);
                  showEditUserModal(selectedUser);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Button>
              <Button 
                className="w-full"
                variant="outline"
                onClick={() => {
                  setShowUserDetail(false);
                  showPasswordResetModal(selectedUser);
                }}
              >
                <Key className="h-4 w-4 mr-2" />
                Reset mật khẩu
              </Button>
              {canManageC2(selectedUser) && (
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => {
                    setShowUserDetail(false);
                    showC2ResetModal(selectedUser);
                  }}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  {selectedUser.hasC2Password ? 'Đổi mật khẩu bảo vệ' : 'Thiết lập mật khẩu bảo vệ'}
                </Button>
              )}
              {selectedUser.status === 'ACTIVE' && (
                <Button 
                  className="w-full"
                  variant="destructive"
                  onClick={() => handleUpdateStatus(selectedUser.id, 'INACTIVE')}
                >
                  Khóa tài khoản
                </Button>
              )}
              {selectedUser.status === 'INACTIVE' && (
                <Button 
                  className="w-full"
                  onClick={() => handleUpdateStatus(selectedUser.id, 'ACTIVE')}
                >
                  Mở khóa tài khoản
                </Button>
              )}
              <Button 
                className="w-full"
                variant="outline"
                onClick={async () => {
                  setShowUserDetail(false);
                  await showBankModalHandler(selectedUser);
                }}
              >
                <Banknote className="h-4 w-4 mr-2" />
                Thay đổi thông tin ngân hàng
              </Button>
              <Button 
                className="w-full"
                variant="outline"
                onClick={() => {
                  setShowUserDetail(false);
                  showPointModalHandler(selectedUser);
                }}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Cộng/Trừ điểm thủ công
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        title="Reset mật khẩu"
        open={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPasswordFormData({});
          setPasswordFormErrors({});
          setSelectedUser(null);
        }}
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowPasswordModal(false);
                setPasswordFormData({});
                setPasswordFormErrors({});
                setSelectedUser(null);
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleResetPassword}>
              Reset mật khẩu
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-700">
              Reset mật khẩu cho người dùng: <span className="font-semibold">{selectedUser?.fullName}</span>
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <Input
              type="password"
              value={passwordFormData.newPassword || ''}
              onChange={(e) => {
                setPasswordFormData({ ...passwordFormData, newPassword: e.target.value });
                if (passwordFormErrors.newPassword) setPasswordFormErrors({ ...passwordFormErrors, newPassword: null });
              }}
              className={passwordFormErrors.newPassword ? 'border-red-500' : ''}
              placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
            />
            {passwordFormErrors.newPassword && (
              <p className="text-red-500 text-xs mt-1">{passwordFormErrors.newPassword}</p>
            )}
          </div>
        </div>
      </Modal>

      {/* Update C2 Password Modal */}
      <Modal
        title={selectedUser?.hasC2Password ? 'Đổi mật khẩu bảo vệ' : 'Thiết lập mật khẩu bảo vệ'}
        open={showC2Modal}
        onClose={() => {
          setShowC2Modal(false);
          setC2FormData({});
          setC2FormErrors({});
          setSelectedUser(null);
        }}
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowC2Modal(false);
                setC2FormData({});
                setC2FormErrors({});
                setSelectedUser(null);
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleResetC2Password}>
              {selectedUser?.hasC2Password ? 'Cập nhật mật khẩu bảo vệ' : 'Thiết lập mật khẩu bảo vệ'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-700">
              {selectedUser?.hasC2Password
                ? 'Đổi mật khẩu bảo vệ cho người dùng: '
                : 'Thiết lập mật khẩu bảo vệ cho người dùng: '}
              <span className="font-semibold">{selectedUser?.fullName}</span>
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Mật khẩu bảo vệ mới <span className="text-red-500">*</span>
            </label>
            <Input
              type="password"
              value={c2FormData.newC2Password || ''}
              onChange={(e) => {
                setC2FormData({ ...c2FormData, newC2Password: e.target.value });
                if (c2FormErrors.newC2Password) setC2FormErrors({ ...c2FormErrors, newC2Password: null });
              }}
              className={c2FormErrors.newC2Password ? 'border-red-500' : ''}
              placeholder="Nhập mật khẩu bảo vệ mới (tối thiểu 6 ký tự)"
            />
            {c2FormErrors.newC2Password && (
              <p className="text-red-500 text-xs mt-1">{c2FormErrors.newC2Password}</p>
            )}
          </div>
        </div>
      </Modal>

      {/* Lock Withdrawal Modal */}
      <Modal
        title="Khóa rút tiền"
        open={showLockModal}
        onClose={() => {
          setShowLockModal(false);
          setLockFormData({});
          setLockFormErrors({});
          setSelectedUser(null);
        }}
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowLockModal(false);
                setLockFormData({});
                setLockFormErrors({});
                setSelectedUser(null);
              }}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleLockWithdrawalWithReason}
            >
              Khóa rút tiền
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-700">
              Khóa rút tiền cho người dùng: <span className="font-semibold">{selectedUser?.fullName}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Username: @{selectedUser?.username}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Lý do khóa rút tiền <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={lockFormData.reason || ''}
              onChange={(e) => {
                setLockFormData({ ...lockFormData, reason: e.target.value });
                if (lockFormErrors.reason) setLockFormErrors({ ...lockFormErrors, reason: null });
              }}
              className={`w-full px-3 py-2 border rounded-md resize-none ${
                lockFormErrors.reason ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Nhập lý do khóa rút tiền cho người dùng này..."
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              {lockFormErrors.reason && (
                <p className="text-red-500 text-xs">{lockFormErrors.reason}</p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {(lockFormData.reason || '').length}/500
              </p>
            </div>
          </div>

          <Alert
            type="info"
            message="Lưu ý"
            description="Lý do này sẽ được hiển thị cho người dùng khi họ cố gắng rút tiền. Hãy nhập lý do rõ ràng và cụ thể."
          />
        </div>
      </Modal>

      {/* Bank Info Modal */}
      <Modal
        title="Thay đổi thông tin ngân hàng"
        open={showBankModal}
        onClose={() => {
          setShowBankModal(false);
          setBankFormData({});
          setBankFormErrors({});
          setSelectedPaymentMethod(null);
          setSelectedUser(null);
        }}
        width="max-w-2xl"
        footer={
          selectedPaymentMethod && (
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowBankModal(false);
                  setBankFormData({});
                  setBankFormErrors({});
                  setSelectedPaymentMethod(null);
                  setSelectedUser(null);
                }}
              >
                Hủy
              </Button>
              <Button onClick={handleUpdateBank}>
                Cập nhật
              </Button>
            </div>
          )
        }
      >
        {loadingPaymentMethods ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : userPaymentMethods.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            Người dùng chưa có phương thức thanh toán nào
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Chọn phương thức thanh toán để chỉnh sửa:</p>
              <div className="space-y-2 mt-2">
                {userPaymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={cn(
                      "cursor-pointer hover:bg-gray-50 p-3 rounded-lg border transition-colors",
                      selectedPaymentMethod?.id === method.id ? 'bg-blue-50 border-blue-300' : 'border-gray-200'
                    )}
                    onClick={() => {
                      setSelectedPaymentMethod(method);
                      setBankFormData({
                        name: method.name || '',
                        type: method.type || 'BANK',
                        accountNumber: method.accountNumber || '',
                        accountName: method.accountName || '',
                        bankCode: method.bankCode || '',
                        note: method.note || ''
                      });
                      setBankFormErrors({});
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <Banknote className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{method.name}</p>
                        <p className="text-sm text-gray-600 mt-1">{method.accountName} - {method.accountNumber}</p>
                        {method.bankCode && <p className="text-xs text-gray-500 mt-1">{method.bankCode}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedPaymentMethod && (
              <div className="space-y-4 pt-4 border-t">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Tên phương thức <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={bankFormData.name || ''}
                    onChange={(e) => {
                      setBankFormData({ ...bankFormData, name: e.target.value });
                      if (bankFormErrors.name) setBankFormErrors({ ...bankFormErrors, name: null });
                    }}
                    className={bankFormErrors.name ? 'border-red-500' : ''}
                    placeholder="Ví dụ: Tài khoản chính"
                  />
                  {bankFormErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{bankFormErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Loại phương thức <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={bankFormData.type || ''}
                    onChange={(value) => {
                      setBankFormData({ ...bankFormData, type: value, bankCode: value !== 'BANK' ? '' : bankFormData.bankCode });
                      if (bankFormErrors.type) setBankFormErrors({ ...bankFormErrors, type: null });
                    }}
                    options={[
                      { label: 'Ngân hàng', value: 'BANK' },
                      { label: 'Ví MoMo', value: 'MOMO' },
                      { label: 'ZaloPay', value: 'ZALO_PAY' },
                      { label: 'VietQR', value: 'VIET_QR' }
                    ]}
                    className={bankFormErrors.type ? 'border-red-500' : ''}
                    placeholder="Chọn loại"
                  />
                  {bankFormErrors.type && (
                    <p className="text-red-500 text-xs mt-1">{bankFormErrors.type}</p>
                  )}
                </div>

                {bankFormData.type === 'BANK' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Ngân hàng <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={bankFormData.bankCode || ''}
                      onChange={(value) => {
                        setBankFormData({ ...bankFormData, bankCode: value });
                        if (bankFormErrors.bankCode) setBankFormErrors({ ...bankFormErrors, bankCode: null });
                      }}
                      options={[
                        { label: 'Vietcombank', value: 'VCB' },
                        { label: 'Techcombank', value: 'TCB' },
                        { label: 'ACB', value: 'ACB' },
                        { label: 'MBBank', value: 'MB' },
                        { label: 'Vietinbank', value: 'VTB' },
                        { label: 'BIDV', value: 'BIDV' },
                        { label: 'TPBank', value: 'TPB' },
                        { label: 'Sacombank', value: 'STB' },
                        { label: 'VPBank', value: 'VPB' }
                      ]}
                      className={bankFormErrors.bankCode ? 'border-red-500' : ''}
                      placeholder="Chọn ngân hàng"
                    />
                    {bankFormErrors.bankCode && (
                      <p className="text-red-500 text-xs mt-1">{bankFormErrors.bankCode}</p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Số tài khoản <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={bankFormData.accountNumber || ''}
                    onChange={(e) => {
                      setBankFormData({ ...bankFormData, accountNumber: e.target.value });
                      if (bankFormErrors.accountNumber) setBankFormErrors({ ...bankFormErrors, accountNumber: null });
                    }}
                    className={bankFormErrors.accountNumber ? 'border-red-500' : ''}
                    placeholder="Nhập số tài khoản"
                  />
                  {bankFormErrors.accountNumber && (
                    <p className="text-red-500 text-xs mt-1">{bankFormErrors.accountNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Tên chủ tài khoản <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={bankFormData.accountName || ''}
                    onChange={(e) => {
                      setBankFormData({ ...bankFormData, accountName: e.target.value });
                      if (bankFormErrors.accountName) setBankFormErrors({ ...bankFormErrors, accountName: null });
                    }}
                    className={bankFormErrors.accountName ? 'border-red-500' : ''}
                    placeholder="Nhập tên chủ tài khoản"
                  />
                  {bankFormErrors.accountName && (
                    <p className="text-red-500 text-xs mt-1">{bankFormErrors.accountName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Ghi chú (tùy chọn)
                  </label>
                  <textarea
                    rows={3}
                    value={bankFormData.note || ''}
                    onChange={(e) => setBankFormData({ ...bankFormData, note: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ghi chú thêm..."
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Point Adjustment Modal */}
      <Modal
        title="Cộng/Trừ điểm thủ công"
        open={showPointModal}
        onClose={() => {
          setShowPointModal(false);
          setPointFormData({});
          setPointFormErrors({});
          setSelectedUser(null);
        }}
        width="max-w-lg"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowPointModal(false);
                setPointFormData({});
                setPointFormErrors({});
                setSelectedUser(null);
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleAdjustPoints}>
              Xác nhận
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {selectedUser && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Người dùng:</span> {selectedUser.fullName} (@{selectedUser.username})
              </p>
              <div className="mt-2">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Số điểm hiện tại:</span>{' '}
                  <span className="text-blue-600 font-semibold">
                    {new Intl.NumberFormat('vi-VN').format(selectedUser.points || 0)} điểm
                  </span>
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Loại thao tác <span className="text-red-500">*</span>
            </label>
            <Select
              value={pointFormData.type || ''}
              onChange={(value) => {
                setPointFormData({ 
                  ...pointFormData, 
                  type: value, 
                  moneyType: value !== 'ADD' ? undefined : pointFormData.moneyType 
                });
                if (pointFormErrors.type) setPointFormErrors({ ...pointFormErrors, type: null });
              }}
              options={[
                { 
                  label: (
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4 text-green-600" />
                      <span>Cộng điểm</span>
                    </div>
                  ), 
                  value: 'ADD' 
                },
                { 
                  label: (
                    <div className="flex items-center gap-2">
                      <Minus className="h-4 w-4 text-red-600" />
                      <span>Trừ điểm</span>
                    </div>
                  ), 
                  value: 'SUBTRACT' 
                }
              ]}
              className={pointFormErrors.type ? 'border-red-500' : ''}
              placeholder="Chọn loại thao tác"
            />
            {pointFormErrors.type && (
              <p className="text-red-500 text-xs mt-1">{pointFormErrors.type}</p>
            )}
          </div>

          {pointFormData.type === 'ADD' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Loại tiền <span className="text-red-500">*</span>
              </label>
              <Select
                value={pointFormData.moneyType || ''}
                onChange={(value) => {
                  setPointFormData({ ...pointFormData, moneyType: value });
                  if (pointFormErrors.moneyType) setPointFormErrors({ ...pointFormErrors, moneyType: null });
                }}
                options={[
                  { 
                    label: (
                      <div>
                        <span>Tiền khuyến mại</span>
                        <span className="text-xs text-gray-500 ml-2">(Tiền này sẽ được tính vào bảng KM)</span>
                      </div>
                    ), 
                    value: 'PROMOTIONAL' 
                  },
                  { label: 'Tiền thủ công', value: 'MANUAL' }
                ]}
                className={pointFormErrors.moneyType ? 'border-red-500' : ''}
                placeholder="Chọn loại tiền"
              />
              {pointFormErrors.moneyType && (
                <p className="text-red-500 text-xs mt-1">{pointFormErrors.moneyType}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Số điểm <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              value={pointFormData.points || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setPointFormData({ ...pointFormData, points: value });
                if (pointFormErrors.points) setPointFormErrors({ ...pointFormErrors, points: null });
              }}
              className={pointFormErrors.points ? 'border-red-500' : ''}
              placeholder="Nhập số điểm"
              min={1}
            />
            {pointFormErrors.points && (
              <p className="text-red-500 text-xs mt-1">{pointFormErrors.points}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Lý do <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={pointFormData.description || ''}
              onChange={(e) => {
                setPointFormData({ ...pointFormData, description: e.target.value });
                if (pointFormErrors.description) setPointFormErrors({ ...pointFormErrors, description: null });
              }}
              className={`w-full px-3 py-2 border rounded-md resize-none ${
                pointFormErrors.description ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Nhập lý do cộng/trừ điểm..."
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              {pointFormErrors.description && (
                <p className="text-red-500 text-xs">{pointFormErrors.description}</p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {(pointFormData.description || '').length}/500
              </p>
            </div>
          </div>
        </div>
      </Modal>

      {/* C2 Info Modal */}
      <Modal
        title="Thông tin mật khẩu bảo vệ (C2)"
        open={showC2InfoModal}
        onClose={() => {
          setShowC2InfoModal(false);
          setC2InfoUser(null);
        }}
        footer={
          <div className="flex justify-end">
            <Button onClick={() => {
              setShowC2InfoModal(false);
              setC2InfoUser(null);
            }}>
              Đã hiểu
            </Button>
          </div>
        }
      >
        <div className="space-y-2">
          {c2InfoUser?.hasC2Password ? (
            <p className="text-sm text-gray-700">
              Mật khẩu bảo vệ được lưu trữ dưới dạng bảo mật nên không thể hiển thị. Vui lòng sử dụng chức năng
              "Thay đổi" để đặt mật khẩu mới cho tài khoản này.
            </p>
          ) : (
            <p className="text-sm text-gray-700">Tài khoản chưa thiết lập mật khẩu bảo vệ C2.</p>
          )}
          {c2InfoUser?.c2PasswordUpdatedAt && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-700 mb-1">Thời gian cập nhật gần nhất:</p>
              <p className="text-sm text-gray-900">
                {new Date(c2InfoUser.c2PasswordUpdatedAt).toLocaleString('vi-VN')}
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AdminUserManagement;