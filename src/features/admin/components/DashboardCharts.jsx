import {
  ComposedChart,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Area,
  Line
} from 'recharts';
import dayjs from 'dayjs';
import { TrendingUp, ArrowLeftRight, Zap, FileText, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import Table from '../../../components/ui/Table';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend 
} from '../../../components/ui/chart';
import { defaultSicboQuickBetConfigs } from '../../casino/pages/games/sicboConfig';
import { defaultQuickBetConfigs as xocDiaConfigs } from '../../casino/pages/games/xocDiaConfig';

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0
});

const numberFormatter = new Intl.NumberFormat('vi-VN');

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

// Function to render bet code with visual representation (same as BetTable)
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

const DashboardCharts = ({ chartData = [], activities = [], recentUsers = [] }) => {
  const formattedChartData = chartData.map((item) => ({
    ...item,
    dateLabel: dayjs(item.date).format('DD/MM'),
    revenue: Number(item.revenue ?? 0),
    transactions: Number(item.transactions ?? 0),
    transactionAmount: Number(item.transactionAmount ?? 0),
    totalBets: Number(item.totalBets ?? 0),
    winProfit: Number(item.winProfit ?? 0),
    lostStake: Number(item.lostStake ?? 0),
    totalRefund: Number(item.totalRefund ?? 0)
  }));

  const recentActivities = activities
    .map((activity) => ({
      ...activity,
      time: activity.time ? dayjs(activity.time) : null,
      amount: Number(activity.amount ?? 0)
    }))
    .slice(0, 10);

  const renderActivityIcon = (type) => {
    switch (type) {
      case 'TRANSACTION':
        return <ArrowLeftRight className="h-4 w-4 text-blue-500" />;
      case 'BET':
        return <Zap className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityTypeColor = (type) => {
    switch (type) {
      case 'TRANSACTION':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'BET':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Chart Section - 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biểu đồ thống kê 7 ngày - hiện tại */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden w-full">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Biểu đồ thống kê 7 ngày
            </h3>
          </div>
          <div className="p-6">
          {formattedChartData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-80 text-gray-400">
                <TrendingUp className="h-12 w-12 mb-2 opacity-50" />
                <p className="text-sm">Chưa có dữ liệu thống kê</p>
              </div>
          ) : (
            <ChartContainer
              config={{
                revenue: {
                  label: "Doanh thu",
                  fill: "#16a34a",
                },
                transactions: {
                  label: "Giao dịch",
                  fill: "#f97316",
                },
                totalBets: {
                  label: "Số bet xử lý",
                  fill: "#6366f1",
                },
              }}
              className="h-[320px] w-full"
            >
              <ComposedChart data={formattedChartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="dateLabel" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  yAxisId="left" 
                  orientation="left"
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => {
                    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                    return value.toString();
                  }}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right"
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(label) => `Ngày ${label}`}
                      valueFormatter={(value, name) => {
                        if (name === 'Doanh thu' || name === 'revenue') {
                          return currencyFormatter.format(value);
                        }
                        return numberFormatter.format(value);
                      }}
                    />
                  }
                />
                <ChartLegend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  name="Doanh thu"
                  stroke="#16a34a"
                  fill="#bbf7d0"
                  strokeWidth={2}
                  fillOpacity={0.6}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="transactions"
                  name="Giao dịch"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="totalBets"
                  name="Số bet xử lý"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={false}
                />
              </ComposedChart>
            </ChartContainer>
          )}
          </div>
        </div>

        {/* Biểu đồ tổng hợp tiền thắng/thua/hoàn */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden w-full">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Tổng hợp tiền thắng/thua/hoàn 7 ngày
            </h3>
          </div>
          <div className="p-6">
          {formattedChartData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-80 text-gray-400">
                <TrendingUp className="h-12 w-12 mb-2 opacity-50" />
                <p className="text-sm">Chưa có dữ liệu thống kê</p>
              </div>
          ) : (
            <ChartContainer
              config={{
                winProfit: {
                  label: "Tiền thắng cược",
                  fill: "#10b981",
                },
                lostStake: {
                  label: "Tiền thua cược",
                  fill: "#ef4444",
                },
                totalRefund: {
                  label: "Tổng tiền hoàn",
                  fill: "#f59e0b",
                },
              }}
              className="h-[320px] w-full"
            >
              <BarChart data={formattedChartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="dateLabel" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => {
                    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                    return value.toString();
                  }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(label) => `Ngày ${label}`}
                      valueFormatter={(value) => currencyFormatter.format(value)}
                    />
                  }
                />
                <ChartLegend />
                <Bar 
                  dataKey="winProfit" 
                  name="Tiền thắng cược"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="lostStake" 
                  name="Tiền thua cược"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="totalRefund" 
                  name="Tổng tiền hoàn"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          )}
          </div>
        </div>
      </div>

      {/* Recent Activities and Recent Users Section - Below chart */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Recent Activities Table */}
        <div className="lg:col-span-4 rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden w-full flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Hoạt động gần đây
            </h3>
          </div>
          <div className="overflow-x-auto flex-1">
            <Table
              columns={[
                {
                  key: 'type',
                  dataIndex: 'type',
                  title: 'Loại',
                  width: 120,
                  render: (value) => (
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium border",
                        getActivityTypeColor(value)
                      )}>
                        {value === 'TRANSACTION' ? 'Giao dịch' : 'Cược'}
                          </span>
                  ),
                },
                {
                  key: 'username',
                  dataIndex: 'username',
                  title: 'Người dùng',
                  width: 150,
                  render: (value) => (
                    <span className="text-sm font-medium text-gray-900">{value}</span>
                  ),
                },
                {
                  key: 'description',
                  dataIndex: 'description',
                  title: 'Loại',
                  render: (value, record) => {
                    // For BET types, show bet code visualization
                    const isBet = record.type === 'BET' || record.type === 'SICBO' || record.type === 'XOCDIA';
                    if (isBet && record.betCode) {
                      return renderBetCode(record.betCode);
                    }
                    // For TRANSACTION, show description text
                    return (
                    <span className="text-sm text-gray-700">{value}</span>
                    );
                  },
                },
                {
                  key: 'time',
                  dataIndex: 'time',
                  title: 'Thời gian',
                  width: 150,
                  render: (value, record) => (
                    <span className="text-sm text-gray-600">
                      {record.time ? record.time.format('HH:mm DD/MM/YYYY') : 'Không rõ thời gian'}
                    </span>
                  ),
                },
                {
                  key: 'amount',
                  dataIndex: 'amount',
                  title: 'Số tiền',
                  width: 150,
                  className: 'text-right',
                  render: (value) => (
                    <span className="text-sm font-medium text-gray-900">
                      {currencyFormatter.format(value ?? 0)}
                    </span>
                  ),
                },
              ]}
              dataSource={recentActivities}
              loading={false}
              rowKey={(record, index) => record.id || index}
              emptyText="Chưa ghi nhận hoạt động"
            />
          </div>
        </div>

        {/* Recent Users Table */}
        <div className="lg:col-span-3 rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden w-full flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Người dùng đăng ký gần đây
            </h3>
          </div>
          <div className="overflow-x-auto flex-1">
            <Table
              columns={[
                {
                  key: 'username',
                  dataIndex: 'username',
                  title: 'Tên người dùng',
                  width: 150,
                  render: (value) => (
                    <span className="text-sm font-medium text-gray-900">{value}</span>
                  ),
                },
                {
                  key: 'createdAt',
                  dataIndex: 'createdAt',
                  title: 'Ngày tạo',
                  width: 150,
                  render: (value) => (
                    <span className="text-sm text-gray-600">
                      {value ? dayjs(value).format('DD/MM/YYYY') : '-'}
                    </span>
                  ),
                },
                {
                  key: 'status',
                  dataIndex: 'status',
                  title: 'Trạng thái',
                  width: 120,
                  render: (value) => (
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium border",
                      value === 'ACTIVE' 
                        ? "bg-green-50 text-green-700 border-green-200"
                        : value === 'INACTIVE'
                        ? "bg-gray-50 text-gray-700 border-gray-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    )}>
                      {value === 'ACTIVE' ? 'Active' : value === 'INACTIVE' ? 'Tạm khóa' : 'Vô hiệu'}
                    </span>
                  ),
                },
                {
                  key: 'points',
                  dataIndex: 'points',
                  title: 'Số dư',
                  width: 150,
                  className: 'text-right',
                  render: (value) => (
                    <span className="text-sm font-medium text-gray-900">
                      {currencyFormatter.format(value ?? 0)}
                    </span>
                  ),
                },
              ]}
              dataSource={recentUsers.map(user => ({
                ...user,
                createdAt: user.createdAt
              }))}
              loading={false}
              rowKey={(record) => record.id}
              emptyText="Chưa có người dùng đăng ký"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
