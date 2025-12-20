import StatCard from '../../analytics/components/StatCard';
import { Bell, Globe, User } from 'lucide-react';

const numberFormatter = new Intl.NumberFormat('vi-VN');

const NotificationStats = ({ stats = { total: 0, broadcast: 0, individual: 0 } }) => {
  const statsCards = [
    {
      id: 'total',
      title: 'Tổng thông báo',
      value: numberFormatter.format(stats.total || 0),
      subtitle: 'Tổng số thông báo trong hệ thống',
      icon: Bell,
      bgColor: 'bg-blue-600',
      textColor: 'text-white',
      valueColor: 'text-white'
    },
    {
      id: 'broadcast',
      title: 'Toàn hệ thống',
      value: numberFormatter.format(stats.broadcast || 0),
      subtitle: 'Thông báo gửi cho tất cả người dùng',
      icon: Globe,
      bgColor: 'bg-emerald-600',
      textColor: 'text-white',
      valueColor: 'text-white'
    },
    {
      id: 'individual',
      title: 'Cá nhân',
      value: numberFormatter.format(stats.individual || 0),
      subtitle: 'Thông báo gửi cho người dùng cụ thể',
      icon: User,
      bgColor: 'bg-indigo-600',
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

export default NotificationStats;

