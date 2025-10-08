import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { 
  UserOutlined, 
  DollarOutlined, 
  ShoppingOutlined, 
  TrophyOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import AdminDepositApproval from '../components/AdminDepositApproval';
import AdminWithdrawApproval from '../components/AdminWithdrawApproval';
import AdminUserManagement from '../components/AdminUserManagement';
import AdminPaymentMethodManagement from '../components/AdminPaymentMethodManagement';
import AdminKycVerification from '../components/AdminKycVerification';
import AdminSystemSettings from '../components/AdminSystemSettings';
import AdminNotificationManagement from '../components/AdminNotificationManagement';
import { adminService } from '../services/adminService';

const AdminDashboardPage = () => {
  const location = useLocation();
  const [dashboardStats, setDashboardStats] = useState({});
  const [loading, setLoading] = useState(false);

  // Get current tab from URL params
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'overview';

  useEffect(() => {
    if (currentTab === 'overview') {
      loadDashboardStats();
    }
  }, [currentTab]);

  const loadDashboardStats = async () => {
    setLoading(true);
    try {
      const response = await adminService.getDashboardStats();
      if (response.success) {
        setDashboardStats(response.data);
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
              <p className="text-gray-600">Tổng quan hệ thống</p>
            </div>

            {/* Stats Cards */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={6}>
                <Card loading={loading}>
                  <Statistic
                    title="Tổng người dùng"
                    value={dashboardStats.totalUsers || 0}
                    prefix={<UserOutlined className="text-blue-600" />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card loading={loading}>
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
                <Card loading={loading}>
                  <Statistic
                    title="Giao dịch hôm nay"
                    value={89}
                    prefix={<ShoppingOutlined className="text-orange-600" />}
                    valueStyle={{ color: '#fa8c16' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card loading={loading}>
                  <Statistic
                    title="Game đang hoạt động"
                    value={8}
                    prefix={<TrophyOutlined className="text-purple-600" />}
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Charts placeholder */}
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
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Thống kê</h1>
              <p className="text-gray-600">Phân tích dữ liệu chi tiết</p>
            </div>
            <Card>
              <div className="flex items-center justify-center h-96 text-gray-400">
                <div className="text-center">
                  <ShoppingOutlined className="text-6xl mb-4" />
                  <p className="text-lg">Trang thống kê sẽ được phát triển</p>
                </div>
              </div>
            </Card>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Quản lý người dùng</h1>
              <p className="text-gray-600">Quản lý toàn bộ người dùng trong hệ thống</p>
            </div>
            <AdminUserManagement />
          </div>
        );

      case 'user-roles':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Phân quyền người dùng</h1>
              <p className="text-gray-600">Quản lý vai trò và quyền hạn người dùng</p>
            </div>
            <Card>
              <div className="flex items-center justify-center h-96 text-gray-400">
                <div className="text-center">
                  <TeamOutlined className="text-6xl mb-4" />
                  <p className="text-lg">Trang phân quyền sẽ được phát triển</p>
                </div>
              </div>
            </Card>
          </div>
        );

      case 'user-activities':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Hoạt động người dùng</h1>
              <p className="text-gray-600">Theo dõi hoạt động của người dùng</p>
            </div>
            <Card>
              <div className="flex items-center justify-center h-96 text-gray-400">
                <div className="text-center">
                  <UserOutlined className="text-6xl mb-4" />
                  <p className="text-lg">Trang hoạt động người dùng sẽ được phát triển</p>
                </div>
              </div>
            </Card>
          </div>
        );

      case 'deposits':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Duyệt nạp tiền</h1>
              <p className="text-gray-600">Quản lý các yêu cầu nạp tiền</p>
            </div>
            <AdminDepositApproval />
          </div>
        );

      case 'withdraws':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Duyệt rút tiền</h1>
              <p className="text-gray-600">Quản lý các yêu cầu rút tiền</p>
            </div>
            <AdminWithdrawApproval />
          </div>
        );

      case 'transactions':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Lịch sử giao dịch</h1>
              <p className="text-gray-600">Xem tất cả giao dịch trong hệ thống</p>
            </div>
            <Card>
              <div className="flex items-center justify-center h-96 text-gray-400">
                <div className="text-center">
                  <ShoppingOutlined className="text-6xl mb-4" />
                  <p className="text-lg">Trang lịch sử giao dịch sẽ được phát triển</p>
                </div>
              </div>
            </Card>
          </div>
        );

      case 'payment-methods':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Phương thức thanh toán</h1>
              <p className="text-gray-600">Quản lý các phương thức thanh toán để người dùng nạp tiền</p>
            </div>
            <AdminPaymentMethodManagement />
          </div>
        );

      case 'kyc-verification':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Xác thực tài khoản</h1>
              <p className="text-gray-600">Duyệt yêu cầu xác thực tài khoản từ người dùng</p>
            </div>
            <AdminKycVerification />
          </div>
        );

      case 'settings':
        return <AdminSystemSettings />;

      case 'notifications':
        return <AdminNotificationManagement />;

      default:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Chức năng đang phát triển</h1>
              <p className="text-gray-600">Trang này sẽ được hoàn thiện trong thời gian tới</p>
            </div>
            <Card>
              <div className="flex items-center justify-center h-96 text-gray-400">
                <div className="text-center">
                  <TrophyOutlined className="text-6xl mb-4" />
                  <p className="text-lg">Chức năng đang được phát triển</p>
                </div>
              </div>
            </Card>
          </div>
        );
    }
  };

  return (
    <AdminLayout>
      {renderContent()}
    </AdminLayout>
  );
};

export default AdminDashboardPage;
