import { Eye, CheckCircle2, XCircle } from 'lucide-react';
import Table from '../../../../components/ui/Table';
import Pagination from '../../../../components/ui/Pagination';
import { Button } from '../../../../components/ui/Button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../components/ui/Tooltip';
import KycStatusTag from './KycStatusTag';

const KycTable = ({
  data = [],
  loading = false,
  pagination = { current: 1, pageSize: 10, total: 0 },
  onPaginationChange,
  onViewDetail,
  onApprove,
  onReject
}) => {
  const columns = [
    {
      key: 'id',
      title: 'ID',
      width: 60,
      render: (_, record) => (
        <span className="text-sm text-gray-600">{record.id}</span>
      )
    },
    {
      key: 'user',
      title: 'Người dùng',
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
      render: (_, record) => (
        <span className="text-sm text-gray-900">{record.fullName || '-'}</span>
      )
    },
    {
      key: 'idNumber',
      title: 'Số CCCD',
      render: (_, record) => (
        <span className="text-sm text-gray-900">{record.idNumber || '-'}</span>
      )
    },
    {
      key: 'status',
      title: 'Trạng thái',
      render: (_, record) => <KycStatusTag status={record.status} />
    },
    {
      key: 'submittedAt',
      title: 'Ngày gửi',
      render: (_, record) => (
        <span className="text-sm text-gray-600">
          {new Date(record.submittedAt).toLocaleString('vi-VN')}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: 200,
      render: (_, record) => (
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => onViewDetail(record)}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                >
                  <Eye className="h-4 w-4 text-gray-600" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Xem chi tiết</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {record.status === 'PENDING' && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => onApprove(record)}
                      className="p-1.5 hover:bg-green-50 rounded transition-colors"
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Duyệt</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => onReject(record)}
                      className="p-1.5 hover:bg-red-50 rounded transition-colors"
                    >
                      <XCircle className="h-4 w-4 text-red-600" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Từ chối</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        emptyText="Không có yêu cầu xác thực nào"
      />
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
              `${range[0]}-${range[1]} của ${total} yêu cầu`
            }
          />
        </div>
      )}
    </div>
  );
};

export default KycTable;

