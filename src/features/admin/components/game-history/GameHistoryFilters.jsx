import { Card, CardContent } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import Select from '../../../../components/ui/Select';
import DateRangePicker from '../../../../components/ui/DateRangePicker';
import { RefreshCw } from 'lucide-react';
import dayjs from 'dayjs';

const DEFAULT_DATE_RANGE = [dayjs().subtract(7, 'day'), dayjs()];

const GAME_TYPE_OPTIONS = [
  { value: 'lottery', label: 'Xổ số' },
  { value: 'xocdia', label: 'Xóc Đĩa' },
  { value: 'sicbo', label: 'Tài xỉu' }
];

const LOTTERY_STATUS_OPTIONS = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'PENDING', label: 'Đang chờ' },
  { value: 'WON', label: 'Thắng' },
  { value: 'LOST', label: 'Thua' },
  { value: 'CANCELLED', label: 'Đã hủy' }
];

const LIVE_STATUS_OPTIONS = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'PENDING', label: 'Đang chờ' },
  { value: 'WON', label: 'Thắng' },
  { value: 'LOST', label: 'Thua' },
  { value: 'REFUNDED', label: 'Hoàn cược' }
];

const GameHistoryFilters = ({ 
  filters, 
  onFilterChange, 
  onRefresh, 
  loading 
}) => {
  const statusOptions = filters.gameType === 'lottery' 
    ? LOTTERY_STATUS_OPTIONS 
    : LIVE_STATUS_OPTIONS;

  const handleDateRangeChange = (dates) => {
    if (!dates || !Array.isArray(dates) || dates.length !== 2) {
      onFilterChange('dateRange', DEFAULT_DATE_RANGE);
      return;
    }
    // Convert Date array to dayjs array
    const dayjsRange = dates.map(d => d ? dayjs(d) : null);
    if (dayjsRange[0] && dayjsRange[1]) {
      onFilterChange('dateRange', dayjsRange);
    }
  };

  // Convert dayjs array to Date array for DateRangePicker
  const dateRangeValue = filters.dateRange && filters.dateRange.length === 2 && filters.dateRange[0] && filters.dateRange[1]
    ? filters.dateRange.map(d => d ? d.toDate() : null)
    : DEFAULT_DATE_RANGE.map(d => d.toDate());

  return (
    <Card className="rounded-2xl">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-3 xl:flex-nowrap xl:items-end">
          <div className="min-w-[140px]">
            <Select
              value={filters.gameType}
              onChange={(value) => onFilterChange('gameType', value)}
              options={GAME_TYPE_OPTIONS}
              placeholder="Loại game"
              bordered
            />
          </div>

          <div className="min-w-[160px]">
            <Select
              value={filters.status || ''}
              onChange={(value) => onFilterChange('status', value || undefined)}
              options={statusOptions}
              placeholder="Trạng thái"
              bordered
            />
          </div>

          <div className="flex-1 min-w-[220px]">
            <DateRangePicker
              value={dateRangeValue}
              onChange={handleDateRangeChange}
              placeholder={['Từ ngày', 'Đến ngày']}
              format="DD/MM/YYYY"
              bordered
            />
          </div>

          <div className="flex items-center">
            <Button
              variant="outline"
              onClick={onRefresh}
              disabled={loading}
              className="gap-2 rounded-2xl"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameHistoryFilters;

