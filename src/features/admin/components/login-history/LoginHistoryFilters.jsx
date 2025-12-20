import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import DateRangePicker from '../../../../components/ui/DateRangePicker';
import { RefreshCw, RotateCcw } from 'lucide-react';
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
    <Card className="rounded-lg">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-3 xl:flex-nowrap xl:items-end">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tài khoản / Email
            </label>
            <Input
              type="text"
              value={localFilters.username || ''}
              onChange={(e) => handleFilterChange('username', e.target.value)}
              placeholder="Nhập username hoặc email"
              className="h-10 border border-gray-200 focus-visible:ring-[#4CAF50] focus-visible:ring-offset-0"
            />
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Địa chỉ IP
            </label>
            <Input
              type="text"
              value={localFilters.ip || ''}
              onChange={(e) => handleFilterChange('ip', e.target.value)}
              placeholder="Ví dụ: 192.168.1.1"
              className="h-10 border border-gray-200 focus-visible:ring-[#4CAF50] focus-visible:ring-offset-0"
            />
          </div>
          <div className="min-w-[140px]">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Cổng đăng nhập
            </label>
            <Select
              value={localFilters.portal || 'all'}
              onChange={(value) => handleFilterChange('portal', value)}
              options={portalOptions}
              bordered
            />
          </div>
          <div className="min-w-[140px]">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Trạng thái
            </label>
            <Select
              value={localFilters.success || 'all'}
              onChange={(value) => handleFilterChange('success', value)}
              options={successOptions}
              bordered
            />
          </div>
          <div className="flex-1 min-w-[220px]">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Khoảng thời gian
            </label>
            <DateRangePicker
              value={localFilters.dateRange}
              onChange={(dates) => handleFilterChange('dateRange', dates)}
              showTime
              format="DD/MM/YYYY HH:mm"
              bordered
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              className="rounded-lg"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Đặt lại
            </Button>
            <Button
              variant="outline"
              onClick={onRefresh}
              disabled={loading}
              className="rounded-lg"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Tải lại
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginHistoryFilters;

