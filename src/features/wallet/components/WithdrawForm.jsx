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
  const [form] = Form.useForm();

  useEffect(() => {
    loadUserPaymentMethods();
  }, []);

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
      message.error('Lỗi khi tạo lệnh rút tiền: ' + error.message);
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
    <div className="space-y-6">
      <div className="text-center">
        <Title level={4}>Chọn tài khoản nhận tiền</Title>
        <Text type="secondary">
          Chọn phương thức thanh toán mà bạn muốn nhận tiền
        </Text>
      </div>

      {userPaymentMethods.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '40px 0' }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Chưa có phương thức rút tiền nào"
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                // Chuyển đến tab quản lý phương thức thanh toán
                window.location.href = '/wallet?tab=withdraw-methods';
              }}
              style={{
                background: THEME_COLORS.primaryGradient,
                border: 'none',
                borderRadius: '8px'
              }}
            >
              Thêm phương thức rút tiền
            </Button>
          </Empty>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {userPaymentMethods.map(method => (
            <Col xs={24} sm={12} lg={8} key={method.id}>
              <Card
                hoverable
                className={`payment-method-card ${selectedUserMethod?.id === method.id ? 'selected' : ''}`}
                onClick={() => setSelectedUserMethod(method)}
                style={{
                  borderRadius: '12px',
                  border: selectedUserMethod?.id === method.id 
                    ? `2px solid ${THEME_COLORS.primary}` 
                    : '1px solid #f0f0f0',
                  background: selectedUserMethod?.id === method.id 
                    ? 'linear-gradient(135deg, #f6f9ff 0%, #e8f4fd 100%)' 
                    : 'white'
                }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getMethodIcon(method.type)}
                      <div>
                        <div className="font-semibold">{method.name}</div>
                        <Tag size="small" color="blue">{getMethodTypeText(method.type)}</Tag>
                      </div>
                    </div>
                    {method.isDefault && (
                      <Tag color="gold" icon={<StarFilled />} size="small">
                        Mặc định
                      </Tag>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>Tên tài khoản</Text>
                      <div className="font-medium">{method.accountName}</div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>Số tài khoản</Text>
                      <div className="font-mono text-blue-600">{method.accountNumber}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 pt-2 border-t border-gray-100">
                    <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
                    <Text style={{ fontSize: '11px', color: '#52c41a' }}>Đã xác thực</Text>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
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
    <div className="space-y-6">
      {/* Header */}
      <Card
        className="shadow-lg"
        style={{
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
          border: 'none'
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <div className="text-center text-white">
          <ArrowDownOutlined className="text-4xl mb-3" />
          <Title level={2} className="text-white mb-2">Rút tiền</Title>
          <Text className="text-white/80">
            Rút tiền về tài khoản ngân hàng hoặc ví điện tử của bạn
          </Text>
        </div>
      </Card>

      {/* Steps */}
      <Card style={{ borderRadius: '16px' }}>
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
              onClick={() => {
                form.setFieldsValue({ userPaymentMethodId: selectedUserMethod.id });
                setCurrentStep(1);
              }}
              style={{
                background: THEME_COLORS.primaryGradient,
                border: 'none',
                borderRadius: '8px'
              }}
            >
              Tiếp tục
            </Button>
          </div>
        )}
      </Card>

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