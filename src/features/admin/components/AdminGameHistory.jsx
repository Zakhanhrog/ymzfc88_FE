import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { adminService } from '../services/adminService';
import GameHistoryFilters from './game-history/GameHistoryFilters';
import GameHistoryStats from './game-history/GameHistoryStats';
import GameHistoryTable from './game-history/GameHistoryTable';

const DEFAULT_DATE_RANGE = [dayjs().subtract(7, 'day'), dayjs()];

const AdminGameHistory = () => {
  const [filters, setFilters] = useState({
    gameType: 'lottery',
    status: undefined,
    dateRange: DEFAULT_DATE_RANGE
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
    totalItems: 0,
    totalStakeAmount: 0,
    totalWinAmount: 0
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  });

  const fetchHistory = useCallback(
    async (page = pagination.current, pageSize = pagination.pageSize) => {
      try {
        setLoading(true);
        const params = {
          gameType: filters.gameType,
          status: filters.status,
          page: page - 1,
          size: pageSize
        };

        if (filters.dateRange && filters.dateRange.length === 2) {
          params.startDate = filters.dateRange[0]?.format('YYYY-MM-DD');
          params.endDate = filters.dateRange[1]?.format('YYYY-MM-DD');
        }

        const response = await adminService.getGameHistory(params);
        if (response?.success) {
          const payload = response.data || {};
          setData(payload.items || []);
          setSummary({
            totalItems: payload.totalItems || 0,
            totalStakeAmount: Number(payload.totalStakeAmount ?? 0),
            totalWinAmount: Number(payload.totalWinAmount ?? 0)
          });
          setPagination((prev) => ({
            ...prev,
            current: (payload.page || 0) + 1,
            pageSize: payload.size || pageSize,
            total: payload.totalItems || 0
          }));
        }
      } catch (error) {
        console.error('Error loading game history:', error);
        // Silent fail - không hiển thị notification cho lỗi tải dữ liệu
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.current, pagination.pageSize]
  );

  useEffect(() => {
    fetchHistory(1, pagination.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.gameType, filters.status, filters.dateRange]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      // Reset status when game type changes
      if (key === 'gameType') {
        newFilters.status = undefined;
      }
      return newFilters;
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handlePageChange = (page, pageSize) => {
    setPagination((prev) => ({ ...prev, current: page, pageSize }));
    fetchHistory(page, pageSize);
  };

  return (
    <div className="space-y-6">
      <GameHistoryFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onRefresh={() => fetchHistory()}
        loading={loading}
      />

      <GameHistoryStats
        summary={summary}
        loading={loading}
      />

      <GameHistoryTable
        data={data}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default AdminGameHistory;

