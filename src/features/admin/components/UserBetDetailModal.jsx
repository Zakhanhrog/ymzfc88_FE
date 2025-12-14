import { useMemo } from 'react';
import dayjs from 'dayjs';
import { formatPointsDisplay, formatPoints } from '../../../utils/helpers';
import Modal from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import Table from '../../../components/ui/Table';
import Pagination from '../../../components/ui/Pagination';
import Select from '../../../components/ui/Select';
import StatCard from '../analytics/components/StatCard';
import StatusTag from './StatusTag';
import { defaultSicboQuickBetConfigs } from '../../casino/pages/games/sicboConfig';
import { defaultQuickBetConfigs as xocDiaConfigs } from '../../casino/pages/games/xocDiaConfig';

// Format điểm không có đơn vị "điểm"
const formatPointsOnly = (points) => {
  if (!points && points !== 0) return '0';
  const formatter = new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: true
  });
  return formatter.format(Number(points ?? 0));
};

// Format VND sang điểm nhưng không có đơn vị "điểm"
const formatPointsFromVND = (amount) => {
  if (!amount && amount !== 0) return '0';
  const points = Number(amount) / 1000;
  const formatter = new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: true
  });
  return formatter.format(points);
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

// Function to render result code (e.g., "1-2-3" or "2-2-2")
const renderResultCode = (resultCode) => {
  if (!resultCode) return <span className="text-sm text-gray-500">—</span>;
  
  // Check if it's a dice result (format: "1-2-3" or "2-2-2")
  const diceMatch = resultCode.match(/^(\d+)-(\d+)-(\d+)$/);
  if (diceMatch) {
    const dice1 = parseInt(diceMatch[1]);
    const dice2 = parseInt(diceMatch[2]);
    const dice3 = parseInt(diceMatch[3]);
    
    return (
      <div className="flex items-center gap-1">
        {[dice1, dice2, dice3].map((face, idx) => (
          <img
            key={idx}
            src={diceFaceIconMap[face]}
            alt={`Mặt ${face}`}
            className="h-5 w-5 object-contain"
            draggable={false}
          />
        ))}
      </div>
    );
  }
  
  // Fallback to text
  return <span className="text-sm text-gray-900">{resultCode}</span>;
};

const DEFAULT_PAGE_SIZE = 20;
const DETAIL_PAGE_SIZE_OPTIONS = [10, 20, 50];

const gameTypeOptions = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Xổ số', value: 'lottery' },
  { label: 'Tài Xỉu', value: 'sicbo' },
  { label: 'Xóc Đĩa', value: 'xocdia' }
];

