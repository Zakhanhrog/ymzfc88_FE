import { Card, CardContent } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import DateRangePicker from '../../../../components/ui/DateRangePicker';

const PointHistoryFilters = ({
  users,
  filters,
  onFiltersChange,
  onApply
}) => {
  const userOptions = [
    { label: 'Tất cả người dùng', value: '' },
    ...users.map(user => ({
      label: user.username,
      value: user.id.toString()
    }))
  ];

  return (
    <Card className="rounded-lg">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-3 xl:flex-nowrap xl:items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Từ ngày
            </label>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => onFiltersChange({ ...filters, startDate: e.target.value })}
              className="h-10 border border-gray-200 focus-visible:ring-[#4CAF50] focus-visible:ring-offset-0"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Đến ngày
            </label>
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => onFiltersChange({ ...filters, endDate: e.target.value })}
              className="h-10 border border-gray-200 focus-visible:ring-[#4CAF50] focus-visible:ring-offset-0"
            />
          </div>
          <div className="min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Người dùng
            </label>
            <Select
              value={filters.userId}
              onChange={(value) => onFiltersChange({ ...filters, userId: value })}
              options={userOptions}
              bordered
            />
          </div>
          <div className="flex items-center">
            <Button
              onClick={onApply}
              className="bg-[#4CAF50] text-white hover:bg-[#45a049] rounded-lg"
            >
              Lọc
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PointHistoryFilters;

