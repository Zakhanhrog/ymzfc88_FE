const XocDiaBetSummary = ({
  totalBetPointsDisplay,
  placeableBetDetails,
  hasUnsupportedSelection,
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
  </div>
);

export default XocDiaBetSummary;

