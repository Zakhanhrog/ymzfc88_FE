import React, { useState, useEffect } from 'react';
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
  Badge
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  KeyOutlined,
  DollarOutlined,
  FilterOutlined,
  UserAddOutlined,
  TeamOutlined,
  UserSwitchOutlined,
  UserDeleteOutlined,
  LockOutlined,
  UnlockOutlined
} from '@ant-design/icons';
import { HEADING_STYLES, BODY_STYLES, FONT_SIZE, FONT_WEIGHT } from '../../../utils/typography';
import { adminService } from '../services/adminService';

const { Option } = Select;
const { Search } = Input;
const { Title, Text } = Typography;

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
    sortDirection: 'desc'
  });
  const [userStats, setUserStats] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [lockAction, setLockAction] = useState(null); // 'lock' or 'unlock'

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [balanceForm] = Form.useForm();
  const [lockForm] = Form.useForm();

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
      console.error('Error loading user stats:', error);
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
      sortDirection: 'desc'
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

  // Create user
  const handleCreateUser = async (values) => {
    try {
      const response = await adminService.createUser(values);
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
      const response = await adminService.updateUser(selectedUser.id, values);
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

  // Update balance
  const handleUpdateBalance = async (values) => {
    try {
      const response = await adminService.updateUserBalance(selectedUser.id, values.balance);
      if (response.success) {
        message.success('Cập nhật số dư thành công!');
        setShowBalanceModal(false);
        balanceForm.resetFields();
        setSelectedUser(null);
        loadUsers();
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  // Show modals
  const showEditUserModal = (user) => {
    setSelectedUser(user);
    editForm.setFieldsValue(user);
    setShowEditModal(true);
  };

  const showUserDetailDrawer = (user) => {
    setSelectedUser(user);
    setShowUserDetail(true);
  };

  const showPasswordResetModal = (user) => {
    setSelectedUser(user);
    setShowPasswordModal(true);
  };

  const showBalanceUpdateModal = (user) => {
    setSelectedUser(user);
    balanceForm.setFieldsValue({ balance: user.balance });
    setShowBalanceModal(true);
  };

  // Show lock/unlock modal
  const showLockWithdrawalModal = (user, action) => {
    setSelectedUser(user);
    setLockAction(action);
    // Truyền action trực tiếp để tránh race condition
    handleLockWithdrawal(user, action);
  };

  // Handle lock/unlock withdrawal
  const handleLockWithdrawal = async (user, action) => {
    try {
      if (action === 'lock') {
        // Lock withdrawal - không cần lý do, sẽ dùng default từ settings
        await adminService.lockWithdrawal(user?.id, '');
        message.success('Khóa rút tiền thành công! Đang sử dụng lý do mặc định từ cài đặt hệ thống.');
      } else {
        // Unlock withdrawal
        await adminService.unlockWithdrawal(user?.id);
        message.success('Mở khóa rút tiền thành công');
      }
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
      render: (_, record) => (
        <Avatar 
          size="large" 
          icon={<UserOutlined />}
          style={{ backgroundColor: record.role === 'ADMIN' ? '#f56a00' : '#1890ff' }}
        >
          {record.fullName?.charAt(0)?.toUpperCase()}
        </Avatar>
      ),
    },
    {
      title: 'Thông tin',
      key: 'userInfo',
      render: (_, record) => (
        <div>
          <div className="font-medium">
            {record.fullName}
            {record.withdrawalLocked && (
              <Tooltip title={`Đã khóa rút tiền: ${record.withdrawalLockReason || 'Không có lý do'}`}>
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
        { text: 'Admin', value: 'ADMIN' },
        { text: 'User', value: 'USER' }
      ],
      render: (role) => (
        <Tag color={role === 'ADMIN' ? 'red' : 'blue'}>
          {role === 'ADMIN' ? 'Admin' : 'Người dùng'}
        </Tag>
      ),
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
      dataIndex: 'balance',
      key: 'balance',
      width: 120,
      sorter: true,
      render: (balance) => (
        <Text className={balance > 0 ? 'text-green-600' : 'text-gray-500'}>
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }).format(balance || 0)}
        </Text>
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
          <Tooltip title="Cập nhật số dư">
            <Button
              type="text"
              icon={<DollarOutlined />}
              onClick={() => showBalanceUpdateModal(record)}
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
              title="Quản trị viên"
              value={userStats.usersByRole?.ADMIN || 0}
              prefix={<UserSwitchOutlined className="text-red-600" />}
              valueStyle={{ color: '#ff4d4f' }}
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
          <Col xs={12} sm={6} md={4} lg={3}>
            <Select
              placeholder="Vai trò"
              allowClear
              value={filters.role}
              onChange={(value) => handleFilterChange('role', value)}
              style={{ width: '100%' }}
            >
              <Option value="USER">Người dùng</Option>
              <Option value="ADMIN">Admin</Option>
            </Select>
          </Col>
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
          <Col xs={24} sm={12} md={8} lg={12}>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setShowCreateModal(true)}
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
                <Select>
                  <Option value="USER">Người dùng</Option>
                  <Option value="ADMIN">Admin</Option>
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
                <Select>
                  <Option value="USER">Người dùng</Option>
                  <Option value="ADMIN">Admin</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
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
                style={{ backgroundColor: selectedUser.role === 'ADMIN' ? '#f56a00' : '#1890ff' }}
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
                  <Tag color={selectedUser.role === 'ADMIN' ? 'red' : 'blue'}>
                    {selectedUser.role === 'ADMIN' ? 'Admin' : 'Người dùng'}
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
                <div className={selectedUser.balance > 0 ? 'text-green-600' : 'text-gray-500'}>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(selectedUser.balance || 0)}
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
              <Button 
                block 
                icon={<DollarOutlined />}
                onClick={() => {
                  setShowUserDetail(false);
                  showBalanceUpdateModal(selectedUser);
                }}
              >
                Cập nhật số dư
              </Button>
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

      {/* Update Balance Modal */}
      <Modal
        title="Cập nhật số dư"
        open={showBalanceModal}
        onCancel={() => {
          setShowBalanceModal(false);
          balanceForm.resetFields();
          setSelectedUser(null);
        }}
        footer={null}
      >
        <Form
          form={balanceForm}
          layout="vertical"
          onFinish={handleUpdateBalance}
        >
          <div className="mb-4">
            <Text>Cập nhật số dư cho: <Text strong>{selectedUser?.fullName}</Text></Text>
            <div className="text-gray-500">
              Số dư hiện tại: {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(selectedUser?.balance || 0)}
            </div>
          </div>
          <Form.Item
            name="balance"
            label="Số dư mới"
            rules={[
              { required: true, message: 'Vui lòng nhập số dư mới' },
              { type: 'number', min: 0, message: 'Số dư phải lớn hơn hoặc bằng 0' }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="Nhập số dư"
            />
          </Form.Item>
          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => {
                setShowBalanceModal(false);
                balanceForm.resetFields();
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
    </div>
  );
};

export default AdminUserManagement;