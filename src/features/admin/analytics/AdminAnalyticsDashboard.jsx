import { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import adminService from '../services/adminService';
import { formatPoints as formatPointsFromVND } from '../../../utils/helpers';
import FilterForm from './components/FilterForm';
import StatCard from './components/StatCard';
import BetTable from './components/BetTable';
import TransactionTable from './components/TransactionTable';

// Formatter cho điểm (value đã là điểm rồi, không cần chia 1000) - dùng cho BETTING
const pointFormatter = new Intl.NumberFormat('vi-VN', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

// Hàm format điểm cho BETTING (value đã là điểm rồi, không cần chia 1000) - bỏ chữ "điểm"
const formatPointsDisplay = (points) => {
  if (!points && points !== 0) return '0';
  return pointFormatter.format(Number(points ?? 0));
};

// Hàm format điểm cho TRANSACTION (value là VND, cần chia 1000) - bỏ chữ "điểm"
const formatPoints = (amount) => {
  if (!amount && amount !== 0) return '0';
  const points = Number(amount) / 1000;
  const formatter = new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: true
  });
  return formatter.format(points);
};

const numberFormatter = new Intl.NumberFormat('vi-VN');

const DEFAULT_PAGE_SIZE = 20;

const buildDefaultFilters = () => {
  return {
    dateRange: null,
    gameType: 'all',
    betStatus: 'all',
    transactionType: 'all',
    transactionStatus: 'all',
  };
};

// Hàm xác định màu cho giá trị - đồng đều hơn, dùng màu như button trong design
const getValueColor = (type, value = 0) => {
  const numValue = Number(value);
  
  // Cho các giá trị tiền tệ - chỉ dùng xanh dương cho dương (như button), đỏ cho âm, đen cho trung tính
  if (type === 'positive' || numValue > 0) {
    return 'text-blue-600';
  }
  if (type === 'negative' || numValue < 0) {
    return 'text-red-600';
  }
  // Mặc định - màu đen cho giá trị trung tính
  return 'text-gray-900';
};

