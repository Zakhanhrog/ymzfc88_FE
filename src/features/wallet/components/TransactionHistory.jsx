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
    <div>
      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng nạp"
              value={stats.totalDeposit}
              precision={0}
              valueStyle={{ color: '#52c41a' }}
              prefix={<ArrowUpOutlined />}
              suffix="VNĐ"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng rút"
              value={stats.totalWithdraw}
              precision={0}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<ArrowDownOutlined />}
              suffix="VNĐ"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng thưởng"
              value={stats.totalBonus}
              precision={0}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ArrowUpOutlined />}
              suffix="VNĐ"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đang chờ"
              value={stats.pendingCount}
              valueStyle={{ color: '#faad14' }}
              prefix="⏳"
              suffix="giao dịch"
            />
          </Card>
        </Col>
      </Row>

      {/* Filter Section */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col span={4}>
            <Select
              value={filters.type}
              onChange={(value) => handleFilterChange('type', value)}
              style={{ width: '100%' }}
              placeholder="Loại giao dịch"
            >
              <Option value="all">Tất cả</Option>
              <Option value="deposit">Nạp tiền</Option>
              <Option value="withdraw">Rút tiền</Option>
              <Option value="bonus">Thưởng</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              style={{ width: '100%' }}
              placeholder="Trạng thái"
            >
              <Option value="all">Tất cả</Option>
              <Option value="completed">Hoàn thành</Option>
              <Option value="pending">Đang chờ</Option>
              <Option value="failed">Thất bại</Option>
              <Option value="cancelled">Đã hủy</Option>
            </Select>
          </Col>
          <Col span={6}>
            <RangePicker
              value={filters.dateRange}
              onChange={(dates) => handleFilterChange('dateRange', dates)}
              style={{ width: '100%' }}
              placeholder={['Từ ngày', 'Đến ngày']}
            />
          </Col>
          <Col span={6}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Tìm kiếm mã giao dịch..."
              value={filters.searchText}
              onChange={(e) => handleFilterChange('searchText', e.target.value)}
              allowClear
            />
          </Col>
          <Col span={4}>
            <Space>
              <Button 
                icon={<FilterOutlined />} 
                onClick={resetFilters}
              >
                Đặt lại
              </Button>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={loadTransactionHistory}
                loading={loading}
              >
                Tải lại
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Transaction Table */}
      <Card title="Lịch sử giao dịch">
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

      {/* Transaction Detail Modal */}
      <Modal
        title="Chi tiết giao dịch"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedTransaction && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Mã giao dịch" span={2}>
              <span style={{ fontFamily: 'monospace', color: '#1890ff' }}>
                {selectedTransaction.transactionCode}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Loại giao dịch">
              <Space>
                {getTypeIcon(selectedTransaction.type)}
                {getTypeName(selectedTransaction.type)}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={getStatusColor(selectedTransaction.status)}>
                {getStatusText(selectedTransaction.status)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Số tiền">
              <span style={{ 
                color: selectedTransaction.type === 'DEPOSIT' || selectedTransaction.type === 'BONUS' ? '#52c41a' : '#ff4d4f',
                fontWeight: 'bold',
                fontSize: '16px'
              }}>
                {selectedTransaction.type === 'DEPOSIT' || selectedTransaction.type === 'BONUS' ? '+' : '-'}
                {selectedTransaction.amount?.toLocaleString()} VNĐ
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Phương thức thanh toán">
              {selectedTransaction.paymentMethod?.name || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian tạo">
              {dayjs(selectedTransaction.createdAt).format('DD/MM/YYYY HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian cập nhật">
              {selectedTransaction.updatedAt ? 
                dayjs(selectedTransaction.updatedAt).format('DD/MM/YYYY HH:mm:ss') : 
                'N/A'
              }
            </Descriptions.Item>
            {selectedTransaction.description && (
              <Descriptions.Item label="Mô tả" span={2}>
                {selectedTransaction.description}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default TransactionHistory;