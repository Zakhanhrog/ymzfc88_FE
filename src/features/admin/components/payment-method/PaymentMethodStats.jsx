import StatCard from '../../analytics/components/StatCard';
import { CreditCard, Banknote, DollarSign, TrendingUp } from 'lucide-react';

const PaymentMethodStats = ({ paymentMethods, paymentTypes }) => {
  const activeCount = paymentMethods.filter(pm => pm.isActive).length;
  const inactiveCount = paymentMethods.length - activeCount;
  const typeStats = paymentTypes.map(type => ({
    ...type,
    count: paymentMethods.filter(pm => pm.type === type.value).length
  }));
  const mostPopularType = typeStats.reduce((prev, current) => 
    (prev.count > current.count) ? prev : current, typeStats[0]);

  const stats = [
    {
      title: 'Tổng phương thức',
      value: paymentMethods.length,
      icon: CreditCard,
      bgColor: 'bg-blue-600',
      textColor: 'text-white'
    },
    {
      title: 'Đang hoạt động',
      value: activeCount,
      icon: Banknote,
      bgColor: 'bg-green-600',
      textColor: 'text-white'
    },
    {
      title: 'Tạm khóa',
      value: inactiveCount,
      icon: DollarSign,
      bgColor: 'bg-red-600',
      textColor: 'text-white'
    },
    {
      title: 'Loại phổ biến nhất',
      value: mostPopularType?.label || 'N/A',
      icon: TrendingUp,
      bgColor: 'bg-purple-600',
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

export default PaymentMethodStats;

