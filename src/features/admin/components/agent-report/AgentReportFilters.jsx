import { Card, CardContent } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import MonthPicker from '../../../../components/ui/MonthPicker';
import { RefreshCw, Search } from 'lucide-react';
import dayjs from 'dayjs';

const AgentReportFilters = ({
  selectedMonth,
  onMonthChange,
  ipSearch,
  onIpSearchChange,
  onRefresh,
  loading
}) => {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tháng báo cáo
            </label>
            <MonthPicker
              format="YYYY-MM"
              value={selectedMonth}
              onChange={onMonthChange}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tìm kiếm theo IP
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                value={ipSearch}
                onChange={(e) => onIpSearchChange(e.target.value)}
                placeholder="Nhập IP để tìm kiếm"
                className="pl-10 border border-transparent"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={onRefresh}
              disabled={loading}
              className="rounded-2xl"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentReportFilters;

