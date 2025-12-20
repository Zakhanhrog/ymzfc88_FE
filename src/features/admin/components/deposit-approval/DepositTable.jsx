import Table from '../../../../components/ui/Table';
import Pagination from '../../../../components/ui/Pagination';
import StatusTag from '../StatusTag';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../components/ui/Tooltip';
import { Eye, Check, X, FileImage } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../../utils/helpers';

const DepositTable = ({ 
  deposits, 
  loading, 
  onViewDetail, 
  onApprove, 
  onReject,
  currentPage,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange
}) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'PENDING':
        return { bgColor: 'bg-yellow-50', textColor: 'text-yellow-700', borderColor: 'border-yellow-200', label: 'Chờ duyệt' };
      case 'APPROVED':
        return { bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200', label: 'Đã duyệt' };
      case 'REJECTED':
        return { bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200', label: 'Đã từ chối' };
      case 'CANCELLED':
        return { bgColor: 'bg-gray-50', textColor: 'text-gray-700', borderColor: 'border-gray-200', label: 'Đã hủy' };
      default:
        return { bgColor: 'bg-gray-50', textColor: 'text-gray-700', borderColor: 'border-gray-200', label: status };
    }
  };

  const columns = [
    {
      key: 'transactionCode',
      title: 'Mã GD',
      width: 120,
      render: (_, record) => (
        <span className="font-mono text-blue-600 text-sm">{record.transactionCode}</span>
      )
    },
    {
      key: 'username',
      title: 'Người dùng',
      render: (_, record) => (
        <div>
          <div className="font-semibold text-sm">{record.username}</div>
          <div className="text-gray-500 text-xs">{record.userEmail}</div>
        </div>
      )
    },
    {
      key: 'amount',
      title: 'Số tiền',
      width: 150,
      className: 'text-right',
      render: (_, record) => (
        <span className="font-bold text-green-600 text-sm">
          {formatCurrency(record.amount)}
        </span>
      )
    },
    {
      key: 'paymentMethod',
      title: 'Phương thức',
      width: 180,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <div>
            <div className="text-sm">{record.paymentMethod?.name || 'N/A'}</div>
            <div className="text-gray-500 text-xs">{record.paymentMethod?.type || ''}</div>
          </div>
          {(record.billImage || record.billImageUrl) && (
            <FileImage className="h-4 w-4 text-blue-500" title="Có ảnh bill chuyển khoản" />
          )}
        </div>
      )
    },
    {
      key: 'createdAt',
      title: 'Thời gian',
      width: 150,
      render: (_, record) => (
        <span className="text-sm">{formatDate(record.createdAt)}</span>
      )
    },
    {
      key: 'status',
      title: 'Trạng thái',
      width: 120,
      render: (_, record) => {
        const config = getStatusConfig(record.status);
        return (
          <StatusTag 
            status={record.status} 
            customConfig={{ [record.status]: config }}
          />
        );
      }
    },
    {
      key: 'processedByUsername',
      title: 'Người duyệt',
      width: 150,
      render: (_, record) => {
        if (!record.processedByUsername) {
          return <span className="text-gray-400 text-sm">-</span>;
        }
        return (
          <div>
            <div className="font-semibold text-sm">{record.processedByUsername}</div>
            {record.processedAt && (
              <div className="text-gray-500 text-xs">{formatDate(record.processedAt)}</div>
            )}
          </div>
        );
      }
    },
    {
      key: 'actions',
      title: 'Hành động',
      width: 200,
      render: (_, record) => (
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => onViewDetail(record)}
                  className="p-1.5 border border-gray-200 hover:bg-gray-100 rounded transition-colors"
                >
                  <Eye className="h-4 w-4 text-gray-600" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Chi tiết</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {record.status === 'PENDING' && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onApprove(e, record.id);
                      }}
                      className="p-1.5 border border-green-200 hover:bg-green-50 rounded transition-colors"
                    >
                      <Check className="h-4 w-4 text-green-600" />
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
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onReject(e, record.id);
                      }}
                      className="p-1.5 border border-red-200 hover:bg-red-50 rounded transition-colors"
                    >
                      <X className="h-4 w-4 text-red-600" />
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
    <div className="space-y-4">
      <div className="rounded-lg overflow-hidden border border-gray-200">
        <Table columns={columns} dataSource={deposits} loading={loading} />
      </div>
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={total}
        onChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        showSizeChanger
        showQuickJumper
      />
    </div>
  );
};

export default DepositTable;

