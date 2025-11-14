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
  Table
} from 'antd';
import { BarChartOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { adminService } from '../services/adminService';
import { formatCurrency } from '../../../utils/helpers';

const DEFAULT_PAGE_SIZE = 20;
const DETAIL_PAGE_SIZE_OPTIONS = [10, 20, 50];

const gameTypeOptions = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Xổ số', value: 'lottery' },
  { label: 'Sicbo', value: 'sicbo' },
  { label: 'Xóc Đĩa', value: 'xocdia' }
];

const AdminUserBetHistory = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchValue, setSearchValue] = useState('');
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
      const response = await adminService.getUserBetSummary({
        search: searchValue,
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
  }, [searchValue, summaryPage, summarySize]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const handleSearch = () => {
    setSummaryPage(0);
    setSearchValue(searchInput.trim());
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSummaryPage(0);
    setSearchValue('');
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
        title: 'Tài khoản',
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
        render: (value) => formatCurrency(Number(value ?? 0))
      },
      {
        title: 'Tổng lãi',
        dataIndex: 'totalWinAmount',
        key: 'totalWinAmount',
        render: (value) => formatCurrency(Number(value ?? 0))
      },
      {
        title: 'Tổng lỗ',
        dataIndex: 'totalLossAmount',
        key: 'totalLossAmount',
        render: (value) => formatCurrency(Number(value ?? 0))
      },
      {
        title: 'Tổng nạp',
        dataIndex: 'totalDepositAmount',
        key: 'totalDepositAmount',
        render: (value) => formatCurrency(Number(value ?? 0))
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
        render: (value) => formatCurrency(Number(value ?? 0))
      },
      {
        title: 'Tiền thắng',
        dataIndex: 'winAmount',
        key: 'winAmount',
        width: 140,
        render: (value) => formatCurrency(Number(value ?? 0))
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
    const cards = [
      {
        title: 'Tổng cược',
        value: formatCurrency(Number(detailSummary.totalStakeAmount ?? 0))
      },
      {
        title: 'Tổng lãi',
        value: formatCurrency(Number(detailSummary.totalWinAmount ?? 0))
      },
      {
        title: 'Tổng lỗ',
        value: formatCurrency(Number(detailSummary.totalLossAmount ?? 0))
      },
      {
        title: 'Tổng nạp',
        value: formatCurrency(Number(detailSummary.totalDepositAmount ?? 0))
      }
    ];
    return (
      <Row gutter={16} className="mb-4">
        {cards.map((card) => (
          <Col xs={12} md={6} key={card.title}>
            <Card bordered={false}>
              <Statistic title={card.title} value={card.value} />
            </Card>
          </Col>
        ))}
      </Row>
    );
  }, [detailSummary]);

  return (
    <div className="space-y-4">
      <Card>
        <Space.Compact style={{ width: '100%' }}>
          <Input
            placeholder="Tìm theo tài khoản / tên"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onPressEnter={handleSearch}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            Tìm kiếm
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleResetFilters}>
            Đặt lại
          </Button>
        </Space.Compact>
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


