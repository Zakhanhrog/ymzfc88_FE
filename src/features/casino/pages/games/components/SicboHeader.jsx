import { Icon } from '@iconify/react';

const SicboHeader = ({
  onBack,
  gameName,
  userName,
  balanceDisplay,
  isLoadingBalance,
  onOpenHistory,
  onOpenHelp,
}) => (
  <header className="bg-white border-b border-gray-200 px-3 md:px-5 py-2.5 md:py-3 flex items-center justify-between sticky top-0 z-30">
    <div className="flex items-center gap-2 text-gray-600">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 hover:text-gray-900 transition-colors"
        aria-label="Quay lại"
      >
        <Icon icon="mdi:arrow-left" className="w-5 h-5" />
      </button>
      <h1 className="text-base md:text-lg font-semibold text-gray-900">{gameName}</h1>
    </div>

    <div className="flex items-center gap-2">
      {typeof onOpenHelp === 'function' ? (
        <button
          type="button"
          onClick={onOpenHelp}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-colors"
          title="Hướng dẫn Sicbo"
        >
          <Icon icon="mdi:help-circle-outline" className="w-5 h-5" />
        </button>
      ) : null}

      {typeof onOpenHistory === 'function' ? (
        <button
          type="button"
          onClick={onOpenHistory}
          className="flex md:hidden h-9 items-center justify-center rounded-xl border border-gray-200 bg-white px-2.5 text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-colors shadow-sm"
          aria-label="Lịch sử cược"
        >
          <Icon icon="mdi:history" className="w-5 h-5" />
        </button>
      ) : null}

      <div className="flex h-9 items-center gap-2 rounded-xl border border-gray-200 bg-white px-2 py-1 text-left">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-200 text-gray-600">
          <Icon icon="mdi:account" className="h-4 w-4" />
        </span>
        <span className="flex flex-col leading-tight" aria-live="polite" aria-busy={isLoadingBalance}>
          <span className="text-xs font-semibold text-gray-800 truncate max-w-[110px]">
            {userName || 'Người chơi'}
          </span>
          {isLoadingBalance ? (
            <span className="mt-0.5 h-3 w-16 rounded-full bg-amber-200/70 animate-pulse" aria-hidden="true" />
          ) : (
            <span className="text-xs font-semibold text-amber-500">{balanceDisplay}</span>
          )}
        </span>
      </div>

      {typeof onOpenHistory === 'function' ? (
        <button
          type="button"
          onClick={onOpenHistory}
          className="hidden md:flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-colors"
          title="Lịch sử cược Sicbo"
        >
          <Icon icon="mdi:history" className="w-5 h-5" />
        </button>
      ) : null}
    </div>
  </header>
);

export default SicboHeader;


