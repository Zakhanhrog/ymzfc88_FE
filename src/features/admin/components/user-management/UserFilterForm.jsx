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
    <Card className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-3 xl:flex-nowrap xl:items-end">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <Input
              type="text"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Tìm kiếm theo tên, email..."
              className="pl-9 h-10 border border-gray-200 focus-visible:ring-[#4CAF50] focus-visible:border-[#4CAF50]"
            />
          </div>

          {/* Role Filter - Only for Admin */}
          {isAdminPortal && (
            <Select
              placeholder="Vai trò"
              value={filters.role || ''}
              onChange={(value) => onFilterChange('role', value || null)}
              className="min-w-[140px]"
              bordered
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
            className="min-w-[140px]"
            bordered
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
            className="flex-1 min-w-[220px]"
            bordered
          />
        {/* Action Buttons */}
          <div className="flex items-center gap-2">
          <Button
            onClick={onCreateUser}
            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Thêm người dùng
          </Button>
          <Button
            onClick={onReset}
            variant="outline"
            className="rounded-lg border-emerald-500 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Đặt lại
          </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserFilterForm;

