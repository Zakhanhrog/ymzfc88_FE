import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Row, Col, Form, Select, DatePicker, Button, Table, Tag, Space, Statistic, message } from 'antd';
import dayjs from 'dayjs';
import adminService from '../services/adminService';

const { RangePicker } = DatePicker;

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('vi-VN');

const PAYMENT_TYPE_LABELS = {
  DEPOSIT: 'Nạp tiền',
  WITHDRAW: 'Rút tiền',
  BONUS: 'Thưởng',
  REFUND: 'Hoàn tiền',
  ADJUSTMENT: 'Điều chỉnh',
};

const TRANSACTION_STATUS_COLORS = {
  PENDING: 'default',
  APPROVED: 'blue',
  COMPLETED: 'green',
  REJECTED: 'red',
  CANCELLED: 'orange',
  FAILED: 'red',
};

const BET_STATUS_COLORS = {
  PENDING: 'default',
  WON: 'green',
  LOST: 'red',
  CANCELLED: 'orange',
};

const DEFAULT_PAGE_SIZE = 20;

const buildDefaultFilters = () => {
  const end = dayjs().endOf('day');
  const start = dayjs().subtract(6, 'day').startOf('day');
  return {
    dateRange: [start, end],
    gameType: 'lottery',
    betStatus: 'all',
    transactionType: 'all',
    transactionStatus: 'all',
  };
};

const formatDateTime = (value) => {
  if (!value) {
    return '';
  }
  return dayjs(value).format('HH:mm DD/MM/YYYY');
};

