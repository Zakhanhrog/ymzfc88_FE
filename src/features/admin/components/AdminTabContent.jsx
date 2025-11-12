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
import AdminAnalyticsDashboard from './AdminAnalyticsDashboard';
import AdminStaffManagement from './AdminStaffManagement';
import AdminRoleAssignment from './AdminRoleAssignment';
import AdminAgentManagement from './AdminAgentManagement';
import AdminUserManagement from './AdminUserManagement';
import AdminDepositApproval from './AdminDepositApproval';
import AdminWithdrawApproval from './AdminWithdrawApproval';
import AdminPaymentMethodManagement from './AdminPaymentMethodManagement';
import AdminKycVerification from './AdminKycVerification';
import AdminSystemSettings from './AdminSystemSettings';
import AdminNotificationManagement from './AdminNotificationManagement';
import AdminBetManagement from './AdminBetManagement';
import AdminLotteryResultManagement from './AdminLotteryResultManagement';
import AdminXocDiaResultManagement from './AdminXocDiaResultManagement';
import AdminSicboResultManagement from './AdminSicboResultManagement';
import ContactLinksManagement from './ContactLinksManagement';
import PromotionManagement from './PromotionManagement';
import AdminMarqueeNotificationManagement from './AdminMarqueeNotificationManagement';
import AdminBannerManagement from './AdminBannerManagement';
import TelegramSettings from '../pages/TelegramSettings';

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
            <DashboardStats loading={loading} stats={dashboardStats?.summary} />
            <DashboardCharts 
              chartData={dashboardStats?.chart}
              activities={dashboardStats?.recentActivities}
            />
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <TabPageHeader 
              title="Thống kê" 
              description="Báo cáo chi tiết cược và giao dịch nạp rút" 
            />
            <AdminAnalyticsDashboard />
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
              description="Phân quyền đại lý và nhân viên cho người dùng" 
            />
            <AdminRoleAssignment />
          </div>
        );

      case 'staff-management':
        return (
          <div className="space-y-6">
            <TabPageHeader
              title="Quản lý nhân viên"
              description="Danh sách nhân viên theo từng nhóm phân quyền"
            />
            <AdminStaffManagement readOnly initialRole="STAFF" />
          </div>
        );

      case 'agent-management':
        return (
          <div className="space-y-6">
            <TabPageHeader
              title="Quản lý đại lý"
              description="Danh sách đại lý hiện có trong hệ thống"
            />
            <AdminAgentManagement />
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

      case 'bet-management':
        return (
          <div className="space-y-6">
            <TabPageHeader 
              title="Quản lý cược" 
              description="Quản lý và thay đổi kết quả các lệnh cược của người dùng" 
            />
            <AdminBetManagement />
          </div>
        );

      case 'game-results':
        return (
          <div className="space-y-6">
            <TabPageHeader 
              title="Quản lý kết quả xổ số" 
              description="Quản lý kết quả xổ số cho từng vùng miền và tỉnh" 
            />
            <AdminLotteryResultManagement />
          </div>
        );

      case 'xoc-dia-results':
        return (
          <div className="space-y-6">
            <AdminXocDiaResultManagement />
          </div>
        );

      case 'sicbo-results':
        return (
          <div className="space-y-6">
            <AdminSicboResultManagement />
          </div>
        );

      case 'settings':
        return <AdminSystemSettings />;

      case 'contact-links':
        return <ContactLinksManagement />;

      case 'promotions':
        return <PromotionManagement />;

      case 'notifications':
        return <AdminNotificationManagement />;

      case 'marquee-notifications':
        return (
          <div className="space-y-6">
            <TabPageHeader 
              title="Quản lý thông báo chạy" 
              description="Quản lý các thông báo chạy trên trang chủ" 
            />
            <AdminMarqueeNotificationManagement />
          </div>
        );

      case 'banners':
        return (
          <div className="space-y-6">
            <TabPageHeader 
              title="Quản lý Banner" 
              description="Quản lý các banner quảng cáo trên trang chủ" 
            />
            <AdminBannerManagement />
          </div>
        );

      case 'telegram-settings':
        return <TelegramSettings />;

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

