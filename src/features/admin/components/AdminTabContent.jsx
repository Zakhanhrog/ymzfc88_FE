import { 
  ShoppingOutlined, 
  TeamOutlined,
  UserOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import DashboardStats from './DashboardStats';
import DashboardCharts from './DashboardCharts';
import TabPageHeader from './TabPageHeader';
import PlaceholderContent from './PlaceholderContent';
import AdminUserManagement from './AdminUserManagement';
import AdminDepositApproval from './AdminDepositApproval';
import AdminWithdrawApproval from './AdminWithdrawApproval';
import AdminPaymentMethodManagement from './AdminPaymentMethodManagement';
import AdminKycVerification from './AdminKycVerification';
import AdminSystemSettings from './AdminSystemSettings';
import AdminNotificationManagement from './AdminNotificationManagement';

const AdminTabContent = ({ currentTab, dashboardStats, loading }) => {
  const renderContent = () => {
    switch (currentTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <TabPageHeader 
              title="Dashboard" 
              description="Tổng quan hệ thống" 
            />
            <DashboardStats loading={loading} stats={dashboardStats} />
            <DashboardCharts />
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <TabPageHeader 
              title="Thống kê" 
              description="Phân tích dữ liệu chi tiết" 
            />
            <PlaceholderContent 
              icon={ShoppingOutlined}
              message="Trang thống kê sẽ được phát triển"
            />
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <TabPageHeader 
              title="Quản lý người dùng" 
              description="Quản lý toàn bộ người dùng trong hệ thống" 
            />
            <AdminUserManagement />
          </div>
        );

      case 'user-roles':
        return (
          <div className="space-y-6">
            <TabPageHeader 
              title="Phân quyền người dùng" 
              description="Quản lý vai trò và quyền hạn người dùng" 
            />
            <PlaceholderContent 
              icon={TeamOutlined}
              message="Trang phân quyền sẽ được phát triển"
            />
          </div>
        );

      case 'user-activities':
        return (
          <div className="space-y-6">
            <TabPageHeader 
              title="Hoạt động người dùng" 
              description="Theo dõi hoạt động của người dùng" 
            />
            <PlaceholderContent 
              icon={UserOutlined}
              message="Trang hoạt động người dùng sẽ được phát triển"
            />
          </div>
        );

      case 'deposits':
        return (
          <div className="space-y-6">
            <TabPageHeader 
              title="Duyệt nạp tiền" 
              description="Quản lý các yêu cầu nạp tiền" 
            />
            <AdminDepositApproval />
          </div>
        );

      case 'withdraws':
        return (
          <div className="space-y-6">
            <TabPageHeader 
              title="Duyệt rút tiền" 
              description="Quản lý các yêu cầu rút tiền" 
            />
            <AdminWithdrawApproval />
          </div>
        );

      case 'transactions':
        return (
          <div className="space-y-6">
            <TabPageHeader 
              title="Lịch sử giao dịch" 
              description="Xem tất cả giao dịch trong hệ thống" 
            />
            <PlaceholderContent 
              icon={ShoppingOutlined}
              message="Trang lịch sử giao dịch sẽ được phát triển"
            />
          </div>
        );

      case 'payment-methods':
        return (
          <div className="space-y-6">
            <TabPageHeader 
              title="Phương thức thanh toán" 
              description="Quản lý các phương thức thanh toán để người dùng nạp tiền" 
            />
            <AdminPaymentMethodManagement />
          </div>
        );

      case 'kyc-verification':
        return (
          <div className="space-y-6">
            <TabPageHeader 
              title="Xác thực tài khoản" 
              description="Duyệt yêu cầu xác thực tài khoản từ người dùng" 
            />
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
            <TabPageHeader 
              title="Chức năng đang phát triển" 
              description="Trang này sẽ được hoàn thiện trong thời gian tới" 
            />
            <PlaceholderContent 
              icon={TrophyOutlined}
              message="Chức năng đang được phát triển"
            />
          </div>
        );
    }
  };

  return renderContent();
};

export default AdminTabContent;

