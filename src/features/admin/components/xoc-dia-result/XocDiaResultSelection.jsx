import { Button } from '../../../../components/ui/Button';
import { Card, CardContent } from '../../../../components/ui/Card';

const chunkPattern = (pattern, chunkSize = 4) => {
  if (!pattern?.length) return [];
  const chunks = [];
  for (let i = 0; i < pattern.length; i += chunkSize) {
    chunks.push(pattern.slice(i, i + chunkSize));
  }
  return chunks;
};

const XocDiaResultSelection = ({
  quickBetConfigs,
  selectedResult,
  optionMap,
  canSaveResult,
  canRefundBets,
  savingResult,
  refundingBets,
  startingSession,
  onSelectResult,
  onClearSelection,
  onSaveResult,
  onOpenRefundModal,
  onStartNewSession
}) => {
  const renderQuickBetCard = (option) => {
    const isSelected = selectedResult === option.code;

    return (
      <button
        key={option.code}
        type="button"
        onClick={() => onSelectResult(option.code)}
        aria-label={option.label}
        className={`group relative flex h-full w-full flex-col items-center justify-center rounded-xl border px-2 py-3 text-center shadow-sm transition ${
          isSelected
            ? 'border-[#f5c453] shadow-lg shadow-[#f5c453]/40 bg-gradient-to-b from-white via-[#fff8e6] to-[#fde9b2]'
            : 'border-[#e2e8f0] bg-white hover:border-[#f5c453]'
        }`}
      >
        {option.pattern.length === 0 ? (
          <>
            <div className="font-black uppercase tracking-wide text-sm text-[#111827] sr-only">{option.label}</div>
          </>
        ) : (
          <>
            <div className="sr-only">{option.label}</div>
            <div className="flex flex-col items-center justify-center gap-1">
              {chunkPattern(option.pattern).map((row, rowIndex) => (
                <div key={`${option.code}-row-${rowIndex}`} className="flex items-center justify-center gap-0.5">
                  {row.map((chip, index) => (
                    <span
                      key={`${option.code}-${rowIndex}-${index}`}
                      className={`h-3 w-3 rounded-full border-2 ${
                        chip === 'white' ? 'border-[#0f172a] bg-white' : 'border-[#7f1d1d] bg-[#ef4444]'
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

  return (
    <Card>
      <CardContent className="p-3 space-y-3">
        <div className="grid grid-cols-5 gap-2">
          {quickBetConfigs.map((option) => renderQuickBetCard(option))}
        </div>

        <div className="space-y-3 pt-2 border-t border-gray-200">
          <span className="block text-sm text-slate-600">
            Kết quả đang chọn:{' '}
            <strong className="font-semibold text-slate-900">
              {selectedResult ? optionMap.get(selectedResult)?.label ?? '' : 'Chưa chọn'}
            </strong>
          </span>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={onClearSelection}
              className="flex-1 h-9 rounded-2xl text-sm"
            >
              Xóa lựa chọn
            </Button>
            <Button
              onClick={onSaveResult}
              disabled={!canSaveResult || savingResult}
              className="flex-1 h-9 bg-[#0f4c2c] text-white hover:bg-[#0f4c2c]/90 rounded-2xl disabled:bg-gray-300 text-sm"
            >
              {savingResult ? 'Đang lưu...' : 'Lưu kết quả'}
            </Button>
            <Button
              onClick={onOpenRefundModal}
              disabled={!canRefundBets || refundingBets}
              className="flex-1 h-9 bg-amber-500 text-white hover:bg-amber-600 rounded-2xl disabled:bg-gray-300 text-sm"
            >
              Hột kê
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default XocDiaResultSelection;

