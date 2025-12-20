import { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { message } from '../../../utils/notification';
import { adminService } from '../services/adminService';
import LoginHistoryFilters from './login-history/LoginHistoryFilters';
import LoginHistoryTable from './login-history/LoginHistoryTable';

const defaultFilters = {
  username: '',
  ip: '',
  portal: 'all',
  success: 'all',
  dateRange: null,
};

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const AdminLoginHistory = () => {
  const [filters, setFilters] = useState(defaultFilters);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const computedParams = useMemo(() => {
    const params = {
      page: page - 1,
      size: pageSize,
    };

    if (filters.username) {
      params.username = filters.username.trim();
    }

    if (filters.ip) {
      params.ip = filters.ip.trim();
    }

    if (filters.portal && filters.portal !== 'all') {
      params.portal = filters.portal;
    }

    if (filters.success === 'success') {
      params.success = true;
    } else if (filters.success === 'failure') {
      params.success = false;
    }

    if (filters.dateRange && filters.dateRange.length === 2 && filters.dateRange[0] && filters.dateRange[1]) {
      params.from = filters.dateRange[0].toISOString();
      params.to = filters.dateRange[1].toISOString();
    }

    return params;
  }, [filters, page, pageSize]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminService.getLoginHistory(computedParams);
      if (!response?.success) {
        throw new Error(response?.message || 'Không thể tải lịch sử đăng nhập');
      }

      const payload = response.data || {};
      setData(Array.isArray(payload.items) ? payload.items : []);
      setTotal(payload.totalItems || 0);
    } catch (error) {
      console.error('Failed to fetch login history', error);
      message.error(error.message || 'Không thể tải lịch sử đăng nhập');
    } finally {
      setLoading(false);
    }
  }, [computedParams]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset về trang đầu khi filter thay đổi
  };

  const handlePaginationChange = (newPage, newPageSize) => {
    setPage(newPage);
    if (newPageSize && newPageSize !== pageSize) {
      setPageSize(newPageSize);
    }
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(1); // Reset về trang đầu khi đổi page size
  };

  return (
    <div className="space-y-4">
      <LoginHistoryFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onRefresh={loadData}
        loading={loading}
      />

      <LoginHistoryTable
        data={data}
        loading={loading}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total
        }}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        onPaginationChange={handlePaginationChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default AdminLoginHistory;
