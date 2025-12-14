import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Table, Select, Space, Tag, message, Typography, Button, Modal, Form, Input, Row, Col, Tooltip } from 'antd';
import { PlusOutlined, ReloadOutlined, UserAddOutlined, EditOutlined, KeyOutlined, SafetyOutlined } from '@ant-design/icons';
import adminService from '../services/adminService';

const { Text } = Typography;

const STAFF_ROLE_OPTIONS = [
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Nhân viên TX 1', value: 'STAFF_TX1' },
  { label: 'Nhân viên TX 2', value: 'STAFF_TX2' },
  { label: 'Nhân viên Xóc Đĩa', value: 'STAFF_XD' },
  { label: 'Nhân viên MKT', value: 'STAFF_MKT' },
  { label: 'Nhân viên XNK', value: 'STAFF_XNK' },
];

// Role options cho trang Phân quyền khi tạo tài khoản nhân viên (bỏ AGENT, thêm ADMIN)
const ROLE_ASSIGNMENT_CREATE_OPTIONS = [
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Nhân viên TX 1', value: 'STAFF_TX1' },
  { label: 'Nhân viên TX 2', value: 'STAFF_TX2' },
  { label: 'Nhân viên Xóc Đĩa', value: 'STAFF_XD' },
  { label: 'Nhân viên MKT', value: 'STAFF_MKT' },
  { label: 'Nhân viên XNK', value: 'STAFF_XNK' },
];

const STAFF_ROLE_LABELS = STAFF_ROLE_OPTIONS.reduce((acc, item) => {
  acc[item.value] = item.label;
  return acc;
}, {});

const DEFAULT_PAGE_SIZE = 20;

