import { useState } from 'react';
import { Icon } from '@iconify/react';
import { formatChipDisplayValue } from '../sicboUtils';

const diceFaceIconMap = {
  1: '/matxucxac/1cham.svg',
  2: '/matxucxac/2cham.svg',
  3: '/matxucxac/3cham.svg',
  4: '/matxucxac/4cham.svg',
  5: '/matxucxac/5cham.svg',
  6: '/matxucxac/6cham.svg',
};

const primaryBets = [
  {
    id: 'small',
    code: 'sicbo_primary_small',
    label: 'Xỉu',
    defaultMultiplier: 0.97,
  },
  {
    id: 'big',
    code: 'sicbo_primary_big',
    label: 'Tài',
    defaultMultiplier: 0.97,
  },
];

const combinationBets = [
  { id: 'triple-1', code: 'sicbo_combo_triple_1', faces: [1, 1, 1], defaultMultiplier: 20 },
  { id: 'triple-6', code: 'sicbo_combo_triple_6', faces: [6, 6, 6], defaultMultiplier: 20 },
  { id: 'triple-2', code: 'sicbo_combo_triple_2', faces: [2, 2, 2], defaultMultiplier: 20 },
  { id: 'triple-5', code: 'sicbo_combo_triple_5', faces: [5, 5, 5], defaultMultiplier: 20 },
  { id: 'triple-3', code: 'sicbo_combo_triple_3', faces: [3, 3, 3], defaultMultiplier: 20 },
  { id: 'triple-4', code: 'sicbo_combo_triple_4', faces: [4, 4, 4], defaultMultiplier: 20 },
];

const totalBetRows = [
  {
    id: 'row-top',
    variant: 'top',
    totals: [
      { id: 'total-4', code: 'sicbo_total_4', value: 4, defaultMultiplier: 30 },
      { id: 'total-5', code: 'sicbo_total_5', value: 5, defaultMultiplier: 18 },
      { id: 'total-6', code: 'sicbo_total_6', value: 6, defaultMultiplier: 14 },
      { id: 'total-7', code: 'sicbo_total_7', value: 7, defaultMultiplier: 12 },
      { id: 'total-8', code: 'sicbo_total_8', value: 8, defaultMultiplier: 8 },
      { id: 'total-9', code: 'sicbo_total_9', value: 9, defaultMultiplier: 6 },
      { id: 'total-10', code: 'sicbo_total_10', value: 10, defaultMultiplier: 6 },
    ],
    parity: {
      id: 'even',
      code: 'sicbo_parity_even',
      label: 'Chẵn',
      defaultMultiplier: 0.97,
      borderClass: 'border-red-500',
      textClass: 'text-red-600',
    },
  },
  {
    id: 'row-bottom',
    variant: 'bottom',
    totals: [
      { id: 'total-17', code: 'sicbo_total_17', value: 17, defaultMultiplier: 30 },
      { id: 'total-16', code: 'sicbo_total_16', value: 16, defaultMultiplier: 18 },
      { id: 'total-15', code: 'sicbo_total_15', value: 15, defaultMultiplier: 14 },
      { id: 'total-14', code: 'sicbo_total_14', value: 14, defaultMultiplier: 12 },
      { id: 'total-13', code: 'sicbo_total_13', value: 13, defaultMultiplier: 8 },
      { id: 'total-12', code: 'sicbo_total_12', value: 12, defaultMultiplier: 6 },
      { id: 'total-11', code: 'sicbo_total_11', value: 11, defaultMultiplier: 6 },
    ],
    parity: {
      id: 'odd',
      code: 'sicbo_parity_odd',
      label: 'Lẻ',
      defaultMultiplier: 0.97,
      borderClass: 'border-emerald-500',
      textClass: 'text-emerald-600',
    },
  },
];

