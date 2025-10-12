import { Card } from '../../../components/ui';
import { Icon } from '@iconify/react';

const StatsCard = ({ stats }) => {
  const statsData = [
    {
      title: 'Tổng trận đấu',
      value: stats?.totalMatches || 0,
      icon: 'mdi:trophy',
      color: 'text-blue-600'
    },
    {
      title: 'Trận hôm nay',
      value: stats?.todayMatches || 0,
      icon: 'mdi:fire',
      color: 'text-orange-600'
    },
    {
      title: 'Đang live',
      value: stats?.liveMatches || 0,
      icon: 'mdi:eye',
      color: 'text-red-600'
    },
    {
      title: 'Tổng cược',
      value: stats?.totalBets || 0,
      icon: 'mdi:currency-usd',
      color: 'text-green-600'
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {statsData.map((stat, index) => (
        <Card key={index} className="text-center hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center gap-2">
            <Icon icon={stat.icon} className={`text-4xl ${stat.color}`} />
            <div className="text-sm text-gray-600">{stat.title}</div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsCard;
