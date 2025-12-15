import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import DateRangePicker from '../../../../components/ui/DateRangePicker';
import { RefreshCw } from 'lucide-react';
import dayjs from 'dayjs';

const successOptions = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Thành công', value: 'success' },
  { label: 'Thất bại', value: 'failure' },
];

const portalOptions = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Người dùng', value: 'USER' },
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Nhân viên', value: 'STAFF' },
  { label: 'Đại lý', value: 'AGENT' },
];

const LoginHistoryFilters = ({ filters, onFiltersChange, onRefresh, loading }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const debounceTimer = useRef(null);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    
    // Debounce cho username và ip (các field người dùng gõ)
    if (key === 'username' || key === 'ip') {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        onFiltersChange(newFilters);
      }, 500);
    } else {
      // Các field khác (select, date) apply ngay lập tức
      onFiltersChange(newFilters);
    }
  };

  const handleReset = () => {
    const defaultFilters = {
      username: '',
      ip: '',
      portal: 'all',
      success: 'all',
      dateRange: null,
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  return (
    <Card className="rounded-2xl">
      <CardContent className="p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tài khoản / Email
            </label>
            <Input
              type="text"
              value={localFilters.username || ''}
              onChange={(e) => handleFilterChange('username', e.target.value)}
              placeholder="Nhập username hoặc email"
              className="border border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Địa chỉ IP
            </label>
            <Input
              type="text"
              value={localFilters.ip || ''}
              onChange={(e) => handleFilterChange('ip', e.target.value)}
              placeholder="Ví dụ: 192.168.1.1"
              className="border border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Cổng đăng nhập
            </label>
            <Select
              value={localFilters.portal || 'all'}
              onChange={(value) => handleFilterChange('portal', value)}
              options={portalOptions}
              className="border border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Trạng thái
            </label>
            <Select
              value={localFilters.success || 'all'}
              onChange={(value) => handleFilterChange('success', value)}
              options={successOptions}
              className="border border-transparent"
            />
          </div>
          <div className="md:col-span-2 lg:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Khoảng thời gian
            </label>
            <DateRangePicker
              value={localFilters.dateRange}
              onChange={(dates) => handleFilterChange('dateRange', dates)}
              showTime
              format="DD/MM/YYYY HH:mm"
              className="w-full border border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            onClick={handleReset}
            className="rounded-2xl"
          >
            Đặt lại
          </Button>
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={loading}
            className="rounded-2xl"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Tải lại
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginHistoryFilters;

