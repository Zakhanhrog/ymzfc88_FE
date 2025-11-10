import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import pointService from '../../../../services/pointService';
import xocDiaQuickBetService from '../../../../services/xocDiaQuickBetService';
import useXocDiaSession from '../../hooks/useXocDiaSession';
import xocDiaBetService from '../../../../services/xocDiaBetService';
import { API_BASE_URL } from '../../../../utils/constants';
import {
  CACHE_KEY,
  CACHE_DURATION_MS,
  gameName,
  defaultQuickBetConfigs,
  defaultChipOptions,
  defaultChipLabels,
  styledPlainCodes,
} from './xocDiaConfig';
import {
  convertConfigToOption,
  normalizeQuickBetOptions,
  formatChipDisplayValue,
  extractUserName,
  chunkPattern,
} from './xocDiaUtils';
import xocDiaResultHistoryService from '../../../../services/xocDiaResultHistoryService';
import XocDiaHeader from './components/XocDiaHeader';
import XocDiaLiveStream from './components/XocDiaLiveStream';
import XocDiaQuickBetBoard from './components/XocDiaQuickBetBoard';
import XocDiaChipSelector from './components/XocDiaChipSelector';
import XocDiaQuickActionBar from './components/XocDiaQuickActionBar';
import XocDiaStatsPanel from './components/XocDiaStatsPanel';
import XocDiaCustomChipModal from './components/XocDiaCustomChipModal';
import XocDiaBetHistoryDrawer from '../../../../components/common/layout/XocDiaBetHistoryDrawer';
import LogoutConfirmModal from '../../../../components/common/LogoutConfirmModal';

const STATS_ROWS = 6;
const STATS_COLUMNS = 17;
const MAX_STATS_ITEMS = STATS_ROWS * STATS_COLUMNS;

const RED_COUNT_MAP = {
  'four-white': 0,
  'four-red': 4,
  'three-white-one-red': 1,
  'three-red-one-white': 3,
  'two-two': 2,
};

const normalizeResultCode = (code) =>
  code
    ?.trim()
    ?.toLowerCase()
    ?.replace(/[\s_]+/g, '-') || '';

const resolveRedCountFromCode = (code) => {
  if (!code) {
    return null;
  }

  const normalized = normalizeResultCode(code);
  if (Object.prototype.hasOwnProperty.call(RED_COUNT_MAP, normalized)) {
    return RED_COUNT_MAP[normalized];
  }

  if (normalized.includes('four-white')) {
    return 0;
  }
  if (normalized.includes('four-red')) {
    return 4;
  }
  if (normalized.includes('three-white-one-red')) {
    return 1;
  }
  if (normalized.includes('three-red-one-white') || normalized.includes('three-red')) {
    return 3;
  }
  if (normalized.includes('two-two')) {
    return 2;
  }
  if (normalized.includes('one-red')) {
    return 1;
  }

  const matches = normalized.match(/red/g);
  if (matches && matches.length > 0) {
    return Math.min(Math.max(matches.length, 0), 4);
  }

  return null;
};

const createEmptyStatsGrid = () =>
  Array.from({ length: STATS_ROWS }, () => Array(STATS_COLUMNS).fill(null));

const createEmptyColumns = () =>
  Array.from({ length: STATS_COLUMNS }, () => Array(STATS_ROWS).fill(null));

