import { Button } from '../../../../components/ui/Button';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

const BetManagementHeader = ({ 
  loading,
  onRefresh,
  onCheckAllResults
}) => {
  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        onClick={onRefresh}
        disabled={loading}
        className="gap-2 rounded-2xl"
      >
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        Làm mới
      </Button>
      <Button
        onClick={onCheckAllResults}
        disabled={loading}
        className="gap-2 bg-[#4CAF50] text-white hover:bg-[#45a049] rounded-2xl"
        title="Kiểm tra kết quả tất cả bet đang chờ"
      >
        <CheckCircle2 className="h-4 w-4" />
        Check Results
      </Button>
    </div>
  );
};

export default BetManagementHeader;

