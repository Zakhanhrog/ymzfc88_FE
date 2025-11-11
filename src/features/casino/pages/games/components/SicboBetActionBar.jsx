const SicboBetActionBar = ({
  onPlaceBet,
  onCancelConfirmed,
  onClearBet,
  onChangeTable,
  isPlacingBet = false,
  isChangingTable = false,
  isDisabled = false,
  isBetConfirmed = false,
  canCancelConfirmed = true,
}) => {
  const handleMainClick = () => {
    if (isBetConfirmed) {
      if (typeof onCancelConfirmed === 'function') {
        onCancelConfirmed();
      }
      return;
    }
    if (typeof onPlaceBet === 'function') {
      onPlaceBet();
    }
  };

  const mainDisabled = isBetConfirmed
    ? !canCancelConfirmed || isPlacingBet
    : isDisabled;
  const mainLabel = isPlacingBet
    ? 'Đang đặt...'
    : isBetConfirmed
      ? 'Huỷ đặt cược'
      : 'Đặt cược';

  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mt-1">
      <button
        type="button"
        onClick={onChangeTable}
        disabled={typeof onChangeTable !== 'function' || isChangingTable}
        className="rounded-xl border border-[#f5c453] px-3 py-2 text-sm font-semibold text-[#b36c00] transition hover:bg-[#f5c453]/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isChangingTable ? 'Đang đổi...' : 'Đổi bàn'}
      </button>
      <button
        type="button"
        onClick={onClearBet}
        disabled={isDisabled || isPlacingBet || isBetConfirmed}
        className="rounded-xl border border-[#0f4c2c] px-3 py-2 text-sm font-semibold text-[#0f4c2c] transition hover:bg-[#0f4c2c]/5 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Huỷ chọn
      </button>
      <button
        type="button"
        onClick={handleMainClick}
        disabled={mainDisabled}
        className="rounded-xl bg-gradient-to-r from-[#0f4c2c] to-[#149b60] px-3 py-2 text-sm font-semibold text-white shadow-md shadow-[#0f4c2c]/20 transition hover:from-[#149b60] hover:to-[#0f4c2c] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {mainLabel}
      </button>
    </div>
  );
};

export default SicboBetActionBar;

