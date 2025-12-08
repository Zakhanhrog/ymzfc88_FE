import { Icon } from '@iconify/react';

const XocDiaQuickActionBar = ({ quickActionButtons, onAction, disabled }) => (
  <div className="flex items-center gap-1.5 sm:gap-2">
    {quickActionButtons.map((button) => {
      const isConfirmButton = button.action === 'confirm' || button.action === 'cancel-confirm';
      return (
        <button
          key={button.action}
          type="button"
          onClick={() => !disabled && onAction(button.action)}
          disabled={disabled}
          className={`flex flex-1 min-w-0 items-center justify-center ${isConfirmButton ? '' : 'gap-1.5'} rounded-xl px-2 sm:px-4 py-2 text-xs sm:text-sm font-semibold tracking-wide transition focus:outline-none focus:ring-0 focus:ring-offset-0 active:scale-[0.99] ${
            disabled
              ? 'border border-gray-300 bg-gray-200 text-gray-400 cursor-not-allowed'
              : `${button.style} hover:shadow-md`
          }`}
        >
          {!isConfirmButton && <Icon icon={button.icon} className="h-4 w-4 sm:h-5 sm:w-5" />}
          <span className="whitespace-nowrap">{button.label}</span>
        </button>
      );
    })}
  </div>
);

export default XocDiaQuickActionBar;

