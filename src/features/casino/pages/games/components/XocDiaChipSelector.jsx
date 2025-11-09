import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';

const XocDiaChipSelector = ({ chipOptions, selectedChipValue, onSelectChip, onOpenCustomChipModal }) => {
  const chipScrollRef = useRef(null);
  const [chipScrollState, setChipScrollState] = useState({ canScrollLeft: false, canScrollRight: false });

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
        onClick={() => onSelectChip(chip.value)}
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
          onClick={onOpenCustomChipModal}
          className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-dashed border-[#149b60]/40 text-xs font-semibold uppercase tracking-wide text-[#149b60]/60 transition hover:border-[#0f4c2c] hover:text-[#0f4c2c]"
        >
          --
        </button>
      </div>
    </div>
  );
};

export default XocDiaChipSelector;

