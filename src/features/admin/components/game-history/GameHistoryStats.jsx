import StatCard from '../../analytics/components/StatCard';
import { History, DollarSign, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../../../utils/helpers';

const numberFormatter = new Intl.NumberFormat('vi-VN');

const GameHistoryStats = ({ summary, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 bg-gray-200 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  const statsCards = [
    {
      id: 'totalItems',
      title: 'Số lượng lệnh',
      value: numberFormatter.format(summary.totalItems || 0),
      subtitle: 'Tổng số lệnh cược',
      icon: History,
      bgColor: 'bg-blue-600',
      textColor: 'text-white',
      valueColor: 'text-white'
    },
    {
      id: 'totalStakeAmount',
      title: 'Tổng điểm cược',
      value: formatCurrency(summary.totalStakeAmount || 0),
      subtitle: 'Tổng tiền đã đặt cược',
      icon: DollarSign,
      bgColor: 'bg-indigo-600',
      textColor: 'text-white',
      valueColor: 'text-white'
    },
    {
      id: 'totalWinAmount',
      title: 'Tổng tiền thắng',
      value: formatCurrency(summary.totalWinAmount || 0),
      subtitle: 'Tổng tiền đã thắng',
      icon: TrendingUp,
      bgColor: 'bg-emerald-600',
      textColor: 'text-white',
      valueColor: 'text-white'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {statsCards.map((stat) => (
        <StatCard
          key={stat.id}
          title={stat.title}
          value={stat.value}
          subtitle={stat.subtitle}
          icon={stat.icon}
          bgColor={stat.bgColor}
          textColor={stat.textColor}
          valueColor={stat.valueColor}
        />
      ))}
    </div>
  );
};

export default GameHistoryStats;

