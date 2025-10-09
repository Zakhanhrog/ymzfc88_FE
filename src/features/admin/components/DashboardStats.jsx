import { Card, Row, Col, Statistic } from 'antd';
import { 
  UserOutlined, 
  DollarOutlined, 
  ShoppingOutlined, 
  TrophyOutlined
} from '@ant-design/icons';

const DashboardStats = ({ loading, stats }) => {
  const statsCards = [
    {
      id: 'users',
      title: 'Tổng người dùng',
      value: stats.totalUsers || 0,
      icon: <UserOutlined className="text-blue-600" />,
      valueStyle: { color: '#1890ff' }
    },
    {
      id: 'revenue',
      title: 'Doanh thu hôm nay',
      value: 567890,
      icon: <DollarOutlined className="text-green-600" />,
      suffix: 'VNĐ',
      valueStyle: { color: '#52c41a' }
    },
    {
      id: 'transactions',
      title: 'Giao dịch hôm nay',
      value: 89,
      icon: <ShoppingOutlined className="text-orange-600" />,
      valueStyle: { color: '#fa8c16' }
    },
    {
      id: 'games',
      title: 'Game đang hoạt động',
      value: 8,
      icon: <TrophyOutlined className="text-purple-600" />,
      valueStyle: { color: '#722ed1' }
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
              suffix={stat.suffix}
              valueStyle={stat.valueStyle}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default DashboardStats;

