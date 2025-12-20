import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import Select from '../../../../components/ui/Select';
import DateRangePicker from '../../../../components/ui/DateRangePicker';

const FilterForm = ({ filters, onFilterSubmit, onReset }) => {
  const [formData, setFormData] = useState({
    dateRange: filters.dateRange,
    gameType: filters.gameType || 'all',
    betStatus: filters.betStatus || 'all',
    transactionType: filters.transactionType || 'all',
    transactionStatus: filters.transactionStatus || 'all',
  });

  useEffect(() => {
    setFormData({
      dateRange: filters.dateRange,
      gameType: filters.gameType || 'all',
      betStatus: filters.betStatus || 'all',
      transactionType: filters.transactionType || 'all',
      transactionStatus: filters.transactionStatus || 'all',
    });
  }, [filters]);

  const handleFilterChange = (newFormData) => {
    setFormData(newFormData);
    onFilterSubmit(newFormData);
  };

  const handleReset = () => {
    const defaults = {
      dateRange: null,
      gameType: 'all',
      betStatus: 'all',
      transactionType: 'all',
      transactionStatus: 'all',
    };
    setFormData(defaults);
    onReset(defaults);
    onFilterSubmit(defaults);
  };

  return (
    <Card className="rounded-lg">
      <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Khoảng thời gian
              </label>
              <DateRangePicker
                value={formData.dateRange}
              onChange={(value) => handleFilterChange({ ...formData, dateRange: value })}
                placeholder={['Từ ngày', 'Đến ngày']}
                bordered
              />
            </div>

            <div className="w-[140px]">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Game
              </label>
              <Select
                value={formData.gameType}
              onChange={(value) => handleFilterChange({ ...formData, gameType: value })}
                options={[
                  { label: 'Tất cả', value: 'all' },
                  { label: 'Xổ số', value: 'lottery' },
                  { label: 'Tài Xỉu', value: 'sicbo' },
                  { label: 'Xóc Đĩa', value: 'xocdia' },
                ]}
                bordered
              />
            </div>

            <div className="w-[140px]">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Trạng thái cược
              </label>
              <Select
                value={formData.betStatus}
              onChange={(value) => handleFilterChange({ ...formData, betStatus: value })}
                options={[
                  { label: 'Tất cả', value: 'all' },
                  { label: 'Đang chờ', value: 'PENDING' },
                  { label: 'Thắng', value: 'WON' },
                  { label: 'Thua', value: 'LOST' },
                  { label: 'Hủy', value: 'CANCELLED' },
                ]}
                bordered
              />
            </div>

            <div className="w-[140px]">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Loại giao dịch
              </label>
              <Select
                value={formData.transactionType}
              onChange={(value) => handleFilterChange({ ...formData, transactionType: value })}
                options={[
                  { label: 'Tất cả', value: 'all' },
                  { label: 'Nạp tiền', value: 'DEPOSIT' },
                  { label: 'Rút tiền', value: 'WITHDRAW' },
                  { label: 'Thưởng', value: 'BONUS' },
                  { label: 'Hoàn tiền', value: 'REFUND' },
                  { label: 'Điều chỉnh', value: 'ADJUSTMENT' },
                ]}
                bordered
              />
            </div>

            <div className="w-[140px]">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Trạng thái giao dịch
              </label>
              <Select
                value={formData.transactionStatus}
              onChange={(value) => handleFilterChange({ ...formData, transactionStatus: value })}
                options={[
                  { label: 'Tất cả', value: 'all' },
                  { label: 'Đang chờ', value: 'PENDING' },
                  { label: 'Đã duyệt', value: 'APPROVED' },
                  { label: 'Hoàn thành', value: 'COMPLETED' },
                  { label: 'Từ chối', value: 'REJECTED' },
                  { label: 'Hủy', value: 'CANCELLED' },
                  { label: 'Thất bại', value: 'FAILED' },
                ]}
                bordered
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="px-4 rounded-lg border-emerald-500 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
              >
                Đặt lại
              </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterForm;
