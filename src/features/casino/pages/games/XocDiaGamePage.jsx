import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import pointService from '../../../../services/pointService';
import xocDiaQuickBetService from '../../../../services/xocDiaQuickBetService';

const CACHE_KEY = 'user_info_cache';
const CACHE_DURATION_MS = 30000;

const gameName = 'Xóc Đĩa Jackpot';

const defaultQuickBetConfigs = [
  {
    code: 'even',
    label: 'Chẵn',
    payoutMultiplier: 1.96,
    pattern: [],
    layoutGroup: 'TOP',
    displayOrder: 1,
  },
  {
    code: 'two-two',
    label: '2 Trắng 2 Đỏ',
    payoutMultiplier: 2.55,
    pattern: ['white', 'white', 'red', 'red'],
    layoutGroup: 'TOP',
    displayOrder: 2,
  },
  {
    code: 'odd',
    label: 'Lẻ',
    payoutMultiplier: 1.96,
    pattern: [],
    layoutGroup: 'TOP',
    displayOrder: 3,
  },
  {
    code: 'four-white',
    label: '4 Trắng',
    payoutMultiplier: 14.5,
    pattern: ['white', 'white', 'white', 'white'],
    layoutGroup: 'BOTTOM',
    displayOrder: 4,
  },
  {
    code: 'three-white',
    label: 'Lớn',
    payoutMultiplier: 3.7,
    pattern: [],
    layoutGroup: 'BOTTOM',
    displayOrder: 5,
  },
  {
    code: 'three-red',
    label: 'Nhỏ',
    payoutMultiplier: 3.7,
    pattern: [],
    layoutGroup: 'BOTTOM',
    displayOrder: 6,
  },
  {
    code: 'four-red',
    label: '4 Đỏ',
    payoutMultiplier: 14.5,
    pattern: ['red', 'red', 'red', 'red'],
    layoutGroup: 'BOTTOM',
    displayOrder: 7,
  },
];

const COUNTDOWN_DURATION = 30;

const statsHistory = [
  ['4', '1', '2', '3', '2', '1', '1', '2', '1', '2', '2', '1', '2', '1', '2', '3', '2'],
  ['0', '', '1', '', '', '2', '', '1', '', '1', '2', '1', '', '1', '3', '', '2'],
];
const statsDistribution = [
  { label: 'Chẵn', value: 44, color: '#ef4444', chips: 6 },
  { label: 'Lẻ', value: 56, color: '#f9fafb', chips: 5 },
];
const statsBreakdown = [
  { label: '4 trắng', value: 3, chips: ['white', 'white', 'white', 'white'] },
  { label: '3 trắng 1 đỏ', value: 34, chips: ['white', 'white', 'white', 'red'] },
  { label: '3 đỏ 1 trắng', value: 38, chips: ['red', 'red', 'red', 'white'] },
  { label: '4 đỏ', value: 22, chips: ['red', 'red', 'red', 'red'] },
  { label: '1 đỏ 3 trắng', value: 3, chips: ['red', 'white', 'white', 'white'] },
];

const parsePatternString = (pattern) => {
  if (!pattern) return [];
  if (Array.isArray(pattern)) return pattern;
  return pattern
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const formatRatioLabel = (value) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return value ? `1 : ${value}` : '';
  }
  const formatted = Number.isInteger(numeric)
    ? numeric.toFixed(0)
    : numeric.toFixed(2).replace(/\.?0+$/, '');
  return `1 : ${formatted}`;
};

const convertConfigToOption = (config) => {
  const payoutMultiplier = config.payoutMultiplier ?? config.multiplier ?? config.ratioMultiplier ?? 0;
  return {
    code: config.code ?? config.id,
    label: config.label ?? config.name ?? '',
    ratio: formatRatioLabel(payoutMultiplier),
    payoutMultiplier,
    pattern: parsePatternString(config.pattern),
    layoutGroup: (config.layoutGroup || 'TOP').toUpperCase(),
    displayOrder: config.displayOrder ?? 0,
  };
};

