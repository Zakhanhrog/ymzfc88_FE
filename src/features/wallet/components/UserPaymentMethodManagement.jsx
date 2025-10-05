import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Popconfirm,
  message,
  Empty,
  Tooltip,
  Avatar,
  Typography,
  Divider,
  List,
  Switch
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BankOutlined,
  MobileOutlined,
  CreditCardOutlined,
  QrcodeOutlined,
  WalletOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  StarOutlined,
  StarFilled,
  ReloadOutlined
} from '@ant-design/icons';
import { THEME_COLORS } from '../../../utils/theme';
import walletService from '../services/walletService';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

const UserPaymentMethodManagement = () => {
  const [userPaymentMethods, setUserPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Payment method types for withdrawal
  const withdrawalPaymentTypes = [
    { value: 'BANK', label: 'Ngân hàng', icon: <BankOutlined />, color: 'blue' },
    { value: 'MOMO', label: 'Ví MoMo', icon: <MobileOutlined />, color: 'pink' },
    { value: 'ZALO_PAY', label: 'ZaloPay', icon: <MobileOutlined />, color: 'cyan' },
    { value: 'VIET_QR', label: 'VietQR', icon: <QrcodeOutlined />, color: 'green' }
  ];

  // Popular banks
  const popularBanks = [
    { code: 'VCB', name: 'Vietcombank', fullName: 'Ngân hàng TMCP Ngoại thương Việt Nam' },
    { code: 'TCB', name: 'Techcombank', fullName: 'Ngân hàng TMCP Kỹ thương Việt Nam' },
    { code: 'ACB', name: 'ACB', fullName: 'Ngân hàng TMCP Á Châu' },
    { code: 'MB', name: 'MBBank', fullName: 'Ngân hàng TMCP Quân đội' },
    { code: 'VTB', name: 'Vietinbank', fullName: 'Ngân hàng TMCP Công thương Việt Nam' },
    { code: 'BIDV', name: 'BIDV', fullName: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam' },
    { code: 'TPB', name: 'TPBank', fullName: 'Ngân hàng TMCP Tiên Phong' },
    { code: 'STB', name: 'Sacombank', fullName: 'Ngân hàng TMCP Sài Gòn Thương tín' },
    { code: 'VPB', name: 'VPBank', fullName: 'Ngân hàng TMCP Việt Nam Thịnh vượng' }
  ];

  useEffect(() => {
    loadUserPaymentMethods();
  }, []);

  const loadUserPaymentMethods = async () => {
    setLoading(true);
    try {
      const response = await walletService.getUserPaymentMethods();
      if (response.success) {
        setUserPaymentMethods(response.data);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Create user payment method
  const handleCreatePaymentMethod = async (values) => {
    try {
      const response = await walletService.createUserPaymentMethod(values);
      if (response.success) {
        message.success('Thêm phương thức thanh toán thành công!');
        setShowCreateModal(false);
        createForm.resetFields();
        loadUserPaymentMethods();
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  // Update user payment method
  const handleUpdatePaymentMethod = async (values) => {
    try {
      const response = await walletService.updateUserPaymentMethod(selectedMethod.id, values);
      if (response.success) {
        message.success('Cập nhật phương thức thanh toán thành công!');
        setShowEditModal(false);
        editForm.resetFields();
        setSelectedMethod(null);
        loadUserPaymentMethods();
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  // Delete user payment method
  const handleDeletePaymentMethod = async (id) => {
    try {
      const response = await walletService.deleteUserPaymentMethod(id);
      if (response.success) {
        message.success('Xóa phương thức thanh toán thành công!');
        loadUserPaymentMethods();
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  // Set as default payment method
  const handleSetDefaultPaymentMethod = async (id) => {
    try {
      const response = await walletService.setDefaultUserPaymentMethod(id);
      if (response.success) {
        message.success('Đã đặt làm phương thức mặc định!');
        loadUserPaymentMethods();
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  // Show modals
  const showEditPaymentMethodModal = (method) => {
    setSelectedMethod(method);
    editForm.setFieldsValue({
      ...method,
      bankCode: method.bankCode || undefined
    });
    setShowEditModal(true);
  };

  // Get payment type config
  const getPaymentTypeConfig = (type) => {
    return withdrawalPaymentTypes.find(pt => pt.value === type) || { label: type, icon: <CreditCardOutlined />, color: 'default' };
  };

  // Get bank info
  const getBankInfo = (bankCode) => {
    return popularBanks.find(bank => bank.code === bankCode) || { name: bankCode, fullName: bankCode };
  };

  // Render payment method card
  const renderPaymentMethodCard = (method) => {
    const config = getPaymentTypeConfig(method.type);
    const bankInfo = method.type === 'BANK' ? getBankInfo(method.bankCode) : null;

    return (
      <Card
        key={method.id}
        className="payment-method-card"
        style={{
          borderRadius: '12px',
          border: method.isDefault ? `2px solid ${THEME_COLORS.primary}` : '1px solid #f0f0f0',
          background: method.isDefault ? 'linear-gradient(135deg, #f6f9ff 0%, #e8f4fd 100%)' : 'white'
        }}
        bodyStyle={{ padding: '20px' }}
        actions={[
          <Tooltip title={method.isDefault ? 'Phương thức mặc định' : 'Đặt làm mặc định'}>
            <Button
              type="text"
              icon={method.isDefault ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
              onClick={() => !method.isDefault && handleSetDefaultPaymentMethod(method.id)}
              disabled={method.isDefault}
            />
          </Tooltip>,
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => showEditPaymentMethodModal(method)}
            />
          </Tooltip>,
          <Popconfirm
            title="Bạn có chắc muốn xóa phương thức thanh toán này?"
            onConfirm={() => handleDeletePaymentMethod(method.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                disabled={method.isDefault}
              />
            </Tooltip>
          </Popconfirm>
        ]}
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar
                size={40}
                style={{ backgroundColor: config.color === 'blue' ? '#1890ff' : config.color === 'pink' ? '#eb2f96' : '#52c41a' }}
                icon={config.icon}
              />
              <div>
                <div className="font-semibold text-gray-800">{method.name}</div>
                <Tag color={config.color} size="small">{config.label}</Tag>
              </div>
            </div>
            {method.isDefault && (
              <Tag color="gold" icon={<StarFilled />}>Mặc định</Tag>
            )}
          </div>

          {/* Account Info */}
          <div className="space-y-2">
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>Chủ tài khoản</Text>
              <div className="font-medium">{method.accountName}</div>
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>Số tài khoản</Text>
              <div className="font-mono font-medium text-blue-600">{method.accountNumber}</div>
            </div>
            {bankInfo && (
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>Ngân hàng</Text>
                <div className="font-medium">{bankInfo.name}</div>
                <div className="text-sm text-gray-500">{bankInfo.fullName}</div>
              </div>
            )}
          </div>

          {/* Status */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '14px' }} />
              <Text style={{ fontSize: '12px', color: '#52c41a' }}>Đã xác thực</Text>
            </div>
            <Text type="secondary" style={{ fontSize: '11px' }}>
              Tạo: {new Date(method.createdAt).toLocaleDateString('vi-VN')}
            </Text>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card
        className="shadow-lg"
        style={{
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none'
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-2">Phương thức rút tiền</h2>
              <p className="text-white/80">
                Quản lý tài khoản nhận tiền khi rút tiền từ hệ thống
              </p>
            </div>
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                size="large"
                icon={<ReloadOutlined />}
                onClick={loadUserPaymentMethods}
                loading={loading}
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                style={{ borderRadius: '12px' }}
              >
                Làm mới
              </Button>
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={() => setShowCreateModal(true)}
                className="bg-white text-blue-600 border-white hover:bg-white/90 font-semibold"
                style={{ borderRadius: '12px' }}
              >
                Thêm phương thức
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Payment Methods Grid */}
      <div>
        {userPaymentMethods.length > 0 ? (
          <Row gutter={[16, 16]}>
            {userPaymentMethods.map(method => (
              <Col xs={24} sm={12} lg={8} xl={6} key={method.id}>
                {renderPaymentMethodCard(method)}
              </Col>
            ))}
          </Row>
        ) : (
          <Card style={{ borderRadius: '16px', textAlign: 'center', padding: '40px 0' }}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Chưa có phương thức rút tiền nào"
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                onClick={() => setShowCreateModal(true)}
                style={{
                  background: THEME_COLORS.primaryGradient,
                  border: 'none',
                  borderRadius: '8px'
                }}
              >
                Thêm phương thức đầu tiên
              </Button>
            </Empty>
          </Card>
        )}
      </div>

      {/* Create Payment Method Modal */}
      <Modal
        title="Thêm phương thức rút tiền"
        open={showCreateModal}
        onCancel={() => {
          setShowCreateModal(false);
          createForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreatePaymentMethod}
        >
          <Form.Item
            name="name"
            label="Tên phương thức"
            rules={[{ required: true, message: 'Vui lòng nhập tên phương thức' }]}
          >
            <Input placeholder="VD: Tài khoản VCB chính" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại phương thức"
            rules={[{ required: true, message: 'Vui lòng chọn loại phương thức' }]}
          >
            <Select placeholder="Chọn loại phương thức">
              {withdrawalPaymentTypes.map(type => (
                <Option key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    {type.icon}
                    <span>{type.label}</span>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

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
                <Input placeholder="Họ và tên đầy đủ" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="bankCode"
            label="Ngân hàng (nếu chọn loại Ngân hàng)"
            dependencies={['type']}
          >
            <Select
              placeholder="Chọn ngân hàng"
              allowClear
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {popularBanks.map(bank => (
                <Option key={bank.code} value={bank.code}>
                  {bank.name} - {bank.fullName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="note"
            label="Ghi chú (tùy chọn)"
          >
            <TextArea
              rows={3}
              placeholder="Ghi chú thêm về phương thức thanh toán..."
            />
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
                Thêm phương thức
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Payment Method Modal */}
      <Modal
        title="Chỉnh sửa phương thức rút tiền"
        open={showEditModal}
        onCancel={() => {
          setShowEditModal(false);
          editForm.resetFields();
          setSelectedMethod(null);
        }}
        footer={null}
        width={600}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdatePaymentMethod}
        >
          <Form.Item
            name="name"
            label="Tên phương thức"
            rules={[{ required: true, message: 'Vui lòng nhập tên phương thức' }]}
          >
            <Input placeholder="VD: Tài khoản VCB chính" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại phương thức"
            rules={[{ required: true, message: 'Vui lòng chọn loại phương thức' }]}
          >
            <Select placeholder="Chọn loại phương thức">
              {withdrawalPaymentTypes.map(type => (
                <Option key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    {type.icon}
                    <span>{type.label}</span>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

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
                <Input placeholder="Họ và tên đầy đủ" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="bankCode"
            label="Ngân hàng (nếu chọn loại Ngân hàng)"
            dependencies={['type']}
          >
            <Select
              placeholder="Chọn ngân hàng"
              allowClear
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {popularBanks.map(bank => (
                <Option key={bank.code} value={bank.code}>
                  {bank.name} - {bank.fullName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="note"
            label="Ghi chú (tùy chọn)"
          >
            <TextArea
              rows={3}
              placeholder="Ghi chú thêm về phương thức thanh toán..."
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => {
                setShowEditModal(false);
                editForm.resetFields();
                setSelectedMethod(null);
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

      <style dangerouslySetInnerHTML={{
        __html: `
          .payment-method-card {
            transition: all 0.3s ease;
          }
          
          .payment-method-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          }
          
          .payment-method-card .ant-card-actions {
            border-top: 1px solid #f0f0f0;
          }
          
          .payment-method-card .ant-card-actions > li {
            margin: 8px 0;
          }
        `
      }} />
    </div>
  );
};

export default UserPaymentMethodManagement;