import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Textarea from '../../../components/ui/Textarea';
import Alert from '../../../components/ui/Alert';
import { Badge } from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import Loading from '../../../components/common/Loading';
import Spinner from '../../../components/ui/Spinner';
import { 
  CheckCircle2, 
  Star,
  StarOff,
  Plus,
  AlertTriangle,
  ArrowDown,
  Banknote,
  Wallet
} from 'lucide-react';
import { message } from '../../../utils/notification';
import { THEME_COLORS } from '../../../utils/theme';
import { formatCurrency } from '../../../utils/helpers';
import walletService from '../services/walletService';

const WithdrawForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [userPaymentMethods, setUserPaymentMethods] = useState([]);
  const [selectedUserMethod, setSelectedUserMethod] = useState(null);
  const [amount, setAmount] = useState(null);
  const [points, setPoints] = useState(null);
  const [amountError, setAmountError] = useState('');
  const [pointsError, setPointsError] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactionResult, setTransactionResult] = useState(null);
  const [showAddMethodModal, setShowAddMethodModal] = useState(false);
  const [withdrawalLocked, setWithdrawalLocked] = useState(false);
  const [lockReason, setLockReason] = useState('');
  const [checkingLockStatus, setCheckingLockStatus] = useState(true);
  
  // Form state for add method modal
  const [addMethodFormData, setAddMethodFormData] = useState({
    type: '',
    bankCode: '',
    name: '',
    accountName: '',
    accountNumber: '',
    phoneNumber: ''
  });
  const [addMethodFormErrors, setAddMethodFormErrors] = useState({});

  // Popular banks
  const popularBanks = [
    { code: 'VCB', name: 'Vietcombank' },
    { code: 'TCB', name: 'Techcombank' },
    { code: 'ACB', name: 'ACB' },
    { code: 'MB', name: 'MBBank' },
    { code: 'VTB', name: 'Vietinbank' },
    { code: 'BIDV', name: 'BIDV' },
    { code: 'TPB', name: 'TPBank' },
    { code: 'STB', name: 'Sacombank' },
    { code: 'AGB', name: 'Agribank' },
    { code: 'VPB', name: 'VPBank' },
    { code: 'HDB', name: 'HDBank' },
    { code: 'EIB', name: 'Eximbank' },
    { code: 'SHB', name: 'SHB' },
    { code: 'VIB', name: 'VIB' },
    { code: 'MSB', name: 'MSB' },
    { code: 'SEA', name: 'SeABank' },
    { code: 'OCB', name: 'OCB' },
    { code: 'BVB', name: 'BaoViet Bank' },
    { code: 'HSBC', name: 'HSBC' },
    { code: 'CITI', name: 'CitiBank' },
    { code: 'SCB', name: 'SCB' },
    { code: 'NAB', name: 'Nam A Bank' },
    { code: 'VCCB', name: 'VietCapitalBank' },
    { code: 'PGB', name: 'PGBank' },
    { code: 'VAB', name: 'VietABank' },
    { code: 'BAB', name: 'BacABank' },
    { code: 'GPB', name: 'GPBank' },
    { code: 'KLB', name: 'KienLongBank' },
    { code: 'LPB', name: 'LienVietPostBank' },
    { code: 'NAV', name: 'Navibank' },
    { code: 'NCB', name: 'NCB' },
    { code: 'OJB', name: 'OceanBank' },
    { code: 'PUB', name: 'PublicBank' },
    { code: 'PVB', name: 'PVcomBank' },
    { code: 'SGB', name: 'SaigonBank' },
    { code: 'VDB', name: 'VietBank' },
    { code: 'VNCB', name: 'Vietnam Construction Bank' },
    { code: 'WVB', name: 'Woori Bank' }
  ];

  useEffect(() => {
    const loadData = async () => {
      setCheckingLockStatus(true);
      await Promise.all([
        checkWithdrawalLockStatus(),
        loadUserPaymentMethods()
      ]);
      setCheckingLockStatus(false);
    };
    loadData();
  }, []);

  const checkWithdrawalLockStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      const response = await fetch('https://api.tathiet168.com/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.data) {
          const isLocked = result.data.withdrawalLocked || false;
          const reason = result.data.withdrawalLockReason || '';
          
          setWithdrawalLocked(isLocked);
          setLockReason(reason);
          
          if (isLocked) {
            message.warning('Tài khoản của bạn đã bị khóa rút tiền!');
          }
        }
      }
    } catch (error) {
      // Silent error
    }
  };

  const loadUserPaymentMethods = async () => {
    try {
      const response = await walletService.getUserPaymentMethods();
      if (response && response.success) {
        setUserPaymentMethods(response.data || []);
      } else {
        setUserPaymentMethods([]);
      }
    } catch (error) {
      console.error('Error loading user payment methods:', error);
      message.error('Lỗi khi tải phương thức rút tiền: ' + error.message);
      setUserPaymentMethods([]);
    }
  };

  const handleSetDefaultPaymentMethod = async (methodId) => {
    try {
      setLoading(true);
      const response = await walletService.setDefaultUserPaymentMethod(methodId);
      if (response.success) {
        message.success('Đã đặt làm phương thức mặc định!');
        loadUserPaymentMethods();
      }
    } catch (error) {
      message.error('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaymentMethod = async () => {
    // Validate form
    const errors = {};
    if (!addMethodFormData.type) {
      errors.type = 'Vui lòng chọn loại';
    }
    if (addMethodFormData.type === 'BANK' && !addMethodFormData.bankCode) {
      errors.bankCode = 'Vui lòng chọn ngân hàng';
    }
    if (!addMethodFormData.name) {
      errors.name = 'Vui lòng nhập tên';
    }
    if (!addMethodFormData.accountName) {
      errors.accountName = 'Vui lòng nhập tên tài khoản';
    }
    if (!addMethodFormData.accountNumber) {
      errors.accountNumber = 'Vui lòng nhập số tài khoản';
    }
    if (addMethodFormData.accountNumber && addMethodFormData.accountNumber.length > 60) {
      errors.accountNumber = 'Số tài khoản không được vượt quá 60 ký tự';
    }
    if (!addMethodFormData.phoneNumber) {
      errors.phoneNumber = 'Vui lòng nhập số điện thoại';
    }
    if (addMethodFormData.phoneNumber && !/^0\d{9}$/.test(addMethodFormData.phoneNumber)) {
      errors.phoneNumber = 'Số điện thoại phải có đúng 10 số và bắt đầu bằng 0';
    }

    if (Object.keys(errors).length > 0) {
      setAddMethodFormErrors(errors);
      return;
    }

    try {
      setLoading(true);
      const response = await walletService.createUserPaymentMethod(addMethodFormData);
      if (response.success) {
        message.success('Thêm phương thức rút tiền thành công!');
        setShowAddMethodModal(false);
        setAddMethodFormData({
          type: '',
          bankCode: '',
          name: '',
          accountName: '',
          accountNumber: '',
          phoneNumber: ''
        });
        setAddMethodFormErrors({});
        loadUserPaymentMethods();
      }
    } catch (error) {
      console.error('Error adding payment method:', error);
      const errorMessage = error.message || error.response?.data?.message || 'Có lỗi xảy ra khi thêm phương thức rút tiền';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getMethodIcon = (type) => {
    switch (type) {
      case 'BANK':
        return <img src="/iconacc/imgi_27_bank.avif" alt="Bank" className="w-7 h-7" />;
      case 'E_WALLET':
        return <img src="/iconacc/imgi_26_withdraw.avif" alt="E-Wallet" className="w-7 h-7" />;
      default:
        return <img src="/iconacc/imgi_27_bank.avif" alt="Bank" className="w-7 h-7" />;
    }
  };

  const getMethodTypeText = (type) => {
    switch (type) {
      case 'BANK':
        return 'Ngân hàng';
      case 'E_WALLET':
        return 'Ví điện tử';
      default:
        return type;
    }
  };

  const quickAmounts = [
    { label: '100K', value: 100000, points: 100 },
    { label: '200K', value: 200000, points: 200 },
    { label: '500K', value: 500000, points: 500 },
    { label: '1M', value: 1000000, points: 1000 },
    { label: '2M', value: 2000000, points: 2000 },
    { label: '5M', value: 5000000, points: 5000 }
  ];

  const handleSubmitWithdraw = async (e) => {
    e?.preventDefault();
    
    // Check if withdrawal is locked before submitting
    if (withdrawalLocked) {
      message.error('Tài khoản của bạn đã bị khóa rút tiền. Vui lòng liên hệ admin để biết thêm chi tiết.');
      return;
    }

    // Validate số điểm và số tiền
    if (!amount || !points) {
      message.error('Vui lòng nhập số điểm và số tiền hợp lệ');
      return;
    }

    // Kiểm tra tính nhất quán giữa điểm và tiền
    const expectedAmount = pointsToMoney(points);
    if (Math.abs(amount - expectedAmount) > 1) {
      message.error('Số điểm và số tiền không khớp. Vui lòng kiểm tra lại.');
      return;
    }

    if (!selectedUserMethod?.id) {
      message.error('Vui lòng chọn phương thức thanh toán');
      return;
    }

    try {
      setLoading(true);
      
      const amountValue = Number(amount);
      const pointsValue = Number(points);
      
      if (isNaN(amountValue) || amountValue < 10000) {
        message.error('Số tiền tối thiểu là 10,000 VNĐ');
        setLoading(false);
        return;
      }
      
      if (isNaN(pointsValue) || pointsValue < 1) {
        message.error('Số điểm tối thiểu là 1 điểm');
        setLoading(false);
        return;
      }
      
      const withdrawData = {
        amount: amountValue,
        points: pointsValue,
        userPaymentMethodId: selectedUserMethod.id,
        description: description || ''
      };

      const response = await walletService.createWithdrawOrder(withdrawData);
      
      if (response.success) {
        setTransactionResult(response.data);
        setCurrentStep(2);
        message.success(`Đã gửi yêu cầu rút ${points} điểm (${formatCurrency(amount)}) thành công!`);
        
        window.dispatchEvent(new CustomEvent('transactionCreated', {
          detail: { type: 'WITHDRAW', transaction: response.data }
        }));
      }
    } catch (error) {
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

  // Convert functions between points and money
  const pointsToMoney = (pointsValue) => {
    return pointsValue * 1000; // 1 điểm = 1000đ
  };

  const moneyToPoints = (moneyValue) => {
    return moneyValue / 1000; // 1000đ = 1 điểm
  };

  const handlePointsChange = (e) => {
    const value = e.target.value.replace(/,/g, '');
    const numValue = value ? Number(value) : null;
    
    if (numValue && numValue < 1) {
      setPointsError('Số điểm tối thiểu là 1 điểm');
      return;
    }
    
    setPoints(numValue);
    setPointsError('');
    
    if (numValue) {
      const convertedAmount = pointsToMoney(numValue);
      setAmount(convertedAmount);
    } else {
      setAmount(null);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/,/g, '');
    const numValue = value ? Number(value) : null;
    
    if (numValue && numValue < 10000) {
      setAmountError('Số tiền tối thiểu là 10,000 VNĐ');
      return;
    }
    
    setAmount(numValue);
    setAmountError('');
    
    if (numValue) {
      const convertedPoints = moneyToPoints(numValue);
      setPoints(convertedPoints);
    } else {
      setPoints(null);
    }
  };

  const formatNumberInput = (value) => {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleQuickAmountSelect = (quickAmount) => {
    setAmount(quickAmount.value);
    setPoints(quickAmount.points);
    setAmountError('');
    setPointsError('');
  };

  const resetForm = () => {
    setCurrentStep(0);
    setSelectedUserMethod(null);
    setAmount(null);
    setPoints(null);
    setAmountError('');
    setPointsError('');
    setDescription('');
    setTransactionResult(null);
  };

  const renderProgressBar = () => {
    const steps = [
      { key: 0, label: 'Rút tiền' },
      { key: 1, label: 'Thanh toán' },
      { key: 2, label: 'Hoàn thành' }
    ];

    let activeStep = currentStep;
    if (currentStep === 0) activeStep = 0;
    else if (currentStep === 1) activeStep = 1;
    else if (currentStep === 2) activeStep = 2;

    return (
      <div className="mb-6 py-2">
        <div className="flex items-center justify-between relative">
          <div 
            className="absolute h-[1px] z-0"
            style={{ 
              background: '#d1d5db',
              top: '12px',
              left: 'calc(16.67% + 12px)',
              width: 'calc(66.66% - 24px)'
            }}
          ></div>
          
          {steps.map((step) => {
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

  const renderMethodSelection = () => (
    <div className="space-y-4">
      {/* Add method button */}
      <div className="flex justify-between items-center mb-3">
        <div className="text-xs text-gray-600">
          {userPaymentMethods.length > 0 && `${userPaymentMethods.length} phương thức`}
        </div>
        <Button
          variant="primary"
          onClick={() => {
            const hasBank = userPaymentMethods.some(m => m.type === 'BANK');
            const hasEWallet = userPaymentMethods.some(m => m.type === 'E_WALLET');
            if (hasBank && hasEWallet) {
              message.warning('Bạn đã có đủ 2 loại phương thức (Ngân hàng và Ví điện tử). Mỗi loại chỉ được thêm 1 lần.');
              return;
            }
            setShowAddMethodModal(true);
          }}
          disabled={userPaymentMethods.length >= 2}
          className="h-7 px-3 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white text-xs rounded-lg transition-all shadow-sm gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Thêm phương thức
        </Button>
      </div>

      {userPaymentMethods.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '30px 0', borderRadius: '12px' }}>
          <CardContent className="py-6">
            <div className="flex flex-col items-center gap-3">
              <Wallet className="w-10 h-10 text-gray-400" />
              <div>
                <p className="text-gray-600 mb-3 text-sm">Chưa có phương thức rút tiền nào</p>
                <Button
                  variant="primary"
                  onClick={() => setShowAddMethodModal(true)}
                  className="h-10 px-6 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white font-semibold text-sm rounded-lg transition-all shadow-sm gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Thêm phương thức rút tiền
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {userPaymentMethods.map(method => (
            <Card
              key={method.id}
              className={`cursor-pointer transition-colors duration-200 ${
                selectedUserMethod?.id === method.id 
                ? 'border-2' 
                : 'border'
              }`}
              style={{ 
                borderRadius: '12px',
                borderColor: selectedUserMethod?.id === method.id ? THEME_COLORS.primary : '#e5e7eb',
                backgroundColor: selectedUserMethod?.id === method.id ? '#f0f9ff' : 'white'
              }}
              onClick={() => setSelectedUserMethod(method)}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="flex items-center justify-center flex-shrink-0">
                    {getMethodIcon(method.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm md:text-base truncate">{method.name}</h4>
                  </div>
                  {selectedUserMethod?.id === method.id && (
                    <CheckCircle2 
                      className="text-green-500 w-5 h-5 flex-shrink-0" 
                    />
                  )}
                </div>
                
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Chủ tài khoản:</span>
                    <span className="font-medium text-gray-900 truncate ml-2">{method.accountName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Số tài khoản:</span>
                    <span className="font-mono text-blue-600 font-medium truncate ml-2">{method.accountNumber}</span>
                  </div>
                  {method.bankCode && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Ngân hàng:</span>
                      <span className="font-medium text-gray-700">{method.bankCode}</span>
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
    <div className="space-y-3">
      <div className="text-center mb-2">
        <h4 className="text-sm md:text-base font-semibold mb-1">Nhập số tiền rút</h4>
        <p className="text-xs text-gray-500">
          Nhập số tiền bạn muốn rút về tài khoản đã chọn
        </p>
      </div>

      {selectedUserMethod && (
        <Card className="selected-method-info mb-2">
          <CardContent className="p-2.5">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center flex-shrink-0">
                {getMethodIcon(selectedUserMethod.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{selectedUserMethod.name}</div>
                <div className="text-xs text-gray-500 truncate">
                  {selectedUserMethod.accountNumber} - {selectedUserMethod.accountName}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmitWithdraw} className="space-y-3">
        <input type="hidden" name="userPaymentMethodId" value={selectedUserMethod?.id || ''} />

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Số điểm muốn rút
          </label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Nhập số điểm"
              value={formatNumberInput(points)}
              onChange={handlePointsChange}
              className="h-10 text-sm pr-14"
              style={{ borderRadius: '8px' }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
              điểm
            </span>
          </div>
          {pointsError && (
            <p className="mt-1 text-xs text-red-500">{pointsError}</p>
          )}
        </div>

        <div className="text-center text-xs text-gray-500">
          <span>Quy đổi: 1,000đ = 1 điểm</span>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Số tiền rút
          </label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Nhập số tiền"
              value={formatNumberInput(amount)}
              onChange={handleAmountChange}
              className="h-10 text-sm pr-14"
              style={{ borderRadius: '8px' }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
              VNĐ
            </span>
          </div>
          {amountError && (
            <p className="mt-1 text-xs text-red-500">{amountError}</p>
          )}
        </div>

        {/* Quick amount buttons */}
        <div className="space-y-1">
          <p className="text-xs text-gray-600">Chọn nhanh:</p>
          <div className="grid grid-cols-3 gap-2">
            {quickAmounts.map(quick => (
              <Button
                key={quick.value}
                type="button"
                variant={amount === quick.value ? 'primary' : 'outline'}
                onClick={() => handleQuickAmountSelect(quick)}
                className={`h-auto py-1.5 px-2 rounded-lg transition-all shadow-sm flex flex-col items-center ${
                  amount === quick.value 
                    ? 'bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white' 
                    : ''
                }`}
              >
                <div className="font-semibold text-xs">{quick.label}</div>
                <div className={`text-[10px] ${amount === quick.value ? 'text-white/80' : 'text-gray-500'}`}>
                  {quick.points} điểm
                </div>
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Ghi chú (không bắt buộc)
          </label>
          <Textarea
            rows={2}
            placeholder="Nhập ghi chú cho giao dịch rút tiền"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-lg text-sm"
          />
        </div>

        <div className="flex gap-2 md:gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep(0)}
            className="flex-1 md:flex-initial h-10 px-6 text-sm rounded-lg transition-all shadow-sm"
          >
            Quay lại
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!amount || !points || amount < 10000 || loading || !selectedUserMethod}
            className="flex-1 md:flex-[2] h-10 px-6 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white font-semibold text-sm rounded-lg transition-all shadow-sm"
          >
            {loading ? 'Đang xử lý...' : `Rút ${points || 0} điểm`}
          </Button>
        </div>
      </form>
    </div>
  );

  const renderResult = () => (
    <div className="text-center">
      <div className="space-y-3">
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-base md:text-lg font-semibold">Yêu cầu rút tiền thành công!</h2>
        </div>
        
        <div className="space-y-1.5 text-xs md:text-sm">
          <p>Mã giao dịch: <strong>{transactionResult?.transactionId}</strong></p>
          <p>Số điểm rút: <strong className="text-orange-600">{points} điểm</strong></p>
          <p>Số tiền: <strong className="text-green-600">{formatCurrency(transactionResult?.amount)}</strong></p>
          <p>Thời gian xử lý dự kiến: 1-24 giờ làm việc</p>
          <p className="text-xs text-gray-500">
            Đã trừ {points} điểm từ tài khoản của bạn
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3 justify-center pt-3">
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
            onClick={resetForm}
            className="h-10 px-6 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white font-semibold text-sm rounded-lg transition-all shadow-sm"
          >
            Tạo lệnh mới
          </Button>
        </div>
      </div>
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
    <div className="bg-gray-50">
      <div className="pb-6">
        {/* Withdrawal Locked Alert */}
        {!checkingLockStatus && withdrawalLocked && (
          <Alert
            type="error"
            message="⚠️ TÀI KHOẢN ĐÃ BỊ KHÓA RÚT TIỀN"
            description={
              <div>
                <p className="mb-2"><strong>Lý do:</strong> {lockReason || 'Không có lý do cụ thể'}</p>
                <p className="mb-0 text-green-600"><strong>Vui lòng liên hệ với quản trị viên để được hỗ trợ.</strong></p>
              </div>
            }
            showIcon
            className="mb-4 border-2 border-red-500"
          />
        )}

        {/* Steps */}
        <Card className="shadow-sm md:shadow-md" style={{ borderRadius: '12px' }}>
          <CardContent className="p-4 md:p-6">
            {checkingLockStatus ? (
              <Loading />
            ) : (
              <>
                {/* Progress Bar */}
                {renderProgressBar()}

                <div className="min-h-64 md:min-h-96">
                  {steps[currentStep].content}
                </div>

                {currentStep === 0 && selectedUserMethod && userPaymentMethods.length > 0 && (
                  <div className="flex justify-end mt-4 md:mt-6">
                    <Button
                      variant="primary"
                      disabled={withdrawalLocked}
                      onClick={() => {
                        setCurrentStep(1);
                      }}
                      className="w-full md:w-auto h-10 px-6 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white font-semibold text-sm rounded-lg transition-all shadow-sm"
                      style={{
                        background: withdrawalLocked ? '#d9d9d9' : undefined
                      }}
                    >
                      Tiếp tục
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Modal thêm phương thức rút tiền */}
        <Modal
          title="Thêm phương thức rút tiền"
          open={showAddMethodModal}
          onClose={() => {
            setShowAddMethodModal(false);
            setAddMethodFormData({
              type: '',
              bankCode: '',
              name: '',
              accountName: '',
              accountNumber: '',
              phoneNumber: ''
            });
            setAddMethodFormErrors({});
          }}
          width="max-w-2xl"
        >
          <form onSubmit={(e) => { e.preventDefault(); handleAddPaymentMethod(); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại phương thức <span className="text-red-500">*</span>
              </label>
              <Select
                value={addMethodFormData.type}
                onChange={(value) => {
                  const existingMethod = userPaymentMethods.find(m => m.type === value);
                  if (existingMethod) {
                    message.warning(`Bạn đã có phương thức ${value === 'BANK' ? 'Ngân hàng' : 'Ví điện tử'}. Mỗi loại chỉ được thêm 1 lần.`);
                    return;
                  }
                  setAddMethodFormData(prev => ({ ...prev, type: value }));
                  setAddMethodFormErrors(prev => ({ ...prev, type: '' }));
                }}
                options={[
                  ...(!userPaymentMethods.some(m => m.type === 'BANK') ? [{ value: 'BANK', label: 'Ngân hàng' }] : []),
                  ...(!userPaymentMethods.some(m => m.type === 'E_WALLET') ? [{ value: 'E_WALLET', label: 'Ví điện tử' }] : [])
                ]}
                placeholder="Chọn loại phương thức"
                size="lg"
                className={addMethodFormErrors.type ? 'border-red-500' : ''}
              />
              {addMethodFormErrors.type && (
                <p className="mt-1 text-sm text-red-500">{addMethodFormErrors.type}</p>
              )}
            </div>

            {addMethodFormData.type === 'BANK' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngân hàng <span className="text-red-500">*</span>
                </label>
                <Select
                  value={addMethodFormData.bankCode}
                  onChange={(value) => {
                    setAddMethodFormData(prev => ({ ...prev, bankCode: value }));
                    setAddMethodFormErrors(prev => ({ ...prev, bankCode: '' }));
                  }}
                  options={popularBanks.map(bank => ({ value: bank.code, label: bank.name }))}
                  placeholder="Chọn ngân hàng"
                  size="lg"
                  className={addMethodFormErrors.bankCode ? 'border-red-500' : ''}
                />
                {addMethodFormErrors.bankCode && (
                  <p className="mt-1 text-sm text-red-500">{addMethodFormErrors.bankCode}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên gợi nhớ <span className="text-red-500">*</span>
              </label>
              <Input
                value={addMethodFormData.name}
                onChange={(e) => {
                  setAddMethodFormData(prev => ({ ...prev, name: e.target.value }));
                  setAddMethodFormErrors(prev => ({ ...prev, name: '' }));
                }}
                placeholder="VD: Tài khoản chính"
                className={`h-12 ${addMethodFormErrors.name ? 'border-red-500' : ''}`}
              />
              {addMethodFormErrors.name && (
                <p className="mt-1 text-sm text-red-500">{addMethodFormErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên tài khoản <span className="text-red-500">*</span>
              </label>
              <Input
                value={addMethodFormData.accountName}
                onChange={(e) => {
                  setAddMethodFormData(prev => ({ ...prev, accountName: e.target.value }));
                  setAddMethodFormErrors(prev => ({ ...prev, accountName: '' }));
                }}
                placeholder="Nguyễn Văn A"
                className={`h-12 ${addMethodFormErrors.accountName ? 'border-red-500' : ''}`}
              />
              {addMethodFormErrors.accountName && (
                <p className="mt-1 text-sm text-red-500">{addMethodFormErrors.accountName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số tài khoản <span className="text-red-500">*</span>
              </label>
              <Input
                value={addMethodFormData.accountNumber}
                onChange={(e) => {
                  const value = e.target.value.slice(0, 60);
                  setAddMethodFormData(prev => ({ ...prev, accountNumber: value }));
                  setAddMethodFormErrors(prev => ({ ...prev, accountNumber: '' }));
                }}
                placeholder="Số tài khoản (có thể có chữ và số)"
                maxLength={60}
                className={`h-12 ${addMethodFormErrors.accountNumber ? 'border-red-500' : ''}`}
              />
              {addMethodFormErrors.accountNumber && (
                <p className="mt-1 text-sm text-red-500">{addMethodFormErrors.accountNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <Input
                type="tel"
                value={addMethodFormData.phoneNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setAddMethodFormData(prev => ({ ...prev, phoneNumber: value }));
                  setAddMethodFormErrors(prev => ({ ...prev, phoneNumber: '' }));
                }}
                placeholder="0912345678"
                maxLength={10}
                className={`h-12 ${addMethodFormErrors.phoneNumber ? 'border-red-500' : ''}`}
              />
              {addMethodFormErrors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500">{addMethodFormErrors.phoneNumber}</p>
              )}
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddMethodModal(false);
                  setAddMethodFormData({
                    type: '',
                    bankCode: '',
                    name: '',
                    accountName: '',
                    accountNumber: '',
                    phoneNumber: ''
                  });
                  setAddMethodFormErrors({});
                }}
                className="h-10 px-6 text-sm rounded-lg transition-all shadow-sm"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="h-10 px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold text-sm rounded-lg transition-all shadow-sm"
              >
                {loading ? 'Đang thêm...' : 'Thêm phương thức'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>

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
            box-shadow: 0 8px 25px rgba(16,185,129,0.2);
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
