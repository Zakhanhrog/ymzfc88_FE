import { useEffect, useMemo, useState } from 'react';
import {
  Card,
  Statistic,
  Row,
  Col,
  DatePicker,
  Space,
  Button,
  Table,
  message
} from 'antd';
import {
  TeamOutlined,
  PieChartOutlined,
  DollarOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  ResponsiveContainer,
  LineChart,
  Line as RechartLine,
  CartesianGrid,
  Tooltip,
  Legend,
  XAxis,
  YAxis
} from 'recharts';
import { adminService } from '../services/adminService';
import TabPageHeader from './TabPageHeader';
import { formatCurrency } from '../../../utils/helpers';

const AgentDashboard = () => {
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(29, 'day'),
    dayjs()
  ]);

  const loadSummary = async (start, end) => {
    try {
      setSummaryLoading(true);
      const response = await adminService.getAgentDashboardSummary({
        startDate: start ? start.format('YYYY-MM-DD') : undefined,
        endDate: end ? end.format('YYYY-MM-DD') : undefined
      });
      if (response?.success) {
        setSummary(response.data);
      } else {
        message.error(response?.message || 'Không thể tải thống kê tổng quan');
      }
    } catch (error) {
      message.error(error.message || 'Không thể tải thống kê tổng quan');
    } finally {
      setSummaryLoading(false);
    }
  };

  const loadChart = async (start, end) => {
    try {
      setChartLoading(true);
      const response = await adminService.getAgentDashboardChart({
        startDate: start ? start.format('YYYY-MM-DD') : undefined,
        endDate: end ? end.format('YYYY-MM-DD') : undefined
      });
      if (response?.success) {
        setChartData(
          (response.data || []).map((point) => ({
            date: dayjs(point.date).format('DD/MM'),
            totalBetAmount: Number(point.totalBetAmount ?? 0),
            totalLostAmount: Number(point.totalLostAmount ?? 0),
            commissionAmount: Number(point.commissionAmount ?? 0)
          }))
        );
      } else {
        message.error(response?.message || 'Không thể tải biểu đồ hoa hồng');
      }
    } catch (error) {
      message.error(error.message || 'Không thể tải biểu đồ hoa hồng');
    } finally {
      setChartLoading(false);
    }
  };

  useEffect(() => {
    const [start, end] = dateRange;
    loadSummary(start, end);
    loadChart(start, end);
  }, [dateRange]);

  const summaryCards = useMemo(() => {
    if (!summary) return [];
    return [
      {
        title: 'Tổng khách hàng',
        value: summary.totalCustomers ?? 0,
        icon: <TeamOutlined className="text-blue-400" />
      },
      {
        title: 'Tổng cược',
        value: formatCurrency(Number(summary.totalBetAmount ?? 0)),
        icon: <PieChartOutlined className="text-indigo-400" />
      },
      {
        title: 'Tổng thua',
        value: formatCurrency(Number(summary.totalLostAmount ?? 0)),
        icon: <PieChartOutlined className="text-red-400" />
      },
      {
        title: `Hoa hồng (${summary.commissionRate ?? 0}%)`,
        value: formatCurrency(Number(summary.totalCommissionAmount ?? 0)),
        icon: <DollarOutlined className="text-emerald-400" />
      }
    ];
  }, [summary]);

  const transformedChartData = useMemo(() => {
    const expanded = [];
    chartData.forEach((item) => {
      expanded.push(
        { date: item.date, type: 'Tổng cược', value: item.totalBetAmount },
        { date: item.date, type: 'Tổng thua', value: item.totalLostAmount },
        { date: item.date, type: 'Hoa hồng', value: item.commissionAmount }
      );
    });
    return expanded;
  }, [chartData]);

  const topCustomersColumns = [
    {
      title: 'Khách hàng',
      dataIndex: 'username',
      key: 'username',
      render: (value) => (
        <Space>
          <TeamOutlined className="text-blue-400" />
          <span className="font-medium">{value}</span>
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

  return (
    <div className="space-y-6">
      <TabPageHeader
        title="Dashboard hoa hồng"
        description="Theo dõi tổng quan doanh thu và hoa hồng đại lý"
      />

      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={16}>
            <Space direction="vertical" size={2}>
              <div className="text-sm text-gray-500">Khoảng thời gian</div>
              <DatePicker.RangePicker
                value={dateRange}
                onChange={(values) => {
                  if (!values || values.length !== 2) {
                    setDateRange([dayjs().subtract(29, 'day'), dayjs()]);
                  } else {
                    setDateRange(values);
                  }
                }}
                format="DD/MM/YYYY"
              />
            </Space>
          </Col>
          <Col xs={24} md={8} className="flex justify-end">
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                const [start, end] = dateRange;
                loadSummary(start, end);
                loadChart(start, end);
              }}
              loading={summaryLoading || chartLoading}
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

      <Card loading={chartLoading} title="Biểu đồ tổng cược - thua - hoa hồng">
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <LineChart data={transformedChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <RechartLine type="monotone" dataKey="Tổng cược" stroke="#6366F1" strokeWidth={2} dot={false} />
              <RechartLine type="monotone" dataKey="Tổng thua" stroke="#EF4444" strokeWidth={2} dot={false} />
              <RechartLine type="monotone" dataKey="Hoa hồng" stroke="#10B981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card
        loading={summaryLoading}
        title="Top khách hàng tạo hoa hồng"
      >
        <Table
          columns={topCustomersColumns}
          dataSource={summary?.topCustomers || []}
          pagination={false}
          rowKey="customerId"
          locale={{
            emptyText: 'Chưa có dữ liệu khách hàng'
          }}
        />
      </Card>
    </div>
  );
};

export default AgentDashboard;

