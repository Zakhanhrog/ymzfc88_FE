import { Button } from '../../../../components/ui/Button';
import { Play, Pause, Square, RefreshCw, Loader2 } from 'lucide-react';

const XocDiaResultHeader = ({
  isSessionRunning,
  isLivePaused,
  isLiveEnded,
  startingSession,
  togglingLivePause,
  togglingLiveEnded,
  onStartNewSession,
  onToggleLivePause,
  onToggleLiveEnded,
  renderSessionTimer
}) => {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-lg font-semibold uppercase tracking-wide text-white">Live Xóc Đĩa</h2>
        <p className="text-sm text-white/70">Theo dõi trực tiếp để nhập kết quả chính xác</p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
        <div
          className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
            isSessionRunning
              ? 'border border-emerald-400 bg-emerald-500/10 text-emerald-100'
              : 'border border-white/20 text-white/80'
          }`}
        >
          {isSessionRunning ? 'Phiên đang chạy' : 'Chờ phiên mới'}
        </div>
        <div className="flex items-center justify-center">{renderSessionTimer}</div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={onStartNewSession}
            disabled={startingSession}
            className="gap-2 bg-emerald-500/90 text-white hover:bg-emerald-500 rounded-2xl text-xs font-semibold uppercase tracking-wide h-8 px-3"
          >
            {startingSession ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Đang bắt đầu...
              </>
            ) : (
              <>
                <Play className="h-3 w-3" />
                Bắt đầu phiên mới
              </>
            )}
          </Button>
          <Button
            onClick={onToggleLivePause}
            disabled={togglingLivePause}
            variant={isLivePaused ? "default" : "outline"}
            className={`gap-2 rounded-2xl text-xs font-semibold uppercase tracking-wide h-8 px-3 ${
              isLivePaused
                ? 'border-amber-400 bg-amber-500/20 hover:bg-amber-500/30 text-white'
                : 'border-white/30 hover:bg-white/10 text-white'
            }`}
          >
            {togglingLivePause ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Đang xử lý...
              </>
            ) : isLivePaused ? (
              <>
                <Play className="h-3 w-3" />
                Tiếp tục live
              </>
            ) : (
              <>
                <Pause className="h-3 w-3" />
                Dừng live
              </>
            )}
          </Button>
          <Button
            onClick={onToggleLiveEnded}
            disabled={togglingLiveEnded}
            className={`gap-2 rounded-2xl text-xs font-semibold uppercase tracking-wide h-8 px-3 ${
              isLiveEnded
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {togglingLiveEnded ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Đang xử lý...
              </>
            ) : isLiveEnded ? (
              <>
                <RefreshCw className="h-3 w-3" />
                Mở lại live
              </>
            ) : (
              <>
                <Square className="h-3 w-3" />
                Kết thúc live
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default XocDiaResultHeader;

