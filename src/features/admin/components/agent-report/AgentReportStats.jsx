import { Users, DollarSign } from 'lucide-react';
import StatCard from '../../analytics/components/StatCard';
import { formatPointsOnly } from '../../../../utils/helpers';

const AgentReportStats = ({ report }) => {
  if (!report) return null;

  const stats = [
    {
      title: 'Tổng đại lý',
      value: report.totalAgents ?? 0,
      icon: Users,
      bgColor: 'bg-blue-600',
      textColor: 'text-white'
    },
    {
      title: 'Tổng khách hàng',
      value: report.totalCustomers ?? 0,
      icon: Users,
      bgColor: 'bg-purple-600',
      textColor: 'text-white'
    },
    {
      title: 'Tổng cược',
      value: formatPointsOnly(Number(report.totalBetAmount ?? 0)),
      icon: DollarSign,
      bgColor: 'bg-indigo-600',
      textColor: 'text-white'
    },
    {
      title: 'Tổng thua',
      value: formatPointsOnly(Number(report.totalLostAmount ?? 0)),
      icon: DollarSign,
      bgColor: 'bg-red-600',
      textColor: 'text-white'
    },
    {
      title: 'Hoa hồng dự kiến',
      value: formatPointsOnly(Number(report.totalCalculatedCommission ?? 0)),
      icon: DollarSign,
      bgColor: 'bg-emerald-600',
      textColor: 'text-white'
    },
    {
      title: 'Đã chia',
      value: formatPointsOnly(Number(report.totalPaidCommission ?? 0)),
      icon: DollarSign,
      bgColor: 'bg-green-600',
      textColor: 'text-white'
    },
    {
      title: 'Chưa chia',
      value: formatPointsOnly(Number(report.totalPendingCommission ?? 0)),
      icon: DollarSign,
      bgColor: 'bg-orange-600',
      textColor: 'text-white'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
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

export default AgentReportStats;

