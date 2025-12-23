import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import Table from '../../../components/ui/Table';
import Modal from '../../../components/ui/Modal';
import DateRangePicker from '../../../components/ui/DateRangePicker';
import Pagination from '../../../components/ui/Pagination';
import StatCard from '../../admin/analytics/components/StatCard';
import Loading from '../../../components/common/Loading';
import { Badge } from '../../../components/ui/Badge';
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Gift,
  Clock,
  RefreshCw,
  Eye,
  Search,
  Filter
} from 'lucide-react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import walletService from '../services/walletService';
import BettingHistory from './BettingHistory';
import { formatPoints } from '../../../utils/helpers';
import { message } from '../../../utils/notification';

dayjs.extend(isBetween);

// Component hiển thị lịch sử giao dịch
const TransactionHistoryTab = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    dateRange: null,
    searchText: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [stats, setStats] = useState({
    totalDeposit: 0,
    totalWithdraw: 0,
    totalBonus: 0,
    pendingCount: 0
  });
  const [loadingStats, setLoadingStats] = useState(false);

  // Load transaction history when component mounts
  useEffect(() => {
    loadTransactionHistory();
    loadTransactionStatistics();
  }, [pagination.current, pagination.pageSize]);

  const loadTransactionHistory = async () => {
    try {
      setLoading(true);
      const response = await walletService.getTransactionHistory(
        pagination.current - 1, 
        pagination.pageSize
      );
      
      if (response.success) {
        let transactions = response.data.content || [];
        transactions.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA;
        });
        setTransactions(transactions);
        setPagination(prev => ({
          ...prev,
          total: response.data.totalElements || 0
        }));
      }
    } catch (error) {
      message.error('Lỗi khi tải lịch sử giao dịch: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Load transaction statistics from API
  const loadTransactionStatistics = async () => {
    try {
      setLoadingStats(true);
      const response = await walletService.getTransactionStatistics();
      
      if (response.success && response.data) {
        setStats({
          totalDeposit: response.data.totalDeposit || 0,
          totalWithdraw: response.data.totalWithdraw || 0,
          totalBonus: response.data.totalBonus || 0,
          pendingCount: response.data.pendingCount || 0
        });
      }
    } catch (error) {
      console.error('Error loading transaction statistics:', error);
      message.error('Lỗi khi tải thống kê giao dịch: ' + error.message);
    } finally {
      setLoadingStats(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
      case 'APPROVED':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'PENDING':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'FAILED':
      case 'REJECTED':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'CANCELLED':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'COMPLETED': return 'Hoàn thành';
      case 'APPROVED': return 'Đã duyệt';
      case 'PENDING': return 'Đang chờ';
      case 'FAILED': return 'Thất bại';
      case 'REJECTED': return 'Từ chối';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'DEPOSIT':
        return <ArrowUpCircle className="w-5 h-5 text-green-600" />;
      case 'WITHDRAW':
        return <ArrowDownCircle className="w-5 h-5 text-red-600" />;
      case 'BONUS':
        return <Gift className="w-5 h-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getTypeName = (type) => {
    switch (type) {
      case 'DEPOSIT': return 'Nạp tiền';
      case 'WITHDRAW': return 'Rút tiền';
      case 'BONUS': return 'Thưởng';
      case 'REFUND': return 'Hoàn tiền';
      case 'ADJUSTMENT': return 'Điều chỉnh';
      default: return type;
    }
  };

  // Filter transactions
  const filteredTransactions = transactions
    .filter(transaction => {
      if (filters.type !== 'all' && transaction.type !== filters.type.toUpperCase()) {
        return false;
      }
      
      if (filters.status !== 'all' && transaction.status !== filters.status.toUpperCase()) {
        return false;
      }
      
      if (filters.dateRange && filters.dateRange.length === 2) {
        const transactionDate = dayjs(transaction.createdAt);
        const [startDate, endDate] = filters.dateRange;
        if (!transactionDate.isBetween(startDate, endDate, 'day', '[]')) {
          return false;
        }
      }
      
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        return (
          transaction.transactionCode.toLowerCase().includes(searchLower) ||
          (transaction.description && transaction.description.toLowerCase().includes(searchLower)) ||
          (transaction.paymentMethod && transaction.paymentMethod.name.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB - dateA;
    });

  // Paginated transactions
  const paginatedTransactions = filteredTransactions.slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize
  );

  const handleTableChange = (newPagination) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      type: 'all',
      status: 'all',
      dateRange: null,
      searchText: ''
    });
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const showTransactionDetail = (transaction) => {
    setSelectedTransaction(transaction);
    setDetailModalVisible(true);
  };

  const columns = [
    {
      key: 'transactionCode',
      dataIndex: 'transactionCode',
      title: 'Mã giao dịch',
      render: (text) => (
        <span className="font-mono text-sm text-blue-600">{text}</span>
      ),
    },
    {
      key: 'type',
      dataIndex: 'type',
      title: 'Loại',
      render: (type) => (
        <div className="flex items-center gap-2">
          {getTypeIcon(type)}
          <span className="text-sm text-gray-900">{getTypeName(type)}</span>
        </div>
      ),
    },
    {
      key: 'amount',
      dataIndex: 'amount',
      title: 'Số tiền',
      render: (amount, record) => {
        const netAmount = record.netAmount || amount;
        return (
          <span className={`text-sm font-semibold ${
            record.type === 'DEPOSIT' || record.type === 'BONUS' 
              ? 'text-green-600' 
              : 'text-red-600'
          }`}>
            {record.type === 'DEPOSIT' || record.type === 'BONUS' ? '+' : '-'}
            {formatPoints(netAmount)}
          </span>
        );
      },
    },
    {
      key: 'paymentMethod',
      dataIndex: 'paymentMethod',
      title: 'Phương thức',
      render: (paymentMethod) => (
        <span className="text-sm text-gray-700">{paymentMethod?.name || 'N/A'}</span>
      ),
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: 'Trạng thái',
      render: (status) => (
        <Badge className={`${getStatusColor(status)} border text-xs`}>
          {getStatusText(status)}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      dataIndex: 'createdAt',
      title: 'Thời gian',
      render: (date) => (
        <span className="text-sm text-gray-700">{dayjs(date).format('DD/MM/YYYY HH:mm')}</span>
      ),
    },
    {
      key: 'action',
      title: 'Hành động',
      render: (_, record) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => showTransactionDetail(record)}
          className="h-8"
        >
          <Eye className="h-4 w-4 mr-1" />
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Tổng nạp"
          value={formatPoints(stats.totalDeposit)}
          icon={ArrowUpCircle}
          bgColor="bg-green-600"
          valueColor="text-white"
          textColor="text-white"
        />
        <StatCard
          title="Tổng rút"
          value={formatPoints(stats.totalWithdraw)}
          icon={ArrowDownCircle}
          bgColor="bg-red-600"
          valueColor="text-white"
          textColor="text-white"
        />
        <StatCard
          title="Đang chờ"
          value={`${stats.pendingCount} giao dịch`}
          icon={Clock}
          bgColor="bg-orange-600"
          valueColor="text-white"
          textColor="text-white"
        />
      </div>

      {/* Filters */}
      <Card className="rounded-2xl">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Khoảng thời gian
              </label>
              <DateRangePicker
                value={filters.dateRange}
                onChange={(value) => handleFilterChange('dateRange', value)}
                placeholder={['Từ ngày', 'Đến ngày']}
                format="DD/MM/YYYY"
                bordered
              />
            </div>

            <div className="w-[160px]">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Loại
              </label>
              <Select
                value={filters.type}
                onChange={(value) => handleFilterChange('type', value)}
                options={[
                  { label: 'Tất cả', value: 'all' },
                  { label: 'Nạp tiền', value: 'DEPOSIT' },
                  { label: 'Rút tiền', value: 'WITHDRAW' },
                  { label: 'Thưởng', value: 'BONUS' },
                  { label: 'Hoàn tiền', value: 'REFUND' },
                  { label: 'Điều chỉnh', value: 'ADJUSTMENT' },
                ]}
                bordered
              />
            </div>

            <div className="w-[160px]">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Trạng thái
              </label>
              <Select
                value={filters.status}
                onChange={(value) => handleFilterChange('status', value)}
                options={[
                  { label: 'Tất cả', value: 'all' },
                  { label: 'Hoàn thành', value: 'COMPLETED' },
                  { label: 'Đã duyệt', value: 'APPROVED' },
                  { label: 'Đang chờ', value: 'PENDING' },
                  { label: 'Thất bại', value: 'FAILED' },
                  { label: 'Từ chối', value: 'REJECTED' },
                  { label: 'Đã hủy', value: 'CANCELLED' },
                ]}
                bordered
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tìm kiếm
              </label>
              <Input
                value={filters.searchText}
                onChange={(e) => handleFilterChange('searchText', e.target.value)}
                placeholder="Mã giao dịch, mô tả..."
                prefix={<Search className="w-4 h-4 text-gray-400" />}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={resetFilters}
                className="h-10"
              >
                <Filter className="h-4 w-4 mr-1" />
                Đặt lại
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  loadTransactionHistory();
                  loadTransactionStatistics();
                }}
                className="h-10"
              >
                <RefreshCw className="h-4 w-4" />
                Làm mới
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="rounded-2xl">
        <CardContent className="p-0">
          {loading ? (
            <div className="py-12">
              <Loading />
            </div>
          ) : (
            <>
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Lịch sử giao dịch</h3>
              </div>
              <div className="overflow-x-auto">
                <Table
                  columns={columns}
                  dataSource={paginatedTransactions}
                  loading={false}
                  rowKey="id"
                  emptyText="Không có dữ liệu giao dịch"
                />
              </div>
              {filteredTransactions.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={filteredTransactions.length}
                    onChange={(page, size) => {
                      setPagination({
                        current: page,
                        pageSize: size,
                        total: filteredTransactions.length
                      });
                    }}
                    onShowSizeChange={(page, size) => {
                      setPagination({
                        current: page,
                        pageSize: size,
                        total: filteredTransactions.length
                      });
                    }}
                    showSizeChanger={true}
                    pageSizeOptions={['10', '20', '50', '100']}
                    showTotal={(total, range) => (
                      <span className="text-sm text-gray-600">
                        {`${range[0]}-${range[1]} của ${total} giao dịch`}
                      </span>
                    )}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Modal
        open={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        title="Chi tiết giao dịch"
        width="max-w-2xl"
      >
        {selectedTransaction && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mã giao dịch</label>
                <p className="text-sm font-mono text-gray-900 mt-1">{selectedTransaction.transactionCode}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Loại giao dịch</label>
                <div className="flex items-center gap-2 mt-1">
                  {getTypeIcon(selectedTransaction.type)}
                  <span className="text-sm text-gray-900">{getTypeName(selectedTransaction.type)}</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Số tiền</label>
                <p className={`text-base font-bold mt-1 ${
                  selectedTransaction.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {selectedTransaction.type === 'DEPOSIT' ? '+' : '-'}
                  {formatPoints(selectedTransaction.netAmount || selectedTransaction.amount)}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phương thức</label>
                <p className="text-sm text-gray-900 mt-1">{selectedTransaction.paymentMethod?.name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</label>
                <div className="mt-1">
                  <Badge className={`${getStatusColor(selectedTransaction.status)} border text-xs`}>
                    {getStatusText(selectedTransaction.status)}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Thời gian tạo</label>
                <p className="text-sm text-gray-900 mt-1">
                  {dayjs(selectedTransaction.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                </p>
              </div>
            </div>

            {selectedTransaction.description && (
              <div className="border-t border-gray-200 pt-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mô tả</label>
                <p className="text-sm text-gray-900 mt-1">{selectedTransaction.description}</p>
              </div>
            )}

            {selectedTransaction.completedAt && (
              <div className="border-t border-gray-200 pt-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Thời gian hoàn thành</label>
                <p className="text-sm text-gray-900 mt-1">
                  {dayjs(selectedTransaction.completedAt).format('DD/MM/YYYY HH:mm:ss')}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

// Main component với Custom Tabs
const TransactionHistory = () => {
  const [activeTabKey, setActiveTabKey] = useState('transactions');

  return (
    <div className="space-y-4">
      {/* Custom Tabs */}
      <div className="flex gap-2 border-b-2 border-gray-200 pb-0">
        <button
          onClick={() => setActiveTabKey('transactions')}
          className={`px-6 py-3 text-sm font-semibold transition-all rounded-t-lg ${
            activeTabKey === 'transactions'
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Lịch sử giao dịch
        </button>
        <button
          onClick={() => setActiveTabKey('betting')}
          className={`px-6 py-3 text-sm font-semibold transition-all rounded-t-lg ${
            activeTabKey === 'betting'
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Lịch sử cược
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTabKey === 'transactions' && <TransactionHistoryTab />}
        {activeTabKey === 'betting' && <BettingHistory />}
      </div>
    </div>
  );
};

export default TransactionHistory;
