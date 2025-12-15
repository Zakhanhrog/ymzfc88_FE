import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Row, Col, Form, Select, DatePicker, Button, Table, Tag, Space, Statistic, message } from 'antd';
import dayjs from 'dayjs';
import adminService from '../services/adminService';
import { formatPoints as formatPointsFromVND } from '../../../utils/helpers';

const { RangePicker } = DatePicker;

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

// Formatter cho điểm (value đã là điểm rồi, không cần chia 1000) - dùng cho BETTING
const pointFormatter = new Intl.NumberFormat('vi-VN', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

// Hàm format điểm cho BETTING (value đã là điểm rồi, không cần chia 1000)
const formatPointsDisplay = (points) => {
  if (!points && points !== 0) return '0 điểm';
  return `${pointFormatter.format(Number(points ?? 0))} điểm`;
};

// Hàm format điểm cho TRANSACTION (value là VND, cần chia 1000) - import từ helpers.js
const formatPoints = formatPointsFromVND;

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
  return {
    dateRange: null, // Không có mặc định, để thống kê hết tất cả dữ liệu
    gameType: 'all',
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
      gameType: values.gameType ?? 'all',
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
      render: (value) => formatPointsDisplay(value ?? 0),
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
            {formatPointsDisplay(fee)}
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
            {formatPointsDisplay(bao)}
          </span>
        ) : '—';
      },
    },
    {
      title: 'Thắng/Thua',
      dataIndex: 'winAmount',
      width: 140,
      align: 'right',
      render: (value, record) => {
        // Nếu trạng thái là REFUNDED thì hiển thị 0
        if (record?.status === 'REFUNDED') {
          return <span style={{ color: '#6b7280' }}>{formatPointsDisplay(0)}</span>;
        }
        
        const winAmount = Number(record?.winAmount ?? 0);
        const stake = Number(record?.stake ?? 0);
        
        // Tính Thắng/Thua = (Tiền thắng) - (Tiền cược)
        // Nếu thắng: winAmount > stake => dương (màu xanh)
        // Nếu thua: winAmount < stake => âm (màu đỏ)
        const winLoss = winAmount - stake;
        
        if (winLoss > 0) {
          return (
            <span style={{ color: '#10b981', fontWeight: 'bold' }}>
              +{formatPointsDisplay(winLoss)}
            </span>
          );
        } else if (winLoss < 0) {
          return (
            <span style={{ color: '#ef4444', fontWeight: 'bold' }}>
              {formatPointsDisplay(winLoss)}
            </span>
          );
        } else {
          return <span style={{ color: '#6b7280' }}>{formatPointsDisplay(0)}</span>;
        }
      },
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
      render: (value) => formatPoints(value ?? 0),
    },
    {
      title: 'Thực nhận',
      dataIndex: 'netAmount',
      width: 140,
      align: 'right',
      render: (value) => formatPoints(value ?? 0),
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
    {
      title: 'Người duyệt',
      dataIndex: 'processedByUsername',
      key: 'processedByUsername',
      width: 150,
      render: (username, record) => {
        if (!username) {
          return <span className="text-gray-400">-</span>;
        }
        return (
          <div>
            <div className="font-semibold">{username}</div>
            {record.processedAt && (
              <div className="text-gray-500 text-xs">{formatDateTime(record.processedAt)}</div>
            )}
          </div>
        );
      },
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
              >
                <RangePicker
                  allowClear={true}
                  className="w-full"
                  showTime={false}
                  format="DD/MM/YYYY"
                  placeholder={['Từ ngày', 'Đến ngày']}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={4}>
              <Form.Item label="Game" name="gameType">
                <Select
                  options={[
                    { label: 'Tất cả', value: 'all' },
                    { label: 'Xổ số', value: 'lottery' },
                    { label: 'Tài Xỉu', value: 'sicbo' },
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

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6} xl={4}>
          <Card style={{ minHeight: '100px', textAlign: 'center' }}>
            <Statistic
              title={<span style={{ fontSize: '12px', lineHeight: '1.2', display: 'block' }}>Tổng tiền cược</span>}
              value={formatPointsDisplay(betSummary.totalStake ?? 0)}
              valueStyle={{ fontSize: '14px', lineHeight: '1.2', wordBreak: 'break-word', textAlign: 'center' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6} xl={4}>
          <Card style={{ minHeight: '100px', textAlign: 'center' }}>
            <Statistic
              title={<span style={{ fontSize: '12px', lineHeight: '1.2', display: 'block' }}>Tổng tiền thắng</span>}
              value={formatPointsDisplay(betSummary.totalWinAmount ?? 0)}
              valueStyle={{ color: '#16a34a', fontSize: '14px', lineHeight: '1.2', wordBreak: 'break-word', textAlign: 'center' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6} xl={4}>
          <Card style={{ minHeight: '100px', textAlign: 'center' }}>
            <Statistic
              title={<span style={{ fontSize: '12px', lineHeight: '1.2', display: 'block' }}>Tổng tiền thua</span>}
              value={formatPointsDisplay(betSummary.totalLostAmount ?? 0)}
              valueStyle={{ color: '#dc2626', fontSize: '14px', lineHeight: '1.2', wordBreak: 'break-word', textAlign: 'center' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6} xl={4}>
          <Card style={{ minHeight: '100px', textAlign: 'center' }}>
            <Statistic
              title={<span style={{ fontSize: '12px', lineHeight: '1.2', display: 'block' }}>Doanh thu</span>}
              value={formatPointsDisplay(
                Number(betSummary.totalWinAmount ?? 0) - Number(betSummary.totalLostAmount ?? 0)
              )}
              valueStyle={{ color: '#f97316', fontSize: '14px', lineHeight: '1.2', wordBreak: 'break-word', textAlign: 'center' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6} xl={4}>
          <Card style={{ minHeight: '100px', textAlign: 'center' }}>
            <Statistic
              title={<span style={{ fontSize: '12px', lineHeight: '1.2', display: 'block' }}>Lợi nhuận</span>}
              value={formatPointsDisplay(
                (() => {
                  // Doanh thu = Tổng tiền thắng - Tổng tiền thua
                  const doanhThu = Number(betSummary.totalWinAmount ?? 0) - Number(betSummary.totalLostAmount ?? 0);
                  
                  // Công thức: Lợi nhuận = Doanh thu - (Hoàn trả + Khuyến mãi + Hoàn Thua + Hoa hồng)
                  const totalRefund = Number(betSummary.totalRefund ?? 0); // Hoàn trả
                  const totalPromotionalMoney = Number(betSummary.totalPromotionalMoney ?? 0); // Khuyến mãi
                  const totalDailyLossRefund = Number(betSummary.totalDailyLossRefund ?? 0); // Hoàn Thua
                  const totalAgentCommission = Number(betSummary.totalAgentCommission ?? 0); // Hoa hồng
                  
                  // Lợi nhuận = Doanh thu - (Hoàn trả + Khuyến mãi + Hoàn Thua + Hoa hồng)
                  return doanhThu - totalRefund - totalPromotionalMoney - totalDailyLossRefund - totalAgentCommission;
                })()
              )}
              valueStyle={{ color: '#059669', fontSize: '14px', lineHeight: '1.2', wordBreak: 'break-word', textAlign: 'center' }}
            />
          </Card>
        </Col>
        {filters.gameType === 'all' ? (
          <>
            <Col xs={24} sm={12} lg={6} xl={4}>
              <Card style={{ minHeight: '100px', textAlign: 'center' }}>
                <Statistic
                  title={<span style={{ fontSize: '12px', lineHeight: '1.2', display: 'block' }}>Tài Xỉu Thu Phế</span>}
                  value={formatPointsDisplay(betSummary.sicboTotalFee ?? 0)}
                  valueStyle={{ color: '#9333ea', fontSize: '14px', lineHeight: '1.2', wordBreak: 'break-word', textAlign: 'center' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6} xl={4}>
              <Card style={{ minHeight: '100px', textAlign: 'center' }}>
                <Statistic
                  title={<span style={{ fontSize: '12px', lineHeight: '1.2', display: 'block' }}>Xóc Đĩa Thu Phế</span>}
                  value={formatPointsDisplay(betSummary.xocDiaTotalFee ?? 0)}
                  valueStyle={{ color: '#9333ea', fontSize: '14px', lineHeight: '1.2', wordBreak: 'break-word', textAlign: 'center' }}
                />
              </Card>
            </Col>
          </>
        ) : (
          <Col xs={24} sm={12} lg={6} xl={4}>
            <Card style={{ minHeight: '100px', textAlign: 'center' }}>
              <Statistic
                title={<span style={{ fontSize: '12px', lineHeight: '1.2', display: 'block' }}>{filters.gameType === 'xocdia' ? 'Xóc Đĩa Thu Phế' : 'Tài Xỉu Thu Phế'}</span>}
                value={formatPointsDisplay(betSummary.totalFee ?? 0)}
                valueStyle={{ color: '#9333ea', fontSize: '14px', lineHeight: '1.2', wordBreak: 'break-word', textAlign: 'center' }}
              />
            </Card>
          </Col>
        )}
        <Col xs={24} sm={12} lg={6} xl={4}>
          <Card style={{ minHeight: '100px', textAlign: 'center' }}>
            <Statistic
              title={<span style={{ fontSize: '12px', lineHeight: '1.2', display: 'block' }}>Tài Xỉu Thu Bão</span>}
              value={formatPointsDisplay(betSummary.totalBao ?? 0)}
              valueStyle={{ color: '#dc2626', fontSize: '14px', lineHeight: '1.2', wordBreak: 'break-word', textAlign: 'center' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6} xl={4}>
          <Card style={{ minHeight: '100px', textAlign: 'center' }}>
            <Statistic
              title={<span style={{ fontSize: '12px', lineHeight: '1.2', display: 'block' }}>Hoàn trả</span>}
              value={formatPointsDisplay(betSummary.totalRefund ?? 0)}
              valueStyle={{ color: '#3b82f6', fontSize: '14px', lineHeight: '1.2', wordBreak: 'break-word', textAlign: 'center' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6} xl={4}>
          <Card style={{ minHeight: '100px', textAlign: 'center' }}>
            <Statistic
              title={<span style={{ fontSize: '12px', lineHeight: '1.2', display: 'block' }}>Hoàn thua theo ngày</span>}
              value={formatPointsDisplay(betSummary.totalDailyLossRefund ?? 0)}
              valueStyle={{ color: '#8b5cf6', fontSize: '14px', lineHeight: '1.2', wordBreak: 'break-word', textAlign: 'center' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6} xl={4}>
          <Card style={{ minHeight: '100px', textAlign: 'center' }}>
            <Statistic
              title={<span style={{ fontSize: '12px', lineHeight: '1.2', display: 'block' }}>Hoa hồng đại lý</span>}
              value={formatPointsDisplay(betSummary.totalAgentCommission ?? 0)}
              valueStyle={{ color: '#f59e0b', fontSize: '14px', lineHeight: '1.2', wordBreak: 'break-word', textAlign: 'center' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6} xl={4}>
          <Card style={{ minHeight: '100px', textAlign: 'center' }}>
            <Statistic
              title={<span style={{ fontSize: '12px', lineHeight: '1.2', display: 'block' }}>Khuyến mãi</span>}
              value={formatPointsDisplay(betSummary.totalPromotionalMoney ?? 0)}
              valueStyle={{ color: '#10b981', fontSize: '14px', lineHeight: '1.2', wordBreak: 'break-word', textAlign: 'center' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6} xl={4}>
          <Card style={{ minHeight: '100px', textAlign: 'center' }}>
            <Statistic
              title={<span style={{ fontSize: '12px', lineHeight: '1.2', display: 'block' }}>Thắng/Thua XS</span>}
              value={formatPointsDisplay(
                Number(betSummary.lotteryWinAmount ?? 0) - Number(betSummary.lotteryLostAmount ?? 0)
              )}
              valueStyle={{ 
                color: (Number(betSummary.lotteryWinAmount ?? 0) - Number(betSummary.lotteryLostAmount ?? 0)) >= 0 ? '#16a34a' : '#dc2626', 
                fontSize: '14px', 
                lineHeight: '1.2', 
                wordBreak: 'break-word', 
                textAlign: 'center' 
              }}
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
          <Card style={{ minHeight: '100px', textAlign: 'center' }}>
            <Statistic
              title={<span style={{ fontSize: '12px', lineHeight: '1.2', display: 'block' }}>Tổng số giao dịch</span>}
              value={numberFormatter.format(Number(transactionSummary.totalCount ?? 0))}
              valueStyle={{ fontSize: '14px', lineHeight: '1.2', wordBreak: 'break-word', textAlign: 'center' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card style={{ minHeight: '100px', textAlign: 'center' }}>
            <Statistic
              title={<span style={{ fontSize: '12px', lineHeight: '1.2', display: 'block' }}>Tổng số tiền giao dịch</span>}
              value={formatPoints(transactionSummary.totalAmount ?? 0)}
              valueStyle={{ fontSize: '14px', lineHeight: '1.2', wordBreak: 'break-word', textAlign: 'center' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card style={{ minHeight: '100px', textAlign: 'center' }}>
            <Statistic
              title={<span style={{ fontSize: '12px', lineHeight: '1.2', display: 'block' }}>Tổng thực nhận</span>}
              value={formatPoints(transactionSummary.totalNetAmount ?? 0)}
              valueStyle={{ color: '#2563eb', fontSize: '14px', lineHeight: '1.2', wordBreak: 'break-word', textAlign: 'center' }}
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
          scroll={{ x: 1300 }}
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


