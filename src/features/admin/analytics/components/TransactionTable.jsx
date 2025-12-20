import Table from '../../../../components/ui/Table';
import Pagination from '../../../../components/ui/Pagination';
import dayjs from 'dayjs';

// Format points cho transaction (từ VND sang điểm, không có chữ "điểm")
const formatTransactionPoints = (amount) => {
  if (!amount && amount !== 0) return '0';
  const points = Number(amount) / 1000;
  const formatter = new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: true
  });
  return formatter.format(points);
};

const formatDateTime = (value) => {
  if (!value) return '';
  return dayjs(value).format('HH:mm DD/MM/YYYY');
};

const PAYMENT_TYPE_LABELS = {
  DEPOSIT: 'Nạp tiền',
  WITHDRAW: 'Rút tiền',
  BONUS: 'Thưởng',
  REFUND: 'Hoàn tiền',
  ADJUSTMENT: 'Điều chỉnh',
};

// Status tag component với style giống StatCard
const StatusTag = ({ status }) => {
  const statusConfig = {
    PENDING: {
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-200',
    },
    APPROVED: {
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
    },
    COMPLETED: {
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
    },
    REJECTED: {
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
    },
    CANCELLED: {
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200',
    },
    FAILED: {
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
    },
  };

  const config = statusConfig[status] || {
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-200',
  };

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} border rounded-xl px-2 py-0.5 shadow-sm inline-block`}
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <span
        className={`text-xs font-semibold ${config.textColor}`}
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontWeight: 600,
        }}
      >
        {status}
      </span>
    </div>
  );
};

const TRANSACTION_STATUS_COLORS = {
  PENDING: 'default',
  APPROVED: 'blue',
  COMPLETED: 'success',
  REJECTED: 'error',
  CANCELLED: 'warning',
  FAILED: 'error',
};

const TransactionTable = ({ data, loading, pagination, onPaginationChange }) => {
  const numberFormatter = new Intl.NumberFormat('vi-VN');

  const columns = [
    {
      key: 'transactionCode',
      dataIndex: 'transactionCode',
      title: 'Mã GD',
      width: 140,
      render: (value) => (
        <span className="text-sm font-mono text-gray-900">{value}</span>
      ),
    },
    {
      key: 'username',
      dataIndex: 'username',
      title: 'Người dùng',
      width: 140,
      render: (value) => (
        <span className="text-sm text-gray-900">{value}</span>
      ),
    },
    {
      key: 'type',
      dataIndex: 'type',
      title: 'Loại',
      width: 120,
      render: (value) => (
        <span className="text-sm text-gray-900">{PAYMENT_TYPE_LABELS[value] ?? value}</span>
      ),
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: 'Trạng thái',
      width: 120,
      render: (value) => <StatusTag status={value} />,
    },
    {
      key: 'amount',
      dataIndex: 'amount',
      title: 'Số tiền',
      width: 140,
      render: (value) => (
        <span className="text-sm font-medium text-gray-900">{formatTransactionPoints(value ?? 0)}</span>
      ),
      className: 'text-right',
    },
    {
      key: 'netAmount',
      dataIndex: 'netAmount',
      title: 'Thực nhận',
      width: 140,
      render: (value) => (
        <span className="text-sm font-medium text-gray-900">{formatTransactionPoints(value ?? 0)}</span>
      ),
      className: 'text-right',
    },
    {
      key: 'paymentMethod',
      dataIndex: 'paymentMethod',
      title: 'Phương thức',
      width: 160,
      render: (value) => (
        <span className="text-sm text-gray-700">{value || '—'}</span>
      ),
    },
    {
      key: 'createdAt',
      dataIndex: 'createdAt',
      title: 'Tạo lúc',
      width: 180,
      render: (value) => (
        <span className="text-sm text-gray-700">{formatDateTime(value)}</span>
      ),
    },
    {
      key: 'processedAt',
      dataIndex: 'processedAt',
      title: 'Xử lý lúc',
      width: 180,
      render: (value) => (
        <span className="text-sm text-gray-700">{formatDateTime(value)}</span>
      ),
    },
    {
      key: 'processedByUsername',
      dataIndex: 'processedByUsername',
      title: 'Người duyệt',
      width: 150,
      render: (username, record) => {
        if (!username) {
          return <span className="text-sm text-gray-400">—</span>;
        }
        return (
          <div>
            <div className="text-sm font-medium text-gray-900">{username}</div>
            {record.processedAt && (
              <div className="text-xs text-gray-500 mt-0.5">{formatDateTime(record.processedAt)}</div>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden w-full">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Báo cáo nạp / rút / điều chỉnh</h3>
      </div>
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            rowKey={(record) => record.id}
            emptyText="Không có dữ liệu giao dịch"
          />
        </div>
        
        {!loading && data.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={(page, size) => onPaginationChange({ current: page, pageSize: size })}
              showSizeChanger={true}
              pageSizeOptions={['10', '20', '50', '100']}
              showTotal={(total) => `${numberFormatter.format(total)} bản ghi`}
            />
          </div>
        )}
    </div>
  );
};

export default TransactionTable;
