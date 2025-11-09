const XocDiaBetSummary = ({
  totalBetPointsDisplay,
  placeableBetDetails,
  hasUnsupportedSelection,
  onPlaceBet,
  disablePlaceButton,
  isPlacingBet,
}) => (
  <div className="flex flex-col gap-2 rounded-xl border border-emerald-200 bg-white/70 p-3 text-sm text-emerald-900">
    <div className="flex items-center justify-between">
      <span className="font-semibold uppercase tracking-wide">Tổng cược</span>
      <span className="text-base font-bold text-emerald-600">{totalBetPointsDisplay}</span>
    </div>
    {placeableBetDetails.length > 0 ? (
      <ul className="space-y-1">
        {placeableBetDetails.map((bet) => (
          <li key={bet.code} className="flex items-center justify-between text-xs">
            <span className="font-medium uppercase text-gray-600">{bet.label}</span>
            <span className="font-semibold text-emerald-700">
              {Number(bet.amount).toLocaleString('vi-VN')} điểm
            </span>
          </li>
        ))}
      </ul>
    ) : (
      <span className="text-xs text-gray-500">Chưa chọn cược hợp lệ</span>
    )}
    {hasUnsupportedSelection ? (
      <p className="text-xs font-medium text-amber-600">
        Một số cược (Chẵn/Lẻ/Tài/Xỉu) chưa được hỗ trợ đặt cược tự động.
      </p>
    ) : null}
    <button
      type="button"
      onClick={onPlaceBet}
      disabled={disablePlaceButton}
      className="mt-1 flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 text-sm font-semibold uppercase tracking-wide text-white transition hover:from-emerald-600 hover:to-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
    >
      {isPlacingBet ? 'Đang đặt...' : 'Đặt cược'}
    </button>
  </div>
);

export default XocDiaBetSummary;

