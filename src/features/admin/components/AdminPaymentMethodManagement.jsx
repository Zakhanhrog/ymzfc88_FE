import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Card,
  Row,
  Col,
  Statistic,
  Popconfirm,
  message,
  Drawer,
  Divider,
  InputNumber,
  Typography,
  Tooltip,
  Switch,
  Upload,
  Image
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  EyeOutlined,
  CreditCardOutlined,
  BankOutlined,
  DollarOutlined,
  PercentageOutlined,
  ClockCircleOutlined,
  UploadOutlined,
  QrcodeOutlined
} from '@ant-design/icons';
import { adminService } from '../services/adminService';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

const AdminPaymentMethodManagement = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Payment method types
  const paymentTypes = [
    { value: 'MOMO', label: 'Ví MoMo', icon: '📱', color: 'pink' },
    { value: 'BANK', label: 'Ngân hàng', icon: '🏦', color: 'blue' },
    { value: 'USDT', label: 'USDT', icon: '💰', color: 'gold' },
    { value: 'ZALO_PAY', label: 'ZaloPay', icon: '💳', color: 'cyan' },
    { value: 'VIET_QR', label: 'VietQR', icon: '📲', color: 'green' }
  ];

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllPaymentMethods();
      if (response.success) {
        setPaymentMethods(response.data);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Create payment method
  const handleCreatePaymentMethod = async (values) => {
    try {
      const response = await adminService.createPaymentMethod(values);
      if (response.success) {
        message.success('Tạo phương thức thanh toán thành công!');
        setShowCreateModal(false);
        createForm.resetFields();
        loadPaymentMethods();
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  // Update payment method
  const handleUpdatePaymentMethod = async (values) => {
    try {
      const response = await adminService.updatePaymentMethod(selectedPaymentMethod.id, values);
      if (response.success) {
        message.success('Cập nhật phương thức thanh toán thành công!');
        setShowEditModal(false);
        editForm.resetFields();
        setSelectedPaymentMethod(null);
        loadPaymentMethods();
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  // Delete payment method
  const handleDeletePaymentMethod = async (id) => {
    try {
      const response = await adminService.deletePaymentMethod(id);
      if (response.success) {
        message.success('Xóa phương thức thanh toán thành công!');
        loadPaymentMethods();
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  // Toggle status
  const handleToggleStatus = async (id) => {
    try {
      const response = await adminService.togglePaymentMethodStatus(id);
      if (response.success) {
        message.success('Cập nhật trạng thái thành công!');
        loadPaymentMethods();
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  // Show modals
  const showEditPaymentMethodModal = (paymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
    editForm.setFieldsValue({
      ...paymentMethod,
      minAmount: paymentMethod.minAmount,
      maxAmount: paymentMethod.maxAmount,
      feePercent: paymentMethod.feePercent,
      feeFixed: paymentMethod.feeFixed
    });
    setShowEditModal(true);
  };

  const showPaymentMethodDetail = (paymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
    setShowDetailDrawer(true);
  };

  // Get payment type config
  const getPaymentTypeConfig = (type) => {
    return paymentTypes.find(pt => pt.value === type) || { label: type, icon: '💳', color: 'default' };
  };

  // Table columns
  const columns = [
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type) => {
        const config = getPaymentTypeConfig(type);
        return (
          <Tag color={config.color} style={{ fontSize: '12px' }}>
            {config.icon} {config.label}
          </Tag>
        );
      },
    },
    {
      title: 'Thông tin',
      key: 'info',
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.name}</div>
          <div className="text-gray-500 text-sm">
            {record.accountNumber} - {record.accountName}
          </div>
          {record.bankCode && (
            <div className="text-gray-400 text-xs">Mã ngân hàng: {record.bankCode}</div>
          )}
        </div>
      ),
    },
    {
      title: 'Giới hạn',
      key: 'limits',
      width: 150,
      render: (_, record) => (
        <div className="text-sm">
          <div>Min: {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }).format(record.minAmount)}</div>
          <div>Max: {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }).format(record.maxAmount)}</div>
        </div>
      ),
    },
    {
      title: 'Phí',
      key: 'fees',
      width: 120,
      render: (_, record) => (
        <div className="text-sm">
          {record.feePercent > 0 && (
            <div className="text-orange-600">{record.feePercent}%</div>
          )}
          {record.feeFixed > 0 && (
            <div className="text-blue-600">
              +{new Intl.NumberFormat('vi-VN').format(record.feeFixed)} VNĐ
            </div>
          )}
          {record.feePercent === 0 && record.feeFixed === 0 && (
            <div className="text-green-600">Miễn phí</div>
          )}
        </div>
      ),
    },
    {
      title: 'Thời gian xử lý',
      dataIndex: 'processingTime',
      key: 'processingTime',
      width: 120,
      render: (time) => (
        <Text className="text-gray-600">
          <ClockCircleOutlined className="mr-1" />
          {time || 'Ngay lập tức'}
        </Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={() => handleToggleStatus(record.id)}
          checkedChildren="Hoạt động"
          unCheckedChildren="Tạm khóa"
        />
      ),
    },
    {
      title: 'Thứ tự',
      dataIndex: 'displayOrder',
      key: 'displayOrder',
      width: 80,
      render: (order) => (
        <div className="text-center font-medium">{order}</div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => showPaymentMethodDetail(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => showEditPaymentMethodModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc muốn xóa phương thức thanh toán này?"
            onConfirm={() => handleDeletePaymentMethod(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Stats calculation
  const activeCount = paymentMethods.filter(pm => pm.isActive).length;
  const inactiveCount = paymentMethods.length - activeCount;
  const typeStats = paymentTypes.map(type => ({
    ...type,
    count: paymentMethods.filter(pm => pm.type === type.value).length
  }));

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng phương thức"
              value={paymentMethods.length}
              prefix={<CreditCardOutlined className="text-blue-600" />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đang hoạt động"
              value={activeCount}
              prefix={<BankOutlined className="text-green-600" />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tạm khóa"
              value={inactiveCount}
              prefix={<DollarOutlined className="text-red-600" />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Loại phổ biến nhất"
              value={typeStats.reduce((prev, current) => (prev.count > current.count) ? prev : current, typeStats[0])?.label || 'N/A'}
              prefix={<PercentageOutlined className="text-purple-600" />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Table */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Title level={4} className="mb-0">Danh sách phương thức thanh toán</Title>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowCreateModal(true)}
            >
              Thêm phương thức
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadPaymentMethods}
              loading={loading}
            >
              Làm mới
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={paymentMethods}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} phương thức`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Create Payment Method Modal */}
      <Modal
        title="Thêm phương thức thanh toán"
        open={showCreateModal}
        onCancel={() => {
          setShowCreateModal(false);
          createForm.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreatePaymentMethod}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Loại phương thức"
                rules={[{ required: true, message: 'Vui lòng chọn loại phương thức' }]}
              >
                <Select placeholder="Chọn loại phương thức">
                  {paymentTypes.map(type => (
                    <Option key={type.value} value={type.value}>
                      <Tag color={type.color}>{type.icon} {type.label}</Tag>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên hiển thị"
                rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị' }]}
              >
                <Input placeholder="VD: Ví MoMo chính" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="accountNumber"
                label="Số tài khoản/SĐT"
                rules={[{ required: true, message: 'Vui lòng nhập số tài khoản' }]}
              >
                <Input placeholder="Số tài khoản hoặc số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="accountName"
                label="Tên chủ tài khoản"
                rules={[{ required: true, message: 'Vui lòng nhập tên chủ tài khoản' }]}
              >
                <Input placeholder="Họ và tên chủ tài khoản" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="bankCode"
            label="Mã ngân hàng (nếu có)"
          >
            <Input placeholder="VD: VCB, TCB, MB..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="minAmount"
                label="Số tiền tối thiểu"
                rules={[{ required: true, message: 'Vui lòng nhập số tiền tối thiểu' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={1000}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  placeholder="1,000"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="maxAmount"
                label="Số tiền tối đa"
                rules={[{ required: true, message: 'Vui lòng nhập số tiền tối đa' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={1000}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  placeholder="10,000,000"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="feePercent"
                label="Phí theo % (0-100)"
                initialValue={0}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  max={100}
                  step={0.1}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="feeFixed"
                label="Phí cố định (VNĐ)"
                initialValue={0}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="processingTime"
                label="Thời gian xử lý"
              >
                <Input placeholder="VD: Ngay lập tức, 1-5 phút..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="displayOrder"
                label="Thứ tự hiển thị"
                initialValue={1}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={1}
                  placeholder="1"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <TextArea
              rows={3}
              placeholder="Mô tả chi tiết về phương thức thanh toán..."
            />
          </Form.Item>

          <Form.Item
            name="qrCode"
            label="Mã QR (URL)"
          >
            <Input placeholder="URL đến ảnh mã QR" />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Trạng thái"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Tạm khóa" />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => {
                setShowCreateModal(false);
                createForm.resetFields();
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Tạo phương thức
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Payment Method Modal */}
      <Modal
        title="Chỉnh sửa phương thức thanh toán"
        open={showEditModal}
        onCancel={() => {
          setShowEditModal(false);
          editForm.resetFields();
          setSelectedPaymentMethod(null);
        }}
        footer={null}
        width={800}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdatePaymentMethod}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Loại phương thức"
                rules={[{ required: true, message: 'Vui lòng chọn loại phương thức' }]}
              >
                <Select placeholder="Chọn loại phương thức">
                  {paymentTypes.map(type => (
                    <Option key={type.value} value={type.value}>
                      <Tag color={type.color}>{type.icon} {type.label}</Tag>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên hiển thị"
                rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị' }]}
              >
                <Input placeholder="VD: Ví MoMo chính" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="accountNumber"
                label="Số tài khoản/SĐT"
                rules={[{ required: true, message: 'Vui lòng nhập số tài khoản' }]}
              >
                <Input placeholder="Số tài khoản hoặc số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="accountName"
                label="Tên chủ tài khoản"
                rules={[{ required: true, message: 'Vui lòng nhập tên chủ tài khoản' }]}
              >
                <Input placeholder="Họ và tên chủ tài khoản" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="bankCode"
            label="Mã ngân hàng (nếu có)"
          >
            <Input placeholder="VD: VCB, TCB, MB..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="minAmount"
                label="Số tiền tối thiểu"
                rules={[{ required: true, message: 'Vui lòng nhập số tiền tối thiểu' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={1000}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  placeholder="1,000"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="maxAmount"
                label="Số tiền tối đa"
                rules={[{ required: true, message: 'Vui lòng nhập số tiền tối đa' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={1000}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  placeholder="10,000,000"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="feePercent"
                label="Phí theo % (0-100)"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  max={100}
                  step={0.1}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="feeFixed"
                label="Phí cố định (VNĐ)"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="processingTime"
                label="Thời gian xử lý"
              >
                <Input placeholder="VD: Ngay lập tức, 1-5 phút..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="displayOrder"
                label="Thứ tự hiển thị"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={1}
                  placeholder="1"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <TextArea
              rows={3}
              placeholder="Mô tả chi tiết về phương thức thanh toán..."
            />
          </Form.Item>

          <Form.Item
            name="qrCode"
            label="Mã QR (URL)"
          >
            <Input placeholder="URL đến ảnh mã QR" />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Trạng thái"
            valuePropName="checked"
          >
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Tạm khóa" />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => {
                setShowEditModal(false);
                editForm.resetFields();
                setSelectedPaymentMethod(null);
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Payment Method Detail Drawer */}
      <Drawer
        title="Chi tiết phương thức thanh toán"
        placement="right"
        onClose={() => {
          setShowDetailDrawer(false);
          setSelectedPaymentMethod(null);
        }}
        open={showDetailDrawer}
        width={500}
      >
        {selectedPaymentMethod && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="mb-4">
                {(() => {
                  const config = getPaymentTypeConfig(selectedPaymentMethod.type);
                  return (
                    <Tag color={config.color} style={{ fontSize: '16px', padding: '8px 16px' }}>
                      {config.icon} {config.label}
                    </Tag>
                  );
                })()}
              </div>
              <Title level={4} className="mb-1">{selectedPaymentMethod.name}</Title>
              <Text type="secondary">{selectedPaymentMethod.accountNumber}</Text>
            </div>

            <Divider />

            <div className="space-y-3">
              <div>
                <Text strong>Tên chủ tài khoản:</Text>
                <div>{selectedPaymentMethod.accountName}</div>
              </div>

              {selectedPaymentMethod.bankCode && (
                <div>
                  <Text strong>Mã ngân hàng:</Text>
                  <div>{selectedPaymentMethod.bankCode}</div>
                </div>
              )}

              <div>
                <Text strong>Giới hạn giao dịch:</Text>
                <div>
                  <div>Tối thiểu: {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(selectedPaymentMethod.minAmount)}</div>
                  <div>Tối đa: {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(selectedPaymentMethod.maxAmount)}</div>
                </div>
              </div>

              <div>
                <Text strong>Phí giao dịch:</Text>
                <div>
                  {selectedPaymentMethod.feePercent > 0 && (
                    <div className="text-orange-600">Phí %: {selectedPaymentMethod.feePercent}%</div>
                  )}
                  {selectedPaymentMethod.feeFixed > 0 && (
                    <div className="text-blue-600">
                      Phí cố định: {new Intl.NumberFormat('vi-VN').format(selectedPaymentMethod.feeFixed)} VNĐ
                    </div>
                  )}
                  {selectedPaymentMethod.feePercent === 0 && selectedPaymentMethod.feeFixed === 0 && (
                    <div className="text-green-600">Miễn phí</div>
                  )}
                </div>
              </div>

              <div>
                <Text strong>Thời gian xử lý:</Text>
                <div>{selectedPaymentMethod.processingTime || 'Ngay lập tức'}</div>
              </div>

              <div>
                <Text strong>Thứ tự hiển thị:</Text>
                <div>{selectedPaymentMethod.displayOrder}</div>
              </div>

              <div>
                <Text strong>Trạng thái:</Text>
                <div>
                  <Switch
                    checked={selectedPaymentMethod.isActive}
                    onChange={() => handleToggleStatus(selectedPaymentMethod.id)}
                    checkedChildren="Hoạt động"
                    unCheckedChildren="Tạm khóa"
                  />
                </div>
              </div>

              {selectedPaymentMethod.description && (
                <div>
                  <Text strong>Mô tả:</Text>
                  <div className="whitespace-pre-wrap">{selectedPaymentMethod.description}</div>
                </div>
              )}

              {selectedPaymentMethod.qrCode && (
                <div>
                  <Text strong>Mã QR:</Text>
                  <div className="mt-2">
                    <Image
                      src={selectedPaymentMethod.qrCode}
                      alt="QR Code"
                      width={200}
                      fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxY4Q9gLQQKC7egIpQIV8DGbbABBa6AK1ApX4EjNwfAUnAVLEChOBBIlMGGWiGdHjPfvfmfX3TgBmyRqZjuX5/eGsM93GQyGp3R6RDdyBLOKr9lf0vJAOEo8g3vAAmWu8qwUBm2KsNG+ZbdIbyPcC8R3kX8mQg+l+GjMhP5Z2X4Q5l9VaLfdK6KI1EfxJHoDsSR6A7EkegOqCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPAR2JngI6Ej0FdCR6CuhI9BTQkegpoCPRU0BHoqeAjkRPgcZC5RaYaT9yk+kQUEUTNxJF4UYiYEfjnTBhZtcUvQe9Y/W3W5H7T6aKfCNR5BuJQRNz5kYj4m8kilXajcTlWZ65Zo7WzjfYQ0EAAAAASUVORK5CYII="
                    />
                  </div>
                </div>
              )}

              <div>
                <Text strong>Ngày tạo:</Text>
                <div>{new Date(selectedPaymentMethod.createdAt).toLocaleString('vi-VN')}</div>
              </div>

              <div>
                <Text strong>Cập nhật cuối:</Text>
                <div>{new Date(selectedPaymentMethod.updatedAt).toLocaleString('vi-VN')}</div>
              </div>
            </div>

            <Divider />

            <div className="space-y-2">
              <Button
                block
                icon={<EditOutlined />}
                onClick={() => {
                  setShowDetailDrawer(false);
                  showEditPaymentMethodModal(selectedPaymentMethod);
                }}
              >
                Chỉnh sửa
              </Button>
              <Button
                block
                type={selectedPaymentMethod.isActive ? 'default' : 'primary'}
                onClick={() => handleToggleStatus(selectedPaymentMethod.id)}
              >
                {selectedPaymentMethod.isActive ? 'Tạm khóa' : 'Kích hoạt'}
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default AdminPaymentMethodManagement;