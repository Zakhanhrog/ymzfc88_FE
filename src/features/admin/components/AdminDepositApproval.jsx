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
  Image,
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
  FilterOutlined,
  ExclamationCircleOutlined,
  FileImageOutlined
} from '@ant-design/icons';
import { formatCurrency, formatDate } from '../../../utils/helpers';
import adminService from '../services/adminService';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { confirm } = Modal;

const AdminDepositApproval = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
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

  // Helper function để tạo URL cho ảnh
  const getImageUrl = (deposit) => {
    if (deposit.billImage) {
      return `data:image/jpeg;base64,${deposit.billImage}`;
    }
    if (deposit.billImageUrl) {
      const filename = deposit.billImageUrl.split('/').pop();
      return `http://localhost:8080/api/files/bills/${filename}`;
    }
    return null;
  };

  useEffect(() => {
    loadDeposits();
    loadStatistics();
  }, [filters]);

  const loadDeposits = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDepositRequests(filters);
      if (response.success) {
        setDeposits(response.data.content || response.data);
      }
    } catch (error) {
      message.error('Lỗi khi tải danh sách nạp tiền: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await adminService.getDepositStatistics();
      if (response.success) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const showApproveModal = (e, depositId) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedDeposit(deposits.find(d => d.id === depositId));
    setApproveModalVisible(true);
  };

  const showRejectModal = (e, depositId) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedDeposit(deposits.find(d => d.id === depositId));
    setRejectModalVisible(true);
  };

  const confirmApprove = async () => {
    try {
      const response = await adminService.approveDeposit(selectedDeposit.id);
      if (response.success) {
        message.success('Đã duyệt lệnh nạp tiền thành công!');
        setApproveModalVisible(false);
        setSelectedDeposit(null);
        loadDeposits();
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
      const response = await adminService.rejectDeposit(selectedDeposit.id, rejectReason);
      if (response.success) {
        message.success('Đã từ chối lệnh nạp tiền thành công!');
        setRejectModalVisible(false);
        setRejectReason('');
        setSelectedDeposit(null);
        loadDeposits();
        loadStatistics();
      } else {
        message.error('Lỗi khi từ chối: ' + (response.message || 'Không xác định'));
      }
    } catch (error) {
      message.error('Lỗi khi từ chối: ' + error.message);
    }
  };

  const showDepositDetail = (deposit) => {
    setSelectedDeposit(deposit);
    setDetailModalVisible(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'orange';
      case 'APPROVED': return 'green';
      case 'REJECTED': return 'red';
      case 'CANCELLED': return 'gray';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING': return 'Chờ duyệt';
      case 'APPROVED': return 'Đã duyệt';
      case 'REJECTED': return 'Đã từ chối';
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
        <span className="font-bold text-green-600">
          {formatCurrency(amount)}
        </span>
      ),
      sorter: (a, b) => a.amount - b.amount
    },
    {
      title: 'Phương thức',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method, record) => (
        <div className="flex items-center gap-2">
          <div>
            <div>{method?.name}</div>
            <div className="text-gray-500 text-sm">{method?.type}</div>
          </div>
          {(record.billImage || record.billImageUrl) && (
            <FileImageOutlined 
              className="text-blue-500" 
              title="Có ảnh bill chuyển khoản"
            />
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
        { text: 'Đã từ chối', value: 'REJECTED' }
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
            onClick={() => showDepositDetail(record)}
          >
            Chi tiết
          </Button>
          {record.status === 'PENDING' && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                onClick={(e) => showApproveModal(e, record.id)}
                style={{ backgroundColor: '#52c41a' }}
              >
                Duyệt
              </Button>
              <Button
                danger
                size="small"
                icon={<CloseOutlined />}
                onClick={(e) => showRejectModal(e, record.id)}
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
          </Select>
          <RangePicker
            placeholder={['Từ ngày', 'Đến ngày']}
            onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
          />
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={loadDeposits}
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
          dataSource={deposits}
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
        title="Chi tiết lệnh nạp tiền"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedDeposit && (
          <div className="space-y-4">
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Mã giao dịch" span={2}>
                <span className="font-mono text-blue-600">
                  {selectedDeposit.transactionCode}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Người dùng">
                {selectedDeposit.username}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedDeposit.userEmail}
              </Descriptions.Item>
              <Descriptions.Item label="Số tiền">
                <span className="font-bold text-green-600">
                  {formatCurrency(selectedDeposit.amount)}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức">
                {selectedDeposit.paymentMethod?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Số tài khoản">
                {selectedDeposit.paymentMethod?.accountNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian tạo">
                {formatDate(selectedDeposit.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getStatusColor(selectedDeposit.status)}>
                  {getStatusText(selectedDeposit.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú" span={2}>
                {selectedDeposit.description || 'Không có'}
              </Descriptions.Item>
              {selectedDeposit.rejectReason && (
                <Descriptions.Item label="Lý do từ chối" span={2}>
                  <Alert
                    message={selectedDeposit.rejectReason}
                    type="error"
                    showIcon
                  />
                </Descriptions.Item>
              )}
            </Descriptions>

            {(selectedDeposit.billImage || selectedDeposit.billImageUrl) && (
              <Card title="Ảnh bill chuyển khoản" className="mt-4">
                <div className="text-center">
                  <Image
                    src={getImageUrl(selectedDeposit)}
                    alt="Bill chuyển khoản"
                    style={{ maxWidth: '100%', maxHeight: 400 }}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAHpenRVWQAAAABJRU5ErkJggg=="
                  />
                  {selectedDeposit.billImageName && (
                    <p className="mt-2 text-gray-500 text-sm">
                      Tên file: {selectedDeposit.billImageName}
                    </p>
                  )}
                </div>
              </Card>
            )}

            {selectedDeposit.status === 'PENDING' && (
              <div className="flex justify-end space-x-2">
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={() => {
                    setDetailModalVisible(false);
                    showApproveModal(null, selectedDeposit.id);
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
                    showRejectModal(null, selectedDeposit.id);
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
            <span>Duyệt lệnh nạp tiền</span>
          </div>
        }
        open={approveModalVisible}
        onOk={confirmApprove}
        onCancel={() => {
          setApproveModalVisible(false);
          setSelectedDeposit(null);
        }}
        okText="Xác nhận duyệt"
        cancelText="Hủy"
        okButtonProps={{ 
          style: { backgroundColor: '#52c41a' }
        }}
      >
        {selectedDeposit && (
          <div className="space-y-4">
            <Alert
              message="Xác nhận duyệt"
              description="Sau khi duyệt, số tiền sẽ được cộng vào tài khoản người dùng."
              type="success"
              showIcon
            />
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Mã giao dịch">
                <span className="font-mono text-blue-600">
                  {selectedDeposit.transactionCode}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Người dùng">
                <strong>{selectedDeposit.username}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Số tiền">
                <span className="font-bold text-green-600 text-lg">
                  {formatCurrency(selectedDeposit.amount)}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức">
                {selectedDeposit.paymentMethod?.name}
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
            <span>Từ chối lệnh nạp tiền</span>
          </div>
        }
        open={rejectModalVisible}
        onOk={confirmReject}
        onCancel={() => {
          setRejectModalVisible(false);
          setRejectReason('');
          setSelectedDeposit(null);
        }}
        okText="Xác nhận từ chối"
        cancelText="Hủy"
        okType="danger"
      >
        {selectedDeposit && (
          <div className="space-y-4">
            <Alert
              message="Cảnh báo"
              description="Bạn đang từ chối lệnh nạp tiền. Hành động này không thể hoàn tác."
              type="warning"
              showIcon
            />
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Mã giao dịch">
                <span className="font-mono text-blue-600">
                  {selectedDeposit.transactionCode}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Người dùng">
                <strong>{selectedDeposit.username}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Số tiền">
                <span className="font-bold text-green-600">
                  {formatCurrency(selectedDeposit.amount)}
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

export default AdminDepositApproval;