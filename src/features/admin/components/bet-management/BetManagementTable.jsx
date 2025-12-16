import Table from '../../../../components/ui/Table';
import Tag from '../../../../components/ui/Tag';
import { Button } from '../../../../components/ui/Button';
import { Card, CardContent } from '../../../../components/ui/Card';
import { Edit, Trash2, Loader2, Database } from 'lucide-react';
import adminBetService from '../../services/adminBetService';

const BetManagementTable = ({ 
  bets = [], 
  loading = false,
  pagination = {},
  onPageChange,
  onEdit,
  onDelete
}) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-gray-400" />
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </CardContent>
      </Card>
    );
  }

  if (bets.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Database className="h-12 w-12 mx-auto text-gray-400" />
          <p className="mt-4 text-gray-600">Không có bet nào</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'yellow';
      case 'WON':
        return 'green';
      case 'LOST':
        return 'red';
      case 'CANCELLED':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const columns = [
    {
      key: 'id',
      title: 'ID',
      width: 80,
      render: (_, record) => (
        <span className="text-sm font-medium text-gray-900">#{record.id}</span>
      )
    },
    {
      key: 'user',
      title: 'User',
      width: 150,
      render: (_, record) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{record.username}</div>
          <div className="text-xs text-gray-500">ID: {record.userId}</div>
        </div>
      )
    },
    {
      key: 'region',
      title: 'Khu vực',
      width: 120,
      render: (_, record) => (
        <span className="text-sm text-gray-900">
          {adminBetService.getRegionName(record.region)}
        </span>
      )
    },
    {
      key: 'betType',
      title: 'Loại cược',
      width: 150,
      render: (_, record) => (
        <span className="text-sm text-gray-900">
          {adminBetService.getBetTypeName(record.betType)}
        </span>
      )
    },
    {
      key: 'selectedNumbers',
      title: 'Số đã chọn',
      render: (_, record) => {
        const numbers = Array.isArray(record.selectedNumbers) 
          ? record.selectedNumbers 
          : (record.selectedNumbers || '').split(',').map(n => n.trim()).filter(n => n);
        return (
          <div className="text-sm text-gray-900">
            {adminBetService.formatSelectedNumbers(record.betType, numbers)}
          </div>
        );
      }
    },
    {
      key: 'totalAmount',
      title: 'Tiền cược',
      width: 120,
      align: 'right',
      render: (_, record) => (
        <span className="text-sm font-medium text-gray-900">
          {adminBetService.formatMoney(record.totalAmount)}
        </span>
      )
    },
    {
      key: 'winAmount',
      title: 'Tiền thắng',
      width: 120,
      align: 'right',
      render: (_, record) => (
        <span className="text-sm font-semibold text-green-600">
          {record.winAmount ? adminBetService.formatMoney(record.winAmount) : '-'}
        </span>
      )
    },
    {
      key: 'status',
      title: 'Trạng thái',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Tag color={getStatusColor(record.status)} className="text-xs">
          {adminBetService.getStatusLabel(record.status)}
        </Tag>
      )
    },
    {
      key: 'createdAt',
      title: 'Thời gian',
      width: 150,
      render: (_, record) => (
        <span className="text-sm text-gray-600">
          {adminBetService.formatDateTime(record.createdAt)}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: 150,
      align: 'center',
      render: (_, record) => {
        if (record.status !== 'PENDING') {
          return <span className="text-xs text-gray-400">Đã có kết quả</span>;
        }
        return (
          <div className="flex justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(record)}
              className="h-8 w-8 p-0"
              title="Chỉnh sửa số đã chọn"
            >
              <Edit className="h-4 w-4 text-green-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(record)}
              className="h-8 w-8 p-0"
              title="Xóa và hoàn tiền"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <Card>
      <CardContent className="p-0">
        <Table
          columns={columns}
          dataSource={bets}
          rowKey="id"
          loading={false}
          emptyText="Không có bet nào"
        />
        {pagination.totalPages > 1 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Hiển thị {bets.length} / {pagination.totalElements} bet
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page === 0}
                className="rounded-2xl"
              >
                ← Trước
              </Button>
              <span className="px-3 py-1 text-sm text-gray-700">
                Trang {pagination.page + 1} / {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages - 1}
                className="rounded-2xl"
              >
                Sau →
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BetManagementTable;

