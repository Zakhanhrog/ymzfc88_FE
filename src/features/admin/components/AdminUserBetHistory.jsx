import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Drawer,
  Input,
  message,
  Pagination,
  Row,
  Col,
  Select,
  Space,
  Statistic,
  Table,
  DatePicker,
  Form
} from 'antd';
import { BarChartOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { adminService } from '../services/adminService';
import { formatPointsDisplay, formatPoints } from '../../../utils/helpers';

const { RangePicker } = DatePicker;

const DEFAULT_PAGE_SIZE = 20;
const DETAIL_PAGE_SIZE_OPTIONS = [10, 20, 50];

const gameTypeOptions = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Xổ số', value: 'lottery' },
  { label: 'Sicbo', value: 'sicbo' },
  { label: 'Xóc Đĩa', value: 'xocdia' }
];

const AdminUserBetHistory = () => {
  const [form] = Form.useForm();
  const [searchInput, setSearchInput] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [agentCode, setAgentCode] = useState('');
  const [summaryData, setSummaryData] = useState([]);
  const [summaryPage, setSummaryPage] = useState(0);
  const [summarySize, setSummarySize] = useState(DEFAULT_PAGE_SIZE);
  const [summaryTotal, setSummaryTotal] = useState(0);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [detailVisible, setDetailVisible] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState([]);
  const [detailMeta, setDetailMeta] = useState({ page: 0, size: DEFAULT_PAGE_SIZE, total: 0, hasMore: false });
  const [detailFilters, setDetailFilters] = useState({ gameType: 'all' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailSummary, setDetailSummary] = useState(null);

  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const [startDate, endDate] = dateRange || [];
      const response = await adminService.getUserBetSummary({
        search: searchValue,
        agentCode: agentCode || undefined,
        startDate: startDate ? startDate.startOf('day').toISOString() : undefined,
        endDate: endDate ? endDate.endOf('day').toISOString() : undefined,
        page: summaryPage,
        size: summarySize
      });
      if (response?.success) {
        const payload = response.data || {};
        setSummaryData(payload.items || []);
        setSummaryTotal(payload.totalItems || 0);
      } else {
        throw new Error(response?.message || 'Không thể tải dữ liệu');
      }
    } catch (error) {
      message.error(error.message || 'Không thể tải thống kê cược người dùng');
    } finally {
      setSummaryLoading(false);
    }
  }, [searchValue, dateRange, agentCode, summaryPage, summarySize]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const handleSearch = () => {
    setSummaryPage(0);
    setSearchValue(searchInput.trim());
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setDateRange(null);
    setAgentCode('');
    setSummaryPage(0);
    setSearchValue('');
    form.resetFields();
  };

  const handleDetailClose = () => {
    setDetailVisible(false);
    setSelectedUser(null);
    setDetailData([]);
    setDetailMeta({ page: 0, size: DEFAULT_PAGE_SIZE, total: 0, hasMore: false });
  };

  const fetchDetail = useCallback(
    async ({ userId, page = 0, size = DEFAULT_PAGE_SIZE, gameType = detailFilters.gameType || 'all' }) => {
      if (!userId) {
        return;
      }
      setDetailLoading(true);
      try {
        const response = await adminService.getUserBetDetail({
          userId,
          gameType,
          page,
          size
        });
        if (response?.success) {
          const payload = response.data || {};
          setDetailData(payload.items || []);
          setDetailMeta({
            page: payload.page || 0,
            size: payload.size || size,
            total: payload.totalItems || 0,
            hasMore: payload.hasMore || false
          });
          setDetailSummary(payload);
        } else {
          throw new Error(response?.message || 'Không thể tải chi tiết cược');
        }
      } catch (error) {
        message.error(error.message || 'Không thể tải chi tiết cược người dùng');
      } finally {
        setDetailLoading(false);
      }
    },
    [detailFilters.gameType]
  );

  const openDetail = (record) => {
    setSelectedUser(record);
    setDetailFilters({ gameType: 'all' });
    setDetailVisible(true);
    fetchDetail({ userId: record.userId, page: 0, size: DEFAULT_PAGE_SIZE, gameType: 'all' });
  };

  const summaryColumns = useMemo(
    () => [
      {
        title: 'Tên tài khoản',
        dataIndex: 'username',
        key: 'username',
        render: (value, record) => (
          <div>
            <strong>{value}</strong>
            <div className="text-sm text-gray-500">{record.fullName || '--'}</div>
          </div>
        )
      },
      {
        title: 'Tổng cược',
        dataIndex: 'totalStakeAmount',
        key: 'totalStakeAmount',
        align: 'right',
        render: (value) => formatPointsDisplay(Number(value ?? 0))
      },
      {
        title: 'Tổng Thắng',
        dataIndex: 'totalWinAmount',
        key: 'totalWinAmount',
        align: 'right',
        render: (value) => {
          const win = Number(value ?? 0);
          return (
            <span style={{ color: '#10b981', fontWeight: 'bold' }}>
              {formatPointsDisplay(win)}
            </span>
          );
        }
      },
      {
        title: 'Tổng Thua',
        dataIndex: 'totalLossAmount',
        key: 'totalLossAmount',
        align: 'right',
        render: (value) => {
          const loss = Number(value ?? 0);
          return (
            <span style={{ color: '#ef4444', fontWeight: 'bold' }}>
              {formatPointsDisplay(loss)}
            </span>
          );
        }
      },
      {
        title: 'Tổng thắng/thua',
        key: 'netWinLoss',
        align: 'right',
        render: (_, record) => {
          const win = Number(record.totalWinAmount ?? 0);
          const loss = Number(record.totalLossAmount ?? 0);
          const net = win - loss;
          return (
            <span
              style={{
                color: net >= 0 ? '#10b981' : '#ef4444',
                fontWeight: 'bold'
              }}
            >
              {formatPointsDisplay(net)}
            </span>
          );
        }
      },
      {
        title: 'Tổng Nạp',
        dataIndex: 'totalDepositAmount',
        key: 'totalDepositAmount',
        align: 'right',
        render: (value) => formatPoints(Number(value ?? 0)) // VND, cần chia 1000
      },
      {
        title: 'Tổng Rút',
        dataIndex: 'totalWithdrawAmount',
        key: 'totalWithdrawAmount',
        align: 'right',
        render: (value) => formatPoints(Number(value ?? 0)) // VND, cần chia 1000
      },
      {
        title: 'Số dư điểm',
        dataIndex: 'currentBalance',
        key: 'currentBalance',
        align: 'right',
        render: (value) => {
          // currentBalance is already in points, just format it
          return formatPointsDisplay(value);
        }
      },
      {
        title: 'IP',
        dataIndex: 'firstLoginIp',
        key: 'firstLoginIp',
        render: (value) => value || '-'
      },
      {
        title: 'Thao tác',
        key: 'actions',
        render: (_, record) => (
          <Button type="primary" icon={<BarChartOutlined />} onClick={() => openDetail(record)}>
            Chi tiết
          </Button>
        )
      }
    ],
    []
  );

  const detailColumns = useMemo(
    () => [
      {
        title: 'Thời gian',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (value) => (value ? dayjs(value).format('DD/MM/YYYY HH:mm:ss') : '--'),
        width: 180
      },
      {
        title: 'Game',
        dataIndex: 'gameType',
        key: 'gameType',
        render: (value) => {
          switch ((value || '').toUpperCase()) {
            case 'SICBO':
              return 'Sicbo';
            case 'XOCDIA':
              return 'Xóc Đĩa';
            case 'LOTTERY':
              return 'Xổ số';
            default:
              return value || '--';
          }
        },
        width: 110
      },
      {
        title: 'Mã cược',
        dataIndex: 'betCode',
        key: 'betCode',
        width: 140,
        ellipsis: true
      },
      {
        title: 'Mô tả',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true
      },
      {
        title: 'Tiền cược',
        dataIndex: 'stakeAmount',
        key: 'stakeAmount',
        width: 140,
        render: (value) => formatPointsDisplay(Number(value ?? 0))
      },
      {
        title: 'Tiền thắng',
        dataIndex: 'winAmount',
        key: 'winAmount',
        width: 140,
        render: (value) => formatPointsDisplay(Number(value ?? 0))
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        width: 120
      },
      {
        title: 'Kết quả',
        dataIndex: 'resultCode',
        key: 'resultCode',
        width: 150,
        ellipsis: true
      }
    ],
    []
  );

  const detailSummaryCards = useMemo(() => {
    if (!detailSummary) {
      return null;
    }
    const totalStake = Number(detailSummary.totalStakeAmount ?? 0);
    const totalWin = Number(detailSummary.totalWinAmount ?? 0); // Đã là lãi, không tính gốc
    const totalLoss = Number(detailSummary.totalLossAmount ?? 0);
    const totalDeposit = Number(detailSummary.totalDepositAmount ?? 0);
    const totalWithdraw = Number(detailSummary.totalWithdrawAmount ?? 0);
    const totalRefund = Number(detailSummary.totalRefundAmount ?? 0);
    const totalDailyLossRefund = Number(detailSummary.totalDailyLossRefundAmount ?? 0);
    const totalPromotionalMoney = Number(detailSummary.totalPromotionalMoneyAmount ?? 0);
    const net = totalWin - totalLoss;
    
    const cards = [
      {
        title: 'Tổng nạp',
        value: formatPoints(totalDeposit) // VND, cần chia 1000
      },
      {
        title: 'Tổng rút',
        value: formatPoints(totalWithdraw) // VND, cần chia 1000
      },
      {
        title: 'Tổng cược',
        value: formatPointsDisplay(totalStake)
      },
      {
        title: 'Tổng thắng',
        value: formatPointsDisplay(totalWin),
        valueStyle: { color: '#16a34a' }
      },
      {
        title: 'Tổng thua',
        value: formatPointsDisplay(totalLoss),
        valueStyle: { color: '#dc2626' }
      },
      {
        title: 'Thắng/Thua',
        value: formatPointsDisplay(net),
        valueStyle: { color: net >= 0 ? '#16a34a' : '#dc2626', fontWeight: 'bold' }
      },
      {
        title: 'Hoàn trả',
        value: formatPointsDisplay(totalRefund),
        valueStyle: { color: '#f59e0b' }
      },
      {
        title: 'Hoàn thua theo ngày',
        value: formatPointsDisplay(totalDailyLossRefund),
        valueStyle: { color: '#8b5cf6' }
      },
      {
        title: 'Khuyến mại',
        value: formatPointsDisplay(totalPromotionalMoney),
        valueStyle: { color: '#06b6d4' }
      }
    ];
    return (
      <Row gutter={16} className="mb-4">
        {cards.map((card) => (
          <Col xs={12} md={8} lg={6} key={card.title}>
            <Card bordered={false}>
              <Statistic title={card.title} value={card.value} valueStyle={card.valueStyle} />
            </Card>
          </Col>
        ))}
      </Row>
    );
  }, [detailSummary]);

  return (
    <div className="space-y-4">
      <Card>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} md={8} lg={6}>
              <Form.Item label="Tìm theo tài khoản/tên">
                <Input
                  placeholder="Tài khoản / tên"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onPressEnter={handleSearch}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8} lg={6}>
              <Form.Item label="Mã đại lý">
                <Input
                  placeholder="Mã đại lý"
                  value={agentCode}
                  onChange={(e) => setAgentCode(e.target.value)}
                  onPressEnter={handleSearch}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8} lg={8}>
              <Form.Item label="Khoảng thời gian">
                <RangePicker
                  className="w-full"
                  value={dateRange}
                  onChange={(dates) => setDateRange(dates)}
                  format="DD/MM/YYYY"
                  placeholder={['Từ ngày', 'Đến ngày']}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={4} className="flex items-end">
              <Space>
                <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                  Tìm kiếm
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleResetFilters}>
                  Đặt lại
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card>
        <Table
          rowKey="userId"
          columns={summaryColumns}
          dataSource={summaryData}
          loading={summaryLoading}
          pagination={{
            current: summaryPage + 1,
            pageSize: summarySize,
            total: summaryTotal,
            showSizeChanger: true,
            onChange: (page, pageSize) => {
              setSummaryPage(page - 1);
              setSummarySize(pageSize);
            }
          }}
        />
      </Card>

      <Drawer
        title={
          selectedUser ? `Chi tiết cược - ${selectedUser.username}` : 'Chi tiết cược người dùng'
        }
        width={1100}
        open={detailVisible}
        onClose={handleDetailClose}
        destroyOnClose
        extra={
          <Space>
            <Select
              style={{ width: 180 }}
              value={detailFilters.gameType}
              options={gameTypeOptions}
              onChange={(value) => {
                setDetailFilters((prev) => ({ ...prev, gameType: value }));
                if (selectedUser) {
                  fetchDetail({ userId: selectedUser.userId, page: 0, size: detailMeta.size, gameType: value });
                }
              }}
            />
          </Space>
        }
      >
        <Alert
          type="info"
          showIcon
          message="Danh sách thể hiện toàn bộ lệnh cược của người dùng theo thời gian gần nhất."
          className="mb-4"
        />

        {detailSummaryCards}

        <Table
          rowKey={(record, index) => `${record.id || index}-${record.gameType}`}
          columns={detailColumns}
          dataSource={detailData}
          loading={detailLoading}
          pagination={false}
          scroll={{ x: 900 }}
        />

        <div className="mt-4 flex justify-end">
          <Pagination
            current={detailMeta.page + 1}
            pageSize={detailMeta.size}
            total={detailMeta.total}
            showSizeChanger
            pageSizeOptions={DETAIL_PAGE_SIZE_OPTIONS.map(String)}
            onChange={(page, pageSize) => {
              if (selectedUser) {
                fetchDetail({
                  userId: selectedUser.userId,
                  page: page - 1,
                  size: pageSize,
                  gameType: detailFilters.gameType
                });
              }
            }}
          />
        </div>
      </Drawer>
    </div>
  );
};

export default AdminUserBetHistory;


