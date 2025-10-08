import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  InputNumber,
  Select,
  Button,
  Steps,
  Result,
  Space,
  Divider,
  Alert,
  Tag,
  message,
  Row,
  Col,
  Typography,
  Empty,
  Modal,
  Input
} from 'antd';
import {
  ArrowDownOutlined,
  BankOutlined,
  MobileOutlined,
  CreditCardOutlined,
  QrcodeOutlined,
  StarFilled,
  PlusOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import { THEME_COLORS } from '../../../utils/theme';
import { formatCurrency } from '../../../utils/helpers';
import walletService from '../services/walletService';

const { Option } = Select;
const { Step } = Steps;
const { Title, Text } = Typography;

const WithdrawForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userPaymentMethods, setUserPaymentMethods] = useState([]);
  const [selectedUserMethod, setSelectedUserMethod] = useState(null);
  const [amount, setAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transactionResult, setTransactionResult] = useState(null);
  const [showAddMethodModal, setShowAddMethodModal] = useState(false);
  const [withdrawalLocked, setWithdrawalLocked] = useState(false);
  const [lockReason, setLockReason] = useState('');
  const [checkingLockStatus, setCheckingLockStatus] = useState(true);
  const [form] = Form.useForm();
  const [addMethodForm] = Form.useForm();

  // Popular banks
  const popularBanks = [
    { code: 'VCB', name: 'Vietcombank' },
    { code: 'TCB', name: 'Techcombank' },
    { code: 'ACB', name: 'ACB' },
    { code: 'MB', name: 'MBBank' },
    { code: 'VTB', name: 'Vietinbank' },
    { code: 'BIDV', name: 'BIDV' },
    { code: 'TPB', name: 'TPBank' },
    { code: 'STB', name: 'Sacombank' }
  ];

  useEffect(() => {
    // Mỗi lần component mount hoặc user quay lại trang này
    checkWithdrawalLockStatus();
    loadUserPaymentMethods();
  }, []); // Empty dependency để chỉ chạy lần đầu

  const checkWithdrawalLockStatus = async () => {
    try {
      setCheckingLockStatus(true);
      console.log('🔍 Đang kiểm tra trạng thái khóa rút tiền...');
      
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('⚠️ Không tìm thấy token');
        return;
      }

      // Fetch latest user info từ backend
      const response = await fetch('http://localhost:8080/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Response data:', result);
        
        if (result.success && result.data) {
          const isLocked = result.data.withdrawalLocked || false;
          const reason = result.data.withdrawalLockReason || '';
          
          console.log('🔒 Withdrawal Locked:', isLocked);
          console.log('📝 Lock Reason:', reason);
          
          setWithdrawalLocked(isLocked);
          setLockReason(reason);
          
          if (isLocked) {
            message.warning('Tài khoản của bạn đã bị khóa rút tiền!');
          }
        }
      } else {
        console.error('❌ Response not OK:', response.status);
      }
    } catch (error) {
      console.error('❌ Error checking withdrawal lock status:', error);
    } finally {
      setCheckingLockStatus(false);
    }
  };

  const loadUserPaymentMethods = async () => {
    try {
      setLoading(true);
      const response = await walletService.getUserPaymentMethods();
      if (response.success) {
        setUserPaymentMethods(response.data);
      }
    } catch (error) {
      message.error('Lỗi khi tải phương thức rút tiền: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaymentMethod = async (values) => {
    try {
      setLoading(true);
      const response = await walletService.createUserPaymentMethod(values);
      if (response.success) {
        message.success('Thêm phương thức rút tiền thành công!');
        setShowAddMethodModal(false);
        addMethodForm.resetFields();
        loadUserPaymentMethods();
      }
    } catch (error) {
      message.error('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getMethodIcon = (type) => {
    switch (type) {
      case 'MOMO':
        return <MobileOutlined style={{ color: '#d82d8b' }} />;
      case 'BANK':
        return <BankOutlined style={{ color: '#1890ff' }} />;
      case 'ZALO_PAY':
        return <MobileOutlined style={{ color: '#0068ff' }} />;
      case 'VIET_QR':
        return <QrcodeOutlined style={{ color: '#00a84f' }} />;
      default:
        return <CreditCardOutlined />;
    }
  };

  const getMethodTypeText = (type) => {
    switch (type) {
      case 'MOMO':
        return 'MoMo';
      case 'BANK':
        return 'Ngân hàng';
      case 'ZALO_PAY':
        return 'ZaloPay';
      case 'VIET_QR':
        return 'VietQR';
      default:
        return type;
    }
  };

  const quickAmounts = [
    { label: '100K', value: 100000 },
    { label: '200K', value: 200000 },
    { label: '500K', value: 500000 },
    { label: '1M', value: 1000000 },
    { label: '2M', value: 2000000 },
    { label: '5M', value: 5000000 }
  ];

  const handleSubmitWithdraw = async (values) => {
    // Check if withdrawal is locked before submitting
    if (withdrawalLocked) {
      message.error('Tài khoản của bạn đã bị khóa rút tiền. Vui lòng liên hệ admin để biết thêm chi tiết.');
      return;
    }

    try {
      setLoading(true);
      
      const withdrawData = {
        amount: values.amount.toString(), // Convert to string for BigDecimal
        userPaymentMethodId: values.userPaymentMethodId,
        description: values.description || ''
      };

      const response = await walletService.createWithdrawOrder(withdrawData);
      
      if (response.success) {
        setTransactionResult(response.data);
        setCurrentStep(2);
        message.success('Đã gửi yêu cầu rút tiền thành công!');
      }
    } catch (error) {
      // Check if error message contains WITHDRAWAL_LOCKED
      if (error.message && error.message.includes('WITHDRAWAL_LOCKED')) {
        const reason = error.message.replace('WITHDRAWAL_LOCKED: ', '');
        setWithdrawalLocked(true);
        setLockReason(reason);
        message.error(reason);
      } else {
        message.error('Lỗi khi tạo lệnh rút tiền: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(0);
    setSelectedUserMethod(null);
    setAmount(null);
    setTransactionResult(null);
    form.resetFields();
  };

  const renderMethodSelection = () => (
    <div className="space-y-4">

      {/* Add method button */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          {userPaymentMethods.length > 0 && `${userPaymentMethods.length} phương thức`}
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowAddMethodModal(true)}
          size="small"
          style={{
            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
            border: 'none',
            borderRadius: '6px'
          }}
        >
          Thêm phương thức
        </Button>
      </div>

      {userPaymentMethods.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '40px 0', borderRadius: '12px' }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Chưa có phương thức rút tiền nào"
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowAddMethodModal(true)}
              style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                border: 'none',
                borderRadius: '8px'
              }}
            >
              Thêm phương thức rút tiền
            </Button>
          </Empty>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {userPaymentMethods.map(method => (
            <Card
              key={method.id}
              hoverable
              className={`payment-method-card cursor-pointer ${selectedUserMethod?.id === method.id ? 'selected' : ''}`}
              onClick={() => setSelectedUserMethod(method)}
              style={{
                borderRadius: '12px',
                border: selectedUserMethod?.id === method.id 
                  ? '2px solid #dc2626' 
                  : '1px solid #e5e7eb',
                background: selectedUserMethod?.id === method.id 
                  ? '#fef2f2' 
                  : 'white'
              }}
              styles={{ body: { padding: window.innerWidth < 768 ? '12px' : '16px' } }}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-xl">{getMethodIcon(method.type)}</div>
                    <div>
                      <div className="font-semibold text-sm">{method.name}</div>
                      <Tag size="small" color="blue" className="text-xs mt-0.5">{getMethodTypeText(method.type)}</Tag>
                    </div>
                  </div>
                  {method.isDefault && (
                    <Tag color="gold" icon={<StarFilled />} className="text-xs">
                      Mặc định
                    </Tag>
                  )}
                </div>

                <div className="space-y-1 text-sm">
                  <div>
                    <span className="text-gray-500 text-xs">Chủ tài khoản: </span>
                    <span className="font-medium">{method.accountName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Số tài khoản: </span>
                    <span className="font-mono text-blue-600 font-medium">{method.accountNumber}</span>
                  </div>
                  {method.bankCode && (
                    <div>
                      <span className="text-gray-500 text-xs">Ngân hàng: </span>
                      <span className="font-medium">{method.bankCode}</span>
                    </div>
                  )}
                </div>

                {selectedUserMethod?.id === method.id && (
                  <div className="flex items-center gap-1 pt-2 border-t border-red-100">
                    <CheckCircleOutlined className="text-green-500 text-xs" />
                    <span className="text-xs text-green-600 font-medium">Đã chọn</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderAmountInput = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Title level={4}>Nhập số tiền rút</Title>
        <Text type="secondary">
          Nhập số tiền bạn muốn rút về tài khoản đã chọn
        </Text>
      </div>

      {selectedUserMethod && (
        <Card className="selected-method-info">
          <div className="flex items-center gap-3">
            {getMethodIcon(selectedUserMethod.type)}
            <div>
              <div className="font-semibold">{selectedUserMethod.name}</div>
              <div className="text-sm text-gray-500">
                {selectedUserMethod.accountNumber} - {selectedUserMethod.accountName}
              </div>
            </div>
          </div>
        </Card>
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmitWithdraw}
      >
        <Form.Item
          name="userPaymentMethodId"
          initialValue={selectedUserMethod?.id}
          style={{ display: 'none' }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="amount"
          label="Số tiền rút"
          rules={[
            { required: true, message: 'Vui lòng nhập số tiền' },
            { type: 'number', min: 10000, message: 'Số tiền tối thiểu là 10,000 VNĐ' }
          ]}
        >
          <InputNumber
            size="large"
            style={{ width: '100%', borderRadius: '8px' }}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            placeholder="Nhập số tiền"
            min={10000}
            onChange={(value) => setAmount(value)}
          />
        </Form.Item>

        {/* Quick amount buttons */}
        <div className="space-y-2">
          <Text className="text-sm text-gray-600">Chọn nhanh:</Text>
          <div className="grid grid-cols-3 gap-2">
            {quickAmounts.map(quick => (
              <Button
                key={quick.value}
                onClick={() => {
                  form.setFieldsValue({ amount: quick.value });
                  setAmount(quick.value);
                }}
                style={{ borderRadius: '8px' }}
              >
                {quick.label}
              </Button>
            ))}
          </div>
        </div>

        <Form.Item
          name="description"
          label="Ghi chú (không bắt buộc)"
        >
          <Input.TextArea
            rows={3}
            placeholder="Nhập ghi chú cho giao dịch rút tiền"
            style={{ borderRadius: '8px' }}
          />
        </Form.Item>

        <Alert
          message="Lưu ý quan trọng"
          description={
            <ul className="space-y-1 mt-2">
              <li>• Thời gian xử lý: 1-24 giờ làm việc</li>
              <li>• Số tiền tối thiểu: 10,000 VNĐ</li>
              <li>• Đảm bảo thông tin tài khoản chính xác</li>
              <li>• Không thể hủy sau khi đã gửi yêu cầu</li>
            </ul>
          }
          type="warning"
          showIcon
          className="mb-4"
        />

        <div className="flex gap-2">
          <Button
            size="large"
            onClick={() => setCurrentStep(0)}
            style={{ flex: 1, borderRadius: '8px' }}
          >
            Quay lại
          </Button>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={loading}
            disabled={!amount || amount < 10000}
            style={{
              flex: 2,
              background: THEME_COLORS.primaryGradient,
              border: 'none',
              borderRadius: '8px'
            }}
          >
            Xác nhận rút tiền
          </Button>
        </div>
      </Form>
    </div>
  );

  const renderResult = () => (
    <div className="text-center">
      <Result
        status="success"
        title="Yêu cầu rút tiền thành công!"
        subTitle={
          <div className="space-y-2">
            <p>Mã giao dịch: <strong>{transactionResult?.transactionId}</strong></p>
            <p>Số tiền: <strong className="text-red-600">{formatCurrency(transactionResult?.amount)}</strong></p>
            <p>Thời gian xử lý dự kiến: 1-24 giờ làm việc</p>
          </div>
        }
        extra={[
          <Button key="history" onClick={() => window.location.href = '/wallet?tab=transaction-history'}>
            Xem lịch sử
          </Button>,
          <Button
            key="new"
            type="primary"
            onClick={resetForm}
            style={{
              background: THEME_COLORS.primaryGradient,
              border: 'none'
            }}
          >
            Tạo lệnh mới
          </Button>,
        ]}
      />
    </div>
  );

  const steps = [
    {
      title: 'Chọn phương thức',
      content: renderMethodSelection(),
    },
    {
      title: 'Nhập số tiền',
      content: renderAmountInput(),
    },
    {
      title: 'Hoàn thành',
      content: renderResult(),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Title Header */}
      <div className="text-center pb-3">
        <div className="flex items-center justify-center gap-2 mb-1">
          <ArrowDownOutlined className="text-2xl text-green-600" />
          <Title level={3} className="mb-0 text-gray-800">Rút tiền về ví</Title>
        </div>
        <Text type="secondary" className="text-sm">
          Chọn phương thức thanh toán và nhập số tiền để rút về ví của bạn
        </Text>
      </div>

      {/* Loading when checking lock status */}
      {checkingLockStatus && (
        <Alert
          message="Đang kiểm tra trạng thái tài khoản..."
          type="info"
          showIcon
          style={{ marginBottom: '16px' }}
        />
      )}

      {/* Withdrawal Locked Alert */}
      {!checkingLockStatus && withdrawalLocked && (
        <Alert
          message="⚠️ TÀI KHOẢN ĐÃ BỊ KHÓA RÚT TIỀN"
          description={
            <div>
              <p className="mb-2"><strong>Lý do:</strong> {lockReason || 'Không có lý do cụ thể'}</p>
              <p className="mb-0 text-red-600"><strong>Vui lòng liên hệ với quản trị viên để được hỗ trợ.</strong></p>
            </div>
          }
          type="error"
          showIcon
          icon={<WarningOutlined />}
          style={{ marginBottom: '16px', border: '2px solid #ff4d4f' }}
          banner
        />
      )}

      {/* Steps */}
      <Card style={{ borderRadius: '12px' }}>
        <Steps current={currentStep} className="mb-8">
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>

        <div className="min-h-96">
          {steps[currentStep].content}
        </div>

        {currentStep === 0 && selectedUserMethod && userPaymentMethods.length > 0 && (
          <div className="flex justify-end mt-6">
            <Button
              type="primary"
              size="large"
              disabled={withdrawalLocked}
              onClick={() => {
                form.setFieldsValue({ userPaymentMethodId: selectedUserMethod.id });
                setCurrentStep(1);
              }}
              style={{
                background: withdrawalLocked ? '#d9d9d9' : THEME_COLORS.primaryGradient,
                border: 'none',
                borderRadius: '8px'
              }}
            >
              Tiếp tục
            </Button>
          </div>
        )}
      </Card>

      {/* Modal thêm phương thức rút tiền */}
      <Modal
        title="Thêm phương thức rút tiền"
        open={showAddMethodModal}
        onCancel={() => {
          setShowAddMethodModal(false);
          addMethodForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={addMethodForm}
          layout="vertical"
          onFinish={handleAddPaymentMethod}
        >
          <Form.Item
            name="type"
            label="Loại phương thức"
            rules={[{ required: true, message: 'Vui lòng chọn loại' }]}
          >
            <Select size="large" placeholder="Chọn loại phương thức">
              <Option value="BANK">Ngân hàng</Option>
              <Option value="MOMO">Ví MoMo</Option>
              <Option value="ZALO_PAY">ZaloPay</Option>
              <Option value="VIET_QR">VietQR</Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
          >
            {({ getFieldValue }) =>
              getFieldValue('type') === 'BANK' && (
                <Form.Item
                  name="bankCode"
                  label="Ngân hàng"
                  rules={[{ required: true, message: 'Vui lòng chọn ngân hàng' }]}
                >
                  <Select size="large" placeholder="Chọn ngân hàng" showSearch>
                    {popularBanks.map(bank => (
                      <Option key={bank.code} value={bank.code}>
                        {bank.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )
            }
          </Form.Item>

          <Form.Item
            name="name"
            label="Tên gợi nhớ"
            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
          >
            <Input size="large" placeholder="VD: Tài khoản chính" />
          </Form.Item>

          <Form.Item
            name="accountName"
            label="Tên tài khoản"
            rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản' }]}
          >
            <Input size="large" placeholder="Nguyễn Văn A" />
          </Form.Item>

          <Form.Item
            name="accountNumber"
            label="Số tài khoản"
            rules={[{ required: true, message: 'Vui lòng nhập số tài khoản' }]}
          >
            <Input size="large" placeholder="0123456789" />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              { pattern: /^(0|\+84)[0-9]{9,10}$/, message: 'Số điện thoại không đúng định dạng' }
            ]}
          >
            <Input size="large" placeholder="0901234567" />
          </Form.Item>

          <Form.Item>
            <div className="flex gap-2 justify-end">
              <Button onClick={() => {
                setShowAddMethodModal(false);
                addMethodForm.resetFields();
              }}>
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                  border: 'none'
                }}
              >
                Thêm phương thức
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      <style dangerouslySetInnerHTML={{
        __html: `
          .payment-method-card {
            transition: all 0.3s ease;
            cursor: pointer;
          }
          
          .payment-method-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          }
          
          .payment-method-card.selected {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(211,1,2,0.2);
          }
          
          .selected-method-info {
            background: linear-gradient(135deg, #f6f9ff 0%, #e8f4fd 100%);
            border: 1px solid ${THEME_COLORS.primary};
          }
        `
      }} />
    </div>
  );
};

export default WithdrawForm;