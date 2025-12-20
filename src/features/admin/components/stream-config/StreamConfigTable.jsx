import Table from '../../../../components/ui/Table';
import Tag from '../../../../components/ui/Tag';
import { Button } from '../../../../components/ui/Button';
import { Edit, Trash2, Database, Copy, Check, Plus } from 'lucide-react';
import { useState } from 'react';

const StreamConfigTable = ({ 
  configs = [], 
  loading = false,
  gameTypes = [],
  onEdit,
  onDelete,
  onCreate
}) => {
  const [copiedUrl, setCopiedUrl] = useState(null);

  const handleCopyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const columns = [
    {
      key: 'id',
      title: 'ID',
      width: 80,
      render: (_, record) => <span className="text-sm font-medium text-gray-900">#{record.id}</span>,
    },
    {
      key: 'gameType',
      title: 'Game',
      render: (_, record) => {
        const game = gameTypes.find(g => g.value === record.gameType);
        return (
          <Tag color={record.gameType === 'XOC_DIA' ? 'blue' : 'green'}>
            {game?.label || record.gameType}
          </Tag>
        );
      },
    },
    {
      key: 'tableNumber',
      title: 'Bàn số',
      render: (_, record) => (
        <span className="text-sm text-gray-900">
          {record.tableNumber ? `Bàn ${record.tableNumber}` : '-'}
        </span>
      ),
    },
    {
      key: 'streamKey',
      title: 'Stream Key',
      render: (_, record) => (
        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
          {record.streamKey}
        </code>
      ),
    },
    {
      key: 'streamUrl',
      title: 'Stream URL',
      render: (_, record) => {
        const url = `https://tathiet168.com/live/${record.streamKey}/index.m3u8`;
        const isCopied = copiedUrl === url;
        return (
          <div className="flex items-center gap-2 max-w-xs">
            <code className="flex-1 bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-800 truncate">
              {url}
            </code>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleCopyUrl(url)}
              className="h-7 w-7 rounded-lg flex-shrink-0"
              title="Copy URL"
            >
              {isCopied ? (
                <Check className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        );
      },
    },
    {
      key: 'isActive',
      title: 'Trạng thái',
      align: 'center',
      render: (_, record) => (
        <Tag color={record.isActive ? 'success' : 'error'}>
          {record.isActive ? 'Hoạt động' : 'Tạm dừng'}
        </Tag>
      ),
    },
    {
      key: 'description',
      title: 'Mô tả',
      render: (_, record) => (
        <span className="text-sm text-gray-600">
          {record.description || '-'}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Thao tác',
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
            variant="destructive"
            size="icon"
            onClick={() => {
              if (window.confirm('Bạn có chắc muốn xóa stream config này?')) {
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
        <h3 className="text-lg font-semibold text-gray-900">Danh sách Stream Config</h3>
        {onCreate && (
          <Button
            onClick={onCreate}
            className="gap-2 bg-[#4CAF50] text-white hover:bg-[#45a049] rounded-2xl"
          >
            <Plus className="h-4 w-4" />
            Thêm Stream Config
          </Button>
        )}
      </div>
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={configs}
          loading={loading}
          emptyMessage={
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <Database className="h-12 w-12 mb-2" />
              <span>Chưa có stream config nào</span>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default StreamConfigTable;

