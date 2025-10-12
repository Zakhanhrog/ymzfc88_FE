import React, { useState, useEffect } from 'react';
import {
  Card,
  Tag,
  Space,
  Button,
  DatePicker,
  Select,
  Input,
  Modal,
  Descriptions,
  message
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

const MobileTransactionHistory = () => {
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

  const filteredTransactions = transactions.filter(transaction => {
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
  });

  const paginatedTransactions = filteredTransactions.slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize
  );

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

  const loadMore = () => {
    setPagination(prev => ({
      ...prev,
      current: prev.current + 1
    }));
  };

  return (
    <div className="space-y-4">
      {/* Statistics Cards - Mobile Optimized */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <div className="text-xs text-gray-500 mb-1">Tổng nạp</div>
          <div className="text-green-600 flex items-center justify-center gap-1">
            <ArrowUpOutlined className="text-xs" />
            <span className="text-sm font-bold">{stats.totalDeposit.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <div className="text-xs text-gray-500 mb-1">Tổng rút</div>
          <div className="text-red-600 flex items-center justify-center gap-1">
            <ArrowDownOutlined className="text-xs" />
            <span className="text-sm font-bold">{stats.totalWithdraw.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <div className="text-xs text-gray-500 mb-1">Tổng thưởng</div>
          <div className="text-blue-600 flex items-center justify-center gap-1">
            <ArrowUpOutlined className="text-xs" />
            <span className="text-sm font-bold">{stats.totalBonus.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <div className="text-xs text-gray-500 mb-1">Đang chờ</div>
          <div className="text-orange-500 flex flex-col items-center gap-1">
            <span className="text-sm font-bold">{stats.pendingCount}</span>
            <span className="text-xs">giao dịch</span>
          </div>
        </div>
      </div>

      {/* Filter Section - Mobile Optimized */}
      <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
        {/* Filter Row 1 */}
        <div className="grid grid-cols-2 gap-2">
          <Select
            value={filters.type}
            onChange={(value) => handleFilterChange('type', value)}
            placeholder="Tất cả"
            size="small"
            className="text-xs"
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
            size="small"
            className="text-xs"
          >
            <Option value="all">Tất cả</Option>
            <Option value="pending">Đang chờ</Option>
            <Option value="completed">Hoàn thành</Option>
            <Option value="failed">Thất bại</Option>
            <Option value="cancelled">Đã hủy</Option>
          </Select>
        </div>

        {/* Filter Row 2 */}
        <div className="grid grid-cols-1 gap-2">
          <RangePicker
            value={filters.dateRange}
            onChange={(dates) => handleFilterChange('dateRange', dates)}
            placeholder={['Từ ngày', 'Đến ngày']}
            size="small"
            format="DD/MM/YYYY"
            className="text-xs"
          />
        </div>

        {/* Filter Row 3 */}
        <div className="grid grid-cols-1 gap-2">
          <Input
            prefix={<SearchOutlined className="text-xs" />}
            placeholder="Tìm kiếm mã giao dịch..."
            value={filters.searchText}
            onChange={(e) => handleFilterChange('searchText', e.target.value)}
            size="small"
            className="text-xs"
          />
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            icon={<FilterOutlined className="text-xs" />} 
            onClick={resetFilters}
            size="small"
            className="flex-1 text-xs"
          >
            Đặt lại
          </Button>
          <Button 
            icon={<ReloadOutlined className="text-xs" />} 
            onClick={loadTransactionHistory}
            type="primary"
            size="small"
            className="flex-1 text-xs"
          >
            Tải lại
          </Button>
        </div>
      </div>

      {/* Transaction List - Mobile Optimized */}
      <div className="space-y-2">
        {paginatedTransactions.length === 0 ? ( 
          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <div className="text-gray-400 mb-2">
              <EyeOutlined className="text-3xl" />
            </div>
            <p className="text-gray-500 text-sm">Không có giao dịch nào</p>
          </div>
        ) : (
          paginatedTransactions.map((transaction) => (
            <div key={transaction.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getTypeIcon(transaction.type)}
                  <span className="font-medium text-sm">{getTypeName(transaction.type)}</span>
                </div>
                <Tag color={getStatusColor(transaction.status)} className="text-xs">
                  {getStatusText(transaction.status)}
                </Tag>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 font-mono">{transaction.transactionCode}</span>
                <span className={`text-sm font-bold ${
                  transaction.type === 'DEPOSIT' || transaction.type === 'BONUS' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'DEPOSIT' || transaction.type === 'BONUS' ? '+' : '-'}
                  {transaction.amount?.toLocaleString()} VNĐ
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {dayjs(transaction.createdAt).format('DD/MM/YYYY HH:mm')}
                </span>
                <Button
                  type="link"
                  size="small"
                  icon={<EyeOutlined className="text-xs" />}
                  onClick={() => showTransactionDetail(transaction)}
                  className="text-xs p-0 h-auto"
                >
                  Chi tiết
                </Button>
              </div>
            </div>
          ))
        )}

        {/* Load More Button */}
        {paginatedTransactions.length > 0 && paginatedTransactions.length < filteredTransactions.length && (
          <div className="text-center pt-4">
            <Button 
              onClick={loadMore}
              className="w-full"
            >
              Tải thêm
            </Button>
          </div>
        )}
      </div>

      {/* Detail Modal - Mobile Optimized */}
      <Modal
        title={<span className="text-base font-bold">Chi tiết giao dịch</span>}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)} className="text-sm">
            Đóng
          </Button>
        ]}
        width="90%"
        className="mobile-modal"
      >
        {selectedTransaction && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Mã giao dịch:</span>
                <div className="font-mono text-xs">{selectedTransaction.transactionCode}</div>
              </div>
              <div>
                <span className="text-gray-500">Loại:</span>
                <div>{getTypeName(selectedTransaction.type)}</div>
              </div>
              <div>
                <span className="text-gray-500">Số tiền:</span>
                <div className={`font-bold ${
                  selectedTransaction.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {selectedTransaction.type === 'DEPOSIT' ? '+' : '-'}
                  {selectedTransaction.amount?.toLocaleString()} VNĐ
                </div>
              </div>
              <div>
                <span className="text-gray-500">Trạng thái:</span>
                <Tag color={getStatusColor(selectedTransaction.status)} className="text-xs">
                  {getStatusText(selectedTransaction.status)}
                </Tag>
              </div>
            </div>
            
            {selectedTransaction.description && (
              <div>
                <span className="text-gray-500 text-sm">Mô tả:</span>
                <div className="text-sm">{selectedTransaction.description}</div>
              </div>
            )}
            
            <div className="text-xs text-gray-400">
              Tạo lúc: {dayjs(selectedTransaction.createdAt).format('DD/MM/YYYY HH:mm:ss')}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MobileTransactionHistory;