const AdminAnalyticsDashboard = () => {
  const [filters, setFilters] = useState(buildDefaultFilters);
  const [betPagination, setBetPagination] = useState({ current: 1, pageSize: DEFAULT_PAGE_SIZE, total: 0 });
  const [txnPagination, setTxnPagination] = useState({ current: 1, pageSize: DEFAULT_PAGE_SIZE, total: 0 });
  const [betData, setBetData] = useState([]);
  const [betSummary, setBetSummary] = useState({});
  const [transactionData, setTransactionData] = useState([]);
  const [transactionSummary, setTransactionSummary] = useState({});
  const [betLoading, setBetLoading] = useState(false);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      dateRange: filters.dateRange,
      gameType: filters.gameType,
      betStatus: filters.betStatus,
      transactionType: filters.transactionType,
      transactionStatus: filters.transactionStatus,
    });
  }, [filters, form]);

  const dateRangeKey = useMemo(() => {
    if (!filters.dateRange) {
      return '';
    }
    return filters.dateRange.map((item) => (item ? item.toISOString() : '')).join('|');
  }, [filters.dateRange]);

  const fetchBetAnalytics = useCallback(async () => {
    setBetLoading(true);
    try {
      const [startDate, endDate] = filters.dateRange || [];
      const response = await adminService.getBetAnalytics({
        gameType: filters.gameType,
        status: filters.betStatus,
        startDate: startDate ? startDate.startOf('day').toISOString() : undefined,
        endDate: endDate ? endDate.endOf('day').toISOString() : undefined,
        page: betPagination.current - 1,
        size: betPagination.pageSize,
      });
      const payload = response?.data;
      setBetData(payload?.items ?? []);
      setBetSummary(payload?.summary ?? {});
      setBetPagination((prev) => ({
        ...prev,
        total: payload?.totalItems ?? 0,
      }));
    } catch (error) {
      message.error(error.message || 'Không thể tải báo cáo cược');
    } finally {
      setBetLoading(false);
    }
  }, [filters.gameType, filters.betStatus, filters.dateRange, betPagination.current, betPagination.pageSize]);

  const fetchTransactionAnalytics = useCallback(async () => {
    setTransactionLoading(true);
    try {
      const [startDate, endDate] = filters.dateRange || [];
      const response = await adminService.getTransactionAnalytics({
        type: filters.transactionType,
        status: filters.transactionStatus,
        startDate: startDate ? startDate.startOf('day').toISOString() : undefined,
        endDate: endDate ? endDate.endOf('day').toISOString() : undefined,
        page: txnPagination.current - 1,
        size: txnPagination.pageSize,
      });
      const payload = response?.data;
      setTransactionData(payload?.items ?? []);
      setTransactionSummary(payload?.summary ?? {});
      setTxnPagination((prev) => ({
        ...prev,
        total: payload?.totalItems ?? 0,
      }));
    } catch (error) {
      message.error(error.message || 'Không thể tải báo cáo nạp rút');
    } finally {
      setTransactionLoading(false);
    }
  }, [filters.transactionType, filters.transactionStatus, filters.dateRange, txnPagination.current, txnPagination.pageSize]);

  useEffect(() => {
    fetchBetAnalytics();
  }, [fetchBetAnalytics, dateRangeKey]);

  useEffect(() => {
    fetchTransactionAnalytics();
  }, [fetchTransactionAnalytics, dateRangeKey]);

  const handleFilterSubmit = (values) => {
    const nextFilters = {
      dateRange: values.dateRange ?? null,
      gameType: values.gameType ?? 'lottery',
      betStatus: values.betStatus ?? 'all',
      transactionType: values.transactionType ?? 'all',
      transactionStatus: values.transactionStatus ?? 'all',
    };
    setFilters(nextFilters);
    setBetPagination((prev) => ({ ...prev, current: 1 }));
    setTxnPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleResetFilters = () => {
    const defaults = buildDefaultFilters();
    setFilters(defaults);
    setBetPagination({ current: 1, pageSize: DEFAULT_PAGE_SIZE, total: 0 });
    setTxnPagination({ current: 1, pageSize: DEFAULT_PAGE_SIZE, total: 0 });
  };

  const handleBetTableChange = (pagination) => {
    setBetPagination((prev) => ({
      ...prev,
      current: pagination.current ?? 1,
      pageSize: pagination.pageSize ?? prev.pageSize,
    }));
  };

  const handleTransactionTableChange = (pagination) => {
    setTxnPagination((prev) => ({
      ...prev,
      current: pagination.current ?? 1,
      pageSize: pagination.pageSize ?? prev.pageSize,
    }));
  };

  const betColumns = [
    {
      title: 'Mã',
      dataIndex: 'id',
      width: 90,
      render: (value) => `#${value}`,
    },
    {
      title: 'Game',
      dataIndex: 'gameType',
      width: 110,
    },
    {
      title: 'Người chơi',
      dataIndex: 'username',
      width: 140,
    },
    {
      title: 'Mã cược',
      dataIndex: 'betCode',
      width: 160,
      ellipsis: true,
    },
    {
      title: 'Bàn',
      dataIndex: 'tableNumber',
      width: 80,
      align: 'center',
      render: (value) => value != null ? `Bàn ${value}` : '—',
    },
    {
      title: 'Tiền cược',
      dataIndex: 'stake',
      width: 140,
      align: 'right',
      render: (value) => currencyFormatter.format(Number(value ?? 0)),
    },
    {
      title: 'Phế',
      dataIndex: 'feeAmount',
      width: 110,
      align: 'right',
      render: (value) => {
        const fee = Number(value ?? 0);
        return fee > 0 ? (
          <span style={{ color: '#9333ea' }}>
            {currencyFormatter.format(fee)}
          </span>
        ) : '—';
      },
    },
    {
      title: 'Bão',
      dataIndex: 'baoAmount',
      width: 110,
      align: 'right',
      render: (value) => {
        const bao = Number(value ?? 0);
        return bao > 0 ? (
          <span style={{ color: '#dc2626', fontWeight: 'bold' }}>
            {currencyFormatter.format(bao)}
          </span>
        ) : '—';
      },
    },
    {
      title: 'Thắng',
      dataIndex: 'winAmount',
      width: 140,
      align: 'right',
      render: (value) => currencyFormatter.format(Number(value ?? 0)),
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      width: 140,
      align: 'right',
      render: (value) => currencyFormatter.format(Number(value ?? 0)),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 120,
      render: (value) => (
        <Tag color={BET_STATUS_COLORS[value] ?? 'default'}>
          {value}
        </Tag>
      ),
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'createdAt',
      width: 180,
      render: (value) => formatDateTime(value),
    },
    {
      title: 'Thời gian kết toán',
      dataIndex: 'settledAt',
      width: 180,
      render: (value) => formatDateTime(value),
    },
  ];

  const transactionColumns = [
    {
      title: 'Mã GD',
      dataIndex: 'transactionCode',
      width: 140,
      ellipsis: true,
    },
    {
      title: 'Người dùng',
      dataIndex: 'username',
      width: 140,
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      width: 120,
      render: (value) => PAYMENT_TYPE_LABELS[value] ?? value,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 120,
      render: (value) => (
        <Tag color={TRANSACTION_STATUS_COLORS[value] ?? 'default'}>
          {value}
        </Tag>
      ),
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      width: 140,
      align: 'right',
      render: (value) => currencyFormatter.format(Number(value ?? 0)),
    },
    {
      title: 'Thực nhận',
      dataIndex: 'netAmount',
      width: 140,
      align: 'right',
      render: (value) => currencyFormatter.format(Number(value ?? 0)),
    },
    {
      title: 'Phương thức',
      dataIndex: 'paymentMethod',
      width: 160,
      ellipsis: true,
    },
    {
      title: 'Tạo lúc',
      dataIndex: 'createdAt',
      width: 180,
      render: (value) => formatDateTime(value),
    },
    {
      title: 'Xử lý lúc',
      dataIndex: 'processedAt',
      width: 180,
      render: (value) => formatDateTime(value),
    },
  ];

  return (
    <Space direction="vertical" size={16} className="w-full">
      <Card>
        <Form layout="vertical" form={form} onFinish={handleFilterSubmit}>
          <Row gutter={16}>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Khoảng thời gian"
                name="dateRange"
                rules={[{ required: true, message: 'Vui lòng chọn khoảng thời gian' }]}
              >
                <RangePicker
                  allowClear={false}
                  className="w-full"
                  showTime={false}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={4}>
              <Form.Item label="Game" name="gameType">
                <Select
                  options={[
                    { label: 'Xổ số', value: 'lottery' },
                    { label: 'Sicbo', value: 'sicbo' },
                    { label: 'Xóc Đĩa', value: 'xocdia' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={4}>
              <Form.Item label="Trạng thái cược" name="betStatus">
                <Select
                  options={[
                    { label: 'Tất cả', value: 'all' },
                    { label: 'Đang chờ', value: 'PENDING' },
                    { label: 'Thắng', value: 'WON' },
                    { label: 'Thua', value: 'LOST' },
                    { label: 'Hủy', value: 'CANCELLED' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={4}>
              <Form.Item label="Loại giao dịch" name="transactionType">
                <Select
                  options={[
                    { label: 'Tất cả', value: 'all' },
                    { label: 'Nạp tiền', value: 'DEPOSIT' },
                    { label: 'Rút tiền', value: 'WITHDRAW' },
                    { label: 'Thưởng', value: 'BONUS' },
                    { label: 'Hoàn tiền', value: 'REFUND' },
                    { label: 'Điều chỉnh', value: 'ADJUSTMENT' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={4}>
              <Form.Item label="Trạng thái giao dịch" name="transactionStatus">
                <Select
                  options={[
                    { label: 'Tất cả', value: 'all' },
                    { label: 'Đang chờ', value: 'PENDING' },
                    { label: 'Đã duyệt', value: 'APPROVED' },
                    { label: 'Hoàn thành', value: 'COMPLETED' },
                    { label: 'Từ chối', value: 'REJECTED' },
                    { label: 'Hủy', value: 'CANCELLED' },
                    { label: 'Thất bại', value: 'FAILED' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end" gutter={8}>
            <Col>
              <Button onClick={handleResetFilters}>Đặt lại</Button>
            </Col>
            <Col>
              <Button type="primary" htmlType="submit">
                Lọc dữ liệu
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <Row gutter={16}>
        <Col xs={24} lg={4} md={8}>
          <Card>
            <Statistic
              title="Tổng tiền cược"
              value={currencyFormatter.format(Number(betSummary.totalStake ?? 0))}
            />
          </Card>
        </Col>
        <Col xs={24} lg={4} md={8}>
          <Card>
            <Statistic
              title="Tổng tiền thắng"
              value={currencyFormatter.format(Number(betSummary.totalWinAmount ?? 0))}
              valueStyle={{ color: '#16a34a' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={4} md={8}>
          <Card>
            <Statistic
              title="Doanh thu"
              value={currencyFormatter.format(
                Number(betSummary.totalLostAmount ?? 0) + 
                Number(betSummary.totalFee ?? 0)
              )}
              valueStyle={{ color: '#f97316' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={4} md={8}>
          <Card>
            <Statistic
              title={filters.gameType === 'xocdia' ? 'Xóc Đĩa Thu Phế' : 'Tài Xỉu Thu Phế'}
              value={currencyFormatter.format(Number(betSummary.totalFee ?? 0))}
              valueStyle={{ color: '#9333ea' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={4} md={8}>
          <Card>
            <Statistic
              title="Tài Xỉu Thu Bão"
              value={currencyFormatter.format(Number(betSummary.totalBao ?? 0))}
              valueStyle={{ color: '#dc2626' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={4} md={8}>
          <Card>
            <Statistic
              title="Tổng lợi nhuận"
              value={currencyFormatter.format(
                Number(betSummary.totalLostAmount ?? 0) + 
                Number(betSummary.totalFee ?? 0) - 
                Number(betSummary.totalWinAmount ?? 0)
              )}
              valueStyle={{ color: '#059669' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Báo cáo cược">
        <Table
          rowKey={(record) => `${record.gameType}-${record.id}`}
          dataSource={betData}
          columns={betColumns}
          loading={betLoading}
          scroll={{ x: 1100 }}
          pagination={{
            current: betPagination.current,
            pageSize: betPagination.pageSize,
            total: betPagination.total,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total) => `${numberFormatter.format(total)} bản ghi`,
          }}
          onChange={handleBetTableChange}
        />
      </Card>

      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Tổng số giao dịch"
              value={numberFormatter.format(Number(transactionSummary.totalCount ?? 0))}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Tổng số tiền giao dịch"
              value={currencyFormatter.format(Number(transactionSummary.totalAmount ?? 0))}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Tổng thực nhận"
              value={currencyFormatter.format(Number(transactionSummary.totalNetAmount ?? 0))}
              valueStyle={{ color: '#2563eb' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Báo cáo nạp / rút / điều chỉnh">
        <Table
          rowKey={(record) => record.id}
          dataSource={transactionData}
          columns={transactionColumns}
          loading={transactionLoading}
          scroll={{ x: 1100 }}
          pagination={{
            current: txnPagination.current,
            pageSize: txnPagination.pageSize,
            total: txnPagination.total,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total) => `${numberFormatter.format(total)} bản ghi`,
          }}
          onChange={handleTransactionTableChange}
        />
      </Card>
    </Space>
  );
};

export default AdminAnalyticsDashboard;


