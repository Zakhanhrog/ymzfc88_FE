import { useState, useEffect } from 'react';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Save, RotateCcw } from 'lucide-react';
import { message } from '../../../../utils/notification';
import { adminService } from '../../services/adminService';

const CommissionSettingsTab = ({ settings, loading, onRefresh }) => {
  const [commissionValue, setCommissionValue] = useState('');
  const [saving, setSaving] = useState(false);

  const currentCommissionValue = settings.agent_commission_percentage !== undefined &&
    settings.agent_commission_percentage !== null &&
    settings.agent_commission_percentage !== ''
      ? parseFloat(settings.agent_commission_percentage)
      : undefined;

  useEffect(() => {
    if (currentCommissionValue !== undefined && !isNaN(currentCommissionValue)) {
      setCommissionValue(String(currentCommissionValue));
    } else {
      setCommissionValue('');
    }
  }, [currentCommissionValue]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!commissionValue || commissionValue === '') {
      message.error('Vui lòng nhập tỷ lệ hoa hồng');
      return;
    }

    const value = parseFloat(commissionValue);
    if (isNaN(value) || value < 0 || value > 100) {
      message.error('Tỷ lệ hoa hồng phải nằm trong khoảng 0 - 100%');
      return;
    }

    setSaving(true);
    try {
      await adminService.createOrUpdateSystemSetting({
        settingKey: 'agent_commission_percentage',
        settingValue: String(value),
        description: 'Tỷ lệ hoa hồng mặc định cho đại lý (đơn vị %)',
        category: 'COMMISSION'
      });
      
      message.success('Cập nhật cài đặt thành công!');
      onRefresh?.();
    } catch (error) {
      message.error('Lỗi: ' + (error.message || 'Có lỗi xảy ra'));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (currentCommissionValue !== undefined && !isNaN(currentCommissionValue)) {
      setCommissionValue(String(currentCommissionValue));
    } else {
      setCommissionValue('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-base font-semibold text-gray-900 mb-1">Hoa hồng đại lý</h4>
        <p className="text-sm text-gray-600">
          Hiện tại đang áp dụng:{' '}
          <span className="font-semibold text-gray-900">
            {currentCommissionValue !== undefined && !isNaN(currentCommissionValue)
              ? `${currentCommissionValue}%`
              : 'Chưa thiết lập'}
          </span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Tỷ lệ hoa hồng đại lý (%)
          </label>
          <Input
            type="number"
            value={commissionValue}
            onChange={(e) => setCommissionValue(e.target.value)}
            placeholder="5"
            min={0}
            max={100}
            step={0.1}
            suffix={<span className="text-gray-500">%</span>}
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Tỷ lệ hoa hồng phải nằm trong khoảng 0 - 100%
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={saving || loading}
          >
            {saving || loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Lưu tỷ lệ hoa hồng
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={saving || loading}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Đặt lại
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CommissionSettingsTab;

