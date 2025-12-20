import { Button } from '../../../../components/ui/Button';
import { Plus } from 'lucide-react';

const MarqueeNotificationHeader = ({ onCreate }) => {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold text-gray-900">Quản lý Thông báo Chạy</h3>
      <Button
        onClick={onCreate}
        className="gap-2 bg-[#4CAF50] text-white hover:bg-[#45a049] rounded-2xl"
      >
        <Plus className="h-4 w-4" />
        Thêm thông báo mới
      </Button>
    </div>
  );
};

export default MarqueeNotificationHeader;

