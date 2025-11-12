import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Card,
  Table,
  Input,
  Select,
  DatePicker,
  Tag,
  Space,
  Button,
  Row,
  Col,
  Statistic,
  Modal,
  message
} from 'antd';
import {
  UserOutlined,
  ReloadOutlined,
  SearchOutlined,
  FilterOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { adminService } from '../services/adminService';
import TabPageHeader from './TabPageHeader';
import { formatCurrency } from '../../../utils/helpers';

const { RangePicker } = DatePicker;
const { Option } = Select;

const statusColors = {
  ACTIVE: 'green',
  INACTIVE: 'orange',
  SUSPENDED: 'volcano',
  BANNED: 'red'
};

const AgentCustomerList = () => {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [commissionRate, setCommissionRate] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    status: undefined,
    dateRange: []
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [historyTotals, setHistoryTotals] = useState({
    stake: 0,
    win: 0,
    lost: 0,
    net: 0
  });
  const [historyFilters, setHistoryFilters] = useState({
    gameType: 'all',
    dateRange: []
  });

  const totals = useMemo(() => {
    return customers.reduce(
      (acc, item) => {
        const bet = Number(item.totalBetAmount ?? 0);
        const lost = Number(item.totalLostAmount ?? 0);
        const commission = Number(item.commissionAmount ?? 0);
        acc.bet += bet;
        acc.lost += lost;
        acc.commission += commission;
        return acc;
      },
      { bet: 0, lost: 0, commission: 0 }
    );
  }, [customers]);

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const { current, pageSize } = pagination;
      const params = {
        page: current - 1,
        size: pageSize
      };

      if (filters.search) {
        params.search = filters.search;
      }

      if (filters.status) {
        params.status = filters.status;
      }

      if (filters.dateRange && filters.dateRange.length === 2) {
        params.startDate = filters.dateRange[0].format('YYYY-MM-DD');
        params.endDate = filters.dateRange[1].format('YYYY-MM-DD');
      }

      const response = await adminService.getAgentCustomers(params);
      if (response?.success && response.data) {
        const payload = response.data;
        setCustomers(payload.items || []);
        setCommissionRate(payload.commissionRate || 0);
        setPagination((prev) => ({
          ...prev,
          current: (payload.page || 0) + 1,
          pageSize: payload.size || prev.pageSize,
          total: payload.totalItems || 0
        }));
      } else {
        message.error(response?.message || 'Không thể tải danh sách khách hàng');
      }
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra khi tải danh sách khách hàng');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.current, pagination.pageSize]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleTableChange = ({ current, pageSize }) => {
    setPagination((prev) => ({
      ...prev,
      current,
      pageSize
    }));
  };

  const handleFilterChange = (key, value) => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      status: undefined,
      dateRange: []
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const columns = [
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      key: 'username',
      render: (value) => (
        <Space>
          <UserOutlined />
          <span className="font-medium">{value}</span>
        </Space>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusColors[status] || 'default'}>{status}</Tag>
      )
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'joinedAt',
      key: 'joinedAt',
      render: (value) =>
        value ? dayjs(value).format('DD/MM/YYYY HH:mm') : '-',
      sorter: (a, b) =>
        dayjs(a.joinedAt).valueOf() - dayjs(b.joinedAt).valueOf(),
      defaultSortOrder: 'descend'
    },
    {
      title: 'Tổng cược',
      dataIndex: 'totalBetAmount',
      key: 'totalBetAmount',
      render: (value) => formatCurrency(Number(value ?? 0))
    },
    {
      title: 'Tổng thua',
      dataIndex: 'totalLostAmount',
      key: 'totalLostAmount',
      render: (value) => formatCurrency(Number(value ?? 0))
    },
    {
      title: 'Hoa hồng tạo ra',
      dataIndex: 'commissionAmount',
      key: 'commissionAmount',
      render: (value) => formatCurrency(Number(value ?? 0))
    }
  ];

  const historyColumns = [
    {
      title: 'Thời gian',
      dataIndex: 'placedAt',
      key: 'placedAt',
      render: (value) => (value ? dayjs(value).format('DD/MM/YYYY HH:mm') : '-'),
      sorter: (a, b) =>
        dayjs(a.placedAt).valueOf() - dayjs(b.placedAt).valueOf(),
      defaultSortOrder: 'descend'
    },
    {
      title: 'Trò chơi',
      dataIndex: 'gameType',
      key: 'gameType',
      render: (value) => {
        const normalized = value?.toLowerCase();
        const labelMap = {
          lottery: 'Lô đề',
          'xoc-dia': 'Xóc Đĩa',
          xocdia: 'Xóc Đĩa',
          sicbo: 'Sicbo'
        };
        const colorMap = {
          lottery: 'geekblue',
          'xoc-dia': 'volcano',
          xocdia: 'volcano',
          sicbo: 'purple'
        };
        return (
          <Tag color={colorMap[normalized] || 'default'}>
            {labelMap[normalized] || value}
          </Tag>
        );
      }
    },
    {
      title: 'Mã cược',
      dataIndex: 'betCode',
      key: 'betCode'
    },
    {
      title: 'Tiền cược',
      dataIndex: 'stake',
      key: 'stake',
      render: (value) => formatCurrency(Number(value ?? 0))
    },
    {
      title: 'Tiền thắng',
      dataIndex: 'winAmount',
      key: 'winAmount',
      render: (value) => formatCurrency(Number(value ?? 0))
    },
    {
      title: 'Kết quả',
      dataIndex: 'netResult',
      key: 'netResult',
      render: (value) => {
        const amount = Number(value ?? 0);
        const formatted = formatCurrency(Math.abs(amount));
        if (amount > 0) {
          return <span className="text-emerald-500">+{formatted}</span>;
        }
        if (amount < 0) {
          return <span className="text-red-500">-{formatted}</span>;
        }
        return formatted;
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'WON' ? 'green' : status === 'LOST' ? 'red' : 'default'}>
          {status}
        </Tag>
      )
    }
  ];

  const fetchHistory = useCallback(
    async (customerId, overrides = {}) => {
      if (!customerId) return;
      const appliedFilters = {
        ...historyFilters,
        ...overrides
      };
      setHistoryFilters(appliedFilters);
      try {
        setHistoryLoading(true);
        const params = {
          size: 100
        };
        if (appliedFilters.gameType && appliedFilters.gameType !== 'all') {
          params.gameType = appliedFilters.gameType;
        }
        if (appliedFilters.dateRange && appliedFilters.dateRange.length === 2) {
          params.startDate = appliedFilters.dateRange[0].format('YYYY-MM-DD');
          params.endDate = appliedFilters.dateRange[1].format('YYYY-MM-DD');
        }

        const response = await adminService.getAgentCustomerBetHistory(customerId, params);
        if (response?.success && response.data) {
          const payload = response.data;
          setHistoryData(payload.items || []);
          setHistoryTotals({
            stake: Number(payload.totalStake ?? 0),
            win: Number(payload.totalWinAmount ?? 0),
            lost: Number(payload.totalLostAmount ?? 0),
            net: Number(payload.totalNetResult ?? 0)
          });
        } else {
          message.error(response?.message || 'Không thể tải lịch sử cược');
        }
      } catch (error) {
        message.error(error.message || 'Có lỗi xảy ra khi tải lịch sử cược');
      } finally {
        setHistoryLoading(false);
      }
    },
    [historyFilters]
  );

  const openHistoryModal = async (record) => {
    setSelectedCustomer(record);
    setHistoryFilters({
      gameType: 'all',
      dateRange: []
    });
    setHistoryVisible(true);
    await fetchHistory(record.id, {
      gameType: 'all',
      dateRange: []
    });
  };

  const handleHistorySearch = () => {
    if (selectedCustomer) {
      fetchHistory(selectedCustomer.id);
    }
  };

  const handleHistoryReset = () => {
    setHistoryFilters({
      gameType: 'all',
      dateRange: []
    });
    if (selectedCustomer) {
      fetchHistory(selectedCustomer.id, {
        gameType: 'all',
        dateRange: []
      });
    }
  };

  return (
    <div className="space-y-6">
      <TabPageHeader
        title="Danh sách khách hàng"
        description="Quản lý danh sách người chơi thuộc đại lý"
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Tổng cược (trang hiện tại)"
              value={formatCurrency(totals.bet)}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Tổng thua (trang hiện tại)"
              value={formatCurrency(totals.lost)}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title={`Hoa hồng (Trang hiện tại • ${commissionRate}% )`}
              value={formatCurrency(totals.commission)}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8} lg={6}>
            <Input
              placeholder="Tìm kiếm theo tên đăng nhập"
              prefix={<SearchOutlined />}
              allowClear
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              onPressEnter={loadCustomers}
            />
          </Col>
          <Col xs={24} md={8} lg={6}>
            <Select
              allowClear
              placeholder="Trạng thái"
              style={{ width: '100%' }}
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
            >
              <Option value="ACTIVE">Hoạt động</Option>
              <Option value="INACTIVE">Tạm khóa</Option>
              <Option value="SUSPENDED">Tạm dừng</Option>
              <Option value="BANNED">Bị cấm</Option>
            </Select>
          </Col>
          <Col xs={24} md={8} lg={8}>
            <RangePicker
              style={{ width: '100%' }}
              value={filters.dateRange}
              onChange={(dates) => handleFilterChange('dateRange', dates || [])}
              format="DD/MM/YYYY"
            />
          </Col>
          <Col xs={24} lg={4}>
            <Space wrap>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={loadCustomers}
                loading={loading}
              >
                Tìm kiếm
              </Button>
              <Button icon={<FilterOutlined />} onClick={resetFilters}>
                Xóa lọc
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={loadCustomers}
                loading={loading}
              >
                Làm mới
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          bordered
          rowKey="id"
          loading={loading}
          dataSource={customers}
          columns={columns}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} khách hàng`
          }}
          onChange={handleTableChange}
          onRow={(record) => ({
            onClick: () => openHistoryModal(record),
            style: { cursor: 'pointer' }
          })}
        />
      </Card>

      <Modal
        title={
          <div>
            Lịch sử cược
            {selectedCustomer ? ` - ${selectedCustomer.username}` : ''}
          </div>
        }
        open={historyVisible}
        onCancel={() => {
          setHistoryVisible(false);
          setSelectedCustomer(null);
          setHistoryData([]);
        }}
        width={1000}
        footer={null}
      >
        <Space direction="vertical" size="large" className="w-full">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Card bordered={false}>
                <Statistic
                  title="Tổng cược"
                  value={formatCurrency(historyTotals.stake)}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card bordered={false}>
                <Statistic
                  title="Tổng thắng"
                  value={formatCurrency(historyTotals.win)}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card bordered={false}>
                <Statistic
                  title="Tổng thua"
                  value={formatCurrency(historyTotals.lost)}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card bordered={false}>
                <Statistic
                  title="Lãi ròng"
                  value={`${historyTotals.net > 0 ? '+' : historyTotals.net < 0 ? '-' : ''}${formatCurrency(Math.abs(historyTotals.net))}`}
                />
              </Card>
            </Col>
          </Row>

          <Card bordered={false}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={12} md={6}>
                <Select
                  value={historyFilters.gameType}
                  onChange={(value) =>
                    setHistoryFilters((prev) => ({ ...prev, gameType: value }))
                  }
                  style={{ width: '100%' }}
                >
                  <Option value="all">Tất cả trò chơi</Option>
                  <Option value="lottery">Lô đề</Option>
                  <Option value="xoc-dia">Xóc Đĩa</Option>
                  <Option value="sicbo">Sicbo</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <RangePicker
                  style={{ width: '100%' }}
                  value={historyFilters.dateRange}
                  onChange={(dates) =>
                    setHistoryFilters((prev) => ({
                      ...prev,
                      dateRange: dates || []
                    }))
                  }
                  format="DD/MM/YYYY"
                />
              </Col>
              <Col xs={24} sm={24} md={10}>
                <Space wrap>
                  <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={handleHistorySearch}
                    loading={historyLoading}
                  >
                    Tìm kiếm
                  </Button>
                  <Button icon={<FilterOutlined />} onClick={handleHistoryReset}>
                    Xóa lọc
                  </Button>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => selectedCustomer && fetchHistory(selectedCustomer.id)}
                    loading={historyLoading}
                  >
                    Làm mới
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>

          <Table
            bordered
            rowKey={(record) => `${record.gameType}-${record.betId}`}
            loading={historyLoading}
            dataSource={historyData}
            columns={historyColumns}
            pagination={false}
            locale={{
              emptyText: historyLoading
                ? 'Đang tải dữ liệu...'
                : 'Chưa có lịch sử cược nào'
            }}
          />
        </Space>
      </Modal>
    </div>
  );
};

export default AgentCustomerList;

