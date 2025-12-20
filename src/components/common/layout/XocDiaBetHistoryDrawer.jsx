import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import dayjs from 'dayjs';
import xocDiaBetService from '../../../services/xocDiaBetService';
import { chunkPattern, formatRatioLabel } from '../../../features/casino/pages/games/xocDiaUtils';

const STATUS_METADATA = {
  PENDING: { label: 'Đang chờ', className: 'text-yellow-600 bg-yellow-100' },
  WON: { label: 'Thắng', className: 'text-emerald-600 bg-emerald-100' },
  LOST: { label: 'Thua', className: 'text-red-600 bg-red-100' },
  REFUNDED: { label: 'Hoàn tiền', className: 'text-blue-600 bg-blue-100' },
};

const STATUS_BORDER_CLASSES = {
  PENDING: 'border-yellow-200',
  WON: 'border-emerald-200',
  LOST: 'border-red-200',
  REFUNDED: 'border-blue-200',
};

const BET_CODE_ALIASES = {
  even: 'chan',
  odd: 'le',
  'three-white': 'xiu',
  'three-red': 'tai',
};

const normalizeBetCode = (code) => {
  if (!code || typeof code !== 'string') {
    return '';
  }
  return code.trim().toLowerCase().replace(/[\s_]+/g, '-');
};

const RESULT_LABELS = {
  'four-white': '4 Trắng',
  'three-white-one-red': '3 Trắng 1 Đỏ',
  'two-two': '2 Trắng 2 Đỏ',
  'three-red-one-white': '3 Đỏ 1 Trắng',
  'four-red': '4 Đỏ',
  'four-white-or-four-red': '4 Trắng/4 Đỏ',
};

const formatSessionResult = (code) => {
  if (!code || typeof code !== 'string') {
    return null;
  }
  const normalized = normalizeBetCode(code);
  return RESULT_LABELS[normalized] || code;
};

const parseSessionResult = (code) => {
  if (!code || typeof code !== 'string') {
    return null;
  }
  const normalized = normalizeBetCode(code);
  
  // Parse pattern từ result code
  let pattern = [];
  if (normalized.includes('four-white')) {
    pattern = ['white', 'white', 'white', 'white'];
  } else if (normalized.includes('four-red')) {
    pattern = ['red', 'red', 'red', 'red'];
  } else if (normalized.includes('three-white-one-red')) {
    pattern = ['white', 'white', 'white', 'red'];
  } else if (normalized.includes('three-red-one-white')) {
    pattern = ['red', 'red', 'red', 'white'];
  } else if (normalized.includes('two-two')) {
    pattern = ['white', 'white', 'red', 'red'];
  } else {
    return null;
  }
  
  // Tính toán thông tin
  const redCount = pattern.filter(c => c === 'red').length;
  const whiteCount = pattern.filter(c => c === 'white').length;
  const parity = redCount % 2 === 0 ? 'Chẵn' : 'Lẻ';
  const size = redCount >= 3 ? 'Tài' : redCount <= 1 ? 'Xỉu' : 'Hòa';
  
  return {
    pattern,
    redCount,
    whiteCount,
    parity,
    size,
    label: RESULT_LABELS[normalized] || code,
  };
};

