import AdminLayout from '../../../components/admin/AdminLayout';
import AdminBettingOddsManagement from '../components/AdminBettingOddsManagement';

const AdminBettingOddsPage = () => {
  return (
    <AdminLayout activeKey="betting-odds">
      <AdminBettingOddsManagement />
    </AdminLayout>
  );
};

export default AdminBettingOddsPage;

