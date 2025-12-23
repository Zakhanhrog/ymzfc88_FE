import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import Alert from '../../../components/ui/Alert';
import Loading from '../../../components/common/Loading';
import Spinner from '../../../components/ui/Spinner';
import { QRCode } from 'antd'; // Giữ lại QRCode từ antd vì không có alternative tốt
import { 
  CheckCircle2, 
  Copy, 
  Upload, 
  Link2, 
  RotateCcw,
  ArrowUp,
  Banknote,
  Clock
} from 'lucide-react';
import { message } from '../../../utils/notification';
import { THEME_COLORS } from '../../../utils/theme';
import { formatCurrency, formatPoints } from '../../../utils/helpers';
import walletService from '../services/walletService';

const DepositWithdraw = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [amount, setAmount] = useState(null);
  const [amountError, setAmountError] = useState('');
  // Mã nội dung chuyển khoản (giữ ổn định trong một phiên giao dịch)
  const transferContentRef = useRef(`NP${Date.now().toString().slice(-6)}`);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creatingTransaction, setCreatingTransaction] = useState(false);
  const [transactionResult, setTransactionResult] = useState(null);
  const [billImage, setBillImage] = useState(null);
  const [billImagePreview, setBillImagePreview] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const pollingIntervalRef = useRef(null);
  const fileInputRef = useRef(null);
  const [countdown, setCountdown] = useState(600); // 10 phút = 600 giây
  const countdownIntervalRef = useRef(null);

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
          // Reset countdown khi restore
          setCountdown(600);
          
          // Bắt đầu countdown timer
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
          }
          countdownIntervalRef.current = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(countdownIntervalRef.current);
                handleReset();
                message.info('Đã hết thời gian. Vui lòng tạo lệnh mới.');
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          
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
    setAmountError('');
  };

  const handleAmountSelect = (value) => {
    setAmount(value);
    setAmountError('');
    validateAmount(value);
  };

  const validateAmount = (value) => {
    if (!selectedMethod) {
      setAmountError('Vui lòng chọn phương thức thanh toán trước');
      return false;
    }
    
    if (!value) {
      setAmountError('Vui lòng nhập số tiền');
      return false;
    }
    
    const numValue = Number(value);
    if (isNaN(numValue)) {
      setAmountError('Số tiền không hợp lệ');
      return false;
    }
    
    // Validation theo payment method (ưu tiên)
    if (selectedMethod.minAmount && numValue < selectedMethod.minAmount) {
      setAmountError(`Số tiền tối thiểu cho phương thức này là ${formatCurrency(selectedMethod.minAmount)}`);
      return false;
    }
    if (selectedMethod.maxAmount && numValue > selectedMethod.maxAmount) {
      setAmountError(`Số tiền tối đa cho phương thức này là ${formatCurrency(selectedMethod.maxAmount)}`);
      return false;
    }
    
    // Validation chung (fallback nếu không có payment method)
    if (!selectedMethod.minAmount && numValue < 10000) {
      setAmountError('Số tiền nạp tối thiểu là 10,000 VNĐ');
      return false;
    }
    if (!selectedMethod.maxAmount && numValue > 300000000) {
      setAmountError('Số tiền nạp tối đa là 300,000,000 VNĐ');
      return false;
    }
    
    setAmountError('');
    return true;
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/,/g, '');
    const numValue = value ? Number(value) : null;
    setAmount(numValue);
    if (numValue) {
      validateAmount(numValue);
    } else {
      setAmountError('');
    }
  };

  const formatAmountInput = (value) => {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Xử lý khi ấn "Thanh toán" ở Step 1 - chuyển sang Step 2 (QR code)
  const handleProceedToPayment = async () => {
    if (!amount || !selectedMethod) {
      message.error('Vui lòng chọn phương thức và nhập số tiền');
      return;
    }
    
    if (!validateAmount(amount)) {
      return;
    }
    
    // Nếu phương thức có channelCode (auto deposit KPay) thì tạo đơn luôn
    if (selectedMethod.channelCode) {
      await handleConfirmPayment();
      return;
    }

    // Manual transfer: hiển thị VietQR để người dùng tự chuyển
    setCurrentStep(2);
  };

  // Xử lý khi ấn "Xác nhận" ở Step 2 - tạo lệnh nạp tiền
  const handleConfirmPayment = async () => {
    try {
      setCreatingTransaction(true);
      setLoading(true);
      
      let billImageBase64 = null;
      
      // Xử lý upload ảnh nếu có
      if (billImage) {
        try {
          // Validate file size (max 5MB)
          if (billImage.size > 5 * 1024 * 1024) {
            message.error('Kích thước ảnh không được vượt quá 5MB');
            setCreatingTransaction(false);
            setLoading(false);
            return;
          }
          
          // Validate file type
          if (!billImage.type.startsWith('image/')) {
            message.error('Chỉ được upload file ảnh (JPG, PNG, GIF)');
            setCreatingTransaction(false);
            setLoading(false);
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
          setCreatingTransaction(false);
          setLoading(false);
          return;
        }
      }
      
      const depositData = {
        paymentMethodId: selectedMethod.id,
        amount: Number(amount),
        description: '',
        referenceCode: '',
        billImage: billImageBase64,
        billImageName: billImage ? billImage.name : null
      };
      
      const response = await walletService.createDepositOrder(depositData);
      if (response.success) {
        setTransactionResult(response.data);
        // Reset countdown khi tạo lệnh mới
        setCountdown(600);

        // Trường hợp auto deposit và có gatewayPayUrl -> điều hướng đến trang thanh toán
        if (response.data.isAutoDeposit && response.data.gatewayPayUrl) {
          // Lưu transaction state vào localStorage để restore khi reload
          localStorage.setItem('pendingDepositTransaction', JSON.stringify(response.data));
          
          message.success('Đang chuyển đến trang thanh toán...');
          
          // Bắt đầu polling trạng thái
          if (response.data.id) {
            startStatusPolling(response.data.id);
          }
          
          // Bắt đầu countdown timer
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
          }
          countdownIntervalRef.current = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(countdownIntervalRef.current);
                handleReset();
                message.info('Đã hết thời gian. Vui lòng tạo lệnh mới.');
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          
          // Điều hướng trực tiếp đến trang thanh toán KPay
          setTimeout(() => {
            window.location.href = response.data.gatewayPayUrl;
          }, 500);
          
          return;
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
      setCreatingTransaction(false);
    }
  };

  const handleReset = () => {
    // Clear countdown interval
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setCountdown(600);
    setCurrentStep(0);
    setSelectedMethod(null);
    setAmount(null);
    setAmountError('');
    setTransactionResult(null);
    transferContentRef.current = `NP${Date.now().toString().slice(-6)}`;
    setBillImage(null);
    setBillImagePreview(null);
    setCheckingStatus(false);
    stopStatusPolling();
    
    // Xóa transaction state khỏi localStorage khi reset
    localStorage.removeItem('pendingDepositTransaction');
  };

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      stopStatusPolling();
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [stopStatusPolling]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    message.success('Đã sao chép vào clipboard');
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      message.error('Chỉ được upload file ảnh!');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      message.error('Ảnh phải nhỏ hơn 5MB!');
      return;
    }

    setBillImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setBillImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setBillImage(null);
    setBillImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderMethodSelection = () => (
    <div className="space-y-4">
      <h3 className="text-base md:text-lg font-semibold mb-4">
        Chọn phương thức nạp tiền
      </h3>
      
      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {paymentMethods.map((method) => (
            <Card
              key={method.id}
              className={`cursor-pointer transition-colors duration-200 ${
                selectedMethod?.id === method.id 
                ? 'border-2' 
                : 'border'
              }`}
              style={{ 
                borderRadius: '12px',
                borderColor: selectedMethod?.id === method.id ? THEME_COLORS.primary : '#e5e7eb',
                backgroundColor: selectedMethod?.id === method.id ? '#f0f9ff' : 'white'
              }}
              onClick={() => handleMethodSelect(method)}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="flex items-center justify-center flex-shrink-0">
                    {getMethodIcon(method.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm md:text-base truncate">{method.name}</h4>
                  </div>
                  {selectedMethod?.id === method.id && (
                    <CheckCircle2 
                      className="text-green-500 w-5 h-5 flex-shrink-0" 
                    />
                  )}
                </div>
                
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Hạn mức:</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(method.minAmount)} - {formatCurrency(method.maxAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Phí:</span>
                    <span className="font-medium text-green-600">
                      {(method.feePercent || 0) === 0 && (method.feeFixed || 0) === 0 
                        ? 'Miễn phí' 
                        : `${method.feePercent || 0}% + ${formatCurrency(method.feeFixed || 0)}`
                      }
                    </span>
                  </div>
                  {method.processingTime && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Thời gian:</span>
                      <span className="font-medium text-gray-700">{method.processingTime}</span>
                    </div>
                  )}
                </div>
              </CardContent>
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
              variant={amount === item.value ? 'primary' : 'outline'}
              className={`h-10 px-4 font-semibold text-sm flex-1 min-w-[80px] rounded-lg transition-all shadow-sm ${
                amount === item.value 
                  ? 'bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white' 
                  : ''
              }`}
              onClick={() => handleAmountSelect(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Custom Amount Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hoặc nhập số tiền tùy chỉnh
        </label>
        <Input
          type="text"
          placeholder="Nhập số tiền"
          value={formatAmountInput(amount)}
          onChange={handleAmountChange}
          className="h-12 text-base"
          style={{ borderRadius: '8px' }}
        />
        {amountError && (
          <p className="mt-1 text-sm text-red-500">{amountError}</p>
        )}
      </div>

      {selectedMethod && amount && !amountError && (
        <Alert
          type="info"
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
              <div className="border-t border-gray-200 my-2"></div>
              <div className="flex justify-between text-sm md:text-base">
                <span className="font-semibold">Số tiền nhận được:</span>
                <span className="font-semibold text-green-600">
                  {formatPoints(amount - calculateFee(amount, selectedMethod))}
                </span>
              </div>
            </div>
          }
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
          <h3 className="text-base font-semibold mb-4">
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
            <p className="text-gray-600 mt-4 text-xs">
              Quét mã QR bằng ứng dụng ngân hàng để chuyển khoản nhanh
            </p>
          </div>

          {/* Thông tin chuyển khoản */}
          <Card className="bg-yellow-50 border-yellow-200 mb-6">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Ngân hàng/Ví:</span>
                  <span className="text-sm font-semibold">{selectedMethod.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Số tài khoản:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-blue-600">
                      {selectedMethod.accountNumber}
                    </span>
                    <Button 
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(selectedMethod.accountNumber)}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Tên tài khoản:</span>
                  <span className="text-sm font-semibold">{selectedMethod.accountName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Số tiền:</span>
                  <span className="text-sm font-semibold text-green-600">
                    {formatCurrency(amount)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Nội dung:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-green-600">
                      {transferContent}
                    </span>
                    <Button 
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(transferContent)}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload ảnh chuyển khoản */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Upload ảnh chuyển khoản</h4>
            <p className="text-xs text-gray-600 mb-4">
              Vui lòng upload ảnh bill chuyển khoản để admin duyệt nhanh hơn (định dạng: JPG, PNG, tối đa 5MB)
            </p>
            
            <div className="flex flex-col items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {billImagePreview ? (
                <div className="relative">
                  <img
                    src={billImagePreview}
                    alt="Bill preview"
                    className="max-w-full max-h-64 rounded-lg border-2 border-gray-200"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2"
                  >
                    Xóa
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-32 w-full md:w-auto md:min-w-[200px] flex flex-col items-center justify-center gap-2"
                >
                  <Upload className="w-6 h-6" />
                  <span>Chọn ảnh</span>
                </Button>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline"
              onClick={() => setCurrentStep(1)}
              className="flex-1 h-10 px-6 text-sm rounded-lg transition-all shadow-sm"
            >
              Quay lại
            </Button>
            <Button 
              variant="primary"
              onClick={handleConfirmPayment}
              disabled={loading}
              className="flex-1 h-10 px-6 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white font-semibold text-sm rounded-lg transition-all shadow-sm"
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
    if (currentStep === 0) activeStep = 0;
    else if (currentStep === 1) activeStep = 0;
    else if (currentStep === 2) activeStep = 1;
    else if (currentStep === 3) activeStep = 2;

    return (
      <div className="mb-6 py-2">
        <div className="flex items-center justify-between relative">
          {/* Connecting line */}
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
                    <CheckCircle2 className="text-white w-3.5 h-3.5" />
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
          <div className="space-y-4">
            <div>
              {transactionStatus === 'APPROVED' || transactionStatus === 'COMPLETED' ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold">Thanh toán thành công!</h2>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <Banknote className="w-10 h-10 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold">Đã tạo lệnh nạp tiền tự động!</h2>
                </div>
              )}
            </div>
            
            <div className="space-y-3 text-sm">
              <p>Mã giao dịch: <strong>{transactionResult?.transactionCode || transactionResult?.id}</strong></p>
              <p>Số tiền nạp: <strong className="text-orange-600">{formatCurrency(amount)}</strong></p>
              
              {transactionStatus === 'APPROVED' || transactionStatus === 'COMPLETED' ? (
                <Alert
                  type="success"
                  message="Thanh toán thành công!"
                  description="Tiền đã được cộng vào tài khoản của bạn."
                  showIcon
                  className="text-left"
                />
              ) : (
                <>
                  <Alert
                    type="info"
                    message="Vui lòng thanh toán"
                    description={
                      <div className="space-y-2 mt-2">
                        <p>Nhấn nút bên dưới để chuyển đến trang thanh toán.</p>
                        <div className="flex flex-col items-center gap-2">
                          <Button 
                            variant="outline"
                            onClick={() => copyToClipboard(gatewayPayUrl)}
                            className="h-10 px-6 text-sm rounded-lg transition-all shadow-sm gap-2"
                          >
                            <Copy className="w-4 h-4" />
                            Sao chép link thanh toán
                          </Button>
                        </div>
                        {checkingStatus && (
                          <div className="flex items-center gap-2 justify-center">
                            <Spinner size="sm" />
                            <span className="text-xs">Đang kiểm tra trạng thái thanh toán...</span>
                          </div>
                        )}
                        <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-gray-200">
                          <Clock className="w-4 h-4 text-orange-500" />
                          <span className="text-sm font-medium text-orange-600">
                            Tự động đóng sau: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                      </div>
                    }
                    showIcon
                    className="text-left"
                  />
                  
                  <div className="pt-2 flex flex-col gap-3">
                    <Button
                      variant="primary"
                      onClick={() => {
                        window.location.href = gatewayPayUrl;
                      }}
                      className="h-10 px-6 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white font-semibold text-sm rounded-lg transition-all shadow-sm gap-2"
                    >
                      <Link2 className="w-4 h-4" />
                      Thanh toán ngay
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (transactionResult?.id) {
                          startStatusPolling(transactionResult.id);
                        } else {
                          message.error('Không có transaction ID để kiểm tra');
                        }
                      }}
                      disabled={checkingStatus}
                      className="h-10 px-6 text-sm rounded-lg transition-all shadow-sm gap-2"
                    >
                      <RotateCcw className={`w-4 h-4 ${checkingStatus ? 'animate-spin' : ''}`} />
                      {checkingStatus ? 'Đang kiểm tra...' : 'Kiểm tra trạng thái'}
                    </Button>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center pt-4">
              <Button 
                variant="outline"
                onClick={() => {
                  navigate(`/wallet?tab=transaction-history&refresh=${Date.now()}`);
                }}
                className="h-10 px-6 text-sm rounded-lg transition-all shadow-sm"
              >
                Xem lịch sử
              </Button>
              <Button 
                variant="primary"
                onClick={handleReset}
                className="h-10 px-6 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white font-semibold text-sm rounded-lg transition-all shadow-sm"
              >
                Tạo lệnh mới
              </Button>
            </div>
          </div>
        </div>
      );
    }
    
    // Manual deposit (fallback)
    return (
      <div className="text-center">
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold">Nạp tiền thành công!</h2>
          </div>
          
          <div className="space-y-1.5 text-sm">
            <p>Mã giao dịch: <strong>{transactionResult?.transactionCode || transactionResult?.id}</strong></p>
            <p>Số tiền nạp: <strong className="text-orange-600">{formatCurrency(amount)}</strong></p>
            <p>Thời gian xử lý dự kiến: {selectedMethod?.processingTime || '5-15 phút'}</p>
            <p className="text-sm text-gray-500">
              Vui lòng chuyển khoản theo thông tin đã cung cấp để hoàn tất giao dịch
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center pt-4">
            <Button 
              variant="outline"
              onClick={() => {
                navigate(`/wallet?tab=transaction-history&refresh=${Date.now()}`);
              }}
              className="h-10 px-6 text-sm rounded-lg transition-all shadow-sm"
            >
              Xem lịch sử
            </Button>
            <Button 
              variant="primary"
              onClick={handleReset}
              className="h-10 px-6 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white font-semibold text-sm rounded-lg transition-all shadow-sm"
            >
              Tạo lệnh mới
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderSteps = () => {
    return (
      <div>
        {renderProgressBar()}

        <div className="space-y-4 md:space-y-6">
          {currentStep === 0 && (
            <div className="space-y-4 md:space-y-6">
              {renderMethodSelection()}
              <div className="flex justify-end pt-2">
                <Button 
                  variant="primary"
                  disabled={!selectedMethod}
                  onClick={() => setCurrentStep(1)}
                  className="w-full md:w-auto h-10 px-6 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white font-semibold text-sm rounded-lg transition-all shadow-sm"
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
                  variant="outline"
                  onClick={() => setCurrentStep(0)}
                  className="flex-1 md:flex-initial h-10 px-6 text-sm rounded-lg transition-all shadow-sm"
                >
                  Quay lại
                </Button>
                <Button 
                  variant="primary"
                  onClick={handleProceedToPayment}
                  disabled={!amount || !selectedMethod || !!amountError || creatingTransaction}
                  className="flex-1 md:flex-initial h-10 px-6 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white font-semibold text-sm rounded-lg transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  {creatingTransaction ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    'Thanh toán'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 relative">
      {/* Loading Overlay */}
      {creatingTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
            <div className="flex flex-col items-center gap-4">
              <Spinner size="lg" />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Đang tạo lệnh nạp tiền
                </h3>
                <p className="text-sm text-gray-600">
                  Vui lòng đợi trong giây lát...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="pb-6">
        <Card 
          className="shadow-sm md:shadow-md"
          style={{ borderRadius: '12px' }}
        >
          <CardContent className="p-4 md:p-6">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DepositWithdraw;
