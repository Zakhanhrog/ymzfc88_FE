import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Card,
  DatePicker,
  Table,
  Tag,
  Space,
  Button,
  Typography,
  Select,
  Row,
  Col,
  Statistic,
  message
} from 'antd';
import {
  ReloadOutlined,
  HistoryOutlined,
  FundOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { adminService } from '../services/adminService';
import TabPageHeader from './TabPageHeader';
import { formatCurrency } from '../../../utils/helpers';

const { RangePicker } = DatePicker;
const { Text } = Typography;

const GAME_TYPE_OPTIONS = [
  { value: 'lottery', label: 'Xổ số' },
  { value: 'xocdia', label: 'Xóc Đĩa' },
  { value: 'sicbo', label: 'Tài xỉu' }
];

const LOTTERY_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Đang chờ' },
  { value: 'WON', label: 'Thắng' },
  { value: 'LOST', label: 'Thua' },
  { value: 'CANCELLED', label: 'Đã hủy' }
];

const LIVE_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Đang chờ' },
  { value: 'WON', label: 'Thắng' },
  { value: 'LOST', label: 'Thua' },
  { value: 'REFUNDED', label: 'Hoàn cược' }
];

const DEFAULT_DATE_RANGE = [dayjs().subtract(7, 'day'), dayjs()];

const mapGameTypeToLabel = (value) => {
  switch (value?.toUpperCase()) {
    case 'LOTTERY':
      return 'Xổ số';
    case 'XOCDIA':
      return 'Xóc Đĩa';
    case 'SICBO':
      return 'Tài xỉu';
    default:
      return value || '-';
  }
};

const formatDateTime = (value) => {
  if (!value) return '-';
  return dayjs(value).format('DD/MM/YYYY HH:mm:ss');
};

