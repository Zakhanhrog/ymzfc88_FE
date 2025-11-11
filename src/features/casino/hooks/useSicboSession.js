import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import sicboSessionService from '../../../services/sicboSessionService';

const DEFAULT_TIMER_STATE = {
  phaseKey: 'idle',
  phaseLabel: '',
  countdownSeconds: 0,
  countdownAngle: 0,
  phaseRemainingMs: null,
  phaseDurationMs: null,
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const useSicboSession = ({ pollIntervalMs = 4000, tableNumber = 1 } = {}) => {
  const [loading, setLoading] = useState(true);
  const [sessionStatus, setSessionStatus] = useState('IDLE');
  const [sessionId, setSessionId] = useState(null);
  const [timerState, setTimerState] = useState(() => ({ ...DEFAULT_TIMER_STATE }));
  const [resultCode, setResultCode] = useState(null);
  const [awaitingResult, setAwaitingResult] = useState(false);

  const serverOffsetRef = useRef(0);
  const phaseStartedAtRef = useRef(null);
  const phaseDurationRef = useRef(null);
  const phaseKeyRef = useRef('');
  const phaseLabelRef = useRef('');
  const statusRef = useRef('IDLE');
  const phaseCompletionRef = useRef(null);
  const fetchCurrentSessionRef = useRef(() => {});
  const pollInterval = useMemo(() => Math.max(1000, pollIntervalMs), [pollIntervalMs]);

  const recalcPhaseState = useCallback(() => {
    const status = statusRef.current;
    const phaseKey = phaseKeyRef.current;
    const phaseLabel = phaseLabelRef.current || '';
    const phaseStartedAt = phaseStartedAtRef.current;
    const phaseDuration = phaseDurationRef.current;

    if (status !== 'RUNNING' || !phaseKey) {
      setTimerState((prev) => {
        if (
          prev.phaseKey === DEFAULT_TIMER_STATE.phaseKey &&
          prev.countdownSeconds === DEFAULT_TIMER_STATE.countdownSeconds &&
          prev.countdownAngle === DEFAULT_TIMER_STATE.countdownAngle &&
          prev.phaseLabel === DEFAULT_TIMER_STATE.phaseLabel &&
          prev.phaseRemainingMs === DEFAULT_TIMER_STATE.phaseRemainingMs &&
          prev.phaseDurationMs === DEFAULT_TIMER_STATE.phaseDurationMs
        ) {
          return prev;
        }
        return { ...DEFAULT_TIMER_STATE };
      });
      phaseCompletionRef.current = null;
      return;
    }

    if (!phaseDuration || !phaseStartedAt) {
      setTimerState((prev) => {
        if (
          prev.phaseKey === phaseKey &&
          prev.phaseLabel === phaseLabel &&
          prev.countdownSeconds === 0 &&
          prev.countdownAngle === 0 &&
          prev.phaseRemainingMs === null &&
          prev.phaseDurationMs === phaseDuration
        ) {
          return prev;
        }
        return {
          phaseKey,
          phaseLabel,
          countdownSeconds: 0,
          countdownAngle: 0,
          phaseRemainingMs: null,
          phaseDurationMs: phaseDuration ?? null,
        };
      });
      if (phaseCompletionRef.current === phaseKey) {
        phaseCompletionRef.current = null;
      }
      return;
    }

    const now = Date.now() + serverOffsetRef.current;
    const elapsed = Math.max(0, now - phaseStartedAt);
    const remaining = Math.max(0, phaseDuration - elapsed);
    const isCountdown = phaseKey === 'countdown';
    const countdownSeconds = isCountdown ? Math.max(0, Math.ceil(remaining / 1000)) : 0;
    const countdownAngle =
      isCountdown && phaseDuration > 0 ? clamp((remaining / phaseDuration) * 360, 0, 360) : 0;

    setTimerState((prev) => {
      if (
        prev.phaseKey === phaseKey &&
        prev.phaseLabel === phaseLabel &&
        prev.countdownSeconds === countdownSeconds &&
        Math.abs(prev.countdownAngle - countdownAngle) < 0.5 &&
        prev.phaseRemainingMs === remaining &&
        prev.phaseDurationMs === phaseDuration
      ) {
        return prev;
      }
      return {
        phaseKey,
        phaseLabel,
        countdownSeconds,
        countdownAngle,
        phaseRemainingMs: remaining,
        phaseDurationMs: phaseDuration,
      };
    });

    if (phaseDuration > 0 && remaining <= 0) {
      if (phaseCompletionRef.current !== phaseKey && typeof fetchCurrentSessionRef.current === 'function') {
        phaseCompletionRef.current = phaseKey;
        fetchCurrentSessionRef.current();
      }
    } else if (phaseCompletionRef.current === phaseKey) {
      phaseCompletionRef.current = null;
    }
  }, []);

  const resetToIdle = useCallback(() => {
    statusRef.current = 'IDLE';
    phaseKeyRef.current = '';
    phaseLabelRef.current = '';
    phaseDurationRef.current = null;
    phaseStartedAtRef.current = null;
    phaseCompletionRef.current = null;
    setSessionStatus('IDLE');
    setSessionId(null);
    setResultCode(null);
    setAwaitingResult(false);
    setTimerState((prev) => {
      if (
        prev.phaseKey === DEFAULT_TIMER_STATE.phaseKey &&
        prev.countdownSeconds === DEFAULT_TIMER_STATE.countdownSeconds &&
        prev.countdownAngle === DEFAULT_TIMER_STATE.countdownAngle &&
        prev.phaseLabel === DEFAULT_TIMER_STATE.phaseLabel &&
        prev.phaseRemainingMs === DEFAULT_TIMER_STATE.phaseRemainingMs &&
        prev.phaseDurationMs === DEFAULT_TIMER_STATE.phaseDurationMs
      ) {
        return prev;
      }
      return { ...DEFAULT_TIMER_STATE };
    });
  }, []);

  const fetchCurrentSession = useCallback(async () => {
    try {
      const response = await sicboSessionService.getCurrentSession(tableNumber);
      if (response?.success && response.data) {
        const {
          status,
          serverTime,
          id,
          phase,
          phaseLabel,
          phaseStartedAt,
          phaseDurationMs,
          phaseRemainingMs,
          resultCode,
          awaitingResult,
        } = response.data;

        const normalizedStatus = (status || 'IDLE').toUpperCase();

        if (typeof serverTime === 'number') {
          serverOffsetRef.current = serverTime - Date.now();
        }

        statusRef.current = normalizedStatus;
        setSessionStatus(normalizedStatus);
        setSessionId(id ?? null);
        setResultCode(typeof resultCode === 'string' && resultCode.length > 0 ? resultCode : null);
        setAwaitingResult(Boolean(awaitingResult));

        if (normalizedStatus !== 'RUNNING') {
          phaseKeyRef.current = '';
          phaseLabelRef.current = '';
          phaseDurationRef.current = null;
          phaseStartedAtRef.current = null;
          phaseCompletionRef.current = null;
          setResultCode((prevCode) => (normalizedStatus === 'IDLE' ? null : prevCode));
          setTimerState((prev) => {
            if (
              prev.phaseKey === DEFAULT_TIMER_STATE.phaseKey &&
              prev.countdownSeconds === DEFAULT_TIMER_STATE.countdownSeconds &&
              prev.countdownAngle === DEFAULT_TIMER_STATE.countdownAngle &&
              prev.phaseLabel === DEFAULT_TIMER_STATE.phaseLabel &&
              prev.phaseRemainingMs === DEFAULT_TIMER_STATE.phaseRemainingMs &&
              prev.phaseDurationMs === DEFAULT_TIMER_STATE.phaseDurationMs
            ) {
              return prev;
            }
            return { ...DEFAULT_TIMER_STATE };
          });
          return;
        }

        const normalizedPhaseKey =
          typeof phase === 'string' && phase.length > 0 ? phase.toLowerCase() : '';
        phaseKeyRef.current = normalizedPhaseKey;
        phaseLabelRef.current = phaseLabel || '';
        phaseDurationRef.current =
          typeof phaseDurationMs === 'number' && phaseDurationMs > 0 ? phaseDurationMs : null;
        phaseStartedAtRef.current =
          typeof phaseStartedAt === 'number' && phaseStartedAt > 0 ? phaseStartedAt : null;
        phaseCompletionRef.current = null;

        const duration = phaseDurationRef.current;
        const remaining =
          normalizedPhaseKey &&
          typeof phaseRemainingMs === 'number' &&
          Number.isFinite(phaseRemainingMs)
            ? Math.max(0, phaseRemainingMs)
            : duration != null && phaseStartedAtRef.current != null
            ? Math.max(
                0,
                duration - (Date.now() + serverOffsetRef.current - phaseStartedAtRef.current)
              )
            : null;

        const isCountdown = normalizedPhaseKey === 'countdown';
        const countdownSeconds =
          isCountdown && remaining != null ? Math.max(0, Math.ceil(remaining / 1000)) : 0;
        const countdownAngle =
          isCountdown && remaining != null && duration ? clamp((remaining / duration) * 360, 0, 360) : 0;

        setTimerState((prev) => {
          const nextState = {
            phaseKey: normalizedPhaseKey || 'idle',
            phaseLabel: phaseLabelRef.current || '',
            countdownSeconds,
            countdownAngle,
            phaseRemainingMs: remaining,
            phaseDurationMs: duration,
          };

          if (
            prev.phaseKey === nextState.phaseKey &&
            prev.phaseLabel === nextState.phaseLabel &&
            prev.countdownSeconds === nextState.countdownSeconds &&
            Math.abs(prev.countdownAngle - nextState.countdownAngle) < 0.5 &&
            prev.phaseRemainingMs === nextState.phaseRemainingMs &&
            prev.phaseDurationMs === nextState.phaseDurationMs
          ) {
            return prev;
          }

          return nextState;
        });

        recalcPhaseState();
      } else {
        resetToIdle();
        setResultCode(null);
        setAwaitingResult(false);
      }
    } catch (error) {
      resetToIdle();
      setResultCode(null);
      setAwaitingResult(false);
    } finally {
      setLoading(false);
    }
  }, [recalcPhaseState, resetToIdle, tableNumber]);

  useEffect(() => {
    fetchCurrentSessionRef.current = fetchCurrentSession;
  }, [fetchCurrentSession]);

  useEffect(() => {
    fetchCurrentSession();
  }, [fetchCurrentSession]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchCurrentSession();
    }, pollInterval);

    return () => clearInterval(interval);
  }, [fetchCurrentSession, pollInterval]);

  useEffect(() => {
    const animationInterval = setInterval(() => {
      recalcPhaseState();
    }, 250);

    return () => clearInterval(animationInterval);
  }, [recalcPhaseState]);

  return {
    loading,
    sessionStatus,
    sessionId,
    timer: timerState,
    refreshSession: fetchCurrentSession,
    resultCode,
    awaitingResult,
  };
};

export default useSicboSession;


