import { Icon } from '@iconify/react';

const SicboHistoryDrawer = ({ isOpen, onClose }) => (
  <>
    <div
      className={`fixed inset-0 z-[98] transition-opacity duration-300 ${
        isOpen ? 'visible opacity-100 bg-black/40' : 'invisible opacity-0'
      }`}
      onClick={onClose}
    />
    <aside
      className={`fixed inset-0 md:inset-y-0 md:right-0 md:left-auto h-full w-full md:w-full md:max-w-[420px] bg-white shadow-2xl z-[99] transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <header className="h-16 px-5 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            aria-label="Đóng lịch sử"
          >
            <Icon icon="mdi:arrow-left" className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">Lịch sử cược Sicbo</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="hidden md:flex w-9 h-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <Icon icon="mdi:close" className="w-5 h-5" />
        </button>
      </header>

      <div className="h-[calc(100%-64px)] overflow-y-auto px-6 py-6 flex items-center justify-center">
        <div className="text-center space-y-3 max-w-sm">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
            <Icon icon="mdi:dice-6" className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Tính năng đang phát triển</h3>
          <p className="text-sm text-gray-600">
            Chúng tôi sẽ cập nhật lịch sử cược Sicbo trong thời gian sớm nhất. Vui lòng quay lại sau nhé!
          </p>
        </div>
      </div>
    </aside>
  </>
);

export default SicboHistoryDrawer;


