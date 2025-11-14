import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, DatePicker, Form, Input, message, Select, Space, Table, Tag, Typography } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { adminService } from '../services/adminService';

const { RangePicker } = DatePicker;
const { Text } = Typography;

const successOptions = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Thành công', value: 'success' },
  { label: 'Thất bại', value: 'failure' },
];

const portalOptions = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Người dùng', value: 'USER' },
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Nhân viên', value: 'STAFF' },
  { label: 'Đại lý', value: 'AGENT' },
];

const defaultFilters = {
  username: '',
  ip: '',
  portal: 'all',
  success: 'all',
  dateRange: null,
};

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const AdminLoginHistory = () => {
  const [form] = Form.useForm();
  const [filters, setFilters] = useState(defaultFilters);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const computedParams = useMemo(() => {
    const params = {
      page: page - 1,
      size: pageSize,
    };

    if (filters.username) {
      params.username = filters.username.trim();
    }

    if (filters.ip) {
      params.ip = filters.ip.trim();
    }

    if (filters.portal && filters.portal !== 'all') {
      params.portal = filters.portal;
    }

    if (filters.success === 'success') {
      params.success = true;
    } else if (filters.success === 'failure') {
      params.success = false;
    }

    if (filters.dateRange && filters.dateRange.length === 2) {
      params.from = filters.dateRange[0].toISOString();
      params.to = filters.dateRange[1].toISOString();
    }

    return params;
  }, [filters, page, pageSize]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminService.getLoginHistory(computedParams);
      if (!response?.success) {
        throw new Error(response?.message || 'Không thể tải lịch sử đăng nhập');
      }

      const payload = response.data || {};
      setData(Array.isArray(payload.items) ? payload.items : []);
      setTotal(payload.totalItems || 0);
    } catch (error) {
      console.error('Failed to fetch login history', error);
      message.error(error.message || 'Không thể tải lịch sử đăng nhập');
    } finally {
      setLoading(false);
    }
  }, [computedParams]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearch = (values) => {
    setPage(1);
    setFilters({
      username: values.username || '',
      ip: values.ip || '',
      portal: values.portal || 'all',
      success: values.success || 'all',
      dateRange: values.dateRange || null,
    });
  };

  const handleReset = () => {
    form.resetFields();
    setPage(1);
    setFilters(defaultFilters);
  };

  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'loginAt',
      key: 'loginAt',
      render: (value) => (value ? dayjs(value).format('DD/MM/YYYY HH:mm:ss') : '—'),
      width: 190,
    },
    {
      title: 'Tài khoản',
      key: 'username',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.username || '—'}</Text>
          {record.fullName && <Text type="secondary">{record.fullName}</Text>}
        </Space>
      ),
      width: 200,
    },
    {
      title: 'IP',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: 140,
      render: (value) => value || '—',
    },
    {
      title: 'Cổng',
      dataIndex: 'portal',
      key: 'portal',
      width: 110,
      render: (value) => value || 'USER',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'success',
      key: 'success',
      width: 120,
      render: (success) =>
        success ? <Tag color="green">Thành công</Tag> : <Tag color="red">Thất bại</Tag>,
    },
    {
      title: 'Lý do thất bại',
      dataIndex: 'failureReason',
      key: 'failureReason',
      render: (value, record) => (record.success ? '—' : value || '—'),
    },
    {
      title: 'User Agent',
      dataIndex: 'userAgent',
      key: 'userAgent',
      ellipsis: true,
      render: (value) => (value ? <span title={value}>{value}</span> : '—'),
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <Form
          form={form}
          layout="vertical"
          initialValues={defaultFilters}
          onFinish={handleSearch}
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Form.Item label="Tài khoản / Email" name="username">
              <Input placeholder="Nhập username hoặc email" allowClear />
            </Form.Item>
            <Form.Item label="Địa chỉ IP" name="ip">
              <Input placeholder="Ví dụ: 192.168.1.1" allowClear />
            </Form.Item>
            <Form.Item label="Cổng đăng nhập" name="portal">
              <Select options={portalOptions} />
            </Form.Item>
            <Form.Item label="Trạng thái" name="success">
              <Select options={successOptions} />
            </Form.Item>
            <Form.Item label="Khoảng thời gian" name="dateRange">
              <RangePicker
                className="w-full"
                showTime
                format="DD/MM/YYYY HH:mm"
                allowClear
                disabledDate={(current) => current && current > dayjs().endOf('day')}
              />
            </Form.Item>
          </div>
          <Space>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              Tìm kiếm
            </Button>
            <Button onClick={handleReset}>Đặt lại</Button>
            <Button icon={<ReloadOutlined />} onClick={loadData}>
              Tải lại
            </Button>
          </Space>
        </Form>
      </Card>

      <Card>
        <Table
          rowKey={(record) => record.id || `${record.username}-${record.loginAt}`}
          dataSource={data}
          columns={columns}
          loading={loading}
          pagination={false}
          scroll={{ x: 900 }}
        />
        <div className="mt-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Text type="secondary">
            Tổng số: <strong>{total}</strong> bản ghi
          </Text>
          <Space>
            <Select
              value={pageSize}
              onChange={(value) => {
                setPage(1);
                setPageSize(value);
              }}
              options={PAGE_SIZE_OPTIONS.map((sizeOption) => ({
                label: `${sizeOption}/trang`,
                value: sizeOption,
              }))}
            />
            <PaginationControls
              current={page}
              pageSize={pageSize}
              total={total}
              onChange={(newPage, newSize) => {
                setPage(newPage);
                if (newSize !== pageSize) {
                  setPageSize(newSize);
                }
              }}
            />
          </Space>
        </div>
      </Card>
    </div>
  );
};

const PaginationControls = ({ current, pageSize, total, onChange }) => {
  const totalPages = Math.ceil(total / pageSize) || 1;

  const canPrev = current > 1;
  const canNext = current < totalPages;

  return (
    <Space>
      <Button disabled={!canPrev} onClick={() => canPrev && onChange(current - 1, pageSize)}>
        Trang trước
      </Button>
      <Text>
        Trang {current} / {totalPages}
      </Text>
      <Button disabled={!canNext} onClick={() => canNext && onChange(current + 1, pageSize)}>
        Trang sau
      </Button>
    </Space>
  );
};

export default AdminLoginHistory;