const XocDiaGamePage = () => {
  const navigate = useNavigate();
  const [selectedQuickBet, setSelectedQuickBet] = useState(null);
  const [quickBetOptions, setQuickBetOptions] = useState(
    defaultQuickBetConfigs.map(convertConfigToOption).sort((a, b) => a.displayOrder - b.displayOrder)
  );
  const [quickBetLoading, setQuickBetLoading] = useState(false);
  const [quickBetError, setQuickBetError] = useState(null);
  const [countdownSeconds, setCountdownSeconds] = useState(COUNTDOWN_DURATION);
  const [countdownAngle, setCountdownAngle] = useState(360);
  const countdownResetRef = useRef(Date.now() + COUNTDOWN_DURATION * 1000);
  const countdownAngleRef = useRef(360);
  const [userPoints, setUserPoints] = useState(0);
  const [loadingPoints, setLoadingPoints] = useState(true);
  const totalBetDisplay = '0₫';
  const topQuickBets = quickBetOptions.filter((option) => option.layoutGroup === 'TOP');
  const bottomQuickBets = quickBetOptions.filter((option) => option.layoutGroup === 'BOTTOM');

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 1) {
          countdownResetRef.current = Date.now() + COUNTDOWN_DURATION * 1000;
          countdownAngleRef.current = 360;
          setCountdownAngle(360);
          return COUNTDOWN_DURATION;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let animationFrameId;

    const updateAngle = () => {
      const now = Date.now();
      const remainingMs = countdownResetRef.current - now;
      const progress = Math.max(0, Math.min(1, remainingMs / (COUNTDOWN_DURATION * 1000)));
      const angle = progress * 360;

      if (Math.abs(angle - countdownAngleRef.current) > 0.5) {
        countdownAngleRef.current = angle;
        setCountdownAngle(angle);
      }

      animationFrameId = requestAnimationFrame(updateAngle);
    };

    animationFrameId = requestAnimationFrame(updateAngle);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchQuickBets = async () => {
      try {
        setQuickBetLoading(true);
        const response = await xocDiaQuickBetService.getActiveQuickBets();

        if (!isMounted) return;

        if (response.success && Array.isArray(response.data) && response.data.length > 0) {
          const options = response.data
            .map(convertConfigToOption)
            .sort((a, b) => a.displayOrder - b.displayOrder);

          setQuickBetOptions(options);
          setQuickBetError(null);
        } else if (!response.success) {
          setQuickBetError(response.message || 'Không thể tải cấu hình quick bet');
        }
      } catch (error) {
        if (!isMounted) return;
        setQuickBetError('Không thể tải cấu hình quick bet');
      } finally {
        if (isMounted) {
          setQuickBetLoading(false);
        }
      }
    };

    fetchQuickBets();

    const updateStoredUserData = (points) => {
      try {
        const storedUser = localStorage.getItem('user');
        const userData = storedUser ? JSON.parse(storedUser) : {};
        userData.points = points;
        localStorage.setItem('user', JSON.stringify(userData));
        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: userData, timestamp: Date.now() })
        );
      } catch (error) {
        // Ignore storage errors silently
      }
    };

    const loadPointsFromCache = () => {
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp > CACHE_DURATION_MS) {
          return null;
        }
        if (data && typeof data.points === 'number') {
          return data.points;
        }
        return null;
      } catch (error) {
        return null;
      }
    };

    const loadPointsFromLocalStorage = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          if (typeof userData.points === 'number') {
            return userData.points;
          }
        }
      } catch (error) {
        // Ignore parse errors
      }
      return 0;
    };

    const fetchPoints = async () => {
      if (!isMounted) return;
      setLoadingPoints(true);

      const cachedPoints = loadPointsFromCache();
      if (cachedPoints !== null) {
        setUserPoints(cachedPoints);
        setLoadingPoints(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          const pointsFromStorage = loadPointsFromLocalStorage();
          if (isMounted) {
            setUserPoints(pointsFromStorage);
            setLoadingPoints(false);
          }
          return;
        }

        const response = await pointService.getMyPoints();
        if (!isMounted) return;

        if (response?.success) {
          const points = response.data?.totalPoints ?? response.data?.points ?? 0;
          setUserPoints(points);
          updateStoredUserData(points);
        } else {
          const pointsFromStorage = loadPointsFromLocalStorage();
          setUserPoints(pointsFromStorage);
        }
      } catch (error) {
        if (!isMounted) return;
        const pointsFromStorage = loadPointsFromLocalStorage();
        setUserPoints(pointsFromStorage);
      } finally {
        if (isMounted) {
          setLoadingPoints(false);
        }
      }
    };

    fetchPoints();

    return () => {
      isMounted = false;
    };
  }, []);

  const balanceDisplay = loadingPoints
    ? 'Đang tải...'
    : `${Number(userPoints || 0).toLocaleString('vi-VN')}₫`;

  const countdownCircleStyle = {
    background: `conic-gradient(#facc15 ${countdownAngle}deg, #1c5b3f ${countdownAngle}deg)`,
  };

  const flatStats = statsHistory.flat();
  const columns = 17;
  const rows = 6;
  const totalCells = columns * rows;
  const sequence = [...flatStats, ...Array(Math.max(0, totalCells - flatStats.length)).fill('')].slice(0, totalCells);

  const columnsData = Array.from({ length: columns }, () => Array(rows).fill(''));
  let col = 0;
  let row = 0;
  sequence.forEach((value) => {
    columnsData[col][row] = value;
    row += 1;
    if (row === rows) {
      row = 0;
      col += 1;
    }
  });

  const statsGrid = Array.from({ length: rows }, (_, rowIndex) =>
    columnsData.map((columnValues) => columnValues[rowIndex])
  );

  const getChipClasses = (value) => {
    if (!value) return null;
    const isWhite = value === '0' || value === '1' || value === '3';
    return isWhite
      ? 'border-white bg-white text-[#1f1f1f]'
      : 'border-red-500 bg-red-500 text-white';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2 text-gray-600">
          <button
            type="button"
            onClick={() => navigate('/casino/live')}
            className="flex items-center gap-2 hover:text-gray-900 transition-colors"
          >
            <Icon icon="mdi:arrow-left" className="w-5 h-5" />
          </button>
          <h1 className="text-lg md:text-xl font-semibold text-gray-900">{gameName}</h1>
        </div>

        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
          <span className="uppercase text-red-600 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Live Casino
          </span>
          <span className="hidden md:inline">•</span>
          <span>Dealer trực tiếp</span>
        </div>
      </header>

      <main className="px-3 sm:px-3 md:px-5 lg:px-8 py-4 md:py-6">
        <div className="max-w-screen-2xl mx-auto space-y-6">
          <div className="grid gap-4 lg:gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
            <section className="relative rounded-2xl bg-gray-900 aspect-[3/2] overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent)]" />
              <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center justify-between px-4 md:px-6 py-2 border-b border-white/10">
                  <div className="flex items-center h-full">
                    <span className="text-xs uppercase tracking-wide text-white/60">Live Stream</span>
                  </div>

                  <div className="hidden md:flex items-center gap-4 text-xs md:text-sm text-white/70">
                    <span className="flex items-center gap-2">
                      <Icon icon="mdi:account" className="w-4 h-4" />
                      Dealer: Ngọc Anh
                    </span>
                    <span className="flex items-center gap-2">
                      <Icon icon="mdi:account-group" className="w-4 h-4" />
                      Người chơi: 128
                    </span>
                  </div>

                  <span className="flex items-center gap-2 text-sm text-red-400">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    Đang phát
                  </span>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-white/70">
                    <div className="w-20 h-20 rounded-full border-4 border-white/20 flex items-center justify-center">
                      <Icon icon="mdi:play" className="w-8 h-8" />
                    </div>
                    <p className="text-sm md:text-base text-center max-w-xs">
                      Live stream Xóc Đĩa sẽ hiển thị tại đây.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid gap-3 lg:gap-4 content-start">
              <div className="rounded-2xl border border-[#1aab6f]/50 bg-gradient-to-r from-[#0f4c2c] via-[#139257] to-[#17a76a] px-3 py-1.5 md:py-2 shadow-sm">
                <div className="flex flex-row flex-wrap items-center justify-between text-[#e6fff4] divide-y-0 sm:divide-x divide-[#149b60]/60 gap-x-4">
                  <div className="flex items-center justify-center px-2.5 py-0.5 md:py-1.5 sm:px-4">
                    <div
                      className="relative flex h-12 w-12 items-center justify-center rounded-full p-[3px]"
                      style={countdownCircleStyle}
                      aria-label="Đếm ngược 30 giây"
                    >
                      <span className="flex h-full w-full items-center justify-center rounded-full bg-[#0b3b24] text-[#fef3c7] shadow-inner">
                        <span className="text-[9px] font-semibold leading-none tracking-wide">
                          {countdownSeconds}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col items-center gap-0.5 px-2.5 py-0.5 md:py-1.5 sm:px-4 min-w-[110px]">
                    <span className="text-xs uppercase tracking-wide">Số dư</span>
                    <span className="text-base sm:text-lg font-semibold text-[#fef3c7]">{balanceDisplay}</span>
                  </div>
                  <div className="flex flex-1 flex-col items-center gap-0.5 px-2.5 py-0.5 md:py-1.5 sm:px-4 min-w-[110px]">
                    <span className="text-xs uppercase tracking-wide">Tổng cược</span>
                    <span className="text-base sm:text-lg font-semibold text-[#fef3c7]">{totalBetDisplay}</span>
                  </div>
                </div>
              </div>

              <section className="space-y-3">
                {quickBetError && (
                  <div className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                    {quickBetError}
                  </div>
                )}

                {quickBetLoading && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                    Đang tải tỷ lệ Quick Bet...
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2 md:gap-3">
                  {topQuickBets.map((option) => (
                    <button
                      key={option.code}
                      type="button"
                      onClick={() => setSelectedQuickBet(option.code)}
                      className={`group relative rounded-2xl border px-3 py-2 text-center shadow-sm transition ${
                        selectedQuickBet === option.code
                          ? 'border-[#f5c34a] bg-gradient-to-b from-[#1c9c65] via-[#25c37f] to-[#3adf99] text-white shadow-lg'
                          : 'border-[#63c892] bg-gradient-to-b from-[#d7f6e6] via-[#adebc8] to-[#82dfa9] hover:shadow-lg text-[#0f4c2c]'
                      }`}
                    >
                      {option.pattern.length === 0 ? (
                        <>
                          <div
                            className={`font-black uppercase tracking-wide ${
                              option.code === 'even'
                                ? 'text-[#b91c1c]'
                                : option.code === 'odd'
                                  ? 'text-[#b45309]'
                                  : selectedQuickBet === option.code
                                    ? 'text-white'
                                    : 'text-[#0f4c2c]'
                            } ${option.code === 'even' || option.code === 'odd' ? 'text-lg' : 'text-sm'}`}
                          >
                            {option.label}
                          </div>
                          <div
                            className={`mt-1 inline-block rounded-lg px-2 py-0.5 font-semibold uppercase tracking-[0.2em] leading-tight backdrop-blur-sm ${
                              selectedQuickBet === option.code
                                ? 'bg-white/20 text-white'
                                : 'bg-white/70 text-[#0f4c2c]'
                            }`}
                            style={{ fontSize: '14px' }}
                          >
                            {option.ratio}
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            className={`inline-block rounded-lg px-2 py-0.5 font-semibold uppercase tracking-[0.2em] leading-tight backdrop-blur-sm ${
                              selectedQuickBet === option.code
                                ? 'bg-white/20 text-white'
                                : 'bg-white/70 text-[#0f4c2c]'
                            }`}
                            style={{ fontSize: '14px' }}
                          >
                            {option.ratio}
                          </div>
                          <div className="mt-1.5 flex items-center justify-center gap-1">
                            {option.pattern.map((color, index) => (
                              <span
                                key={`${option.code}-${index}`}
                                className={`h-3 w-3 sm:h-4 sm:w-4 rounded-full border-2 shadow-sm transition-shadow ${
                                  color === 'white'
                                    ? 'bg-white border-black'
                                    : 'bg-[#e02020] border-black'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-4 gap-2 md:gap-3">
                  {bottomQuickBets.map((option) => (
                    <button
                      key={option.code}
                      type="button"
                      onClick={() => setSelectedQuickBet(option.code)}
                      className={`group relative rounded-2xl border px-3 py-2 text-center shadow-sm transition ${
                        selectedQuickBet === option.code
                          ? 'border-[#f5c34a] bg-gradient-to-b from-[#1c9c65] via-[#25c37f] to-[#3adf99] text-white shadow-lg'
                          : 'border-[#63c892] bg-gradient-to-b from-[#d7f6e6] via-[#adebc8] to-[#82dfa9] hover:shadow-lg text-[#0f4c2c]'
                      }`}
                    >
                      {option.pattern.length === 0 ? (
                        <>
                          <div
                            className={`font-black uppercase tracking-wide ${
                              selectedQuickBet === option.code ? 'text-white' : 'text-[#0f4c2c]'
                            } ${option.code === 'even' || option.code === 'odd' ? 'text-lg' : 'text-sm'}`}
                          >
                            {option.label}
                          </div>
                          <div
                            className={`mt-1 inline-block rounded-lg px-2 py-0.5 font-semibold uppercase tracking-[0.2em] leading-tight backdrop-blur-sm ${
                              selectedQuickBet === option.code
                                ? 'bg-white/20 text-white'
                                : 'bg-white/70 text-[#0f4c2c]'
                            }`}
                            style={{ fontSize: '14px' }}
                          >
                            {option.ratio}
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            className={`inline-block rounded-lg px-2 py-0.5 font-semibold uppercase tracking-[0.2em] leading-tight backdrop-blur-sm ${
                              selectedQuickBet === option.code
                                ? 'bg-white/20 text-white'
                                : 'bg-white/70 text-[#0f4c2c]'
                            }`}
                            style={{ fontSize: '14px' }}
                          >
                            {option.ratio}
                          </div>
                          <div className="mt-1.5 flex items-center justify-center gap-1">
                            {option.pattern.map((color, index) => (
                              <span
                                key={`${option.code}-${index}`}
                                className={`h-3 w-3 sm:h-4 sm:w-4 rounded-full border-2 shadow-sm transition-shadow ${
                                  color === 'white'
                                    ? 'bg-white border-black'
                                    : 'bg-[#e02020] border-black'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                  <input
                    type="number"
                    className="flex-1 min-w-[180px] rounded-lg border border-[#19C963]/40 px-3 py-1.5 text-sm focus:border-[#19C963] focus:ring-2 focus:ring-[#19C963]/30 outline-none"
                    placeholder="Nhập số tiền muốn cược"
                  />
                  <button className="shrink-0 px-4 py-2 rounded-lg bg-gradient-to-r from-[#17a76a] to-[#2fd683] text-white text-sm font-semibold hover:from-[#14985e] hover:to-[#29c776] transition shadow-lg shadow-[#16925f]/25">
                    Đặt cược
                  </button>
                </div>

                <section className="rounded-xl border border-[#1aab6f]/50 bg-gradient-to-br from-[#0f4c2c] via-[#139257] to-[#17a76a] px-3 py-3 text-white shadow-inner space-y-3">
                  <header className="flex items-center gap-2 text-xs font-semibold uppercase">
                    <button className="rounded-lg bg-white px-3 py-1.5 text-[#0b2919] shadow">Thống kê 1</button>
                    <button className="rounded-lg bg-white/10 px-3 py-1.5 text-white/80">Thống kê 2</button>
                  </header>

                  <div className="space-y-3">
                    <div className="rounded-lg border border-white/15 bg-white/5 p-2">
                      <div className="grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}>
                        {statsGrid.map((row, rowIndex) =>
                          row.map((cell, cellIndex) => (
                            <div key={`cell-${rowIndex}-${cellIndex}`} className="flex h-5 w-full items-center justify-center border border-white/20">
                              {cell ? (
                                <span
                                  className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border leading-none ${getChipClasses(cell)}`}
                                  style={{ fontSize: '10px' }}
                                >
                                  {cell}
                                </span>
                              ) : null}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="rounded-lg border border-white/15 bg-white/5 p-2 space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="relative h-4 w-full overflow-hidden rounded-full bg-white/20 font-semibold tracking-wide">
                            <div
                              className="absolute inset-y-0 left-0 flex items-center justify-center bg-[#ef4444] px-1 text-white"
                              style={{ width: `${statsDistribution[0].value}%` }}
                            >
                              <span style={{ fontSize: '11px', lineHeight: '1.1' }}>{`${statsDistribution[0].value}%`}</span>
                            </div>
                            <div
                              className="absolute inset-y-0 right-0 flex items-center justify-center bg-white px-1 text-[#0f3b20] font-semibold"
                              style={{ width: `${statsDistribution[1].value}%` }}
                            >
                              <span style={{ fontSize: '11px', lineHeight: '1.1' }}>{`${statsDistribution[1].value}%`}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.25em]">
                            <span className="flex items-center gap-1 text-white">
                              <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
                              <span>Chẵn</span>
                            </span>
                            <span className="flex items-center gap-1 text-white">
                              <span className="h-2 w-2 rounded-full bg-white" />
                              <span>Lẻ</span>
                            </span>
                          </div>
                        </div>

                      <div className="grid grid-cols-5 gap-y-2 text-center text-[10px] text-white uppercase">
                        {statsBreakdown.map((item) => (
                          <div key={item.label} className="flex flex-col items-center gap-1">
                            <div className="flex gap-1">
                              {item.chips.map((color, index) => (
                                <span
                                  key={`${item.label}-${index}`}
                                  className={`h-3 w-3 rounded-full border ${
                                    color === 'red'
                                      ? 'border-red-500 bg-red-500'
                                      : 'border-white bg-white'
                                  }`}
                                />
                              ))}
                            </div>
                            <span>{item.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default XocDiaGamePage;

