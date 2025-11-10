import { defaultChipLabels } from '../sicboConfig';

const chipIconMap = {
  '10K': '/pokerchip/10K.svg',
  '20K': '/pokerchip/20K.svg',
  '50K': '/pokerchip/50K.svg',
  '100K': '/pokerchip/100K.svg',
  '200K': '/pokerchip/200K.svg',
  '500K': '/pokerchip/500K.svg',
  '1M': '/pokerchip/1M.svg',
  '10M': '/pokerchip/10M.svg',
};

const SicboCustomChipModal = ({
  isOpen,
  customChipValue,
  onCustomChipValueChange,
  customChipError,
  availableChipOptions,
  customChipSelections,
  onToggleChipSelection,
  onSelectAllChips,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-xs rounded-2xl bg-white p-4 shadow-lg space-y-4">
        <form className="space-y-3" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-gray-600">Giá trị (K)</label>
            <input
              type="text"
              inputMode="numeric"
              value={customChipValue}
              onChange={onCustomChipValueChange}
              className="w-full rounded-xl border border-emerald-400/40 px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              placeholder="Ví dụ: 250"
            />
            {customChipError ? <p className="text-xs font-medium text-red-500">{customChipError}</p> : null}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-gray-600">Chọn phỉnh hiển thị</span>
              <button
                type="button"
                onClick={onSelectAllChips}
                className="rounded-lg border border-emerald-500/40 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-600 transition hover:bg-emerald-50"
              >
                Tất cả
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableChipOptions
                .filter((chip) => defaultChipLabels.includes(chip.label))
                .map((chip) => {
                  const isActive = customChipSelections.has(chip.label);
                  const iconSrc = chipIconMap[chip.label] ?? null;
                  const formattedLabel = chip.label.endsWith('K') ? chip.label.replace(/K$/, '') : chip.label;
                  return (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => onToggleChipSelection(chip.label)}
                      className={`relative flex h-11 w-11 items-center justify-center rounded-full transition ${
                        isActive ? 'shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500' : 'shadow-sm hover:shadow-md'
                      }`}
                    >
                      {iconSrc ? (
                        <>
                          <img
                            src={iconSrc}
                            alt={chip.label}
                            className="absolute inset-0 h-full w-full object-contain"
                            draggable={false}
                          />
                          <span className="relative flex h-full w-full items-center justify-center text-xs font-semibold uppercase tracking-wide text-gray-900 drop-shadow-sm">
                            {formattedLabel}
                          </span>
                        </>
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-xs font-semibold uppercase tracking-wide text-gray-900">
                          {formattedLabel}
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:from-emerald-600 hover:to-emerald-700"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SicboCustomChipModal;

