import Table from '../../../../components/ui/Table';
import Pagination from '../../../../components/ui/Pagination';
import StatusTag from '../StatusTag';
import { formatDate } from '../../../../utils/helpers';
import dayjs from 'dayjs';

const PointHistoryTable = ({
  data,
  loading,
  currentPage,
  pageSize,
  totalPages,
  onPageChange,
  showUserColumn = false
}) => {
  const formatPoints = (points) => {
    return new Intl.NumberFormat('vi-VN').format(Math.abs(points || 0));
  };

  const getTransactionTypeColor = (type) => {
    if (type.includes('ADD') || type.includes('EARN') || type.includes('BONUS')) {
      return { bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200', label: 'Tăng' };
    } else if (type.includes('SUBTRACT') || type.includes('SPEND')) {
      return { bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200', label: 'Giảm' };
    } else {
      return { bgColor: 'bg-blue-50', textColor: 'text-blue-700', borderColor: 'border-blue-200', label: 'Khác' };
    }
  };

  const getTransactionTypeTextColor = (type) => {
    if (type.includes('ADD') || type.includes('EARN') || type.includes('BONUS')) {
      return 'text-green-600';
    } else if (type.includes('SUBTRACT') || type.includes('SPEND')) {
      return 'text-red-600';
    } else {
      return 'text-blue-600';
    }
  };

  const columns = [
    {
      key: 'transactionCode',
      title: 'Mã giao dịch',
      width: 150,
      render: (_, record) => (
        <span className="font-mono text-blue-600 text-sm">{record.transactionCode}</span>
      )
    },
    ...(showUserColumn ? [{
      key: 'user',
      title: 'Người dùng',
      render: (_, record) => (
        <div>
          <div className="font-semibold text-sm">{record.user?.username || 'N/A'}</div>
          <div className="text-gray-500 text-xs">{record.user?.fullName || ''}</div>
        </div>
      )
    }] : []),
    {
      key: 'type',
      title: 'Loại',
      width: 120,
      render: (_, record) => {
        const config = getTransactionTypeColor(record.type);
        return (
          <StatusTag 
            status={record.type} 
            customConfig={{ [record.type]: { ...config, label: record.typeDisplayName || record.type } }}
          />
        );
      }
    },
    {
      key: 'points',
      title: 'Điểm thay đổi',
      width: 150,
      className: 'text-right',
      render: (_, record) => (
        <span className={`font-bold text-sm ${getTransactionTypeTextColor(record.type)}`}>
          {record.points >= 0 ? '+' : ''}{formatPoints(record.points)} điểm
        </span>
      )
    },
    {
      key: 'balanceAfter',
      title: 'Số dư sau',
      width: 150,
      className: 'text-right',
      render: (_, record) => (
        <span className="text-sm text-gray-900">{formatPoints(record.balanceAfter)} điểm</span>
      )
    },
    {
      key: 'description',
      title: 'Mô tả',
      render: (_, record) => (
        <div className="max-w-xs truncate text-sm text-gray-900">{record.description}</div>
      )
    },
    {
      key: 'createdByUsername',
      title: 'Người tạo',
      width: 120,
      render: (_, record) => (
        <span className="text-sm text-gray-500">{record.createdByUsername || 'Hệ thống'}</span>
      )
    },
    {
      key: 'createdAt',
      title: 'Thời gian',
      width: 150,
      render: (_, record) => (
        <span className="text-sm text-gray-500">{formatDate(record.createdAt)}</span>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-lg overflow-hidden border border-gray-200">
        <Table columns={columns} dataSource={data} loading={loading} />
      </div>
      {totalPages > 1 && (
        <Pagination
          current={currentPage + 1}
          pageSize={pageSize}
          total={data.length * totalPages}
          onChange={(page) => onPageChange(page - 1)}
          showSizeChanger={false}
        />
      )}
    </div>
  );
};

export default PointHistoryTable;

