import React, { useState, useEffect } from 'react';
import {
  Card,
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
  message,
  Spin
} from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import walletService from '../services/walletService';

const { RangePicker } = DatePicker;
const { Option } = Select;

const TransactionHistory = () => {
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

  // Load transaction history when component mounts
  useEffect(() => {
    loadTransactionHistory();
  }, [pagination.current, pagination.pageSize]);

  const loadTransactionHistory = async () => {
    try {
      setLoading(true);
      const response = await walletService.getTransactionHistory(
        pagination.current - 1, 
        pagination.pageSize
      );
      
      if (response.success) {
        setTransactions(response.data.content || []);
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

  // Calculate statistics from real data
  const calculateStats = () => {
    return {
      totalDeposit: transactions.filter(t => t.type === 'DEPOSIT' && t.status === 'COMPLETED')
        .reduce((sum, t) => sum + (t.amount || 0), 0),
      totalWithdraw: transactions.filter(t => t.type === 'WITHDRAW' && t.status === 'COMPLETED')
        .reduce((sum, t) => sum + (t.amount || 0), 0),
      totalBonus: transactions.filter(t => t.type === 'BONUS' && t.status === 'COMPLETED')
        .reduce((sum, t) => sum + (t.amount || 0), 0),
      pendingCount: transactions.filter(t => t.status === 'PENDING').length
    };
  };

  const stats = calculateStats();

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
        return <ArrowUpOutlined style={{ color: '#52c41a' }} />;
      case 'WITHDRAW':
        return <ArrowDownOutlined style={{ color: '#ff4d4f' }} />;
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
  const filteredTransactions = transactions.filter(transaction => {
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
      title: 'Mã giao dịch',
      dataIndex: 'transactionCode',
      key: 'transactionCode',
      render: (text) => (
        <span style={{ fontFamily: 'monospace', color: '#1890ff' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Space>
          {getTypeIcon(type)}
          <span>{getTypeName(type)}</span>
        </Space>
      ),
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount, record) => (
        <span style={{ 
          color: record.type === 'DEPOSIT' || record.type === 'BONUS' ? '#52c41a' : '#ff4d4f',
          fontWeight: 'bold'
        }}>
          {record.type === 'DEPOSIT' || record.type === 'BONUS' ? '+' : '-'}
          {amount?.toLocaleString()} VNĐ
        </span>
      ),
    },
    {
      title: 'Phương thức',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (paymentMethod) => paymentMethod?.name || 'N/A',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => showTransactionDetail(record)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Title Header */}
      <div className="text-center pb-3">
        <div className="flex items-center justify-center gap-2 mb-1">
          <EyeOutlined className="text-2xl text-blue-600" />
          <h3 className="text-xl md:text-2xl font-bold mb-0 text-gray-800">Lịch sử giao dịch</h3>
        </div>
        <p className="text-sm text-gray-500">
          Xem lại tất cả các giao dịch nạp tiền, rút tiền của bạn
        </p>
      </div>

      {/* Statistics Cards - Responsive */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <Card className="shadow-sm" style={{ borderRadius: '12px' }}>
          <div className="text-xs text-gray-500 mb-1">Tổng nạp</div>
          <div className="text-lg md:text-xl font-bold text-green-600 flex items-center gap-1">
            <ArrowUpOutlined className="text-sm" />
            {stats.totalDeposit.toLocaleString()}
          </div>
        </Card>
        
        <Card className="shadow-sm" style={{ borderRadius: '12px' }}>
          <div className="text-xs text-gray-500 mb-1">Tổng rút</div>
          <div className="text-lg md:text-xl font-bold text-red-600 flex items-center gap-1">
            <ArrowDownOutlined className="text-sm" />
            {stats.totalWithdraw.toLocaleString()}
          </div>
        </Card>
        
        <Card className="shadow-sm" style={{ borderRadius: '12px' }}>
          <div className="text-xs text-gray-500 mb-1">Tổng thưởng</div>
          <div className="text-lg md:text-xl font-bold text-blue-600 flex items-center gap-1">
            <ArrowUpOutlined className="text-sm" />
            {stats.totalBonus.toLocaleString()}
          </div>
        </Card>
        
        <Card className="shadow-sm" style={{ borderRadius: '12px' }}>
          <div className="text-xs text-gray-500 mb-1">Đang chờ</div>
          <div className="text-lg md:text-xl font-bold text-orange-500 flex items-center gap-1">
            <span className="text-sm">⏳</span>
            {stats.pendingCount} giao dịch
          </div>
        </Card>
      </div>

      {/* Filter Section - Responsive */}
      <Card className="shadow-sm" style={{ borderRadius: '12px' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          <Select
            value={filters.type}
            onChange={(value) => handleFilterChange('type', value)}
            placeholder="Tất cả"
            size="middle"
          >
            <Option value="all">Tất cả</Option>
            <Option value="deposit">Nạp tiền</Option>
            <Option value="withdraw">Rút tiền</Option>
            <Option value="bonus">Thưởng</Option>
          </Select>
          
          <Select
            value={filters.status}
            onChange={(value) => handleFilterChange('status', value)}
            placeholder="Tất cả"
            size="middle"
          >
            <Option value="all">Tất cả</Option>
            <Option value="completed">Hoàn thành</Option>
            <Option value="pending">Đang chờ</Option>
            <Option value="failed">Thất bại</Option>
          </Select>
          
          <div className="col-span-2 md:col-span-2 flex gap-2">
            <RangePicker
              value={filters.dateRange}
              onChange={(dates) => handleFilterChange('dateRange', dates)}
              className="flex-1"
              placeholder={['Từ ngày', 'Đến ngày']}
              size="middle"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm mã giao dịch..."
            value={filters.searchText}
            onChange={(e) => handleFilterChange('searchText', e.target.value)}
            allowClear
            size="middle"
            className="flex-1"
          />
          <Button 
            icon={<FilterOutlined />} 
            onClick={resetFilters}
            size="middle"
          >
            Đặt lại
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={loadTransactionHistory}
            loading={loading}
            size="middle"
          >
            Tải lại
          </Button>
        </div>
      </Card>

      {/* Transaction Table - Desktop */}
      <div className="hidden md:block">
        <Card className="shadow-sm" style={{ borderRadius: '12px' }}>
          <Table
            columns={columns}
            dataSource={paginatedTransactions}
            rowKey="id"
            loading={loading}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} giao dịch`,
              onChange: handleTableChange,
              onShowSizeChange: handleTableChange
            }}
          />
        </Card>
      </div>

      {/* Transaction List - Mobile */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="text-center py-8">
            <Spin size="large" />
          </div>
        ) : paginatedTransactions.length > 0 ? (
          paginatedTransactions.map(transaction => (
            <Card 
              key={transaction.id}
              className="shadow-sm"
              style={{ borderRadius: '12px' }}
              styles={{ body: { padding: '12px' } }}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(transaction.type)}
                    <span className="font-semibold text-sm">{getTypeName(transaction.type)}</span>
                  </div>
                  <Tag color={getStatusColor(transaction.status)} className="text-xs">
                    {getStatusText(transaction.status)}
                  </Tag>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Mã GD:</span>
                  <span className="font-mono text-xs text-blue-600">{transaction.transactionCode}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Số tiền:</span>
                  <span className={`font-bold text-base ${
                    transaction.type === 'DEPOSIT' || transaction.type === 'BONUS' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'DEPOSIT' || transaction.type === 'BONUS' ? '+' : '-'}
                    {transaction.amount?.toLocaleString()} đ
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Thời gian:</span>
                  <span className="text-xs">{dayjs(transaction.createdAt).format('DD/MM/YYYY HH:mm')}</span>
                </div>
                
                <Button
                  type="link"
                  icon={<EyeOutlined />}
                  onClick={() => showTransactionDetail(transaction)}
                  size="small"
                  className="w-full mt-2"
                >
                  Xem chi tiết
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <Card style={{ textAlign: 'center', padding: '40px 0' }}>
            <p className="text-gray-500">Chưa có giao dịch nào</p>
          </Card>
        )}
        
        {/* Mobile Pagination */}
        {paginatedTransactions.length > 0 && (
          <div className="flex justify-center gap-2 mt-4">
            <Button
              disabled={pagination.current === 1}
              onClick={() => setPagination(prev => ({ ...prev, current: prev.current - 1 }))}
            >
              Trước
            </Button>
            <span className="flex items-center px-3 text-sm">
              {pagination.current} / {Math.ceil(filteredTransactions.length / pagination.pageSize)}
            </span>
            <Button
              disabled={pagination.current >= Math.ceil(filteredTransactions.length / pagination.pageSize)}
              onClick={() => setPagination(prev => ({ ...prev, current: prev.current + 1 }))}
            >
              Sau
            </Button>
          </div>
        )}
      </div>

      {/* Transaction Detail Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <EyeOutlined className="text-blue-600" />
            <span>Chi tiết giao dịch</span>
          </div>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={window.innerWidth < 768 ? '95%' : 600}
      >
        {selectedTransaction && (
          <div className="space-y-4">
            {/* Mã giao dịch */}
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Mã giao dịch</div>
              <div className="font-mono text-lg font-semibold text-blue-600">
                {selectedTransaction.transactionCode}
              </div>
            </div>

            {/* Số tiền - Highlight */}
            <div className="text-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Số tiền</div>
              <div className={`text-3xl font-bold ${
                selectedTransaction.type === 'DEPOSIT' || selectedTransaction.type === 'BONUS' ? 'text-green-600' : 'text-red-600'
              }`}>
                {selectedTransaction.type === 'DEPOSIT' || selectedTransaction.type === 'BONUS' ? '+' : '-'}
                {selectedTransaction.amount?.toLocaleString()} đ
              </div>
            </div>

            {/* Thông tin chi tiết */}
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-gray-600">Loại giao dịch</span>
                <div className="flex items-center gap-2 font-medium">
                  {getTypeIcon(selectedTransaction.type)}
                  {getTypeName(selectedTransaction.type)}
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-gray-600">Trạng thái</span>
                <Tag color={getStatusColor(selectedTransaction.status)}>
                  {getStatusText(selectedTransaction.status)}
                </Tag>
              </div>

              {selectedTransaction.paymentMethod && (
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-gray-600">Phương thức</span>
                  <span className="font-medium">{selectedTransaction.paymentMethod.name}</span>
                </div>
              )}

              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-gray-600">Thời gian tạo</span>
                <span className="font-medium text-sm">
                  {dayjs(selectedTransaction.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                </span>
              </div>

              {selectedTransaction.updatedAt && (
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-gray-600">Cập nhật lần cuối</span>
                  <span className="font-medium text-sm">
                    {dayjs(selectedTransaction.updatedAt).format('DD/MM/YYYY HH:mm:ss')}
                  </span>
                </div>
              )}

              {selectedTransaction.description && (
                <div className="py-2">
                  <div className="text-sm text-gray-600 mb-1">Ghi chú</div>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm">
                    {selectedTransaction.description}
                  </div>
                </div>
              )}
            </div>

            {/* Close button */}
            <div className="pt-4">
              <Button 
                block 
                size="large"
                onClick={() => setDetailModalVisible(false)}
                style={{ borderRadius: '8px' }}
              >
                Đóng
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TransactionHistory;