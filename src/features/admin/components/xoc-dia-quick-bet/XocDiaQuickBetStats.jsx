import { Card, CardContent } from '../../../../components/ui/Card';
import { Info } from 'lucide-react';

const XocDiaQuickBetStats = ({ quickBets = [] }) => {
  if (quickBets.length === 0) return null;

  const activeCount = quickBets.filter(item => item.isActive).length;
  const inactiveCount = quickBets.filter(item => !item.isActive).length;

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-blue-800">
          <Info className="h-5 w-5" />
          <span className="text-sm">
            Tổng {quickBets.length} mục | Active: <strong>{activeCount}</strong> | Inactive: <strong>{inactiveCount}</strong>
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default XocDiaQuickBetStats;

