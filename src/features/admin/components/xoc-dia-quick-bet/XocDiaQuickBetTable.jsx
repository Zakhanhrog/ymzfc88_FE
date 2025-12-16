import Table from '../../../../components/ui/Table';
import { Input } from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import Switch from '../../../../components/ui/Switch';
import Tag from '../../../../components/ui/Tag';
import { Card, CardContent } from '../../../../components/ui/Card';
import { Database, Loader2 } from 'lucide-react';

const layoutGroupOptions = [
  { value: 'TOP', label: 'Hàng trên' },
  { value: 'BOTTOM', label: 'Hàng dưới' },
];

const formatRatio = (value) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return value;
  const formatted = Number.isInteger(numeric)
    ? numeric.toFixed(0)
    : numeric.toFixed(2).replace(/\.?0+$/, '');
  return `1 : ${formatted}`;
};

const parsePatternString = (pattern) => {
  if (!pattern) return [];
  if (Array.isArray(pattern)) return pattern;
  return pattern
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const chunkPattern = (pattern, chunkSize = 4) => {
  const parsed = parsePatternString(pattern);
  if (!parsed?.length) {
    return [];
  }
  const chunks = [];
  for (let i = 0; i < parsed.length; i += chunkSize) {
    chunks.push(parsed.slice(i, i + chunkSize));
  }
  return chunks;
};

const XocDiaQuickBetTable = ({ 
  quickBets = [], 
  editMode = false, 
  editedQuickBets = {}, 
  loading = false,
  onFieldChange 
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

  if (quickBets.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Database className="h-12 w-12 mx-auto text-gray-400" />
          <p className="mt-4 text-gray-600">Chưa có cấu hình. Nhấn "Chỉnh sửa" để thêm quick bet đầu tiên cho game Xóc Đĩa.</p>
        </CardContent>
      </Card>
    );
  }

  const columns = [
    {
      key: 'code',
      title: 'Mã',
      width: 120,
      render: (_, record) => {
        if (editMode) {
          return (
            <Input
              value={editedQuickBets[record.id]?.code || ''}
              onChange={(e) => onFieldChange(record.id, 'code', e.target.value)}
              className="w-32"
            />
          );
        }
        return <span className="text-sm font-medium text-gray-900 uppercase">{record.code}</span>;
      }
    },
    {
      key: 'name',
      title: 'Tên hiển thị',
      render: (_, record) => {
        if (editMode) {
          return (
            <Input
              value={editedQuickBets[record.id]?.name || ''}
              onChange={(e) => onFieldChange(record.id, 'name', e.target.value)}
              className="w-40"
            />
          );
        }
        return (
          <div>
            <span className="text-sm font-medium text-gray-900">{record.name}</span>
            <div className="text-xs text-gray-500">{formatRatio(record.payoutMultiplier)}</div>
          </div>
        );
      }
    },
    {
      key: 'payoutMultiplier',
      title: 'Tỷ lệ (1 ăn)',
      width: 120,
      render: (_, record) => {
        if (editMode) {
          return (
            <Input
              type="number"
              min="0.01"
              step="0.01"
              value={editedQuickBets[record.id]?.payoutMultiplier ?? ''}
              onChange={(e) => onFieldChange(record.id, 'payoutMultiplier', e.target.value)}
              className="w-28"
            />
          );
        }
        return <span className="text-sm font-semibold text-green-600">{formatRatio(record.payoutMultiplier)}</span>;
      }
    },
    {
      key: 'feeRate',
      title: 'Tỷ lệ phế',
      width: 150,
      render: (_, record) => {
        if (editMode) {
          return (
            <Input
              type="number"
              min="0"
              max="1"
              step="0.0001"
              value={editedQuickBets[record.id]?.feeRate != null ? editedQuickBets[record.id].feeRate : ''}
              onChange={(e) => onFieldChange(record.id, 'feeRate', e.target.value === '' ? null : e.target.value)}
              placeholder="0.03 = 3%"
              className="w-28"
            />
          );
        }
        return (
          <span className="text-sm font-medium text-gray-900">
            {record.feeRate != null && record.feeRate > 0
              ? `${(record.feeRate * 100).toFixed(2)}%`
              : '—'}
          </span>
        );
      }
    },
    {
      key: 'layoutGroup',
      title: 'Nhóm hiển thị',
      width: 150,
      render: (_, record) => {
        if (editMode) {
          return (
            <Select
              value={editedQuickBets[record.id]?.layoutGroup || 'TOP'}
              onChange={(value) => onFieldChange(record.id, 'layoutGroup', value)}
              options={layoutGroupOptions}
              className="w-28"
              size="sm"
            />
          );
        }
        const groupLabel = record.layoutGroup === 'TOP' ? 'Hàng trên' : 'Hàng dưới';
        return (
          <Tag color="green" className="text-xs uppercase">
            {groupLabel}
          </Tag>
        );
      }
    },
    {
      key: 'displayOrder',
      title: 'Thứ tự',
      width: 100,
      render: (_, record) => {
        if (editMode) {
          return (
            <Input
              type="number"
              min="0"
              step="1"
              value={editedQuickBets[record.id]?.displayOrder ?? 0}
              onChange={(e) => onFieldChange(record.id, 'displayOrder', e.target.value)}
              className="w-20"
            />
          );
        }
        return <span className="text-sm font-medium text-gray-900">{record.displayOrder}</span>;
      }
    },
    {
      key: 'pattern',
      title: 'Pattern',
      width: 200,
      render: (_, record) => {
        if (editMode) {
          return (
            <Input
              type="text"
              value={editedQuickBets[record.id]?.pattern || ''}
              onChange={(e) => onFieldChange(record.id, 'pattern', e.target.value)}
              placeholder="Ví dụ: white,white,red,red"
              className="w-48"
            />
          );
        }
        const patternChunks = chunkPattern(record.pattern);
        if (patternChunks.length === 0) {
          return <span className="text-sm text-gray-400">—</span>;
        }
        return (
          <div className="flex flex-col items-center justify-center gap-1">
            {patternChunks.map((row, rowIndex) => (
              <div key={`pattern-row-${rowIndex}`} className="flex items-center justify-center gap-1">
                {row.map((color, index) => (
                  <span
                    key={`pattern-${rowIndex}-${index}`}
                    className={`h-3 w-3 rounded-full border-2 shadow-sm ${
                      color === 'white' ? 'bg-white border-black' : 'bg-[#e02020] border-black'
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>
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
              checked={Boolean(editedQuickBets[record.id]?.isActive)}
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
          dataSource={quickBets}
          rowKey="id"
          loading={false}
          emptyText="Chưa có cấu hình"
        />
      </CardContent>
    </Card>
  );
};

export default XocDiaQuickBetTable;