const AdminGameHistory = () => {
  const [filters, setFilters] = useState({
    gameType: 'lottery',
    status: undefined,
    dateRange: DEFAULT_DATE_RANGE
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
    totalItems: 0,
    totalStakeAmount: 0,
    totalWinAmount: 0
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  });

  const fetchHistory = useCallback(
    async (page = pagination.current, pageSize = pagination.pageSize) => {
      try {
        setLoading(true);
        const params = {
          gameType: filters.gameType,
          status: filters.status,
          page: page - 1,
          size: pageSize
        };

        if (filters.dateRange && filters.dateRange.length === 2) {
          params.startDate = filters.dateRange[0]?.format('YYYY-MM-DD');
          params.endDate = filters.dateRange[1]?.format('YYYY-MM-DD');
        }

        const response = await adminService.getGameHistory(params);
        if (response?.success) {
          const payload = response.data || {};
          setData(payload.items || []);
          setSummary({
            totalItems: payload.totalItems || 0,
            totalStakeAmount: Number(payload.totalStakeAmount ?? 0),
            totalWinAmount: Number(payload.totalWinAmount ?? 0)
          });
          setPagination((prev) => ({
            ...prev,
            current: (payload.page || 0) + 1,
            pageSize: payload.size || pageSize,
            total: payload.totalItems || 0
          }));
        } else {
          message.error(response?.message || 'Không thể tải lịch sử game');
        }
      } catch (error) {
        message.error(error.message || 'Không thể tải lịch sử game');
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.current, pagination.pageSize]
  );

  useEffect(() => {
    fetchHistory(1, pagination.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.gameType, filters.status, filters.dateRange]);

  const statusOptions = useMemo(() => {
    if (filters.gameType === 'lottery') {
      return LOTTERY_STATUS_OPTIONS;
    }
    return LIVE_STATUS_OPTIONS;
  }, [filters.gameType]);

  const columns = useMemo(
    () => [
      {
        title: 'Thời gian đặt',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (value) => formatDateTime(value),
        width: 170
      },
      {
        title: 'Game',
        dataIndex: 'gameType',
        key: 'gameType',
        render: (value) => mapGameTypeToLabel(value),
        width: 110
      },
      {
        title: 'Người chơi',
        dataIndex: 'username',
        key: 'username',
        render: (_, record) => (
          <Space direction="vertical" size={0}>
            <Text strong>{record.username || '-'}</Text>
            {record.fullName && <Text type="secondary">{record.fullName}</Text>}
            {record.phoneNumber && <Text type="secondary">{record.phoneNumber}</Text>}
          </Space>
        )
      },
      {
        title: 'Chi tiết cược',
        dataIndex: 'description',
        key: 'description',
        render: (value, record) => (
          <Space direction="vertical" size={0}>
            <Text>{record.betCode || '-'}</Text>
            <Text type="secondary">{value || '-'}</Text>
          </Space>
        )
      },
      {
        title: 'Điểm cược',
        dataIndex: 'stakeAmount',
        key: 'stakeAmount',
        align: 'right',
        render: (value) => formatCurrency(Number(value ?? 0))
      },
      {
        title: 'Tiềm năng',
        dataIndex: 'potentialWinAmount',
        key: 'potentialWinAmount',
        align: 'right',
        render: (value) => formatCurrency(Number(value ?? 0))
      },
      {
        title: 'Tiền thắng',
        dataIndex: 'winAmount',
        key: 'winAmount',
        align: 'right',
        render: (value) => formatCurrency(Number(value ?? 0))
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        render: (value) => {
          if (!value) return '-';
          const upper = value.toUpperCase();
          if (upper === 'WON') return <Tag color="green">Thắng</Tag>;
          if (upper === 'LOST') return <Tag color="red">Thua</Tag>;
          if (upper === 'REFUNDED' || upper === 'CANCELLED') return <Tag color="orange">Hoàn/Hủy</Tag>;
          return <Tag color="blue">Đang chờ</Tag>;
        },
        width: 120
      },
      {
        title: 'Kết quả',
        dataIndex: 'resultCode',
        key: 'resultCode',
        render: (value) => value || '-'
      },
      {
        title: 'Thời gian trả',
        dataIndex: 'settledAt',
        key: 'settledAt',
        render: (value) => formatDateTime(value),
        width: 170
      },
      {
        title: 'Phiên',
        dataIndex: 'sessionId',
        key: 'sessionId',
        render: (_, record) => {
          if (!record.sessionId) return '-';
          return (
            <Space direction="vertical" size={0}>
              <Text>Phiên #{record.sessionId}</Text>
              {record.tableNumber && <Text type="secondary">Bàn {record.tableNumber}</Text>}
            </Space>
          );
        },
        width: 140
      }
    ],
    []
  );

  return (
    <div className="space-y-6">
      <TabPageHeader
        title="Lịch sử game"
        description="Theo dõi toàn bộ lịch sử cược các game Xổ số, Xóc Đĩa và Tài xỉu"
      />

      <Card>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8} lg={6}>
            <Space direction="vertical" size={2} className="w-full">
              <Text type="secondary">Loại game</Text>
              <Select
                value={filters.gameType}
                options={GAME_TYPE_OPTIONS}
                onChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    gameType: value,
                    status: undefined
                  }))
                }
              />
            </Space>
          </Col>
          <Col xs={24} md={8} lg={6}>
            <Space direction="vertical" size={2} className="w-full">
              <Text type="secondary">Trạng thái</Text>
              <Select
                allowClear
                placeholder="Tất cả"
                value={filters.status}
                options={statusOptions}
                onChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: value
                  }))
                }
              />
            </Space>
          </Col>
          <Col xs={24} md={8} lg={8}>
            <Space direction="vertical" size={2} className="w-full">
              <Text type="secondary">Khoảng thời gian</Text>
              <RangePicker
                className="w-full"
                value={filters.dateRange}
                format="DD/MM/YYYY"
                onChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    dateRange: value || DEFAULT_DATE_RANGE
                  }))
                }
                allowClear={false}
              />
            </Space>
          </Col>
          <Col xs={24} md={24} lg={4} className="flex items-end justify-end">
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={() => fetchHistory()}
              loading={loading}
            >
              Làm mới
            </Button>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Số lượng lệnh"
              value={summary.totalItems}
              prefix={<HistoryOutlined className="text-blue-400" />}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Tổng điểm cược"
              value={formatCurrency(summary.totalStakeAmount)}
              prefix={<FundOutlined className="text-indigo-400" />}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Tổng tiền thắng"
              value={formatCurrency(summary.totalWinAmount)}
              prefix={<FundOutlined className="text-emerald-400" />}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Table
          loading={loading}
          dataSource={data}
          columns={columns}
          rowKey={(record) => `${record.gameType}-${record.id}`}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            onChange: (current, pageSize) => fetchHistory(current, pageSize)
          }}
          scroll={{ x: 1200 }}
          locale={{
            emptyText: 'Chưa có lịch sử cược nào'
          }}
        />
      </Card>
    </div>
  );
};

export default AdminGameHistory;

