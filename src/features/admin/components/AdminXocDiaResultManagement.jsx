import { useMemo, useState } from 'react';
import { message } from 'antd';
import useXocDiaSession from '../../casino/hooks/useXocDiaSession';
import xocDiaSessionService from '../../../services/xocDiaSessionService';

const defaultQuickBetConfigs = [
  {
    code: 'four-white',
    label: '4 Trắng',
    ratio: '1 : 7.5',
    pattern: ['white', 'white', 'white', 'white'],
  },
  {
    code: 'three-white-one-red',
    label: '3 Trắng 1 Đỏ',
    ratio: '1 : 2.1',
    pattern: ['white', 'white', 'white', 'red'],
  },
  {
    code: 'two-two',
    label: '2 Trắng 2 Đỏ',
    ratio: '1 : 2.1',
    pattern: ['white', 'white', 'red', 'red'],
  },
  {
    code: 'three-red-one-white',
    label: '3 Đỏ 1 Trắng',
    ratio: '1 : 2.1',
    pattern: ['red', 'red', 'red', 'white'],
  },
  {
    code: 'four-red',
    label: '4 Đỏ',
    ratio: '1 : 7.5',
    pattern: ['red', 'red', 'red', 'red'],
  },
];

const chunkPattern = (pattern, chunkSize = 4) => {
  if (!pattern?.length) return [];
  const chunks = [];
  for (let i = 0; i < pattern.length; i += chunkSize) {
    chunks.push(pattern.slice(i, i + chunkSize));
  }
  return chunks;
};

