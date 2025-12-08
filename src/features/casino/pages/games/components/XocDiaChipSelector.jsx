import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';

const XocDiaChipSelector = ({
  chipOptions,
  selectedChipValue,
  onSelectChip,
  onOpenCustomChipModal,
  onClearCustomChip,
}) => {
  const chipScrollRef = useRef(null);
  const [chipScrollState, setChipScrollState] = useState({ canScrollLeft: false, canScrollRight: false });
  const [customChip, setCustomChip] = useState(() => {
    if (typeof window === 'undefined') {
      return { label: '', value: null };
    }
    const stored = window.localStorage.getItem('xocdia_custom_chip');
    if (!stored) {
      return { label: '', value: null };
    }
    try {
      const parsed = JSON.parse(stored);
      return {
        label: parsed?.label || '',
        value: typeof parsed?.value === 'number' ? parsed.value : null,
      };
    } catch (error) {
      return { label: '', value: null };
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const handleCustomChipUpdate = (event) => {
      const detail = event?.detail;
      if (detail && typeof detail.value === 'number' && detail.label) {
        setCustomChip({
          label: detail.label,
          value: detail.value,
        });
      } else {
        setCustomChip({ label: '', value: null });
      }
    };

    window.addEventListener('xocdia-custom-chip-updated', handleCustomChipUpdate);
    return () => {
      window.removeEventListener('xocdia-custom-chip-updated', handleCustomChipUpdate);
    };
  }, []);

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

  const getChipIconSrc = (label) => {
    switch (label) {
      case '10K':
        return '/pokerchip/10K.svg';
      case '20K':
        return '/pokerchip/20K.svg';
      case '50K':
        return '/pokerchip/50K.svg';
      case '100K':
        return '/pokerchip/100K.svg';
      case '200K':
        return '/pokerchip/200K.svg';
      case '500K':
        return '/pokerchip/500K.svg';
      case '1M':
        return '/pokerchip/1M.svg';
      case '10M':
        return '/pokerchip/10M.svg';
      case '20M':
        return '/pokerchip/20M.svg';
      case '50M':
        return '/pokerchip/50M.svg';
      default:
        return null;
    }
  };

  const formatChipLabel = (label) => {
    if (label.endsWith('K')) {
      return label.replace(/K$/, '');
    }
    return label;
  };

  const renderChipButton = (chip) => {
    const isSelected = selectedChipValue === chip.value;
    const iconSrc = getChipIconSrc(chip.label);
    return (
      <div className="relative flex items-center justify-center p-1.5">
        {/* Viền phát sáng đỏ sát chip khi được chọn */}
        {isSelected && (
          <div 
            className="absolute rounded-full blur-sm"
            style={{
              background: 'radial-gradient(circle at center, rgba(255, 82, 82, 1) 70%, rgba(239, 68, 68, 1) 85%, transparent 100%)',
              width: '52px',
              height: '52px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: -1
            }}
          />
        )}
        <button
          key={chip.value}
          type="button"
          onClick={() => onSelectChip(chip.value)}
          className={`relative flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full transition-all duration-200 bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 ${
            isSelected
              ? 'opacity-100 border-3 border-red-500'
              : 'opacity-100 hover:shadow-md border-2 border-transparent'
          }`}
          aria-pressed={isSelected}
          style={isSelected ? {
            borderWidth: '3px',
            borderColor: '#EF4444',
            boxShadow: '0 0 4px rgba(255, 82, 82, 1), 0 0 6px rgba(239, 68, 68, 1), 0 0 8px rgba(220, 38, 38, 0.8)'
          } : {}}
        >
        {iconSrc ? (
          <>
            <img
              src={iconSrc}
              alt={chip.label}
              className="absolute inset-0 h-full w-full object-contain transition"
              draggable={false}
            />
            <span className="relative flex h-full w-full items-center justify-center text-xs font-semibold uppercase tracking-wide text-gray-900 drop-shadow-sm">
              {formatChipLabel(chip.label)}
            </span>
          </>
        ) : (
          <span className="flex h-full w-full items-center justify-center text-xs font-semibold uppercase tracking-wide text-gray-900">
            {formatChipLabel(chip.label)}
          </span>
        )}
        </button>
      </div>
    );
  };

  const customChipDisplayLabel = formatChipLabel(customChip.label || '');

  return (
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
          className="flex w-full gap-0 overflow-x-auto py-1 pl-1 pr-1"
          style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none' }}
        >
          {chipOptions
            .filter((chip) => chip.label && chip.label !== customChip.label)
            .map((chip) => renderChipButton(chip))}
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
        <div className="relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center">
          {customChip.value != null ? (
            <>
              {/* Viền phát sáng đỏ sát chip khi được chọn */}
              {selectedChipValue === customChip.value && (
                <div 
                  className="absolute rounded-full blur-sm"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(255, 82, 82, 1) 70%, rgba(239, 68, 68, 1) 85%, transparent 100%)',
                    width: '48px',
                    height: '48px',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: -1
                  }}
                />
              )}
              <button
                type="button"
                onClick={() => onSelectChip(customChip.value)}
                className={`relative h-full w-full rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 ${
                  selectedChipValue === customChip.value
                    ? 'opacity-100 border-3 border-red-500'
                    : 'opacity-100 hover:shadow-md border-2 border-transparent'
                }`}
                aria-label="Chọn phỉnh tùy chỉnh"
                aria-pressed={selectedChipValue === customChip.value}
                style={selectedChipValue === customChip.value ? {
                  borderWidth: '3px',
                  borderColor: '#EF4444',
                  boxShadow: '0 0 4px rgba(255, 82, 82, 1), 0 0 6px rgba(239, 68, 68, 1), 0 0 8px rgba(220, 38, 38, 0.8)'
                } : {}}
              >
              <img
                src="/pokerchip/tuychinh.svg"
                alt="Phỉnh tùy chỉnh"
                className="absolute inset-0 h-full w-full object-contain transition"
                draggable={false}
              />
              <span className="relative flex h-full w-full items-center justify-center text-xs font-semibold uppercase tracking-wide text-gray-900 drop-shadow-sm">
                {customChipDisplayLabel}
              </span>
              <span
                role="button"
                tabIndex={0}
                className="absolute -top-1 -right-1 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-semibold text-gray-600 shadow cursor-pointer"
                onClick={(event) => {
                  event.stopPropagation();
                  const chipInfo = { ...customChip };
                  setCustomChip({ label: '', value: null });
                  if (selectedChipValue === customChip.value) {
                    onSelectChip(null);
                  }
                  onClearCustomChip?.(chipInfo);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    event.stopPropagation();
                    const chipInfo = { ...customChip };
                    setCustomChip({ label: '', value: null });
                    if (selectedChipValue === customChip.value) {
                      onSelectChip(null);
                    }
                    onClearCustomChip?.(chipInfo);
                  }
                }}
                aria-label="Xóa phỉnh tùy chỉnh"
              >
                ×
              </span>
            </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onOpenCustomChipModal}
              className="relative h-full w-full rounded-full transition hover:scale-105"
            >
              <img
                src="/pokerchip/tuychinh.svg"
                alt="Thêm phỉnh tùy chỉnh"
                className="absolute inset-0 h-full w-full object-contain opacity-80"
                draggable={false}
              />
              <span className="relative text-xl font-semibold text-[#149b60]">+</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default XocDiaChipSelector;

