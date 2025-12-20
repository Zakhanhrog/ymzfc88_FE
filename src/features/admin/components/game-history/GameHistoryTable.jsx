import Table from '../../../../components/ui/Table';
import Pagination from '../../../../components/ui/Pagination';
import Tag from '../../../../components/ui/Tag';
import { Card, CardContent } from '../../../../components/ui/Card';
import { Database } from 'lucide-react';
import dayjs from 'dayjs';
import { formatCurrency } from '../../../../utils/helpers';

const numberFormatter = new Intl.NumberFormat('vi-VN');

const mapGameTypeToLabel = (value) => {
  switch (value?.toUpperCase()) {
    case 'LOTTERY':
      return 'Xổ số';
    case 'XOCDIA':
      return 'Xóc Đĩa';
    case 'SICBO':
      return 'Tài xỉu';
    default:
      return value || '-';
  }
};

const formatDateTime = (value) => {
  if (!value) return '-';
  return dayjs(value).format('DD/MM/YYYY HH:mm:ss');
};

const GameHistoryTable = ({
  data = [],
  loading = false,
  pagination,
  onPageChange
}) => {
  const columns = [
    {
      key: 'createdAt',
      dataIndex: 'createdAt',
      title: 'Thời gian đặt',
      width: 170,
      render: (value, record) => (
        <span className="text-sm text-gray-900">{formatDateTime(record?.createdAt)}</span>
      ),
    },
    {
      key: 'gameType',
      dataIndex: 'gameType',
      title: 'Game',
      width: 110,
      render: (value, record) => (
        <span className="text-sm text-gray-900">{mapGameTypeToLabel(record?.gameType)}</span>
      ),
    },
    {
      key: 'username',
      dataIndex: 'username',
      title: 'Người chơi',
      render: (value, record) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">{record?.username || '-'}</span>
          {record?.fullName && (
            <span className="text-xs text-gray-500">{record.fullName}</span>
          )}
          {record?.phoneNumber && (
            <span className="text-xs text-gray-500">{record.phoneNumber}</span>
          )}
        </div>
      ),
    },
    {
      key: 'description',
      dataIndex: 'description',
      title: 'Chi tiết cược',
      render: (value, record) => (
        <div className="flex flex-col">
          <span className="text-sm text-gray-900">{record?.betCode || '-'}</span>
          {record?.description && (
            <span className="text-xs text-gray-500">{record.description}</span>
          )}
        </div>
      ),
    },
    {
      key: 'stakeAmount',
      dataIndex: 'stakeAmount',
      title: 'Điểm cược',
      align: 'right',
      render: (value, record) => (
        <span className="text-sm font-medium text-gray-900">
          {formatCurrency(Number(record?.stakeAmount ?? 0))}
        </span>
      ),
    },
    {
      key: 'potentialWinAmount',
      dataIndex: 'potentialWinAmount',
      title: 'Tiềm năng',
      align: 'right',
      render: (value, record) => (
        <span className="text-sm text-gray-900">
          {formatCurrency(Number(record?.potentialWinAmount ?? 0))}
        </span>
      ),
    },
    {
      key: 'winAmount',
      dataIndex: 'winAmount',
      title: 'Tiền thắng',
      align: 'right',
      render: (value, record) => (
        <span className="text-sm font-medium text-green-600">
          {record?.winAmount ? formatCurrency(Number(record.winAmount ?? 0)) : '-'}
        </span>
      ),
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: 'Trạng thái',
      align: 'center',
      width: 120,
      render: (value, record) => {
        const status = record?.status?.toUpperCase();
        if (!status) return '-';
        
        if (status === 'WON') {
          return <Tag color="green" className="text-xs font-semibold">Thắng</Tag>;
        }
        if (status === 'LOST') {
          return <Tag color="red" className="text-xs font-semibold">Thua</Tag>;
        }
        if (status === 'REFUNDED' || status === 'CANCELLED') {
          return <Tag color="orange" className="text-xs font-semibold">Hoàn/Hủy</Tag>;
        }
        return <Tag color="blue" className="text-xs font-semibold">Đang chờ</Tag>;
      },
    },
    {
      key: 'resultCode',
      dataIndex: 'resultCode',
      title: 'Kết quả',
      render: (value, record) => (
        <span className="text-sm text-gray-900">{record?.resultCode || '-'}</span>
      ),
    },
    {
      key: 'settledAt',
      dataIndex: 'settledAt',
      title: 'Thời gian trả',
      width: 170,
      render: (value, record) => (
        <span className="text-sm text-gray-900">{formatDateTime(record?.settledAt)}</span>
      ),
    },
    {
      key: 'sessionId',
      dataIndex: 'sessionId',
      title: 'Phiên',
      width: 140,
      render: (value, record) => {
        if (!record?.sessionId) return <span className="text-sm text-gray-500">-</span>;
        return (
          <div className="flex flex-col">
            <span className="text-sm text-gray-900">Phiên #{record.sessionId}</span>
            {record?.tableNumber && (
              <span className="text-xs text-gray-500">Bàn {record.tableNumber}</span>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            rowKey={(record) => `${record.gameType}-${record.id}`}
            emptyText="Chưa có lịch sử cược nào"
          />
        </div>
        
        {!loading && data.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={(page, size) => onPageChange(page, size)}
              onShowSizeChange={(page, size) => onPageChange(page, size)}
              showSizeChanger={true}
              pageSizeOptions={['10', '20', '50', '100']}
              showTotal={(total) => `${numberFormatter.format(total)} bản ghi`}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GameHistoryTable;