const singleFaceBets = [
  { id: 'single-1', code: 'sicbo_single_1', face: 1, defaultMultiplier: 0.97 },
  { id: 'single-2', code: 'sicbo_single_2', face: 2, defaultMultiplier: 0.97 },
  { id: 'single-3', code: 'sicbo_single_3', face: 3, defaultMultiplier: 0.97 },
  { id: 'single-4', code: 'sicbo_single_4', face: 4, defaultMultiplier: 0.97 },
  { id: 'single-5', code: 'sicbo_single_5', face: 5, defaultMultiplier: 0.97 },
  { id: 'single-6', code: 'sicbo_single_6', face: 6, defaultMultiplier: 0.97 },
];

// Dice pair bets - 15 combinations (1:5)
const dicePairBets = [
  { id: 'pair-1-2', code: 'sicbo_pair_1_2', faces: [1, 2], defaultMultiplier: 5 },
  { id: 'pair-1-3', code: 'sicbo_pair_1_3', faces: [1, 3], defaultMultiplier: 5 },
  { id: 'pair-1-4', code: 'sicbo_pair_1_4', faces: [1, 4], defaultMultiplier: 5 },
  { id: 'pair-1-5', code: 'sicbo_pair_1_5', faces: [1, 5], defaultMultiplier: 5 },
  { id: 'pair-1-6', code: 'sicbo_pair_1_6', faces: [1, 6], defaultMultiplier: 5 },
  { id: 'pair-2-3', code: 'sicbo_pair_2_3', faces: [2, 3], defaultMultiplier: 5 },
  { id: 'pair-2-4', code: 'sicbo_pair_2_4', faces: [2, 4], defaultMultiplier: 5 },
  { id: 'pair-2-5', code: 'sicbo_pair_2_5', faces: [2, 5], defaultMultiplier: 5 },
  { id: 'pair-2-6', code: 'sicbo_pair_2_6', faces: [2, 6], defaultMultiplier: 5 },
  { id: 'pair-3-4', code: 'sicbo_pair_3_4', faces: [3, 4], defaultMultiplier: 5 },
  { id: 'pair-3-5', code: 'sicbo_pair_3_5', faces: [3, 5], defaultMultiplier: 5 },
  { id: 'pair-3-6', code: 'sicbo_pair_3_6', faces: [3, 6], defaultMultiplier: 5 },
  { id: 'pair-4-5', code: 'sicbo_pair_4_5', faces: [4, 5], defaultMultiplier: 5 },
  { id: 'pair-4-6', code: 'sicbo_pair_4_6', faces: [4, 6], defaultMultiplier: 5 },
  { id: 'pair-5-6', code: 'sicbo_pair_5_6', faces: [5, 6], defaultMultiplier: 5 },
];

// Double pairs - 6 combinations (1:8)
const dicePairDoubleBets = [
  { id: 'pair-double-1', code: 'sicbo_pair_double_1', faces: [1, 1], defaultMultiplier: 8 },
  { id: 'pair-double-2', code: 'sicbo_pair_double_2', faces: [2, 2], defaultMultiplier: 8 },
  { id: 'pair-double-3', code: 'sicbo_pair_double_3', faces: [3, 3], defaultMultiplier: 8 },
  { id: 'pair-double-4', code: 'sicbo_pair_double_4', faces: [4, 4], defaultMultiplier: 8 },
  { id: 'pair-double-5', code: 'sicbo_pair_double_5', faces: [5, 5], defaultMultiplier: 8 },
  { id: 'pair-double-6', code: 'sicbo_pair_double_6', faces: [6, 6], defaultMultiplier: 8 },
];

const formatRatio = (value) => {
  if (value === undefined || value === null) {
    return '1 : ?';
  }
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return `1 : ${value}`;
  }
  const formatted = Number.isInteger(numeric)
    ? numeric.toFixed(0)
    : numeric.toFixed(2).replace(/\.?0+$/, '');
  return `1 : ${formatted}`;
};

const resolveMultiplier = (configMap, code, fallback) => {
  const rawValue = configMap[code]?.payoutMultiplier;
  if (rawValue === undefined || rawValue === null || Number.isNaN(Number(rawValue))) {
    return fallback;
  }
  return Number(rawValue);
};

const baseButtonClass =
  'group relative flex flex-col items-center justify-center transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60';
const selectedButtonClass =
  'border-[#63c892] bg-gradient-to-b from-[#d7f6e6] via-[#adebc8] to-[#82dfa9] shadow-lg shadow-[#0f4c2c]/15 ring-1 ring-[#63c892]/40';
