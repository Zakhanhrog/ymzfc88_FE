import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  defaultChipOptions as defaultSicboChipOptions,
  defaultChipLabels as defaultSicboChipLabels,
  SICBO_CUSTOM_CHIP_EVENT,
  SICBO_CUSTOM_CHIP_STORAGE_KEY,
  buildSicboQuickBetMap,
} from './sicboConfig';
import sicboQuickBetService from '../../services/sicboQuickBetService';
import SicboHeader from './components/SicboHeader';
import SicboLiveStream from './components/SicboLiveStream';
import SicboPrimaryBetPanel from './components/SicboPrimaryBetPanel';
import SicboHistoryDrawer from './components/SicboHistoryDrawer';
import SicboChipSelector from './components/SicboChipSelector';
import SicboCustomChipModal from './components/SicboCustomChipModal';
import SicboBetActionBar from './components/SicboBetActionBar';
import { formatChipDisplayValue } from './sicboUtils';

const defaultChipLabelSet = new Set(defaultSicboChipLabels);

const SicboGamePage = () => {
  const navigate = useNavigate();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPoints, setUserPoints] = useState(0);
  const [chipOptions, setChipOptions] = useState(defaultSicboChipOptions);
  const [selectedChipValue, setSelectedChipValue] = useState(defaultSicboChipOptions[0]?.value ?? null);
  const [selectedChipLabel, setSelectedChipLabel] = useState(defaultSicboChipOptions[0]?.label ?? null);
  const [isCustomChipModalOpen, setIsCustomChipModalOpen] = useState(false);
  const [customChipValue, setCustomChipValue] = useState('');
  const [customChipError, setCustomChipError] = useState('');
  const [customChipSelections, setCustomChipSelections] = useState(
    () => new Set(defaultSicboChipLabels)
  );
  const [quickBetConfigs, setQuickBetConfigs] = useState(() => buildSicboQuickBetMap());
  const [isLoadingQuickBets, setIsLoadingQuickBets] = useState(false);
  const [quickBetError, setQuickBetError] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUserName(parsed?.username || parsed?.name || 'Người chơi');
        const points = parsed?.points ?? parsed?.balance ?? 0;
        setUserPoints(points);
      } catch (error) {
        setUserName('Người chơi');
        setUserPoints(0);
      }
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchQuickBets = async () => {
      setIsLoadingQuickBets(true);
      const response = await sicboQuickBetService.getActiveQuickBets();
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
  }, []);

  const balanceDisplay = useMemo(() => {
    if (!userPoints) {
      return '0 điểm';
    }
    return `${userPoints.toLocaleString('vi-VN')} điểm`;
  }, [userPoints]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <SicboHeader
        onBack={() => navigate('/casino/live')}
        gameName="Sicbo Bigwin"
        userName={userName}
        balanceDisplay={balanceDisplay}
        isLoadingBalance={false}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      <main className="px-3 sm:px-3 md:px-5 lg:px-8 pt-2 md:pt-4 pb-4 md:pb-6">
        <div className="max-w-screen-2xl mx-auto space-y-4 md:space-y-6">
          <div className="grid gap-2 sm:gap-3 lg:gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
            <SicboLiveStream />

            <div className="grid gap-1 sm:gap-2 lg:gap-3.5 content-start">
              <div className="space-y-1">
                <SicboPrimaryBetPanel quickBetConfigs={quickBetConfigs} />
                {isLoadingQuickBets ? (
                  <p className="text-xs text-gray-500">Đang tải tỷ lệ cược...</p>
                ) : quickBetError ? (
                  <p className="text-xs text-red-600">
                    {quickBetError}
                  </p>
                ) : null}
              </div>
              <SicboChipSelector
                chipOptions={chipOptions}
                selectedChipValue={selectedChipValue}
                onSelectChip={handleSelectChip}
                onOpenCustomChipModal={handleOpenCustomChipModal}
                onClearCustomChip={handleClearCustomChip}
              />
              <SicboBetActionBar onPlaceBet={() => {}} onClearBet={() => {}} />
              <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-1.5 sm:gap-2">
                <div className="rounded bg-gradient-to-br from-[#0f4c2c] via-[#139257] to-[#17a76a] p-1.5 text-white shadow-inner h-32">
                  <div
                    className="grid h-full w-full grid-rows-6 gap-[2px]"
                    style={{ gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' }}
                  >
                    {Array.from({ length: 90 }).map((_, index) => (
                      <div
                        key={`sicbo-grid-cell-${index}`}
                        className="rounded-sm bg-white/15 shadow-inner"
                      />
                    ))}
                  </div>
                </div>
                <div className="rounded bg-gradient-to-br from-[#0f4c2c] via-[#139257] to-[#17a76a] p-1.5 text-white shadow-inner h-32">
                  <div
                    className="grid h-full w-full grid-rows-6 gap-[2px]"
                    style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr)) minmax(0, 1.5fr)' }}
                  >
                    {Array.from({ length: 30 }).map((_, index) => (
                      <div
                        key={`sicbo-grid-secondary-cell-${index}`}
                        className="rounded-sm bg-white/15 shadow-inner"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SicboHistoryDrawer isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
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
    </div>
  );
};

export default SicboGamePage;


