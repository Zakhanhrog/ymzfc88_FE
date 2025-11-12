import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Table, Select, Space, Tag, message, Typography, Button } from 'antd';
import adminService from '../services/adminService';

const { Text } = Typography;

const STAFF_ROLE_OPTIONS = [
  { label: 'Đại lý', value: 'AGENT' },
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
  initialRole = 'ALL',
  allowRoleFilter = true,
  title = 'Quản lý nhân viên',
  description,
  readOnly = false,
}) => {
  const [roleFilter, setRoleFilter] = useState(initialRole);
  const [loading, setLoading] = useState(false);
  const [staff, setStaff] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  });

  const filterOptions = useMemo(() => {
    if (!allowRoleFilter) {
      return [];
    }
    if (readOnly) {
      const staffOptions = STAFF_ROLE_OPTIONS.filter((option) => option.value !== 'AGENT');
      return [
        { label: 'Tất cả nhân viên', value: 'STAFF' },
        ...staffOptions,
      ];
    }
    return [
      { label: 'Tất cả người dùng', value: 'ALL' },
      { label: 'Chỉ nhân viên', value: 'STAFF' },
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
    if (!roleFilter || roleFilter === 'ALL') {
      return 'ALL';
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
      render: (value, record) => (
        <Select
          value={value || undefined}
          allowClear
          placeholder="Chưa phân quyền"
          options={STAFF_ROLE_OPTIONS}
          style={{ width: '100%' }}
          onChange={(nextValue) => handleUpdateStaffRole(record.id, nextValue ?? null)}
        />
      ),
    };

    const readOnlyColumn = {
      title: 'Phân quyền',
      dataIndex: 'staffRole',
      width: 220,
      render: (value) =>
        value ? (
          <Tag color="blue">{STAFF_ROLE_LABELS[value] ?? value}</Tag>
        ) : (
          <Tag>Chưa phân quyền</Tag>
        ),
    };

    return [...baseColumns, readOnly ? readOnlyColumn : editableColumn];
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
            {allowRoleFilter && filterOptions.length > 0 ? (
              <Select
                value={roleFilter}
                onChange={handleRoleFilterChange}
                style={{ minWidth: 220 }}
                options={filterOptions}
                allowClear={!readOnly}
              />
            ) : null}
            <Button onClick={fetchStaff}>Làm mới</Button>
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
    </Space>
  );
};

export default AdminStaffManagement;


