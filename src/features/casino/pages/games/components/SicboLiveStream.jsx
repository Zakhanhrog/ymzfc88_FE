import { Icon } from '@iconify/react';

const SicboLiveStream = () => (
  <section className="relative rounded-2xl bg-gray-900 aspect-[3/2] overflow-hidden shadow-lg">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent)]" />
    <div className="relative z-10 h-full flex flex-col">
      <div className="flex items-center justify-between px-4 md:px-6 py-2 border-b border-white/10">
        <div className="flex items-center h-full">
          <span className="text-xs uppercase tracking-wide text-white/60">Live Stream</span>
        </div>

        <div className="hidden md:flex items-center gap-4 text-xs md:text-sm text-white/70">
          <span className="flex items-center gap-2">
            <Icon icon="mdi:account" className="w-4 h-4" />
            Dealer: Anna
          </span>
          <span className="flex items-center gap-2">
            <Icon icon="mdi:account-group" className="w-4 h-4" />
            Người chơi: 96
          </span>
        </div>

        <span className="flex items-center gap-2 text-sm text-red-400">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          Đang phát
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-white/70">
          <div className="w-20 h-20 rounded-full border-4 border-white/20 flex items-center justify-center">
            <Icon icon="mdi:play" className="w-8 h-8" />
          </div>
          <p className="text-sm md:text-base text-center max-w-xs">
            Live stream Sicbo sẽ hiển thị tại đây.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default SicboLiveStream;


