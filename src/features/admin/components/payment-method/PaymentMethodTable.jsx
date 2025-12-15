import Table from '../../../../components/ui/Table';
import { Button } from '../../../../components/ui/Button';
import Pagination from '../../../../components/ui/Pagination';
import Tag from '../../../../components/ui/Tag';
import Switch from '../../../../components/ui/Switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../components/ui/Tooltip';
import { Eye, Edit, Trash2, Clock } from 'lucide-react';

const PaymentMethodTable = ({
  paymentMethods,
  paymentTypes,
  loading,
  onViewDetail,
  onEdit,
  onDelete,
  onToggleStatus,
  currentPage,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange
}) => {
  const getPaymentTypeConfig = (type) => {
    return paymentTypes.find(pt => pt.value === type) || { label: type, icon: '💳', color: 'default' };
  };

  const columns = [
    {
      key: 'type',
      title: 'Loại',
      width: 120,
      render: (_, record) => {
        const config = getPaymentTypeConfig(record.type);
        return (
          <Tag color={config.color} className="text-xs">
            {config.label}
          </Tag>
        );
      }
    },
    {
      key: 'info',
      title: 'Thông tin',
      render: (_, record) => (
        <div>
          <div className="font-medium text-sm">{record.name}</div>
          <div className="text-gray-500 text-xs">
            {record.accountNumber} - {record.accountName}
          </div>
          {record.bankCode && (
            <div className="text-gray-400 text-xs">Mã ngân hàng: {record.bankCode}</div>
          )}
        </div>
      )
    },
    {
      key: 'limits',
      title: 'Giới hạn',
      width: 150,
      render: (_, record) => (
        <div className="text-sm">
          <div>Min: {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }).format(record.minAmount)}</div>
          <div>Max: {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }).format(record.maxAmount)}</div>
        </div>
      )
    },
    {
      key: 'fees',
      title: 'Phí',
      width: 120,
      render: (_, record) => (
        <div className="text-sm">
          {record.feePercent > 0 && (
            <div className="text-orange-600">{record.feePercent}%</div>
          )}
          {record.feeFixed > 0 && (
            <div className="text-blue-600">
              +{new Intl.NumberFormat('vi-VN').format(record.feeFixed)} VNĐ
            </div>
          )}
          {record.feePercent === 0 && record.feeFixed === 0 && (
            <div className="text-green-600">Miễn phí</div>
          )}
        </div>
      )
    },
    {
      key: 'processingTime',
      title: 'Thời gian xử lý',
      width: 120,
      render: (_, record) => (
        <div className="text-gray-600 text-sm flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {record.processingTime || 'Ngay lập tức'}
        </div>
      )
    },
    {
      key: 'isActive',
      title: 'Trạng thái',
      width: 100,
      render: (_, record) => (
        <Switch
          checked={record.isActive}
          onChange={() => onToggleStatus(record.id)}
        />
      )
    },
    {
      key: 'displayOrder',
      title: 'Thứ tự',
      width: 80,
      className: 'text-center',
      render: (_, record) => (
        <div className="text-center font-medium text-sm">{record.displayOrder}</div>
      )
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: 150,
      render: (_, record) => (
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetail(record)}
                  className="gap-1"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Xem chi tiết</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(record)}
                  className="gap-1"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Chỉnh sửa</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (window.confirm('Bạn có chắc muốn xóa phương thức thanh toán này?')) {
                      onDelete(record.id);
                    }
                  }}
                  className="gap-1 text-red-600 border-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Xóa</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl overflow-hidden border border-gray-200">
        <Table columns={columns} dataSource={paymentMethods} loading={loading} />
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

export default PaymentMethodTable;

