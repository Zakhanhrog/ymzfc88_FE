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
import { TrendingUp, ArrowLeftRight, Zap, FileText, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import Table from '../../../components/ui/Table';

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0
});

const numberFormatter = new Intl.NumberFormat('vi-VN');

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
    }))
    .slice(0, 10);

  const renderActivityIcon = (type) => {
    switch (type) {
      case 'TRANSACTION':
        return <ArrowLeftRight className="h-4 w-4 text-blue-500" />;
      case 'BET':
        return <Zap className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityTypeColor = (type) => {
    switch (type) {
      case 'TRANSACTION':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'BET':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Chart Section */}
      <div>
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden w-full">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Biểu đồ thống kê 7 ngày
            </h3>
          </div>
          <div className="p-6">
          {formattedChartData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-80 text-gray-400">
                <TrendingUp className="h-12 w-12 mb-2 opacity-50" />
                <p className="text-sm">Chưa có dữ liệu thống kê</p>
              </div>
          ) : (
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <ComposedChart data={formattedChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="dateLabel" 
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      yAxisId="left" 
                      orientation="left"
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                      tickFormatter={(value) => {
                        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                        if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                        return value.toString();
                      }}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right"
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                    />
                  <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    formatter={(value, name) => {
                      if (name === 'Doanh thu') {
                          return currencyFormatter.format(value);
                      }
                        return numberFormatter.format(value);
                    }}
                    labelFormatter={(label) => `Ngày ${label}`}
                  />
                    <Legend 
                      wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
                      iconType="circle"
                      iconSize={10}
                      style={{ fontSize: '12px' }}
                    />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    name="Doanh thu"
                    stroke="#16a34a"
                    fill="#bbf7d0"
                    strokeWidth={2}
                      fillOpacity={0.6}
                  />
                  <Line
                      yAxisId="left"
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
          </div>
        </div>
      </div>

      {/* Recent Activities Section - Below chart */}
      <div>
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden w-full">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Hoạt động gần đây
            </h3>
          </div>
          <div className="overflow-x-auto">
            <Table
              columns={[
                {
                  key: 'type',
                  dataIndex: 'type',
                  title: 'Loại',
                  width: 120,
                  render: (value) => (
                      <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center border",
                        getActivityTypeColor(value)
                      )}>
                        {renderActivityIcon(value)}
                      </div>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium border",
                        getActivityTypeColor(value)
                      )}>
                        {value === 'TRANSACTION' ? 'Giao dịch' : 'Cược'}
                          </span>
            </div>
                  ),
                },
                {
                  key: 'username',
                  dataIndex: 'username',
                  title: 'Người dùng',
                  width: 150,
                  render: (value) => (
                    <span className="text-sm font-medium text-gray-900">{value}</span>
                  ),
                },
                {
                  key: 'description',
                  dataIndex: 'description',
                  title: 'Mô tả',
                  render: (value) => (
                    <span className="text-sm text-gray-700">{value}</span>
                  ),
                },
                {
                  key: 'time',
                  dataIndex: 'time',
                  title: 'Thời gian',
                  width: 150,
                  render: (value, record) => (
                    <span className="text-sm text-gray-600">
                      {record.time ? record.time.format('HH:mm DD/MM/YYYY') : 'Không rõ thời gian'}
                    </span>
                  ),
                },
                {
                  key: 'amount',
                  dataIndex: 'amount',
                  title: 'Số tiền',
                  width: 150,
                  className: 'text-right',
                  render: (value) => (
                    <span className="text-sm font-medium text-gray-900">
                      {currencyFormatter.format(value ?? 0)}
                    </span>
                  ),
                },
              ]}
              dataSource={recentActivities}
              loading={false}
              rowKey={(record, index) => record.id || index}
              emptyText="Chưa ghi nhận hoạt động"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
