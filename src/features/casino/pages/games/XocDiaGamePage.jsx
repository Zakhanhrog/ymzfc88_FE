import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import pointService from '../../../../services/pointService';

const CACHE_KEY = 'user_info_cache';
const CACHE_DURATION_MS = 30000;

const gameName = 'Xóc Đĩa Jackpot';

const quickBetOptions = [
  {
    id: 'even',
    label: 'Chẵn',
    ratio: '1 : 1.96',
    pattern: [],
  },
  {
    id: 'two-two',
    label: '2 Trắng 2 Đỏ',
    ratio: '1 : 2.55',
    pattern: ['white', 'white', 'red', 'red'],
  },
  {
    id: 'odd',
    label: 'Lẻ',
    ratio: '1 : 1.96',
    pattern: [],
  },
  {
    id: 'four-white',
    label: '4 Trắng',
    ratio: '1 : 14.5',
    pattern: ['white', 'white', 'white', 'white'],
  },
  {
    id: 'three-white',
    label: 'Lớn',
    ratio: '1 : 3.7',
    pattern: [],
  },
  {
    id: 'three-red',
    label: 'Nhỏ',
    ratio: '1 : 3.7',
    pattern: [],
  },
  {
    id: 'four-red',
    label: '4 Đỏ',
    ratio: '1 : 14.5',
    pattern: ['red', 'red', 'red', 'red'],
  },
];

const topQuickBets = quickBetOptions.slice(0, 3);
const bottomQuickBets = quickBetOptions.slice(3);
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

