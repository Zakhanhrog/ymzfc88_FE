import StatCard from '../../analytics/components/StatCard';
import { Users, UserCheck, UserPlus, UserCog } from 'lucide-react';

const UserStatsCards = ({ stats, loading = false }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        title="Tổng người dùng"
        value={stats?.usersByRole?.USER || 0}
        valueColor="text-white"
        bgColor="bg-blue-600"
        textColor="text-white"
        icon={Users}
      />
      <StatCard
        title="Đại lý"
        value={stats?.usersByStaffRole?.AGENT || 0}
        valueColor="text-white"
        bgColor="bg-green-600"
        textColor="text-white"
        icon={UserCog}
      />
      <StatCard
        title="Người dùng hoạt động"
        value={stats?.usersByStatus?.ACTIVE || 0}
        valueColor="text-white"
        bgColor="bg-emerald-600"
        textColor="text-white"
        icon={UserCheck}
      />
      <StatCard
        title="Người dùng mới (30 ngày)"
        value={stats?.newUsersLast30Days || 0}
        valueColor="text-white"
        bgColor="bg-orange-600"
        textColor="text-white"
        icon={UserPlus}
      />
    </div>
  );
};

export default UserStatsCards;