const BetHistoryItem = ({ item, option }) => {
  const meta = STATUS_METADATA[item.status] ?? STATUS_METADATA.PENDING;
  const borderClass = STATUS_BORDER_CLASSES[item.status] ?? 'border-gray-200';

  const formattedStake = useMemo(
    () => Number(item.stake ?? 0).toLocaleString('vi-VN'),
    [item.stake]
  );

  const formattedWinAmount = useMemo(() => {
    if (item.winAmount == null) {
      return '-';
    }
    return Number(item.winAmount).toLocaleString('vi-VN');
  }, [item.winAmount]);

  const createdAt = item.createdAt ? dayjs(item.createdAt).format('DD/MM/YYYY HH:mm') : '---';
  const normalizedResultCode = normalizeBetCode(item.resultCode);
  const patternRows = useMemo(
    () => (option?.pattern?.length ? chunkPattern(option.pattern) : []),
    [option?.pattern]
  );
  const ratioLabel = useMemo(() => {
    const multiplier = item.payoutMultiplier ?? option?.payoutMultiplier;
    if (!multiplier) {
      return '';
    }
    return formatRatioLabel(multiplier);
  }, [item.payoutMultiplier, option?.payoutMultiplier]);
  const betLabel = option?.label ?? item.betCode;
  const sessionResult = useMemo(() => {
    // Debug log
    if (item.sessionResultCode) {
      console.log('[XocDia History] Session result code:', item.sessionResultCode, 'for bet:', item.id);
    }
    return parseSessionResult(item.sessionResultCode);
  }, [item.sessionResultCode, item.id]);

  return (
    <div className={`rounded-xl border ${borderClass} bg-white px-4 py-3 shadow-sm flex flex-col gap-3`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 text-[11px] text-gray-600">
          {item.sessionId ? (
            <span className="font-semibold uppercase tracking-wide text-gray-600">Phiên #{item.sessionId}</span>
          ) : null}
        </div>
        <span className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${meta.className}`}>
          {meta.label}
        </span>
      </div>

      <div className="flex-1 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
        <div className="grid h-full grid-cols-2 divide-x divide-gray-100">
          <div className="flex flex-col justify-center gap-2 p-3 text-[11px]">
            <span className="font-semibold uppercase tracking-wide text-gray-700">Loại cược</span>
            {patternRows.length > 0 ? (
              <div className="flex flex-col gap-1">
                {patternRows.map((row, rowIndex) => (
                  <div key={`${item.id}-pattern-row-${rowIndex}`} className="flex items-center gap-1">
                    {row.map((color, index) => (
                      <span
                        key={`${item.id}-pattern-${rowIndex}-${index}`}
                        className={`h-3.5 w-3.5 rounded-full border shadow-sm ${
                          color === 'white'
                            ? 'border-gray-600 bg-white'
                            : 'border-[#9f1d1d] bg-[#e43f3f]'
                        }`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ) : betLabel ? (
              <span className="inline-flex min-h-[28px] items-center justify-start rounded-md bg-white px-3 font-semibold uppercase text-gray-800 shadow-sm">
                {betLabel}
              </span>
            ) : null}
            {ratioLabel ? (
              <span className="font-medium text-gray-600">{ratioLabel}</span>
            ) : null}
          </div>

          <div className="flex flex-col justify-center gap-2 p-3 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-600">Tổng cược</span>
              <span className="font-semibold text-gray-900">{formattedStake}</span>
        </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-600">Thắng cược</span>
              <span className="font-semibold text-gray-900">{formattedWinAmount}</span>
      </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-600">Ngày cược</span>
              <span className="font-semibold text-gray-900">{createdAt}</span>
        </div>
        </div>
        </div>
      </div>

      {item.sessionResultCode ? (
        <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-700">
            Kết quả
          </span>
          {sessionResult ? (
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1">
                {sessionResult.pattern.map((color, index) => (
                  <span
                    key={`session-result-${item.id}-${index}`}
                    className={`h-3.5 w-3.5 rounded-full border shadow-sm ${
                      color === 'white'
                        ? 'border-gray-600 bg-white'
                        : 'border-[#9f1d1d] bg-[#e43f3f]'
                    }`}
                  />
                ))}
              </div>
              <div className="text-[11px] text-gray-600 leading-tight">
                <div>{sessionResult.label}</div>
                <div>
                  {sessionResult.parity}
                  {' • '}
                  {sessionResult.size}
                </div>
              </div>
            </div>
          ) : (
            <span className="text-[11px] text-gray-600">{item.sessionResultCode}</span>
          )}
        </div>
      ) : null}
    </div>
  );
};

const XocDiaBetHistoryDrawer = ({ isOpen, onClose, optionLookup }) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState('');
  const [daysFilter, setDaysFilter] = useState(0); // Mặc định Hôm nay
  const [totals, setTotals] = useState({
    totalWinAmount: 0,
    totalLossAmount: 0,
  });
  const loadingRef = useRef(false);

  const formattedTotalWinAmount = useMemo(
    () => Number(totals.totalWinAmount ?? 0).toLocaleString('vi-VN'),
    [totals.totalWinAmount]
  );

  const formattedTotalLossAmount = useMemo(
    () => Number(totals.totalLossAmount ?? 0).toLocaleString('vi-VN'),
    [totals.totalLossAmount]
  );

  const loadHistory = useCallback(
    async (pageToLoad = 0) => {
      if (loadingRef.current) {
        return;
      }

      loadingRef.current = true;
      setLoading(true);
      setError('');

      const response = await xocDiaBetService.fetchBetHistory({ 
        page: pageToLoad, 
        size: 10,
        days: daysFilter 
      });

      if (!response.success) {
        setError(response.message || 'Không thể tải lịch sử cược');
        setLoading(false);
        loadingRef.current = false;
        return;
      }

      const data = response.data || {};
      const fetchedItems = Array.isArray(data.items) ? data.items : [];
      
      // Debug log để kiểm tra dữ liệu
      if (fetchedItems.length > 0) {
        console.log('[XocDia History] Fetched items:', fetchedItems.length);
        console.log('[XocDia History] First item:', fetchedItems[0]);
        console.log('[XocDia History] First item sessionResultCode:', fetchedItems[0]?.sessionResultCode);
      }

      const rawTotalWin = Number(data.totalWinAmount ?? 0);
      const rawTotalLoss = Number(data.totalLossAmount ?? 0);
      setTotals({
        totalWinAmount: Number.isNaN(rawTotalWin) ? 0 : rawTotalWin,
        totalLossAmount: Number.isNaN(rawTotalLoss) ? 0 : rawTotalLoss,
      });

      setItems((prev) => (pageToLoad === 0 ? fetchedItems : [...prev, ...fetchedItems]));
      setPage(data.page ?? pageToLoad);
      setHasMore(Boolean(data.hasMore));
      setLoading(false);
      loadingRef.current = false;
    },
    [daysFilter]
  );

  useEffect(() => {
    if (!isOpen) {
      setItems([]);
      setPage(0);
      setHasMore(true);
      setError('');
      setLoading(false);
      loadingRef.current = false;
      setTotals({
        totalWinAmount: 0,
        totalLossAmount: 0,
      });
      setDaysFilter(0);
      return;
    }

    setInitialLoading(true);
    setItems([]);
    setPage(0);
    setHasMore(true);
    setError('');

    loadHistory(0).finally(() => {
      setInitialLoading(false);
    });
  }, [isOpen, daysFilter, loadHistory]);

  useEffect(() => {
    return () => {
      loadingRef.current = false;
    };
  }, []);

  const handleLoadMore = () => {
    if (loading || !hasMore) {
      return;
    }
    loadHistory(page + 1);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[98] transition-opacity duration-300 ${
          isOpen ? 'visible opacity-100 bg-black/40' : 'invisible opacity-0'
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-0 md:inset-y-0 md:right-0 md:left-auto h-full w-full md:w-full md:max-w-[420px] bg-white shadow-2xl z-[99] transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="h-16 px-5 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              aria-label="Đóng lịch sử"
            >
              <Icon icon="mdi:arrow-left" className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">Lịch sử cược Xóc Đĩa</h2>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={daysFilter}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                setDaysFilter(value);
              }}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="0">Hôm nay</option>
              <option value="-1">Hôm qua</option>
              <option value="7">7 ngày</option>
              <option value="14">14 ngày</option>
            </select>
          <button
            type="button"
            onClick={onClose}
            className="hidden md:flex w-9 h-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <Icon icon="mdi:close" className="w-5 h-5" />
          </button>
          </div>
        </header>

        <div className="h-[calc(100%-64px)] overflow-y-auto px-6 py-5 space-y-4">
          {!initialLoading && !error ? (
            <div className="rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm">
              <div className="flex items-stretch justify-between gap-3 text-sm">
                <div className="flex-1 min-w-0 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-center">
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Tổng thắng cược
                  </span>
                  <span className="block text-base font-bold text-emerald-600 whitespace-nowrap">
                    {formattedTotalWinAmount}
                  </span>
                </div>
                <div className="flex-1 min-w-0 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-center">
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Tổng thua cược
                  </span>
                  <span className="block text-base font-bold text-red-600 whitespace-nowrap">
                    {formattedTotalLossAmount}
                  </span>
                </div>
              </div>
            </div>
          ) : null}
          {initialLoading ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              <Icon icon="mdi:loading" className="w-6 h-6 animate-spin mb-2" />
              Đang tải lịch sử cược...
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          ) : items.length === 0 ? (
            <div className="bg-gray-50 border border-dashed border-gray-200 text-gray-500 px-4 py-8 rounded-xl text-center text-sm">
              Chưa có lịch sử cược nào.
            </div>
          ) : (
            items.map((item) => {
              const normalizedCode = normalizeBetCode(item.betCode);
              const aliasCode = BET_CODE_ALIASES[normalizedCode] || normalizedCode;
              const option =
                optionLookup?.get(normalizedCode) ||
                optionLookup?.get(aliasCode) ||
                optionLookup?.get(item.betCode);

              return <BetHistoryItem key={item.id} item={item} option={option} />;
            })
          )}

          {items.length > 0 && hasMore ? (
            <button
              type="button"
              disabled={loading}
              onClick={handleLoadMore}
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-2 text-sm font-semibold text-gray-700 hover:border-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
                  Đang tải...
                </>
              ) : (
                <>
                  <Icon icon="mdi:chevron-down" className="w-4 h-4" />
                  Xem thêm
                </>
              )}
            </button>
          ) : null}
        </div>
      </aside>
    </>
  );
};

export default XocDiaBetHistoryDrawer;


