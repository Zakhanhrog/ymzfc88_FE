import { Settings, RefreshCw } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';

const SystemSettingsHeader = ({ onRefresh, onInitializeDefaults, loading }) => {
  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
          <Settings className="h-6 w-6" />
          Cài đặt hệ thống
        </h2>
        <p className="text-sm text-gray-600">
          Quản lý các cài đặt và tùy chỉnh hệ thống
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </Button>
        <Button
          variant="outline"
          onClick={onInitializeDefaults}
          disabled={loading}
        >
          Khởi tạo mặc định
        </Button>
      </div>
    </div>
  );
};

export default SystemSettingsHeader;

