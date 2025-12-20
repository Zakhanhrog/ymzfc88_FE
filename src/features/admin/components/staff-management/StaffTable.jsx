import { Edit, Key, Shield } from 'lucide-react';
import Table from '../../../../components/ui/Table';
import Pagination from '../../../../components/ui/Pagination';
import Select from '../../../../components/ui/Select';
import { Button } from '../../../../components/ui/Button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../components/ui/Tooltip';
import StatusTag from '../StatusTag';

const STAFF_ROLE_OPTIONS = [
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Nhân viên TX 1', value: 'STAFF_TX1' },
  { label: 'Nhân viên TX 2', value: 'STAFF_TX2' },
  { label: 'Nhân viên Xóc Đĩa', value: 'STAFF_XD' },
  { label: 'Nhân viên MKT', value: 'STAFF_MKT' },
  { label: 'Nhân viên XNK', value: 'STAFF_XNK' },
];

const STAFF_ROLE_LABELS = STAFF_ROLE_OPTIONS.reduce((acc, item) => {
  acc[item.value] = item.label;
  return acc;
}, {});

const StaffTable = ({
  data = [],
  loading = false,
  pagination = { current: 1, pageSize: 20, total: 0 },
  readOnly = false,
  onPaginationChange,
  onUpdateRole,
  onEdit,
  onPassword,
  onC2Password
}) => {
  const columns = [
    {
      key: 'id',
      title: 'ID',
      width: 80,
      render: (_, record) => (
        <span className="text-sm text-gray-600">#{record.id}</span>
      )
    },
    {
      key: 'username',
      title: 'Tài khoản',
      width: 160,
      render: (_, record) => (
        <div>
          <div className="font-semibold text-sm text-gray-900">{record.username}</div>
          <div className="text-xs text-gray-500">{record.email}</div>
        </div>
      )
    },
    {
      key: 'fullName',
      title: 'Họ tên',
      width: 160,
      render: (_, record) => (
        <span className="text-sm text-gray-900">
          {record.fullName || <span className="text-gray-400">Chưa cập nhật</span>}
        </span>
      )
    },
    {
      key: 'phoneNumber',
      title: 'Số điện thoại',
      width: 140,
      render: (_, record) => (
        <span className="text-sm text-gray-900">
          {record.phoneNumber || <span className="text-gray-400">-</span>}
        </span>
      )
    },
    {
      key: 'status',
      title: 'Trạng thái',
      width: 120,
      render: (_, record) => {
        const statusMap = {
          ACTIVE: { bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200', label: 'Hoạt động' },
          INACTIVE: { bgColor: 'bg-orange-50', textColor: 'text-orange-700', borderColor: 'border-orange-200', label: 'Tạm khóa' },
          SUSPENDED: { bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200', label: 'Tạm dừng' },
          BANNED: { bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200', label: 'Bị cấm' }
        };
        const config = statusMap[record.status] || statusMap.ACTIVE;
        return (
          <StatusTag
            status={record.status}
            customConfig={{ [record.status]: config }}
          />
        );
      }
    },
    {
      key: 'staffRole',
      title: 'Phân quyền',
      width: 220,
      render: (_, record) => {
        // Nếu là Admin thì chỉ hiển thị tag
        if (record.role === 'ADMIN') {
          return (
            <StatusTag
              status="ADMIN"
              customConfig={{
                ADMIN: {
                  bgColor: 'bg-orange-50',
                  textColor: 'text-orange-700',
                  borderColor: 'border-orange-200',
                  label: 'Admin'
                }
              }}
            />
          );
        }

        // Nếu readOnly thì chỉ hiển thị tag
        if (readOnly) {
          return record.staffRole ? (
            <StatusTag
              status={record.staffRole}
              customConfig={{
                [record.staffRole]: {
                  bgColor: 'bg-blue-50',
                  textColor: 'text-blue-700',
                  borderColor: 'border-blue-200',
                  label: STAFF_ROLE_LABELS[record.staffRole] || record.staffRole
                }
              }}
            />
          ) : (
            <StatusTag
              status="NO_ROLE"
              customConfig={{
                NO_ROLE: {
                  bgColor: 'bg-gray-50',
                  textColor: 'text-gray-700',
                  borderColor: 'border-gray-200',
                  label: 'Chưa phân quyền'
                }
              }}
            />
          );
        }

        // Nếu không readOnly thì cho phép chỉnh sửa
        return (
          <Select
            value={record.staffRole || ''}
            onChange={(value) => onUpdateRole(record.id, value || null)}
            options={[
              { label: 'Chưa phân quyền', value: '' },
              ...STAFF_ROLE_OPTIONS
            ]}
            placeholder="Chưa phân quyền"
            className="w-full"
          />
        );
      }
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: 180,
      render: (_, record) => (
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => onEdit(record)}
                  className="p-1.5 border border-gray-200 hover:bg-gray-100 rounded transition-colors"
                >
                  <Edit className="h-4 w-4 text-gray-600" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Chỉnh sửa thông tin</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => onPassword(record)}
                  className="p-1.5 border border-gray-200 hover:bg-gray-100 rounded transition-colors"
                >
                  <Key className="h-4 w-4 text-gray-600" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Đổi mật khẩu</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => onC2Password(record)}
                  className="p-1.5 border border-gray-200 hover:bg-gray-100 rounded transition-colors"
                >
                  <Shield className="h-4 w-4 text-gray-600" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Đổi mật khẩu C2</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )
    }
  ];

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          emptyText="Không có nhân viên nào"
        />
      </div>
      {pagination.total > 0 && (
        <div className="border-t border-gray-200 px-4 py-3">
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={onPaginationChange}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} của ${total} người dùng`
            }
          />
        </div>
      )}
    </div>
  );
};

export default StaffTable;

