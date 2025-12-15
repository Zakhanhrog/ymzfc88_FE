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
    <Card className="rounded-2xl">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            {allowRoleFilter && filterOptions.length > 0 && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Lọc theo vai trò:
                </label>
                <Select
                  value={roleFilter}
                  onChange={onRoleFilterChange}
                  options={filterOptions}
                  className="min-w-[220px] border border-transparent"
                />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!readOnly && (
              <Button onClick={onCreate} className="rounded-2xl">
                <UserPlus className="h-4 w-4 mr-2" />
                Tạo tài khoản nhân viên
              </Button>
            )}
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

export default StaffFilters;

