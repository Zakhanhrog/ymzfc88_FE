import { useMemo, useState, useEffect } from 'react';
import { message } from '../../../utils/notification';
import useXocDiaSession from '../../casino/hooks/useXocDiaSession';
import xocDiaSessionService from '../../../services/xocDiaSessionService';
import streamConfigService from '../../../services/streamConfigService';
import XocDiaLiveStream from '../../casino/pages/games/components/XocDiaLiveStream';
import XocDiaResultSelection from './xoc-dia-result/XocDiaResultSelection';
import XocDiaResultRefundModal from './xoc-dia-result/XocDiaResultRefundModal';
import XocDiaResultChat from './xoc-dia-result/XocDiaResultChat';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Play, Pause, Square, RefreshCw, Loader2 } from 'lucide-react';

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


const AdminXocDiaResultManagement = () => {
  const [selectedResult, setSelectedResult] = useState(null);
  const [startingSession, setStartingSession] = useState(false);
  const [savingResult, setSavingResult] = useState(false);
  const [refundingBets, setRefundingBets] = useState(false);
  const [showRefundConfirmModal, setShowRefundConfirmModal] = useState(false);
  const [isLivePaused, setIsLivePaused] = useState(false);
  const [togglingLivePause, setTogglingLivePause] = useState(false);
  const [isLiveEnded, setIsLiveEnded] = useState(false);
  const [togglingLiveEnded, setTogglingLiveEnded] = useState(false);
  const { sessionStatus, timer, refreshSession } = useXocDiaSession({ pollIntervalMs: 3000 });

  const isSessionRunning = sessionStatus === 'RUNNING';
  const isCountdownPhase = isSessionRunning && timer.phaseKey === 'countdown';
  const currentPhaseLabel = isSessionRunning ? timer.phaseLabel ?? '' : 'Chờ phiên mới';
  const countdownCircleStyle = {
    background: `conic-gradient(#34d399 ${timer.countdownAngle}deg, #064e3b ${timer.countdownAngle}deg)`,
  };

  const canSaveResult = Boolean(selectedResult) && timer.phaseKey === 'show-result';
  const canRefundBets = timer.phaseKey === 'show-result';

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
      const response = await xocDiaSessionService.refundBetsForUndeterminedResult();
      if (response?.success) {
        message.success(response.message || 'Đã hoàn tiền cược cho tất cả người chơi');
        setSelectedResult(null);
        setShowRefundConfirmModal(false);
        
        // Dispatch event để refresh balance cho tất cả user đã được hoàn tiền
        window.dispatchEvent(new CustomEvent('transactionCreated', {
          detail: { type: 'REFUND', game: 'XOC_DIA' }
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

  const optionMap = useMemo(() => {
    const map = new Map();
    defaultQuickBetConfigs.forEach((config) => {
      map.set(config.code, config);
    });
    return map;
  }, []);

  const handleClearSelection = () => {
    setSelectedResult(null);
  };

  useEffect(() => {
    const loadStreamConfig = async () => {
      try {
        const response = await streamConfigService.getStreamConfigByGame('XOC_DIA');
        if (response?.success && response.data) {
          setIsLivePaused(response.data.isLivePaused || false);
          setIsLiveEnded(response.data.isLiveEnded || false);
        }
      } catch (error) {
        // Ignore error, use default value
      }
    };
    loadStreamConfig();
  }, []);

  const handleToggleLivePause = async () => {
    if (togglingLivePause) return;
    
    setTogglingLivePause(true);
    try {
      const response = await streamConfigService.toggleLivePause('XOC_DIA', null);
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
  };

  const handleToggleLiveEnded = async () => {
    if (togglingLiveEnded) return;
    
    setTogglingLiveEnded(true);
    try {
      const response = await streamConfigService.toggleLiveEnded('XOC_DIA', null);
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
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)]">
      {/* Live Stream Section - Chỉ khung live, không có header */}
      <div className="w-full h-full">
          <XocDiaLiveStream
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
        <XocDiaResultSelection
          quickBetConfigs={defaultQuickBetConfigs}
          selectedResult={selectedResult}
          optionMap={optionMap}
          canSaveResult={canSaveResult}
          canRefundBets={canRefundBets}
          savingResult={savingResult}
          refundingBets={refundingBets}
          startingSession={startingSession}
          onSelectResult={setSelectedResult}
          onClearSelection={handleClearSelection}
          onSaveResult={handleSaveResult}
          onOpenRefundModal={handleOpenRefundConfirmModal}
          onStartNewSession={handleStartNewSession}
        />

        {/* Chat Live Section */}
        <div className="flex-1 min-h-0">
          <XocDiaResultChat />
        </div>
      </div>

      <XocDiaResultRefundModal
        open={showRefundConfirmModal}
        refundingBets={refundingBets}
        onClose={handleCloseRefundConfirmModal}
        onConfirm={handleRefundBetsForUndeterminedResult}
      />
    </div>
  );
};

export default AdminXocDiaResultManagement;