const AdminStaffManagement = ({
  initialRole = 'STAFF',
  allowRoleFilter = true,
  title = 'Quản lý nhân viên',
  description,
  readOnly = false,
  useRoleAssignmentCreateOptions = false, // Flag để dùng role options đặc biệt cho trang Phân quyền
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
  const [createForm] = Form.useForm();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showC2Modal, setShowC2Modal] = useState(false);
  const [editForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [c2Form] = Form.useForm();
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

  const handleTableChange = (nextPagination) => {
    setPagination((prev) => ({
      ...prev,
      current: nextPagination.current ?? prev.current,
      pageSize: nextPagination.pageSize ?? prev.pageSize,
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
    editForm.setFieldsValue({
      fullName: record.fullName,
      email: record.email,
      phoneNumber: record.phoneNumber,
      status: record.status,
      staffRole: record.role === 'ADMIN' ? 'ADMIN' : record.staffRole
    });
    setShowEditModal(true);
  };

  const handleOpenPassword = (record) => {
    setSelectedStaff(record);
    passwordForm.resetFields();
    setShowPasswordModal(true);
  };

  const handleOpenC2 = (record) => {
    setSelectedStaff(record);
    c2Form.resetFields();
    setShowC2Modal(true);
  };

  const handleUpdateStaff = async (values) => {
    try {
      const payload = { ...values };
      if (values.staffRole === 'ADMIN') {
        payload.role = 'ADMIN';
        delete payload.staffRole;
      } else {
        payload.role = 'USER';
        payload.staffRole = values.staffRole || null;
      }
      const response = await adminService.updateUser(selectedStaff.id, payload);
      if (response.success) {
        message.success('Cập nhật thông tin thành công');
        setShowEditModal(false);
        editForm.resetFields();
        setSelectedStaff(null);
        fetchStaff();
      }
    } catch (error) {
      message.error(error.message || 'Không thể cập nhật thông tin');
    }
  };

  const handleUpdatePassword = async (values) => {
    try {
      const response = await adminService.resetUserPassword(selectedStaff.id, values.newPassword);
      if (response.success) {
        message.success('Đổi mật khẩu thành công');
        setShowPasswordModal(false);
        passwordForm.resetFields();
        setSelectedStaff(null);
      }
    } catch (error) {
      message.error(error.message || 'Không thể đổi mật khẩu');
    }
  };

  const handleUpdateC2Password = async (values) => {
    try {
      const response = await adminService.updateUserC2Password(selectedStaff.id, values.newC2Password);
      if (response.success) {
        message.success('Đổi mật khẩu C2 thành công');
        setShowC2Modal(false);
        c2Form.resetFields();
        setSelectedStaff(null);
      }
    } catch (error) {
      message.error(error.message || 'Không thể đổi mật khẩu C2');
    }
  };

  const handleCreateStaff = async (values) => {
    try {
      const payload = {
        ...values,
      };
      
      // Nếu là ADMIN thì set role = 'ADMIN', không có staffRole
      if (values.staffRole === 'ADMIN') {
        payload.role = 'ADMIN';
        delete payload.staffRole;
      } else {
        payload.role = 'USER';
        payload.staffRole = values.staffRole;
      }
      
      const response = await adminService.createUser(payload);
      if (response.success) {
        message.success('Tạo tài khoản nhân viên thành công!');
        setShowCreateModal(false);
        createForm.resetFields();
        fetchStaff();
      }
    } catch (error) {
      message.error(error.message || 'Không thể tạo tài khoản nhân viên');
    }
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        title: 'ID',
        dataIndex: 'id',
        width: 80,
        render: (value) => `#${value}`,
      },
      {
        title: 'Tài khoản',
        dataIndex: 'username',
        width: 160,
        render: (value, record) => (
          <Space direction="vertical" size={0}>
            <Text strong>{value}</Text>
            <Text type="secondary">{record.email}</Text>
          </Space>
        ),
      },
      {
        title: 'Họ tên',
        dataIndex: 'fullName',
        width: 160,
        render: (value) => value || <Text type="secondary">Chưa cập nhật</Text>,
      },
      {
        title: 'Số điện thoại',
        dataIndex: 'phoneNumber',
        width: 140,
        render: (value) => value || <Text type="secondary">-</Text>,
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        width: 120,
        render: (value) => <Tag color={value === 'ACTIVE' ? 'green' : 'default'}>{value}</Tag>,
      },
    ];

    const editableColumn = {
      title: 'Phân quyền',
      dataIndex: 'staffRole',
      width: 220,
      render: (value, record) => {
        // Nếu là Admin thì chỉ hiển thị tag, không cho chỉnh sửa tại đây
        if (record.role === 'ADMIN') {
          return <Tag color="volcano">Admin</Tag>;
        }
        return (
          <Select
            value={value || undefined}
            allowClear
            placeholder="Chưa phân quyền"
            options={STAFF_ROLE_OPTIONS}
            style={{ width: '100%' }}
            onChange={(nextValue) => handleUpdateStaffRole(record.id, nextValue ?? null)}
          />
        );
      },
    };

    const readOnlyColumn = {
      title: 'Phân quyền',
      dataIndex: 'staffRole',
      width: 220,
      render: (value, record) => {
        if (record.role === 'ADMIN') {
          return <Tag color="volcano">Admin</Tag>;
        }
        return value ? (
          <Tag color="blue">{STAFF_ROLE_LABELS[value] ?? value}</Tag>
        ) : (
          <Tag>Chưa phân quyền</Tag>
        );
      },
    };

    const actionColumn = {
      title: 'Thao tác',
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa thông tin">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleOpenEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Đổi mật khẩu">
            <Button
              type="text"
              icon={<KeyOutlined />}
              onClick={() => handleOpenPassword(record)}
            />
          </Tooltip>
          <Tooltip title="Đổi mật khẩu C2">
            <Button
              type="text"
              icon={<SafetyOutlined />}
              onClick={() => handleOpenC2(record)}
            />
          </Tooltip>
        </Space>
      ),
    };

    return [...baseColumns, readOnly ? readOnlyColumn : editableColumn, actionColumn];
  }, [readOnly, handleUpdateStaffRole]);

  return (
    <Space direction="vertical" size={16} className="w-full">
      <Card>
        <Space wrap size="large" className="w-full justify-between">
          <Space direction="vertical" size={4}>
            <Text strong>{title}</Text>
            {description ? <Text type="secondary">{description}</Text> : null}
          </Space>
          <Space>
            {!readOnly && (
              <Button 
                type="primary" 
                icon={<UserAddOutlined />}
                onClick={() => setShowCreateModal(true)}
              >
                Tạo tài khoản nhân viên
              </Button>
            )}
            {allowRoleFilter && filterOptions.length > 0 ? (
              <Select
                value={roleFilter}
                onChange={handleRoleFilterChange}
                style={{ minWidth: 220 }}
                options={filterOptions}
                allowClear={!readOnly}
              />
            ) : null}
            <Button icon={<ReloadOutlined />} onClick={fetchStaff}>Làm mới</Button>
          </Space>
        </Space>
      </Card>

      <Card>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={staff}
          columns={columns}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total) => `${total.toLocaleString('vi-VN')} người dùng`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 900 }}
        />
      </Card>

      {/* Modal tạo tài khoản nhân viên */}
      <Modal
        title="Tạo tài khoản nhân viên"
        open={showCreateModal}
        onCancel={() => {
          setShowCreateModal(false);
          createForm.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreateStaff}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label="Tên đăng nhập"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên đăng nhập' },
                  { min: 3, message: 'Tên đăng nhập tối thiểu 3 ký tự' }
                ]}
              >
                <Input placeholder="username" />
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
                <Input placeholder="email@example.com" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu' },
                  { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' }
                ]}
              >
                <Input.Password placeholder="Mật khẩu" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="staffRole"
                label="Vai trò nhân viên"
                rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
              >
                <Select
                  placeholder="Chọn vai trò"
                  options={useRoleAssignmentCreateOptions ? ROLE_ASSIGNMENT_CREATE_OPTIONS : STAFF_ROLE_OPTIONS}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
              >
                <Input placeholder="Nguyễn Văn A" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phoneNumber"
                label="Số điện thoại"
              >
                <Input placeholder="0987654321" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="c2Password"
            label="Mật khẩu bảo vệ (C2)"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu bảo vệ' },
              { min: 6, message: 'Mật khẩu bảo vệ tối thiểu 6 ký tự' }
            ]}
            tooltip="Mật khẩu bảo vệ được dùng để đăng nhập vào portal nhân viên/đại lý"
          >
            <Input.Password placeholder="Mật khẩu bảo vệ C2" />
          </Form.Item>

          <Space className="w-full justify-end">
            <Button onClick={() => {
              setShowCreateModal(false);
              createForm.resetFields();
            }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Tạo tài khoản
            </Button>
          </Space>
        </Form>
      </Modal>

      {/* Modal chỉnh sửa nhân viên */}
      <Modal
        title="Chỉnh sửa thông tin nhân viên"
        open={showEditModal}
        onCancel={() => {
          setShowEditModal(false);
          editForm.resetFields();
          setSelectedStaff(null);
        }}
        footer={null}
        width={600}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdateStaff}
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
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
              >
                <Select>
                  <Select.Option value="ACTIVE">Hoạt động</Select.Option>
                  <Select.Option value="INACTIVE">Tạm khóa</Select.Option>
                  <Select.Option value="SUSPENDED">Tạm dừng</Select.Option>
                  <Select.Option value="BANNED">Bị cấm</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="staffRole"
            label="Phân quyền"
            rules={[{ required: true, message: 'Vui lòng chọn phân quyền' }]}
          >
            <Select
              placeholder="Chọn phân quyền"
              options={STAFF_ROLE_OPTIONS}
            />
          </Form.Item>

          <Space className="w-full justify-end">
            <Button
              onClick={() => {
                setShowEditModal(false);
                editForm.resetFields();
                setSelectedStaff(null);
              }}
            >
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Space>
        </Form>
      </Modal>

      {/* Modal đổi mật khẩu */}
      <Modal
        title="Đổi mật khẩu"
        open={showPasswordModal}
        onCancel={() => {
          setShowPasswordModal(false);
          passwordForm.resetFields();
          setSelectedStaff(null);
        }}
        footer={null}
        width={400}
      >
        <Form form={passwordForm} layout="vertical" onFinish={handleUpdatePassword}>
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
          <Space className="w-full justify-end">
            <Button
              onClick={() => {
                setShowPasswordModal(false);
                passwordForm.resetFields();
                setSelectedStaff(null);
              }}
            >
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Space>
        </Form>
      </Modal>

      {/* Modal đổi mật khẩu C2 */}
      <Modal
        title="Đổi mật khẩu C2"
        open={showC2Modal}
        onCancel={() => {
          setShowC2Modal(false);
          c2Form.resetFields();
          setSelectedStaff(null);
        }}
        footer={null}
        width={400}
      >
        <Form form={c2Form} layout="vertical" onFinish={handleUpdateC2Password}>
          <Form.Item
            name="newC2Password"
            label="Mật khẩu C2 mới"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu C2 mới' },
              { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' }
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Space className="w-full justify-end">
            <Button
              onClick={() => {
                setShowC2Modal(false);
                c2Form.resetFields();
                setSelectedStaff(null);
              }}
            >
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Space>
        </Form>
      </Modal>
    </Space>
  );
};

export default AdminStaffManagement;


