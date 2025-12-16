import Table from '../../../../components/ui/Table';
import { Input } from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import Switch from '../../../../components/ui/Switch';
import Tag from '../../../../components/ui/Tag';
import { Card, CardContent } from '../../../../components/ui/Card';
import { Database, Loader2 } from 'lucide-react';

const diceFaceIconMap = {
  1: '/matxucxac/1cham.svg',
  2: '/matxucxac/2cham.svg',
  3: '/matxucxac/3cham.svg',
  4: '/matxucxac/4cham.svg',
  5: '/matxucxac/5cham.svg',
  6: '/matxucxac/6cham.svg',
};

// Parse code to extract dice faces
const parseDiceFacesFromCode = (code, layoutGroup) => {
  if (!code) return null;
  
  const codeLower = code.toLowerCase();
  
  // SINGLE: sicbo_single_1 -> [1]
  if (layoutGroup === 'SINGLE') {
    const match = codeLower.match(/single[_\s](\d+)/);
    if (match) {
      const face = parseInt(match[1], 10);
      return [face];
    }
  }
  
  // COMBINATION: sicbo_combo_triple_1 -> [1, 1, 1]
  if (layoutGroup === 'COMBINATION') {
    const match = codeLower.match(/triple[_\s](\d+)/);
    if (match) {
      const face = parseInt(match[1], 10);
      return [face, face, face];
    }
  }
  
  // DICE_PAIR: sicbo_pair_1_2 -> [1, 2]
  if (layoutGroup === 'DICE_PAIR') {
    const match = codeLower.match(/pair[_\s](\d+)[_\s](\d+)/);
    if (match) {
      const face1 = parseInt(match[1], 10);
      const face2 = parseInt(match[2], 10);
      return [face1, face2];
    }
  }
  
  // DICE_PAIR_DOUBLE: sicbo_pair_double_1 -> [1, 1]
  if (layoutGroup === 'DICE_PAIR_DOUBLE') {
    const match = codeLower.match(/pair[_\s]double[_\s](\d+)/);
    if (match) {
      const face = parseInt(match[1], 10);
      return [face, face];
    }
  }
  
  return null;
};

const layoutGroupOptions = [
  { value: 'PRIMARY', label: 'Cược chính' },
  { value: 'COMBINATION', label: 'Bộ ba' },
  { value: 'TOTAL_TOP', label: 'Tổng (hàng trên)' },
  { value: 'TOTAL_BOTTOM', label: 'Tổng (hàng dưới)' },
  { value: 'SINGLE', label: 'Một mặt' },
  { value: 'DICE_PAIR', label: 'Cặp xúc xắc' },
  { value: 'DICE_PAIR_DOUBLE', label: 'Cặp đôi' },
];

const formatRatio = (value) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return `1 : ${value}`;
  const formatted = Number.isInteger(numeric)
    ? numeric.toFixed(0)
    : numeric.toFixed(2).replace(/\.?0+$/, '');
  return `1 : ${formatted}`;
};

