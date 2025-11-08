import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { message } from 'antd';
import pointService from '../../../../services/pointService';
import xocDiaQuickBetService from '../../../../services/xocDiaQuickBetService';
import useXocDiaSession from '../../hooks/useXocDiaSession';
import xocDiaBetService from '../../../../services/xocDiaBetService';

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
    displayOrder: 4,
  },
  {
    code: 'odd',
    label: 'Lẻ',
    payoutMultiplier: 1.96,
    pattern: [],
    layoutGroup: 'TOP',
    displayOrder: 5,
  },
  {
    code: 'four-white',
    label: '4 Trắng',
    payoutMultiplier: 14.5,
    pattern: ['white', 'white', 'white', 'white'],
    layoutGroup: 'BOTTOM',
    displayOrder: 1,
  },
  {
    code: 'three-white',
    label: 'Lớn',
    payoutMultiplier: 3.7,
    pattern: [],
    layoutGroup: 'TOP',
    displayOrder: 2,
  },
  {
    code: 'three-red',
    label: 'Nhỏ',
    payoutMultiplier: 3.7,
    pattern: [],
    layoutGroup: 'TOP',
    displayOrder: 3,
  },
  {
    code: 'three-white-one-red',
    label: '3 Trắng 1 Đỏ',
    payoutMultiplier: 1.95,
    pattern: ['white', 'white', 'white', 'red'],
    layoutGroup: 'BOTTOM',
    displayOrder: 2,
  },
  {
    code: 'three-red-one-white',
    label: '3 Đỏ 1 Trắng',
    payoutMultiplier: 1.95,
    pattern: ['red', 'red', 'red', 'white'],
    layoutGroup: 'BOTTOM',
    displayOrder: 3,
  },
  {
    code: 'four-red',
    label: '4 Đỏ',
    payoutMultiplier: 14.5,
    pattern: ['red', 'red', 'red', 'red'],
    layoutGroup: 'BOTTOM',
    displayOrder: 4,
  },
  {
    code: 'four-white-or-four-red',
    label: '4 Trắng & 4 Đỏ',
    payoutMultiplier: 7,
    pattern: ['white', 'white', 'white', 'white', 'red', 'red', 'red', 'red'],
    layoutGroup: 'BOTTOM',
    displayOrder: 5,
  },
];

