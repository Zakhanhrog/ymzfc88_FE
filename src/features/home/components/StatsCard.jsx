import { Card, Row, Col, Statistic } from 'antd';
import { TrophyOutlined, FireOutlined, EyeOutlined, DollarOutlined } from '@ant-design/icons';

const StatsCard = ({ stats }) => {
  const statsData = [
    {
      title: 'Tổng trận đấu',
      value: stats?.totalMatches || 0,
      icon: <TrophyOutlined className="text-blue-600" />,
      color: 'blue'
    },
    {
      title: 'Trận hôm nay',
      value: stats?.todayMatches || 0,
      icon: <FireOutlined className="text-orange-600" />,
      color: 'orange'
    },
    {
      title: 'Đang live',
      value: stats?.liveMatches || 0,
      icon: <EyeOutlined className="text-red-600" />,
      color: 'red'
    },
    {
      title: 'Tổng cược',
      value: stats?.totalBets || 0,
      icon: <DollarOutlined className="text-green-600" />,
      color: 'green'
    }
  ];

  return (
    <Row gutter={[16, 16]}>
      {statsData.map((stat, index) => (
        <Col xs={12} sm={6} key={index}>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <Statistic
              title={stat.title}
              value={stat.value}
              prefix={stat.icon}
              valueStyle={{ color: stat.color === 'blue' ? '#1890ff' : 
                                  stat.color === 'orange' ? '#fa8c16' :
                                  stat.color === 'red' ? '#f5222d' : '#52c41a' }}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatsCard;
