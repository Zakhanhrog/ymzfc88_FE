import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Upload,
  Spin
} from 'antd';
import Loading from '../../../components/common/Loading';
import {
  ArrowUpOutlined,
  BankOutlined,
  MobileOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CopyOutlined,
  UploadOutlined,
  LinkOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { THEME_COLORS } from '../../../utils/theme';
import { formatCurrency, formatPoints } from '../../../utils/helpers';
import { HEADING_STYLES, BODY_STYLES, FONT_SIZE, FONT_WEIGHT } from '../../../utils/typography';
import walletService from '../services/walletService';

const { Step } = Steps;

const DepositWithdraw = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [amount, setAmount] = useState(null);
  // Mã nội dung chuyển khoản (giữ ổn định trong một phiên giao dịch)
  const transferContentRef = useRef(`NP${Date.now().toString().slice(-6)}`);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transactionResult, setTransactionResult] = useState(null);
  const [billImage, setBillImage] = useState(null);
  const [form] = Form.useForm();
  const [checkingStatus, setCheckingStatus] = useState(false);
  const pollingIntervalRef = useRef(null);

  const stopStatusPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
      setCheckingStatus(false);
    }
  }, []);

  // Polling để kiểm tra trạng thái thanh toán tự động
  const startStatusPolling = useCallback((transactionId) => {
    stopStatusPolling(); // Dừng polling cũ nếu có
    
    setCheckingStatus(true);
    let pollCount = 0;
    const maxPolls = 60; // Tối đa 60 lần (5 phút với interval 5s)
    
    pollingIntervalRef.current = setInterval(async () => {
      pollCount++;
      
      try {
        const response = await walletService.getTransactionDetail(transactionId);
        if (response.success && response.data) {
          const transaction = response.data;
          
          // Nếu đã được approve hoặc completed, dừng polling
          if (transaction.status === 'APPROVED' || transaction.status === 'COMPLETED') {
            stopStatusPolling();
            setTransactionResult(transaction);
            
            // Xóa transaction state khỏi localStorage vì đã hoàn thành
            localStorage.removeItem('pendingDepositTransaction');
            
            message.success('Thanh toán thành công! Tiền đã được cộng vào tài khoản.');
            
            // Refresh wallet balance
            window.dispatchEvent(new CustomEvent('transactionCreated', {
              detail: { type: 'DEPOSIT', transaction: transaction }
            }));
            return;
          }
          
          // Nếu bị reject hoặc cancelled, dừng polling
          if (transaction.status === 'REJECTED' || transaction.status === 'CANCELLED') {
            stopStatusPolling();
            setTransactionResult(transaction);
            
            // Xóa transaction state khỏi localStorage vì đã kết thúc
            localStorage.removeItem('pendingDepositTransaction');
            
            message.warning('Giao dịch đã bị hủy hoặc từ chối.');
            return;
          }
        }
        
        // Nếu đã poll quá nhiều lần, dừng lại
        if (pollCount >= maxPolls) {
          stopStatusPolling();
          message.info('Đã kiểm tra trạng thái trong 5 phút. Vui lòng kiểm tra lại sau.');
        }
      } catch (error) {
        console.error('Error checking transaction status:', error);
        // Tiếp tục polling nếu có lỗi
      }
    }, 5000); // Kiểm tra mỗi 5 giây
  }, [stopStatusPolling]);

  // Load payment methods khi component mount
  useEffect(() => {
    loadPaymentMethods();
    
    // Kiểm tra xem có transaction code trong URL không (từ returnUrl của gateway)
    const urlParams = new URLSearchParams(window.location.search);
    const transactionCodeFromUrl = urlParams.get('transaction');
    
    // Restore transaction state từ localStorage nếu có pending transaction
    const savedTransaction = localStorage.getItem('pendingDepositTransaction');
    if (savedTransaction) {
      try {
        const transaction = JSON.parse(savedTransaction);
        
        // Nếu có transaction code trong URL, kiểm tra xem có khớp không
        if (transactionCodeFromUrl && transaction.transactionCode !== transactionCodeFromUrl) {
          // Transaction code không khớp, xóa localStorage
          localStorage.removeItem('pendingDepositTransaction');
          return;
        }
        
        // Chỉ restore nếu transaction đang pending và là auto deposit
        if (transaction.status === 'PENDING' && transaction.isAutoDeposit && transaction.gatewayPayUrl) {
          setTransactionResult(transaction);
          setCurrentStep(3);
          setAmount(transaction.amount);
          // Tiếp tục polling nếu có transaction ID
          if (transaction.id) {
            startStatusPolling(transaction.id);
          }
          
          // Nếu có transaction code trong URL, có thể user vừa quay lại từ gateway
          if (transactionCodeFromUrl) {
            message.info('Đang kiểm tra trạng thái thanh toán...');
            // Load lại transaction detail từ server để có thông tin mới nhất
            if (transaction.id) {
              walletService.getTransactionDetail(transaction.id)
                .then(response => {
                  if (response.success && response.data) {
                    const latestTransaction = response.data;
                    setTransactionResult(latestTransaction);
                    
                    // Nếu đã approved, cập nhật localStorage
                    if (latestTransaction.status === 'APPROVED' || latestTransaction.status === 'COMPLETED') {
                      localStorage.removeItem('pendingDepositTransaction');
                      message.success('Thanh toán thành công! Tiền đã được cộng vào tài khoản.');
                      // Refresh wallet balance
                      window.dispatchEvent(new CustomEvent('transactionCreated', {
                        detail: { type: 'DEPOSIT', transaction: latestTransaction }
                      }));
                    }
                  }
                })
                .catch(error => {
                  console.error('Error loading transaction detail:', error);
                });
            }
          }
        } else {
          // Xóa nếu đã hoàn thành hoặc không phải auto deposit
          localStorage.removeItem('pendingDepositTransaction');
        }
      } catch (error) {
        console.error('Error restoring transaction state:', error);
        localStorage.removeItem('pendingDepositTransaction');
      }
    } else if (transactionCodeFromUrl) {
      // Có transaction code trong URL nhưng không có trong localStorage
      // Có thể user đã reload trang hoặc clear localStorage
      // Tìm transaction theo code (cần thêm API endpoint hoặc bỏ qua)
      message.info('Đang tải thông tin giao dịch...');
    }
  }, [startStatusPolling]);

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
        return <img src="/iconacc/imgi_25_deposit.avif" alt="MoMo" className="w-8 h-8 md:w-10 md:h-10" />;
      case 'BANK':
        return <img src="/iconacc/imgi_27_bank.avif" alt="Bank" className="w-8 h-8 md:w-10 md:h-10" />;
      case 'USDT':
        return <img src="/iconacc/imgi_25_deposit.avif" alt="USDT" className="w-8 h-8 md:w-10 md:h-10" />;
      default:
        return <img src="/iconacc/imgi_27_bank.avif" alt="Bank" className="w-8 h-8 md:w-10 md:h-10" />;
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

  // Xử lý khi ấn "Thanh toán" ở Step 1 - chuyển sang Step 2 (QR code)
  const handleProceedToPayment = () => {
    if (!amount || !selectedMethod) {
      message.error('Vui lòng chọn phương thức và nhập số tiền');
      return;
    }
    
    // Nếu phương thức có channelCode (auto deposit OKDPAY) thì tạo đơn luôn
    if (selectedMethod.channelCode) {
      handleConfirmPayment();
      return;
    }

    // Manual transfer: hiển thị VietQR để người dùng tự chuyển
    setCurrentStep(2);
  };

  // Xử lý khi ấn "Xác nhận" ở Step 2 - tạo lệnh nạp tiền
  const handleConfirmPayment = async () => {
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
        description: '', // Bỏ ghi chú
        referenceCode: '', // Bỏ mã tham chiếu
        billImage: billImageBase64,
        billImageName: billImage ? billImage.name : null
      };
      
      const response = await walletService.createDepositOrder(depositData);
      if (response.success) {
        setTransactionResult(response.data);

        // Trường hợp auto deposit và có gatewayPayUrl -> điều hướng đến trang thanh toán
        if (response.data.isAutoDeposit && response.data.gatewayPayUrl) {
          // Lưu transaction state vào localStorage để restore khi reload
          localStorage.setItem('pendingDepositTransaction', JSON.stringify(response.data));
          
          message.success('Đang chuyển đến trang thanh toán...');
          
          // Bắt đầu polling trạng thái
          if (response.data.id) {
            startStatusPolling(response.data.id);
          }
          
          // Điều hướng trực tiếp đến trang thanh toán OKDPAY
          // Sử dụng window.location.href để đảm bảo user được điều hướng đến trang thanh toán
          setTimeout(() => {
            window.location.href = response.data.gatewayPayUrl;
          }, 500); // Delay 500ms để user thấy message success
          
          return; // Dừng xử lý, không set step vì sẽ điều hướng
        } 
        // Trường hợp auto deposit nhưng không trả payUrl -> fallback sang hiển thị QR/VietQR thủ công
        else if (response.data.isAutoDeposit && !response.data.gatewayPayUrl) {
          message.warning('Không lấy được link thanh toán tự động, vui lòng chuyển khoản thủ công.');
          setCurrentStep(2);
        } 
        // Manual deposit (không auto hoặc đã fallback)
        else {
          message.success('Đã tạo lệnh nạp tiền thành công! Vui lòng chuyển khoản theo thông tin.');
          setCurrentStep(2);
        }
        
        // Dispatch custom event to notify other components to refresh
        window.dispatchEvent(new CustomEvent('transactionCreated', {
          detail: { type: 'DEPOSIT', transaction: response.data }
        }));
      } else {
        message.error('Lỗi: ' + (response.message || 'Không xác định'));
      }
    } catch (error) {
      message.error('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedMethod(null);
    setAmount(null);
    setTransactionResult(null);
    transferContentRef.current = `NP${Date.now().toString().slice(-6)}`;
    setBillImage(null);
    setCheckingStatus(false);
    stopStatusPolling();
    
    // Xóa transaction state khỏi localStorage khi reset
    localStorage.removeItem('pendingDepositTransaction');
    
    form.resetFields();
  };

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      stopStatusPolling();
    };
  }, [stopStatusPolling]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    message.success('Đã sao chép vào clipboard');
  };

  const renderMethodSelection = () => (
    <div className="space-y-4">
      <h3 className="text-base md:text-lg font-semibold mb-4">
        Chọn phương thức nạp tiền
      </h3>
      
      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {paymentMethods.map((method) => (
              <Card
              key={method.id}
                className={`cursor-pointer transition-all duration-300 ${
                  selectedMethod?.id === method.id 
                  ? 'border-2 shadow-md' 
                  : 'border hover:shadow-sm'
                }`}
                style={{ 
                  borderRadius: '12px',
                borderColor: selectedMethod?.id === method.id ? THEME_COLORS.primary : '#e5e7eb'
                }}
              styles={{ body: { padding: '16px' } }}
                onClick={() => handleMethodSelect(method)}
              >
                <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center">{getMethodIcon(method.type)}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm md:text-lg">{method.name}</h4>
                  <p className="text-gray-500 text-xs md:text-sm">{method.accountNumber}</p>
                  </div>
                  {selectedMethod?.id === method.id && (
                    <CheckCircleOutlined 
                    className="text-green-500 text-lg md:text-xl" 
                    />
                  )}
                </div>
                
              <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hạn mức:</span>
                    <span className="font-medium">
                      {formatCurrency(method.minAmount)} - {formatCurrency(method.maxAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                  <span className="text-gray-600">Phí:</span>
                    <span className="font-medium text-green-600">
                      {(method.feePercent || 0) === 0 && (method.feeFixed || 0) === 0 
                        ? 'Miễn phí' 
                        : `${method.feePercent || 0}% + ${formatCurrency(method.feeFixed || 0)}`
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                  <span className="text-gray-600">Thời gian:</span>
                    <span className="font-medium">{method.processingTime}</span>
                  </div>
                </div>
              </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderAmountInput = () => (
    <div className="space-y-4 md:space-y-6">
      <h3 className="text-base md:text-lg font-semibold">
        Nhập số tiền nạp
      </h3>
      
      {/* Quick Amount Buttons */}
      <div>
        <p className="text-gray-600 mb-2 md:mb-3 text-sm">Chọn nhanh:</p>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {quickAmounts.map((item) => (
            <Button
              key={item.value}
              size="large"
              className={`h-10 md:h-12 font-semibold text-xs md:text-sm flex-1 min-w-[80px] ${
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
              <div className="flex justify-between text-xs md:text-sm">
                <span>Số tiền nạp:</span>
                <span className="font-semibold">{formatCurrency(amount)}</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span>Phí giao dịch:</span>
                <span className="font-semibold text-green-600">
                  {(selectedMethod.feePercent || 0) === 0 && (selectedMethod.feeFixed || 0) === 0 
                    ? 'Miễn phí' 
                    : formatCurrency(calculateFee(amount, selectedMethod))
                  }
                </span>
              </div>
              <Divider className="my-2" />
              <div className="flex justify-between text-sm md:text-base">
                <span className="font-semibold">Số tiền nhận được:</span>
                <span className="font-semibold text-green-600">
                  {formatPoints(amount - calculateFee(amount, selectedMethod))}
                </span>
              </div>
            </div>
          }
          type="info"
          showIcon={false}
        />
      )}

    </div>
  );

  // Sinh URL VietQR (dạng ảnh) để dễ quét bằng app ngân hàng
  const getVietQrUrl = () => {
    if (!selectedMethod?.bankCode || !selectedMethod?.accountNumber) return null;
    const addInfo =
      transactionResult?.transactionCode ||
      transactionResult?.referenceCode ||
      transferContentRef.current;
    const encodedName = encodeURIComponent(selectedMethod.accountName || '');
    const encodedInfo = encodeURIComponent(addInfo);
    const amountParam = amount ? `&amount=${amount}` : '';
    return `https://img.vietqr.io/image/${selectedMethod.bankCode}-${selectedMethod.accountNumber}-qr_only.png?accountName=${encodedName}${amountParam}&addInfo=${encodedInfo}`;
  };

  // Render QR code và upload ảnh ở Step 2
  const renderPaymentStep = () => {
    const qrImageUrl = getVietQrUrl();
    const transferContent =
      transactionResult?.transactionCode ||
      transactionResult?.referenceCode ||
      transferContentRef.current;
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">
            {transactionResult?.isAutoDeposit && !transactionResult?.gatewayPayUrl
              ? 'Không lấy được QR tự động, vui lòng quét VietQR và chuyển khoản'
              : 'Quét mã QR để thanh toán'}
          </h3>
          
          {/* QR Code */}
          <div className="text-center mb-6">
            <div className="inline-block p-4 bg-white rounded-lg shadow-md">
              {qrImageUrl ? (
                <img
                  src={qrImageUrl}
                  alt="VietQR"
                  className="w-[250px] h-[250px] object-contain"
                />
              ) : (
                <QRCode 
                  value={selectedMethod?.accountNumber || 'VietQR'}
                  size={250}
                  errorLevel="M"
                />
              )}
            </div>
            <p className="text-gray-600 mt-4 text-sm">
              Quét mã QR bằng ứng dụng ngân hàng để chuyển khoản nhanh
            </p>
          </div>

          {/* Thông tin chuyển khoản */}
          <Card className="bg-yellow-50 border-yellow-200 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Ngân hàng/Ví:</span>
                <span className="text-base font-bold">{selectedMethod.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Số tài khoản:</span>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-blue-600">
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
                <span className="text-base font-bold">{selectedMethod.accountName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Số tiền:</span>
                <span className="text-base font-bold text-green-600">
                  {formatCurrency(amount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Nội dung:</span>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-green-600">
                    {transferContent}
                  </span>
                  <Button 
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={() => copyToClipboard(transferContent)}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Upload ảnh chuyển khoản */}
      <div className="space-y-4">
            <h4 className="font-semibold text-base">Upload ảnh chuyển khoản</h4>
            <p className="text-sm text-gray-600 mb-4">
              Vui lòng upload ảnh bill chuyển khoản để admin duyệt nhanh hơn (định dạng: JPG, PNG, tối đa 5MB)
            </p>
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
          </div>

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
            className="mt-4"
        />

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              size="large"
              onClick={() => setCurrentStep(1)}
              className="flex-1 h-12"
              style={{ borderRadius: '8px' }}
            >
              Quay lại
            </Button>
            <Button 
              type="primary"
              size="large"
              onClick={handleConfirmPayment}
              loading={loading}
              disabled={loading}
              className="flex-1 h-12 text-white font-semibold hover:opacity-90"
              style={{ 
                background: THEME_COLORS.primaryGradient,
                border: 'none',
                borderRadius: '8px'
              }}
            >
              {loading ? 'Đang tạo lệnh...' : 'Xác nhận đã chuyển khoản'}
            </Button>
          </div>
        </div>
    </div>
  );
  };

  const renderProgressBar = () => {
    const steps = [
      { key: 0, label: 'Nạp tiền' },
      { key: 1, label: 'Thanh toán' },
      { key: 2, label: 'Hoàn thành' }
    ];

    // Determine active step: 0 = Nạp tiền, 1 = Thanh toán, 2 = Hoàn thành
    let activeStep = currentStep;
    if (currentStep === 0) activeStep = 0; // Chọn phương thức = Nạp tiền
    else if (currentStep === 1) activeStep = 0; // Nhập số tiền = vẫn ở Nạp tiền
    else if (currentStep === 2) activeStep = 1; // QR code = Thanh toán
    else if (currentStep === 3) activeStep = 2; // Kết quả = Hoàn thành

    return (
      <div className="mb-6 py-2">
        <div className="flex items-center justify-between relative">
          {/* Connecting line - luôn cố định giữa các circle (center của circle = 12px từ top) */}
          <div 
            className="absolute h-[1px] z-0"
            style={{ 
              background: '#d1d5db',
              top: '12px',
              left: 'calc(16.67% + 12px)',
              width: 'calc(66.66% - 24px)'
            }}
          ></div>
          
          {steps.map((step, index) => {
            const isActive = activeStep === step.key;
            const isCompleted = activeStep > step.key;

      return (
              <div key={step.key} className="flex-1 flex flex-col items-center relative z-10">
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center mb-1.5 transition-colors duration-300 ${
                    isActive 
                      ? 'bg-green-500 border-2 border-green-500' 
                      : isCompleted
                      ? 'bg-green-500 border-2 border-green-500'
                      : 'bg-white border-2 border-gray-300'
                  }`}
                >
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  )}
                  {isCompleted && (
                    <CheckCircleOutlined className="text-white" style={{ fontSize: '14px' }} />
                  )}
                  {!isActive && !isCompleted && (
                    <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                  )}
              </div>
                <span 
                  className="text-xs text-center italic font-normal transition-colors duration-300"
                  style={{
                    color: isActive || isCompleted ? '#16a34a' : '#9ca3af'
                  }}
                >
                {step.label}
              </span>
            </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSuccessResult = () => {
    const isAutoDeposit = transactionResult?.isAutoDeposit;
    const gatewayPayUrl = transactionResult?.gatewayPayUrl;
    const transactionStatus = transactionResult?.status;
    
    // Nếu là auto deposit và có link thanh toán
    if (isAutoDeposit && gatewayPayUrl) {
      return (
        <div className="text-center space-y-4">
          <Result
            status={transactionStatus === 'APPROVED' || transactionStatus === 'COMPLETED' ? 'success' : 'info'}
            title={
              <span style={{ fontSize: '18px' }}>
                {transactionStatus === 'APPROVED' || transactionStatus === 'COMPLETED' 
                  ? 'Thanh toán thành công!' 
                  : 'Đã tạo lệnh nạp tiền tự động!'}
              </span>
            }
            subTitle={
              <div className="space-y-3" style={{ fontSize: '14px' }}>
                <p>Mã giao dịch: <strong>{transactionResult?.transactionCode || transactionResult?.id}</strong></p>
                <p>Số tiền nạp: <strong className="text-orange-600">{formatCurrency(amount)}</strong></p>
                
                {transactionStatus === 'APPROVED' || transactionStatus === 'COMPLETED' ? (
                  <>
                    <Alert
                      message="Thanh toán thành công!"
                      description="Tiền đã được cộng vào tài khoản của bạn."
                      type="success"
                      showIcon
                      className="text-left"
                    />
                  </>
                ) : (
                  <>
                    <Alert
                      message="Vui lòng thanh toán"
                      description={
                        <div className="space-y-2 mt-2">
                          <p>Nhấn nút bên dưới để chuyển đến trang thanh toán.</p>
                          <div className="flex flex-col items-center gap-2">
                            <QRCode value={gatewayPayUrl} size={220} />
                            <Button 
                              size="small"
                              icon={<CopyOutlined />}
                              onClick={() => copyToClipboard(gatewayPayUrl)}
                            >
                              Sao chép link thanh toán
                            </Button>
                          </div>
                          {checkingStatus && (
                            <div className="flex items-center gap-2 justify-center">
                              <Spin size="small" />
                              <span className="text-xs">Đang kiểm tra trạng thái thanh toán...</span>
                            </div>
                          )}
                        </div>
                      }
                      type="info"
                      showIcon
                      className="text-left"
                    />
                    
                    <div className="pt-2">
                      <Button
                        type="primary"
                        size="large"
                        icon={<LinkOutlined />}
                        onClick={() => {
                          // Điều hướng trực tiếp đến trang thanh toán
                          window.location.href = gatewayPayUrl;
                        }}
                        style={{
                          background: THEME_COLORS.primaryGradient,
                          border: 'none',
                          fontSize: '16px',
                          height: '48px',
                          padding: '0 32px'
                        }}
                      >
                        Thanh toán ngay
                      </Button>
                    </div>
                    
                    <div className="pt-2">
                      <Button
                        icon={<ReloadOutlined />}
                        onClick={() => {
                          // Chỉ dùng ID (Long), không dùng transactionCode (String)
                          if (transactionResult?.id) {
                            startStatusPolling(transactionResult.id);
                          } else {
                            message.error('Không có transaction ID để kiểm tra');
                          }
                        }}
                        disabled={checkingStatus}
                      >
                        {checkingStatus ? 'Đang kiểm tra...' : 'Kiểm tra trạng thái'}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            }
            extra={[
              <Button 
                key="history" 
                onClick={() => {
                  navigate(`/wallet?tab=transaction-history&refresh=${Date.now()}`);
                }} 
                style={{ fontSize: '14px' }}
              >
                Xem lịch sử
              </Button>,
              <Button 
                key="new"
                type="primary"
                onClick={handleReset}
                style={{ 
                  background: THEME_COLORS.primaryGradient,
                  border: 'none',
                  fontSize: '14px'
                }}
              >
                Tạo lệnh mới
              </Button>,
            ]}
          />
        </div>
      );
    }
    
    // Manual deposit (fallback)
    return (
    <div className="text-center">
        <Result
          status="success"
        title={<span style={{ fontSize: '18px' }}>Nạp tiền thành công!</span>}
        subTitle={
          <div className="space-y-1.5" style={{ fontSize: '14px' }}>
              <p>Mã giao dịch: <strong>{transactionResult?.transactionCode || transactionResult?.id}</strong></p>
            <p>Số tiền nạp: <strong className="text-orange-600">{formatCurrency(amount)}</strong></p>
            <p>Thời gian xử lý dự kiến: {selectedMethod?.processingTime || '5-15 phút'}</p>
            <p className="text-sm text-gray-500">
              Vui lòng chuyển khoản theo thông tin đã cung cấp để hoàn tất giao dịch
            </p>
          </div>
        }
          extra={[
            <Button 
              key="history" 
              onClick={() => {
            navigate(`/wallet?tab=transaction-history&refresh=${Date.now()}`);
              }} 
              style={{ fontSize: '14px' }}
            >
            Xem lịch sử
            </Button>,
            <Button 
            key="new"
              type="primary"
            onClick={handleReset}
              style={{ 
                background: THEME_COLORS.primaryGradient,
              border: 'none',
              fontSize: '14px'
              }}
            >
            Tạo lệnh mới
          </Button>,
          ]}
        />
    </div>
      );
  };


  const renderSteps = () => {
    return (
      <div>
        {renderProgressBar()}

        <Form
          form={form}
          layout="vertical"
        >
          {currentStep === 0 && (
            <div className="space-y-4 md:space-y-6">
              {renderMethodSelection()}
              <div className="flex justify-end pt-2">
                <Button 
                  type="primary"
                  size="large"
                  disabled={!selectedMethod}
                  onClick={() => setCurrentStep(1)}
                  className="w-full md:w-auto h-11 md:h-12 text-white font-semibold hover:opacity-90"
                  style={{ 
                    background: THEME_COLORS.primaryGradient,
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#ffffff'
                  }}
                >
                  Tiếp tục
                </Button>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4 md:space-y-6">
              {renderAmountInput()}
              <div className="flex gap-2 md:gap-3 pt-2">
                <Button 
                  size="large"
                  onClick={() => setCurrentStep(0)}
                  className="flex-1 md:flex-initial h-11 md:h-12 text-xs md:text-sm"
                  style={{ borderRadius: '8px' }}
                >
                  Quay lại
                </Button>
                <Button 
                  type="primary"
                  size="large"
                  onClick={handleProceedToPayment}
                  disabled={!amount || !selectedMethod}
                  className="flex-1 md:flex-initial h-11 md:h-12 text-xs md:text-sm text-white font-semibold hover:opacity-90"
                  style={{ 
                    background: THEME_COLORS.primaryGradient,
                    border: 'none',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                >
                  Thanh toán
                </Button>
              </div>
            </div>
          )}
        </Form>
      </div>
    );
  };

  return (
    <div className="bg-gray-50">
      <div className="pb-6">
      <Card 
        className="shadow-sm md:shadow-md"
        style={{ borderRadius: '12px' }}
        styles={{ body: { padding: '16px', paddingTop: '16px' } }}
      >
        {currentStep === 3 ? (
          <>
            {renderProgressBar()}
            {renderSuccessResult()}
          </>
        ) : currentStep === 2 ? (
          <>
            {renderProgressBar()}
            {renderPaymentStep()}
          </>
        ) : renderSteps()}
      </Card>
      </div>
    </div>
  );
};

export default DepositWithdraw;