import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  message, 
  Input, 
  Select,
  DatePicker,
  Descriptions,
  Row,
  Col,
  Statistic,
  Alert
} from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
  ExclamationCircleOutlined,
  BankOutlined
} from '@ant-design/icons';
import { formatCurrency, formatDate } from '../../../utils/helpers';
import adminService from '../services/adminService';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const AdminWithdrawApproval = () => {
  const [withdraws, setWithdraws] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedWithdraw, setSelectedWithdraw] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [statistics, setStatistics] = useState({});
  const [filters, setFilters] = useState({
    status: 'PENDING',
    dateRange: null,
    searchText: ''
  });

  useEffect(() => {
    loadWithdraws();
    loadStatistics();
  }, [filters]);

  const loadWithdraws = async () => {
    try {
      setLoading(true);
      const response = await adminService.getWithdrawRequests(filters);
      if (response.success) {
        setWithdraws(response.data.content || response.data);
      }
    } catch (error) {
      message.error('Lỗi khi tải danh sách rút tiền: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await adminService.getWithdrawStatistics();
      if (response.success) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const showApproveModal = (withdrawId) => {
    setSelectedWithdraw(withdraws.find(w => w.id === withdrawId));
    setApproveModalVisible(true);
  };

  const showRejectModal = (withdrawId) => {
    setSelectedWithdraw(withdraws.find(w => w.id === withdrawId));
    setRejectModalVisible(true);
  };

  const confirmApprove = async () => {
    try {
      const response = await adminService.approveWithdraw(selectedWithdraw.id);
      if (response.success) {
        message.success('Đã duyệt lệnh rút tiền thành công!');
        setApproveModalVisible(false);
        setSelectedWithdraw(null);
        loadWithdraws();
        loadStatistics();
      } else {
        message.error('Lỗi khi duyệt: ' + (response.message || 'Không xác định'));
      }
    } catch (error) {
      message.error('Lỗi khi duyệt: ' + error.message);
    }
  };

  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      message.error('Vui lòng nhập lý do từ chối');
      return;
    }
    
    try {
      const response = await adminService.rejectWithdraw(selectedWithdraw.id, rejectReason);
      if (response.success) {
        message.success('Đã từ chối lệnh rút tiền thành công!');
        setRejectModalVisible(false);
        setRejectReason('');
        setSelectedWithdraw(null);
        loadWithdraws();
        loadStatistics();
      } else {
        message.error('Lỗi khi từ chối: ' + (response.message || 'Không xác định'));
      }
    } catch (error) {
      message.error('Lỗi khi từ chối: ' + error.message);
    }
  };

  const showWithdrawDetail = (withdraw) => {
    setSelectedWithdraw(withdraw);
    setDetailModalVisible(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'orange';
      case 'APPROVED': return 'green';
      case 'REJECTED': return 'red';
      case 'PROCESSING': return 'blue';
      case 'COMPLETED': return 'green';
      case 'CANCELLED': return 'gray';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING': return 'Chờ duyệt';
      case 'APPROVED': return 'Đã duyệt';
      case 'REJECTED': return 'Đã từ chối';
      case 'PROCESSING': return 'Đang xử lý';
      case 'COMPLETED': return 'Hoàn thành';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  const columns = [
    {
      title: 'Mã GD',
      dataIndex: 'transactionCode',
      key: 'transactionCode',
      width: 120,
      render: (text) => <span className="font-mono text-blue-600">{text}</span>
    },
    {
      title: 'Người dùng',
      dataIndex: 'username',
      key: 'username',
      render: (text, record) => (
        <div>
          <div className="font-semibold">{text}</div>
          <div className="text-gray-500 text-sm">{record.userEmail}</div>
        </div>
      )
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => (
        <span className="font-bold text-red-600">
          {formatCurrency(amount)}
        </span>
      ),
      sorter: (a, b) => a.amount - b.amount
    },
    {
      title: 'Tài khoản nhận',
      key: 'receiverAccount',
      render: (_, record) => (
        <div>
          <div className="font-semibold">{record.accountName}</div>
          <div className="text-gray-500 text-sm">{record.accountNumber}</div>
          {record.bankCode && (
            <div className="text-gray-400 text-xs">{record.bankCode}</div>
          )}
        </div>
      )
    },
    {
      title: 'Phương thức',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method, record) => (
        <div>
          <div className="font-semibold">{method?.name || 'N/A'}</div>
          <div className="text-gray-500 text-xs">{method?.type}</div>
          {record.accountName && (
            <div className="text-blue-600 text-xs font-medium">
              {record.accountName}
            </div>
          )}
          {record.methodAccount && (
            <div className="text-gray-600 text-xs font-mono">
              {record.methodAccount}
            </div>
          )}
          {record.bankCode && (
            <div className="text-green-600 text-xs">
              {record.bankCode}
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
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
      filters: [
        { text: 'Chờ duyệt', value: 'PENDING' },
        { text: 'Đã duyệt', value: 'APPROVED' },
        { text: 'Đã từ chối', value: 'REJECTED' },
        { text: 'Đang xử lý', value: 'PROCESSING' },
        { text: 'Hoàn thành', value: 'COMPLETED' }
      ]
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => showWithdrawDetail(record)}
          >
            Chi tiết
          </Button>
          {record.status === 'PENDING' && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => showApproveModal(record.id)}
                style={{ backgroundColor: '#52c41a' }}
              >
                Duyệt
              </Button>
              <Button
                danger
                size="small"
                icon={<CloseOutlined />}
                onClick={() => showRejectModal(record.id)}
              >
                Từ chối
              </Button>
            </>
          )}
        </Space>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Chờ duyệt"
              value={statistics.pending || 0}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Đã duyệt hôm nay"
              value={statistics.approvedToday || 0}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Tổng tiền hôm nay"
              value={statistics.totalAmountToday || 0}
              formatter={(value) => formatCurrency(value)}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Từ chối hôm nay"
              value={statistics.rejectedToday || 0}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card>
        <Space wrap>
          <Input
            placeholder="Tìm kiếm mã GD, username..."
            prefix={<SearchOutlined />}
            value={filters.searchText}
            onChange={(e) => setFilters({ ...filters, searchText: e.target.value })}
            style={{ width: 250 }}
          />
          <Select
            placeholder="Trạng thái"
            value={filters.status}
            onChange={(value) => setFilters({ ...filters, status: value })}
            style={{ width: 150 }}
          >
            <Option value="">Tất cả</Option>
            <Option value="PENDING">Chờ duyệt</Option>
            <Option value="APPROVED">Đã duyệt</Option>
            <Option value="REJECTED">Đã từ chối</Option>
            <Option value="PROCESSING">Đang xử lý</Option>
            <Option value="COMPLETED">Hoàn thành</Option>
          </Select>
          <RangePicker
            placeholder={['Từ ngày', 'Đến ngày']}
            onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
          />
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={loadWithdraws}
            loading={loading}
          >
            Làm mới
          </Button>
        </Space>
      </Card>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={withdraws}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} bản ghi`
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết lệnh rút tiền"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedWithdraw && (
          <div className="space-y-4">
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Mã giao dịch" span={2}>
                <span className="font-mono text-blue-600">
                  {selectedWithdraw.transactionCode}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Người dùng">
                {selectedWithdraw.username}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedWithdraw.userEmail}
              </Descriptions.Item>
              <Descriptions.Item label="Số tiền">
                <span className="font-bold text-red-600">
                  {formatCurrency(selectedWithdraw.amount)}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Phí giao dịch">
                <span className="text-orange-600">
                  {formatCurrency(selectedWithdraw.fee || 0)}
                </span>
              </Descriptions.Item>
            </Descriptions>

            <Card title="Thông tin tài khoản nhận" size="small">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Tên tài khoản">
                  <span className="font-semibold">{selectedWithdraw.accountName || 'N/A'}</span>
                </Descriptions.Item>
                <Descriptions.Item label="Số tài khoản/SĐT">
                  <span className="font-mono">{selectedWithdraw.methodAccount || 'N/A'}</span>
                </Descriptions.Item>
                {selectedWithdraw.bankCode && (
                  <Descriptions.Item label="Mã ngân hàng">
                    <Tag icon={<BankOutlined />}>{selectedWithdraw.bankCode}</Tag>
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Phương thức">
                  {selectedWithdraw.paymentMethod?.name || 'N/A'}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Thời gian tạo">
                {formatDate(selectedWithdraw.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getStatusColor(selectedWithdraw.status)}>
                  {getStatusText(selectedWithdraw.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú" span={2}>
                {selectedWithdraw.description || 'Không có'}
              </Descriptions.Item>
              {selectedWithdraw.rejectReason && (
                <Descriptions.Item label="Lý do từ chối" span={2}>
                  <Alert
                    message={selectedWithdraw.rejectReason}
                    type="error"
                    showIcon
                  />
                </Descriptions.Item>
              )}
            </Descriptions>

            {selectedWithdraw.status === 'PENDING' && (
              <div className="flex justify-end space-x-2">
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={() => {
                    setDetailModalVisible(false);
                    showApproveModal(selectedWithdraw.id);
                  }}
                  style={{ backgroundColor: '#52c41a' }}
                >
                  Duyệt ngay
                </Button>
                <Button
                  danger
                  icon={<CloseOutlined />}
                  onClick={() => {
                    setDetailModalVisible(false);
                    showRejectModal(selectedWithdraw.id);
                  }}
                >
                  Từ chối
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Approve Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <CheckOutlined className="text-green-600" />
            <span>Duyệt lệnh rút tiền</span>
          </div>
        }
        open={approveModalVisible}
        onOk={confirmApprove}
        onCancel={() => {
          setApproveModalVisible(false);
          setSelectedWithdraw(null);
        }}
        okText="Xác nhận duyệt"
        cancelText="Hủy"
        okButtonProps={{ 
          style: { backgroundColor: '#52c41a' }
        }}
      >
        {selectedWithdraw && (
          <div className="space-y-4">
            <Alert
              message="Xác nhận duyệt"
              description="Sau khi duyệt, số tiền sẽ được trừ khỏi tài khoản người dùng và chuyển đến tài khoản đã đăng ký."
              type="success"
              showIcon
            />
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Mã giao dịch">
                <span className="font-mono text-blue-600">
                  {selectedWithdraw.transactionCode}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Người dùng">
                <strong>{selectedWithdraw.username}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Số tiền rút">
                <span className="font-bold text-red-600 text-lg">
                  {formatCurrency(selectedWithdraw.amount)}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Tài khoản nhận">
                <div>
                  <div className="font-semibold">{selectedWithdraw.accountName}</div>
                  <div className="font-mono text-sm">{selectedWithdraw.accountNumber}</div>
                </div>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <CloseOutlined className="text-red-600" />
            <span>Từ chối lệnh rút tiền</span>
          </div>
        }
        open={rejectModalVisible}
        onOk={confirmReject}
        onCancel={() => {
          setRejectModalVisible(false);
          setRejectReason('');
          setSelectedWithdraw(null);
        }}
        okText="Xác nhận từ chối"
        cancelText="Hủy"
        okType="danger"
      >
        {selectedWithdraw && (
          <div className="space-y-4">
            <Alert
              message="Cảnh báo"
              description="Bạn đang từ chối lệnh rút tiền. Hành động này không thể hoàn tác."
              type="warning"
              showIcon
            />
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Mã giao dịch">
                <span className="font-mono text-blue-600">
                  {selectedWithdraw.transactionCode}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Người dùng">
                <strong>{selectedWithdraw.username}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Số tiền">
                <span className="font-bold text-red-600">
                  {formatCurrency(selectedWithdraw.amount)}
                </span>
              </Descriptions.Item>
            </Descriptions>
            <div>
              <label className="block text-sm font-medium mb-2">
                Lý do từ chối <span className="text-red-500">*</span>
              </label>
              <TextArea
                rows={4}
                placeholder="Nhập lý do từ chối..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminWithdrawApproval;