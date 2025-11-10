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

  return (
    <div className={`rounded-xl border ${borderClass} bg-white px-4 py-3 shadow-sm flex flex-col gap-3 min-h-[152px]`}>
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
  const loadingRef = useRef(false);

  const loadHistory = useCallback(
    async (pageToLoad = 0) => {
      if (loadingRef.current) {
        return;
      }

      loadingRef.current = true;
      setLoading(true);
      setError('');

      const response = await xocDiaBetService.fetchBetHistory({ page: pageToLoad, size: 10 });

      if (!response.success) {
        setError(response.message || 'Không thể tải lịch sử cược');
        setLoading(false);
        loadingRef.current = false;
        return;
      }

      const data = response.data || {};
      const fetchedItems = Array.isArray(data.items) ? data.items : [];

      setItems((prev) => (pageToLoad === 0 ? fetchedItems : [...prev, ...fetchedItems]));
      setPage(data.page ?? pageToLoad);
      setHasMore(Boolean(data.hasMore));
      setLoading(false);
      loadingRef.current = false;
    },
    []
  );

  useEffect(() => {
    if (!isOpen) {
      setItems([]);
      setPage(0);
      setHasMore(true);
      setError('');
      setLoading(false);
      loadingRef.current = false;
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
  }, [isOpen, loadHistory]);

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
            >
              <Icon icon="mdi:arrow-left" className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">Lịch sử cược Xóc Đĩa</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="hidden md:flex w-9 h-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <Icon icon="mdi:close" className="w-5 h-5" />
          </button>
        </header>

        <div className="h-[calc(100%-64px)] overflow-y-auto px-6 py-5 space-y-4">
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


