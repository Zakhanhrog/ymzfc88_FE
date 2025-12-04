import { useMemo, useState } from 'react';
import { message } from 'antd';
import useSicboSession from '../../casino/hooks/useSicboSession';
import sicboSessionService from '../../../services/sicboSessionService';
import SicboLiveStream from '../../casino/pages/games/components/SicboLiveStream';

export const diceFaceIconMap = {
  1: '/matxucxac/1cham.svg',
  2: '/matxucxac/2cham.svg',
  3: '/matxucxac/3cham.svg',
  4: '/matxucxac/4cham.svg',
  5: '/matxucxac/5cham.svg',
  6: '/matxucxac/6cham.svg',
};

const diceFaces = [1, 2, 3, 4, 5, 6];

const createEmptyFaces = () => [null, null, null];

export const SicboResultTablePanel = ({ tableNumber }) => {
  const [selectedFaces, setSelectedFaces] = useState(createEmptyFaces());
  const [startingSession, setStartingSession] = useState(false);
  const [savingResult, setSavingResult] = useState(false);
  const { sessionStatus, timer, refreshSession } = useSicboSession({
    pollIntervalMs: 3000,
    tableNumber,
  });

  const isSessionRunning = sessionStatus === 'RUNNING';
  const isCountdownPhase = isSessionRunning && timer.phaseKey === 'countdown';
  const currentPhaseLabel = isSessionRunning ? timer.phaseLabel ?? '' : 'Chờ phiên mới';
  const countdownCircleStyle = {
    background: `conic-gradient(#ef4444 ${timer.countdownAngle}deg, #7f1d1d ${timer.countdownAngle}deg)`,
  };

  const allFacesSelected = selectedFaces.every((face) => typeof face === 'number');
  const selectedResultLabel = allFacesSelected ? selectedFaces.join(' - ') : 'Chưa chọn';
  const canSaveResult = allFacesSelected && timer.phaseKey === 'show-result';

  const renderSessionTimer = isCountdownPhase ? (
    <div className="flex items-center">
      <div
        className="relative flex h-10 w-10 items-center justify-center rounded-full p-[3px]"
        style={countdownCircleStyle}
        aria-live="polite"
      >
        <span className="flex h-full w-full items-center justify-center rounded-full bg-[#450a0a] text-[#fee2e2] text-xs font-semibold">
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
      const response = await sicboSessionService.startNewSession(tableNumber);
      if (response?.success) {
        message.success(response.message || 'Bắt đầu phiên Sicbo mới thành công');
      } else {
        message.error(response?.message || 'Không thể bắt đầu phiên Sicbo mới');
      }
    } catch (error) {
      message.error(error.message || 'Không thể bắt đầu phiên Sicbo mới');
    } finally {
      setStartingSession(false);
      refreshSession();
    }
  };

  const handleSelectFace = (columnIndex, faceValue) => {
    setSelectedFaces((prev) => {
      const next = [...prev];
      next[columnIndex] = faceValue;
      return next;
    });
  };

  const handleClearSelection = () => {
    setSelectedFaces(createEmptyFaces());
  };

  const handleSaveResult = async () => {
    if (!allFacesSelected || savingResult) {
      if (!allFacesSelected) {
        message.info('Vui lòng chọn đủ 3 mặt xúc xắc');
      }
      return;
    }

    setSavingResult(true);
    try {
      const resultCode = selectedFaces.join('-');
      const response = await sicboSessionService.submitResult(resultCode, tableNumber);
      if (response?.success) {
        message.success(response.message || 'Lưu kết quả Sicbo thành công');
        handleClearSelection();
      } else {
        message.error(response?.message || 'Không thể lưu kết quả Sicbo');
      }
    } catch (error) {
      message.error(error?.message || 'Không thể lưu kết quả Sicbo');
    } finally {
      setSavingResult(false);
      refreshSession();
    }
  };

  const selectedPreview = useMemo(() => {
    if (!allFacesSelected) {
      return null;
    }
    return (
      <div className="flex items-center gap-2">
        {selectedFaces.map((face, index) => (
          <div
            key={`preview-face-${index}`}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm"
          >
            <img
              src={diceFaceIconMap[face]}
              alt={`Mặt ${face}`}
              className="h-8 w-8 object-contain"
              draggable={false}
            />
          </div>
        ))}
      </div>
    );
  }, [allFacesSelected, selectedFaces]);

  const renderDiceColumn = (columnIndex) => (
    <div
      key={`dice-column-${columnIndex}`}
      className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
    >
      <div className="flex flex-col gap-2">
        {diceFaces.map((face) => {
          const isSelected = selectedFaces[columnIndex] === face;
          return (
            <button
              key={`column-${columnIndex}-face-${face}`}
              type="button"
              onClick={() => handleSelectFace(columnIndex, face)}
              className={`flex w-full items-center justify-center rounded-lg border px-3 py-2 transition ${
                isSelected
                  ? 'border-[#f5c453] bg-[#fff8e6] shadow-lg shadow-[#f5c453]/40'
                  : 'border-slate-200 bg-white hover:border-[#f5c453]'
              }`}
            >
              <img
                src={diceFaceIconMap[face]}
                alt={`Mặt ${face}`}
                className="h-9 w-9 object-contain"
                draggable={false}
              />
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)]">
      <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 text-white shadow-xl">
        <header className="flex flex-col gap-3 border-b border-white/10 pb-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold uppercase tracking-wide text-white">Live Sicbo</h2>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90">
                Bàn số {tableNumber}
              </div>
            </div>
            <p className="text-sm text-white/70">Theo dõi trực tiếp để nhập kết quả Sicbo chính xác cho từng bàn</p>
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
        <div className="mt-4">
          <SicboLiveStream
            tableNumber={tableNumber}
            tableLabel={`Bàn số ${tableNumber}`}
            countdownDisplay={renderSessionTimer}
            resultOverlay={null}
          />
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
        <div className="grid gap-3 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => renderDiceColumn(index))}
        </div>

        <footer className="space-y-3 pt-2">
          <div className="flex flex-col gap-2 rounded-xl border border-dashed border-slate-300 p-3">
            <span className="text-sm text-slate-600">
              Bàn {tableNumber} - Kết quả đang chọn:{' '}
              <strong className="font-semibold text-slate-900">{selectedResultLabel}</strong>
            </span>
            {selectedPreview}
          </div>
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

const AdminSicboResultManagement = ({
  allowedTables = [1, 2],
  initialTable,
}) => {
  const tables = allowedTables.length > 0 ? allowedTables : [1, 2];
  const defaultTable = initialTable ?? tables[0];
  const [activeTable, setActiveTable] = useState(defaultTable);

  const hasMultipleTables = tables.length > 1;

  return (
    <div className="space-y-4">
      {hasMultipleTables && (
      <div className="flex flex-wrap items-center justify-end gap-2">
          {tables.map((table) => (
          <button
            key={`sicbo-admin-table-switch-${table}`}
            type="button"
            onClick={() => setActiveTable(table)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
              activeTable === table
                ? 'border-[#f5c453] bg-[#f5c453]/20 text-[#0b1f15]'
                : 'border-slate-300 text-slate-600 hover:border-[#f5c453] hover:text-[#0b1f15]'
            }`}
          >
            Bàn {table}
          </button>
        ))}
      </div>
      )}

      <SicboResultTablePanel key={`sicbo-admin-active-table-${activeTable}`} tableNumber={activeTable} />
    </div>
  );
};

export default AdminSicboResultManagement;
