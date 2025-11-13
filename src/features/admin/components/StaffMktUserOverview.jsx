import { useEffect, useState, useCallback } from 'react';
import {
  Card,
  Table,
  Input,
  Select,
  Space,
  Button,
  Typography,
  message,
} from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import TabPageHeader from './TabPageHeader';
import { staffService } from '../services/staffService';

const { Option } = Select;
const { Text } = Typography;

const StaffMktUserOverview = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    status: undefined,
  });

  const loadUsers = useCallback(
    async (page = pagination.current, pageSize = pagination.pageSize) => {
      try {
        setLoading(true);
        const response = await staffService.getMktUsers({
          search: filters.search || undefined,
          status: filters.status || undefined,
          page: page - 1,
          size: pageSize,
        });

        if (response?.success) {
          const payload = response.data;
          setData(payload.items || []);
          setPagination({
            current: (payload.page || 0) + 1,
            pageSize: payload.size || pageSize,
            total: payload.totalItems || 0,
          });
        } else {
          message.error(response?.message || 'Không thể tải danh sách người dùng');
        }
      } catch (error) {
        message.error(error.message || 'Không thể tải danh sách người dùng');
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.current, pagination.pageSize],
  );

  useEffect(() => {
    loadUsers(1, pagination.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const columns = [
    {
      title: 'Tài khoản',
      dataIndex: 'username',
      key: 'username',
      render: (value, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.fullName || '-'}</Text>
          <Text type="secondary">@{value}</Text>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (value) => value || '-',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (value) => value || '-',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (value) => {
        switch (value) {
          case 'ACTIVE':
            return <Text className="text-emerald-400">Hoạt động</Text>;
          case 'INACTIVE':
            return <Text className="text-yellow-400">Tạm khóa</Text>;
          case 'BANNED':
            return <Text className="text-red-400">Bị cấm</Text>;
          default:
            return value || '-';
        }
      },
    },
    {
      title: 'Điểm hiện có',
      dataIndex: 'points',
      key: 'points',
      align: 'right',
      render: (value) => new Intl.NumberFormat('vi-VN').format(value ?? 0),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value) => (value ? dayjs(value).format('DD/MM/YYYY HH:mm') : '-'),
    },
  ];

  return (
    <div className="space-y-6">
      <TabPageHeader
        title="Nhân viên MKT - Quản lý người dùng"
        description="Xem thông tin người dùng trong hệ thống (chế độ chỉ đọc)"
      />

      <Card>
        <Space direction="vertical" className="w-full" size="large">
          <Space wrap>
            <Input
              allowClear
              style={{ width: 260 }}
              placeholder="Tìm kiếm theo tên hoặc username"
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  search: event.target.value,
                }))
              }
              onPressEnter={() => loadUsers(1, pagination.pageSize)}
            />
            <Select
              allowClear
              style={{ width: 200 }}
              placeholder="Trạng thái"
              value={filters.status}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  status: value,
                }))
              }
            >
              <Option value="ACTIVE">Hoạt động</Option>
              <Option value="INACTIVE">Tạm khóa</Option>
              <Option value="BANNED">Bị cấm</Option>
            </Select>
            <Button icon={<ReloadOutlined />} onClick={() => loadUsers(1, pagination.pageSize)} />
          </Space>
        </Space>
      </Card>

      <Card>
        <Table
          loading={loading}
          dataSource={data}
          columns={columns}
          rowKey={(record) => record.id}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            onChange: (page, pageSize) => loadUsers(page, pageSize),
          }}
        />
      </Card>
    </div>
  );
};

export default StaffMktUserOverview;

