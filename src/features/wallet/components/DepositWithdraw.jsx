import { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Form, 
  InputNumber,
  Input,
  Steps,
  Result,
  Divider,
  Alert,
  message,
  QRCode,
  Spin,
  Upload
} from 'antd';
import {
  ArrowUpOutlined,
  BankOutlined,
  MobileOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CopyOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { THEME_COLORS } from '../../../utils/theme';
import { formatCurrency } from '../../../utils/helpers';
import { HEADING_STYLES, BODY_STYLES, FONT_SIZE, FONT_WEIGHT } from '../../../utils/typography';
import walletService from '../services/walletService';

const { Step } = Steps;

const DepositWithdraw = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [amount, setAmount] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transactionResult, setTransactionResult] = useState(null);
  const [billImage, setBillImage] = useState(null);
  const [form] = Form.useForm();

  // Load payment methods khi component mount
  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      const response = await walletService.getPaymentMethods();
      if (response.success) {
        setPaymentMethods(response.data);
      }
    } catch (error) {
      message.error('Lỗi khi tải phương thức thanh toán: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getMethodIcon = (type) => {
    switch (type) {
      case 'MOMO':
        return <MobileOutlined style={{ color: '#d82d8b' }} />;
      case 'BANK':
        return <BankOutlined style={{ color: '#007ACC' }} />;
      case 'USDT':
        return <DollarOutlined style={{ color: '#26a17b' }} />;
      default:
        return <BankOutlined />;
    }
  };

  const calculateFee = (amount, method) => {
    let fee = 0;
    if (method.feePercent && method.feePercent > 0) {
      fee += (amount * method.feePercent) / 100;
    }
    if (method.feeFixed && method.feeFixed > 0) {
      fee += method.feeFixed;
    }
    return fee;
  };

  const quickAmounts = [
    { label: '100K', value: 100000 },
    { label: '200K', value: 200000 },
    { label: '500K', value: 500000 },
    { label: '1M', value: 1000000 },
    { label: '2M', value: 2000000 },
    { label: '5M', value: 5000000 },
    { label: '10M', value: 10000000 },
    { label: '20M', value: 20000000 }
  ];

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    form.setFieldsValue({ method: method.id });
  };

  const handleAmountSelect = (value) => {
    setAmount(value);
    form.setFieldsValue({ amount: value });
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      let billImageBase64 = null;
      
      // Xử lý upload ảnh nếu có
      if (billImage) {
        try {
          // Validate file size (max 5MB)
          if (billImage.size > 5 * 1024 * 1024) {
            message.error('Kích thước ảnh không được vượt quá 5MB');
            return;
          }
          
          // Validate file type
          if (!billImage.type.startsWith('image/')) {
            message.error('Chỉ được upload file ảnh (JPG, PNG, GIF)');
            return;
          }
          
          billImageBase64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              // Lấy phần base64 sau dấu ','
              const base64 = reader.result.split(',')[1];
              resolve(base64);
            };
            reader.onerror = () => reject(new Error('Không thể đọc file ảnh'));
            reader.readAsDataURL(billImage);
          });
        } catch (error) {
          message.error('Lỗi khi xử lý ảnh: ' + error.message);
          return;
        }
      }
      
      const depositData = {
        paymentMethodId: selectedMethod.id,
        amount: Number(amount),
        description: values.description || '',
        referenceCode: values.referenceCode || '',
        billImage: billImageBase64,
        billImageName: billImage ? billImage.name : null
      };
      
      const response = await walletService.createDepositOrder(depositData);
      if (response.success) {
        setTransactionResult(response.data);
        setCurrentStep(2);
        message.success('Đã tạo lệnh nạp tiền thành công!');
      } else {
        message.error('Lỗi: ' + (response.message || 'Không xác định'));
      }
    } catch (error) {
      message.error('Lỗi: ' + error.message);
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedMethod(null);
    setAmount(null);
    setTransactionResult(null);
    setBillImage(null);
    form.resetFields();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    message.success('Đã sao chép vào clipboard');
  };

  const renderMethodSelection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">
        Chọn phương thức nạp tiền
      </h3>
      
      {loading ? (
        <div className="text-center py-8">
          <Spin size="large" />
          <p className="mt-4 text-gray-500">Đang tải phương thức thanh toán...</p>
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {paymentMethods.map((method) => (
            <Col xs={24} md={12} key={method.id}>
              <Card
                className={`cursor-pointer transition-all duration-300 ${
                  selectedMethod?.id === method.id 
                    ? 'border-2 shadow-lg' 
                    : 'border hover:shadow-md'
                }`}
                style={{ 
                  borderRadius: '12px',
                  borderColor: selectedMethod?.id === method.id ? THEME_COLORS.primary : '#d9d9d9'
                }}
                styles={{ body: { padding: '20px' } }}
                onClick={() => handleMethodSelect(method)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">{getMethodIcon(method.type)}</div>
                  <div>
                    <h4 className="font-semibold text-lg">{method.name}</h4>
                    <p className="text-gray-500 text-sm">{method.accountNumber}</p>
                  </div>
                  {selectedMethod?.id === method.id && (
                    <CheckCircleOutlined 
                      className="text-green-500 text-xl ml-auto" 
                    />
                  )}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hạn mức:</span>
                    <span className="font-medium">
                      {formatCurrency(method.minAmount)} - {formatCurrency(method.maxAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí giao dịch:</span>
                    <span className="font-medium text-green-600">
                      {(method.feePercent || 0) === 0 && (method.feeFixed || 0) === 0 
                        ? 'Miễn phí' 
                        : `${method.feePercent || 0}% + ${formatCurrency(method.feeFixed || 0)}`
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thời gian xử lý:</span>
                    <span className="font-medium">{method.processingTime}</span>
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
      <h3 className="text-lg font-semibold">
        Nhập số tiền nạp
      </h3>
      
      {/* Quick Amount Buttons */}
      <div>
        <p className="text-gray-600 mb-3">Chọn nhanh:</p>
        <div className="grid grid-cols-4 gap-3">
          {quickAmounts.map((item) => (
            <Button
              key={item.value}
              size="large"
              className={`h-12 font-semibold ${
                amount === item.value 
                  ? 'border-2 text-white' 
                  : 'border hover:border-blue-400'
              }`}
              style={{
                borderRadius: '8px',
                ...(amount === item.value && {
                  background: THEME_COLORS.primaryGradient,
                  borderColor: THEME_COLORS.primary
                })
              }}
              onClick={() => handleAmountSelect(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Custom Amount Input */}
      <Form.Item
        name="amount"
        label="Hoặc nhập số tiền tùy chỉnh"
        rules={[
          { required: true, message: 'Vui lòng nhập số tiền' },
          { 
            validator: (_, value) => {
              if (!selectedMethod) return Promise.resolve();
              if (!value) return Promise.reject(new Error('Vui lòng nhập số tiền'));
              
              const numValue = Number(value);
              if (isNaN(numValue)) return Promise.reject(new Error('Số tiền không hợp lệ'));
              
              // Validation cho nạp tiền
              if (numValue < 10000) {
                return Promise.reject(new Error('Số tiền nạp tối thiểu là 10,000 VNĐ'));
              }
              if (numValue > 100000000) {
                return Promise.reject(new Error('Số tiền nạp tối đa là 100,000,000 VNĐ'));
              }
              
              // Validation theo payment method nếu có
              if (selectedMethod.minAmount && numValue < selectedMethod.minAmount) {
                return Promise.reject(new Error(`Số tiền tối thiểu cho phương thức này là ${formatCurrency(selectedMethod.minAmount)}`));
              }
              if (selectedMethod.maxAmount && numValue > selectedMethod.maxAmount) {
                return Promise.reject(new Error(`Số tiền tối đa cho phương thức này là ${formatCurrency(selectedMethod.maxAmount)}`));
              }
              
              return Promise.resolve();
            }
          }
        ]}
      >
        <InputNumber
          size="large"
          placeholder="Nhập số tiền"
          style={{ width: '100%', borderRadius: '8px' }}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
          min={selectedMethod?.minAmount || 0}
          max={selectedMethod?.maxAmount || 999999999}
          onChange={(value) => setAmount(value)}
        />
      </Form.Item>

      {selectedMethod && amount && (
        <Alert
          message={
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Số tiền nạp:</span>
                <span className="font-semibold">{formatCurrency(amount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí giao dịch:</span>
                <span className="font-semibold text-green-600">
                  {(selectedMethod.feePercent || 0) === 0 && (selectedMethod.feeFixed || 0) === 0 
                    ? 'Miễn phí' 
                    : formatCurrency(calculateFee(amount, selectedMethod))
                  }
                </span>
              </div>
              <Divider className="my-2" />
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Số tiền nhận được:</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(amount)}
                </span>
              </div>
            </div>
          }
          type="info"
          showIcon
        />
      )}

      {/* Upload bill cho nạp tiền */}
      <div className="space-y-4">
        <Form.Item
          name="billImage"
          label="Upload ảnh chuyển khoản"
          extra="Vui lòng upload ảnh bill chuyển khoản để admin duyệt nhanh hơn (định dạng: JPG, PNG, tối đa 5MB)"
        >
          <Upload
            listType="picture-card"
            maxCount={1}
            accept="image/*"
            beforeUpload={(file) => {
              const isImage = file.type.startsWith('image/');
              if (!isImage) {
                message.error('Chỉ được upload file ảnh!');
                return false;
              }
              const isLt5M = file.size / 1024 / 1024 < 5;
              if (!isLt5M) {
                message.error('Ảnh phải nhỏ hơn 5MB!');
                return false;
              }
              return false; // Prevent auto upload
            }}
            onChange={(info) => {
              if (info.fileList.length > 0) {
                setBillImage(info.fileList[0].originFileObj);
              } else {
                setBillImage(null);
              }
            }}
            onPreview={(file) => {
              const src = file.url || file.preview;
              if (src) {
                const image = new Image();
                image.src = src;
                const imgWindow = window.open(src);
                imgWindow?.document.write(image.outerHTML);
              }
            }}
          >
            {billImage ? null : (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload ảnh</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item
          name="description"
          label="Ghi chú (không bắt buộc)"
        >
          <Input.TextArea
            rows={3}
            placeholder="Nhập ghi chú cho giao dịch"
            style={{ borderRadius: '8px' }}
          />
        </Form.Item>

        <Form.Item
          name="referenceCode"
          label="Mã tham chiếu/Mã giao dịch ngân hàng (không bắt buộc)"
        >
          <Input
            placeholder="Nhập mã giao dịch từ ngân hàng (nếu có)"
            style={{ borderRadius: '8px' }}
          />
        </Form.Item>
      </div>
    </div>
  );

  const renderTransactionInfo = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Thông tin chuyển khoản</h3>
        
        <Card className="bg-yellow-50 border-yellow-200">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Ngân hàng/Ví:</span>
              <span className="text-lg font-bold">{selectedMethod.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Số tài khoản:</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-blue-600">
                  {selectedMethod.accountNumber}
                </span>
                <Button 
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(selectedMethod.accountNumber)}
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Tên tài khoản:</span>
              <span className="text-lg font-bold">{selectedMethod.accountName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Số tiền:</span>
              <span className="text-lg font-bold text-red-600">
                {formatCurrency(amount)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Nội dung:</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-green-600">
                  NP{Date.now().toString().slice(-6)}
                </span>
                <Button 
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(`NP${Date.now().toString().slice(-6)}`)}
                />
              </div>
            </div>
          </div>
        </Card>

        {selectedMethod.type === 'momo' && (
          <div className="text-center">
            <QRCode 
              value={`2|99|${selectedMethod.accountNumber}|${selectedMethod.accountName}|${amount}|NP${Date.now().toString().slice(-6)}`}
              size={200}
            />
            <p className="text-gray-600 mt-2">Quét mã QR để chuyển khoản nhanh</p>
          </div>
        )}

        <Alert
          message="Lưu ý quan trọng"
          description={
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Chuyển khoản đúng số tiền và nội dung để được xử lý tự động</li>
              <li>Thời gian xử lý: {selectedMethod.processingTime}</li>
              <li>Nếu sau 15 phút chưa nhận được tiền, vui lòng liên hệ hỗ trợ</li>
              <li>Không chia nhỏ giao dịch để tránh bị trì hoãn</li>
            </ul>
          }
          type="warning"
          showIcon
        />
      </div>
    </div>
  );

  const renderSteps = () => {
    if (currentStep === 2) {
      return (
        <Result
          status="success"
          title="Nạp tiền thành công!"
          subTitle={`Đã tạo lệnh nạp ${formatCurrency(amount)}. Vui lòng chuyển khoản để hoàn tất giao dịch.`}
          extra={[
            <Button key="console" onClick={handleReset}>
              Tạo lệnh mới
            </Button>,
            <Button 
              key="buy" 
              type="primary"
              style={{ 
                background: THEME_COLORS.primaryGradient,
                border: 'none'
              }}
            >
              Xem lịch sử giao dịch
            </Button>
          ]}
        />
      );
    }

    return (
      <div>
        <Steps 
          current={currentStep} 
          className="mb-8"
          items={[
            {
              title: 'Chọn phương thức',
              description: 'Chọn phương thức thanh toán',
              icon: <BankOutlined />
            },
            {
              title: 'Nhập số tiền',
              description: 'Nhập số tiền giao dịch',
              icon: <DollarOutlined />
            },
            {
              title: 'Xác nhận',
              description: 'Xác nhận và hoàn tất',
              icon: <CheckCircleOutlined />
            }
          ]}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          {currentStep === 0 && (
            <div className="space-y-6">
              {renderMethodSelection()}
              <div className="flex justify-end">
                <Button 
                  type="primary"
                  size="large"
                  disabled={!selectedMethod}
                  onClick={() => setCurrentStep(1)}
                  style={{ 
                    background: THEME_COLORS.primaryGradient,
                    border: 'none',
                    borderRadius: '8px'
                  }}
                >
                  Tiếp tục
                </Button>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              {renderAmountInput()}
              <div className="flex justify-between">
                <Button 
                  size="large"
                  onClick={() => setCurrentStep(0)}
                  style={{ borderRadius: '8px' }}
                >
                  Quay lại
                </Button>
                <Button 
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={loading}
                  disabled={!amount || !selectedMethod || loading}
                  style={{ 
                    background: THEME_COLORS.primaryGradient,
                    border: 'none',
                    borderRadius: '8px'
                  }}
                >
                  {loading ? 'Đang tạo lệnh...' : 'Tạo lệnh nạp'}
                </Button>
              </div>
            </div>
          )}
        </Form>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Title Header */}
      <div className="text-center pb-3">
        <div className="flex items-center justify-center gap-2 mb-1">
          <ArrowUpOutlined className="text-2xl text-green-600" />
          <h3 className="text-xl md:text-2xl font-bold mb-0 text-gray-800">Nạp tiền vào ví</h3>
        </div>
        <p className="text-sm text-gray-500">
          Chọn phương thức thanh toán và nhập số tiền để nạp vào ví
        </p>
        <div className="mt-2 text-sm font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 inline-block">
          Quy đổi: 1,000đ = 1 điểm
        </div>
      </div>

      {/* Content Card */}
      <Card 
        className="shadow-sm"
        style={{ borderRadius: '12px' }}
        styles={{ body: { padding: window.innerWidth < 768 ? '16px' : '24px' } }}
      >
        {currentStep < 2 ? renderSteps() : renderTransactionInfo()}
      </Card>
    </div>
  );
};

export default DepositWithdraw;