import StatCard from '../../analytics/components/StatCard';
import { Clock, CheckCircle2, DollarSign, XCircle } from 'lucide-react';
import { formatCurrency } from '../../../../utils/helpers';

const DepositStats = ({ statistics }) => {
  const stats = [
    {
      title: 'Chờ duyệt',
      value: statistics.pending || 0,
      icon: Clock,
      bgColor: 'bg-yellow-600',
      textColor: 'text-white'
    },
    {
      title: 'Đã duyệt hôm nay',
      value: statistics.approvedToday || 0,
      icon: CheckCircle2,
      bgColor: 'bg-green-600',
      textColor: 'text-white'
    },
    {
      title: 'Tổng tiền hôm nay',
      value: formatCurrency(statistics.totalAmountToday || 0),
      icon: DollarSign,
      bgColor: 'bg-blue-600',
      textColor: 'text-white'
    },
    {
      title: 'Từ chối hôm nay',
      value: statistics.rejectedToday || 0,
      icon: XCircle,
      bgColor: 'bg-red-600',
      textColor: 'text-white'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          bgColor={stat.bgColor}
          textColor={stat.textColor}
        />
      ))}
    </div>
  );
};

export default DepositStats;

