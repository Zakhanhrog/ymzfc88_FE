import StatCard from '../analytics/components/StatCard';
import { 
  Users, 
  DollarSign, 
  ArrowUpCircle, 
  ArrowDownCircle,
  Activity,
  TrendingUp
} from 'lucide-react';

const numberFormatter = new Intl.NumberFormat('vi-VN');
const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0
});

const DashboardStats = ({ loading, stats = {} }) => {
  const totalUsers = Number(stats.totalUsers ?? 0);
  const newUsersToday = Number(stats.newUsersToday ?? 0);
  const revenueToday = Number(stats.revenueToday ?? 0);
  const profitToday = Number(stats.profitToday ?? 0);
  const depositsTodayAmount = Number(stats.depositsTodayAmount ?? 0);
  const withdrawalsTodayAmount = Number(stats.withdrawalsTodayAmount ?? 0);
  const onlineUsers = Number(stats.onlineUsers ?? 0);
  const activeUsers = Number(stats.activeUsers ?? 0);

  const statsCards = [
    {
      id: 'users',
      title: 'Tổng người dùng',
      value: numberFormatter.format(totalUsers),
      subtitle: newUsersToday > 0 
        ? `+${numberFormatter.format(newUsersToday)} hôm nay`
        : 'Tích lũy toàn hệ thống',
      icon: Users,
      bgColor: 'bg-blue-600',
      textColor: 'text-white',
      valueColor: 'text-white'
    },
    {
      id: 'revenue',
      title: 'Doanh thu hôm nay',
      value: currencyFormatter.format(revenueToday),
      subtitle: 'Tổng tiền từ các lệnh cược thua',
      icon: DollarSign,
      bgColor: 'bg-green-600',
      textColor: 'text-white',
      valueColor: 'text-white'
    },
    {
      id: 'profit',
      title: 'Lợi nhuận hôm nay',
      value: currencyFormatter.format(profitToday),
      subtitle: 'Doanh thu trừ các khoản chi phí',
      icon: TrendingUp,
      bgColor: 'bg-emerald-600',
      textColor: 'text-white',
      valueColor: 'text-white'
    },
    {
      id: 'deposits',
      title: 'Tổng nạp',
      value: currencyFormatter.format(depositsTodayAmount),
      subtitle: 'Tổng tiền nạp trong ngày',
      icon: ArrowUpCircle,
      bgColor: 'bg-orange-600',
      textColor: 'text-white',
      valueColor: 'text-white'
    },
    {
      id: 'withdrawals',
      title: 'Tổng rút',
      value: currencyFormatter.format(withdrawalsTodayAmount),
      subtitle: 'Tổng tiền rút trong ngày',
      icon: ArrowDownCircle,
      bgColor: 'bg-red-600',
      textColor: 'text-white',
      valueColor: 'text-white'
    },
    {
      id: 'onlineUsers',
      title: 'Người dùng đang online',
      value: numberFormatter.format(onlineUsers),
      subtitle: `${numberFormatter.format(activeUsers)} người dùng hoạt động`,
      icon: Activity,
      bgColor: 'bg-purple-600',
      textColor: 'text-white',
      valueColor: 'text-white'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {statsCards.map((stat) => (
          <div
            key={stat.id}
            className="h-32 bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
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

export default DashboardStats;