const defaultButtonClass =
  'border-[#3abf86] bg-white shadow-sm hover:border-[#f5c453] hover:shadow-md';

const getDisplayLabel = (selectedBet) => {
  if (!selectedBet) {
    return null;
  }
  if (selectedBet.label) {
    return selectedBet.label;
  }
  if (selectedBet.totalValue != null) {
    return formatChipDisplayValue(selectedBet.totalValue);
  }
  if (selectedBet.value != null) {
    return formatChipDisplayValue(selectedBet.value);
  }
  return null;
};

const renderPrimaryButton = (bet, quickBetConfigs, selectedBet, onSelect, isLocked = false) => (
  <button
    key={bet.id}
    type="button"
    onClick={() => onSelect(bet)}
    aria-pressed={Boolean(selectedBet)}
    disabled={isLocked}
    className={`${baseButtonClass} rounded-lg border px-3 py-[6px] text-center ${
      isLocked 
        ? 'cursor-not-allowed border-green-500'
        : selectedBet ? selectedButtonClass : defaultButtonClass
    }`}
  >
    {getDisplayLabel(selectedBet) ? (
      <span className="absolute left-1/2 top-[14px] -translate-x-1/2 rounded-md bg-[#f5c453] px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-[#0f4c2c] shadow-md">
        {getDisplayLabel(selectedBet)}
      </span>
    ) : null}
    <span
      className={`text-xl font-black tracking-wide font-pacifico ${
        bet.label === 'Tài' ? 'text-[#dc2626]' : 'text-[#0f4c2c]'
      }`}
    >
      {bet.label}
    </span>
    <span
      className="mt-1 font-semibold uppercase tracking-[0.12em] leading-tight text-[#0f4c2c]"
      style={{ fontSize: '11px' }}
    >
      {formatRatio(resolveMultiplier(quickBetConfigs, bet.code, bet.defaultMultiplier))}
    </span>
  </button>
);