const statsHistory = [
  ['4', '1', '2', '3', '2', '1', '1', '2', '1', '2', '2', '1', '2', '1', '2', '3', '2'],
  ['0', '', '1', '', '', '2', '', '1', '', '1', '2', '1', '', '1', '3', '', '2'],
];
const statsPatternGridData = [
  ['T', 'X', 'T', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['X', '2', 'X', 'X', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['T', 'X', '2', 'T', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['2', '2', 'T', '2', '2', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['T', 'T', '2', 'T', 'X', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['X', 'X', '', '2', '', '', '', '', '', '', '', '', '', '', '', '', ''],
];

const essentialQuickBetCodes = [
  'even',
  'three-white',
  'three-red',
  'two-two',
  'odd',
  'four-white',
  'three-white-one-red',
  'three-red-one-white',
  'four-red',
  'four-white-or-four-red',
];

const defaultChipOptions = [
  { label: '10K', value: 10000 },
  { label: '20K', value: 20000 },
  { label: '50K', value: 50000 },
  { label: '100K', value: 100000 },
  { label: '200K', value: 200000 },
  { label: '500K', value: 500000 },
  { label: '1M', value: 1000000 },
  { label: '10M', value: 10000000 },
];
const defaultChipLabels = defaultChipOptions.map((chip) => chip.label);

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

const formatChipDisplayValue = (value) => {
  if (value == null) {
    return '';
  }

  if (value >= 1000000) {
    const millions = value / 1000000;
    const formatted = millions.toFixed(3).replace(/\.?0+$/, '');
    return `${formatted}M`;
  }

  if (value >= 1000) {
    const thousands = value / 1000;
    const formatted = thousands.toFixed(3).replace(/\.?0+$/, '');
    return `${formatted}K`;
  }

  return value.toLocaleString('vi-VN');
};

const extractUserName = (data) => {
  if (!data || typeof data !== 'object') {
    return '';
  }
  return data.username || data.name || data.displayName || '';
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

const normalizeQuickBetOptions = (options, defaultOptionMap) => {
  const mergeWithDefault = (option) => {
    if (!option?.code) {
      return option;
    }

    const defaultOption = defaultOptionMap.get(option.code);
    if (!defaultOption) {
      const payoutMultiplier = option.payoutMultiplier ?? 0;
      return {
        ...option,
        payoutMultiplier,
        ratio: formatRatioLabel(payoutMultiplier),
      };
    }

    const payoutMultiplier =
      option.payoutMultiplier && option.payoutMultiplier > 0
        ? option.payoutMultiplier
        : defaultOption.payoutMultiplier;

    const pattern =
      option.pattern && option.pattern.length > 0 ? option.pattern : defaultOption.pattern;

    return {
      ...defaultOption,
      ...option,
      payoutMultiplier,
      pattern,
      ratio: formatRatioLabel(payoutMultiplier),
      layoutGroup: defaultOption.layoutGroup,
      displayOrder: defaultOption.displayOrder,
    };
  };

  const optionMap = new Map();
  options.forEach((option) => {
    const merged = mergeWithDefault(option);
    if (merged?.code) {
      optionMap.set(merged.code, merged);
    }
  });

  essentialQuickBetCodes.forEach((code) => {
    if (!optionMap.has(code) && defaultOptionMap.has(code)) {
      optionMap.set(code, defaultOptionMap.get(code));
    }
  });

  const normalized = Array.from(optionMap.values()).map((option) => mergeWithDefault(option));
  normalized.sort((a, b) => a.displayOrder - b.displayOrder);
  return normalized;
};

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
  const chipScrollRef = useRef(null);
  const [chipScrollState, setChipScrollState] = useState({ canScrollLeft: false, canScrollRight: false });
  const [chipOptions, setChipOptions] = useState(defaultChipOptions);
  const [isCustomChipModalOpen, setIsCustomChipModalOpen] = useState(false);
  const [customChipValue, setCustomChipValue] = useState('');
  const [customChipError, setCustomChipError] = useState('');
  const [customChipSelections, setCustomChipSelections] = useState(new Set(defaultChipOptions.map((chip) => chip.label)));
  const availableChipOptions = useMemo(() => {
    const map = new Map();
    defaultChipOptions.forEach((chip) => map.set(chip.label, chip.value));
    chipOptions.forEach((chip) => map.set(chip.label, chip.value));
    return Array.from(map.entries()).map(([label, value]) => ({ label, value }));
  }, [chipOptions]);
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
  const allowedPatternBetCodes = useMemo(
    () =>
      new Set(
        quickBetOptions
          .filter((option) => Array.isArray(option.pattern) && option.pattern.length > 0)
          .map((option) => option.code)
      ),
    [quickBetOptions]
  );
  const placeableBets = useMemo(
    () =>
      Object.entries(selectedQuickBets).filter(([code, bet]) => {
        const value = bet?.totalValue ?? bet?.value ?? 0;
        return allowedPatternBetCodes.has(code) && value > 0;
      }),
    [allowedPatternBetCodes, selectedQuickBets]
  );
  const totalBetValue = useMemo(
    () =>
      placeableBets.reduce((sum, [, bet]) => {
        const value = bet?.totalValue ?? bet?.value ?? 0;
        return sum + value;
      }, 0),
    [placeableBets]
  );
  const totalBetPointsDisplay = useMemo(
    () => `${Number(totalBetValue || 0).toLocaleString('vi-VN')} điểm`,
    [totalBetValue]
  );
  const unsupportedSelectedCodes = useMemo(
    () =>
      Object.keys(selectedQuickBets).filter((code) => !allowedPatternBetCodes.has(code)),
    [allowedPatternBetCodes, selectedQuickBets]
  );
  const hasUnsupportedSelection = unsupportedSelectedCodes.length > 0;
  const styledPlainCodes = new Set(['even', 'odd', 'three-white', 'three-red']);
  const findOptionByCode = (code) => quickBetOptions.find((option) => option.code === code);
  const columnCodes = {
    left: ['four-white', 'three-white-one-red', 'two-two'],
    middleLeft: ['even', 'three-white'],
    middleRight: ['odd', 'three-red'],
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

  const placeableBetCount = placeableBets.length;
  const disablePlaceButton = isBettingLocked || isPlacingBet || placeableBetCount === 0;

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

    const updateStoredUserData = (partialData = {}) => {
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
    };

    const loadUserDataFromCache = () => {
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
    };

    const loadUserDataFromLocalStorage = () => {
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
    };

    const updateUserStateFromData = (data) => {
      if (!isMounted || !data) {
        return;
      }
      if (typeof data.points === 'number') {
        setUserPoints(data.points);
      }
      const name = extractUserName(data);
      if (name) {
        setUserName(name);
      }
    };

    const fetchPoints = async () => {
      if (!isMounted) return;
      setLoadingPoints(true);

      const cachedData = loadUserDataFromCache();
      if (cachedData) {
        updateUserStateFromData(cachedData);
        setLoadingPoints(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          const userData = loadUserDataFromLocalStorage();
          if (userData) {
            updateUserStateFromData(userData);
          } else {
            setUserPoints(0);
            setUserName('');
          }
          if (isMounted) {
            setLoadingPoints(false);
          }
          return;
        }

        const response = await pointService.getMyPoints();
        if (!isMounted) return;

        if (response?.success) {
          const points = response.data?.totalPoints ?? response.data?.points ?? 0;
          const mergedUser = updateStoredUserData({ points });
          setUserPoints(points);
          if (mergedUser) {
            updateUserStateFromData(mergedUser);
          } else {
            const localUser = loadUserDataFromLocalStorage();
            if (localUser) {
              updateUserStateFromData({ ...localUser, points });
            }
          }
        } else {
          const userData = loadUserDataFromLocalStorage();
          if (userData) {
            updateUserStateFromData(userData);
          } else {
            setUserPoints(0);
            setUserName('');
          }
        }
      } catch (error) {
        if (!isMounted) return;
        const userData = loadUserDataFromLocalStorage();
        if (userData) {
          updateUserStateFromData(userData);
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
  }, []);

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

  const patternGridRows = statsPatternGridData.length;
  const patternGridColumns = statsPatternGridData[0]?.length ?? 0;

  const getChipClasses = (value) => {
    if (!value) return null;
    const isWhite = value === '0' || value === '1' || value === '3';
    return isWhite
      ? 'border-white bg-white text-[#1f1f1f]'
      : 'border-red-500 bg-red-500 text-white';
  };

  const getPatternCellClasses = (value) => {
    switch (value) {
      case 'T':
        return 'bg-[#ef4444] text-white border-[#ef4444]';
      case 'X':
        return 'bg-white text-[#0f4c2c] border-white';
      case '2':
        return 'bg-[#2563eb] text-white border-[#1d4ed8]';
      default:
        return '';
    }
  };

  const chunkPattern = (pattern, chunkSize = 4) => {
    if (!pattern?.length) {
      return [];
    }
    const chunks = [];
    for (let i = 0; i < pattern.length; i += chunkSize) {
      chunks.push(pattern.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const renderQuickBetButton = (option) => {
    const selectedBet = selectedQuickBets[option.code];
    const isSelected = Boolean(selectedBet);
    const displayLabel =
      selectedBet?.label ?? formatChipDisplayValue(selectedBet?.value);

    const isCentralLabel = styledPlainCodes.has(option.code);
    const isPatternBet = Array.isArray(option.pattern) && option.pattern.length > 0;
    const isDisabled = isBettingLocked || (!isPatternBet && !allowedPatternBetCodes.has(option.code));
    const isComingSoon = !isPatternBet;
    const baseClass =
      'group relative flex h-full w-full flex-col items-center justify-center rounded-xl border px-3 pt-3 pb-1.5 sm:pt-[13px] sm:pb-[8px] text-center shadow-sm transition';
    const variantClass = isDisabled
      ? 'border-[#dbeafe] bg-white text-gray-400 cursor-not-allowed opacity-60'
      : isSelected
      ? 'border-[#63c892] bg-gradient-to-b from-[#d7f6e6] via-[#adebc8] to-[#82dfa9] text-[#0f4c2c]'
      : 'border-[#3abf86] bg-white text-[#0f4c2c] shadow hover:border-[#f5c453] hover:shadow-md';

    const handleButtonClick = () => {
      if (!isPatternBet) {
        message.info('Cược Tài/Xỉu/Chẵn/Lẻ sẽ được hỗ trợ trong bản cập nhật tiếp theo.');
        return;
      }
      handleQuickBetSelect(option);
    };

    return (
      <button
        key={option.code}
        type="button"
        onClick={handleButtonClick}
        aria-disabled={isDisabled}
        className={`${baseClass} ${variantClass}`}
      >
        {isSelected && displayLabel ? (
          <span
            className={`absolute z-10 rounded-md bg-[#f5c453] px-1.5 py-0.5 font-semibold uppercase tracking-wide text-[#0f4c2c] leading-none shadow-md ${
              isCentralLabel
                ? 'left-1/2 top-1 -translate-x-1/2 px-2 py-[3px] text-base sm:text-lg'
                : 'left-1 top-1 text-sm'
            }`}
          >
            {displayLabel}
          </span>
        ) : null}
        {option.pattern.length === 0 ? (
          <>
            <div
              className={`font-black uppercase tracking-wide ${
                styledPlainCodes.has(option.code)
                  ? 'text-[#111827]'
                  : isSelected
                  ? 'text-[#0f4c2c]'
                  : 'text-[#0f4c2c]'
              } ${styledPlainCodes.has(option.code) ? 'text-lg' : 'text-sm'}`}
            >
              {option.label}
            </div>
            <div
              className={`mt-0.5 inline-block rounded-md px-1 py-0.5 font-semibold uppercase tracking-[0.2em] leading-tight backdrop-blur-sm ${
                isSelected ? 'bg-white text-[#111827]' : 'bg-white/70 text-[#0f4c2c]'
              }`}
              style={{ fontSize: '12px' }}
            >
              {option.ratio}
            </div>
            {isComingSoon ? (
              <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.3em] text-gray-400">
                Sắp ra mắt
              </span>
            ) : null}
          </>
        ) : (
          <>
            <div
              className={`inline-block rounded-md px-1 py-0.5 font-semibold uppercase tracking-[0.2em] leading-tight backdrop-blur-sm ${
                isSelected ? 'bg-white text-[#111827]' : 'bg-white/70 text-[#0f4c2c]'
              }`}
              style={{ fontSize: '12px' }}
            >
              {option.ratio}
            </div>
            <div className="mt-2 flex flex-col items-center justify-center gap-1">
              {chunkPattern(option.pattern).map((row, rowIndex) => (
                <div key={`${option.code}-row-${rowIndex}`} className="flex items-center justify-center gap-1">
                  {row.map((color, index) => (
                    <span
                      key={`${option.code}-${rowIndex}-${index}`}
                      className={`h-3 w-3 sm:h-4 sm:w-4 rounded-full border-2 shadow-sm transition-shadow ${
                        color === 'white' ? 'bg-white border-black' : 'bg-[#e02020] border-black'
                      }`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </button>
    );
  };

  const handleOpenCustomChipModal = () => {
    setCustomChipValue('');
    setCustomChipError('');
    setCustomChipSelections(new Set(chipOptions.map((chip) => chip.label)));
    setIsCustomChipModalOpen(true);
  };

  const handleCloseCustomChipModal = () => {
    setIsCustomChipModalOpen(false);
    setCustomChipValue('');
    setCustomChipError('');
    setCustomChipSelections(new Set(chipOptions.map((chip) => chip.label)));
  };

  const handleCustomChipValueChange = (event) => {
    const digitsOnly = event.target.value.replace(/\D/g, '').slice(0, 3);
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
    setCustomChipSelections(new Set(availableChipOptions.map((chip) => chip.label)));
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

  const handleCustomChipSubmit = (event) => {
    event.preventDefault();
    const trimmed = customChipValue.trim();
    let label = null;
    let value = null;

    if (trimmed) {
      if (!/^\d{1,3}$/.test(trimmed)) {
        setCustomChipError('Chỉ nhập tối đa 3 chữ số');
        return;
      }

      const numeric = Number(trimmed);
      if (numeric === 0) {
        setCustomChipError('Giá trị phải lớn hơn 0');
        return;
      }

      label = `${numeric}K`;
      value = numeric * 1000;
    }

    const nextSelections = new Set(customChipSelections);
    if (label) {
      nextSelections.add(label);
    }

    const availableMap = new Map();
    defaultChipOptions.forEach((chip) => availableMap.set(chip.label, chip.value));
    chipOptions.forEach((chip) => availableMap.set(chip.label, chip.value));
    if (label && value !== null) {
      availableMap.set(label, value);
    }

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

    setChipOptions(newOrder);
    setCustomChipSelections(new Set(newOrder.map((chip) => chip.label)));
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
    setTimeout(() => {
      if (chipScrollRef.current) {
        chipScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        updateChipScrollState();
      }
    }, 60);
  };

  const updateChipScrollState = useCallback(() => {
    const container = chipScrollRef.current;
    if (!container) {
      return;
    }
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setChipScrollState({
      canScrollLeft: scrollLeft > 0,
      canScrollRight: scrollLeft + clientWidth < scrollWidth - 1,
    });
  }, []);

  useEffect(() => {
    const container = chipScrollRef.current;
    if (!container) {
      return undefined;
    }

    updateChipScrollState();
    container.addEventListener('scroll', updateChipScrollState);
    window.addEventListener('resize', updateChipScrollState);

    return () => {
      container.removeEventListener('scroll', updateChipScrollState);
      window.removeEventListener('resize', updateChipScrollState);
    };
  }, [updateChipScrollState]);

  useEffect(() => {
    updateChipScrollState();
  }, [chipOptions, updateChipScrollState]);

  const scrollChips = (direction) => {
    const container = chipScrollRef.current;
    if (!container) {
      return;
    }
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });

    setTimeout(updateChipScrollState, 350);
  };

  const renderChipButton = (chip) => {
    const isSelected = selectedChipValue === chip.value;
    return (
      <button
        key={chip.value}
        type="button"
        onClick={() => handleQuickChipSelect(chip.value)}
        className={`flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold uppercase tracking-wide transition ${
          isSelected
            ? 'border-[#f5c34a] bg-[#0f4c2c] text-white shadow-lg shadow-[#f5c34a]/30'
            : 'border-[#149b60]/70 bg-white text-[#0f4c2c] shadow-sm hover:shadow-md'
        }`}
      >
        {chip.label}
      </button>
    );
  };

  const handleQuickChipSelect = (chipValue) => {
    if (chipValue == null) {
      return;
    }
    const label =
      chipOptions.find((chip) => chip.value === chipValue)?.label ??
      availableChipOptions.find((chip) => chip.value === chipValue)?.label ??
      formatChipDisplayValue(chipValue);
    setSelectedChipValue(chipValue);
    setSelectedChipLabel(label);
  };

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

  const handlePlaceBet = useCallback(async () => {
    if (disablePlaceButton) {
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
        message.error(response.message || 'Không thể đặt cược');
      }
    } catch (error) {
      message.error(error?.message || 'Không thể đặt cược');
    } finally {
      setIsPlacingBet(false);
    }
  }, [disablePlaceButton, placeableBetDetails, selectedQuickBets, sessionId]);

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

        <div className="flex items-center">
          <div className="flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-2.5 py-1.5 text-left">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-200 text-gray-600">
              <Icon icon="mdi:account" className="h-4 w-4" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-xs font-semibold text-gray-800 truncate max-w-[110px]">
                {userName || 'Người chơi'}
              </span>
              <span className="text-xs font-semibold text-amber-500">
                {balanceDisplay}
              </span>
            </span>
          </div>
        </div>
      </header>

      <main className="px-3 sm:px-3 md:px-5 lg:px-8 pt-2 md:pt-4 pb-4 md:pb-6">
        <div className="max-w-screen-2xl mx-auto space-y-4 md:space-y-6">
          <div className="grid gap-2 sm:gap-3 lg:gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
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
              {resultOverlay}
              <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 z-20">
                <div className="flex items-center px-1 py-1">
                  {countdownDisplay}
                </div>
              </div>
            </section>

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

                <div
                  className="grid gap-1 sm:gap-1.5 items-stretch"
                  style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}
                >
                  <div className="grid h-full grid-rows-3 gap-1 sm:gap-1.5">
                    {columnOptions.left.map((option, index) =>
                      option ? (
                        renderQuickBetButton(option)
                      ) : (
                        <div key={`left-placeholder-${index}`} className="pointer-events-none opacity-0" />
                      )
                    )}
                  </div>
                  <div className="grid h-full grid-rows-2 gap-1 sm:gap-1.5">
                    {columnOptions.middleLeft.map((option, index) =>
                      option ? (
                        renderQuickBetButton(option)
                      ) : (
                        <div key={`middle-left-placeholder-${index}`} className="pointer-events-none opacity-0" />
                      )
                    )}
                  </div>
                  <div className="grid h-full grid-rows-2 gap-1 sm:gap-1.5">
                    {columnOptions.middleRight.map((option, index) =>
                      option ? (
                        renderQuickBetButton(option)
                      ) : (
                        <div key={`middle-right-placeholder-${index}`} className="pointer-events-none opacity-0" />
                      )
                    )}
                  </div>
                  <div className="grid h-full grid-rows-3 gap-1 sm:gap-1.5">
                    {columnOptions.right.map((option, index) =>
                      option ? (
                        renderQuickBetButton(option)
                      ) : (
                        <div key={`right-placeholder-${index}`} className="pointer-events-none opacity-0" />
                      )
                    )}
                  </div>
                </div>

              <div
                className="grid items-center gap-2.5 rounded-2xl p-1.5 sm:p-2"
                style={{ gridTemplateColumns: 'minmax(0,6fr) minmax(0,1fr)' }}
              >
                <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => scrollChips('left')}
                    aria-label="Xem phỉnh phía trước"
                    className={`flex h-8 w-8 items-center justify-center rounded-full border border-emerald-500/40 bg-white text-emerald-600 shadow-sm transition hover:bg-emerald-50 ${
                      chipScrollState.canScrollLeft ? '' : 'opacity-40'
                    }`}
                    disabled={!chipScrollState.canScrollLeft}
                  >
                    <Icon icon="mdi:chevron-left" className="h-5 w-5" />
                  </button>

                  <div
                    ref={chipScrollRef}
                    className="flex w-full gap-2 overflow-x-auto py-0 pr-1"
                    style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none' }}
                  >
                    {chipOptions.map((chip) => renderChipButton(chip))}
                  </div>

                  <button
                    type="button"
                    onClick={() => scrollChips('right')}
                    aria-label="Xem phỉnh phía sau"
                    className={`flex h-8 w-8 items-center justify-center rounded-full border border-emerald-500/40 bg-white text-emerald-600 shadow-sm transition hover:bg-emerald-50 ${
                      chipScrollState.canScrollRight ? '' : 'opacity-40'
                    }`}
                    disabled={!chipScrollState.canScrollRight}
                  >
                    <Icon icon="mdi:chevron-right" className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={handleOpenCustomChipModal}
                    className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-dashed border-[#149b60]/40 text-xs font-semibold uppercase tracking-wide text-[#149b60]/60 transition hover:border-[#0f4c2c] hover:text-[#0f4c2c]"
                  >
                    --
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {quickActionButtons.map((button) => (
                  <button
                    key={button.action}
                    type="button"
                    onClick={() => handleQuickAction(button.action)}
                    className={`flex flex-1 min-w-[120px] items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold tracking-wide transition hover:shadow-md focus:outline-none focus:ring-0 focus:ring-offset-0 active:scale-[0.99] ${button.style}`}
                  >
                    <Icon icon={button.icon} className="h-5 w-5" />
                    <span>{button.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-2 rounded-xl border border-emerald-200 bg-white/70 p-3 text-sm text-emerald-900">
                <div className="flex items-center justify-between">
                  <span className="font-semibold uppercase tracking-wide">Tổng cược</span>
                  <span className="text-base font-bold text-emerald-600">{totalBetPointsDisplay}</span>
                </div>
                {placeableBetDetails.length > 0 ? (
                  <ul className="space-y-1">
                    {placeableBetDetails.map((bet) => (
                      <li key={bet.code} className="flex items-center justify-between text-xs">
                        <span className="font-medium uppercase text-gray-600">{bet.label}</span>
                        <span className="font-semibold text-emerald-700">
                          {Number(bet.amount).toLocaleString('vi-VN')} điểm
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-xs text-gray-500">Chưa chọn cược hợp lệ</span>
                )}
                {hasUnsupportedSelection ? (
                  <p className="text-xs font-medium text-amber-600">
                    Một số cược (Chẵn/Lẻ/Tài/Xỉu) chưa được hỗ trợ đặt cược tự động.
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={handlePlaceBet}
                  disabled={disablePlaceButton}
                  className="mt-1 flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 text-sm font-semibold uppercase tracking-wide text-white transition hover:from-emerald-600 hover:to-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {isPlacingBet ? 'Đang đặt...' : 'Đặt cược'}
                </button>
              </div>

                <section className="rounded-xl border border-[#1aab6f]/50 bg-gradient-to-br from-[#0f4c2c] via-[#139257] to-[#17a76a] px-3 py-3 text-white shadow-inner space-y-3">
                  <header className="flex items-center gap-2 text-xs font-semibold uppercase">
                    <button
                      type="button"
                      onClick={() => setActiveStatsTab('1')}
                      className={`rounded-lg px-3 py-1.5 shadow transition ${
                        activeStatsTab === '1'
                          ? 'bg-white text-[#0b2919]'
                          : 'bg-white/10 text-white/75 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      Thống kê 1
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveStatsTab('2')}
                      className={`rounded-lg px-3 py-1.5 shadow transition ${
                        activeStatsTab === '2'
                          ? 'bg-white text-[#0b2919]'
                          : 'bg-white/10 text-white/75 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      Thống kê 2
                    </button>
                  </header>

                  <div className="space-y-3">
                    <div className="rounded-lg border border-white/15 bg-white/5 p-2">
                      <div
                        className="grid"
                        style={{
                          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
                        }}
                      >
                        {(activeStatsTab === '1' ? statsGrid : statsPatternGridData).map((row, rowIndex) =>
                          row.map((cell, cellIndex) => (
                            <div
                              key={`${activeStatsTab === '1' ? 'cell' : 'pattern'}-${rowIndex}-${cellIndex}`}
                              className="flex h-5 w-full items-center justify-center border border-white/20"
                            >
                              {cell ? (
                                activeStatsTab === '1' ? (
                                  <span
                                    className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border leading-none ${getChipClasses(cell)}`}
                                    style={{ fontSize: '10px' }}
                                  >
                                    {cell}
                                  </span>
                                ) : (
                                  <span
                                    className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border leading-none ${getPatternCellClasses(cell)}`}
                                    style={{ fontSize: '10px' }}
                                  >
                                    {cell}
                                  </span>
                                )
                              ) : null}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>
                </section>
              </section>
            </div>
          </div>
        </div>
      </main>

      {isCustomChipModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-xs rounded-2xl bg-white p-4 shadow-lg space-y-4">
            <form className="space-y-3" onSubmit={handleCustomChipSubmit}>
              <div className="space-y-2">
                <label className="block text-xs font-medium uppercase tracking-wide text-gray-600">
                  Giá trị (K)
                </label>
                <input
                  autoFocus
                  type="text"
                  inputMode="numeric"
                  value={customChipValue}
                  onChange={handleCustomChipValueChange}
                    className="w-full rounded-xl border border-emerald-400/40 px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Ví dụ: 250"
                />
                {customChipError ? (
                  <p className="text-xs font-medium text-red-500">{customChipError}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-gray-600">
                    Chọn phỉnh hiển thị
                  </span>
                  <button
                    type="button"
                    onClick={handleSelectAllChips}
                    className="rounded-lg border border-emerald-500/40 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-600 transition hover:bg-emerald-50"
                  >
                    Tất cả
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableChipOptions.map((chip) => {
                    const isActive = customChipSelections.has(chip.label);
                    return (
                      <button
                        key={chip.label}
                        type="button"
                        onClick={() => handleToggleChipSelection(chip.label)}
                        className={`flex h-11 w-11 items-center justify-center rounded-full border text-xs font-semibold uppercase tracking-wide transition ${
                          isActive
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm'
                            : 'border-gray-300 bg-white text-gray-500 hover:border-emerald-300 hover:text-emerald-600'
                        }`}
                      >
                        {chip.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCloseCustomChipModal}
                  className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:from-emerald-600 hover:to-emerald-700"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default XocDiaGamePage;

