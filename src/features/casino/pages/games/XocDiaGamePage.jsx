import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

const COUNTDOWN_DURATION = 30;

const PHASE_SEQUENCE = [
  { key: 'countdown', durationMs: COUNTDOWN_DURATION * 1000 },
  { key: 'betting-closed', label: 'Ngưng cược', durationMs: 1500 },
  { key: 'waiting-result', label: 'Chờ kết quả', durationMs: 3000 },
  { key: 'show-result', label: 'Trả kết quả', durationMs: 2000 },
  { key: 'invite-bet', label: 'Mời đặt cược', durationMs: 500 },
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
  const [countdownSeconds, setCountdownSeconds] = useState(COUNTDOWN_DURATION);
  const [countdownAngle, setCountdownAngle] = useState(360);
  const countdownResetRef = useRef(Date.now() + COUNTDOWN_DURATION * 1000);
  const countdownAngleRef = useRef(360);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const currentPhase = PHASE_SEQUENCE[phaseIndex];
  const [userPoints, setUserPoints] = useState(0);
  const [loadingPoints, setLoadingPoints] = useState(true);
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
  const totalBetDisplay = '0₫';
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
      if (!selectedChipValue) {
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
    [findChipLabelByValue, selectedChipLabel, selectedChipValue]
  );

  useEffect(() => {
    if (currentPhase.key !== 'countdown') {
      return undefined;
    }

    setCountdownSeconds(COUNTDOWN_DURATION);

    const timer = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 1) {
          setPhaseIndex((prevIndex) => (prevIndex + 1) % PHASE_SEQUENCE.length);
          return COUNTDOWN_DURATION;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPhase.key]);

  useEffect(() => {
    if (currentPhase.key === 'countdown') {
      return undefined;
    }

    const timeout = setTimeout(() => {
      setPhaseIndex((prevIndex) => (prevIndex + 1) % PHASE_SEQUENCE.length);
    }, currentPhase.durationMs);

    return () => clearTimeout(timeout);
  }, [currentPhase.key, currentPhase.durationMs]);

  useEffect(() => {
    if (currentPhase.key !== 'countdown') {
      setCountdownAngle(0);
      return undefined;
    }

    countdownResetRef.current = Date.now() + COUNTDOWN_DURATION * 1000;
    countdownAngleRef.current = 360;
    setCountdownAngle(360);

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
  }, [currentPhase.key]);

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

  const isCountdownPhase = currentPhase.key === 'countdown';
  const currentPhaseLabel = currentPhase.label ?? '';

  const countdownCircleStyle = {
    background: `conic-gradient(#ef4444 ${countdownAngle}deg, #3b0f0f ${countdownAngle}deg)`,
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

    return (
      <button
        key={option.code}
        type="button"
        onClick={() => handleQuickBetSelect(option)}
        className={`group relative flex h-full w-full flex-col items-center justify-center rounded-xl border px-3 pt-3 pb-1.5 sm:pt-[13px] sm:pb-[8px] text-center shadow-sm transition ${
          isSelected
            ? 'border-[#63c892] bg-gradient-to-b from-[#d7f6e6] via-[#adebc8] to-[#82dfa9] text-[#0f4c2c]'
            : 'border-[#f5c34a] bg-gradient-to-b from-[#1c9c65] via-[#25c37f] to-[#3adf99] text-white shadow-lg'
        }`}
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
      default:
        console.log(`Quick action selected: ${action}`);
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

