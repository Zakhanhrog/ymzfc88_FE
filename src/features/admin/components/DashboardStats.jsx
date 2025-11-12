import { Card, Row, Col, Statistic, Tag, Tooltip } from 'antd';
import { 
  UserOutlined, 
  DollarOutlined, 
  ShoppingOutlined, 
  ThunderboltOutlined
} from '@ant-design/icons';

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
  const transactionsTodayCount = Number(stats.transactionsTodayCount ?? 0);
  const transactionsTodayAmount = Number(stats.transactionsTodayAmount ?? 0);
  const onlineUsers = Number(stats.onlineUsers ?? 0);
  const activeUsers = Number(stats.activeUsers ?? 0);

  const statsCards = [
    {
      id: 'users',
      title: 'Tổng người dùng',
      value: totalUsers,
      icon: <UserOutlined className="text-blue-600" />,
      valueStyle: { color: '#1890ff' },
      extra: newUsersToday > 0 ? (
        <Tag color="blue" className="mt-2">
          +{numberFormatter.format(newUsersToday)} hôm nay
        </Tag>
      ) : (
        <span className="mt-2 block text-xs text-gray-500">
          Tích lũy toàn hệ thống
        </span>
      )
    },
    {
      id: 'revenue',
      title: 'Doanh thu hôm nay',
      value: revenueToday,
      icon: <DollarOutlined className="text-green-600" />,
      valueStyle: { color: '#52c41a' },
      formatter: (value) => currencyFormatter.format(value),
      extra: (
        <span className="mt-2 block text-xs text-gray-500">
          Tổng tiền từ các lệnh cược thua
        </span>
      )
    },
    {
      id: 'transactions',
      title: 'Giao dịch hôm nay',
      value: transactionsTodayCount,
      icon: <ShoppingOutlined className="text-orange-600" />,
      valueStyle: { color: '#fa8c16' },
      extra: (
        <Tooltip title="Tổng giá trị giao dịch đã duyệt trong ngày">
          <span className="mt-2 block text-xs text-gray-500">
            {currencyFormatter.format(transactionsTodayAmount)}
          </span>
        </Tooltip>
      )
    },
    {
      id: 'onlineUsers',
      title: 'Người dùng đang online',
      value: onlineUsers,
      icon: <ThunderboltOutlined className="text-purple-600" />,
      valueStyle: { color: '#722ed1' },
      extra: (
        <span className="mt-2 block text-xs text-gray-500">
          {numberFormatter.format(activeUsers)} người dùng hoạt động
        </span>
      )
    }
  ];

  return (
    <Row gutter={[16, 16]}>
      {statsCards.map((stat) => (
        <Col key={stat.id} xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title={stat.title}
              value={stat.value}
              prefix={stat.icon}
              valueStyle={stat.valueStyle}
              formatter={stat.formatter}
            />
            {stat.extra}
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default DashboardStats;