const SicboQuickBetTable = ({ 
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
          <p className="mt-4 text-gray-600">Chưa có cấu hình. Nhấn "Chỉnh sửa" để thêm cấu hình quick bet đầu tiên.</p>
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
              className="w-24"
            />
          );
        }
        return <span className="text-sm font-semibold text-green-600">{formatRatio(record.payoutMultiplier)}</span>;
      }
    },
    {
      key: 'feeRate',
      title: 'Tỷ lệ phế (bàn 1)',
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
              value={editedQuickBets[record.id]?.layoutGroup || 'PRIMARY'}
              onChange={(value) => onFieldChange(record.id, 'layoutGroup', value)}
              options={layoutGroupOptions}
              className="w-36"
              size="sm"
            />
          );
        }
        const groupLabel = layoutGroupOptions.find(opt => opt.value === record.layoutGroup)?.label || record.layoutGroup;
        
        // Render icon based on layoutGroup
        const renderLayoutGroupIcon = () => {
          const faces = parseDiceFacesFromCode(record.code, record.layoutGroup);
          
          switch (record.layoutGroup) {
            case 'PRIMARY':
              return (
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-gray-700">T/X</span>
                </div>
              );
            case 'COMBINATION':
              if (faces && faces.length === 3) {
                return (
                  <div className="flex items-center gap-0.5">
                    {faces.map((face, idx) => (
                      <img
                        key={`combo-${idx}`}
                        src={diceFaceIconMap[face]}
                        alt={`Mặt ${face}`}
                        className="h-5 w-5 object-contain"
                        draggable={false}
                      />
                    ))}
                  </div>
                );
              }
              return (
                <div className="flex items-center gap-0.5">
                  {[1, 1, 1].map((face, idx) => (
                    <img
                      key={`combo-default-${idx}`}
                      src={diceFaceIconMap[face]}
                      alt={`Mặt ${face}`}
                      className="h-5 w-5 object-contain"
                      draggable={false}
                    />
                  ))}
                </div>
              );
            case 'SINGLE':
              if (faces && faces.length === 1) {
                return (
                  <div className="flex items-center gap-0.5">
                    <img
                      src={diceFaceIconMap[faces[0]]}
                      alt={`Một mặt ${faces[0]}`}
                      className="h-5 w-5 object-contain"
                      draggable={false}
                    />
                  </div>
                );
              }
              return (
                <div className="flex items-center gap-0.5">
                  <img
                    src={diceFaceIconMap[1]}
                    alt="Một mặt"
                    className="h-5 w-5 object-contain"
                    draggable={false}
                  />
                </div>
              );
            case 'DICE_PAIR':
              if (faces && faces.length === 2) {
                return (
                  <div className="flex items-center gap-0.5">
                    <img
                      src={diceFaceIconMap[faces[0]]}
                      alt="Cặp"
                      className="h-4 w-4 object-contain"
                      draggable={false}
                    />
                    <img
                      src={diceFaceIconMap[faces[1]]}
                      alt="Cặp"
                      className="h-4 w-4 object-contain"
                      draggable={false}
                    />
                  </div>
                );
              }
              return (
                <div className="flex items-center gap-0.5">
                  <img
                    src={diceFaceIconMap[1]}
                    alt="Cặp"
                    className="h-4 w-4 object-contain"
                    draggable={false}
                  />
                  <img
                    src={diceFaceIconMap[2]}
                    alt="Cặp"
                    className="h-4 w-4 object-contain"
                    draggable={false}
                  />
                </div>
              );
            case 'DICE_PAIR_DOUBLE':
              if (faces && faces.length === 2) {
                return (
                  <div className="flex items-center gap-0.5">
                    <img
                      src={diceFaceIconMap[faces[0]]}
                      alt="Cặp đôi"
                      className="h-4 w-4 object-contain"
                      draggable={false}
                    />
                    <img
                      src={diceFaceIconMap[faces[1]]}
                      alt="Cặp đôi"
                      className="h-4 w-4 object-contain"
                      draggable={false}
                    />
                  </div>
                );
              }
              return (
                <div className="flex items-center gap-0.5">
                  <img
                    src={diceFaceIconMap[1]}
                    alt="Cặp đôi"
                    className="h-4 w-4 object-contain"
                    draggable={false}
                  />
                  <img
                    src={diceFaceIconMap[1]}
                    alt="Cặp đôi"
                    className="h-4 w-4 object-contain"
                    draggable={false}
                  />
                </div>
              );
            case 'TOTAL_TOP':
            case 'TOTAL_BOTTOM':
              return (
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-gray-700">Σ</span>
                </div>
              );
            default:
              return (
                <Tag color="green" className="text-xs uppercase">
                  {groupLabel}
                </Tag>
              );
          }
        };

        return renderLayoutGroupIcon();
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

export default SicboQuickBetTable;