const XocDiaGamePage = () => {
  const navigate = useNavigate();
  const [selectedQuickBets, setSelectedQuickBets] = useState({});
  const defaultQuickBetOptions = useMemo(
    () => defaultQuickBetConfigs.map(convertConfigToOption).sort((a, b) => a.displayOrder - b.displayOrder),
    []
  );
  const defaultQuickBetOptionMap = useMemo(() => {
    const map = new Map();
    defaultQuickBetOptions.forEach((option) => {
      map.set(option.code, option);
    });
    return map;
  }, [defaultQuickBetOptions]);
  const [quickBetOptions, setQuickBetOptions] = useState(defaultQuickBetOptions);
  const [quickBetLoading, setQuickBetLoading] = useState(false);
  const [quickBetError, setQuickBetError] = useState(null);
  const {
    sessionStatus,
    timer: { phaseKey, phaseLabel, countdownSeconds, countdownAngle },
    resultCode: sessionResultCode,
    sessionId,
    refreshSession,
  } = useXocDiaSession({ pollIntervalMs: 1000 });
  const [displayedResult, setDisplayedResult] = useState(null);
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const [lastPlacedBets, setLastPlacedBets] = useState(null);
  const [userPoints, setUserPoints] = useState(0);
  const [loadingPoints, setLoadingPoints] = useState(true);
  const [userName, setUserName] = useState('');
  const [selectedChipValue, setSelectedChipValue] = useState(null);
  const [selectedChipLabel, setSelectedChipLabel] = useState(null);
  const [activeStatsTab, setActiveStatsTab] = useState('1');
  const [chipOptions, setChipOptions] = useState(defaultChipOptions);
  const [isCustomChipModalOpen, setIsCustomChipModalOpen] = useState(false);
  const [customChipValue, setCustomChipValue] = useState('');
  const [customChipError, setCustomChipError] = useState('');
  const defaultChipLabelSet = useMemo(() => new Set(defaultChipLabels), []);
  const [customChipSelections, setCustomChipSelections] = useState(
    new Set(defaultChipOptions.map((chip) => chip.label))
  );
  const [chanLeStatsGrid, setChanLeStatsGrid] = useState(() => createEmptyStatsGrid());
  const [taiXiuStatsGrid, setTaiXiuStatsGrid] = useState(() => createEmptyStatsGrid());
  const [chanLeHistory, setChanLeHistory] = useState([]);
  const [taiXiuHistory, setTaiXiuHistory] = useState([]);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false);
  const quickBetOptionLookup = useMemo(() => {
    const map = new Map();
    quickBetOptions.forEach((option) => {
      const normalizedCode = option.code.toLowerCase();
      map.set(normalizedCode, option);
      if (option.originalCode) {
        map.set(option.originalCode.toLowerCase(), option);
      }
    });
    return map;
  }, [quickBetOptions]);
  const availableChipOptions = useMemo(() => {
    const map = new Map();
    defaultChipOptions.forEach((chip) => map.set(chip.label, chip.value));
    chipOptions.forEach((chip) => map.set(chip.label, chip.value));
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('xocdia_custom_chip');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed?.label && typeof parsed?.value === 'number') {
            map.set(parsed.label, parsed.value);
          }
        } catch (error) {
          // ignore malformed storage
        }
      }
    }
    return Array.from(map.entries()).map(([label, value]) => ({ label, value }));
  }, [chipOptions]);
  const plainEnabledCodes = useMemo(
    () =>
      new Set([
        'chan',
        'le',
        'tai',
        'xiu',
        'even',
        'odd',
        'three-red',
        'three-white',
      ]),
    []
  );
  const allChipsSelected =
    availableChipOptions.length > 0 && customChipSelections.size === availableChipOptions.length;
  const quickActionButtons = useMemo(
    () => [
      {
        action: 'clear-all',
        label: 'Huỷ hết',
        style: 'bg-[#0f4c2c] text-white shadow-lg shadow-[#0f4c2c]/25',
        icon: 'mdi:close-thick',
      },
      {
        action: 'clear',
        label: 'Huỷ',
        style: 'border border-[#0f4c2c] text-[#0f4c2c] bg-white',
        icon: 'mdi:undo-variant',
      },
      {
        action: 'repeat',
        label: 'Lặp lại',
        style: 'border border-[#0f4c2c] text-[#0f4c2c] bg-white',
        icon: 'mdi:autorenew',
      },
    ],
    []
  );
  const resultTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);
  const lastHistorySignatureRef = useRef(null);
  const pendingHistoryRefreshRef = useRef(null);
  const chanLeCursorRef = useRef({ column: 0, row: -1, lastKey: null });
  const taiXiuCursorRef = useRef({ column: 0, row: -1, lastKey: null });
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (pendingHistoryRefreshRef.current) {
        clearTimeout(pendingHistoryRefreshRef.current);
        pendingHistoryRefreshRef.current = null;
      }
    };
  }, []);
  const columnsToGrid = useCallback(
    (columnsData) =>
      Array.from({ length: STATS_ROWS }, (_, rowIndex) =>
        columnsData.map((columnValues) => columnValues[rowIndex] ?? null)
      ),
    []
  );

  const buildStatsGrid = useCallback(
    (historyItems, resolveCell) => {
      if (!Array.isArray(historyItems) || historyItems.length === 0) {
        return {
          grid: createEmptyStatsGrid(),
          cursor: { column: 0, row: -1, lastKey: null },
        };
      }

      const columnsData = createEmptyColumns();
      let currentColumn = 0;
      let currentRow = 0;
      let previousKey = null;

      historyItems.slice(-MAX_STATS_ITEMS).forEach((item) => {
        const resolved = resolveCell(item);
        if (!resolved) {
          return;
        }

        const { key, cell } = resolved;

        if (previousKey !== null && key === previousKey && currentRow < STATS_ROWS - 1) {
          currentRow += 1;
        } else {
          currentColumn = previousKey === null ? 0 : currentColumn + 1;
          currentRow = 0;
        }

        if (currentColumn >= STATS_COLUMNS) {
          for (let col = 0; col < STATS_COLUMNS - 1; col += 1) {
            columnsData[col] = columnsData[col + 1].slice();
          }
          columnsData[STATS_COLUMNS - 1] = Array(STATS_ROWS).fill(null);
          currentColumn = STATS_COLUMNS - 1;
        }

        columnsData[currentColumn][currentRow] = cell;
        previousKey = key;
      });

      const cursor = {
        column: Math.min(currentColumn, STATS_COLUMNS - 1),
        row: Math.min(currentRow, STATS_ROWS - 1),
        lastKey: previousKey,
      };

      return {
        grid: columnsToGrid(columnsData),
        cursor,
      };
    },
    [columnsToGrid]
  );

  const appendToStatsGrid = useCallback(
    (currentGrid, cursorRef, entry) => {
      if (!entry) {
        return currentGrid || createEmptyStatsGrid();
      }

      const columnsData = createEmptyColumns();
      for (let col = 0; col < STATS_COLUMNS; col += 1) {
        for (let row = 0; row < STATS_ROWS; row += 1) {
          columnsData[col][row] = currentGrid?.[row]?.[col] ?? null;
        }
      }

      let { column, row, lastKey } = cursorRef.current || { column: 0, row: -1, lastKey: null };

      if (lastKey === entry.key && row < STATS_ROWS - 1) {
        row += 1;
      } else {
        column = lastKey === null ? 0 : column + 1;
        row = 0;

        if (column >= STATS_COLUMNS) {
          for (let col = 0; col < STATS_COLUMNS - 1; col += 1) {
            columnsData[col] = columnsData[col + 1].slice();
          }
          columnsData[STATS_COLUMNS - 1] = Array(STATS_ROWS).fill(null);
          column = STATS_COLUMNS - 1;
        } else {
          columnsData[column] = Array(STATS_ROWS).fill(null);
        }
      }

      columnsData[column][row] = entry.cell;
      cursorRef.current = { column, row, lastKey: entry.key };
      return columnsToGrid(columnsData);
    },
    [columnsToGrid]
  );

  useEffect(() => {
    const { grid, cursor } = buildStatsGrid(chanLeHistory, (item) => {
      if (!item || typeof item.redCount !== 'number') {
        return null;
      }
      const parity =
        typeof item.parity === 'string'
          ? item.parity.toUpperCase()
          : item.redCount % 2 === 0
            ? 'CHAN'
            : 'LE';
      return {
        key: parity,
        cell: {
          value: item.redCount,
          parity,
        },
      };
    });
    setChanLeStatsGrid(grid);
    chanLeCursorRef.current = cursor;
  }, [chanLeHistory, buildStatsGrid]);

  useEffect(() => {
    const { grid, cursor } = buildStatsGrid(taiXiuHistory, (item) => {
      if (!item || !item.display || !item.category) {
        return null;
      }
      return {
        key: item.category,
        cell: item.display,
      };
    });
    setTaiXiuStatsGrid(grid);
    taiXiuCursorRef.current = cursor;
  }, [taiXiuHistory, buildStatsGrid]);

  const fetchResultHistories = useCallback(async () => {
    const response = await xocDiaResultHistoryService.fetchHistories({
      limit: MAX_STATS_ITEMS,
      order: 'asc',
    });

    if (!isMountedRef.current) {
      return;
    }

    if (!response.success) {
      setChanLeHistory([]);
      setTaiXiuHistory([]);
      return;
    }

    const normalizedHistory = (response.data || [])
      .map((item) => {
        if (!item) {
          return null;
        }
        const redCount =
          typeof item.redCount === 'number'
            ? item.redCount
            : resolveRedCountFromCode(item.resultCode || item.normalizedResultCode);
        if (redCount == null) {
          return null;
        }
        const parity =
          typeof item.parity === 'string'
            ? item.parity.toUpperCase()
            : redCount % 2 === 0
              ? 'CHAN'
              : 'LE';
        const category =
          redCount === 2 ? 'HOA' : redCount >= 3 ? 'TAI' : 'XIU';
        const display = category === 'HOA' ? '2' : category === 'TAI' ? 'T' : 'X';

        return {
          sessionId: item.sessionId ?? null,
          redCount,
          parity,
          category,
          display,
        };
      })
      .filter(Boolean);

    const limitedHistory = normalizedHistory.slice(-MAX_STATS_ITEMS);
    setChanLeHistory(
      limitedHistory.map(({ sessionId, redCount, parity }) => ({
        sessionId,
        redCount,
        parity,
      }))
    );
    setTaiXiuHistory(
      limitedHistory.map(({ sessionId, redCount, category, display }) => ({
        sessionId,
        redCount,
        category,
        display,
      }))
    );
  }, []);

  useEffect(() => {
    fetchResultHistories();
  }, [fetchResultHistories]);

  useEffect(() => {
    if (!sessionId || !sessionResultCode) {
      return;
    }

    const signature = `${sessionId}:${sessionResultCode}`;
    if (signature === lastHistorySignatureRef.current) {
      return;
    }
    lastHistorySignatureRef.current = signature;

    const redCount = resolveRedCountFromCode(sessionResultCode);
    if (redCount != null) {
      const parity = redCount % 2 === 0 ? 'CHAN' : 'LE';
      setChanLeHistory((prev) => {
        if (prev.some((item) => item.sessionId === sessionId)) {
          return prev;
        }
        const next = [...prev, { sessionId, redCount, parity }];
        if (next.length > MAX_STATS_ITEMS) {
          next.splice(0, next.length - MAX_STATS_ITEMS);
        }
        return next;
      });
      setChanLeStatsGrid((prev) =>
        appendToStatsGrid(prev, chanLeCursorRef, {
          key: parity,
          cell: {
            value: redCount,
            parity,
          },
        })
      );

      const category = redCount === 2 ? 'HOA' : redCount >= 3 ? 'TAI' : 'XIU';
      const display = category === 'HOA' ? '2' : category === 'TAI' ? 'T' : 'X';
      setTaiXiuHistory((prev) => {
        if (prev.some((item) => item.sessionId === sessionId)) {
          return prev;
        }
        const next = [...prev, { sessionId, redCount, category, display }];
        if (next.length > MAX_STATS_ITEMS) {
          next.splice(0, next.length - MAX_STATS_ITEMS);
        }
        return next;
      });
      setTaiXiuStatsGrid((prev) =>
        appendToStatsGrid(prev, taiXiuCursorRef, {
          key: category,
          cell: display,
        })
      );
    }

    if (pendingHistoryRefreshRef.current) {
      clearTimeout(pendingHistoryRefreshRef.current);
      pendingHistoryRefreshRef.current = null;
    }

    pendingHistoryRefreshRef.current = setTimeout(() => {
      pendingHistoryRefreshRef.current = null;
      if (isMountedRef.current) {
        fetchResultHistories();
      }
    }, 1000);
  }, [sessionId, sessionResultCode, fetchResultHistories]);

  const allowedPatternBetCodes = useMemo(() => {
    const codes = new Set(
      quickBetOptions
        .filter((option) => Array.isArray(option.pattern) && option.pattern.length > 0)
        .map((option) => option.code)
    );
    quickBetOptions.forEach((option) => {
      if (plainEnabledCodes.has(option.code)) {
        codes.add(option.code);
      }
    });
    return codes;
  }, [plainEnabledCodes, quickBetOptions]);
  const placeableBets = useMemo(
    () =>
      Object.entries(selectedQuickBets).filter(([code, bet]) => {
        const value = bet?.totalValue ?? bet?.value ?? 0;
        return allowedPatternBetCodes.has(code) && value > 0;
      }),
    [allowedPatternBetCodes, selectedQuickBets]
  );
  const autoSubmitStateRef = useRef({ sessionId: null, triggered: false, signature: '' });
  const findOptionByCode = (code) => quickBetOptions.find((option) => option.code === code);
  const columnCodes = {
    left: ['four-white', 'three-white-one-red', 'two-two'],
    middleLeft: ['chan', 'tai', 'even', 'three-red'],
    middleRight: ['le', 'xiu', 'odd', 'three-white'],
    right: ['four-red', 'three-red-one-white', 'four-white-or-four-red'],
  };
  const assignedCodes = new Set(Object.values(columnCodes).flat());
  const leftoverOptions = quickBetOptions.filter((option) => !assignedCodes.has(option.code));
  if (leftoverOptions.length > 0) {
    leftoverOptions.forEach((option) => {
      if (option.pattern.length > 0) {
        columnCodes.right.push(option.code);
      } else {
        columnCodes.middleRight.push(option.code);
      }
      assignedCodes.add(option.code);
    });
  }
  const leftOptions = columnCodes.left.map(findOptionByCode).filter(Boolean);
  const middleLeftOptions = columnCodes.middleLeft.map(findOptionByCode).filter(Boolean);
  const middleRightOptions = columnCodes.middleRight.map(findOptionByCode).filter(Boolean);
  const rightOptions = columnCodes.right.map(findOptionByCode).filter(Boolean);

  const fillColumn = (options, targetLength) => {
    const filled = options.slice(0, targetLength);
    while (filled.length < targetLength) {
      filled.push(null);
    }
    return filled;
  };

  const columnOptions = {
    left: fillColumn(leftOptions, 3),
    middleLeft: fillColumn(middleLeftOptions, 2),
    middleRight: fillColumn(middleRightOptions, 2),
    right: fillColumn(rightOptions, 3),
  };

  const isSessionRunning = sessionStatus === 'RUNNING';
  const isCountdownPhase = isSessionRunning && phaseKey === 'countdown';
  const currentPhaseLabel = isSessionRunning ? phaseLabel ?? '' : 'Chờ phiên mới';
  const bettingLockedPhases = ['betting-closed', 'waiting-result', 'show-result', 'payout', 'invite-bet'];
  const isBettingLocked = !isSessionRunning || bettingLockedPhases.includes(phaseKey);

  const placeableBetDetails = useMemo(
    () =>
      placeableBets.map(([code, bet]) => {
        const option =
          quickBetOptions.find((item) => item.code === code) || defaultQuickBetOptionMap.get(code);
        return {
          code,
          label: option?.label ?? option?.name ?? code,
          amount: bet?.totalValue ?? bet?.value ?? 0,
        };
      }),
    [defaultQuickBetOptionMap, placeableBets, quickBetOptions]
  );

  useEffect(() => {
    setSelectedQuickBets((prev) => {
      const entries = Object.entries(prev).filter(([code]) => allowedPatternBetCodes.has(code));
      if (entries.length === Object.keys(prev).length) {
        return prev;
      }
      return entries.reduce((acc, [code, bet]) => {
        acc[code] = bet;
        return acc;
      }, {});
    });
  }, [allowedPatternBetCodes]);

  const findChipLabelByValue = useCallback(
    (value) => {
      if (value == null) {
        return '';
      }
      const fromDisplayed = chipOptions.find((chip) => chip.value === value);
      if (fromDisplayed) {
        return fromDisplayed.label;
      }
      const fromAvailable = availableChipOptions.find((chip) => chip.value === value);
      if (fromAvailable) {
        return fromAvailable.label;
      }
      return formatChipDisplayValue(value);
    },
    [availableChipOptions, chipOptions]
  );

  const handleQuickBetSelect = useCallback(
    (option) => {
      if (isBettingLocked) {
        message.warning('Phiên đã ngưng cược, vui lòng chờ phiên tiếp theo');
        return;
      }

      if (!allowedPatternBetCodes.has(option.code)) {
        message.info('Loại cược này sẽ được mở trong phiên bản tiếp theo.');
        return;
      }

      if (!selectedChipValue) {
        message.warning('Vui lòng chọn mệnh giá phỉnh trước khi đặt cược');
        return;
      }

      setSelectedQuickBets((prev) => {
        const existing = prev[option.code];
        const previousTotal = existing?.value ?? existing?.totalValue ?? 0;
        const newTotal = previousTotal + selectedChipValue;
        const chipLabel = selectedChipLabel ?? findChipLabelByValue(selectedChipValue);

        return {
          ...prev,
          [option.code]: {
            value: newTotal,
            totalValue: newTotal,
            label: formatChipDisplayValue(newTotal),
            lastChipValue: selectedChipValue,
            lastChipLabel: chipLabel,
          },
        };
      });
    },
    [allowedPatternBetCodes, findChipLabelByValue, isBettingLocked, selectedChipLabel, selectedChipValue]
  );

  const updateStoredUserData = useCallback((partialData = {}) => {
      try {
        const storedUser = localStorage.getItem('user');
        const existingUser = storedUser ? JSON.parse(storedUser) : {};
        const mergedUser = { ...existingUser, ...partialData };
        localStorage.setItem('user', JSON.stringify(mergedUser));
        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: mergedUser, timestamp: Date.now() })
        );
        return mergedUser;
      } catch (error) {
        return null;
      }
  }, []);

  const loadUserDataFromCache = useCallback(() => {
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp > CACHE_DURATION_MS) {
          return null;
        }
        return data && typeof data === 'object' ? data : null;
      } catch (error) {
        return null;
      }
  }, []);

  const loadUserDataFromLocalStorage = useCallback(() => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          return userData && typeof userData === 'object' ? userData : null;
        }
      } catch (error) {
        // Ignore parse errors
      }
      return null;
  }, []);

  const updateUserStateFromData = useCallback(
    (data) => {
      if (!isMountedRef.current || !data) {
        return;
      }
      if (typeof data.points === 'number') {
        setUserPoints(data.points);
      }
      const name = extractUserName(data);
      if (name) {
        setUserName(name);
      }
    },
    []
  );

  const applyPointsUpdate = useCallback(
    (points) => {
      if (!isMountedRef.current) {
        return;
      }
      const mergedUser = updateStoredUserData({ points });
      if (!isMountedRef.current) {
          return;
        }
          setUserPoints(points);
          if (mergedUser) {
            updateUserStateFromData(mergedUser);
          } else {
            const localUser = loadUserDataFromLocalStorage();
            if (localUser) {
              updateUserStateFromData({ ...localUser, points });
            }
          }
    },
    [loadUserDataFromLocalStorage, updateStoredUserData, updateUserStateFromData]
  );

  const fetchAndUpdateUserPoints = useCallback(async () => {
    let pointsUpdated = false;
    const authToken =
      localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('adminToken');

    if (authToken) {
      try {
        const walletResponse = await fetch(`${API_BASE_URL}/wallet/balance`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (walletResponse.ok) {
          const walletData = await walletResponse.json();
          if (walletData?.success) {
            const points =
              walletData.data?.points ??
              walletData.data?.balance ??
              walletData.data?.totalPoints ??
              walletData.data?.totalBalance;
            if (typeof points === 'number') {
              applyPointsUpdate(points);
              pointsUpdated = true;
            }
          }
        }
      } catch (error) {
        // ignore, fallback below
      }
    }

    if (!pointsUpdated) {
      try {
        const response = await pointService.getMyPoints();
        if (response?.success) {
          const points = response.data?.totalPoints ?? response.data?.points ?? 0;
          applyPointsUpdate(points);
          pointsUpdated = true;
        }
      } catch (error) {
        // ignore, fallback below
      }
    }

    if (!pointsUpdated) {
      const fallback = loadUserDataFromLocalStorage();
      if (fallback) {
        updateUserStateFromData(fallback);
      } else if (isMountedRef.current) {
            setUserPoints(0);
            setUserName('');
          }
    }

    return pointsUpdated;
  }, [applyPointsUpdate, loadUserDataFromLocalStorage, updateUserStateFromData]);

  useEffect(() => {
    let isMounted = true;

    const fetchQuickBets = async () => {
      try {
        setQuickBetLoading(true);
        const response = await xocDiaQuickBetService.getActiveQuickBets();

        if (!isMounted) return;

        if (response.success && Array.isArray(response.data) && response.data.length > 0) {
          const options = normalizeQuickBetOptions(
            response.data.map(convertConfigToOption),
            defaultQuickBetOptionMap
          );
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

    const fetchPoints = async () => {
      if (!isMounted) return;
      setLoadingPoints(true);

      const cachedData = loadUserDataFromCache();
      if (cachedData) {
        updateUserStateFromData(cachedData);
      }

      try {
        await fetchAndUpdateUserPoints();
      } catch (error) {
        if (!isMounted) return;
        const fallback = loadUserDataFromLocalStorage();
        if (fallback) {
          updateUserStateFromData(fallback);
        } else {
          setUserPoints(0);
          setUserName('');
        }
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
  }, [
    fetchAndUpdateUserPoints,
    loadUserDataFromCache,
    loadUserDataFromLocalStorage,
    updateUserStateFromData,
  ]);

  const balanceDisplay = loadingPoints
    ? 'Đang tải...'
    : `${Number(userPoints || 0).toLocaleString('vi-VN')} điểm`;

  const countdownCircleStyle = {
    background: `conic-gradient(#ef4444 ${countdownAngle}deg, #3b0f0f ${countdownAngle}deg)`,
  };

  const activeResultOption = useMemo(() => {
    if (!sessionResultCode) {
      return null;
    }
    return (
      quickBetOptions.find((option) => option.code === sessionResultCode) ||
      defaultQuickBetOptionMap.get(sessionResultCode) ||
      null
    );
  }, [sessionResultCode, quickBetOptions, defaultQuickBetOptionMap]);

  const shouldShowResultOverlay =
    isSessionRunning &&
    activeResultOption &&
    Array.isArray(activeResultOption.pattern) &&
    activeResultOption.pattern.length > 0 &&
    ['show-result', 'payout', 'invite-bet'].includes(phaseKey);

  useEffect(() => {
    if (shouldShowResultOverlay && activeResultOption) {
      if (resultTimeoutRef.current) {
        clearTimeout(resultTimeoutRef.current);
        resultTimeoutRef.current = null;
      }
      setDisplayedResult(activeResultOption);
      return;
    }

    if (!shouldShowResultOverlay && displayedResult) {
      if (resultTimeoutRef.current) {
        clearTimeout(resultTimeoutRef.current);
      }
      resultTimeoutRef.current = setTimeout(() => {
        setDisplayedResult(null);
        resultTimeoutRef.current = null;
      }, 500);
    }
  }, [shouldShowResultOverlay, activeResultOption, displayedResult]);

  useEffect(() => {
    return () => {
      if (resultTimeoutRef.current) {
        clearTimeout(resultTimeoutRef.current);
      }
    };
  }, []);




  const handleOpenCustomChipModal = () => {
    setCustomChipValue('');
    setCustomChipError('');
    setCustomChipSelections(
      new Set(chipOptions.filter((chip) => defaultChipLabelSet.has(chip.label)).map((chip) => chip.label))
    );
    setIsCustomChipModalOpen(true);
  };

  const handleCloseCustomChipModal = () => {
    setIsCustomChipModalOpen(false);
    setCustomChipValue('');
    setCustomChipError('');
    setCustomChipSelections(
      new Set(chipOptions.filter((chip) => defaultChipLabelSet.has(chip.label)).map((chip) => chip.label))
    );
  };

  const handleCustomChipValueChange = (event) => {
    const digitsOnly = event.target.value.replace(/\D/g, '').slice(0, 4);
    setCustomChipValue(digitsOnly);
    if (customChipError) {
      setCustomChipError('');
    }
  };

  const handleToggleChipSelection = (label) => {
    setCustomChipSelections((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
    if (customChipError) {
      setCustomChipError('');
    }
  };

  const handleSelectAllChips = () => {
    setCustomChipSelections(new Set(defaultChipLabels));
    if (customChipError) {
      setCustomChipError('');
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'clear-all':
        setSelectedQuickBets({});
        break;
      case 'clear':
        setSelectedQuickBets((prev) => {
          const entries = Object.entries(prev);
          if (entries.length === 0) {
            return prev;
          }
          const next = { ...prev };
          const lastKey = entries[entries.length - 1][0];
          delete next[lastKey];
          return next;
        });
        break;
      case 'repeat':
        if (!lastPlacedBets || Object.keys(lastPlacedBets).length === 0) {
          message.info('Chưa có lịch sử cược gần nhất để lặp lại');
          return;
        }
        if (isBettingLocked) {
          message.warning('Phiên đã ngưng cược, vui lòng chờ phiên tiếp theo');
          return;
        }
        setSelectedQuickBets(
          Object.entries(lastPlacedBets).reduce((acc, [code, bet]) => {
            acc[code] = { ...bet };
            return acc;
          }, {})
        );
        break;
      default:
        break;
    }
  };

  const handleBackRequest = useCallback(() => {
    setShowExitConfirmModal(true);
  }, []);

  const handleConfirmExit = useCallback(() => {
    setShowExitConfirmModal(false);
    navigate('/casino/live');
  }, [navigate]);

  const handleCustomChipSubmit = (event) => {
    event.preventDefault();
    const trimmed = customChipValue.trim();
    let label = null;
    let value = null;

    if (trimmed) {
      if (!/^\d{1,4}$/.test(trimmed)) {
        setCustomChipError('Chỉ nhập tối đa 4 chữ số');
        return;
      }

      const numeric = Number(trimmed);
      if (numeric === 0) {
        setCustomChipError('Giá trị phải lớn hơn 0');
        return;
      }

      value = numeric;
      label = formatChipDisplayValue(value);
    }

    const nextSelections = new Set(customChipSelections);
    if (label) {
      nextSelections.add(label);
    }

    const availableMap = new Map();
    defaultChipOptions.forEach((chip) => availableMap.set(chip.label, chip.value));
    chipOptions.forEach((chip) => availableMap.set(chip.label, chip.value));

    const newOrder = [];

    if (label && value !== null) {
      newOrder.push({ label, value });
    }

    defaultChipOptions.forEach((chip) => {
      if (nextSelections.has(chip.label) && chip.label !== label) {
        const val = availableMap.get(chip.label) ?? chip.value;
        newOrder.push({ label: chip.label, value: val });
      }
      availableMap.delete(chip.label);
    });

    availableMap.forEach((val, chipLabel) => {
      if (!defaultChipLabels.includes(chipLabel) && chipLabel !== label && nextSelections.has(chipLabel)) {
        newOrder.push({ label: chipLabel, value: val });
      }
    });

    if (typeof window !== 'undefined') {
      if (label && value !== null) {
        window.localStorage.setItem('xocdia_custom_chip', JSON.stringify({ label, value }));
        window.dispatchEvent(new CustomEvent('xocdia-custom-chip-updated', { detail: { label, value } }));
      } else {
        window.localStorage.removeItem('xocdia_custom_chip');
        window.dispatchEvent(new CustomEvent('xocdia-custom-chip-updated', { detail: null }));
      }
    }

    setChipOptions(newOrder);
    setCustomChipSelections(
      new Set(newOrder.filter((chip) => defaultChipLabelSet.has(chip.label)).map((chip) => chip.label))
    );
    if (label && value !== null) {
      setSelectedChipValue(value);
      setSelectedChipLabel(label);
    } else if (newOrder.length > 0) {
      const stillSelected = newOrder.some((chip) => chip.value === selectedChipValue);
      if (!stillSelected) {
        setSelectedChipValue(newOrder[0].value);
        setSelectedChipLabel(newOrder[0].label);
      } else {
        const currentSelection = newOrder.find((chip) => chip.value === selectedChipValue);
        if (currentSelection) {
          setSelectedChipLabel(currentSelection.label);
        }
      }
    } else {
      setSelectedChipValue(null);
      setSelectedChipLabel(null);
    }
    setIsCustomChipModalOpen(false);
  };

  const handleQuickChipSelect = (chipValue) => {
    if (chipValue == null) {
      setSelectedChipValue(null);
      setSelectedChipLabel(null);
      return;
    }
    const label =
      chipOptions.find((chip) => chip.value === chipValue)?.label ??
      availableChipOptions.find((chip) => chip.value === chipValue)?.label ??
      formatChipDisplayValue(chipValue);
    setSelectedChipValue(chipValue);
    setSelectedChipLabel(label);
  };

  const handleClearCustomChip = useCallback(
    (chip) => {
      setChipOptions((prev) => prev.filter((option) => option.label !== chip?.label));
      setCustomChipSelections(new Set(defaultChipLabels));
      setSelectedChipValue((prev) => (prev === chip?.value ? null : prev));
      setSelectedChipLabel((prev) => (prev === chip?.label ? null : prev));
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('xocdia_custom_chip');
        window.dispatchEvent(new CustomEvent('xocdia-custom-chip-updated', { detail: null }));
      }
    },
    [defaultChipLabels]
  );

  const countdownDisplay = isCountdownPhase ? (
    <div className="flex items-center">
      <div
        className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full p-[3px]"
        style={countdownCircleStyle}
        aria-live="polite"
      >
        <span className="flex h-full w-full items-center justify-center rounded-full bg-[#4a0c0c] text-[#fef3c7] shadow-inner px-1">
          <span className="text-[9px] font-semibold leading-none text-center tracking-wide">{countdownSeconds}</span>
        </span>
      </div>
    </div>
  ) : (
    <div className="inline-flex items-center justify-center rounded-full bg-[#4a0c0c]/80 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wide text-[#fef3c7] shadow-sm">
      {currentPhaseLabel}
    </div>
  );

  const resultOverlay = displayedResult ? (
    <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
      <div className="flex flex-col items-center justify-center rounded-2xl border border-white/25 bg-white/10 px-6 py-4 backdrop-blur-md shadow-[0_12px_35px_rgba(15,23,42,0.35)]">
        <div className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">Kết quả</div>
        <div className="mt-2 text-lg font-bold uppercase tracking-[0.15em] text-white">
          {displayedResult.label}
        </div>
        <div className="mt-3 flex flex-col items-center justify-center gap-1.5">
              {chunkPattern(displayedResult.pattern).map((row, rowIndex) => (
            <div key={`result-row-${rowIndex}`} className="flex items-center justify-center gap-2">
              {row.map((chip, chipIndex) => (
                <span
                  key={`result-chip-${rowIndex}-${chipIndex}`}
                  className={`h-5 w-5 rounded-full border-2 shadow-lg ${
                    chip === 'white' ? 'border-white bg-white' : 'border-[#ef4444] bg-[#ef4444]'
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : null;

  const betSignature = useMemo(() => {
    if (placeableBetDetails.length === 0) {
      return '';
    }
    return placeableBetDetails
      .map((item) => `${item.code}:${item.amount}`)
      .sort()
      .join('|');
  }, [placeableBetDetails]);

  useEffect(() => {
    if (!sessionId) {
      autoSubmitStateRef.current = { sessionId: null, triggered: false, signature: '' };
      return;
    }
    const state = autoSubmitStateRef.current;
    if (state.sessionId !== sessionId) {
      autoSubmitStateRef.current = { sessionId, triggered: false, signature: betSignature };
      return;
    }
    if (state.signature !== betSignature) {
      autoSubmitStateRef.current = { sessionId, triggered: false, signature: betSignature };
    }
  }, [sessionId, betSignature]);

  const submitBets = useCallback(
    async ({ force = false, signatureOverride } = {}) => {
    if (isPlacingBet) {
      return;
    }
    if (placeableBetDetails.length === 0) {
      return;
    }
    if (!force && isBettingLocked) {
      message.warning('Phiên đã ngưng cược, vui lòng chờ phiên tiếp theo');
      return;
    }

    setIsPlacingBet(true);
    try {
      const payload = {
        sessionId: sessionId,
        bets: placeableBetDetails.map((item) => ({
          code: item.code,
          amount: item.amount,
        })),
      };

      const response = await xocDiaBetService.placeBets(payload);
      if (response.success) {
        message.success(response.message || 'Đặt cược thành công');
        setLastPlacedBets(
          placeableBetDetails.reduce((acc, item) => {
            acc[item.code] = selectedQuickBets[item.code];
            return acc;
          }, {})
        );
        setSelectedQuickBets({});
        autoSubmitStateRef.current = {
          sessionId,
          triggered: true,
          signature: signatureOverride ?? betSignature,
        };
        if (response.data?.balanceAfter != null) {
          setUserPoints(response.data.balanceAfter);
        } else {
          await pointService.getMyPoints().then((res) => {
            if (res?.success) {
              setUserPoints(res.data?.totalPoints ?? res.data?.points ?? 0);
            }
          });
        }
      } else {
        const errorMessage = response.message || 'Không thể đặt cược';
        const normalized = errorMessage.toLowerCase();
        message.error(errorMessage);
        if (normalized.includes('không đủ') || normalized.includes('insufficient')) {
          message.info('Số dư không đủ, vui lòng nạp thêm để tiếp tục đặt cược.');
        }
        autoSubmitStateRef.current = {
          sessionId,
          triggered: false,
          signature: signatureOverride ?? betSignature,
        };
      }
    } catch (error) {
      let fallbackMessage = error?.message || 'Không thể đặt cược';
      if (error?.response?.json) {
        try {
          const data = await error.response.json();
          if (data?.message) {
            fallbackMessage = data.message;
          }
        } catch (parseError) {
          // ignore
        }
      }
      const normalized = fallbackMessage.toLowerCase();
      message.error(fallbackMessage);
      if (normalized.includes('không đủ') || normalized.includes('insufficient')) {
        message.info('Số dư không đủ, vui lòng nạp thêm để tiếp tục đặt cược.');
      }
      autoSubmitStateRef.current = {
        sessionId,
        triggered: false,
        signature: signatureOverride ?? betSignature,
      };
    } finally {
      setIsPlacingBet(false);
    }
    },
    [
      betSignature,
      isBettingLocked,
      isPlacingBet,
      placeableBetDetails,
      selectedQuickBets,
      sessionId,
    ]
  );

  useEffect(() => {
    if (!sessionId) {
      return;
    }
    if (!isCountdownPhase) {
      return;
    }
    if (countdownSeconds > 1) {
      return;
    }
    if (placeableBetDetails.length === 0) {
      return;
    }
    if (isPlacingBet) {
      return;
    }
    const state = autoSubmitStateRef.current;
    if (state.sessionId === sessionId && state.triggered && state.signature === betSignature) {
      return;
    }
    autoSubmitStateRef.current = { sessionId, triggered: true, signature: betSignature };
    submitBets({ force: true, signatureOverride: betSignature });
  }, [
    sessionId,
    isCountdownPhase,
    countdownSeconds,
    placeableBetDetails,
    isPlacingBet,
    betSignature,
    submitBets,
  ]);

  const pendingResultRef = useRef({ sessionId: null, resultCode: null });

  useEffect(() => {
    if (!sessionId || Object.keys(selectedQuickBets).length === 0) {
      return;
    }
    if (!bettingLockedPhases.includes(phaseKey)) {
      return;
    }
    autoSubmitStateRef.current = { sessionId, triggered: false, signature: '' };
  }, [sessionId, phaseKey, selectedQuickBets]);

  useEffect(() => {
    if (!sessionResultCode || !sessionId) {
      pendingResultRef.current = { sessionId: null, resultCode: null };
      return;
    }

    const alreadyHandled =
      pendingResultRef.current.sessionId === sessionId &&
      pendingResultRef.current.resultCode === sessionResultCode;
    if (alreadyHandled) {
      return;
    }

    pendingResultRef.current = { sessionId, resultCode: sessionResultCode };

    let cancelled = false;

    const refreshBalance = async () => {
      try {
        const authToken =
          localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('adminToken');
        if (authToken) {
          try {
            const walletResponse = await fetch(`${API_BASE_URL}/wallet/balance`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json',
              },
            });

            if (walletResponse.ok) {
              const walletData = await walletResponse.json();
              if (walletData?.success) {
                const points =
                  walletData.data?.points ??
                  walletData.data?.balance ??
                  walletData.data?.totalPoints ??
                  walletData.data?.totalBalance;
                if (!cancelled && typeof points === 'number') {
                  setUserPoints(points);
                  const mergedUser = updateStoredUserData({ points });
                  if (mergedUser) {
                    updateUserStateFromData(mergedUser);
                  }
                }
              }
            }
          } catch (walletError) {
            // fallback below
          }
        }

        const response = await pointService.getMyPoints();
        if (!cancelled && response?.success) {
          const points = response.data?.totalPoints ?? response.data?.points ?? 0;
          setUserPoints(points);
          const mergedUser = updateStoredUserData({ points });
          if (mergedUser) {
            updateUserStateFromData(mergedUser);
          }
        }
      } catch (error) {
        // ignore; balance will refresh on next poll
      }
    };

    const timer = setTimeout(() => {
      fetchAndUpdateUserPoints();
    }, 600);
    refreshSession?.();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [sessionResultCode, sessionId, refreshSession, fetchAndUpdateUserPoints]);

  useEffect(() => {
    if (!sessionId) {
      return;
    }
    if (!['payout', 'invite-bet'].includes(phaseKey)) {
      return;
    }
    fetchAndUpdateUserPoints();
  }, [sessionId, phaseKey, fetchAndUpdateUserPoints]);

  return (
    <div className="min-h-screen bg-gray-50">
      <XocDiaHeader
        onBack={handleBackRequest}
        gameName={gameName}
        userName={userName}
        balanceDisplay={balanceDisplay}
        isLoadingBalance={loadingPoints}
        onOpenBetHistory={() => setIsHistoryDrawerOpen(true)}
      />

      <main className="px-3 sm:px-3 md:px-5 lg:px-8 pt-2 md:pt-4 pb-4 md:pb-6">
        <div className="max-w-screen-2xl mx-auto space-y-4 md:space-y-6">
          <div className="grid gap-2 sm:gap-3 lg:gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
            <XocDiaLiveStream resultOverlay={resultOverlay} countdownDisplay={countdownDisplay} />

            <div className="grid gap-1 sm:gap-2 lg:gap-3.5 content-start">
              <section className="space-y-1 sm:space-y-1.5">
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

                <XocDiaQuickBetBoard
                  columnOptions={columnOptions}
                  selectedQuickBets={selectedQuickBets}
                  isBettingLocked={isBettingLocked}
                  plainEnabledCodes={plainEnabledCodes}
                  styledPlainCodes={styledPlainCodes}
                  onSelectQuickBet={handleQuickBetSelect}
                />

                <XocDiaChipSelector
                  chipOptions={chipOptions}
                  selectedChipValue={selectedChipValue}
                  onSelectChip={handleQuickChipSelect}
                  onOpenCustomChipModal={handleOpenCustomChipModal}
                  onClearCustomChip={handleClearCustomChip}
                />

                <XocDiaQuickActionBar
                  quickActionButtons={quickActionButtons}
                  onAction={handleQuickAction}
                  disabled={isBettingLocked || isPlacingBet}
                />

                <XocDiaStatsPanel
                  activeStatsTab={activeStatsTab}
                  onChangeTab={setActiveStatsTab}
                  columns={STATS_COLUMNS}
                  rows={STATS_ROWS}
                  chanLeGrid={chanLeStatsGrid}
                  taiXiuGrid={taiXiuStatsGrid}
                />
              </section>
            </div>
          </div>
        </div>
      </main>

      <XocDiaCustomChipModal
        isOpen={isCustomChipModalOpen}
        customChipValue={customChipValue}
        onCustomChipValueChange={handleCustomChipValueChange}
        customChipError={customChipError}
        availableChipOptions={availableChipOptions}
        customChipSelections={customChipSelections}
        onToggleChipSelection={handleToggleChipSelection}
        onSelectAllChips={handleSelectAllChips}
        onClose={handleCloseCustomChipModal}
        onSubmit={handleCustomChipSubmit}
      />
        <XocDiaBetHistoryDrawer
          isOpen={isHistoryDrawerOpen}
          onClose={() => setIsHistoryDrawerOpen(false)}
          optionLookup={quickBetOptionLookup}
        />
      <LogoutConfirmModal
        isOpen={showExitConfirmModal}
        onClose={() => setShowExitConfirmModal(false)}
        onConfirm={handleConfirmExit}
        title="Thoát khỏi game?"
        message="Bạn sẽ rời khỏi trò chơi hiện tại. Bạn có chắc chắn muốn thoát không?"
        icon="mdi:exit-run"
        confirmIcon="mdi:exit-to-app"
        confirmLabel="Thoát game"
        confirmLoadingLabel="Đang thoát..."
        iconContainerClass="bg-red-100 text-red-600"
        confirmButtonClass="bg-red-500 hover:bg-red-600"
      />
    </div>
  );
};

export default XocDiaGamePage;

