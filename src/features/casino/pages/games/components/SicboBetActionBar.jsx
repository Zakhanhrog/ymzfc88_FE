import { Icon } from '@iconify/react';

const SicboBetActionBar = ({
  onClearBet,
  onChangeTable,
  isPlacingBet = false,
  isChangingTable = false,
  quickActionButtons = [],
  onQuickAction,
  isBettingLocked = false,
}) => {
  const disabled = isPlacingBet || isBettingLocked;

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 -mt-2 sm:-mt-1.5 mb-1 sm:mb-1.5">
      {/* Nút Đổi bàn - giữ nguyên */}
      <button
        type="button"
        onClick={onChangeTable}
        disabled={typeof onChangeTable !== 'function' || isChangingTable}
        className="flex-1 min-w-0 rounded-xl border border-[#f5c453] px-2 py-1.5 text-xs font-semibold text-[#b36c00] transition hover:bg-[#f5c453]/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isChangingTable ? 'Đang đổi...' : 'Đổi bàn'}
      </button>

      {/* 3 nút quick action giống Xóc Đĩa */}
      {quickActionButtons.map((button) => (
      <button
          key={button.action}
        type="button"
          onClick={() => !disabled && onQuickAction?.(button.action)}
          disabled={disabled}
          className={`flex flex-1 min-w-0 items-center justify-center gap-1.5 rounded-xl px-2 py-1.5 text-xs font-semibold tracking-wide transition focus:outline-none focus:ring-0 focus:ring-offset-0 active:scale-[0.99] ${
            disabled
              ? 'border border-gray-300 bg-gray-200 text-gray-400 cursor-not-allowed'
              : `${button.style} hover:shadow-md`
          }`}
        >
          <Icon icon={button.icon} className="h-4 w-4" />
          <span className="whitespace-nowrap">{button.label}</span>
      </button>
      ))}
    </div>
  );
};

export default SicboBetActionBar;

