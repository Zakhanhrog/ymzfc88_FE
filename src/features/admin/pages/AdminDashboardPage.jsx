import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, DollarOutlined, ShoppingOutlined, TrophyOutlined } from '@ant-design/icons';
import AdminLayout from '../../../components/admin/AdminLayout';

const AdminDashboardPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Tổng quan hệ thống</p>
        </div>

        {/* Stats Cards */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng người dùng"
                value={1234}
                prefix={<UserOutlined className="text-blue-600" />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Doanh thu hôm nay"
                value={567890}
                prefix={<DollarOutlined className="text-green-600" />}
                suffix="VNĐ"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Giao dịch hôm nay"
                value={89}
                prefix={<ShoppingOutlined className="text-orange-600" />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Game đang hoạt động"
                value={8}
                prefix={<TrophyOutlined className="text-purple-600" />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Placeholder for future content */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Biểu đồ thống kê" className="h-80">
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <TrophyOutlined className="text-4xl mb-4" />
                  <p>Biểu đồ sẽ được thêm sau</p>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Hoạt động gần đây" className="h-80">
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <UserOutlined className="text-4xl mb-4" />
                  <p>Danh sách hoạt động sẽ được thêm sau</p>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
