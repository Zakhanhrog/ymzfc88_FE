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
import { HEADING_STYLES, BODY_STYLES, FONT_SIZE, FONT_WEIGHT, TEXT_COLORS } from '../../../utils/typography';
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
      render: (amount, record) => (
        <span style={{ 
          color: record.type === 'DEPOSIT' || record.type === 'BONUS' ? '#52c41a' : '#ff4d4f',
          fontSize: FONT_SIZE.md,
          fontWeight: FONT_WEIGHT.bold
        }}>
          {record.type === 'DEPOSIT' || record.type === 'BONUS' ? '+' : '-'}
          {amount?.toLocaleString()} VNĐ
        </span>
      ),
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
      <div className="text-center pb-3">
        <div className="flex items-center justify-center gap-2 mb-1">
          <EyeOutlined className="text-2xl text-blue-600" />
          <h3 style={{ ...HEADING_STYLES.h3, marginBottom: 0 }}>Lịch sử giao dịch</h3>
        </div>
        <p style={{ ...BODY_STYLES.small }}>
          Xem lại tất cả các giao dịch nạp tiền, rút tiền của bạn
        </p>
      </div>

      {/* Statistics Cards - Responsive */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <Card className="shadow-sm" style={{ borderRadius: '12px' }}>
          <div style={{ fontSize: FONT_SIZE.xs, color: TEXT_COLORS.secondary, marginBottom: '4px' }}>Tổng nạp</div>
          <div className="text-green-600 flex items-center gap-1" style={{ fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold }}>
            <ArrowUpOutlined style={{ fontSize: FONT_SIZE.sm }} />
            {stats.totalDeposit.toLocaleString()}
          </div>
        </Card>
        
        <Card className="shadow-sm" style={{ borderRadius: '12px' }}>
          <div style={{ fontSize: FONT_SIZE.xs, color: TEXT_COLORS.secondary, marginBottom: '4px' }}>Tổng rút</div>
          <div className="text-red-600 flex items-center gap-1" style={{ fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold }}>
            <ArrowDownOutlined style={{ fontSize: FONT_SIZE.sm }} />
            {stats.totalWithdraw.toLocaleString()}
          </div>
        </Card>
        
        <Card className="shadow-sm" style={{ borderRadius: '12px' }}>
          <div style={{ fontSize: FONT_SIZE.xs, color: TEXT_COLORS.secondary, marginBottom: '4px' }}>Tổng thưởng</div>
          <div className="text-blue-600 flex items-center gap-1" style={{ fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold }}>
            <ArrowUpOutlined style={{ fontSize: FONT_SIZE.sm }} />
            {stats.totalBonus.toLocaleString()}
          </div>
        </Card>
        
        <Card className="shadow-sm" style={{ borderRadius: '12px' }}>
          <div style={{ fontSize: FONT_SIZE.xs, color: TEXT_COLORS.secondary, marginBottom: '4px' }}>Đang chờ</div>
          <div className="text-orange-500 flex items-center gap-1" style={{ fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold }}>
            <span style={{ fontSize: FONT_SIZE.sm }}>⏳</span>
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
            style={{ fontSize: FONT_SIZE.base }}
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
            style={{ fontSize: FONT_SIZE.base }}
          >
            <Option value="all">Tất cả</Option>
            <Option value="pending">Đang chờ</Option>
            <Option value="completed">Hoàn thành</Option>
            <Option value="failed">Thất bại</Option>
            <Option value="cancelled">Đã hủy</Option>
          </Select>
          
          <RangePicker
            value={filters.dateRange}
            onChange={(dates) => handleFilterChange('dateRange', dates)}
            placeholder={['Từ ngày', 'Đến ngày']}
            size="middle"
            format="DD/MM/YYYY"
            style={{ fontSize: FONT_SIZE.base }}
          />
          
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm mã giao dịch..."
            value={filters.searchText}
            onChange={(e) => handleFilterChange('searchText', e.target.value)}
            size="middle"
            style={{ fontSize: FONT_SIZE.base }}
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            icon={<FilterOutlined />} 
            onClick={resetFilters}
            style={{ fontSize: FONT_SIZE.base }}
          >
            Đặt lại
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={loadTransactionHistory}
            type="primary"
            style={{ fontSize: FONT_SIZE.base }}
          >
            Tải lại
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card className="shadow-sm" style={{ borderRadius: '12px' }}>
        {loading ? (
          <div className="text-center py-8">
            <Spin size="large" />
            <p className="mt-4" style={{ ...BODY_STYLES.base, color: TEXT_COLORS.secondary }}>Đang tải dữ liệu...</p>
          </div>
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
      </Card>

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
                {selectedTransaction.amount?.toLocaleString()} VNĐ
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

export default TransactionHistory;