const AdminXocDiaResultManagement = () => {
  const [selectedResult, setSelectedResult] = useState(null);
  const [startingSession, setStartingSession] = useState(false);
  const [savingResult, setSavingResult] = useState(false);
  const { sessionStatus, timer, refreshSession } = useXocDiaSession({ pollIntervalMs: 3000 });

  const isSessionRunning = sessionStatus === 'RUNNING';
  const isCountdownPhase = isSessionRunning && timer.phaseKey === 'countdown';
  const currentPhaseLabel = isSessionRunning ? timer.phaseLabel ?? '' : 'Chờ phiên mới';
  const countdownCircleStyle = {
    background: `conic-gradient(#34d399 ${timer.countdownAngle}deg, #064e3b ${timer.countdownAngle}deg)`,
  };

  const canSaveResult = Boolean(selectedResult) && timer.phaseKey === 'show-result';

  const renderSessionTimer = isCountdownPhase ? (
    <div className="flex items-center">
      <div
        className="relative flex h-10 w-10 items-center justify-center rounded-full p-[3px]"
        style={countdownCircleStyle}
        aria-live="polite"
      >
        <span className="flex h-full w-full items-center justify-center rounded-full bg-[#0f4731] text-[#dcfce7] text-xs font-semibold">
          {timer.countdownSeconds}
        </span>
      </div>
    </div>
  ) : (
    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/80">
      {currentPhaseLabel || 'Chờ phiên mới'}
    </span>
  );

  const handleStartNewSession = async () => {
    if (startingSession) return;
    setStartingSession(true);
    try {
      const response = await xocDiaSessionService.startNewSession();
      if (response?.success) {
        message.success(response.message || 'Bắt đầu phiên mới thành công');
      } else {
        message.error(response?.message || 'Không thể bắt đầu phiên mới');
      }
    } catch (error) {
      message.error(error.message || 'Không thể bắt đầu phiên mới');
    } finally {
      setStartingSession(false);
      refreshSession();
    }
  };

  const handleSaveResult = async () => {
    if (!selectedResult || savingResult) {
      return;
    }

    setSavingResult(true);
    try {
      const response = await xocDiaSessionService.submitResult(selectedResult);
      if (response?.success) {
        message.success(response.message || 'Lưu kết quả thành công');
        setSelectedResult(null);
      } else {
        message.error(response?.message || 'Không thể lưu kết quả');
      }
    } catch (error) {
      message.error(error?.message || 'Không thể lưu kết quả');
    } finally {
      setSavingResult(false);
      refreshSession();
    }
  };

  const optionMap = useMemo(() => {
    const map = new Map();
    defaultQuickBetConfigs.forEach((config) => {
      map.set(config.code, config);
    });
    return map;
  }, []);

  const renderQuickBetCard = (option) => {
    const isSelected = selectedResult === option.code;

    return (
      <button
        key={option.code}
        type="button"
        onClick={() => setSelectedResult(option.code)}
        aria-label={option.label}
        className={`group relative flex h-full w-full flex-col items-center justify-center rounded-xl border px-3 pb-1.5 pt-8 text-center shadow-sm transition ${
          isSelected
            ? 'border-[#f5c453] shadow-lg shadow-[#f5c453]/40 bg-gradient-to-b from-white via-[#fff8e6] to-[#fde9b2]'
            : 'border-[#e2e8f0] bg-white hover:border-[#f5c453]'
        }`}
      >
        <span
          className={`pointer-events-none absolute left-1/2 top-1 z-10 flex h-6 w-[76px] -translate-x-1/2 items-center justify-center rounded-lg bg-[#f5c453] text-xs font-semibold uppercase tracking-wide text-[#0b1f15] shadow-sm transition ${
            isSelected ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Chọn
        </span>
        {option.pattern.length === 0 ? (
          <>
            <div className="font-black uppercase tracking-wide text-sm text-[#111827] sr-only">{option.label}</div>
          </>
        ) : (
          <>
            <div className="sr-only">{option.label}</div>
            <div className="mt-1 flex flex-col items-center justify-center gap-1.5">
              {chunkPattern(option.pattern).map((row, rowIndex) => (
                <div key={`${option.code}-row-${rowIndex}`} className="flex items-center justify-center gap-1">
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

  const handleClearSelection = () => {
    setSelectedResult(null);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)]">
      <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 text-white shadow-xl">
        <header className="flex flex-col gap-3 border-b border-white/10 pb-3 md:flex-row md:items-center md:justify-between">
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
              <button
                type="button"
                onClick={handleStartNewSession}
                disabled={startingSession}
                className={`flex items-center justify-center rounded-lg bg-emerald-500/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-emerald-500 ${
                  startingSession ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {startingSession ? 'Đang bắt đầu...' : 'Bắt đầu phiên mới'}
              </button>
              <button
                type="button"
                className="flex items-center justify-center rounded-lg border border-white/30 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/10"
              >
                Dừng live
              </button>
              <button
                type="button"
                className="flex items-center justify-center rounded-lg bg-[#ef4444] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-[#dc2626]"
              >
                Kết thúc phiên
              </button>
            </div>
          </div>
        </header>
        <div className="mt-4 aspect-[3/2] w-full overflow-hidden rounded-xl border border-white/10 bg-slate-950/60">
          <div className="flex h-full min-h-[280px] items-center justify-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/40 bg-white/5 text-white/80">
              ▶
            </div>
            <p className="max-w-xs text-center text-sm text-white/70">
              Luồng trực tiếp Xóc Đĩa sẽ hiển thị ở đây. Vui lòng kiểm tra kết nối camera hoặc tải lại trang nếu luồng
              chưa hiển thị.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-5">
          {defaultQuickBetConfigs.map((option) => renderQuickBetCard(option))}
        </div>

        <footer className="space-y-3 pt-2">
          <span className="block text-sm text-slate-600">
            Kết quả đang chọn:{' '}
            <strong className="font-semibold text-slate-900">
              {selectedResult ? optionMap.get(selectedResult)?.label ?? '' : 'Chưa chọn'}
            </strong>
          </span>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleClearSelection}
              className="flex h-11 w-full items-center justify-center rounded-xl border border-slate-300 px-3 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-700 sm:flex-1"
            >
              Xóa lựa chọn
            </button>
            <button
              type="button"
              onClick={handleSaveResult}
              disabled={!canSaveResult || savingResult}
              className="flex h-11 w-full items-center justify-center rounded-xl bg-[#0f4c2c] px-4 text-sm font-semibold uppercase tracking-wide text-white transition disabled:cursor-not-allowed disabled:bg-gray-300 sm:flex-1"
            >
              {savingResult ? 'Đang lưu...' : 'Lưu kết quả'}
            </button>
            <button
              type="button"
              onClick={handleStartNewSession}
              disabled={startingSession}
              className="flex h-11 w-full items-center justify-center rounded-xl border border-dashed border-emerald-400 px-4 text-sm font-semibold uppercase tracking-wide text-emerald-600 transition hover:border-emerald-500 hover:text-emerald-700 sm:flex-1"
            >
              {startingSession ? 'Đang bắt đầu...' : 'Bắt đầu phiên mới'}
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default AdminXocDiaResultManagement;


