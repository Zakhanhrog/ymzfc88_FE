import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { adminService } from '../services/adminService';
import TabPageHeader from './TabPageHeader';
import { formatCurrency, formatPointsOnly } from '../../../utils/helpers';
import Table from '../../../components/ui/Table';
import Pagination from '../../../components/ui/Pagination';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import DateRangePicker from '../../../components/ui/DateRangePicker';
import Modal from '../../../components/ui/Modal';
import StatCard from '../analytics/components/StatCard';
import StatusTag from './StatusTag';
import AgentCustomerDetailModal from './AgentCustomerDetailModal';

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
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [statistics, setStatistics] = useState({
    totalCustomers: 0,
    totalDeposit: 0,
    totalWithdraw: 0,
    totalBet: 0,
    totalWin: 0,
    totalLoss: 0,
    totalPromotionalMoney: 0,
    totalGameRefund: 0,
    totalDailyLossRefund: 0,
    currentCommission: 0,
    commissionRate: 0
  });
  const [statisticsLoading, setStatisticsLoading] = useState(false);

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
      }
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.current, pagination.pageSize]);

  const loadStatistics = useCallback(async () => {
    try {
      setStatisticsLoading(true);
      const params = {};
      if (filters.dateRange && filters.dateRange.length === 2) {
        params.startDate = filters.dateRange[0].format('YYYY-MM-DD');
        params.endDate = filters.dateRange[1].format('YYYY-MM-DD');
      }

      const response = await adminService.getAgentCustomerStatistics(params);
      if (response?.success && response.data) {
        const data = response.data;
        setStatistics({
          totalCustomers: data.totalCustomers || 0,
          totalDeposit: Number(data.totalDeposit || 0),
          totalWithdraw: Number(data.totalWithdraw || 0),
          totalBet: Number(data.totalBet || 0),
          totalWin: Number(data.totalWin || 0),
          totalLoss: Number(data.totalLoss || 0),
          totalPromotionalMoney: Number(data.totalPromotionalMoney || 0),
          totalGameRefund: Number(data.totalGameRefund || 0),
          totalDailyLossRefund: Number(data.totalDailyLossRefund || 0),
          currentCommission: Number(data.currentCommission || 0),
          commissionRate: data.commissionRate || 0
        });
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setStatisticsLoading(false);
    }
  }, [filters.dateRange]);

  useEffect(() => {
    loadCustomers();
    loadStatistics();
  }, [loadCustomers, loadStatistics]);

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

  const handleViewDetail = (record) => {
    setSelectedCustomer(record);
    setDetailModalVisible(true);
  };

  const statusOptions = [
    { value: 'ACTIVE', label: 'Hoạt động' },
    { value: 'INACTIVE', label: 'Tạm khóa' },
    { value: 'SUSPENDED', label: 'Tạm dừng' },
    { value: 'BANNED', label: 'Bị cấm' }
  ];

  const columns = [
    {
      title: 'Tên tài khoản',
      dataIndex: 'username',
      key: 'username',
      render: (value) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <StatusTag status={status} />
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'joinedAt',
      key: 'joinedAt',
      render: (value) =>
        value ? dayjs(value).format('DD/MM/YYYY HH:mm') : '-'
    },
    {
      title: 'Số dư hiện tại',
      dataIndex: 'currentBalance',
      key: 'currentBalance',
      render: (value) => formatPointsOnly(value ?? 0)
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button
          variant="primary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetail(record);
          }}
        >
          Chi tiết
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <TabPageHeader
        title="Danh sách khách hàng"
        description="Quản lý danh sách người chơi thuộc đại lý"
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard
          title="Tổng khách hàng"
          value={statistics.totalCustomers}
          bgColor="bg-blue-600"
          textColor="text-white"
          valueColor="text-white"
        />
        <StatCard
          title="Tổng nạp"
          value={formatCurrency(statistics.totalDeposit)}
          bgColor="bg-green-600"
          textColor="text-white"
          valueColor="text-white"
        />
        <StatCard
          title="Tổng rút"
          value={formatCurrency(statistics.totalWithdraw)}
          bgColor="bg-orange-600"
          textColor="text-white"
          valueColor="text-white"
            />
        <StatCard
          title="Tổng cược"
          value={formatCurrency(statistics.totalBet)}
          bgColor="bg-purple-600"
          textColor="text-white"
          valueColor="text-white"
        />
        <StatCard
          title="Tổng thắng"
          value={formatCurrency(statistics.totalWin)}
          bgColor="bg-emerald-600"
          textColor="text-white"
          valueColor="text-white"
        />
        <StatCard
          title="Tổng thua"
          value={formatCurrency(statistics.totalLoss)}
          bgColor="bg-red-600"
          textColor="text-white"
          valueColor="text-white"
        />
        <StatCard
          title="Tổng khuyến mãi"
          value={formatCurrency(statistics.totalPromotionalMoney)}
          bgColor="bg-cyan-600"
          textColor="text-white"
          valueColor="text-white"
            />
        <StatCard
          title="Tổng hoàn cược"
          value={formatCurrency(statistics.totalGameRefund)}
          bgColor="bg-indigo-600"
          textColor="text-white"
          valueColor="text-white"
        />
        <StatCard
          title="Tổng hoàn thua"
          value={formatCurrency(statistics.totalDailyLossRefund)}
          bgColor="bg-pink-600"
          textColor="text-white"
          valueColor="text-white"
        />
        <StatCard
          title={`Hoa hồng (${statistics.commissionRate}%)`}
          value={formatCurrency(statistics.currentCommission)}
          bgColor="bg-teal-600"
          textColor="text-white"
          valueColor="text-white"
        />
      </div>

      {/* Filters */}
      <Card className="rounded-2xl">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tìm kiếm
              </label>
            <Input
              placeholder="Tìm kiếm theo tên đăng nhập"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    loadCustomers();
                  }
                }}
            />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
            <Select
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
                options={statusOptions}
                placeholder="Trạng thái"
                allowClear
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Khoảng thời gian
              </label>
              <DateRangePicker
              value={filters.dateRange}
              onChange={(dates) => handleFilterChange('dateRange', dates || [])}
                placeholder={['Từ ngày', 'Đến ngày']}
            />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={resetFilters}
                className="rounded-2xl"
              >
                Đặt lại
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
        <Table
            columns={columns}
            dataSource={customers}
            loading={loading}
          rowKey="id"
            emptyText="Không có dữ liệu"
          />
          {pagination.total > 0 && (
            <div className="p-4 border-t">
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={handleTableChange}
                showSizeChanger
                showTotal={(total, range) =>
              `${range[0]}-${range[1]} của ${total} khách hàng`
                }
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {selectedCustomer && (
        <AgentCustomerDetailModal
          open={detailModalVisible}
          onClose={() => {
            setDetailModalVisible(false);
          setSelectedCustomer(null);
          }}
          customer={selectedCustomer}
          dateRange={filters.dateRange}
        />
      )}
    </div>
  );
};

export default AgentCustomerList;
