import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Card,
  Row,
  Col,
  Statistic,
  Popconfirm,
  message,
  Drawer,
  Avatar,
  Divider,
  InputNumber,
  Typography,
  Tooltip,
  Badge,
  Alert,
  DatePicker,
  Spin,
  List,
  Empty
} from 'antd';
import dayjs from 'dayjs';
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  KeyOutlined,
  FilterOutlined,
  UserAddOutlined,
  TeamOutlined,
  UserSwitchOutlined,
  UserDeleteOutlined,
  LockOutlined,
  UnlockOutlined,
  SafetyOutlined,
  BankOutlined,
  DollarOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined
} from '@ant-design/icons';
import { HEADING_STYLES, BODY_STYLES, FONT_SIZE, FONT_WEIGHT } from '../../../utils/typography';
import { adminAuthService } from '../services/adminAuthService';
import { getPortalType } from '../../../utils/subdomain';
import { adminService } from '../services/adminService';
import { formatPointsDisplay } from '../../../utils/helpers';

const { Option } = Select;
const { Search } = Input;
const { Title, Text } = Typography;

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

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [c2Form] = Form.useForm();
  const [lockForm] = Form.useForm();
  const [bankForm] = Form.useForm();
  const [pointForm] = Form.useForm();

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
  const handleTableChange = (paginationData) => {
    setPagination(prev => ({
      ...prev,
      current: paginationData.current,
      pageSize: paginationData.pageSize
    }));
  };

  const openCreateModal = () => {
    createForm.resetFields();
    createForm.setFieldsValue({
      role: isStaffXnk ? 'USER' : 'USER'
    });
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

  const handleCreateUser = async (values) => {
    try {
      const selectedRole = isStaffXnk ? 'USER' : values.role;
      const payload = {
        ...values,
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
        createForm.resetFields();
        loadUsers();
        loadUserStats();
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  // Update user
  const handleUpdateUser = async (values) => {
    try {
      const selectedRole = isStaffXnk ? 'USER' : values.role;
      const payload = {
        ...values,
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
        editForm.resetFields();
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
  const handleResetPassword = async (values) => {
    try {
      const response = await adminService.resetUserPassword(selectedUser.id, values.newPassword);
      if (response.success) {
        message.success('Reset mật khẩu thành công!');
        setShowPasswordModal(false);
        passwordForm.resetFields();
        setSelectedUser(null);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleResetC2Password = async (values) => {
    try {
      const response = await adminService.updateUserC2Password(selectedUser.id, values.newC2Password);
      if (response.success) {
        message.success('Cập nhật mật khẩu bảo vệ thành công!');
        setShowC2Modal(false);
        c2Form.resetFields();
        setSelectedUser(null);
        loadUsers();
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  // Update bank info
  const handleUpdateBank = async (values) => {
    try {
      const response = await adminService.updateUserPaymentMethod(
        selectedUser.id,
        selectedPaymentMethod.id,
        values
      );
      if (response.success) {
        message.success('Cập nhật thông tin ngân hàng thành công!');
        setShowBankModal(false);
        bankForm.resetFields();
        setSelectedPaymentMethod(null);
        await loadUserPaymentMethods(selectedUser.id);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  // Adjust points
  const handleAdjustPoints = async (values) => {
    try {
      const payload = {
        points: parseInt(values.points),
        type: values.type,
        description: values.description
      };
      
      // Chỉ gửi moneyType khi type = ADD
      if (values.type === 'ADD' && values.moneyType) {
        payload.moneyType = values.moneyType;
      }
      
      const response = await adminService.adjustUserPoints(selectedUser.id, payload);
      if (response.success) {
        message.success(`${values.type === 'ADD' ? 'Cộng' : 'Trừ'} điểm thành công!`);
        setShowPointModal(false);
        pointForm.resetFields();
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
    const formValues = {
      ...user,
      role: user.staffRole || user.role,
      referralCode: user.referralCode || ''
    };
    editForm.setFieldsValue(formValues);
    setShowEditModal(true);
  };

  const showBankModalHandler = async (user) => {
    setSelectedUser(user);
    setSelectedPaymentMethod(null);
    await loadUserPaymentMethods(user.id);
    setShowBankModal(true);
  };

  const showPointModalHandler = (user) => {
    setSelectedUser(user);
    pointForm.setFieldsValue({
      points: '',
      type: 'ADD',
      moneyType: 'MANUAL', // Mặc định là tiền thủ công
      description: ''
    });
    setShowPointModal(true);
  };

  const showUserDetailDrawer = (user) => {
    setSelectedUser(user);
    setShowUserDetail(true);
  };

  const showPasswordResetModal = (user) => {
    setSelectedUser(user);
    setShowPasswordModal(true);
  };

  const showC2ResetModal = (user) => {
    setSelectedUser(user);
    setShowC2Modal(true);
  };

  const handleViewC2Info = (user) => {
    Modal.info({
      title: 'Thông tin mật khẩu bảo vệ (C2)',
      content: (
        <div className="space-y-2">
          {user.hasC2Password ? (
            <span>
              Mật khẩu bảo vệ được lưu trữ dưới dạng bảo mật nên không thể hiển thị. Vui lòng sử dụng chức năng
              "Thay đổi" để đặt mật khẩu mới cho tài khoản này.
            </span>
          ) : (
            <span>Tài khoản chưa thiết lập mật khẩu bảo vệ C2.</span>
          )}
          {user.c2PasswordUpdatedAt && (
            <div>
              <Text strong>Thời gian cập nhật gần nhất:</Text>{' '}
              {new Date(user.c2PasswordUpdatedAt).toLocaleString('vi-VN')}
            </div>
          )}
        </div>
      ),
      okText: 'Đã hiểu',
    });
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
  const handleLockWithdrawalWithReason = async (values) => {
    try {
      const reason = values.reason || '';
      await adminService.lockWithdrawal(selectedUser?.id, reason);
      message.success('Khóa rút tiền thành công!');
      setShowLockModal(false);
      lockForm.resetFields();
      setSelectedUser(null);
      loadUsers();
    } catch (error) {
      message.error(error.message);
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 60,
      render: (_, record) => {
        const isAgent = record.staffRole === 'AGENT';
        return (
          <Avatar 
            size="large" 
            icon={<UserOutlined />}
            style={{ backgroundColor: isAgent ? '#52c41a' : '#1890ff' }}
          >
            {record.fullName?.charAt(0)?.toUpperCase()}
          </Avatar>
        );
      },
    },
    {
      title: 'Thông tin',
      key: 'userInfo',
      render: (_, record) => (
        <div>
          <div className="font-medium">
            {record.fullName}
            {record.withdrawalLocked && (
              <Tooltip 
                title={
                  <div>
                    <div><strong>Trạng thái:</strong> Đã khóa rút tiền</div>
                    <div><strong>Lý do:</strong> {record.withdrawalLockReason || 'Không có lý do'}</div>
                    {record.withdrawalLockedAt && (
                      <div><strong>Thời gian:</strong> {new Date(record.withdrawalLockedAt).toLocaleString('vi-VN')}</div>
                    )}
                  </div>
                }
                placement="topLeft"
              >
                <Tag color="red" style={{ marginLeft: 8 }} icon={<LockOutlined />}>
                  Khóa rút
                </Tag>
              </Tooltip>
            )}
          </div>
          <div className="text-gray-500 text-sm">@{record.username}</div>
          <div className="text-gray-400 text-xs">{record.email}</div>
        </div>
      ),
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      filters: [
        { text: 'Người dùng', value: 'USER' },
        { text: 'Đại lý', value: 'AGENT' }
      ],
      render: (role, record) => {
        const isAgent = record.staffRole === 'AGENT';
        return (
          <Tag color={isAgent ? 'green' : 'blue'}>
            {isAgent ? 'Đại lý' : 'Người dùng'}
          </Tag>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      filters: [
        { text: 'Hoạt động', value: 'ACTIVE' },
        { text: 'Tạm khóa', value: 'INACTIVE' },
        { text: 'Bị cấm', value: 'BANNED' }
      ],
      render: (status) => {
        const statusMap = {
          ACTIVE: { color: 'green', text: 'Hoạt động' },
          INACTIVE: { color: 'orange', text: 'Tạm khóa' },
          SUSPENDED: { color: 'red', text: 'Tạm dừng' },
          BANNED: { color: 'red', text: 'Bị cấm' }
        };
        const config = statusMap[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Số dư',
      dataIndex: 'points',
      key: 'balance',
      width: 120,
      sorter: true,
      render: (points) => {
        // points là số điểm, quy đổi sang VND: 1 điểm = 1000 VND
        const balanceVND = (Number(points) || 0) * 1000;
        return (
          <Text className={balanceVND > 0 ? 'text-green-600' : 'text-gray-500'}>
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(balanceVND)}
          </Text>
        );
      },
    },
    {
      title: 'Mật khẩu C2',
      key: 'c2Password',
      width: 220,
      render: (_, record) => (
        <Space size="small">
          <span>{record.hasC2Password ? '••••••' : 'Chưa có'}</span>
          <Tooltip title="Xem thông tin C2">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewC2Info(record)}
            />
          </Tooltip>
          {canManageC2(record) && (
            <Tooltip title={record.hasC2Password ? 'Đổi mật khẩu bảo vệ' : 'Thiết lập mật khẩu bảo vệ'}>
              <Button
                type="text"
                icon={<SafetyOutlined />}
                onClick={() => showC2ResetModal(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      sorter: true,
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'IP',
      dataIndex: 'firstLoginIp',
      key: 'firstLoginIp',
      width: 150,
      render: (value) => value || '-'
    },
    {
      title: 'Hoàn trả',
      dataIndex: 'totalRefund',
      key: 'totalRefund',
      width: 140,
      align: 'right',
      render: (value) => formatPointsDisplay(Number(value ?? 0))
    },
    {
      title: 'Hoàn thua theo ngày',
      dataIndex: 'totalDailyLossRefund',
      key: 'totalDailyLossRefund',
      width: 160,
      align: 'right',
      render: (value) => formatPointsDisplay(Number(value ?? 0))
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => showUserDetailDrawer(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => showEditUserModal(record)}
            />
          </Tooltip>
          <Tooltip title="Reset mật khẩu">
            <Button
              type="text"
              icon={<KeyOutlined />}
              onClick={() => showPasswordResetModal(record)}
            />
          </Tooltip>
          {record.withdrawalLocked ? (
            <Tooltip title="Mở khóa rút tiền">
              <Button
                type="text"
                icon={<UnlockOutlined />}
                style={{ color: '#52c41a' }}
                onClick={() => showLockWithdrawalModal(record, 'unlock')}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Khóa rút tiền">
              <Button
                type="text"
                danger
                icon={<LockOutlined />}
                onClick={() => showLockWithdrawalModal(record, 'lock')}
              />
            </Tooltip>
          )}
          {record.status !== 'BANNED' && (
            <Popconfirm
              title="Bạn có chắc muốn xóa người dùng này?"
              onConfirm={() => handleDeleteUser(record.id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Tooltip title="Xóa">
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng người dùng"
              value={userStats.usersByRole?.USER || 0}
              prefix={<TeamOutlined className="text-blue-600" />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đại lý"
              value={userStats.usersByStaffRole?.AGENT || 0}
              prefix={<UserSwitchOutlined className="text-green-600" />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Người dùng hoạt động"
              value={userStats.usersByStatus?.ACTIVE || 0}
              prefix={<UserOutlined className="text-green-600" />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Người dùng mới (30 ngày)"
              value={userStats.newUsersLast30Days || 0}
              prefix={<UserAddOutlined className="text-orange-600" />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filter and Search */}
      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Search
              placeholder="Tìm kiếm theo tên, email..."
              allowClear
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              onSearch={() => setPagination(prev => ({ ...prev, current: 1 }))}
              prefix={<SearchOutlined />}
            />
          </Col>
          {isAdminPortal && (
          <Col xs={12} sm={6} md={4} lg={3}>
            <Select
              placeholder="Vai trò"
              allowClear
              value={filters.role}
              onChange={(value) => handleFilterChange('role', value)}
              style={{ width: '100%' }}
            >
              <Option value="USER">Người dùng</Option>
              <Option value="AGENT">Đại lý</Option>
            </Select>
          </Col>
          )}
          <Col xs={12} sm={6} md={4} lg={3}>
            <Select
              placeholder="Trạng thái"
              allowClear
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              style={{ width: '100%' }}
            >
              <Option value="ACTIVE">Hoạt động</Option>
              <Option value="INACTIVE">Tạm khóa</Option>
              <Option value="SUSPENDED">Tạm dừng</Option>
              <Option value="BANNED">Bị cấm</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <DatePicker.RangePicker
              placeholder={['Từ ngày', 'Đến ngày']}
              value={filters.startDate && filters.endDate ? [dayjs(filters.startDate), dayjs(filters.endDate)] : null}
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  handleFilterChange('startDate', dates[0].startOf('day'));
                  handleFilterChange('endDate', dates[1].endOf('day'));
                } else {
                  handleFilterChange('startDate', null);
                  handleFilterChange('endDate', null);
                }
              }}
              format="DD/MM/YYYY"
              style={{ width: '100%' }}
              allowClear
            />
          </Col>
          <Col xs={24} sm={24} md={24} lg={6}>
            <Space wrap>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={openCreateModal}
              >
                Thêm người dùng
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={loadUsers}
                loading={loading}
              >
                Làm mới
              </Button>
              <Button
                icon={<FilterOutlined />}
                onClick={resetFilters}
              >
                Reset bộ lọc
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* User Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} người dùng`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Create User Modal */}
      <Modal
        title="Tạo người dùng mới"
        open={showCreateModal}
        onCancel={() => {
          setShowCreateModal(false);
          createForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreateUser}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label="Tên đăng nhập"
                rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="role"
                label="Vai trò"
                rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
              >
                <Select
                  disabled={isStaffXnk}
                  placeholder="Chọn vai trò"
                >
                  {createRoleOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.role !== curr.role}
          >
            {({ getFieldValue }) => {
              const selectedRole = getFieldValue('role');
              const isAgentOrStaffRole =
                selectedRole === 'AGENT' ||
                (selectedRole && selectedRole.startsWith('STAFF_'));
              if (!isAgentOrStaffRole) {
                return null;
              }
              return (
                <Form.Item
                  name="c2Password"
                  label="Mật khẩu bảo vệ (C2)"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu bảo vệ' },
                    { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' }
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              );
            }}
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
          >
            <Input />
          </Form.Item>
          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => {
                setShowCreateModal(false);
                createForm.resetFields();
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Tạo người dùng
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        title="Chỉnh sửa người dùng"
        open={showEditModal}
        onCancel={() => {
          setShowEditModal(false);
          editForm.resetFields();
          setSelectedUser(null);
        }}
        footer={null}
        width={600}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdateUser}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phoneNumber"
                label="Số điện thoại"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="role"
                label="Vai trò"
              >
                <Select disabled={isStaffXnk}>
                  <Option value="USER">Người dùng</Option>
                  <Option value="AGENT">Đại lý</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
              >
                <Select>
                  <Option value="ACTIVE">Hoạt động</Option>
                  <Option value="INACTIVE">Tạm khóa</Option>
                  <Option value="SUSPENDED">Tạm dừng</Option>
                  <Option value="BANNED">Bị cấm</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="referralCode"
                label="Mã đại lý (Mã mời)"
                tooltip="Mã đại lý cũng là mã mời của người dùng"
              >
                <Input placeholder="Nhập mã đại lý" maxLength={10} style={{ textTransform: 'uppercase' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => {
                setShowEditModal(false);
                editForm.resetFields();
                setSelectedUser(null);
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* User Detail Drawer */}
      <Drawer
        title="Chi tiết người dùng"
        placement="right"
        onClose={() => {
          setShowUserDetail(false);
          setSelectedUser(null);
        }}
        open={showUserDetail}
        width={400}
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="text-center">
              <Avatar 
                size={80} 
                icon={<UserOutlined />}
                style={{ backgroundColor: selectedUser.staffRole === 'AGENT' ? '#52c41a' : '#1890ff' }}
              >
                {selectedUser.fullName?.charAt(0)?.toUpperCase()}
              </Avatar>
              <div className="mt-2">
                <Title level={4} className="mb-1">{selectedUser.fullName}</Title>
                <Text type="secondary">@{selectedUser.username}</Text>
              </div>
            </div>

            <Divider />

            <div className="space-y-3">
              <div>
                <Text strong>Email:</Text>
                <div>{selectedUser.email}</div>
              </div>
              <div>
                <Text strong>Số điện thoại:</Text>
                <div>{selectedUser.phoneNumber || 'Chưa cập nhật'}</div>
              </div>
              <div>
                <Text strong>Vai trò:</Text>
                <div>
                  <Tag color={selectedUser.staffRole === 'AGENT' ? 'green' : 'blue'}>
                    {selectedUser.staffRole === 'AGENT' ? 'Đại lý' : 'Người dùng'}
                  </Tag>
                </div>
              </div>
              <div>
                <Text strong>Trạng thái:</Text>
                <div>
                  <Tag color={
                    selectedUser.status === 'ACTIVE' ? 'green' :
                    selectedUser.status === 'INACTIVE' ? 'orange' : 'red'
                  }>
                    {selectedUser.status === 'ACTIVE' ? 'Hoạt động' :
                     selectedUser.status === 'INACTIVE' ? 'Tạm khóa' : 'Bị cấm'}
                  </Tag>
                </div>
              </div>
              <div>
                <Text strong>Số dư:</Text>
                <div className={(selectedUser.points || 0) > 0 ? 'text-green-600' : 'text-gray-500'}>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format((selectedUser.points || 0) * 1000)}
                </div>
              </div>
              <div>
                <Text strong>Ngày tạo:</Text>
                <div>{new Date(selectedUser.createdAt).toLocaleString('vi-VN')}</div>
              </div>
              <div>
                <Text strong>Cập nhật cuối:</Text>
                <div>{new Date(selectedUser.updatedAt).toLocaleString('vi-VN')}</div>
              </div>
              {selectedUser.lastLogin && (
                <div>
                  <Text strong>Đăng nhập cuối:</Text>
                  <div>{new Date(selectedUser.lastLogin).toLocaleString('vi-VN')}</div>
                </div>
              )}
              {selectedUser.withdrawalLocked && (
                <div>
                  <Text strong>Trạng thái rút tiền:</Text>
                  <div>
                    <Tag color="red" icon={<LockOutlined />}>
                      Đã khóa rút tiền
                    </Tag>
                  </div>
                  {selectedUser.withdrawalLockReason && (
                    <div className="mt-2">
                      <Text strong>Lý do khóa:</Text>
                      <div className="text-green-600 bg-green-50 p-2 rounded mt-1">
                        {selectedUser.withdrawalLockReason}
                      </div>
                    </div>
                  )}
                  {selectedUser.withdrawalLockedAt && (
                    <div className="mt-2">
                      <Text strong>Thời gian khóa:</Text>
                      <div>{new Date(selectedUser.withdrawalLockedAt).toLocaleString('vi-VN')}</div>
                    </div>
                  )}
                </div>
              )}
              {canManageC2(selectedUser) && (
                <div>
                  <Text strong>Mật khẩu bảo vệ:</Text>
                  <div className="flex items-center gap-2 mt-1">
                    <Tag color={selectedUser.hasC2Password ? 'green' : 'default'}>
                      {selectedUser.hasC2Password ? 'Đã thiết lập' : 'Chưa thiết lập'}
                    </Tag>
                    {selectedUser.c2PasswordUpdatedAt && (
                      <Text type="secondary">
                        Cập nhật {new Date(selectedUser.c2PasswordUpdatedAt).toLocaleString('vi-VN')}
                      </Text>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Divider />

            <div className="space-y-2">
              <Button 
                block 
                icon={<EditOutlined />}
                onClick={() => {
                  setShowUserDetail(false);
                  showEditUserModal(selectedUser);
                }}
              >
                Chỉnh sửa
              </Button>
              <Button 
                block 
                icon={<KeyOutlined />}
                onClick={() => {
                  setShowUserDetail(false);
                  showPasswordResetModal(selectedUser);
                }}
              >
                Reset mật khẩu
              </Button>
              {canManageC2(selectedUser) && (
                <Button
                  block
                  icon={<SafetyOutlined />}
                  onClick={() => {
                    setShowUserDetail(false);
                    showC2ResetModal(selectedUser);
                  }}
                >
                  {selectedUser.hasC2Password ? 'Đổi mật khẩu bảo vệ' : 'Thiết lập mật khẩu bảo vệ'}
                </Button>
              )}
              {selectedUser.status === 'ACTIVE' && (
                <Button 
                  block 
                  danger
                  onClick={() => handleUpdateStatus(selectedUser.id, 'INACTIVE')}
                >
                  Khóa tài khoản
                </Button>
              )}
              {selectedUser.status === 'INACTIVE' && (
                <Button 
                  block 
                  type="primary"
                  onClick={() => handleUpdateStatus(selectedUser.id, 'ACTIVE')}
                >
                  Mở khóa tài khoản
                </Button>
              )}
              <Button 
                block 
                icon={<BankOutlined />}
                onClick={async () => {
                  setShowUserDetail(false);
                  await showBankModalHandler(selectedUser);
                }}
              >
                Thay đổi thông tin ngân hàng
              </Button>
              <Button 
                block 
                icon={<DollarOutlined />}
                onClick={() => {
                  setShowUserDetail(false);
                  showPointModalHandler(selectedUser);
                }}
              >
                Cộng/Trừ điểm thủ công
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Reset Password Modal */}
      <Modal
        title="Reset mật khẩu"
        open={showPasswordModal}
        onCancel={() => {
          setShowPasswordModal(false);
          passwordForm.resetFields();
          setSelectedUser(null);
        }}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleResetPassword}
        >
          <div className="mb-4">
            <Text>Reset mật khẩu cho người dùng: <Text strong>{selectedUser?.fullName}</Text></Text>
          </div>
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới' },
              { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' }
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => {
                setShowPasswordModal(false);
                passwordForm.resetFields();
                setSelectedUser(null);
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Reset mật khẩu
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Update C2 Password Modal */}
      <Modal
        title={selectedUser?.hasC2Password ? 'Đổi mật khẩu bảo vệ' : 'Thiết lập mật khẩu bảo vệ'}
        open={showC2Modal}
        onCancel={() => {
          setShowC2Modal(false);
          c2Form.resetFields();
          setSelectedUser(null);
        }}
        footer={null}
      >
        <Form
          form={c2Form}
          layout="vertical"
          onFinish={handleResetC2Password}
        >
          <div className="mb-4">
            <Text>
              {selectedUser?.hasC2Password
                ? 'Đổi mật khẩu bảo vệ cho người dùng: '
                : 'Thiết lập mật khẩu bảo vệ cho người dùng: '}
              <Text strong>{selectedUser?.fullName}</Text>
            </Text>
          </div>
          <Form.Item
            name="newC2Password"
            label="Mật khẩu bảo vệ mới"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu bảo vệ mới' },
              { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' }
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => {
                setShowC2Modal(false);
                c2Form.resetFields();
                setSelectedUser(null);
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {selectedUser?.hasC2Password ? 'Cập nhật mật khẩu bảo vệ' : 'Thiết lập mật khẩu bảo vệ'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Lock Withdrawal Modal */}
      <Modal
        title="Khóa rút tiền"
        open={showLockModal}
        onCancel={() => {
          setShowLockModal(false);
          lockForm.resetFields();
          setSelectedUser(null);
        }}
        footer={null}
      >
        <Form
          form={lockForm}
          layout="vertical"
          onFinish={handleLockWithdrawalWithReason}
        >
          <div className="mb-4">
            <Text>Khóa rút tiền cho người dùng: <Text strong>{selectedUser?.fullName}</Text></Text>
            <div className="text-gray-500">
              Username: @{selectedUser?.username}
            </div>
          </div>
          
          <Form.Item
            name="reason"
            label="Lý do khóa rút tiền"
            rules={[
              { required: true, message: 'Vui lòng nhập lý do khóa rút tiền' },
              { min: 10, message: 'Lý do tối thiểu 10 ký tự' },
              { max: 500, message: 'Lý do tối đa 500 ký tự' }
            ]}
          >
            <Input.TextArea 
              rows={4}
              placeholder="Nhập lý do khóa rút tiền cho người dùng này..."
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Alert
            message="Lưu ý"
            description="Lý do này sẽ được hiển thị cho người dùng khi họ cố gắng rút tiền. Hãy nhập lý do rõ ràng và cụ thể."
            type="info"
            showIcon
            className="mb-4"
          />

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => {
                setShowLockModal(false);
                lockForm.resetFields();
                setSelectedUser(null);
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" danger>
                Khóa rút tiền
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Bank Info Modal */}
      <Modal
        title="Thay đổi thông tin ngân hàng"
        open={showBankModal}
        onCancel={() => {
          setShowBankModal(false);
          bankForm.resetFields();
          setSelectedPaymentMethod(null);
          setSelectedUser(null);
        }}
        footer={null}
        width={600}
      >
        {loadingPaymentMethods ? (
          <div className="text-center py-8">
            <Spin size="large" />
          </div>
        ) : userPaymentMethods.length === 0 ? (
          <Empty description="Người dùng chưa có phương thức thanh toán nào" />
        ) : (
          <>
            <div className="mb-4">
              <Text strong>Chọn phương thức thanh toán để chỉnh sửa:</Text>
              <List
                className="mt-2"
                dataSource={userPaymentMethods}
                renderItem={(method) => (
                  <List.Item
                    className={`cursor-pointer hover:bg-gray-50 p-3 rounded ${
                      selectedPaymentMethod?.id === method.id ? 'bg-blue-50 border border-blue-300' : ''
                    }`}
                    onClick={() => {
                      setSelectedPaymentMethod(method);
                      bankForm.setFieldsValue({
                        name: method.name,
                        type: method.type,
                        accountNumber: method.accountNumber,
                        accountName: method.accountName,
                        bankCode: method.bankCode || undefined,
                        note: method.note || ''
                      });
                    }}
                  >
                    <List.Item.Meta
                      avatar={<BankOutlined className="text-2xl text-blue-600" />}
                      title={method.name}
                      description={
                        <div>
                          <div>{method.accountName} - {method.accountNumber}</div>
                          {method.bankCode && <div className="text-xs text-gray-500">{method.bankCode}</div>}
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>

            {selectedPaymentMethod && (
              <Form
                form={bankForm}
                layout="vertical"
                onFinish={handleUpdateBank}
              >
                <Form.Item
                  name="name"
                  label="Tên phương thức"
                  rules={[{ required: true, message: 'Vui lòng nhập tên phương thức' }]}
                >
                  <Input placeholder="Ví dụ: Tài khoản chính" />
                </Form.Item>

                <Form.Item
                  name="type"
                  label="Loại phương thức"
                  rules={[{ required: true, message: 'Vui lòng chọn loại' }]}
                >
                  <Select>
                    <Option value="BANK">Ngân hàng</Option>
                    <Option value="MOMO">Ví MoMo</Option>
                    <Option value="ZALO_PAY">ZaloPay</Option>
                    <Option value="VIET_QR">VietQR</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
                >
                  {({ getFieldValue }) =>
                    getFieldValue('type') === 'BANK' && (
                      <Form.Item
                        name="bankCode"
                        label="Ngân hàng"
                        rules={[{ required: true, message: 'Vui lòng chọn ngân hàng' }]}
                      >
                        <Select placeholder="Chọn ngân hàng" showSearch>
                          <Option value="VCB">Vietcombank</Option>
                          <Option value="TCB">Techcombank</Option>
                          <Option value="ACB">ACB</Option>
                          <Option value="MB">MBBank</Option>
                          <Option value="VTB">Vietinbank</Option>
                          <Option value="BIDV">BIDV</Option>
                          <Option value="TPB">TPBank</Option>
                          <Option value="STB">Sacombank</Option>
                          <Option value="VPB">VPBank</Option>
                        </Select>
                      </Form.Item>
                    )
                  }
                </Form.Item>

                <Form.Item
                  name="accountNumber"
                  label="Số tài khoản"
                  rules={[{ required: true, message: 'Vui lòng nhập số tài khoản' }]}
                >
                  <Input placeholder="Nhập số tài khoản" />
                </Form.Item>

                <Form.Item
                  name="accountName"
                  label="Tên chủ tài khoản"
                  rules={[{ required: true, message: 'Vui lòng nhập tên chủ tài khoản' }]}
                >
                  <Input placeholder="Nhập tên chủ tài khoản" />
                </Form.Item>

                <Form.Item
                  name="note"
                  label="Ghi chú (tùy chọn)"
                >
                  <Input.TextArea rows={3} placeholder="Ghi chú thêm..." />
                </Form.Item>

                <Form.Item className="mb-0">
                  <Space className="w-full justify-end">
                    <Button onClick={() => {
                      setShowBankModal(false);
                      bankForm.resetFields();
                      setSelectedPaymentMethod(null);
                      setSelectedUser(null);
                    }}>
                      Hủy
                    </Button>
                    <Button type="primary" htmlType="submit">
                      Cập nhật
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            )}
          </>
        )}
      </Modal>

      {/* Point Adjustment Modal */}
      <Modal
        title="Cộng/Trừ điểm thủ công"
        open={showPointModal}
        onCancel={() => {
          setShowPointModal(false);
          pointForm.resetFields();
          setSelectedUser(null);
        }}
        footer={null}
        width={500}
      >
        {selectedUser && (
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <Text strong>Người dùng: </Text>
            <Text>{selectedUser.fullName} (@{selectedUser.username})</Text>
            <div className="mt-2">
              <Text strong>Số điểm hiện tại: </Text>
              <Text className="text-blue-600 font-semibold">
                {new Intl.NumberFormat('vi-VN').format(selectedUser.points || 0)} điểm
              </Text>
            </div>
          </div>
        )}

        <Form
          form={pointForm}
          layout="vertical"
          onFinish={handleAdjustPoints}
        >
          <Form.Item
            name="type"
            label="Loại thao tác"
            rules={[{ required: true, message: 'Vui lòng chọn loại thao tác' }]}
          >
            <Select
              onChange={(value) => {
                // Reset moneyType khi đổi loại thao tác
                if (value !== 'ADD') {
                  pointForm.setFieldsValue({ moneyType: undefined });
                }
              }}
            >
              <Option value="ADD">
                <Space>
                  <PlusCircleOutlined className="text-green-600" />
                  <span>Cộng điểm</span>
                </Space>
              </Option>
              <Option value="SUBTRACT">
                <Space>
                  <MinusCircleOutlined className="text-red-600" />
                  <span>Trừ điểm</span>
                </Space>
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
          >
            {({ getFieldValue }) => {
              const type = getFieldValue('type');
              if (type === 'ADD') {
                return (
                  <Form.Item
                    name="moneyType"
                    label="Loại tiền"
                    rules={[{ required: true, message: 'Vui lòng chọn loại tiền' }]}
                  >
                    <Select placeholder="Chọn loại tiền">
                      <Option value="PROMOTIONAL">
                        <Space>
                          <span>Tiền khuyến mại</span>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            (Tiền này sẽ được tính vào bảng KM)
                          </Text>
                        </Space>
                      </Option>
                      <Option value="MANUAL">
                        <Space>
                          <span>Tiền thủ công</span>
                        </Space>
                      </Option>
                    </Select>
                  </Form.Item>
                );
              }
              return null;
            }}
          </Form.Item>

          <Form.Item
            name="points"
            label="Số điểm"
            rules={[
              { required: true, message: 'Vui lòng nhập số điểm' },
              { type: 'number', min: 1, message: 'Số điểm phải lớn hơn 0' }
            ]}
          >
            <InputNumber
              className="w-full"
              placeholder="Nhập số điểm"
              min={1}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Lý do"
            rules={[{ required: true, message: 'Vui lòng nhập lý do' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Nhập lý do cộng/trừ điểm..."
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => {
                setShowPointModal(false);
                pointForm.resetFields();
                setSelectedUser(null);
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Xác nhận
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminUserManagement;