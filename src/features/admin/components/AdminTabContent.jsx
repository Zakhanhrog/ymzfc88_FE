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
import { AdminAnalyticsDashboard } from '../analytics';
import AdminStaffManagement from './AdminStaffManagement';
import AdminRoleAssignment from './AdminRoleAssignment';
import AdminAgentManagement from './AdminAgentManagement';
import AgentCustomerList from './AgentCustomerList';
import AgentInviteCodes from './AgentInviteCodes';
import AgentCommissionManagement from './AgentCommissionManagement';
import StaffMktUserOverview from './StaffMktUserOverview';
import StaffMktFinanceOverview from './StaffMktFinanceOverview';
import StaffMktGameOverview from './StaffMktGameOverview';
import AdminAgentReport from './AdminAgentReport';
import AdminUserManagement from './AdminUserManagement';
import AdminDepositApproval from './AdminDepositApproval';
import AdminWithdrawApproval from './AdminWithdrawApproval';
import AdminPaymentMethodManagement from './AdminPaymentMethodManagement';
import AdminDepositGatewayConfig from './AdminDepositGatewayConfig';
import AdminKycVerification from './AdminKycVerification';
import AdminLoginHistory from './AdminLoginHistory';
import AdminSystemSettings from './AdminSystemSettings';
import AdminNotificationManagement from './AdminNotificationManagement';
import AdminBetManagement from './AdminBetManagement';
import AdminLotteryResultManagement from './AdminLotteryResultManagement';
import AdminXocDiaResultManagement from './AdminXocDiaResultManagement';
import AdminGameHistory from './AdminGameHistory';
import AdminUserBetHistory from './AdminUserBetHistory';
import ContactLinksManagement from './ContactLinksManagement';
import PromotionManagement from './PromotionManagement';
import AdminMarqueeNotificationManagement from './AdminMarqueeNotificationManagement';
import AdminBannerManagement from './AdminBannerManagement';
import AdminStreamConfigManagement from './AdminStreamConfigManagement';
import TelegramSettings from '../pages/TelegramSettings';
import { getPortalType } from '../../../utils/subdomain';
import AdminProfile from './AdminProfile';
import StaffSicboResultManagement from './StaffSicboResultManagement';
import StaffSicboHistory from './StaffSicboHistory';
import StaffXocDiaHistory from './StaffXocDiaHistory';
import StaffXocDiaResultManagement from './StaffXocDiaResultManagement';

const AdminTabContent = ({ currentTab, dashboardStats, loading }) => {
  const portalType = getPortalType();

  const renderContent = () => {
    switch (currentTab) {
      case 'overview':
        if (portalType !== 'admin') {
          return (
            <div className="space-y-6">
              <TabPageHeader
                title="Dashboard"
                description="Trang tổng quan dành cho quản trị viên"
              />
              <PlaceholderContent
                icon={TrophyOutlined}
                message="Bạn không có quyền truy cập vào bảng tổng quan hệ thống."
              />
            </div>
          );
        }
        return (
          <div className="space-y-6">
            <DashboardStats loading={loading} stats={dashboardStats?.summary} />
            <DashboardCharts 
              chartData={dashboardStats?.chart}
              activities={dashboardStats?.recentActivities}
            />
          </div>
        );

      case 'analytics':
        if (portalType !== 'admin') {
          return (
            <div className="space-y-6">
              <TabPageHeader
                title="Thống kê"
                description="Chỉ dành cho quản trị viên hệ thống"
              />
              <PlaceholderContent
                icon={TrophyOutlined}
                message="Bạn không có quyền truy cập mục thống kê hệ thống."
              />
            </div>
          );
        }
        return (
          <div className="space-y-6">
            <AdminAnalyticsDashboard />
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <AdminUserManagement />
          </div>
        );

      case 'login-history':
        return (
          <div className="space-y-6">
            <AdminLoginHistory />
          </div>
        );

      case 'user-roles':
        // Redirect to staff-management (merged functionality)
        return (
          <div className="space-y-6">
            <AdminStaffManagement 
              initialRole="ALL"
              allowRoleFilter
              title="Quản lý nhân viên & Phân quyền"
              description="Quản lý nhân viên và phân quyền đại lý, nhân viên cho người dùng. Chọn phân quyền trong bảng để cập nhật."
              useRoleAssignmentCreateOptions={true}
            />
          </div>
        );

      case 'staff-management':
        return (
          <div className="space-y-6">
            <AdminStaffManagement 
              initialRole="ALL"
              allowRoleFilter
              title="Quản lý nhân viên & Phân quyền"
              description="Quản lý nhân viên và phân quyền đại lý, nhân viên cho người dùng. Chọn phân quyền trong bảng để cập nhật."
              useRoleAssignmentCreateOptions={true}
            />
          </div>
        );

      case 'agent-customer-list':
        return (
          <AgentCustomerList />
        );

      case 'agent-invite-codes':
        return (
          <AgentInviteCodes />
        );

      case 'agent-commission':
        return <AgentCommissionManagement />;

      case 'agent-report':
        return <AdminAgentReport />;

      case 'admin-profile':
        return <AdminProfile />;

      case 'staff-mkt-users':
        return <StaffMktUserOverview />;

      case 'staff-mkt-finance':
        return <StaffMktFinanceOverview />;

      case 'staff-mkt-games':
        return <StaffMktGameOverview />;

      case 'staff-xnk-users':
        return (
          <div className="space-y-6">
            <TabPageHeader
              title="Nhân viên XNK - Quản lý người dùng"
              description="Hỗ trợ người dùng trong các giao dịch nạp rút"
            />
            <PlaceholderContent
              icon={UserOutlined}
              message="Trang quản lý người dùng cho nhân viên XNK đang được xây dựng."
            />
          </div>
        );

      case 'staff-xnk-finance':
        return (
          <div className="space-y-6">
            <TabPageHeader
              title="Nhân viên XNK - Quản lý tài chính"
              description="Theo dõi và xử lý giao dịch nạp rút cho người dùng"
            />
            <PlaceholderContent
              icon={ShoppingOutlined}
              message="Chức năng tài chính cho nhân viên XNK sẽ được cập nhật sau."
            />
          </div>
        );

      case 'staff-xnk-games':
        return (
          <div className="space-y-6">
            <TabPageHeader
              title="Nhân viên XNK - Quản lý game"
              description="Kiểm soát dữ liệu trò chơi phục vụ nghiệp vụ nạp/rút"
            />
            <PlaceholderContent
              icon={TrophyOutlined}
              message="Trang quản lý game của nhân viên XNK đang phát triển."
            />
          </div>
        );

      case 'staff-tx1-history':
        return <StaffSicboHistory tableNumber={1} />;

      case 'staff-tx1-sicbo-results':
        return <StaffSicboResultManagement tableNumber={1} />;

      case 'staff-tx2-history':
        return <StaffSicboHistory tableNumber={2} />;

      case 'staff-tx2-sicbo-results':
        return <StaffSicboResultManagement tableNumber={2} />;

      case 'staff-xd-history':
        return <StaffXocDiaHistory />;

      case 'staff-xd-results':
        return <StaffXocDiaResultManagement />;

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
        return <AdminDepositApproval />;

      case 'withdraws':
        return <AdminWithdrawApproval />;

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
        return <AdminPaymentMethodManagement />;

      case 'deposit-gateway-configs':
        return (
          <div className="space-y-6">
            <TabPageHeader 
              title="Cấu hình cổng nạp tự động" 
              description="Khai báo mã ngân hàng, merchant, API key cho cổng nạp tự động" 
            />
            <AdminDepositGatewayConfig />
          </div>
        );

      case 'kyc-verification':
        return (
          <div className="space-y-6">
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

      case 'game-history':
        return <AdminGameHistory />;

      case 'user-game-bets':
        return (
          <div className="space-y-6">
            <TabPageHeader
              title="BÁO CÁO THẮNG/THUA"
              description="Thống kê tổng cược, lãi/lỗ và lịch sử lệnh của từng người dùng"
            />
            <AdminUserBetHistory />
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

      case 'stream-configs':
        return (
          <div className="space-y-6">
            <TabPageHeader 
              title="Quản lý Stream Config" 
              description="Quản lý stream keys cho livestream games (Xóc Đĩa, Sicbo)" 
            />
            <AdminStreamConfigManagement />
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

