import { memo, useMemo } from 'react';
import { message } from 'antd';
import { chunkPattern, formatChipDisplayValue } from '../xocDiaUtils';

const XocDiaQuickBetButton = ({
  option,
  selectedBet,
  isBettingLocked,
  plainEnabledCodes,
  styledPlainCodes,
  onSelect,
}) => {
  const isPatternBet = Array.isArray(option.pattern) && option.pattern.length > 0;
  const isPlainEnabled = plainEnabledCodes.has(option.code);
  const isDisabled = isBettingLocked || (!isPatternBet && !isPlainEnabled);
  const displayLabel = useMemo(
    () => selectedBet?.label ?? formatChipDisplayValue(selectedBet?.value),
    [selectedBet]
  );
  const isSelected = Boolean(selectedBet);
  const isCentralLabel = styledPlainCodes.has(option.code);
  const isComingSoon = !isPatternBet && !isPlainEnabled;

  const handleButtonClick = () => {
    if (!isPatternBet && !isPlainEnabled) {
      message.info('Loại cược này sẽ được mở trong bản cập nhật tiếp theo.');
      return;
    }
    if (onSelect) {
      onSelect(option);
    }
  };

  const baseClass =
    'group relative flex h-full w-full flex-col items-center justify-center rounded-xl border px-3 pt-3 pb-1.5 sm:pt-[13px] sm:pb-[8px] text-center shadow-sm transition';
  const variantClass = isDisabled
    ? isBettingLocked
      ? 'border-green-500 bg-white cursor-not-allowed'
      : 'border-[#dbeafe] bg-white text-gray-400 cursor-not-allowed opacity-60'
    : isSelected
    ? 'border-[#63c892] bg-gradient-to-b from-[#d7f6e6] via-[#adebc8] to-[#82dfa9] text-[#0f4c2c]'
    : 'border-[#3abf86] bg-white text-[#0f4c2c] shadow hover:border-[#f5c453] hover:shadow-md';

  return (
    <button
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
            className={`font-black tracking-wide ${
              styledPlainCodes.has(option.code) ? 'font-pacifico' : 'uppercase'
            } ${
              option.code === 'tai' ? 'text-[#dc2626]' 
              : option.code === 'xiu' ? 'text-[#0f4c2c]'
              : option.code === 'chan' ? 'text-[#dc2626]'
              : option.code === 'le' ? 'text-[#0f4c2c]'
              : styledPlainCodes.has(option.code)
                ? 'text-[#111827]'
                : isSelected
                ? 'text-[#0f4c2c]'
                : 'text-[#0f4c2c]'
            } ${styledPlainCodes.has(option.code) ? 'text-xl' : 'text-sm'}`}
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

export default memo(XocDiaQuickBetButton);

