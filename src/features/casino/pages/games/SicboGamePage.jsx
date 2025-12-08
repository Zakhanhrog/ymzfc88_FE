import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { message } from '../../../../utils/notification';
import {
  defaultChipOptions as defaultSicboChipOptions,
  defaultChipLabels as defaultSicboChipLabels,
  SICBO_CUSTOM_CHIP_EVENT,
  SICBO_CUSTOM_CHIP_STORAGE_KEY,
  buildSicboQuickBetMap,
} from './sicboConfig';
import pointService from '../../../../services/pointService';
import { API_BASE_URL } from '../../../../utils/constants';
import sicboQuickBetService from '../../services/sicboQuickBetService';
import sicboResultHistoryService from '../../services/sicboResultHistoryService';
import sicboBetService from '../../services/sicboBetService';
import SicboHeader from './components/SicboHeader';
import SicboLiveStream from './components/SicboLiveStream';
import SicboPrimaryBetPanel from './components/SicboPrimaryBetPanel';
import SicboHistoryDrawer from './components/SicboHistoryDrawer';
import SicboChipSelector from './components/SicboChipSelector';
import SicboCustomChipModal from './components/SicboCustomChipModal';
import SicboBetActionBar from './components/SicboBetActionBar';
import SicboStatsBoard from './components/SicboStatsBoard';
import LogoutConfirmModal from '../../../../components/common/LogoutConfirmModal';
import SicboResultSequenceBoard from './components/SicboResultSequenceBoard';
import SicboHelpDrawer from './components/SicboHelpDrawer';
import { formatChipDisplayValue } from './sicboUtils';
import useSicboSession from '../../hooks/useSicboSession';

const defaultChipLabelSet = new Set(defaultSicboChipLabels);
const SICBO_BETTING_LOCKED_PHASES = ['betting-closed', 'waiting-result', 'show-result', 'payout', 'invite-bet'];

const cloneQuickBetSelection = (selection = {}) =>
  Object.entries(selection).reduce((acc, [code, bet]) => {
    acc[code] = { ...bet };
    return acc;
  }, {});

const SICBO_STATS_ROWS = 6;
const SICBO_STATS_MAIN_COLUMNS = 16;
const SICBO_STATS_SECONDARY_COLUMNS = 4;
const SICBO_STATS_TOTAL_COLUMNS = SICBO_STATS_MAIN_COLUMNS + SICBO_STATS_SECONDARY_COLUMNS;
const SICBO_STATS_CAPACITY = SICBO_STATS_ROWS * SICBO_STATS_TOTAL_COLUMNS;
const SICBO_DETAIL_COLUMNS = 4;
const SICBO_STATS_STORAGE_PREFIX = 'sicbo_stats_table_';

const getStatsStorageKey = (tableNumber) => `${SICBO_STATS_STORAGE_PREFIX}${tableNumber}`;

const createEmptyStatsGrid = () =>
  Array.from({ length: SICBO_STATS_ROWS }, () => Array(SICBO_STATS_TOTAL_COLUMNS).fill(null));

const createEmptyStatsColumns = () =>
  Array.from({ length: SICBO_STATS_TOTAL_COLUMNS }, () => Array(SICBO_STATS_ROWS).fill(null));

const createEmptyDetailGrid = () =>
  Array.from({ length: SICBO_STATS_ROWS }, () => Array(SICBO_DETAIL_COLUMNS).fill(null));

const convertColumnsToGrid = (columns) => {
  const grid = createEmptyStatsGrid();
  columns.forEach((column, columnIndex) => {
    column.forEach((cell, rowIndex) => {
      grid[rowIndex][columnIndex] = cell;
    });
  });
  return grid;
};

const shiftColumnsLeft = (columns) => {
  for (let index = 0; index < SICBO_STATS_TOTAL_COLUMNS - 1; index += 1) {
    columns[index] = columns[index + 1].map((cell) => (cell ? { ...cell } : null));
  }
  columns[SICBO_STATS_TOTAL_COLUMNS - 1] = Array(SICBO_STATS_ROWS).fill(null);
};

const pushEntryToColumns = (columns, cursor, entry) => {
  let { column, row, lastCategory } = cursor;

  if (lastCategory && entry.category === lastCategory) {
    row += 1;
    if (row >= SICBO_STATS_ROWS) {
      column += 1;
      row = 0;
    }
  } else {
    column = lastCategory === null ? 0 : column + 1;
    row = 0;
  }

  if (column >= SICBO_STATS_TOTAL_COLUMNS) {
    shiftColumnsLeft(columns);
    column = SICBO_STATS_TOTAL_COLUMNS - 1;
  }

  columns[column][row] = entry;
  return { column, row, lastCategory: entry.category };
};

const convertDetailRowsToGrid = (rows) => {
  const grid = createEmptyDetailGrid();
  rows.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      grid[rowIndex][cellIndex] = cell;
    });
  });
  return grid;
};

const buildDetailRow = (faces = [], sum) => {
  if (!Array.isArray(faces) || faces.length !== 3) {
    return null;
  }
  const computedSum = faces.reduce((total, value) => total + (Number.isFinite(value) ? value : 0), 0);
  const total = Number.isFinite(sum) ? sum : computedSum;
  let label;
  if (total === 3 || total === 18) {
    label = String(total);
  } else if (total >= 11) {
    label = 'T';
  } else {
    label = 'X';
  }
  return [
    { value: faces[0], type: 'face' },
    { value: faces[1], type: 'face' },
    { value: faces[2], type: 'face' },
    { value: label, type: 'label' },
  ];
};

