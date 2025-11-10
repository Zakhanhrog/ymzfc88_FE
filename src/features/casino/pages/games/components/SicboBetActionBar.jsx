const SicboBetActionBar = ({ onPlaceBet, onClearBet, isPlacingBet = false, isDisabled = false }) => (
  <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mt-1">
    <button
      type="button"
      onClick={onClearBet}
      disabled={isDisabled || isPlacingBet}
      className="rounded-xl border border-[#0f4c2c] px-3 py-2 text-sm font-semibold text-[#0f4c2c] transition hover:bg-[#0f4c2c]/5 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Huỷ cược
    </button>
    <button
      type="button"
      onClick={onPlaceBet}
      disabled={isDisabled}
      className="rounded-xl bg-gradient-to-r from-[#0f4c2c] to-[#149b60] px-3 py-2 text-sm font-semibold text-white shadow-md shadow-[#0f4c2c]/20 transition hover:from-[#149b60] hover:to-[#0f4c2c] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPlacingBet ? 'Đang đặt...' : 'Đặt cược'}
    </button>
  </div>
);

export default SicboBetActionBar;