const XocDiaGamePage = () => {
  const navigate = useNavigate();
  const [selectedQuickBet, setSelectedQuickBet] = useState(null);
  const [userPoints, setUserPoints] = useState(0);
  const [loadingPoints, setLoadingPoints] = useState(true);
  const totalBetDisplay = '0₫';

  useEffect(() => {
    let isMounted = true;

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

      <main className="px-0 sm:px-2 md:px-3 lg:px-4 py-4 md:py-6">
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
              <div className="rounded-2xl border border-[#2f2618]/80 bg-gradient-to-r from-[#3b3224] via-[#2b241b] to-[#201910] px-3 py-2 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center text-[#f6cf6a] divide-y sm:divide-y-0 sm:divide-x divide-[#4d402c]">
                  <div className="flex items-center justify-center w-full sm:w-auto px-4 py-2 sm:py-0">
                    <Icon icon="mdi:casino-chip" className="w-6 h-6 sm:w-7 sm:h-7 text-[#f4c564]" />
                  </div>
                  <div className="flex flex-1 flex-col items-center gap-0.5 px-4 py-2 sm:py-0">
                    <span className="text-xs uppercase tracking-wide">Số dư</span>
                    <span className="text-sm sm:text-base font-semibold text-[#ffbf47]">{balanceDisplay}</span>
                  </div>
                  <div className="flex flex-1 flex-col items-center gap-0.5 px-4 py-2 sm:py-0">
                    <span className="text-xs uppercase tracking-wide">Tổng cược</span>
                    <span className="text-sm sm:text-base font-semibold text-[#ffbf47]">{totalBetDisplay}</span>
                  </div>
                </div>
              </div>

              <section className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
                  {topQuickBets.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedQuickBet(option.id)}
                      className={`group relative rounded-2xl border px-3 py-2 text-center shadow-sm transition ${
                        selectedQuickBet === option.id
                          ? 'bg-gradient-to-b from-[#fff7cc] via-[#fde68a] to-[#f97316] shadow-lg'
                          : 'bg-gradient-to-b from-white via-[#fff8e5] to-[#ffe9b3] hover:shadow-lg'
                      }`}
                    >
                      {option.pattern.length === 0 ? (
                        <>
                          <div
                            className={`font-black ${
                              option.id === 'even'
                                ? 'text-lg text-[#e02020] group-hover:text-[#ff2f2f] uppercase'
                                : option.id === 'odd'
                                  ? 'text-lg text-[#a16207] uppercase'
                                  : 'text-sm text-gray-900 group-hover:text-amber-600 uppercase tracking-wide'
                            }`}
                          >
                            {option.label}
                          </div>
                          <div
                            className="mt-1 inline-block rounded-lg bg-white/70 px-2 py-0.5 font-semibold uppercase tracking-[0.2em] text-[#b7791f] group-hover:text-[#d69e2e] leading-tight backdrop-blur-sm"
                            style={{ fontSize: '14px' }}
                          >
                            {option.ratio}
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            className="inline-block rounded-lg bg-white/70 px-2 py-0.5 font-semibold uppercase tracking-[0.2em] text-[#b7791f] group-hover:text-[#d69e2e] leading-tight backdrop-blur-sm"
                            style={{ fontSize: '14px' }}
                          >
                            {option.ratio}
                          </div>
                          <div className="mt-1.5 flex items-center justify-center gap-1">
                            {option.pattern.map((color, index) => (
                              <span
                                key={`${option.id}-${index}`}
                                className={`h-4 w-4 rounded-full shadow-inner ${
                                  color === 'white'
                                    ? 'bg-white border border-gray-200'
                                    : 'bg-[#e02020] border border-[#c81e1e]'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
                  {bottomQuickBets.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedQuickBet(option.id)}
                      className={`group relative rounded-2xl border px-3 py-2 text-center shadow-sm transition ${
                        selectedQuickBet === option.id
                          ? 'bg-gradient-to-b from-[#fff7cc] via-[#fde68a] to-[#f97316] shadow-lg'
                          : 'bg-gradient-to-b from-white via-[#fff8e5] to-[#ffe9b3] hover:shadow-lg'
                      }`}
                    >
                      {option.pattern.length === 0 ? (
                        <>
                          <div
                            className={`font-black ${
                              option.id === 'even'
                                ? 'text-lg text-[#e02020] group-hover:text-[#ff2f2f] uppercase'
                                : option.id === 'odd'
                                  ? 'text-lg text-[#a16207] uppercase'
                                  : 'text-sm text-gray-900 group-hover:text-amber-600 uppercase tracking-wide'
                            }`}
                          >
                            {option.label}
                          </div>
                          <div
                            className="mt-1 inline-block rounded-lg bg-white/70 px-2 py-0.5 font-semibold uppercase tracking-[0.2em] text-[#b7791f] group-hover:text-[#d69e2e] leading-tight backdrop-blur-sm"
                            style={{ fontSize: '14px' }}
                          >
                            {option.ratio}
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            className="inline-block rounded-lg bg-white/70 px-2 py-0.5 font-semibold uppercase tracking-[0.2em] text-[#b7791f] group-hover:text-[#d69e2e] leading-tight backdrop-blur-sm"
                            style={{ fontSize: '14px' }}
                          >
                            {option.ratio}
                          </div>
                          <div className="mt-1.5 flex items-center justify-center gap-1">
                            {option.pattern.map((color, index) => (
                              <span
                                key={`${option.id}-${index}`}
                                className={`h-4 w-4 rounded-full shadow-inner ${
                                  color === 'white'
                                    ? 'bg-white border border-gray-200'
                                    : 'bg-[#e02020] border border-[#c81e1e]'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <input
                    type="number"
                    className="w-full flex-1 min-w-[140px] rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                    placeholder="Nhập số tiền muốn cược"
                  />
                  <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#3b3224] via-[#2b241b] to-[#201910] text-[#f6cf6a] text-sm font-semibold hover:from-[#4a3a26] hover:via-[#352918] hover:to-[#261c0d] transition shadow">
                    Đặt cược
                  </button>
                </div>

                <section className="rounded-xl border border-[#2f2618]/60 bg-gradient-to-br from-[#2b241c] via-[#221c15] to-[#1b150f] px-3 py-3 text-[#f6cf6a] shadow-inner space-y-3">
                  <header className="flex items-center gap-2 text-xs font-semibold uppercase">
                    <button className="rounded-lg bg-[#3b3224] px-3 py-1.5 text-[#facc15] shadow">Thống kê 1</button>
                    <button className="rounded-lg bg-transparent px-3 py-1.5 text-[#cbd5f5] opacity-60">Thống kê 2</button>
                  </header>

                  <div className="space-y-3">
                    <div className="rounded-lg border border-[#3f3424] bg-[#1b150f] p-2">
                      <div className="grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}>
                        {statsGrid.map((row, rowIndex) =>
                          row.map((cell, cellIndex) => (
                            <div key={`cell-${rowIndex}-${cellIndex}`} className="flex h-5 w-full items-center justify-center border border-[#4c4133]">
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

                    <div className="rounded-lg border border-[#3f3424] bg-[#1b150f] p-2 space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="relative h-4 w-full overflow-hidden rounded-full bg-[#3f3424] font-semibold tracking-wide">
                            <div
                              className="absolute inset-y-0 left-0 flex items-center justify-center bg-[#ef4444] px-1 text-white"
                              style={{ width: `${statsDistribution[0].value}%` }}
                            >
                              <span style={{ fontSize: '11px', lineHeight: '1.1' }}>{`${statsDistribution[0].value}%`}</span>
                            </div>
                            <div
                              className="absolute inset-y-0 right-0 flex items-center justify-center bg-white px-1 text-[#1f2937]"
                              style={{ width: `${statsDistribution[1].value}%` }}
                            >
                              <span style={{ fontSize: '11px', lineHeight: '1.1' }}>{`${statsDistribution[1].value}%`}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.25em]">
                            <span className="flex items-center gap-1 text-[#ff5a5a]">
                              <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
                              <span>Chẵn</span>
                            </span>
                            <span className="flex items-center gap-1 text-white/90">
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

