const SicboBetActionBar = ({
  onClearBet,
  onChangeTable,
  isPlacingBet = false,
  isChangingTable = false,
}) => {
  return (
    <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mt-1">
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
        disabled={isPlacingBet}
        className="rounded-xl border border-[#0f4c2c] px-3 py-2 text-sm font-semibold text-[#0f4c2c] transition hover:bg-[#0f4c2c]/5 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Huỷ chọn
      </button>
    </div>
  );
};

export default SicboBetActionBar;

