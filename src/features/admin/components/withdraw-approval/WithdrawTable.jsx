import Table from '../../../../components/ui/Table';
import { Button } from '../../../../components/ui/Button';
import Pagination from '../../../../components/ui/Pagination';
import StatusTag from '../StatusTag';
import { Eye, Check, X } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../../utils/helpers';

const WithdrawTable = ({ 
  withdraws, 
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
      case 'PROCESSING':
        return { bgColor: 'bg-blue-50', textColor: 'text-blue-700', borderColor: 'border-blue-200', label: 'Đang xử lý' };
      case 'COMPLETED':
        return { bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200', label: 'Hoàn thành' };
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
      key: 'receiverAccount',
      title: 'Tài khoản nhận',
      width: 200,
      render: (_, record) => (
        <div>
          <div className="font-semibold text-sm">{record.accountName || 'N/A'}</div>
          <div className="text-gray-500 text-xs">{record.accountNumber || 'N/A'}</div>
          {record.bankCode && (
            <div className="text-gray-400 text-xs">{record.bankCode}</div>
          )}
        </div>
      )
    },
    {
      key: 'paymentMethod',
      title: 'Phương thức',
      width: 180,
      render: (_, record) => (
        <div>
          <div className="font-semibold text-sm">{record.paymentMethod?.name || 'N/A'}</div>
          <div className="text-gray-500 text-xs">{record.paymentMethod?.typeName || record.paymentMethod?.type || ''}</div>
          {record.methodAccount && (
            <div className="text-gray-600 text-xs font-mono">{record.methodAccount}</div>
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
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetail(record)}
            className="gap-1"
          >
            <Eye className="h-4 w-4" />
            Chi tiết
          </Button>
          {record.status === 'PENDING' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onApprove(record.id)}
                className="gap-1 bg-green-600 text-white hover:bg-green-700 border-green-600"
              >
                <Check className="h-4 w-4" />
                Duyệt
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReject(record.id)}
                className="gap-1 text-red-600 border-red-600 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
                Từ chối
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl overflow-hidden border border-gray-200">
        <Table columns={columns} dataSource={withdraws} loading={loading} />
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

export default WithdrawTable;