const AdminAnalyticsDashboard = () => {
  const [filters, setFilters] = useState(buildDefaultFilters);
  const [betPagination, setBetPagination] = useState({ current: 1, pageSize: DEFAULT_PAGE_SIZE, total: 0 });
  const [txnPagination, setTxnPagination] = useState({ current: 1, pageSize: DEFAULT_PAGE_SIZE, total: 0 });
  const [betData, setBetData] = useState([]);
  const [betSummary, setBetSummary] = useState({});
  const [transactionData, setTransactionData] = useState([]);
  const [transactionSummary, setTransactionSummary] = useState({});
  const [betLoading, setBetLoading] = useState(false);
  const [transactionLoading, setTransactionLoading] = useState(false);

  const dateRangeKey = useMemo(() => {
    if (!filters.dateRange) {
      return '';
    }
    return filters.dateRange.map((item) => (item ? item.toISOString() : '')).join('|');
  }, [filters.dateRange]);

  const fetchBetAnalytics = useCallback(async () => {
    setBetLoading(true);
    try {
      const [startDate, endDate] = filters.dateRange || [];
      const response = await adminService.getBetAnalytics({
        gameType: filters.gameType,
        status: filters.betStatus,
        startDate: startDate ? dayjs(startDate).startOf('day').toISOString() : undefined,
        endDate: endDate ? dayjs(endDate).endOf('day').toISOString() : undefined,
        page: betPagination.current - 1,
        size: betPagination.pageSize,
      });
      const payload = response?.data;
      setBetData(payload?.items ?? []);
      setBetSummary(payload?.summary ?? {});
      setBetPagination((prev) => ({
        ...prev,
        total: payload?.totalItems ?? 0,
      }));
    } catch (error) {
      console.error('Lỗi khi tải báo cáo cược:', error);
    } finally {
      setBetLoading(false);
    }
  }, [filters.gameType, filters.betStatus, filters.dateRange, betPagination.current, betPagination.pageSize]);

  const fetchTransactionAnalytics = useCallback(async () => {
    setTransactionLoading(true);
    try {
      const [startDate, endDate] = filters.dateRange || [];
      const response = await adminService.getTransactionAnalytics({
        type: filters.transactionType,
        status: filters.transactionStatus,
        startDate: startDate ? dayjs(startDate).startOf('day').toISOString() : undefined,
        endDate: endDate ? dayjs(endDate).endOf('day').toISOString() : undefined,
        page: txnPagination.current - 1,
        size: txnPagination.pageSize,
      });
      const payload = response?.data;
      setTransactionData(payload?.items ?? []);
      setTransactionSummary(payload?.summary ?? {});
      setTxnPagination((prev) => ({
        ...prev,
        total: payload?.totalItems ?? 0,
      }));
    } catch (error) {
      console.error('Lỗi khi tải báo cáo nạp rút:', error);
    } finally {
      setTransactionLoading(false);
    }
  }, [filters.transactionType, filters.transactionStatus, filters.dateRange, txnPagination.current, txnPagination.pageSize]);

  useEffect(() => {
    fetchBetAnalytics();
  }, [fetchBetAnalytics, dateRangeKey]);

  useEffect(() => {
    fetchTransactionAnalytics();
  }, [fetchTransactionAnalytics, dateRangeKey]);

  const handleFilterSubmit = (formData) => {
    const nextFilters = {
      dateRange: formData.dateRange ?? null,
      gameType: formData.gameType ?? 'all',
      betStatus: formData.betStatus ?? 'all',
      transactionType: formData.transactionType ?? 'all',
      transactionStatus: formData.transactionStatus ?? 'all',
    };
    setFilters(nextFilters);
    setBetPagination((prev) => ({ ...prev, current: 1 }));
    setTxnPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleResetFilters = (defaults) => {
    setFilters(defaults);
    setBetPagination({ current: 1, pageSize: DEFAULT_PAGE_SIZE, total: 0 });
    setTxnPagination({ current: 1, pageSize: DEFAULT_PAGE_SIZE, total: 0 });
  };

  const handleBetPaginationChange = (newPagination) => {
    setBetPagination((prev) => ({
      ...prev,
      current: newPagination.current ?? 1,
      pageSize: newPagination.pageSize ?? prev.pageSize,
    }));
  };

  const handleTransactionPaginationChange = (newPagination) => {
    setTxnPagination((prev) => ({
      ...prev,
      current: newPagination.current ?? 1,
      pageSize: newPagination.pageSize ?? prev.pageSize,
    }));
  };

  // Tính toán lợi nhuận
  const calculateProfit = () => {
    const doanhThu = Number(betSummary.totalWinAmount ?? 0) - Number(betSummary.totalLostAmount ?? 0);
    const totalRefund = Number(betSummary.totalRefund ?? 0);
    const totalDailyLossRefund = Number(betSummary.totalDailyLossRefund ?? 0);
    const totalAgentCommission = Number(betSummary.totalAgentCommission ?? 0);
    const totalFee = filters.gameType === 'all' 
      ? (Number(betSummary.sicboTotalFee ?? 0) + Number(betSummary.xocDiaTotalFee ?? 0))
      : Number(betSummary.totalFee ?? 0);
    const totalBao = Number(betSummary.totalBao ?? 0);
    const totalPromotionalMoney = Number(betSummary.totalPromotionalMoney ?? 0);
    const tongCacKhoanTru = totalRefund + totalDailyLossRefund + totalAgentCommission + totalFee + totalBao + totalPromotionalMoney;
    return doanhThu - tongCacKhoanTru;
  };

  // Tính doanh thu
  const calculateRevenue = () => {
    return Number(betSummary.totalWinAmount ?? 0) - Number(betSummary.totalLostAmount ?? 0);
  };

  // Tính thắng/thua xổ số
  const calculateLotteryWinLoss = () => {
    return Number(betSummary.lotteryWinAmount ?? 0) - Number(betSummary.lotteryLostAmount ?? 0);
  };

  return (
    <div className="space-y-4">
      {/* Filter Section - Compact */}
      <FilterForm
        filters={filters}
        onFilterSubmit={handleFilterSubmit}
        onReset={handleResetFilters}
      />

      {/* Phần 1: Thống kê cược */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Thống kê cược</h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          <StatCard
            title="Tổng tiền cược"
            value={formatPointsDisplay(betSummary.totalStake ?? 0)}
            valueColor="text-white"
            bgColor="bg-blue-600"
            textColor="text-white"
          />
          <StatCard
            title="Tổng tiền thắng"
            value={formatPointsDisplay(betSummary.totalWinAmount ?? 0)}
            valueColor="text-white"
            bgColor="bg-green-600"
            textColor="text-white"
          />
          <StatCard
            title="Tổng tiền thua"
            value={formatPointsDisplay(betSummary.totalLostAmount ?? 0)}
            valueColor="text-white"
            bgColor="bg-red-600"
            textColor="text-white"
          />
          <StatCard
            title="Doanh thu"
            value={formatPointsDisplay(calculateRevenue())}
            valueColor="text-white"
            bgColor="bg-purple-600"
            textColor="text-white"
          />
          <StatCard
            title="Lợi nhuận"
            value={formatPointsDisplay(calculateProfit())}
            valueColor="text-white"
            bgColor="bg-emerald-600"
            textColor="text-white"
          />
        </div>
      </div>

      {/* Phần 2 & 3: Chi phí & Khấu trừ và Giao dịch */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Chi phí & Khấu trừ */}
        <div className="lg:col-span-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Chi phí & Khấu trừ</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {filters.gameType === 'all' ? (
              <>
                <StatCard
                  title="Tài Xỉu Thu Phế"
                  value={formatPointsDisplay(betSummary.sicboTotalFee ?? 0)}
                  valueColor="text-white"
                  bgColor="bg-indigo-600"
                  textColor="text-white"
                />
                <StatCard
                  title="Xóc Đĩa Thu Phế"
                  value={formatPointsDisplay(betSummary.xocDiaTotalFee ?? 0)}
                  valueColor="text-white"
                  bgColor="bg-cyan-600"
                  textColor="text-white"
                />
              </>
            ) : (
              <StatCard
                title={filters.gameType === 'xocdia' ? 'Xóc Đĩa Thu Phế' : 'Tài Xỉu Thu Phế'}
                value={formatPointsDisplay(betSummary.totalFee ?? 0)}
                valueColor="text-white"
                bgColor="bg-indigo-600"
                textColor="text-white"
              />
            )}
            <StatCard
              title="Tài Xỉu Thu Bão"
              value={formatPointsDisplay(betSummary.totalBao ?? 0)}
              valueColor="text-white"
              bgColor="bg-orange-600"
              textColor="text-white"
            />
            <StatCard
              title="Hoàn trả"
              value={formatPointsDisplay(betSummary.totalRefund ?? 0)}
              valueColor="text-white"
              bgColor="bg-yellow-600"
              textColor="text-white"
            />
            <StatCard
              title="Hoàn thua theo ngày"
              value={formatPointsDisplay(betSummary.totalDailyLossRefund ?? 0)}
              valueColor="text-white"
              bgColor="bg-pink-600"
              textColor="text-white"
            />
            <StatCard
              title="Hoa hồng đại lý"
              value={formatPointsDisplay(betSummary.totalAgentCommission ?? 0)}
              valueColor="text-white"
              bgColor="bg-amber-600"
              textColor="text-white"
            />
            <StatCard
              title="Khuyến mãi"
              value={formatPointsDisplay(betSummary.totalPromotionalMoney ?? 0)}
              valueColor="text-white"
              bgColor="bg-teal-600"
              textColor="text-white"
            />
            <StatCard
              title="Thắng/Thua XS"
              value={formatPointsDisplay(calculateLotteryWinLoss())}
              valueColor="text-white"
              bgColor="bg-violet-600"
              textColor="text-white"
            />
          </div>
        </div>

        {/* Giao dịch */}
        <div className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Giao dịch</h3>
          <div className="grid grid-cols-3 gap-2">
            <StatCard
              title="Tổng số giao dịch"
              value={numberFormatter.format(Number(transactionSummary.totalCount ?? 0))}
              valueColor="text-white"
              bgColor="bg-slate-600"
              textColor="text-white"
            />
            <StatCard
              title="Tổng số tiền"
              value={formatPoints(transactionSummary.totalAmount ?? 0)}
              valueColor="text-white"
              bgColor="bg-sky-600"
              textColor="text-white"
            />
            <StatCard
              title="Tổng thực nhận"
              value={formatPoints(transactionSummary.totalNetAmount ?? 0)}
              valueColor="text-white"
              bgColor="bg-lime-600"
              textColor="text-white"
            />
          </div>
        </div>
      </div>

      {/* Bảng báo cáo cược - Full width */}
      <div>
        <BetTable
          data={betData}
          loading={betLoading}
          pagination={betPagination}
          onPaginationChange={handleBetPaginationChange}
        />
      </div>

      {/* Bảng báo cáo giao dịch - Full width */}
      <div>
        <TransactionTable
          data={transactionData}
          loading={transactionLoading}
          pagination={txnPagination}
          onPaginationChange={handleTransactionPaginationChange}
        />
      </div>
    </div>
  );
};

export default AdminAnalyticsDashboard;
