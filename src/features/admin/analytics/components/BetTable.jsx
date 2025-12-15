import Table from '../../../../components/ui/Table';
import Pagination from '../../../../components/ui/Pagination';
import dayjs from 'dayjs';
import { defaultSicboQuickBetConfigs } from '../../../casino/pages/games/sicboConfig';
import { defaultQuickBetConfigs as xocDiaConfigs } from '../../../casino/pages/games/xocDiaConfig';

const formatPointsDisplay = (points) => {
  if (!points && points !== 0) return '0';
  const pointFormatter = new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return pointFormatter.format(Number(points ?? 0));
};

const formatDateTime = (value) => {
  if (!value) return '';
  return dayjs(value).format('HH:mm DD/MM/YYYY');
};

// Status tag component với style giống StatCard
const StatusTag = ({ status }) => {
  const statusConfig = {
    PENDING: {
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-200',
    },
    WON: {
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
    },
    LOST: {
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
    },
    CANCELLED: {
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200',
    },
    REFUNDED: {
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
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

const BET_STATUS_COLORS = {
  PENDING: 'default',
  WON: 'success',
  LOST: 'error',
  CANCELLED: 'warning',
  REFUNDED: 'default',
};

// Map dice faces to icons
const diceFaceIconMap = {
  1: '/matxucxac/1cham.svg',
  2: '/matxucxac/2cham.svg',
  3: '/matxucxac/3cham.svg',
  4: '/matxucxac/4cham.svg',
  5: '/matxucxac/5cham.svg',
  6: '/matxucxac/6cham.svg',
};

// Create map of bet codes to display info
const betCodeDisplayMap = {};
defaultSicboQuickBetConfigs.forEach((config) => {
  betCodeDisplayMap[config.code] = config.name;
});
// Add Xoc Dia bet codes
const xocDiaBetCodeMap = {};
xocDiaConfigs.forEach((config) => {
  xocDiaBetCodeMap[config.code] = config.label;
});

// Function to render bet code with visual representation
const renderBetCode = (betCode) => {
  if (!betCode) return <span className="text-sm text-gray-500">—</span>;

  // Check if it's in the config map first
  if (betCodeDisplayMap[betCode]) {
    const displayName = betCodeDisplayMap[betCode];
    
    // Primary bets (Tài/Xỉu) - just show text with color
    if (betCode === 'sicbo_primary_big') {
      return (
        <span className="text-sm font-bold text-red-600">Tài</span>
      );
    }
    if (betCode === 'sicbo_primary_small') {
      return (
        <span className="text-sm font-bold text-green-700">Xỉu</span>
      );
    }
    
    // Parity bets
    if (betCode === 'sicbo_parity_even') {
      return <span className="text-sm font-semibold text-blue-600">Chẵn</span>;
    }
    if (betCode === 'sicbo_parity_odd') {
      return <span className="text-sm font-semibold text-orange-600">Lẻ</span>;
    }
    
    // Total bets - show number
    const totalMatch = betCode.match(/sicbo_total_(\d+)/);
    if (totalMatch) {
      return <span className="text-sm font-semibold text-purple-600">Tổng {totalMatch[1]}</span>;
    }
    
    // Triple combo - show 3 dice faces
    const tripleMatch = betCode.match(/sicbo_combo_triple_(\d+)/);
    if (tripleMatch) {
      const face = parseInt(tripleMatch[1]);
      return (
        <div className="flex items-center gap-1">
          {[face, face, face].map((f, idx) => (
            <img
              key={idx}
              src={diceFaceIconMap[f]}
              alt={`Mặt ${f}`}
              className="h-5 w-5 object-contain"
              draggable={false}
            />
          ))}
        </div>
      );
    }
    
    // Single face - show 1 dice face
    const singleMatch = betCode.match(/sicbo_single_(\d+)/);
    if (singleMatch) {
      const face = parseInt(singleMatch[1]);
      return (
        <div className="flex items-center">
          <img
            src={diceFaceIconMap[face]}
            alt={`Mặt ${face}`}
            className="h-5 w-5 object-contain"
            draggable={false}
          />
        </div>
      );
    }
    
    // Pair (different faces) - show 2 dice faces
    const pairMatch = betCode.match(/sicbo_pair_(\d+)_(\d+)/);
    if (pairMatch) {
      const face1 = parseInt(pairMatch[1]);
      const face2 = parseInt(pairMatch[2]);
      return (
        <div className="flex items-center gap-1">
          <img
            src={diceFaceIconMap[face1]}
            alt={`Mặt ${face1}`}
            className="h-5 w-5 object-contain"
            draggable={false}
          />
          <img
            src={diceFaceIconMap[face2]}
            alt={`Mặt ${face2}`}
            className="h-5 w-5 object-contain"
            draggable={false}
          />
        </div>
      );
    }
    
    // Pair double (same faces) - show 2 dice faces of same number
    const pairDoubleMatch = betCode.match(/sicbo_pair_double_(\d+)/);
    if (pairDoubleMatch) {
      const face = parseInt(pairDoubleMatch[1]);
      return (
        <div className="flex items-center gap-1">
          <img
            src={diceFaceIconMap[face]}
            alt={`Mặt ${face}`}
            className="h-5 w-5 object-contain"
            draggable={false}
          />
          <img
            src={diceFaceIconMap[face]}
            alt={`Mặt ${face}`}
            className="h-5 w-5 object-contain"
            draggable={false}
          />
        </div>
      );
    }
    
    // Fallback to display name if available
    return <span className="text-sm font-medium text-gray-700">{displayName}</span>;
  }

  // Xoc Dia bet codes
  let xocDiaCode = betCode;
  if (betCode.startsWith('xocdia_')) {
    xocDiaCode = betCode.replace('xocdia_', '');
  }
  if (xocDiaBetCodeMap[xocDiaCode]) {
    const label = xocDiaBetCodeMap[xocDiaCode];
    // Special styling for common xocdia bets
    if (xocDiaCode === 'tai') {
      return <span className="text-sm font-bold text-red-600">Tài</span>;
    }
    if (xocDiaCode === 'xiu') {
      return <span className="text-sm font-bold text-green-700">Xỉu</span>;
    }
    if (xocDiaCode === 'chan') {
      return <span className="text-sm font-semibold text-blue-600">Chẵn</span>;
    }
    if (xocDiaCode === 'le') {
      return <span className="text-sm font-semibold text-orange-600">Lẻ</span>;
    }
    return <span className="text-sm font-medium text-indigo-600">{label}</span>;
  }

  // Lottery bet codes
  if (betCode.startsWith('lottery_')) {
    const lotteryCode = betCode.replace('lottery_', '').replace(/_/g, ' ');
    return <span className="text-sm font-medium text-purple-600">{lotteryCode}</span>;
  }
  
  // Ultimate fallback
  return <span className="text-sm text-gray-600 font-mono">{betCode}</span>;
};

const BetTable = ({ data, loading, pagination, onPaginationChange }) => {
  const numberFormatter = new Intl.NumberFormat('vi-VN');

  const columns = [
    {
      key: 'id',
      dataIndex: 'id',
      title: 'Mã',
      width: 90,
      render: (value) => (
        <span className="text-sm font-medium text-gray-900">#{value}</span>
      ),
    },
    {
      key: 'gameType',
      dataIndex: 'gameType',
      title: 'Game',
      width: 110,
      render: (value) => {
        const displayName = value === 'SICBO' ? 'TÀI XỈU' : value;
        return (
          <span className="text-sm text-gray-900">{displayName}</span>
        );
      },
    },
    {
      key: 'username',
      dataIndex: 'username',
      title: 'Người chơi',
      width: 140,
      render: (value) => (
        <span className="text-sm text-gray-900">{value}</span>
      ),
    },
    {
      key: 'betCode',
      dataIndex: 'betCode',
      title: 'Mã cược',
      width: 160,
      render: (value) => renderBetCode(value),
    },
    {
      key: 'tableNumber',
      dataIndex: 'tableNumber',
      title: 'Bàn',
      width: 80,
      render: (value) => {
        if (value == null) {
          return <span className="text-sm text-gray-900 text-center">—</span>;
        }
        const displayName = value === 1 ? 'T.PHẾ' : value === 2 ? 'T.BÃO' : `Bàn ${value}`;
        return (
          <span className="text-sm text-gray-900 text-center">{displayName}</span>
        );
      },
      className: 'text-center',
    },
    {
      key: 'stake',
      dataIndex: 'stake',
      title: 'Tiền cược',
      width: 140,
      render: (value) => (
        <span className="text-sm font-medium text-gray-900">{formatPointsDisplay(value ?? 0)}</span>
      ),
      className: 'text-right',
    },
    {
      key: 'feeAmount',
      dataIndex: 'feeAmount',
      title: 'Phế',
      width: 110,
      render: (value) => {
        const fee = Number(value ?? 0);
        return fee > 0 ? (
          <span className="text-sm font-medium text-purple-600">{formatPointsDisplay(fee)}</span>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        );
      },
      className: 'text-right',
    },
    {
      key: 'baoAmount',
      dataIndex: 'baoAmount',
      title: 'Bão',
      width: 110,
      render: (value) => {
        const bao = Number(value ?? 0);
        return bao > 0 ? (
          <span className="text-sm font-medium text-red-600">{formatPointsDisplay(bao)}</span>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        );
      },
      className: 'text-right',
    },
    {
      key: 'winLoss',
      dataIndex: 'winAmount',
      title: 'Thắng/Thua',
      width: 140,
      render: (value, record) => {
        if (record?.status === 'REFUNDED') {
          return <span className="text-sm font-medium text-gray-500">{formatPointsDisplay(0)}</span>;
        }
        
        const winAmount = Number(record?.winAmount ?? 0);
        const stake = Number(record?.stake ?? 0);
        const winLoss = winAmount - stake;
        
        if (winLoss > 0) {
          return (
            <span className="text-sm font-semibold text-green-600">
              +{formatPointsDisplay(winLoss)}
            </span>
          );
        } else if (winLoss < 0) {
          return (
            <span className="text-sm font-semibold text-red-600">
              {formatPointsDisplay(winLoss)}
            </span>
          );
        } else {
          return <span className="text-sm font-medium text-gray-500">{formatPointsDisplay(0)}</span>;
        }
      },
      className: 'text-right',
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: 'Trạng thái',
      width: 120,
      render: (value) => <StatusTag status={value} />,
    },
    {
      key: 'createdAt',
      dataIndex: 'createdAt',
      title: 'Thời gian tạo',
      width: 180,
      render: (value, record) => {
        const createdAt = value ? dayjs(value) : null;
        const settledAt = record?.settledAt ? dayjs(record.settledAt) : null;
        
        let timeDiffTag = null;
        if (createdAt && settledAt && settledAt.isAfter(createdAt)) {
          const diffSeconds = settledAt.diff(createdAt, 'second');
          if (diffSeconds > 0) {
            timeDiffTag = (
              <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                +{diffSeconds}s
              </span>
            );
          }
        }
        
        return (
          <div className="flex items-center">
        <span className="text-sm text-gray-700">{formatDateTime(value)}</span>
            {timeDiffTag}
          </div>
        );
      },
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden w-full">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Báo cáo cược</h3>
      </div>
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            rowKey={(record) => `${record.gameType}-${record.id}`}
            emptyText="Không có dữ liệu cược"
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

export default BetTable;
