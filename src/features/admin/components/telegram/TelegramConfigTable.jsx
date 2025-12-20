import { Edit, Trash2, Plus } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import Table from '../../../../components/ui/Table';

const TelegramConfigTable = ({ configs, onEdit, onDelete, onCreate }) => {
  const columns = [
    {
      title: 'Chat ID',
      dataIndex: 'chatId',
      key: 'chatId',
    },
    {
      title: 'Bot Token',
      dataIndex: 'botToken',
      key: 'botToken',
      render: (value) => (
        <span className="font-mono text-xs">{value?.substring(0, 15)}...</span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          enabled 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {enabled ? 'Hoạt động' : 'Tạm dừng'}
        </span>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (value) => value || '-',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value) => new Date(value).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(record)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Sửa
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (window.confirm('Bạn có chắc chắn muốn xóa cấu hình này?')) {
                onDelete(record.id);
              }
            }}
            className="text-red-600 hover:text-red-700 hover:border-red-300"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Danh sách cấu hình</h3>
        {onCreate && (
          <Button onClick={onCreate} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Thêm cấu hình
          </Button>
        )}
      </div>
      <div className="p-6">
        <Table
          columns={columns}
          dataSource={configs}
          rowKey="id"
          emptyText="Chưa có cấu hình nào"
        />
      </div>
    </div>
  );
};

export default TelegramConfigTable;

