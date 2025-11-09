import { Icon } from '@iconify/react';

const XocDiaQuickActionBar = ({ quickActionButtons, onAction, disabled }) => (
  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
    {quickActionButtons.map((button) => (
      <button
        key={button.action}
        type="button"
        onClick={() => !disabled && onAction(button.action)}
        disabled={disabled}
        className={`flex flex-1 min-w-[120px] items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold tracking-wide transition focus:outline-none focus:ring-0 focus:ring-offset-0 active:scale-[0.99] ${
          disabled
            ? 'border border-gray-300 bg-gray-200 text-gray-400 cursor-not-allowed'
            : `${button.style} hover:shadow-md`
        }`}
      >
        <Icon icon={button.icon} className="h-5 w-5" />
        <span>{button.label}</span>
      </button>
    ))}
  </div>
);

export default XocDiaQuickActionBar;

