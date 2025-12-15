import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import DateRangePicker from '../../../../components/ui/DateRangePicker';
import { RefreshCw, Search } from 'lucide-react';

const DepositFilters = ({ filters, onFiltersChange, onRefresh, loading }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const debounceTimer = useRef(null);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    
    // Debounce cho searchText
    if (key === 'searchText') {
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
      status: 'PENDING',
      dateRange: null,
      searchText: ''
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const statusOptions = [
    { label: 'Tất cả', value: '' },
    { label: 'Chờ duyệt', value: 'PENDING' },
    { label: 'Đã duyệt', value: 'APPROVED' },
    { label: 'Đã từ chối', value: 'REJECTED' }
  ];

  return (
    <Card className="rounded-2xl">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tìm kiếm mã GD, username...
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                value={localFilters.searchText || ''}
                onChange={(e) => handleFilterChange('searchText', e.target.value)}
                placeholder="Tìm kiếm mã GD, username..."
                className="pl-9 border border-transparent"
              />
            </div>
          </div>
          <div className="w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Trạng thái
            </label>
            <Select
              value={localFilters.status || ''}
              onChange={(value) => handleFilterChange('status', value)}
              options={statusOptions}
              className="border border-transparent"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Khoảng thời gian
            </label>
            <DateRangePicker
              value={localFilters.dateRange}
              onChange={(dates) => handleFilterChange('dateRange', dates)}
              placeholder={['Từ ngày', 'Đến ngày']}
              className="border border-transparent"
            />
          </div>
          <div className="flex gap-2">
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
              Làm mới
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DepositFilters;

