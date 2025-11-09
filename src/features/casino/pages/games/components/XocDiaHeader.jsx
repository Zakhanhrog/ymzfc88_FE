import { Icon } from '@iconify/react';

const XocDiaHeader = ({ onBack, gameName, userName, balanceDisplay, isLoadingBalance }) => (
  <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between sticky top-0 z-30">
    <div className="flex items-center gap-2 text-gray-600">
      <button type="button" onClick={onBack} className="flex items-center gap-2 hover:text-gray-900 transition-colors">
        <Icon icon="mdi:arrow-left" className="w-5 h-5" />
      </button>
      <h1 className="text-lg md:text-xl font-semibold text-gray-900">{gameName}</h1>
    </div>

    <div className="flex items-center">
      <div className="flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-2.5 py-1.5 text-left">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-200 text-gray-600">
          <Icon icon="mdi:account" className="h-4 w-4" />
        </span>
        <span className="flex flex-col leading-tight" aria-live="polite" aria-busy={isLoadingBalance}>
          <span className="text-xs font-semibold text-gray-800 truncate max-w-[110px]">{userName || 'Người chơi'}</span>
          {isLoadingBalance ? (
            <span className="mt-0.5 h-3 w-16 rounded-full bg-amber-200/70 animate-pulse" aria-hidden="true" />
          ) : (
            <span className="text-xs font-semibold text-amber-500">{balanceDisplay}</span>
          )}
        </span>
      </div>
    </div>
  </header>
);

export default XocDiaHeader;

