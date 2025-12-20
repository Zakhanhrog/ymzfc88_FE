import Table from '../../../../components/ui/Table';
import Tag from '../../../../components/ui/Tag';
import { Button } from '../../../../components/ui/Button';
import Pagination from '../../../../components/ui/Pagination';
import { Trash2, AlertTriangle, Info, AlertCircle, User, Globe, Plus } from 'lucide-react';
import moment from 'moment';

const NotificationTable = ({ 
  notifications = [], 
  loading = false,
  pagination = { current: 1, pageSize: 20, total: 0 },
  onPageChange,
  onDelete,
  onCreate
}) => {
  const getPriorityTag = (priority, priorityLevel, priorityColor) => {
    const icons = {
      URGENT: <AlertCircle className="h-3.5 w-3.5" />,
      WARNING: <AlertTriangle className="h-3.5 w-3.5" />,
      INFO: <Info className="h-3.5 w-3.5" />,
    };

    const colors = {
      URGENT: 'error',
      WARNING: 'warning',
      INFO: 'success',
    };

    return (
      <Tag color={colors[priority] || 'default'} className="flex items-center gap-1">
        {icons[priority]}
        {priorityLevel === 1 && 'Khẩn cấp'}
        {priorityLevel === 2 && 'Cảnh báo'}
        {priorityLevel === 3 && 'Thông thường'}
      </Tag>
    );
  };

  const columns = [
    {
      key: 'id',
      title: 'ID',
      width: 70,
      render: (_, record) => <span className="text-sm font-medium text-gray-900">#{record.id}</span>,
    },
    {
      key: 'title',
      title: 'Tiêu đề',
      width: 250,
      render: (_, record) => <strong className="text-sm text-gray-900">{record.title}</strong>,
    },
    {
      key: 'priority',
      title: 'Mức độ',
      width: 130,
      render: (_, record) => getPriorityTag(record.priority, record.priorityLevel, record.priorityColor),
    },
    {
      key: 'scope',
      title: 'Phạm vi',
      width: 150,
      render: (_, record) => (
        record.targetUserId ? (
          <Tag color="blue" className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            {record.targetUsername}
          </Tag>
        ) : (
          <Tag color="success" className="flex items-center gap-1">
            <Globe className="h-3.5 w-3.5" />
            Toàn hệ thống
          </Tag>
        )
      ),
    },
    {
      key: 'type',
      title: 'Loại',
      width: 120,
      render: (_, record) => <Tag>{record.type}</Tag>,
    },
    {
      key: 'createdByUsername',
      title: 'Người tạo',
      width: 120,
      render: (_, record) => <span className="text-sm text-gray-600">{record.createdByUsername || '-'}</span>,
    },
    {
      key: 'createdAt',
      title: 'Thời gian tạo',
      width: 160,
      render: (_, record) => (
        <span className="text-sm text-gray-600">
          {moment(record.createdAt).format('DD/MM/YYYY HH:mm')}
        </span>
      ),
    },
    {
      key: 'expiresAt',
      title: 'Hết hạn',
      width: 160,
      render: (_, record) => (
        <span className="text-sm text-gray-600">
          {record.expiresAt ? moment(record.expiresAt).format('DD/MM/YYYY HH:mm') : 'Không'}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <div className="flex justify-center">
          <Button
            variant="destructive"
            size="icon"
            onClick={() => {
              if (window.confirm('Xác nhận xóa thông báo này?')) {
                onDelete(record.id);
              }
            }}
            className="h-8 w-8 rounded-2xl"
            title="Xóa"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden w-full">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Danh sách thông báo</h3>
        {onCreate && (
          <Button
            onClick={onCreate}
            className="gap-2 bg-[#4CAF50] text-white hover:bg-[#45a049] rounded-2xl"
          >
            <Plus className="h-4 w-4" />
            Tạo thông báo mới
          </Button>
        )}
      </div>
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={notifications}
          loading={loading}
          emptyMessage={
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <Info className="h-12 w-12 mb-2" />
              <span>Chưa có thông báo nào</span>
            </div>
          }
        />
      </div>
      
      {!loading && pagination.total > 0 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={onPageChange}
            showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} thông báo`}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationTable;

