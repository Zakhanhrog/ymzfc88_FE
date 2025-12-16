import { Card, CardContent } from '../../../../components/ui/Card';
import { Input } from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';

const BetManagementFilters = ({ filters, onFilterChange }) => {
  const statusOptions = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'PENDING', label: 'Đang chờ' },
    { value: 'WON', label: 'Thắng' },
    { value: 'LOST', label: 'Thua' },
    { value: 'CANCELLED', label: 'Đã hủy' },
  ];

  const regionOptions = [
    { value: '', label: 'Tất cả khu vực' },
    { value: 'mienBac', label: 'Miền Bắc' },
    { value: 'mienTrungNam', label: 'Miền Trung Nam' },
  ];

  const betTypeOptions = [
    { value: '', label: 'Tất cả loại cược' },
    { value: 'loto2s', label: 'Lô 2 số' },
    { value: 'loto3s', label: 'Lô 3 số' },
    { value: 'loto4s', label: 'Lô 4 số' },
    { value: 'loto-xien-2', label: 'Xiên 2' },
    { value: 'loto-xien-3', label: 'Xiên 3' },
    { value: 'loto-xien-4', label: 'Xiên 4' },
    { value: '3s-dac-biet', label: '3 số đặc biệt' },
    { value: '4s-dac-biet', label: '4 số đặc biệt' },
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Select
            value={filters.status}
            onChange={(value) => onFilterChange('status', value)}
            options={statusOptions}
            placeholder="Trạng thái"
            size="sm"
          />

          <Select
            value={filters.region}
            onChange={(value) => onFilterChange('region', value)}
            options={regionOptions}
            placeholder="Khu vực"
            size="sm"
          />

          <Select
            value={filters.betType}
            onChange={(value) => onFilterChange('betType', value)}
            options={betTypeOptions}
            placeholder="Loại cược"
            size="sm"
          />

          <Input
            type="number"
            placeholder="User ID"
            value={filters.userId}
            onChange={(e) => onFilterChange('userId', e.target.value)}
            className="w-full"
          />

          <Input
            type="text"
            placeholder="Tìm username hoặc bet ID"
            value={filters.searchTerm}
            onChange={(e) => onFilterChange('searchTerm', e.target.value)}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BetManagementFilters;