const renderCombinationButton = (bet, quickBetConfigs, selectedBet, onSelect, isLocked = false) => {
  const displayLabel = getDisplayLabel(selectedBet);
  const ratioText = formatRatio(resolveMultiplier(quickBetConfigs, bet.code, bet.defaultMultiplier));
  return (
    <button
      key={bet.id}
      type="button"
      onClick={() => onSelect(bet)}
      aria-pressed={Boolean(selectedBet)}
      disabled={isLocked}
      className={`${baseButtonClass} h-full rounded-md border px-2 py-[2px] text-center ${
        isLocked
          ? 'cursor-not-allowed border-green-500'
          : selectedBet ? selectedButtonClass : defaultButtonClass
      }`}
    >
      <span className="sr-only">Cược tổ hợp {bet.faces.join(' - ')}</span>
      <div className="flex items-center justify-center gap-[2px]">
        {bet.faces.map((face, index) => (
          <img
            key={`${bet.id}-face-${index}`}
            src={diceFaceIconMap[face]}
            alt={`Mặt ${face}`}
            className="h-[18px] w-[18px] select-none object-contain"
            draggable={false}
          />
        ))}
      </div>
      <span
        className="relative mt-px font-semibold uppercase tracking-[0.08em] leading-tight text-[#0f4c2c]"
        style={{ fontSize: '11px' }}
      >
        <span className={displayLabel ? 'opacity-0' : ''}>{ratioText}</span>
        {displayLabel ? (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[4px] bg-[#f5c453] px-[4px] py-[1px] text-[10px] leading-tight text-[#0f4c2c] shadow-sm">
            {displayLabel}
          </span>
        ) : null}
      </span>
    </button>
  );
};

const renderTotalBetButton = (bet, variant, quickBetConfigs, selectedBet, onSelect, isLocked = false) => {
  const isBottom = variant === 'bottom';
  const displayLabel = getDisplayLabel(selectedBet);
  const ratioText = formatRatio(resolveMultiplier(quickBetConfigs, bet.code, bet.defaultMultiplier));
  return (
    <button
      key={bet.id}
      type="button"
      onClick={() => onSelect(bet)}
      aria-pressed={Boolean(selectedBet)}
      disabled={isLocked}
      className={`${baseButtonClass} h-full rounded border px-1.5 py-2 text-center ${
        isLocked
          ? 'cursor-not-allowed border-green-500'
          : selectedBet ? selectedButtonClass : defaultButtonClass
      }`}
    >
      <span
        className={`text-base font-bold leading-tight ${
          isBottom ? 'text-red-600' : selectedBet ? 'text-[#0f4c2c]' : 'text-[#0f172a]'
        }`}
      >
        {bet.value}
      </span>
      <span
        className="relative mt-px font-semibold uppercase tracking-[0.08em] leading-tight text-[#0f4c2c]"
        style={{ fontSize: '11px' }}
      >
        <span className={displayLabel ? 'opacity-0' : ''}>{ratioText}</span>
        {displayLabel ? (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[4px] bg-[#f5c453] px-[4px] py-[1px] text-[10px] leading-tight text-[#0f4c2c] shadow-sm">
            {displayLabel}
          </span>
        ) : null}
      </span>
    </button>
  );
};

const renderParityButton = (parity, quickBetConfigs, selectedBet, onSelect, isLocked = false) => {
  const displayLabel = getDisplayLabel(selectedBet);
  const ratioText = formatRatio(resolveMultiplier(quickBetConfigs, parity.code, parity.defaultMultiplier));
  return (
    <button
      key={parity.id}
      type="button"
      onClick={() => onSelect(parity)}
      aria-pressed={Boolean(selectedBet)}
      disabled={isLocked}
      className={`${baseButtonClass} h-full rounded border px-2.5 py-1.5 text-center ${
        isLocked
          ? 'cursor-not-allowed border-green-500'
          : selectedBet ? `${selectedButtonClass} ${parity.borderClass}` : `${defaultButtonClass} ${parity.borderClass}`
      }`}
    >
      <span className={`text-base font-black uppercase tracking-wide leading-tight ${parity.textClass}`}>
        {parity.label}
      </span>
      <span
        className="relative mt-px font-semibold uppercase tracking-[0.08em] leading-tight text-[#0f4c2c]"
        style={{ fontSize: '11px' }}
      >
        <span className={displayLabel ? 'opacity-0' : ''}>{ratioText}</span>
        {displayLabel ? (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[4px] bg-[#f5c453] px-[4px] py-[1px] text-[10px] leading-tight text-[#0f4c2c] shadow-sm">
            {displayLabel}
          </span>
        ) : null}
      </span>
    </button>
  );
};

const renderSingleFaceButton = (bet, quickBetConfigs, selectedBet, onSelect, isLocked = false) => {
  const displayLabel = getDisplayLabel(selectedBet);
  const ratioText = formatRatio(resolveMultiplier(quickBetConfigs, bet.code, bet.defaultMultiplier));
  return (
    <button
      key={bet.id}
      type="button"
      onClick={() => onSelect(bet)}
      aria-pressed={Boolean(selectedBet)}
      disabled={isLocked}
      className={`${baseButtonClass} h-full rounded-md border px-2 py-2 text-center ${
        isLocked
          ? 'cursor-not-allowed border-green-500'
          : selectedBet ? selectedButtonClass : defaultButtonClass
      }`}
    >
      <img
        src={diceFaceIconMap[bet.face]}
        alt={`Mặt ${bet.face}`}
        className="h-7 w-7 select-none object-contain"
        draggable={false}
      />
      <span
        className="relative mt-1 font-semibold uppercase tracking-[0.08em] leading-tight text-[#0f4c2c]"
        style={{ fontSize: '11px' }}
      >
        <span className={displayLabel ? 'opacity-0' : ''}>{ratioText}</span>
        {displayLabel ? (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[4px] bg-[#f5c453] px-[4px] py-[1px] text-[10px] leading-tight text-[#0f4c2c] shadow-sm">
            {displayLabel}
          </span>
        ) : null}
      </span>
    </button>
  );
};

const renderDicePairButton = (bet, quickBetConfigs, selectedBet, onSelect, isLocked = false) => {
  const displayLabel = getDisplayLabel(selectedBet);
  const ratioText = formatRatio(resolveMultiplier(quickBetConfigs, bet.code, bet.defaultMultiplier));
  return (
    <button
      key={bet.id}
      type="button"
      onClick={() => onSelect(bet)}
      aria-pressed={Boolean(selectedBet)}
      disabled={isLocked}
      className={`${baseButtonClass} h-full rounded-md border px-0.5 py-0.5 text-center ${
        isLocked
          ? 'cursor-not-allowed border-green-500'
          : selectedBet ? selectedButtonClass : defaultButtonClass
      }`}
    >
      <span className="sr-only">Cược cặp {bet.faces.join(' - ')}</span>
      <div className="flex flex-row items-center justify-center gap-0.5">
        <img
          src={diceFaceIconMap[bet.faces[0]]}
          alt={`Mặt ${bet.faces[0]}`}
          className="h-3.5 w-3.5 select-none object-contain flex-shrink-0"
          draggable={false}
        />
        <img
          src={diceFaceIconMap[bet.faces[1]]}
          alt={`Mặt ${bet.faces[1]}`}
          className="h-3.5 w-3.5 select-none object-contain flex-shrink-0"
          draggable={false}
        />
      </div>
      <span
        className="relative mt-0.5 font-semibold uppercase tracking-[0.06em] leading-tight text-[#0f4c2c]"
        style={{ fontSize: '10px' }}
      >
        <span className={displayLabel ? 'opacity-0' : ''}>{ratioText}</span>
        {displayLabel ? (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[4px] bg-[#f5c453] px-[4px] py-[1px] text-[10px] leading-tight text-[#0f4c2c] shadow-sm whitespace-nowrap font-semibold">
            {displayLabel}
          </span>
        ) : null}
      </span>
    </button>
  );
};

const SicboMobileQuickBetPanel = ({ quickBetConfigs = {}, selectedQuickBets = {}, onSelectBet, isBettingLocked = false }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 4;

  const resolveSelected = (code) => selectedQuickBets?.[code] ?? null;

  const handleSelectBet = (bet) => {
    if (isBettingLocked) return;
    if (typeof onSelectBet === 'function') {
      onSelectBet(bet);
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  // Trang 1: Xỉu/Tài + 6 triple bets
  const renderPage1 = () => (
    <div className="w-full h-full">
      <div className="grid w-full h-full grid-cols-[minmax(0,0.85fr)_minmax(0,1.2fr)_minmax(0,0.85fr)] items-stretch gap-1">
        {renderPrimaryButton(primaryBets[0], quickBetConfigs, resolveSelected(primaryBets[0].code), handleSelectBet, isBettingLocked)}
        
        <div className="grid grid-cols-2 gap-1 h-full">
          {combinationBets.map((bet) =>
            renderCombinationButton(bet, quickBetConfigs, resolveSelected(bet.code), handleSelectBet, isBettingLocked)
          )}
        </div>

        {renderPrimaryButton(primaryBets[1], quickBetConfigs, resolveSelected(primaryBets[1].code), handleSelectBet, isBettingLocked)}
      </div>
    </div>
  );

  // Trang 2: CHẴN/LẺ + Sum bets (4-10, 11-17)
  const renderPage2 = () => (
    <div className="w-full h-full flex flex-col gap-1">
      {totalBetRows.map((row) => (
        <div key={row.id} className="w-full flex-1 min-h-0">
          <div className="grid w-full h-full grid-cols-[minmax(0,1.5fr)_repeat(7,minmax(0,1fr))] gap-1">
            {renderParityButton(row.parity, quickBetConfigs, resolveSelected(row.parity.code), handleSelectBet, isBettingLocked)}
            {row.totals.map((bet) =>
              renderTotalBetButton(bet, row.variant, quickBetConfigs, resolveSelected(bet.code), handleSelectBet, isBettingLocked)
            )}
          </div>
        </div>
      ))}
    </div>
  );

  // Trang 3: Single dice (1-6) only
  const renderPage3 = () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="grid grid-cols-6 gap-1 w-full h-full">
        {singleFaceBets.map((bet) =>
          renderSingleFaceButton(bet, quickBetConfigs, resolveSelected(bet.code), handleSelectBet, isBettingLocked)
        )}
      </div>
    </div>
  );

  // Trang 4: Pair bets (1:5) + Double bets (1:8) - side by side
  const renderPage4 = () => (
    <div className="w-full h-full flex gap-1">
      {/* Pair bets - 15 combinations, 3 rows x 5 cards - Left side */}
      <div className="flex-[5] flex flex-col gap-1 min-h-0">
        {(() => {
          const rows = [];
          for (let i = 0; i < 3; i++) {
            rows.push(dicePairBets.slice(i * 5, (i + 1) * 5));
          }
          return rows.map((row, rowIndex) => (
            <div key={`pair-row-${rowIndex}`} className="grid grid-cols-5 gap-0.5 flex-1 min-h-0">
              {row.map((bet) =>
                renderDicePairButton(bet, quickBetConfigs, resolveSelected(bet.code), handleSelectBet, isBettingLocked)
              )}
            </div>
          ));
        })()}
      </div>
      
      {/* Vertical divider */}
      <div className="w-px bg-[#3abf86] self-stretch"></div>
      
      {/* Double bets - 6 combinations, 3 rows x 2 columns - Right side */}
      <div className="flex-[2] flex flex-col gap-1 min-h-0">
        {(() => {
          const rows = [];
          for (let i = 0; i < 3; i++) {
            rows.push(dicePairDoubleBets.slice(i * 2, (i + 1) * 2));
          }
          return rows.map((row, rowIndex) => (
            <div key={`double-row-${rowIndex}`} className="grid grid-cols-2 gap-1 flex-1 min-h-0">
              {row.map((bet) =>
                renderDicePairButton(bet, quickBetConfigs, resolveSelected(bet.code), handleSelectBet, isBettingLocked)
              )}
            </div>
          ));
        })()}
      </div>
    </div>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 0:
        return renderPage1();
      case 1:
        return renderPage2();
      case 2:
        return renderPage3();
      case 3:
        return renderPage4();
      default:
        return renderPage1();
    }
  };

  return (
    <section className="w-full relative">
      <h2 className="sr-only">Tùy chọn cược Sicbo Mobile</h2>

      {/* Page content với nút next/prev ở 2 bên */}
      <div className="relative h-[140px] w-full">
        {/* Nút Previous - bên trái, hình chữ nhật dọc, không bo góc trái, nền xám */}
        <button
          type="button"
          onClick={handlePrevPage}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex-shrink-0 w-5 h-[46px] rounded-r-lg border-l-0 border-r border-t border-b border-[#3abf86]/20 bg-gray-400/50 hover:bg-gray-500/70 backdrop-blur-sm flex items-center justify-center transition-all opacity-30 hover:opacity-70"
          aria-label="Trang trước"
        >
          <Icon icon="mdi:chevron-left" className="w-4 h-4 text-gray-700/60" />
        </button>
        
        {/* Nút Next - bên phải, hình chữ nhật dọc, không bo góc phải, nền xám */}
        <button
          type="button"
          onClick={handleNextPage}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex-shrink-0 w-5 h-[46px] rounded-l-lg border-r-0 border-l border-t border-b border-[#3abf86]/20 bg-gray-400/50 hover:bg-gray-500/70 backdrop-blur-sm flex items-center justify-center transition-all opacity-30 hover:opacity-70"
          aria-label="Trang sau"
        >
          <Icon icon="mdi:chevron-right" className="w-4 h-4 text-gray-700/60" />
        </button>

        {/* Page content */}
        <div className="w-full h-full">
          {renderCurrentPage()}
        </div>
      </div>

      {/* Navigation dots - ở dưới */}
      <div className="flex items-center justify-center gap-1 mt-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrentPage(index)}
            className={`h-1.5 rounded-full transition-all ${
              currentPage === index
                ? 'w-6 bg-[#3abf86]'
                : 'w-1.5 bg-[#3abf86]/30'
            }`}
            aria-label={`Trang ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default SicboMobileQuickBetPanel;

