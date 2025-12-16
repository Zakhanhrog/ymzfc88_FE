import Table from '../../../../components/ui/Table';
import { Input } from '../../../../components/ui/Input';
import Switch from '../../../../components/ui/Switch';
import Tag from '../../../../components/ui/Tag';
import { Card, CardContent } from '../../../../components/ui/Card';
import { Database, Loader2 } from 'lucide-react';

const BettingOddsTable = ({ 
  bettingOdds = [], 
  editMode = false, 
  editedData = {}, 
  loading = false,
  onFieldChange 
}) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

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

  if (bettingOdds.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Database className="h-12 w-12 mx-auto text-gray-400" />
          <p className="mt-4 text-gray-600">Chưa có dữ liệu tỷ lệ cược. Vui lòng tạo mới từng loại cược.</p>
        </CardContent>
      </Card>
    );
  }

  const columns = [
    {
      key: 'betType',
      title: 'Loại cược',
      width: 150,
      render: (_, record) => (
        <Tag color="default" className="text-xs font-mono">
          {record.betType}
        </Tag>
      )
    },
    {
      key: 'betName',
      title: 'Tên',
      render: (_, record) => {
        if (editMode) {
          return (
            <Input
              value={editedData[record.id]?.betName || ''}
              onChange={(e) => onFieldChange(record.id, 'betName', e.target.value)}
              className="w-full"
            />
          );
        }
        return <span className="text-sm font-medium text-gray-900">{record.betName}</span>;
      }
    },
    {
      key: 'description',
      title: 'Mô tả',
      render: (_, record) => {
        if (editMode) {
          return (
            <Input
              value={editedData[record.id]?.description || ''}
              onChange={(e) => onFieldChange(record.id, 'description', e.target.value)}
              className="w-full"
            />
          );
        }
        return <span className="text-sm text-gray-600">{record.description}</span>;
      }
    },
    {
      key: 'odds',
      title: 'Tỷ lệ (1 ăn)',
      width: 120,
      render: (_, record) => {
        if (editMode) {
          return (
            <Input
              type="number"
              min="1"
              value={editedData[record.id]?.odds || ''}
              onChange={(e) => onFieldChange(record.id, 'odds', e.target.value)}
              className="w-24"
            />
          );
        }
        return <span className="text-sm font-semibold text-green-600">{record.odds}</span>;
      }
    },
    {
      key: 'pricePerPoint',
      title: 'Đơn giá/điểm',
      width: 150,
      render: (_, record) => {
        if (editMode) {
          return (
            <Input
              type="number"
              min="1000"
              step="1000"
              value={editedData[record.id]?.pricePerPoint || ''}
              onChange={(e) => onFieldChange(record.id, 'pricePerPoint', e.target.value)}
              className="w-32"
            />
          );
        }
        return (
          <span className="text-sm font-medium text-gray-900">
            {formatCurrency(record.pricePerPoint)}
          </span>
        );
      }
    },
    {
      key: 'isActive',
      title: 'Trạng thái',
      width: 120,
      render: (_, record) => {
        if (editMode) {
          return (
            <Switch
              checked={editedData[record.id]?.isActive || false}
              onChange={(checked) => onFieldChange(record.id, 'isActive', checked)}
            />
          );
        }
        return (
          <Tag color={record.isActive ? 'green' : 'gray'} className="text-xs">
            {record.isActive ? 'Active' : 'Inactive'}
          </Tag>
        );
      }
    }
  ];

  return (
    <Card>
      <CardContent className="p-0">
        <Table
          columns={columns}
          dataSource={bettingOdds}
          rowKey="id"
          loading={false}
          emptyText="Chưa có dữ liệu tỷ lệ cược"
        />
      </CardContent>
    </Card>
  );
};

export default BettingOddsTable;

