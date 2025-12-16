import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import useSicboSession from '../../casino/hooks/useSicboSession';
import sicboSessionService from '../../../services/sicboSessionService';
import streamConfigService from '../../../services/streamConfigService';
import SicboLiveStream from '../../casino/pages/games/components/SicboLiveStream';
import SicboResultSelection from './sicbo-result/SicboResultSelection';
import SicboResultRefundModal from './sicbo-result/SicboResultRefundModal';
import SicboResultChat from './sicbo-result/SicboResultChat';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Play, Pause, Square, RefreshCw, Loader2 } from 'lucide-react';

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
  const [refundingBets, setRefundingBets] = useState(false);
  const [showRefundConfirmModal, setShowRefundConfirmModal] = useState(false);
  const [isLivePaused, setIsLivePaused] = useState(false);
  const [togglingLivePause, setTogglingLivePause] = useState(false);
  const [isLiveEnded, setIsLiveEnded] = useState(false);
  const [togglingLiveEnded, setTogglingLiveEnded] = useState(false);
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
  const canRefundBets = timer.phaseKey === 'show-result';

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

  useEffect(() => {
    const loadStreamConfig = async () => {
      try {
        const response = await streamConfigService.getStreamConfigByGame('SICBO', tableNumber);
        if (response?.success && response.data) {
          setIsLivePaused(response.data.isLivePaused || false);
          setIsLiveEnded(response.data.isLiveEnded || false);
        }
      } catch (error) {
        // Ignore error, use default value
      }
    };
    loadStreamConfig();
  }, [tableNumber]);


  const handleToggleLiveEnded = useCallback(async () => {
    if (togglingLiveEnded) return;
    
    setTogglingLiveEnded(true);
    try {
      const response = await streamConfigService.toggleLiveEnded('SICBO', tableNumber);
      if (response?.success) {
        setIsLiveEnded(response.data.isLiveEnded || false);
        message.success(response.message || (response.data.isLiveEnded ? 'Đã đánh dấu live kết thúc' : 'Đã mở lại live'));
      } else {
        message.error(response?.message || 'Không thể toggle live ended');
      }
    } catch (error) {
      message.error(error?.message || 'Không thể toggle live ended');
    } finally {
      setTogglingLiveEnded(false);
    }
  }, [togglingLiveEnded, tableNumber]);

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

  const handleOpenRefundConfirmModal = () => {
    if (!canRefundBets || refundingBets) {
      return;
    }
    setShowRefundConfirmModal(true);
  };

  const handleCloseRefundConfirmModal = () => {
    if (refundingBets) {
      return;
    }
    setShowRefundConfirmModal(false);
  };

  const handleRefundBetsForUndeterminedResult = async () => {
    if (refundingBets) {
      return;
    }

    setRefundingBets(true);
    try {
      const response = await sicboSessionService.refundBetsForUndeterminedResult(tableNumber);
      if (response?.success) {
        message.success(response.message || 'Đã hoàn tiền cược cho tất cả người chơi');
        handleClearSelection();
        setShowRefundConfirmModal(false);
        
        // Dispatch event để refresh balance cho tất cả user đã được hoàn tiền
        window.dispatchEvent(new CustomEvent('transactionCreated', {
          detail: { type: 'REFUND', game: 'SICBO', tableNumber }
        }));
      } else {
        message.error(response?.message || 'Không thể hoàn tiền cược');
      }
    } catch (error) {
      message.error(error?.message || 'Không thể hoàn tiền cược');
    } finally {
      setRefundingBets(false);
      refreshSession();
    }
  };

  const handleToggleLivePause = useCallback(async () => {
    if (togglingLivePause) return;
    
    setTogglingLivePause(true);
    try {
      const response = await streamConfigService.toggleLivePause('SICBO', tableNumber);
      if (response?.success) {
        setIsLivePaused(response.data.isLivePaused || false);
        message.success(response.message || (response.data.isLivePaused ? 'Đã tạm dừng live' : 'Đã tiếp tục live'));
      } else {
        message.error(response?.message || 'Không thể toggle live pause');
      }
    } catch (error) {
      message.error(error?.message || 'Không thể toggle live pause');
    } finally {
      setTogglingLivePause(false);
    }
  }, [togglingLivePause, tableNumber]);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)]">
      {/* Live Stream Section - Chỉ khung live, không có header */}
      <div className="w-full h-full">
        <SicboLiveStream
          tableNumber={tableNumber}
          tableLabel={`Bàn số ${tableNumber}`}
          countdownDisplay={renderSessionTimer}
          resultOverlay={null}
          isAdmin={true}
          isLiveEnded={isLiveEnded}
        />
      </div>

      {/* Right Panel - Tất cả controls, selection và chat */}
      <div className="flex flex-col gap-4 h-full">
        {/* Control Buttons Section */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-2">
              {/* Control Buttons */}
              <div className="grid grid-cols-1 gap-2">
                <Button
                  onClick={handleStartNewSession}
                  disabled={startingSession}
                  className="w-full gap-2 bg-emerald-500 text-white hover:bg-emerald-600 rounded-2xl h-10"
                >
                  {startingSession ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang bắt đầu...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Bắt đầu phiên mới
                    </>
                  )}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleToggleLivePause}
                  disabled={togglingLivePause}
                  variant={isLivePaused ? "default" : "outline"}
                  className={`gap-2 rounded-2xl h-10 ${
                    isLivePaused
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
                      : ''
                  }`}
                >
                  {togglingLivePause ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : isLivePaused ? (
                    <>
                      <Play className="h-4 w-4" />
                      Tiếp tục live
                    </>
                  ) : (
                    <>
                      <Pause className="h-4 w-4" />
                      Dừng live
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleToggleLiveEnded}
                  disabled={togglingLiveEnded}
                  className={`gap-2 rounded-2xl h-10 ${
                    isLiveEnded
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  {togglingLiveEnded ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : isLiveEnded ? (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Mở lại live
                    </>
                  ) : (
                    <>
                      <Square className="h-4 w-4" />
                      Kết thúc live
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Result Selection Section */}
        <SicboResultSelection
          tableNumber={tableNumber}
          selectedFaces={selectedFaces}
          canSaveResult={canSaveResult}
          canRefundBets={canRefundBets}
          savingResult={savingResult}
          refundingBets={refundingBets}
          onSelectFace={handleSelectFace}
          onClearSelection={handleClearSelection}
          onSaveResult={handleSaveResult}
          onOpenRefundModal={handleOpenRefundConfirmModal}
        />

        {/* Live Chat Section (Placeholder) */}
        <SicboResultChat />
      </div>

      {/* Refund Confirm Modal */}
      <SicboResultRefundModal
        open={showRefundConfirmModal}
        tableNumber={tableNumber}
        refundingBets={refundingBets}
        onClose={handleCloseRefundConfirmModal}
        onConfirm={handleRefundBetsForUndeterminedResult}
      />
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
