import { useEffect, useMemo, useState } from 'react';
import {
  Card,
  DatePicker,
  Table,
  Tag,
  Space,
  Button,
  Typography,
  message,
  Popconfirm,
  Row,
  Col,
  Statistic
} from 'antd';
import { DollarOutlined, ReloadOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { adminService } from '../services/adminService';
import TabPageHeader from './TabPageHeader';
import { formatCurrency } from '../../../utils/helpers';

const { Text } = Typography;

const AdminAgentReport = () => {
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [payoutLoading, setPayoutLoading] = useState({});

  const loadReport = async (monthValue) => {
    try {
      setLoading(true);
      const response = await adminService.getAgentCommissionReport({
        month: monthValue.format('YYYY-MM')
      });
      if (response?.success) {
        setReport(response.data);
      } else {
        message.error(response?.message || 'Không thể tải báo cáo đại lý');
      }
    } catch (error) {
      message.error(error.message || 'Không thể tải báo cáo đại lý');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport(selectedMonth);
  }, [selectedMonth]);

  const handleMonthChange = (value) => {
    if (value) {
      setSelectedMonth(value);
    }
  };

  const handlePayout = async (record) => {
    try {
      setPayoutLoading((prev) => ({ ...prev, [record.agentId]: true }));
      const response = await adminService.payoutAgentCommission(record.agentId, {
        month: selectedMonth.format('YYYY-MM')
      });
      if (response?.success) {
        message.success('Chia hoa hồng thành công');
        await loadReport(selectedMonth);
      } else {
        message.error(response?.message || 'Không thể chia hoa hồng');
      }
    } catch (error) {
      message.error(error.message || 'Không thể chia hoa hồng');
    } finally {
      setPayoutLoading((prev) => ({ ...prev, [record.agentId]: false }));
    }
  };

  const summaryCards = useMemo(() => {
    if (!report) {
      return [];
    }
    return [
      {
        title: 'Tổng đại lý',
        value: report.totalAgents ?? 0,
        prefix: <UsergroupAddOutlined className="text-blue-400" />,
        formatter: (val) => val
      },
      {
        title: 'Tổng khách hàng',
        value: report.totalCustomers ?? 0,
        prefix: <UsergroupAddOutlined className="text-purple-400" />,
        formatter: (val) => val
      },
      {
        title: 'Tổng cược',
        value: Number(report.totalBetAmount ?? 0),
        prefix: <DollarOutlined className="text-indigo-400" />,
        formatter: formatCurrency
      },
      {
        title: 'Tổng thua',
        value: Number(report.totalLostAmount ?? 0),
        prefix: <DollarOutlined className="text-red-400" />,
        formatter: formatCurrency
      },
      {
        title: 'Hoa hồng dự kiến',
        value: Number(report.totalCalculatedCommission ?? 0),
        prefix: <DollarOutlined className="text-emerald-400" />,
        formatter: formatCurrency
      },
      {
        title: 'Đã chia',
        value: Number(report.totalPaidCommission ?? 0),
        prefix: <DollarOutlined className="text-green-400" />,
        formatter: formatCurrency
      },
      {
        title: 'Chưa chia',
        value: Number(report.totalPendingCommission ?? 0),
        prefix: <DollarOutlined className="text-orange-400" />,
        formatter: formatCurrency
      }
    ];
  }, [report]);

  const columns = [
    {
      title: 'Đại lý',
      dataIndex: 'username',
      key: 'username',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.username}</Text>
          {record.fullName && <Text type="secondary">{record.fullName}</Text>}
        </Space>
      )
    },
    {
      title: 'Mã giới thiệu',
      dataIndex: 'referralCode',
      key: 'referralCode',
      render: (value) => value || '-'
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerCount',
      key: 'customerCount',
      align: 'right'
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
      title: `Hoa hồng (${report?.agents?.[0]?.commissionRate ?? 0}%)`,
      dataIndex: 'calculatedCommissionAmount',
      key: 'calculatedCommissionAmount',
      align: 'right',
      render: (value) => formatCurrency(Number(value ?? 0))
    },
    {
      title: 'Đã chia',
      dataIndex: 'paidCommissionAmount',
      key: 'paidCommissionAmount',
      align: 'right',
      render: (value) => formatCurrency(Number(value ?? 0))
    },
    {
      title: 'Trạng thái',
      dataIndex: 'payoutStatus',
      key: 'payoutStatus',
      render: (status) => {
        if (status === 'PAID') {
          return <Tag color="green">ĐÃ CHIA</Tag>;
        }
        return <Tag color="gold">CHƯA CHIA</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Popconfirm
          title="Xác nhận chia hoa hồng?"
          description={`Chia hoa hồng tháng ${selectedMonth.format('YYYY-MM')} cho đại lý ${record.username}`}
          okText="Chia"
          cancelText="Hủy"
          onConfirm={() => handlePayout(record)}
          disabled={!record.canPayout}
        >
          <Button
            type="primary"
            disabled={!record.canPayout}
            loading={!!payoutLoading[record.agentId]}
          >
            Chia
          </Button>
        </Popconfirm>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <TabPageHeader
        title="Báo cáo đại lý"
        description="Theo dõi hoa hồng theo tháng và thực hiện chia hoa hồng cho từng đại lý"
      />

      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Space direction="vertical" size={2}>
              <Text type="secondary">Tháng báo cáo</Text>
              <DatePicker
                picker="month"
                format="YYYY-MM"
                value={selectedMonth}
                onChange={handleMonthChange}
              />
            </Space>
          </Col>
          <Col xs={24} md={16} className="flex justify-end">
            <Button
              icon={<ReloadOutlined />}
              onClick={() => loadReport(selectedMonth)}
              loading={loading}
            >
              Làm mới
            </Button>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        {summaryCards.map((item) => (
          <Col xs={24} sm={12} md={8} lg={6} xl={4} key={item.title}>
            <Card>
              <Statistic
                title={item.title}
                value={item.formatter(item.value)}
                prefix={item.prefix}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card>
        <Table
          loading={loading}
          dataSource={report?.agents || []}
          columns={columns}
          rowKey="agentId"
          pagination={{
            pageSize: 10,
            showSizeChanger: false
          }}
          locale={{
            emptyText: 'Chưa có dữ liệu đại lý cho tháng này'
          }}
        />
      </Card>
    </div>
  );
};

export default AdminAgentReport;

