import React, { useState, useEffect } from 'react';
import {
  Card as AntCard,
  Table,
  Tag,
  Space,
  Button,
  DatePicker,
  Select,
  Input,
  Modal,
  Descriptions,
  Row,
  Col,
  Statistic,
  message
} from 'antd';
import Loading from '../../../components/common/Loading';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { HEADING_STYLES, BODY_STYLES, FONT_SIZE, FONT_WEIGHT, TEXT_COLORS } from '../../../utils/typography';
import walletService from '../services/walletService';
import BettingHistory from './BettingHistory';
import { Card, CardContent } from '../../../components/ui/Card';
import { formatPoints } from '../../../utils/helpers';

const { RangePicker } = DatePicker;
const { Option } = Select;

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
        // Sắp xếp theo createdAt DESC (mới nhất trước) để đảm bảo thứ tự đúng
        transactions.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA; // DESC order
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
      case 'COMPLETED': case 'APPROVED': return 'green';
      case 'PENDING': return 'orange';
      case 'FAILED': case 'REJECTED': return 'red';
      case 'CANCELLED': return 'gray';
      default: return 'blue';
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
        return <img src="/iconacc/imgi_25_deposit.avif" alt="Nạp tiền" className="w-5 h-5" />;
      case 'WITHDRAW':
        return <img src="/iconacc/imgi_26_withdraw.avif" alt="Rút tiền" className="w-5 h-5" />;
      case 'BONUS':
        return <ArrowUpOutlined style={{ color: '#1890ff' }} />;
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
      // Filter by type
      if (filters.type !== 'all' && transaction.type !== filters.type.toUpperCase()) {
        return false;
      }
      
      // Filter by status
      if (filters.status !== 'all' && transaction.status !== filters.status.toUpperCase()) {
        return false;
      }
      
      // Filter by date range
      if (filters.dateRange && filters.dateRange.length === 2) {
        const transactionDate = dayjs(transaction.createdAt);
        const [startDate, endDate] = filters.dateRange;
        if (!transactionDate.isBetween(startDate, endDate, 'day', '[]')) {
          return false;
        }
      }
      
      // Filter by search text
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
    // Đảm bảo sắp xếp theo createdAt DESC sau khi filter
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB - dateA; // DESC order
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
      title: <span style={{ ...HEADING_STYLES.h6 }}>Mã giao dịch</span>,
      dataIndex: 'transactionCode',
      key: 'transactionCode',
      render: (text) => (
        <span style={{ fontFamily: 'monospace', color: '#1890ff', fontSize: FONT_SIZE.sm }}>
          {text}
        </span>
      ),
    },
    {
      title: <span style={{ ...HEADING_STYLES.h6 }}>Loại</span>,
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Space>
          {getTypeIcon(type)}
          <span style={{ fontSize: FONT_SIZE.base }}>{getTypeName(type)}</span>
        </Space>
      ),
    },
    {
      title: <span style={{ ...HEADING_STYLES.h6 }}>Số tiền</span>,
      dataIndex: 'amount',
      key: 'amount',
      render: (amount, record) => {
        const netAmount = record.netAmount || amount;
        return (
          <span style={{ 
            color: record.type === 'DEPOSIT' || record.type === 'BONUS' ? '#52c41a' : '#ff4d4f',
            fontSize: FONT_SIZE.md,
            fontWeight: FONT_WEIGHT.bold
          }}>
            {record.type === 'DEPOSIT' || record.type === 'BONUS' ? '+' : '-'}
            {formatPoints(netAmount)}
          </span>
        );
      },
    },
    {
      title: <span style={{ ...HEADING_STYLES.h6 }}>Phương thức</span>,
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (paymentMethod) => <span style={{ ...BODY_STYLES.base }}>{paymentMethod?.name || 'N/A'}</span>,
    },
    {
      title: <span style={{ ...HEADING_STYLES.h6 }}>Trạng thái</span>,
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)} style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium }}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: <span style={{ ...HEADING_STYLES.h6 }}>Thời gian</span>,
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => <span style={{ fontSize: FONT_SIZE.sm }}>{dayjs(date).format('DD/MM/YYYY HH:mm')}</span>,
    },
    {
      title: <span style={{ ...HEADING_STYLES.h6 }}>Hành động</span>,
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => showTransactionDetail(record)}
          style={{ fontSize: FONT_SIZE.base }}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Title Header */}


      {/* Statistics Cards - Responsive */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-1">Tổng nạp</div>
              <div className="text-lg font-bold text-green-600">{formatPoints(stats.totalDeposit)}</div>
          </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-1">Tổng rút</div>
              <div className="text-lg font-bold text-green-600">{formatPoints(stats.totalWithdraw)}</div>
          </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-1">Đang chờ</div>
              <div className="text-lg font-bold text-orange-600">{stats.pendingCount} giao dịch</div>
          </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <AntCard className="shadow-sm" style={{ borderRadius: '12px' }}>
        {loading ? (
          <Loading />
        ) : (
          <Table
            columns={columns}
            dataSource={paginatedTransactions}
            pagination={{
              ...pagination,
              total: filteredTransactions.length,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => (
                <span style={{ fontSize: FONT_SIZE.sm }}>
                  {`${range[0]}-${range[1]} của ${total} giao dịch`}
                </span>
              ),
            }}
            rowKey="id"
            onChange={handleTableChange}
            scroll={{ x: 1000 }}
          />
        )}
      </AntCard>

      {/* Detail Modal */}
      <Modal
        title={<span style={{ ...HEADING_STYLES.h4 }}>Chi tiết giao dịch</span>}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)} style={{ fontSize: FONT_SIZE.base }}>
            Đóng
          </Button>
        ]}
        width={700}
      >
        {selectedTransaction && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label={<span style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium }}>Mã giao dịch</span>}>
              <span style={{ fontFamily: 'monospace', fontSize: FONT_SIZE.sm }}>{selectedTransaction.transactionCode}</span>
            </Descriptions.Item>
            <Descriptions.Item label={<span style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium }}>Loại giao dịch</span>}>
              <span style={{ fontSize: FONT_SIZE.base }}>{getTypeName(selectedTransaction.type)}</span>
            </Descriptions.Item>
            <Descriptions.Item label={<span style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium }}>Số tiền</span>}>
              <span style={{ fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: selectedTransaction.type === 'DEPOSIT' ? '#52c41a' : '#ff4d4f' }}>
                {selectedTransaction.type === 'DEPOSIT' ? '+' : '-'}
                {formatPoints(selectedTransaction.netAmount || selectedTransaction.amount)}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label={<span style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium }}>Phương thức</span>}>
              <span style={{ fontSize: FONT_SIZE.base }}>{selectedTransaction.paymentMethod?.name || 'N/A'}</span>
            </Descriptions.Item>
            <Descriptions.Item label={<span style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium }}>Trạng thái</span>}>
              <Tag color={getStatusColor(selectedTransaction.status)} style={{ fontSize: FONT_SIZE.sm }}>
                {getStatusText(selectedTransaction.status)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={<span style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium }}>Mô tả</span>}>
              <span style={{ ...BODY_STYLES.base }}>{selectedTransaction.description || 'Không có'}</span>
            </Descriptions.Item>
            <Descriptions.Item label={<span style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium }}>Thời gian tạo</span>}>
              <span style={{ fontSize: FONT_SIZE.base }}>{dayjs(selectedTransaction.createdAt).format('DD/MM/YYYY HH:mm:ss')}</span>
            </Descriptions.Item>
            {selectedTransaction.completedAt && (
              <Descriptions.Item label={<span style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium }}>Thời gian hoàn thành</span>}>
                <span style={{ fontSize: FONT_SIZE.base }}>{dayjs(selectedTransaction.completedAt).format('DD/MM/YYYY HH:mm:ss')}</span>
              </Descriptions.Item>
            )}
          </Descriptions>
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
