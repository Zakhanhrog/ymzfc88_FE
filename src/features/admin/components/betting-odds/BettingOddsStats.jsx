import { Card, CardContent } from '../../../../components/ui/Card';
import { Info } from 'lucide-react';

const BettingOddsStats = ({ bettingOdds = [] }) => {
  if (bettingOdds.length === 0) return null;

  const activeCount = bettingOdds.filter(o => o.isActive).length;
  const inactiveCount = bettingOdds.filter(o => !o.isActive).length;

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-blue-800">
          <Info className="h-5 w-5" />
          <span className="text-sm">
            Tổng số: <strong>{bettingOdds.length}</strong> loại cược | 
            Active: <strong>{activeCount}</strong> | 
            Inactive: <strong>{inactiveCount}</strong>
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BettingOddsStats;

