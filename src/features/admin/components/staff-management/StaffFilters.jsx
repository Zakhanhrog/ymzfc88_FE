import { Card, CardContent } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import Select from '../../../../components/ui/Select';
import { RefreshCw, UserPlus } from 'lucide-react';

const STAFF_ROLE_OPTIONS = [
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Nhân viên TX 1', value: 'STAFF_TX1' },
  { label: 'Nhân viên TX 2', value: 'STAFF_TX2' },
  { label: 'Nhân viên Xóc Đĩa', value: 'STAFF_XD' },
  { label: 'Nhân viên MKT', value: 'STAFF_MKT' },
  { label: 'Nhân viên XNK', value: 'STAFF_XNK' },
];

const StaffFilters = ({
  roleFilter,
  onRoleFilterChange,
  onRefresh,
  onCreate,
  loading,
  allowRoleFilter,
  readOnly,
  filterOptions
}) => {
  return (
    <Card className="rounded-lg">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-3 xl:flex-nowrap xl:items-end">
          {allowRoleFilter && filterOptions.length > 0 && (
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Lọc theo vai trò:
              </label>
              <Select
                value={roleFilter}
                onChange={onRoleFilterChange}
                options={filterOptions}
                className="flex-1 min-w-[180px]"
                bordered
              />
            </div>
          )}
          <div className="flex items-center gap-2 ml-auto">
            {!readOnly && (
              <Button onClick={onCreate} className="rounded-lg">
                <UserPlus className="h-4 w-4 mr-2" />
                Tạo tài khoản nhân viên
              </Button>
            )}
            <Button
              variant="outline"
              onClick={onRefresh}
              disabled={loading}
              className="rounded-lg"
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

export default StaffFilters;

