import { useState, useEffect } from 'react';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import Switch from '../../../../components/ui/Switch';
import TimePicker from '../../../../components/ui/TimePicker';
import { Save, RotateCcw } from 'lucide-react';
import { message } from '../../../../utils/notification';
import { adminService } from '../../services/adminService';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const REFUND_TIME_FORMAT = 'HH:mm';
const DEFAULT_REFUND_TIME = '12:00';

const GameRefundTab = ({ settings, loading, onRefresh }) => {
  const [formData, setFormData] = useState({
    sicbo_refund_win_percentage: '',
    sicbo_refund_loss_percentage: '',
    xocdia_refund_win_percentage: '',
    xocdia_refund_loss_percentage: '',
    sicbo_refund_payout_time: null,
    xocdia_refund_payout_time: null,
    sicbo_refund_instant: false,
    xocdia_refund_instant: false,
    daily_loss_refund_enabled: false,
    daily_loss_refund_percentage: '',
    daily_loss_refund_payout_time: null,
  });
  const [saving, setSaving] = useState(false);

  const parsePercentage = (value) => {
    if (value === undefined || value === null || value === '') {
      return 0;
    }
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  const parseTimeSetting = (value) => {
    if (!value || typeof value !== 'string') {
      return dayjs(DEFAULT_REFUND_TIME, REFUND_TIME_FORMAT);
    }
    const parsed = dayjs(value, REFUND_TIME_FORMAT, true);
    return parsed.isValid() ? parsed : dayjs(DEFAULT_REFUND_TIME, REFUND_TIME_FORMAT);
  };

  useEffect(() => {
    setFormData({
      sicbo_refund_win_percentage: String(parsePercentage(settings.sicbo_refund_win_percentage)),
      sicbo_refund_loss_percentage: String(parsePercentage(settings.sicbo_refund_loss_percentage)),
      xocdia_refund_win_percentage: String(parsePercentage(settings.xocdia_refund_win_percentage)),
      xocdia_refund_loss_percentage: String(parsePercentage(settings.xocdia_refund_loss_percentage)),
      sicbo_refund_payout_time: parseTimeSetting(settings.sicbo_refund_payout_time),
      xocdia_refund_payout_time: parseTimeSetting(settings.xocdia_refund_payout_time),
      sicbo_refund_instant: settings.sicbo_refund_instant === 'true' || settings.sicbo_refund_instant === '1',
      xocdia_refund_instant: settings.xocdia_refund_instant === 'true' || settings.xocdia_refund_instant === '1',
      daily_loss_refund_enabled: settings.daily_loss_refund_enabled === 'true' || settings.daily_loss_refund_enabled === '1',
      daily_loss_refund_percentage: String(parsePercentage(settings.daily_loss_refund_percentage)),
      daily_loss_refund_payout_time: parseTimeSetting(settings.daily_loss_refund_payout_time),
    });
  }, [settings]);

  const formatTimeValue = (timeValue) => {
    if (!timeValue) {
      return DEFAULT_REFUND_TIME;
    }
    // Check if value is already a dayjs object (has isValid method)
    const time = (timeValue && typeof timeValue.isValid === 'function') ? timeValue : dayjs(timeValue);
    return time.isValid() ? time.format(REFUND_TIME_FORMAT) : DEFAULT_REFUND_TIME;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveGameRefund = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const entries = [
        {
          key: 'sicbo_refund_win_percentage',
          value: formData.sicbo_refund_win_percentage || '0',
          description: 'Tỷ lệ hoàn trả (%) cho lệnh thắng Tài xỉu',
          category: 'GAME_REFUND'
        },
        {
          key: 'sicbo_refund_loss_percentage',
          value: formData.sicbo_refund_loss_percentage || '0',
          description: 'Tỷ lệ hoàn trả (%) cho lệnh thua Tài xỉu',
          category: 'GAME_REFUND'
        },
        {
          key: 'xocdia_refund_win_percentage',
          value: formData.xocdia_refund_win_percentage || '0',
          description: 'Tỷ lệ hoàn trả (%) cho lệnh thắng Xóc Đĩa',
          category: 'GAME_REFUND'
        },
        {
          key: 'xocdia_refund_loss_percentage',
          value: formData.xocdia_refund_loss_percentage || '0',
          description: 'Tỷ lệ hoàn trả (%) cho lệnh thua Xóc Đĩa',
          category: 'GAME_REFUND'
        },
        {
          key: 'sicbo_refund_payout_time',
          value: formatTimeValue(formData.sicbo_refund_payout_time),
          description: 'Thời gian chạy hoàn trả Tài xỉu hằng ngày (HH:mm)',
          category: 'GAME_REFUND'
        },
        {
          key: 'xocdia_refund_payout_time',
          value: formatTimeValue(formData.xocdia_refund_payout_time),
          description: 'Thời gian chạy hoàn trả Xóc Đĩa hằng ngày (HH:mm)',
          category: 'GAME_REFUND'
        },
        {
          key: 'sicbo_refund_instant',
          value: formData.sicbo_refund_instant ? 'true' : 'false',
          description: 'Bật/tắt hoàn trả ngay cho lệnh thua Tài xỉu',
          category: 'GAME_REFUND'
        },
        {
          key: 'xocdia_refund_instant',
          value: formData.xocdia_refund_instant ? 'true' : 'false',
          description: 'Bật/tắt hoàn trả ngay cho lệnh thua Xóc Đĩa',
          category: 'GAME_REFUND'
        }
      ];

      await Promise.all(
        entries.map(entry =>
          adminService.createOrUpdateSystemSetting({
            settingKey: entry.key,
            settingValue: String(entry.value),
            description: entry.description,
            category: entry.category
          })
        )
      );
      
      message.success('Cập nhật tỷ lệ hoàn trả trò chơi thành công!');
      onRefresh?.();
    } catch (error) {
      message.error('Lỗi: ' + (error.message || 'Có lỗi xảy ra'));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDailyLossRefund = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const entries = [
        {
          key: 'daily_loss_refund_enabled',
          value: formData.daily_loss_refund_enabled ? 'true' : 'false',
          description: 'Bật/tắt tính năng hoàn tổng thua theo ngày',
          category: 'GAME_REFUND'
        },
        {
          key: 'daily_loss_refund_percentage',
          value: formData.daily_loss_refund_percentage || '0',
          description: 'Tỷ lệ hoàn trả (%) cho tổng thua theo ngày',
          category: 'GAME_REFUND'
        },
        {
          key: 'daily_loss_refund_payout_time',
          value: formatTimeValue(formData.daily_loss_refund_payout_time),
          description: 'Thời gian hoàn trả tổng thua theo ngày hằng ngày (HH:mm)',
          category: 'GAME_REFUND'
        }
      ];

      await Promise.all(
        entries.map(entry =>
          adminService.createOrUpdateSystemSetting({
            settingKey: entry.key,
            settingValue: String(entry.value),
            description: entry.description,
            category: entry.category
          })
        )
      );
      
      message.success('Lưu cài đặt hoàn tổng thua theo ngày thành công!');
      onRefresh?.();
    } catch (error) {
      message.error('Lỗi: ' + (error.message || 'Có lỗi xảy ra'));
    } finally {
      setSaving(false);
    }
  };

  const handleResetGameRefund = () => {
    setFormData(prev => ({
      ...prev,
      sicbo_refund_win_percentage: String(parsePercentage(settings.sicbo_refund_win_percentage)),
      sicbo_refund_loss_percentage: String(parsePercentage(settings.sicbo_refund_loss_percentage)),
      xocdia_refund_win_percentage: String(parsePercentage(settings.xocdia_refund_win_percentage)),
      xocdia_refund_loss_percentage: String(parsePercentage(settings.xocdia_refund_loss_percentage)),
      sicbo_refund_payout_time: parseTimeSetting(settings.sicbo_refund_payout_time),
      xocdia_refund_payout_time: parseTimeSetting(settings.xocdia_refund_payout_time),
      sicbo_refund_instant: settings.sicbo_refund_instant === 'true' || settings.sicbo_refund_instant === '1',
      xocdia_refund_instant: settings.xocdia_refund_instant === 'true' || settings.xocdia_refund_instant === '1',
    }));
  };

  const handleResetDailyLoss = () => {
    setFormData(prev => ({
      ...prev,
      daily_loss_refund_enabled: settings.daily_loss_refund_enabled === 'true' || settings.daily_loss_refund_enabled === '1',
      daily_loss_refund_percentage: String(parsePercentage(settings.daily_loss_refund_percentage)),
      daily_loss_refund_payout_time: parseTimeSetting(settings.daily_loss_refund_payout_time),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Tài xỉu */}
      <form onSubmit={handleSaveGameRefund} className="space-y-6">
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-base font-semibold text-gray-900 mb-4">Tài xỉu</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Hoàn trả lệnh thắng (%)
              </label>
              <Input
                type="number"
                value={formData.sicbo_refund_win_percentage}
                onChange={(e) => handleChange('sicbo_refund_win_percentage', e.target.value)}
                placeholder="0"
                min={0}
                max={100}
                step={0.1}
                suffix={<span className="text-gray-500 text-sm">%</span>}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Hoàn trả lệnh thua (%)
              </label>
              <Input
                type="number"
                value={formData.sicbo_refund_loss_percentage}
                onChange={(e) => handleChange('sicbo_refund_loss_percentage', e.target.value)}
                placeholder="0"
                min={0}
                max={100}
                step={0.1}
                suffix={<span className="text-gray-500 text-sm">%</span>}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Thời gian hoàn trả hằng ngày
              </label>
              <TimePicker
                value={formData.sicbo_refund_payout_time}
                onChange={(value) => handleChange('sicbo_refund_payout_time', value)}
                format={REFUND_TIME_FORMAT}
                minuteStep={5}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Hoàn trả ngay
              </label>
              <div className="flex items-center gap-3 h-10">
                <Switch
                  checked={formData.sicbo_refund_instant}
                  onChange={(checked) => handleChange('sicbo_refund_instant', checked)}
                />
                <span className="text-xs text-gray-500">
                  Khi bật, lệnh cược thua sẽ được hoàn trả ngay sau khi xử lý
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Xóc Đĩa */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-base font-semibold text-gray-900 mb-4">Xóc Đĩa</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Hoàn trả lệnh thắng (%)
              </label>
              <Input
                type="number"
                value={formData.xocdia_refund_win_percentage}
                onChange={(e) => handleChange('xocdia_refund_win_percentage', e.target.value)}
                placeholder="0"
                min={0}
                max={100}
                step={0.1}
                suffix={<span className="text-gray-500 text-sm">%</span>}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Hoàn trả lệnh thua (%)
              </label>
              <Input
                type="number"
                value={formData.xocdia_refund_loss_percentage}
                onChange={(e) => handleChange('xocdia_refund_loss_percentage', e.target.value)}
                placeholder="0"
                min={0}
                max={100}
                step={0.1}
                suffix={<span className="text-gray-500 text-sm">%</span>}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Thời gian hoàn trả hằng ngày
              </label>
              <TimePicker
                value={formData.xocdia_refund_payout_time}
                onChange={(value) => handleChange('xocdia_refund_payout_time', value)}
                format={REFUND_TIME_FORMAT}
                minuteStep={5}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Hoàn trả ngay
              </label>
              <div className="flex items-center gap-3 h-10">
                <Switch
                  checked={formData.xocdia_refund_instant}
                  onChange={(checked) => handleChange('xocdia_refund_instant', checked)}
                />
                <span className="text-xs text-gray-500">
                  Khi bật, lệnh cược thua sẽ được hoàn trả ngay sau khi xử lý
                </span>
              </div>
            </div>
          </div>
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
                Lưu cài đặt hoàn trả
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleResetGameRefund}
            disabled={saving || loading}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Đặt lại
          </Button>
        </div>
      </form>

      {/* Hoàn tổng thua theo ngày */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-base font-semibold text-gray-900 mb-4">Hoàn tổng thua theo ngày</h4>
        <form onSubmit={handleSaveDailyLossRefund} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Bật tính năng
              </label>
              <div className="flex items-center h-10">
                <Switch
                  checked={formData.daily_loss_refund_enabled}
                  onChange={(checked) => handleChange('daily_loss_refund_enabled', checked)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tỷ lệ hoàn trả (%)
              </label>
              <Input
                type="number"
                value={formData.daily_loss_refund_percentage}
                onChange={(e) => handleChange('daily_loss_refund_percentage', e.target.value)}
                placeholder="0"
                min={0}
                max={100}
                step={0.1}
                suffix={<span className="text-gray-500 text-sm">%</span>}
                disabled={!formData.daily_loss_refund_enabled}
                required={formData.daily_loss_refund_enabled}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Thời gian hoàn trả hằng ngày
              </label>
              <TimePicker
                value={formData.daily_loss_refund_payout_time}
                onChange={(value) => handleChange('daily_loss_refund_payout_time', value)}
                format={REFUND_TIME_FORMAT}
                minuteStep={5}
                disabled={!formData.daily_loss_refund_enabled}
              />
            </div>
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
                  Lưu cài đặt hoàn tổng thua theo ngày
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleResetDailyLoss}
              disabled={saving || loading}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Đặt lại
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GameRefundTab;

