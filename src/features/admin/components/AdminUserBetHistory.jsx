import { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { adminService } from '../services/adminService';
import { formatPointsDisplay, formatPoints } from '../../../utils/helpers';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import Table from '../../../components/ui/Table';
import Pagination from '../../../components/ui/Pagination';
import DateRangePicker from '../../../components/ui/DateRangePicker';
import UserBetDetailModal from './UserBetDetailModal';

// Format điểm không có đơn vị "điểm"
const formatPointsOnly = (points) => {
  if (!points && points !== 0) return '0';
  const formatter = new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: true
  });
  return formatter.format(Number(points ?? 0));
};

// Format VND sang điểm nhưng không có đơn vị "điểm"
const formatPointsFromVND = (amount) => {
  if (!amount && amount !== 0) return '0';
  // Convert VND to points: 1000 VND = 1 điểm
  const points = Number(amount) / 1000;
  const formatter = new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: true
  });
  return formatter.format(points);
};

// Component hiển thị IP với chức năng copy
const IpCell = ({ ip }) => {
  const [showCopyIcon, setShowCopyIcon] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    if (!ip || ip === '-') return;
    
    try {
      await navigator.clipboard.writeText(ip);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy IP:', err);
    }
  };

  if (!ip || ip === '-') {
    return <span className="text-sm text-gray-900">-</span>;
  }

  // Hiển thị chỉ 12 ký tự đầu + "..."
  const displayIp = ip.length > 12 ? `${ip.substring(0, 12)}...` : ip;

  return (
    <div
      className="relative group w-full"
      onMouseEnter={() => setShowCopyIcon(true)}
      onMouseLeave={() => setShowCopyIcon(false)}
    >
      <span 
        className="text-sm text-gray-900 block cursor-pointer hover:text-blue-600 transition-colors whitespace-nowrap relative"
        onClick={handleCopy}
        title={ip}
      >
        {displayIp}
      </span>
      {showCopyIcon && (
        <button
          onClick={handleCopy}
          className="absolute top-0 right-0 p-0.5 bg-white bg-opacity-90 rounded shadow-sm text-gray-400 hover:text-blue-600 transition-colors z-10"
          title={copied ? 'Đã sao chép!' : 'Sao chép IP'}
          onMouseEnter={(e) => e.stopPropagation()}
        >
          {copied ? (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
};

const DEFAULT_PAGE_SIZE = 20;

const numberFormatter = new Intl.NumberFormat('vi-VN');

const AdminUserBetHistory = () => {
  const [searchInput, setSearchInput] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [agentCode, setAgentCode] = useState('');
  const [summaryData, setSummaryData] = useState([]);
  const [summaryPage, setSummaryPage] = useState(1);
  const [summarySize, setSummarySize] = useState(DEFAULT_PAGE_SIZE);
  const [summaryTotal, setSummaryTotal] = useState(0);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [detailVisible, setDetailVisible] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState([]);
  const [detailMeta, setDetailMeta] = useState({ page: 1, size: DEFAULT_PAGE_SIZE, total: 0, hasMore: false });
  const [detailFilters, setDetailFilters] = useState({ gameType: 'all' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailSummary, setDetailSummary] = useState(null);

  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const [startDate, endDate] = dateRange || [];
      // Format date range: start of day và end of day theo local timezone (Asia/Ho_Chi_Minh)
      // Không dùng toISOString() vì nó convert sang UTC, gây lệch timezone
      let formattedStartDate = undefined;
      let formattedEndDate = undefined;
      
      if (startDate) {
        // Lấy start of day (00:00:00) và format theo ISO format nhưng không có timezone
        const start = dayjs(startDate).startOf('day');
        formattedStartDate = start.format('YYYY-MM-DDTHH:mm:ss');
      }
      
      if (endDate) {
        // Lấy end of day (23:59:59) và format theo ISO format nhưng không có timezone
        const end = dayjs(endDate).endOf('day');
        formattedEndDate = end.format('YYYY-MM-DDTHH:mm:ss');
      }
      
      const response = await adminService.getUserBetSummary({
        search: searchInput.trim() || undefined,
        agentCode: agentCode || undefined,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        page: summaryPage - 1,
        size: summarySize
      });
      if (response?.success) {
        const payload = response.data || {};
        setSummaryData(payload.items || []);
        setSummaryTotal(payload.totalItems || 0);
      } else {
        throw new Error(response?.message || 'Không thể tải dữ liệu');
      }
    } catch (error) {
      console.error('Lỗi khi tải thống kê cược người dùng:', error);
    } finally {
      setSummaryLoading(false);
    }
  }, [searchInput, dateRange, agentCode, summaryPage, summarySize]);

  // Debounce search input để tránh gọi API quá nhiều khi gõ
  useEffect(() => {
    const timer = setTimeout(() => {
      setSummaryPage(1);
    }, 500); // Debounce 500ms

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Tự động reset page về 1 khi dateRange hoặc agentCode thay đổi
  useEffect(() => {
    setSummaryPage(1);
  }, [dateRange, agentCode]);

  // Load khi dependencies thay đổi
  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const handleResetFilters = () => {
    setSearchInput('');
    setDateRange(null);
    setAgentCode('');
    setSummaryPage(1);
  };

  const handleDetailClose = () => {
    setDetailVisible(false);
    setSelectedUser(null);
    setDetailData([]);
    setDetailMeta({ page: 1, size: DEFAULT_PAGE_SIZE, total: 0, hasMore: false });
  };

  const fetchDetail = useCallback(
    async ({ userId, page = 1, size = DEFAULT_PAGE_SIZE, gameType = detailFilters.gameType || 'all' }) => {
      if (!userId) {
        return;
      }
      setDetailLoading(true);
      try {
        const response = await adminService.getUserBetDetail({
          userId,
          gameType,
          page: page - 1,
          size
        });
        if (response?.success) {
          const payload = response.data || {};
          setDetailData(payload.items || []);
          setDetailMeta({
            page: (payload.page || 0) + 1,
            size: payload.size || size,
            total: payload.totalItems || 0,
            hasMore: payload.hasMore || false
          });
          setDetailSummary(payload);
        } else {
          throw new Error(response?.message || 'Không thể tải chi tiết cược');
        }
      } catch (error) {
        console.error('Lỗi khi tải chi tiết cược người dùng:', error);
      } finally {
        setDetailLoading(false);
      }
    },
    [detailFilters.gameType]
  );

  const openDetail = (record) => {
    setSelectedUser(record);
    setDetailFilters({ gameType: 'all' });
    setDetailVisible(true);
    fetchDetail({ userId: record.userId, page: 1, size: DEFAULT_PAGE_SIZE, gameType: 'all' });
  };

  const handleDetailFilterChange = (newFilters) => {
    setDetailFilters(newFilters);
    if (selectedUser) {
      fetchDetail({ 
        userId: selectedUser.userId, 
        page: 1, 
        size: detailMeta.size, 
        gameType: newFilters.gameType 
      });
    }
  };

  const handleDetailPaginationChange = (page, pageSize) => {
    if (selectedUser) {
      fetchDetail({
        userId: selectedUser.userId,
        page,
        size: pageSize,
        gameType: detailFilters.gameType
      });
    }
  };

  const summaryColumns = useMemo(
    () => [
      {
        title: 'Tên tài khoản',
        dataIndex: 'username',
        key: 'username',
        render: (value, record) => (
          <div>
            <div className="font-semibold text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{record.fullName || '--'}</div>
          </div>
        )
      },
      {
        title: 'Tổng cược',
        dataIndex: 'totalStakeAmount',
        key: 'totalStakeAmount',
        className: 'text-right',
        render: (value) => <span className="text-sm text-gray-900">{formatPointsOnly(Number(value ?? 0))}</span>
      },
      {
        title: 'Tổng Thắng',
        dataIndex: 'totalWinAmount',
        key: 'totalWinAmount',
        className: 'text-right',
        render: (value) => {
          const win = Number(value ?? 0);
          return (
            <span className="text-sm font-bold text-green-600">
              {formatPointsOnly(win)}
            </span>
          );
        }
      },
      {
        title: 'Tổng Thua',
        dataIndex: 'totalLossAmount',
        key: 'totalLossAmount',
        className: 'text-right',
        render: (value) => {
          const loss = Number(value ?? 0);
          return (
            <span className="text-sm font-bold text-red-600">
              {formatPointsOnly(loss)}
            </span>
          );
        }
      },
      {
        title: 'Tổng thắng/thua',
        key: 'netWinLoss',
        className: 'text-right',
        render: (_, record) => {
          const win = Number(record.totalWinAmount ?? 0);
          const loss = Number(record.totalLossAmount ?? 0);
          const net = win - loss;
          return (
            <span className={`text-sm font-bold ${net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPointsOnly(net)}
            </span>
          );
        }
      },
      {
        title: 'Tổng Nạp',
        dataIndex: 'totalDepositAmount',
        key: 'totalDepositAmount',
        className: 'text-right',
        render: (value) => <span className="text-sm text-gray-900">{formatPointsFromVND(Number(value ?? 0))}</span>
      },
      {
        title: 'Tổng Rút',
        dataIndex: 'totalWithdrawAmount',
        key: 'totalWithdrawAmount',
        className: 'text-right',
        render: (value) => <span className="text-sm text-gray-900">{formatPointsFromVND(Number(value ?? 0))}</span>
      },
      {
        title: 'Số dư điểm',
        dataIndex: 'currentBalance',
        key: 'currentBalance',
        className: 'text-right',
        render: (value) => (
          <span className="text-sm text-gray-900">{formatPointsOnly(value)}</span>
        )
      },
      {
        title: 'IP',
        dataIndex: 'firstLoginIp',
        key: 'firstLoginIp',
        width: 75,
        render: (value) => <IpCell ip={value} />
      },
      {
        title: 'Thao tác',
        key: 'actions',
        render: (_, record) => (
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => openDetail(record)}
            className="gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Chi tiết
          </Button>
        )
      }
    ],
    []
  );


  return (
    <div className="space-y-4">
      {/* Filter Section */}
      <Card className="rounded-2xl">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tìm theo tài khoản/tên
              </label>
              <Input
                placeholder="Tài khoản / tên"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mã đại lý
              </label>
              <Input
                placeholder="Mã đại lý"
                value={agentCode}
                onChange={(e) => setAgentCode(e.target.value)}
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Khoảng thời gian
              </label>
              <DateRangePicker
                value={dateRange}
                onChange={(value) => setDateRange(value)}
                placeholder={['Từ ngày', 'Đến ngày']}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="gap-1 rounded-2xl"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Đặt lại
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Table */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Báo cáo thắng/thua người dùng</h3>
        <Card>
          <CardContent className="p-0">
            <Table
              columns={summaryColumns}
              dataSource={summaryData}
              loading={summaryLoading}
              rowKey="userId"
            />
            {summaryTotal > 0 && (
              <div className="p-4 border-t border-gray-200">
                <Pagination
                  current={summaryPage}
                  pageSize={summarySize}
                  total={summaryTotal}
                  onChange={(page, pageSize) => {
                    setSummaryPage(page);
                    setSummarySize(pageSize);
                  }}
                  onShowSizeChange={(page, pageSize) => {
                    setSummaryPage(page);
                    setSummarySize(pageSize);
                  }}
                  showSizeChanger
                  pageSizeOptions={['10', '20', '50', '100']}
                  showTotal={(total, range) => `${numberFormatter.format(range[0])}-${numberFormatter.format(range[1])} của ${numberFormatter.format(total)} bản ghi`}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detail Modal */}
      <UserBetDetailModal
        open={detailVisible}
        onClose={handleDetailClose}
        selectedUser={selectedUser}
        detailData={detailData}
        detailLoading={detailLoading}
        detailMeta={detailMeta}
        detailSummary={detailSummary}
        detailFilters={detailFilters}
        onFilterChange={handleDetailFilterChange}
        onPaginationChange={handleDetailPaginationChange}
      />
    </div>
  );
};

export default AdminUserBetHistory;
