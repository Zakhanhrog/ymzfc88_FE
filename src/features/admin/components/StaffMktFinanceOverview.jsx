import { useEffect, useState, useCallback } from 'react';
import {
  Card,
  DatePicker,
  Row,
  Col,
  Statistic,
  Table,
  message,
  Typography,
  Tag,
  Button,
  Space,
} from 'antd';
import { DollarOutlined, RiseOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import TabPageHeader from './TabPageHeader';
import { staffService } from '../services/staffService';
import { formatCurrency } from '../../../utils/helpers';

const { RangePicker } = DatePicker;
const { Text } = Typography;

const StaffMktFinanceOverview = () => {
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState(null);
  const [dateRange, setDateRange] = useState(null);

  const loadOverview = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (dateRange && dateRange.length === 2) {
        params.startDate = dateRange[0]?.format('YYYY-MM-DD');
        params.endDate = dateRange[1]?.format('YYYY-MM-DD');
      }
      const response = await staffService.getMktFinanceOverview(params);
      if (response?.success) {
        setOverview(response.data);
      } else {
        message.error(response?.message || 'Không thể tải báo cáo tài chính');
      }
    } catch (error) {
      message.error(error.message || 'Không thể tải báo cáo tài chính');
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value) => (value ? dayjs(value).format('DD/MM/YYYY HH:mm') : '-'),
    },
    {
      title: 'Mã giao dịch',
      dataIndex: 'transactionCode',
      key: 'transactionCode',
    },
    {
      title: 'Người dùng',
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
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (value) => {
        if (value === 'DEPOSIT') {
          return <Tag color="green">Nạp tiền</Tag>;
        }
        if (value === 'WITHDRAW') {
          return <Tag color="orange">Rút tiền</Tag>;
        }
        return value || '-';
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (value) => {
        if (value === 'APPROVED' || value === 'COMPLETED') {
          return <Tag color="green">Đã duyệt</Tag>;
        }
        if (value === 'PENDING') {
          return <Tag color="gold">Đang chờ</Tag>;
        }
        if (value === 'REJECTED' || value === 'FAILED') {
          return <Tag color="red">Từ chối</Tag>;
        }
        return value || '-';
      },
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (value) => formatCurrency(Number(value ?? 0)),
    },
    {
      title: 'Thực nhận',
      dataIndex: 'netAmount',
      key: 'netAmount',
      align: 'right',
      render: (value) => formatCurrency(Number(value ?? 0)),
    },
  ];

  return (
    <div className="space-y-6">
      <TabPageHeader
        title="Nhân viên MKT - Quản lý tài chính"
        description="Theo dõi hoạt động tài chính của hệ thống (chế độ chỉ xem)"
      />

      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <span className="text-sm text-gray-400">Khoảng thời gian</span>
            <RangePicker
              className="w-full"
              format="DD/MM/YYYY"
              value={dateRange}
              onChange={(value) => setDateRange(value)}
            />
          </Col>
          <Col xs={24} md={12} className="flex justify-end">
            <Button icon={<ReloadOutlined />} onClick={loadOverview} loading={loading}>
              Làm mới
            </Button>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Tổng nạp"
              value={formatCurrency(Number(overview?.totalDepositAmount ?? 0))}
              prefix={<DollarOutlined className="text-emerald-400" />}
            />
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Tổng rút"
              value={formatCurrency(Number(overview?.totalWithdrawAmount ?? 0))}
              prefix={<DollarOutlined className="text-blue-400" />}
            />
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Nạp đã duyệt"
              prefix={<RiseOutlined className="text-green-400" />}
              value={overview?.approvedDepositCount ?? 0}
            />
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Rút đang chờ"
              prefix={<RiseOutlined className="text-yellow-400" />}
              value={overview?.pendingWithdrawCount ?? 0}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Giao dịch gần đây" loading={loading}>
        <Table
          dataSource={overview?.recentTransactions || []}
          columns={columns}
          pagination={false}
          rowKey={(record) => record.id}
        />
      </Card>
    </div>
  );
};

export default StaffMktFinanceOverview;