const UserBetDetailModal = ({
  open,
  onClose,
  selectedUser,
  detailData = [],
  detailLoading = false,
  detailMeta = { page: 1, size: DEFAULT_PAGE_SIZE, total: 0 },
  detailSummary = null,
  detailFilters = { gameType: 'all' },
  onFilterChange,
  onPaginationChange,
}) => {
  const detailColumns = useMemo(
    () => [
      {
        title: 'Thời gian',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (value) => (
          <span className="text-sm text-gray-900">
            {value ? dayjs(value).format('DD/MM/YYYY HH:mm:ss') : '--'}
          </span>
        ),
        width: 180
      },
      {
        title: 'Game',
        dataIndex: 'gameType',
        key: 'gameType',
        render: (value) => {
          let gameName = value || '--';
          switch ((value || '').toUpperCase()) {
            case 'SICBO':
              gameName = 'Tài Xỉu';
              break;
            case 'XOCDIA':
              gameName = 'Xóc Đĩa';
              break;
            case 'LOTTERY':
              gameName = 'Xổ số';
              break;
          }
          return <span className="text-sm text-gray-900">{gameName}</span>;
        },
        width: 110
      },
      {
        title: 'Mã cược',
        dataIndex: 'betCode',
        key: 'betCode',
        width: 160,
        render: (value) => renderBetCode(value)
      },
      {
        title: 'Mô tả',
        dataIndex: 'description',
        key: 'description',
        render: (value) => (
          <span className="text-sm text-gray-900 truncate block" title={value}>
            {value || '--'}
          </span>
        )
      },
      {
        title: 'Tiền cược',
        dataIndex: 'stakeAmount',
        key: 'stakeAmount',
        width: 140,
        className: 'text-right',
        render: (value) => (
          <span className="text-sm text-gray-900">{formatPointsOnly(Number(value ?? 0))}</span>
        )
      },
      {
        title: 'Tiền thắng',
        dataIndex: 'winAmount',
        key: 'winAmount',
        width: 140,
        className: 'text-right',
        render: (value) => (
          <span className="text-sm text-gray-900">{formatPointsOnly(Number(value ?? 0))}</span>
        )
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        width: 120,
        render: (value) => <StatusTag status={value} />
      },
      {
        title: 'Kết quả',
        dataIndex: 'resultCode',
        key: 'resultCode',
        width: 150,
        render: (value) => renderResultCode(value)
      }
    ],
    []
  );

  const detailSummaryCards = useMemo(() => {
    if (!detailSummary) {
      return null;
    }
    const totalStake = Number(detailSummary.totalStakeAmount ?? 0);
    const totalWin = Number(detailSummary.totalWinAmount ?? 0);
    const totalLoss = Number(detailSummary.totalLossAmount ?? 0);
    const totalDeposit = Number(detailSummary.totalDepositAmount ?? 0);
    const totalWithdraw = Number(detailSummary.totalWithdrawAmount ?? 0);
    const totalRefund = Number(detailSummary.totalRefundAmount ?? 0);
    const totalDailyLossRefund = Number(detailSummary.totalDailyLossRefundAmount ?? 0);
    const totalPromotionalMoney = Number(detailSummary.totalPromotionalMoneyAmount ?? 0);
    const net = totalWin - totalLoss;
    
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
        <StatCard
          title="Tổng nạp"
          value={formatPointsFromVND(totalDeposit)}
          valueColor="text-white"
          bgColor="bg-blue-600"
          textColor="text-white"
        />
        <StatCard
          title="Tổng rút"
          value={formatPointsFromVND(totalWithdraw)}
          valueColor="text-white"
          bgColor="bg-indigo-600"
          textColor="text-white"
        />
        <StatCard
          title="Tổng cược"
          value={formatPointsOnly(totalStake)}
          valueColor="text-white"
          bgColor="bg-purple-600"
          textColor="text-white"
        />
        <StatCard
          title="Tổng thắng"
          value={formatPointsOnly(totalWin)}
          valueColor="text-white"
          bgColor="bg-green-600"
          textColor="text-white"
        />
        <StatCard
          title="Tổng thua"
          value={formatPointsOnly(totalLoss)}
          valueColor="text-white"
          bgColor="bg-red-600"
          textColor="text-white"
        />
        <StatCard
          title="Thắng/Thua"
          value={formatPointsOnly(net)}
          valueColor="text-white"
          bgColor={net >= 0 ? "bg-emerald-600" : "bg-orange-600"}
          textColor="text-white"
        />
        <StatCard
          title="Hoàn trả"
          value={formatPointsOnly(totalRefund)}
          valueColor="text-white"
          bgColor="bg-yellow-600"
          textColor="text-white"
        />
        <StatCard
          title="Hoàn thua theo ngày"
          value={formatPointsOnly(totalDailyLossRefund)}
          valueColor="text-white"
          bgColor="bg-pink-600"
          textColor="text-white"
        />
        <StatCard
          title="Khuyến mại"
          value={formatPointsOnly(totalPromotionalMoney)}
          valueColor="text-white"
          bgColor="bg-teal-600"
          textColor="text-white"
        />
      </div>
    );
  }, [detailSummary]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={selectedUser ? `Chi tiết cược - ${selectedUser.username}` : 'Chi tiết cược người dùng'}
      width="max-w-5xl"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      }
    >
      <div className="space-y-4 max-h-[calc(90vh-200px)] overflow-y-auto">
        <div className="flex justify-end">
          <Select
            value={detailFilters.gameType}
            onChange={(value) => {
              onFilterChange?.({ gameType: value });
            }}
            options={gameTypeOptions}
            className="w-[180px]"
          />
        </div>

        {detailSummaryCards}

        <div className="overflow-x-auto">
          <Table
            columns={detailColumns}
            dataSource={detailData}
            loading={detailLoading}
            rowKey={(record, index) => `${record.id || index}-${record.gameType}`}
          />
        </div>

        {detailMeta.total > 0 && (
          <div className="flex justify-end">
            <Pagination
              current={detailMeta.page}
              pageSize={detailMeta.size}
              total={detailMeta.total}
              onChange={(page, pageSize) => {
                onPaginationChange?.(page, pageSize);
              }}
              onShowSizeChange={(page, pageSize) => {
                onPaginationChange?.(page, pageSize);
              }}
              showSizeChanger
              pageSizeOptions={DETAIL_PAGE_SIZE_OPTIONS.map(String)}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default UserBetDetailModal;

