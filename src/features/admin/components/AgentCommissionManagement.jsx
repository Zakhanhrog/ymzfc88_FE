import { useEffect, useMemo, useState } from 'react';
import {
  Card,
  Statistic,
  Row,
  Col,
  Table,
  DatePicker,
  Space,
  Button,
  Select,
  Tag,
  message
} from 'antd';
import {
  DollarOutlined,
  PieChartOutlined,
  TeamOutlined,
  ReloadOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { adminService } from '../services/adminService';
import TabPageHeader from './TabPageHeader';
import { formatCurrency } from '../../../utils/helpers';

const { Option } = Select;

const AgentCommissionManagement = () => {
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState({
    items: [],
    page: 0,
    size: 10,
    totalItems: 0
  });
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [historyFilters, setHistoryFilters] = useState({
    status: undefined,
    page: 1,
    size: 10
  });

  const loadSummary = async (month) => {
    if (!month) return;
    try {
      setLoadingSummary(true);
      const response = await adminService.getAgentCommissionSummary({
        month: month.format('YYYY-MM')
      });
      if (response?.success) {
        setSummary(response.data);
      } else {
        message.error(response?.message || 'Không thể tải báo cáo hoa hồng');
      }
    } catch (error) {
      message.error(error.message || 'Không thể tải báo cáo hoa hồng');
    } finally {
      setLoadingSummary(false);
    }
  };

  const loadHistory = async (filters = historyFilters) => {
    try {
      setLoadingHistory(true);
      const response = await adminService.getAgentCommissionHistory({
        status: filters.status,
        page: filters.page - 1,
        size: filters.size
      });
      if (response?.success) {
        setHistory({
          items: response.data.items || [],
          page: (response.data.page || 0) + 1,
          size: response.data.size || filters.size,
          totalItems: response.data.totalItems || 0
        });
      } else {
        message.error(response?.message || 'Không thể tải lịch sử hoa hồng');
      }
    } catch (error) {
      message.error(error.message || 'Không thể tải lịch sử hoa hồng');
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadSummary(selectedMonth);
  }, [selectedMonth]);

  useEffect(() => {
    loadHistory(historyFilters);
  }, [historyFilters.page, historyFilters.size, historyFilters.status]);

  const summaryCards = useMemo(() => {
    if (!summary) return [];
    return [
      {
        title: 'Tổng cược',
        value: formatCurrency(Number(summary.totalBetAmount ?? 0)),
        icon: <PieChartOutlined className="text-indigo-400" />
      },
      {
        title: 'Tổng thua',
        value: formatCurrency(Number(summary.totalLostAmount ?? 0)),
        icon: <TeamOutlined className="text-red-400" />
      },
      {
        title: `Hoa hồng (${summary.commissionRate ?? 0}%)`,
        value: formatCurrency(Number(summary.totalCommissionAmount ?? 0)),
        icon: <DollarOutlined className="text-emerald-400" />
      },
      {
        title: 'Khách hàng có cược',
        value: summary.totalCustomers ?? 0,
        icon: <TeamOutlined className="text-orange-400" />
      }
    ];
  }, [summary]);

  const customerColumns = [
    {
      title: 'Khách hàng',
      dataIndex: 'username',
      key: 'username',
      render: (value, record) => (
        <Space>
          <TeamOutlined className="text-blue-400" />
          <span className="font-medium">{value}</span>
          <Tag color={record.status === 'ACTIVE' ? 'green' : 'default'}>
            {record.status}
          </Tag>
        </Space>
      )
    },
    {
      title: 'Tổng cược',
      dataIndex: 'totalBetAmount',
      key: 'totalBetAmount',
      align: 'right',
      render: (value) => formatCurrency(Number(value ?? 0))
    },
    {
      title: 'Tổng thua',
      dataIndex: 'totalLostAmount',
      key: 'totalLostAmount',
      align: 'right',
      render: (value) => formatCurrency(Number(value ?? 0))
    },
    {
      title: 'Hoa hồng',
      dataIndex: 'commissionAmount',
      key: 'commissionAmount',
      align: 'right',
      render: (value) => formatCurrency(Number(value ?? 0))
    }
  ];

  const historyColumns = [
    {
      title: 'Kỳ thanh toán',
      dataIndex: 'periodMonth',
      key: 'periodMonth',
      render: (value, record) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-gray-500">
            {dayjs(record.periodStart).format('DD/MM/YYYY')} -{' '}
            {dayjs(record.periodEnd).format('DD/MM/YYYY')}
          </div>
        </div>
      )
    },
    {
      title: 'Tổng thua',
      dataIndex: 'totalLostAmount',
      key: 'totalLostAmount',
      align: 'right',
      render: (value) => formatCurrency(Number(value ?? 0))
    },
    {
      title: 'Hoa hồng',
      dataIndex: 'commissionAmount',
      key: 'commissionAmount',
      align: 'right',
      render: (value) => formatCurrency(Number(value ?? 0))
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        if (status === 'PAID') {
          return (
            <Tag icon={<CheckCircleOutlined />} color="success">
              ĐÃ THANH TOÁN
            </Tag>
          );
        }
        const dueDate = dayjs(record.periodEnd).add(7, 'day');
        const isOverdue = dayjs().isAfter(dueDate);
        return (
          <Tag icon={<ClockCircleOutlined />} color={isOverdue ? 'volcano' : 'default'}>
            CHƯA THANH TOÁN
          </Tag>
        );
      }
    },
    {
      title: 'Ngày thanh toán',
      dataIndex: 'paidAt',
      key: 'paidAt',
      render: (value) => (value ? dayjs(value).format('DD/MM/YYYY HH:mm') : '-')
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
      render: (value) => value || '-'
    }
  ];

  return (
    <div className="space-y-6">
      <TabPageHeader
        title="Quản lý hoa hồng"
        description="Theo dõi báo cáo hoa hồng và lịch sử thanh toán"
      />

      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12} lg={8}>
            <Space direction="vertical" size={2}>
              <div className="text-sm text-gray-500">Kỳ báo cáo</div>
              <DatePicker
                picker="month"
                value={selectedMonth}
                onChange={(value) => setSelectedMonth(value || dayjs())}
                suffixIcon={<CalendarOutlined />}
              />
            </Space>
          </Col>
          <Col xs={24} md={12} lg={16} className="flex justify-end">
            <Button
              icon={<ReloadOutlined />}
              onClick={() => loadSummary(selectedMonth)}
              loading={loadingSummary}
            >
              Làm mới
            </Button>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="mt-4">
          {summaryCards.map((card) => (
            <Col xs={24} md={12} lg={6} key={card.title}>
              <Card>
                <Space>
                  <div className="text-2xl">{card.icon}</div>
                  <div>
                    <div className="text-sm text-gray-500">{card.title}</div>
                    <div className="text-lg font-semibold">{card.value}</div>
                  </div>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      <Card
        loading={loadingSummary}
        title="Hoa hồng theo khách hàng"
        extra={
          <div className="text-sm text-gray-500">
            Kỳ: {selectedMonth.format('MM/YYYY')}
          </div>
        }
      >
        <Table
          columns={customerColumns}
          dataSource={summary?.customers || []}
          pagination={false}
          rowKey="customerId"
          locale={{
            emptyText: 'Không có dữ liệu hoa hồng trong kỳ này'
          }}
        />
      </Card>

      <Card
        loading={loadingHistory}
        title="Lịch sử thanh toán hoa hồng"
        extra={
          <Space>
            <Select
              allowClear
              placeholder="Trạng thái"
              value={historyFilters.status}
              style={{ width: 160 }}
              onChange={(value) =>
                setHistoryFilters((prev) => ({ ...prev, status: value, page: 1 }))
              }
            >
              <Option value="PAID">Đã thanh toán</Option>
              <Option value="PENDING">Chưa thanh toán</Option>
            </Select>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => loadHistory(historyFilters)}
              loading={loadingHistory}
            >
              Làm mới
            </Button>
          </Space>
        }
      >
        <Table
          columns={historyColumns}
          dataSource={history.items}
          rowKey="id"
          pagination={{
            current: history.page,
            pageSize: history.size,
            total: history.totalItems,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: (page, pageSize) =>
              setHistoryFilters((prev) => ({ ...prev, page, size: pageSize }))
          }}
          locale={{
            emptyText: 'Chưa có lịch sử thanh toán hoa hồng'
          }}
        />
      </Card>
    </div>
  );
};

export default AgentCommissionManagement;