const parseResultFaces = (code) => {
  if (!code || typeof code !== 'string') {
    return [];
  }
  const parts = code.split(/[^0-9]+/);
  const faces = [];
  parts.forEach((part) => {
    if (!part) {
      return;
    }
    const value = Number.parseInt(part, 10);
    if (Number.isInteger(value) && value >= 1 && value <= 6) {
      faces.push(value);
    }
  });
  return faces;
};

const resolveCategoryFromSum = (sum) => {
  if (sum === 3 || sum === 18) {
    return 'TRIPLE';
  }
  if (sum >= 11) {
    return 'BIG';
  }
  return 'SMALL';
};

const SicboGamePage = ({ tableNumber: initialTableNumber }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableFromQuery = searchParams.get('table');
  const tableNumber = initialTableNumber || tableFromQuery || '1';
  const numericTableNumber = Number(tableNumber) || 1;
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPoints, setUserPoints] = useState(0);
  const [chipOptions, setChipOptions] = useState(defaultSicboChipOptions);
  const [selectedChipValue, setSelectedChipValue] = useState(defaultSicboChipOptions[0]?.value ?? null);
  const [selectedChipLabel, setSelectedChipLabel] = useState(defaultSicboChipOptions[0]?.label ?? null);
  const [selectedQuickBets, setSelectedQuickBets] = useState({});
  const [isCustomChipModalOpen, setIsCustomChipModalOpen] = useState(false);
  const [customChipValue, setCustomChipValue] = useState('');
  const [customChipError, setCustomChipError] = useState('');
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [pendingTable, setPendingTable] = useState(numericTableNumber);
  const [customChipSelections, setCustomChipSelections] = useState(
    () => new Set(defaultSicboChipLabels)
  );
  const [quickBetConfigs, setQuickBetConfigs] = useState(() => buildSicboQuickBetMap());
  const quickBetOptionLookup = useMemo(() => {
    const map = new Map();
    if (!quickBetConfigs) {
      return map;
    }
    Object.entries(quickBetConfigs).forEach(([code, config]) => {
      if (!code) return;
      map.set(code, config);
      map.set(code.toLowerCase(), config);
    });
    return map;
  }, [quickBetConfigs]);
  const [isLoadingQuickBets, setIsLoadingQuickBets] = useState(false);
  const [quickBetError, setQuickBetError] = useState(null);
  const [sicboStatsGrid, setSicboStatsGrid] = useState(createEmptyStatsGrid());
  const [sicboStatsStartColumn, setSicboStatsStartColumn] = useState(0);
  const [sicboDetailGrid, setSicboDetailGrid] = useState(createEmptyDetailGrid());
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false);
  const {
    sessionStatus,
    sessionId,
    timer: { phaseKey, phaseLabel, countdownSeconds, countdownAngle },
    resultCode: sessionResultCode,
  } = useSicboSession({ pollIntervalMs: 1000, tableNumber: numericTableNumber });
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const [lastPlacedBets, setLastPlacedBets] = useState(null);
  const isSessionRunning = sessionStatus === 'RUNNING';
  const isCountdownPhase = isSessionRunning && phaseKey === 'countdown';
  const autoSubmitStateRef = useRef({ sessionId: null, triggered: false, signature: '' });
  const isBettingLocked = !isSessionRunning || SICBO_BETTING_LOCKED_PHASES.includes(phaseKey);
  const [loadingPoints, setLoadingPoints] = useState(false);
  const sicboColumnsRef = useRef(createEmptyStatsColumns());
  const sicboCursorRef = useRef({ column: 0, row: -1, lastCategory: null });
  const sicboHistoryEntriesRef = useRef([]);
  const sicboDetailRowsRef = useRef([]);
  const latestStatsSignatureRef = useRef('');
  const pendingStatsRefreshRef = useRef(null);
  const isMountedRef = useRef(true);
  const pendingResultRef = useRef({ sessionId: null, resultCode: null });

  const updateStoredUserData = useCallback((partialData = {}) => {
    try {
      const stored = localStorage.getItem('user');
      const existing = stored ? JSON.parse(stored) : {};
      const merged = { ...existing, ...partialData };
      localStorage.setItem('user', JSON.stringify(merged));
      return merged;
    } catch (error) {
      return null;
    }
  }, []);

  const loadUserDataFromLocalStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const data = JSON.parse(stored);
        return data && typeof data === 'object' ? data : null;
      }
    } catch (error) {
      // ignore parse error
    }
    return null;
  }, []);

  const loadStatsFromStorage = useCallback((tableNumber) => {
    if (typeof window === 'undefined') {
      return [];
    }
    try {
      const raw = window.localStorage.getItem(getStatsStorageKey(tableNumber));
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed
        .map((item) => {
          if (!item || typeof item !== 'object') {
            return null;
          }
          const sum = Number(item.sum);
          const category =
            typeof item.category === 'string' ? item.category.trim().toUpperCase() : undefined;
          const faces = Array.isArray(item.faces)
            ? item.faces.map((value) => Number(value)).filter((value) => Number.isFinite(value))
            : [];
          if (!Number.isFinite(sum) || !category || faces.length !== 3) {
            return null;
          }
          return { sum, category, faces };
        })
        .filter(Boolean);
    } catch (error) {
      return [];
    }
  }, []);

  const saveStatsToStorage = useCallback((tableNumber, entries) => {
    if (typeof window === 'undefined') {
      return;
    }
    if (!entries || entries.length === 0) {
      window.localStorage.removeItem(getStatsStorageKey(tableNumber));
      return;
    }
    const sanitized = entries
      .map((item) => {
        if (!item || typeof item !== 'object') {
          return null;
        }
        const sum = Number(item.sum);
        const category =
          typeof item.category === 'string' ? item.category.trim().toUpperCase() : undefined;
        const faces = Array.isArray(item.faces)
          ? item.faces.map((value) => Number(value)).filter((value) => Number.isFinite(value))
          : [];
        if (!Number.isFinite(sum) || !category || faces.length !== 3) {
          return null;
        }
        return { sum, category, faces };
      })
      .filter(Boolean)
      .slice(-SICBO_STATS_CAPACITY);
    if (sanitized.length === 0) {
      window.localStorage.removeItem(getStatsStorageKey(tableNumber));
      return;
    }
    try {
      window.localStorage.setItem(getStatsStorageKey(tableNumber), JSON.stringify(sanitized));
    } catch (error) {
      // ignore quota/storage errors
    }
  }, []);

  const updateUserStateFromData = useCallback(
    (data) => {
      if (!data) {
        return;
      }
      if (typeof data.points === 'number') {
        setUserPoints(data.points);
      }
      const name = data.username || data.name || data.fullName || '';
      if (name) {
        setUserName(name);
      }
    },
    []
  );

  const applyPointsUpdate = useCallback(
    (points) => {
      const numeric = typeof points === 'number' ? points : Number(points) || 0;
      setUserPoints(numeric);
      const merged = updateStoredUserData({ points: numeric });
      if (merged) {
        updateUserStateFromData(merged);
      }
    },
    [updateStoredUserData, updateUserStateFromData]
  );

  const fetchAndUpdateUserPoints = useCallback(async () => {
    setLoadingPoints(true);
    try {
      const response = await pointService.getMyPoints();
      if (response?.success) {
        const points = response.data?.totalPoints ?? response.data?.points ?? 0;
        applyPointsUpdate(points);
        setLoadingPoints(false);
        return true;
      }
    } catch (error) {
      // ignore
    }
    try {
      const token =
        localStorage.getItem('token') ||
        localStorage.getItem('authToken') ||
        localStorage.getItem('adminToken');
      if (token) {
        const walletResponse = await fetch(`${API_BASE_URL}/wallet/balance`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
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
              walletData.data?.totalBalance ??
              0;
            applyPointsUpdate(points);
            setLoadingPoints(false);
            return true;
          }
        }
      }
    } catch (error) {
      // ignore
    }
    const fallback = loadUserDataFromLocalStorage();
    if (fallback) {
      updateUserStateFromData(fallback);
    }
    setLoadingPoints(false);
    return false;
  }, [applyPointsUpdate, loadUserDataFromLocalStorage, updateUserStateFromData]);

  useEffect(() => {
    const localUser = loadUserDataFromLocalStorage();
    if (localUser) {
      updateUserStateFromData(localUser);
    } else {
      setUserName('Người chơi');
    }
    fetchAndUpdateUserPoints();
  }, [fetchAndUpdateUserPoints, loadUserDataFromLocalStorage, updateUserStateFromData]);

  useEffect(() => {
    let isMounted = true;

    const fetchQuickBets = async () => {
      setIsLoadingQuickBets(true);
      const response = await sicboQuickBetService.getActiveQuickBets(numericTableNumber);
      if (!isMounted) {
        return;
      }
      if (response.success && Array.isArray(response.data) && response.data.length > 0) {
        setQuickBetConfigs(buildSicboQuickBetMap(response.data));
        setQuickBetError(null);
      } else if (!response.success) {
        setQuickBetError(response.message || 'Không thể tải cấu hình quick bet Sicbo');
      }
      setIsLoadingQuickBets(false);
    };

    fetchQuickBets();

    return () => {
      isMounted = false;
    };
  }, [numericTableNumber]);

  const normalizeHistoryItem = useCallback((item) => {
    if (!item) {
      return null;
    }
    const faces = parseResultFaces(item.resultCode ?? item.code ?? item.result_code);
    const providedSum = Number(item.resultSum ?? item.sum);
    const computedSum =
      faces.length === 3
        ? faces.reduce((total, value) => total + (Number.isFinite(value) ? value : 0), 0)
        : null;
    const sum = Number.isFinite(providedSum) ? providedSum : computedSum;
    if (!Number.isFinite(sum)) {
      return null;
    }

    if (faces.length !== 3) {
      return null;
    }

    let category =
      typeof item.category === 'string' ? item.category.trim().toUpperCase() : undefined;
    if (category !== 'SMALL' && category !== 'BIG' && category !== 'TRIPLE') {
      category = resolveCategoryFromSum(sum);
    }
    return { sum, category, faces, resultCode: item.resultCode ?? null };
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (pendingStatsRefreshRef.current) {
        window.clearTimeout(pendingStatsRefreshRef.current);
        pendingStatsRefreshRef.current = null;
      }
    };
  }, []);

  const rebuildStatsFromHistory = useCallback(
    (items) => {
      const columns = createEmptyStatsColumns();
      let cursor = { column: 0, row: -1, lastCategory: null };
      const normalizedEntries = [];
      items.forEach((item) => {
        const normalized = normalizeHistoryItem(item);
        if (!normalized) {
          return;
        }
        cursor = pushEntryToColumns(columns, cursor, normalized);
        normalizedEntries.push(normalized);
      });
      const snapshot = columns.map((column) => column.map((cell) => (cell ? { ...cell } : null)));
      sicboColumnsRef.current = snapshot;
      sicboCursorRef.current = cursor;
      sicboHistoryEntriesRef.current = normalizedEntries;
      setSicboStatsGrid(convertColumnsToGrid(snapshot));
      const nextStart = Math.max(0, cursor.column - SICBO_STATS_MAIN_COLUMNS + 1);
      setSicboStatsStartColumn(nextStart);

      const detailRows = normalizedEntries
        .map((entry) => buildDetailRow(entry.faces, entry.sum))
        .filter(Boolean);
      const limitedDetailRows =
        detailRows.length > SICBO_STATS_ROWS
          ? detailRows.slice(detailRows.length - SICBO_STATS_ROWS)
          : detailRows;
      sicboDetailRowsRef.current = limitedDetailRows;
      setSicboDetailGrid(convertDetailRowsToGrid(limitedDetailRows));

      return normalizedEntries;
    },
    [normalizeHistoryItem]
  );

  const appendStatsEntry = useCallback(
    (entry) => {
      const columnsClone = sicboColumnsRef.current.map((column) =>
        column.map((cell) => (cell ? { ...cell } : null))
      );
      const updatedCursor = pushEntryToColumns(columnsClone, { ...sicboCursorRef.current }, entry);
      sicboColumnsRef.current = columnsClone;
      sicboCursorRef.current = updatedCursor;
      setSicboStatsGrid(convertColumnsToGrid(columnsClone));
      const nextStart = Math.max(0, updatedCursor.column - SICBO_STATS_MAIN_COLUMNS + 1);
      setSicboStatsStartColumn(nextStart);

      const historyClone = [...sicboHistoryEntriesRef.current, { ...entry }];
      if (historyClone.length > SICBO_STATS_CAPACITY) {
        historyClone.splice(0, historyClone.length - SICBO_STATS_CAPACITY);
      }
      sicboHistoryEntriesRef.current = historyClone;
      saveStatsToStorage(numericTableNumber, historyClone);
      const detailRow = buildDetailRow(entry.faces, entry.sum);
      if (detailRow) {
        const nextRows = [...sicboDetailRowsRef.current, detailRow];
        if (nextRows.length > SICBO_STATS_ROWS) {
          nextRows.shift();
        }
        sicboDetailRowsRef.current = nextRows;
        setSicboDetailGrid(convertDetailRowsToGrid(nextRows));
      }
    },
    [numericTableNumber, saveStatsToStorage]
  );

  const buildStatsEntryFromResult = useCallback((code) => {
    const faces = parseResultFaces(code);
    if (faces.length !== 3) {
      return null;
    }
    const sum = faces.reduce((total, value) => total + value, 0);
    return { sum, category: resolveCategoryFromSum(sum), faces };
  }, []);

  const fetchStatsFromServer = useCallback(
    async (fallbackToStorage = true) => {
      const response = await sicboResultHistoryService.getRecent({
        tableNumber: numericTableNumber,
        limit: SICBO_STATS_CAPACITY,
      });

      if (!isMountedRef.current) {
        return null;
      }

      if (response.success && Array.isArray(response.data) && response.data.length > 0) {
        const ordered = [...response.data].reverse();
        const normalized = rebuildStatsFromHistory(ordered);
        saveStatsToStorage(numericTableNumber, normalized ?? []);
        const last = ordered[ordered.length - 1];
        latestStatsSignatureRef.current = `${last.sessionId ?? ''}:${last.resultCode ?? ''}`;
        return normalized;
      }

      if (!fallbackToStorage) {
        return null;
      }

      const storedEntries = loadStatsFromStorage(numericTableNumber);
      if (storedEntries.length > 0) {
        rebuildStatsFromHistory(storedEntries);
        latestStatsSignatureRef.current = '';
      } else {
        rebuildStatsFromHistory([]);
        saveStatsToStorage(numericTableNumber, []);
        latestStatsSignatureRef.current = '';
      }
      return storedEntries;
    },
    [loadStatsFromStorage, numericTableNumber, rebuildStatsFromHistory, saveStatsToStorage]
  );

  useEffect(() => {
    fetchStatsFromServer();
  }, [fetchStatsFromServer]);

  useEffect(() => {
    if (!sessionId || !sessionResultCode) {
      pendingResultRef.current = { sessionId: null, resultCode: null };
      return;
    }

    const signature = `${sessionId}:${sessionResultCode}`;
    if (latestStatsSignatureRef.current === signature) {
      return;
    }

    // Cập nhật stats
    const entry = buildStatsEntryFromResult(sessionResultCode);
    if (!entry) {
      return;
    }
    latestStatsSignatureRef.current = signature;
    appendStatsEntry(entry);
    if (pendingStatsRefreshRef.current) {
      window.clearTimeout(pendingStatsRefreshRef.current);
      pendingStatsRefreshRef.current = null;
    }
    pendingStatsRefreshRef.current = window.setTimeout(() => {
      pendingStatsRefreshRef.current = null;
      fetchStatsFromServer(false);
    }, 1200);

    // Cập nhật số dư khi có kết quả mới
    const alreadyHandled =
      pendingResultRef.current.sessionId === sessionId &&
      pendingResultRef.current.resultCode === sessionResultCode;
    if (alreadyHandled) {
      return;
    }

    pendingResultRef.current = { sessionId, resultCode: sessionResultCode };

    let cancelled = false;

    // Cập nhật số dư sau khi có kết quả (settle bets đã xong)
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
                  applyPointsUpdate(points);
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
          applyPointsUpdate(points);
        }
      } catch (error) {
        // ignore; balance will refresh on next poll
      }
    };

    // Delay một chút để đảm bảo backend đã settle bets xong
    const timer = setTimeout(() => {
      refreshBalance();
    }, 600);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [appendStatsEntry, buildStatsEntryFromResult, sessionId, sessionResultCode, applyPointsUpdate]);

  const balanceDisplay = useMemo(() => {
    if (loadingPoints) {
      return 'Đang tải...';
    }
    return `${Number(userPoints || 0).toLocaleString('vi-VN')} điểm`;
  }, [loadingPoints, userPoints]);

  const availableChipOptions = useMemo(() => {
    const map = new Map();
    defaultSicboChipOptions.forEach((chip) => map.set(chip.label, chip.value));
    chipOptions.forEach((chip) => map.set(chip.label, chip.value));
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(SICBO_CUSTOM_CHIP_STORAGE_KEY);
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

  const handleSelectChip = useCallback(
    (chipValue) => {
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
    },
    [availableChipOptions, chipOptions]
  );

  const handleQuickBetSelect = useCallback(
    (bet) => {
      if (isBettingLocked) {
        message.warning('Phiên đã ngưng cược, vui lòng chờ phiên tiếp theo');
        return;
      }
      if (!selectedChipValue) {
        message.warning('Vui lòng chọn mệnh giá phỉnh trước khi đặt cược');
        return;
      }

      // Tính tổng tiền hiện tại đã chọn (tính trước khi setState)
      const currentTotal = Object.values(selectedQuickBets).reduce((sum, b) => {
        const amount = b?.totalValue ?? b?.value ?? 0;
        return sum + amount;
      }, 0);

      // Tính tổng tiền sau khi thêm cược mới
      const existing = selectedQuickBets[bet.code];
      const previousTotal = existing?.totalValue ?? existing?.value ?? 0;
      const newTotal = previousTotal + selectedChipValue;
      const totalAfterAdd = currentTotal - previousTotal + newTotal;

      // Kiểm tra số dư TRƯỚC KHI setState để tránh gọi nhiều lần
      if (totalAfterAdd > userPoints) {
        message.error(`Số dư không đủ! Bạn còn ${Number(userPoints || 0).toLocaleString('vi-VN')} điểm, nhưng đang đặt ${Number(totalAfterAdd).toLocaleString('vi-VN')} điểm.`);
        return; // Không thay đổi state
      }

      const chipLabel = selectedChipLabel ?? findChipLabelByValue(selectedChipValue);

      setSelectedQuickBets((prev) => ({
        ...prev,
        [bet.code]: {
          totalValue: newTotal,
          label: formatChipDisplayValue(newTotal),
          lastChipValue: selectedChipValue,
          lastChipLabel: chipLabel,
        },
      }));
    },
    [findChipLabelByValue, isBettingLocked, selectedChipLabel, selectedChipValue, selectedQuickBets, userPoints]
  );

  const handleClearQuickBets = useCallback(() => {
    setSelectedQuickBets({});
  }, []);

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

  const handleQuickAction = useCallback(
    (action) => {
      console.log('[Sicbo handleQuickAction] Action:', action, 'selectedQuickBets:', selectedQuickBets);
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
          setSelectedQuickBets(cloneQuickBetSelection(lastPlacedBets));
          break;
        default:
          break;
      }
    },
    [isBettingLocked, lastPlacedBets, selectedQuickBets]
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const stored = window.localStorage.getItem(SICBO_CUSTOM_CHIP_STORAGE_KEY);
    if (!stored) {
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      if (parsed?.label && typeof parsed?.value === 'number') {
        setChipOptions((prev) => {
          const filtered = prev.filter((chip) => chip.label !== parsed.label);
          return [{ label: parsed.label, value: parsed.value }, ...filtered];
        });
        setSelectedChipValue(parsed.value);
        setSelectedChipLabel(parsed.label);
      }
    } catch (error) {
      // ignore invalid storage
    }
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
    const digitsOnly = event.target.value.replace(/\D/g, '');
    // Giới hạn tối đa 1000
    let value = digitsOnly;
    if (digitsOnly && Number(digitsOnly) > 1000) {
      value = '1000';
    }
    setCustomChipValue(value);
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
    setCustomChipSelections(new Set(defaultSicboChipLabels));
    if (customChipError) {
      setCustomChipError('');
    }
  };

  const handleCustomChipSubmit = (event) => {
    event.preventDefault();
    const trimmed = customChipValue.trim();
    let label = null;
    let value = null;

    if (trimmed) {
      if (!/^\d+$/.test(trimmed)) {
        setCustomChipError('Chỉ nhập số');
        return;
      }

      const numeric = Number(trimmed);
      if (numeric === 0) {
        setCustomChipError('Giá trị phải lớn hơn 0');
        return;
      }

      if (numeric > 1000) {
        setCustomChipError('Giá trị tối đa là 1000');
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
    defaultSicboChipOptions.forEach((chip) => availableMap.set(chip.label, chip.value));
    chipOptions.forEach((chip) => availableMap.set(chip.label, chip.value));

    const newOrder = [];

    if (label && value !== null) {
      newOrder.push({ label, value });
    }

    defaultSicboChipOptions.forEach((chip) => {
      if (nextSelections.has(chip.label) && chip.label !== label) {
        const val = availableMap.get(chip.label) ?? chip.value;
        newOrder.push({ label: chip.label, value: val });
      }
      availableMap.delete(chip.label);
    });

    availableMap.forEach((val, chipLabel) => {
      if (!defaultSicboChipLabels.includes(chipLabel) && chipLabel !== label && nextSelections.has(chipLabel)) {
        newOrder.push({ label: chipLabel, value: val });
      }
    });

    if (typeof window !== 'undefined') {
      if (label && value !== null) {
        window.localStorage.setItem(
          SICBO_CUSTOM_CHIP_STORAGE_KEY,
          JSON.stringify({ label, value })
        );
        window.dispatchEvent(new CustomEvent(SICBO_CUSTOM_CHIP_EVENT, { detail: { label, value } }));
      } else {
        window.localStorage.removeItem(SICBO_CUSTOM_CHIP_STORAGE_KEY);
        window.dispatchEvent(new CustomEvent(SICBO_CUSTOM_CHIP_EVENT, { detail: null }));
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

  const handleClearCustomChip = useCallback(
    (chip) => {
      setChipOptions((prev) => {
        const filtered = prev.filter((option) => option.label !== chip?.label);
        const next = filtered.length > 0 ? filtered : defaultSicboChipOptions;
        if (!next.some((option) => option.value === selectedChipValue)) {
          if (next.length > 0) {
            setSelectedChipValue(next[0].value);
            setSelectedChipLabel(next[0].label);
          } else {
            setSelectedChipValue(null);
            setSelectedChipLabel(null);
          }
        } else if (chip?.label === selectedChipLabel) {
          const current = next.find((option) => option.value === selectedChipValue);
          if (current) {
            setSelectedChipLabel(current.label);
          }
        }
        return next;
      });
      setCustomChipSelections(new Set(defaultSicboChipLabels));
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(SICBO_CUSTOM_CHIP_STORAGE_KEY);
        window.dispatchEvent(new CustomEvent(SICBO_CUSTOM_CHIP_EVENT, { detail: null }));
      }
    },
    [selectedChipLabel, selectedChipValue]
  );

  const handleBackRequest = useCallback(() => {
    setShowExitConfirmModal(true);
  }, []);

  const handleConfirmExit = useCallback(() => {
    setShowExitConfirmModal(false);
    navigate('/casino/live/sicbo');
  }, [navigate]);

  const currentPhaseLabel = isSessionRunning ? phaseLabel || 'Đang xử lý' : 'Chờ phiên mới';
  const countdownCircleStyle = {
    background: `conic-gradient(#ef4444 ${countdownAngle}deg, #3b0f0f ${countdownAngle}deg)`,
  };

  const tableLabel = useMemo(() => {
    return `Bàn ${numericTableNumber}`;
  }, [numericTableNumber]);

  useEffect(() => {
    setPendingTable(numericTableNumber);
  }, [numericTableNumber]);

  useEffect(() => {
    setSelectedQuickBets({});
  }, [numericTableNumber]);

  useEffect(() => {
    sicboDetailRowsRef.current = [];
    setSicboDetailGrid(createEmptyDetailGrid());
    setSicboStatsStartColumn(0);
  }, [numericTableNumber]);

  const handleOpenTableModal = () => {
    setPendingTable(numericTableNumber);
    setIsTableModalOpen(true);
  };

  const countdownDisplay = isCountdownPhase ? (
    <div className="flex items-center">
      <div
        className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full p-[3px]"
        style={countdownCircleStyle}
        aria-live="polite"
      >
        <span className="flex h-full w-full items-center justify-center rounded-full bg-[#4a0c0c] text-[#fef3c7] shadow-inner px-1">
          <span className="text-[9px] font-semibold leading-none text-center tracking-wide">
            {Math.max(0, countdownSeconds ?? 0)}
          </span>
        </span>
      </div>
    </div>
  ) : (
    <div className="inline-flex items-center justify-center rounded-full bg-[#4a0c0c]/80 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wide text-[#fef3c7] shadow-sm">
      {currentPhaseLabel}
    </div>
  );

  const parsedResultFaces = useMemo(() => {
    if (!sessionResultCode || typeof sessionResultCode !== 'string') {
      return [];
    }
    const parts = sessionResultCode.split(/[-_,\s]+/).map((item) => Number.parseInt(item, 10));
    if (parts.length !== 3 || parts.some((value) => Number.isNaN(value) || value < 1 || value > 6)) {
      return [];
    }
    return parts;
  }, [sessionResultCode]);

  const latestResultRef = useRef({ faces: [], key: '' });
  const [resultOverlayState, setResultOverlayState] = useState({ faces: [], visible: false });
  const displayedResultSessionIdRef = useRef(null);

  // Lưu kết quả khi có parsedResultFaces và chỉ xóa khi sessionId thay đổi (bắt đầu phiên mới)
  useEffect(() => {
    if (parsedResultFaces.length === 3) {
      // Nếu sessionId thay đổi, xóa kết quả cũ
      if (displayedResultSessionIdRef.current !== null && displayedResultSessionIdRef.current !== sessionId) {
        setResultOverlayState({ faces: [], visible: false });
    }
      // Lưu kết quả mới
      const facesKey = parsedResultFaces.join('-');
      if (latestResultRef.current.key !== facesKey) {
        latestResultRef.current = { faces: parsedResultFaces, key: facesKey };
      }
      setResultOverlayState({ faces: parsedResultFaces, visible: true });
      displayedResultSessionIdRef.current = sessionId;
    } else if (sessionId && displayedResultSessionIdRef.current !== null && displayedResultSessionIdRef.current !== sessionId) {
      // Khi sessionId thay đổi (bắt đầu phiên mới), xóa kết quả
      setResultOverlayState({ faces: [], visible: false });
      displayedResultSessionIdRef.current = null;
    }
  }, [sessionId, parsedResultFaces]);

  const resultOverlay =
    resultOverlayState.visible && resultOverlayState.faces.length === 3 ? (
      <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-30 pointer-events-none">
        <div className="flex items-center justify-center gap-1 rounded-lg border border-white/20 bg-white/10 px-2 py-1.5 backdrop-blur-md shadow-[0_4px_12px_rgba(15,23,42,0.35)]">
            {resultOverlayState.faces.map((face, index) => (
              <div
                key={`sicbo-result-face-${index}`}
              className="flex h-6 w-6 items-center justify-center rounded bg-white/90 shadow-sm"
              >
                <img
                  src={`/matxucxac/${face}cham.svg`}
                  alt={`Mặt ${face}`}
                className="h-5 w-5 object-contain"
                  draggable={false}
                />
              </div>
            ))}
        </div>
      </div>
    ) : null;

  const placeableBets = useMemo(
    () =>
      Object.entries(selectedQuickBets).filter(([_, bet]) => {
        const amount = bet?.totalValue ?? bet?.value ?? 0;
        return amount > 0;
      }),
    [selectedQuickBets]
  );

  const placeableBetDetails = useMemo(
    () =>
      placeableBets.map(([code, bet]) => {
        const amount = bet?.totalValue ?? bet?.value ?? 0;
        const config = quickBetOptionLookup.get(code) || quickBetOptionLookup.get(code.toLowerCase()) || {};
        return {
          code,
          amount,
          label: config?.name ?? config?.label ?? code,
          payoutMultiplier: config?.payoutMultiplier,
        };
      }),
    [placeableBets, quickBetOptionLookup]
  );

  const betSignature = useMemo(() => {
    if (placeableBetDetails.length === 0) {
      return '';
    }
    return placeableBetDetails
      .map((item) => `${item.code}:${item.amount}`)
      .sort()
      .join('|');
  }, [placeableBetDetails]);

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
          tableNumber: numericTableNumber,
          sessionId,
          bets: placeableBetDetails.map((item) => ({
            code: item.code,
            amount: item.amount,
          })),
        };

        console.log('[Sicbo submitBets] Payload:', payload);
        const response = await sicboBetService.placeBets(payload);
        console.log('[Sicbo submitBets] Response:', response);
        
        if (response.success) {
          message.success(response.message || 'Đặt cược thành công!');
          // Lưu lịch sử cược để dùng cho chức năng "Lặp lại"
          setLastPlacedBets(cloneQuickBetSelection(selectedQuickBets));
          setSelectedQuickBets({});
          autoSubmitStateRef.current = {
            sessionId,
            triggered: true,
            signature: signatureOverride ?? betSignature,
          };
          if (response.data?.balanceAfter != null) {
            console.log('[Sicbo submitBets] Cập nhật balance:', response.data.balanceAfter);
            applyPointsUpdate(response.data.balanceAfter);
          } else {
            console.log('[Sicbo submitBets] Fetch balance từ API');
            await fetchAndUpdateUserPoints();
          }
        } else {
          const errorMessage = response.message || 'Đặt cược không thành công!';
          message.error(errorMessage);
          autoSubmitStateRef.current = {
            sessionId,
            triggered: false,
            signature: signatureOverride ?? betSignature,
          };
        }
      } catch (error) {
        const fallbackMessage = error?.message || 'Đặt cược không thành công!';
        message.error(fallbackMessage);
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
      applyPointsUpdate,
      betSignature,
      selectedQuickBets,
      fetchAndUpdateUserPoints,
      isBettingLocked,
      isPlacingBet,
      numericTableNumber,
      placeableBetDetails,
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
    if (countdownSeconds == null || countdownSeconds > 1) {
      return;
    }
    if (placeableBetDetails.length === 0) {
      console.log('[Sicbo Auto-Submit] Không có cược để đặt');
      return;
    }
    if (isPlacingBet) {
      console.log('[Sicbo Auto-Submit] Đang đặt cược, bỏ qua');
      return;
    }

    const state = autoSubmitStateRef.current;
    if (state.sessionId === sessionId && state.triggered && state.signature === betSignature) {
      console.log('[Sicbo Auto-Submit] Đã submit rồi, bỏ qua');
      return;
    }

    console.log('[Sicbo Auto-Submit] Tự động đặt cược:', {
      sessionId,
      betCount: placeableBetDetails.length,
      bets: placeableBetDetails,
      signature: betSignature,
    });
    autoSubmitStateRef.current = { sessionId, triggered: true, signature: betSignature };
    submitBets({ force: true, signatureOverride: betSignature });
  }, [
    betSignature,
    countdownSeconds,
    isCountdownPhase,
    isPlacingBet,
    placeableBetDetails,
    sessionId,
    submitBets,
  ]);

  useEffect(() => {
    setIsPlacingBet(false);
    autoSubmitStateRef.current = { sessionId: null, triggered: false, signature: '' };
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) {
      return;
    }
    if (['payout', 'invite-bet'].includes(phaseKey)) {
      fetchAndUpdateUserPoints();
    }
  }, [fetchAndUpdateUserPoints, phaseKey, sessionId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SicboHeader
        onBack={handleBackRequest}
        gameName={tableLabel}
        userName={userName}
        balanceDisplay={balanceDisplay}
        isLoadingBalance={loadingPoints}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      <main className="px-3 sm:px-3 md:px-5 lg:px-8 pt-2 md:pt-4 pb-4 md:pb-6">
        <div className="max-w-screen-2xl mx-auto space-y-4 md:space-y-6">
          <div className="grid gap-2 sm:gap-3 lg:gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
            <SicboLiveStream
              countdownDisplay={countdownDisplay}
              resultOverlay={resultOverlay}
              tableLabel={tableLabel}
              tableNumber={numericTableNumber}
              isAdmin={false}
            />

            <div className="grid gap-0.5 sm:gap-1 content-start">
              <div className="space-y-1">
              <SicboPrimaryBetPanel
                quickBetConfigs={quickBetConfigs}
                selectedQuickBets={selectedQuickBets}
                onSelectBet={handleQuickBetSelect}
                isBettingLocked={isBettingLocked}
              />
                {isLoadingQuickBets ? (
                  <p className="text-xs text-gray-500">Đang tải tỷ lệ cược...</p>
                ) : quickBetError ? (
                  <p className="text-xs text-red-600">
                    {quickBetError}
                  </p>
                ) : null}
              </div>
              <div className="-mt-1 sm:-mt-1.5">
              <SicboChipSelector
                chipOptions={chipOptions}
                selectedChipValue={selectedChipValue}
                onSelectChip={handleSelectChip}
                onOpenCustomChipModal={handleOpenCustomChipModal}
                onClearCustomChip={handleClearCustomChip}
              />
              </div>
              <SicboBetActionBar
                onClearBet={handleClearQuickBets}
                onChangeTable={handleOpenTableModal}
                isPlacingBet={isPlacingBet}
                quickActionButtons={quickActionButtons}
                onQuickAction={handleQuickAction}
                isBettingLocked={isBettingLocked}
              />
              <div className="grid grid-cols-[minmax(0,14fr)_minmax(0,4fr)] gap-1.5 sm:gap-2 items-stretch">
                <SicboStatsBoard
                  grid={sicboStatsGrid}
                  columnCount={SICBO_STATS_MAIN_COLUMNS}
                  startColumn={sicboStatsStartColumn}
                />
                <SicboResultSequenceBoard grid={sicboDetailGrid} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <SicboHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        optionLookup={quickBetOptionLookup}
      />
      <SicboHelpDrawer 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
        tableType={numericTableNumber === 1 ? 'table1' : 'table2'}
      />
      <SicboCustomChipModal
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
      {isTableModalOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-4 shadow-xl space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Đổi bàn Tài xỉu tà thiết</h3>
              <p className="text-sm text-gray-600 mt-1">Bạn đang chơi tại {tableLabel}. Chọn bàn muốn chuyển tới.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { number: 1, name: 'Tài Xỉu Thu Phế' },
                { number: 2, name: 'Tài Xỉu Thu Bão' },
              ].map((table) => (
                <button
                  key={`sicbo-table-switch-${table.number}`}
                  type="button"
                  onClick={() => setPendingTable(table.number)}
                  className={`flex flex-col items-center justify-center rounded-xl border px-4 py-3 text-sm font-semibold tracking-wide transition ${
                    pendingTable === table.number
                      ? 'border-[#f5c453] bg-[#fff8e6] text-[#0b1f15]'
                      : 'border-[#0f4c2c] text-[#0f4c2c] hover:bg-[#0f4c2c]/5'
                  }`}
                >
                  <span className="text-center leading-tight">{table.name}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsTableModalOpen(false);
                  if (pendingTable !== numericTableNumber) {
                    const tableNames = {
                      1: 'Tài Xỉu Thu Phế',
                      2: 'Tài Xỉu Thu Bão',
                    };
                    const tableName = tableNames[pendingTable] || `Bàn ${pendingTable}`;
                    message.success(`Đổi bàn thành công! Đã chuyển sang ${tableName}`);
                    navigate(`/casino/live/sicbo?table=${pendingTable}`);
                  }
                }}
                className="rounded-xl border border-[#0f4c2c] px-4 py-2 text-sm font-semibold text-[#0f4c2c] transition hover:bg-[#0f4c2c]/5"
              >
                Xác nhận
              </button>
              <button
                type="button"
                onClick={() => setIsTableModalOpen(false)}
                className="rounded-xl bg-gradient-to-r from-[#0f4c2c] to-[#149b60] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-[#0f4c2c]/20 transition hover:from-[#149b60] hover:to-[#0f4c2c]"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <LogoutConfirmModal
        isOpen={showExitConfirmModal}
        onClose={() => setShowExitConfirmModal(false)}
        onConfirm={handleConfirmExit}
        title={`Thoát khỏi ${tableLabel}?`}
        message={`Bạn sẽ rời khỏi ${tableLabel} hiện tại. Bạn có chắc chắn muốn thoát không?`}
        icon="mdi:dice-3-outline"
        confirmIcon="mdi:exit-to-app"
        confirmLabel={`Thoát ${tableLabel}`}
        confirmLoadingLabel="Đang thoát..."
        iconContainerClass="bg-amber-100 text-amber-600"
        confirmButtonClass="bg-amber-500 hover:bg-amber-600"
      />
    </div>
  );
};

export default SicboGamePage;


