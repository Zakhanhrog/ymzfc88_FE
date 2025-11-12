import { Card, Row, Col, List, Avatar, Empty, Tag } from 'antd';
import {
  ThunderboltOutlined,
  DollarCircleOutlined,
  SwapOutlined,
  FundProjectionScreenOutlined
} from '@ant-design/icons';
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Area,
  Line
} from 'recharts';
import dayjs from 'dayjs';

const DashboardCharts = ({ chartData = [], activities = [] }) => {
  const formattedChartData = chartData.map((item) => ({
    ...item,
    dateLabel: dayjs(item.date).format('DD/MM'),
    revenue: Number(item.revenue ?? 0),
    transactions: Number(item.transactions ?? 0),
    transactionAmount: Number(item.transactionAmount ?? 0),
    totalBets: Number(item.totalBets ?? 0)
  }));

  const recentActivities = activities
    .map((activity) => ({
      ...activity,
      time: activity.time ? dayjs(activity.time) : null,
      amount: Number(activity.amount ?? 0)
    }));

  const renderActivityIcon = (type) => {
    switch (type) {
      case 'TRANSACTION':
        return <SwapOutlined className="text-blue-500" />;
      case 'BET':
        return <ThunderboltOutlined className="text-purple-500" />;
      default:
        return <FundProjectionScreenOutlined className="text-gray-500" />;
    }
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={16}>
        <Card title="Biểu đồ thống kê 7 ngày">
          {formattedChartData.length === 0 ? (
            <Empty description="Chưa có dữ liệu thống kê" />
          ) : (
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <ComposedChart data={formattedChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dateLabel" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'Doanh thu') {
                        return new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                          maximumFractionDigits: 0
                        }).format(value);
                      }
                      return new Intl.NumberFormat('vi-VN').format(value);
                    }}
                    labelFormatter={(label) => `Ngày ${label}`}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    name="Doanh thu"
                    stroke="#16a34a"
                    fill="#bbf7d0"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="transactions"
                    name="Giao dịch"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="totalBets"
                    name="Số bet xử lý"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </Col>
      <Col xs={24} lg={8}>
        <Card title="Hoạt động gần đây">
          {recentActivities.length === 0 ? (
            <Empty description="Chưa ghi nhận hoạt động" />
          ) : (
            <List
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{ backgroundColor: '#f5f5f5' }}
                        icon={renderActivityIcon(item.type)}
                      />
                    }
                    title={
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">{item.username}</span>
                        <Tag color={item.type === 'TRANSACTION' ? 'blue' : 'purple'}>
                          {item.type === 'TRANSACTION' ? 'Giao dịch' : 'Cược'}
                        </Tag>
                      </div>
                    }
                    description={
                      <div className="flex flex-col text-sm text-gray-500">
                        <span>{item.description}</span>
                        <div className="flex items-center gap-2">
                          <span>
                            {item.time ? item.time.format('HH:mm DD/MM') : 'Không rõ thời gian'}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span>
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                              maximumFractionDigits: 0
                            }).format(item.amount)}
                          </span>
            </div>
          </div>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardCharts;

