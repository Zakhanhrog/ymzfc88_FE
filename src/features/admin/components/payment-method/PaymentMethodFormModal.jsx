import { useState, useEffect } from 'react';
import Modal from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import Textarea from '../../../../components/ui/Textarea';
import Switch from '../../../../components/ui/Switch';
import Tag from '../../../../components/ui/Tag';

const PaymentMethodFormModal = ({
  open,
  onClose,
  onSubmit,
  paymentTypes,
  initialData = null,
  mode = 'create' // 'create' or 'edit'
}) => {
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    accountNumber: '',
    accountName: '',
    bankCode: '',
    minAmount: '',
    maxAmount: '',
    feePercent: '0',
    feeFixed: '0',
    processingTime: '',
    displayOrder: '1',
    description: '',
    qrCode: '',
    isActive: true
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        type: initialData.type || '',
        name: initialData.name || '',
        accountNumber: initialData.accountNumber || '',
        accountName: initialData.accountName || '',
        bankCode: initialData.bankCode || '',
        minAmount: initialData.minAmount?.toString() || '',
        maxAmount: initialData.maxAmount?.toString() || '',
        feePercent: initialData.feePercent?.toString() || '0',
        feeFixed: initialData.feeFixed?.toString() || '0',
        processingTime: initialData.processingTime || '',
        displayOrder: initialData.displayOrder?.toString() || '1',
        description: initialData.description || '',
        qrCode: initialData.qrCode || '',
        isActive: initialData.isActive !== undefined ? initialData.isActive : true
      });
    } else {
      setFormData({
        type: '',
        name: '',
        accountNumber: '',
        accountName: '',
        bankCode: '',
        minAmount: '',
        maxAmount: '',
        feePercent: '0',
        feeFixed: '0',
        processingTime: '',
        displayOrder: '1',
        description: '',
        qrCode: '',
        isActive: true
      });
    }
    setErrors({});
  }, [initialData, mode, open]);

  const formatNumber = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const parseNumber = (value) => {
    return value.replace(/,/g, '');
  };

  const handleChange = (field, value) => {
    if (field === 'minAmount' || field === 'maxAmount' || field === 'feeFixed' || field === 'displayOrder') {
      const numValue = parseNumber(value.toString());
      if (numValue === '' || (!isNaN(numValue) && numValue >= 0)) {
        setFormData(prev => ({ ...prev, [field]: numValue }));
      }
    } else if (field === 'feePercent') {
      const numValue = value.toString();
      if (numValue === '' || (!isNaN(numValue) && parseFloat(numValue) >= 0 && parseFloat(numValue) <= 100)) {
        setFormData(prev => ({ ...prev, [field]: numValue }));
      }
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = () => {
    const newErrors = {};
    
    if (!formData.type) newErrors.type = 'Vui lòng chọn loại phương thức';
    if (!formData.name) newErrors.name = 'Vui lòng nhập tên hiển thị';
    if (!formData.accountNumber) newErrors.accountNumber = 'Vui lòng nhập số tài khoản';
    if (!formData.accountName) newErrors.accountName = 'Vui lòng nhập tên chủ tài khoản';
    if (!formData.minAmount) newErrors.minAmount = 'Vui lòng nhập số tiền tối thiểu';
    else if (parseInt(formData.minAmount) < 1000) newErrors.minAmount = 'Số tiền tối thiểu phải >= 1,000';
    if (!formData.maxAmount) newErrors.maxAmount = 'Vui lòng nhập số tiền tối đa';
    else if (parseInt(formData.maxAmount) < parseInt(formData.minAmount || 0)) {
      newErrors.maxAmount = 'Số tiền tối đa phải >= số tiền tối thiểu';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const submitData = {
      ...formData,
      minAmount: parseInt(formData.minAmount),
      maxAmount: parseInt(formData.maxAmount),
      feePercent: parseFloat(formData.feePercent) || 0,
      feeFixed: parseInt(formData.feeFixed) || 0,
      displayOrder: parseInt(formData.displayOrder) || 1
    };

    onSubmit(submitData);
  };

  const handleClose = () => {
    setFormData({
      type: '',
      name: '',
      accountNumber: '',
      accountName: '',
      bankCode: '',
      minAmount: '',
      maxAmount: '',
      feePercent: '0',
      feeFixed: '0',
      processingTime: '',
      displayOrder: '1',
      description: '',
      qrCode: '',
      isActive: true
    });
    setErrors({});
    onClose();
  };

  const typeOptions = paymentTypes.map(type => ({
    label: type.label,
    value: type.value
  }));

  return (
    <Modal
      title={mode === 'create' ? 'Thêm phương thức thanh toán' : 'Chỉnh sửa phương thức thanh toán'}
      open={open}
      onClose={handleClose}
      className="max-w-3xl"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Loại phương thức <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.type}
              onChange={(value) => handleChange('type', value)}
              options={typeOptions}
              placeholder="Chọn loại phương thức"
              className={errors.type ? 'border-red-500' : ''}
            />
            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tên hiển thị <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="VD: Ví MoMo chính"
              error={errors.name}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Số tài khoản/SĐT <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.accountNumber}
              onChange={(e) => handleChange('accountNumber', e.target.value)}
              placeholder="Số tài khoản hoặc số điện thoại"
              error={errors.accountNumber}
            />
            {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tên chủ tài khoản <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.accountName}
              onChange={(e) => handleChange('accountName', e.target.value)}
              placeholder="Họ và tên chủ tài khoản"
              error={errors.accountName}
            />
            {errors.accountName && <p className="text-red-500 text-xs mt-1">{errors.accountName}</p>}
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Mã ngân hàng (nếu có)
            </label>
            <Input
              value={formData.bankCode}
              onChange={(e) => handleChange('bankCode', e.target.value)}
              placeholder="VD: VCB, TCB, MB..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Số tiền tối thiểu <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.minAmount ? formatNumber(formData.minAmount) : ''}
              onChange={(e) => handleChange('minAmount', e.target.value)}
              placeholder="1,000"
              error={errors.minAmount}
            />
            {errors.minAmount && <p className="text-red-500 text-xs mt-1">{errors.minAmount}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Số tiền tối đa <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.maxAmount ? formatNumber(formData.maxAmount) : ''}
              onChange={(e) => handleChange('maxAmount', e.target.value)}
              placeholder="10,000,000"
              error={errors.maxAmount}
            />
            {errors.maxAmount && <p className="text-red-500 text-xs mt-1">{errors.maxAmount}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Phí theo % (0-100)
            </label>
            <Input
              type="number"
              value={formData.feePercent}
              onChange={(e) => handleChange('feePercent', e.target.value)}
              placeholder="0"
              min={0}
              max={100}
              step={0.1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Phí cố định (VNĐ)
            </label>
            <Input
              type="text"
              value={formData.feeFixed ? formatNumber(formData.feeFixed) : ''}
              onChange={(e) => handleChange('feeFixed', e.target.value)}
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Thời gian xử lý
            </label>
            <Input
              value={formData.processingTime}
              onChange={(e) => handleChange('processingTime', e.target.value)}
              placeholder="VD: Ngay lập tức, 1-5 phút..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Thứ tự hiển thị
            </label>
            <Input
              type="text"
              value={formData.displayOrder ? formatNumber(formData.displayOrder) : ''}
              onChange={(e) => handleChange('displayOrder', e.target.value)}
              placeholder="1"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Mô tả
            </label>
            <Textarea
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Mô tả chi tiết về phương thức thanh toán..."
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Mã QR (URL)
            </label>
            <Input
              value={formData.qrCode}
              onChange={(e) => handleChange('qrCode', e.target.value)}
              placeholder="URL đến ảnh mã QR"
            />
          </div>

          <div className="col-span-2">
            <label className="flex items-center gap-2">
              <Switch
                checked={formData.isActive}
                onChange={(checked) => handleChange('isActive', checked)}
              />
              <span className="text-sm font-medium text-gray-700">Trạng thái</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} className="bg-[#4CAF50] text-white hover:bg-[#45a049]">
            {mode === 'create' ? 'Tạo phương thức' : 'Cập nhật'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentMethodFormModal;

