import Table from '../../../../components/ui/Table';
import Tag from '../../../../components/ui/Tag';
import { Button } from '../../../../components/ui/Button';
import Pagination from '../../../../components/ui/Pagination';
import { Input } from '../../../../components/ui/Input';
import { Edit, Trash2, Eye, EyeOff, Search, Plus } from 'lucide-react';

const MarqueeNotificationTable = ({ 
  notifications = [], 
  loading = false,
  pagination = { current: 1, pageSize: 10, total: 0 },
  searchKeyword = '',
  onPageChange,
  onSearch,
  onEdit,
  onDelete,
  onToggleActive,
  onCreate
}) => {
  const columns = [
    {
      key: 'id',
      title: 'ID',
      width: 80,
      render: (_, record) => <span className="text-sm font-medium text-gray-900">#{record.id}</span>,
    },
    {
      key: 'content',
      title: 'Nội dung',
      render: (_, record) => (
        <div className="max-w-xs">
          <div 
            className="text-sm text-gray-900"
            dangerouslySetInnerHTML={{ __html: record.content }}
          />
        </div>
      ),
    },
    {
      key: 'isActive',
      title: 'Trạng thái',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Tag color={record.isActive ? 'success' : 'error'}>
          {record.isActive ? 'Hoạt động' : 'Tạm dừng'}
        </Tag>
      ),
    },
    {
      key: 'displayOrder',
      title: 'Thứ tự',
      width: 100,
      render: (_, record) => (
        <span className="text-sm text-gray-600">{record.displayOrder}</span>
      ),
    },
    {
      key: 'textColor',
      title: 'Màu chữ',
      width: 100,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <div 
            className="w-5 h-5 rounded border border-gray-300"
            style={{ backgroundColor: record.textColor }}
          />
          <span className="text-xs text-gray-600">{record.textColor}</span>
        </div>
      ),
    },
    {
      key: 'fontSize',
      title: 'Cỡ chữ',
      width: 80,
      render: (_, record) => (
        <span className="text-sm text-gray-600">{record.fontSize}px</span>
      ),
    },
    {
      key: 'speed',
      title: 'Tốc độ',
      width: 80,
      render: (_, record) => (
        <span className="text-sm text-gray-600">{record.speed}px/s</span>
      ),
    },
    {
      key: 'createdAt',
      title: 'Ngày tạo',
      width: 120,
      render: (_, record) => (
        <span className="text-sm text-gray-600">
          {new Date(record.createdAt).toLocaleDateString('vi-VN')}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(record)}
            className="h-8 w-8 rounded-2xl"
            title="Chỉnh sửa"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant={record.isActive ? 'outline' : 'default'}
            size="icon"
            onClick={() => onToggleActive(record.id)}
            className="h-8 w-8 rounded-2xl"
            title={record.isActive ? 'Tạm dừng' : 'Kích hoạt'}
          >
            {record.isActive ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => {
              if (window.confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
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
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900">Danh sách thông báo chạy</h3>
          <div className="flex items-center gap-2 flex-1 justify-end">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              type="text"
              value={searchKeyword}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Tìm kiếm theo nội dung..."
              className="max-w-xs"
            />
            </div>
            {onCreate && (
              <Button
                onClick={onCreate}
                className="gap-2 bg-[#4CAF50] text-white hover:bg-[#45a049] rounded-2xl"
              >
                <Plus className="h-4 w-4" />
                Thêm thông báo mới
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={notifications}
          loading={loading}
          emptyMessage={
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <Search className="h-12 w-12 mb-2" />
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
            showSizeChanger
            showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} thông báo`}
          />
        </div>
      )}
    </div>
  );
};

export default MarqueeNotificationTable;

