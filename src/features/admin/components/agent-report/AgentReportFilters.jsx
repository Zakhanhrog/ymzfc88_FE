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
    <Card className="rounded-lg">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-3 xl:flex-nowrap xl:items-end">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tháng báo cáo
            </label>
            <MonthPicker
              format="YYYY-MM"
              value={selectedMonth}
              onChange={onMonthChange}
              className="w-full"
              bordered
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tìm kiếm theo IP
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <Input
                type="text"
                value={ipSearch}
                onChange={(e) => onIpSearchChange(e.target.value)}
                placeholder="Nhập IP để tìm kiếm"
                className="pl-10 h-10 border border-gray-200 focus-visible:ring-[#4CAF50] focus-visible:ring-offset-0"
              />
            </div>
          </div>
          <div className="flex items-center">
            <Button
              variant="outline"
              onClick={onRefresh}
              disabled={loading}
              className="rounded-lg"
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

