import { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { Card, CardContent } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import DateRangePicker from '../../../../components/ui/DateRangePicker';
import { Search, RotateCcw, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

const UserFilterForm = ({
  filters,
  onFilterChange,
  onReset,
  onCreateUser,
  isAdminPortal = false,
  loading = false
}) => {
  const [searchInput, setSearchInput] = useState(filters.searchTerm || '');
  const timeoutRef = useRef(null);

  useEffect(() => {
    setSearchInput(filters.searchTerm || '');
  }, [filters.searchTerm]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Debounce search
    timeoutRef.current = setTimeout(() => {
      onFilterChange('searchTerm', value);
    }, 300);
  };

  const handleDateRangeChange = (dates) => {
    if (dates && dates[0] && dates[1]) {
      onFilterChange('startDate', dates[0].startOf('day'));
      onFilterChange('endDate', dates[1].endOf('day'));
    } else {
      onFilterChange('startDate', null);
      onFilterChange('endDate', null);
    }
  };

  return (
    <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <Input
              type="text"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Tìm kiếm theo tên, email..."
              className="pl-9 border border-transparent"
            />
          </div>

          {/* Role Filter - Only for Admin */}
          {isAdminPortal && (
            <Select
              placeholder="Vai trò"
              value={filters.role || ''}
              onChange={(value) => onFilterChange('role', value || null)}
              className="border border-transparent"
              options={[
                { label: 'Tất cả', value: '' },
                { label: 'Người dùng', value: 'USER' },
                { label: 'Đại lý', value: 'AGENT' },
              ]}
            />
          )}

          {/* Status Filter */}
          <Select
            placeholder="Trạng thái"
            value={filters.status || ''}
            onChange={(value) => onFilterChange('status', value || null)}
            className="border border-transparent"
            options={[
              { label: 'Tất cả', value: '' },
              { label: 'Hoạt động', value: 'ACTIVE' },
              { label: 'Tạm khóa', value: 'INACTIVE' },
              { label: 'Tạm dừng', value: 'SUSPENDED' },
              { label: 'Bị cấm', value: 'BANNED' },
            ]}
          />

          {/* Date Range */}
          <DateRangePicker
            value={
              filters.startDate && filters.endDate
                ? [dayjs(filters.startDate), dayjs(filters.endDate)]
                : null
            }
            onChange={handleDateRangeChange}
            placeholder={['Từ ngày', 'Đến ngày']}
            className="border border-transparent"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-4">
          <Button
            onClick={onCreateUser}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Thêm người dùng
          </Button>
          <Button
            onClick={onReset}
            variant="outline"
            className="rounded-2xl"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Đặt lại
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserFilterForm;

