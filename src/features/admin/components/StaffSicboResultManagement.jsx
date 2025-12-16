import { SicboResultTablePanel } from './AdminSicboResultManagement';

const StaffSicboResultManagement = ({ tableNumber }) => (
  <div className="space-y-6">
    <SicboResultTablePanel tableNumber={tableNumber} />
  </div>
);

export default StaffSicboResultManagement;

