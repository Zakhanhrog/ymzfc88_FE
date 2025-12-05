import { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import Hls from 'hls.js';
import { buildStreamUrlFromKey } from '../../../../../utils/domainUtils';
import streamConfigService from '../../../../../services/streamConfigService';

const SicboLiveStream = ({
  countdownDisplay,
  resultOverlay,
  tableLabel = 'Bàn số 1',
  tableNumber = 1,
  isAdmin = false,
}) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [streamUrl, setStreamUrl] = useState('');
  const [isLivePaused, setIsLivePaused] = useState(false);
  const [isLiveEnded, setIsLiveEnded] = useState(false);

  // Load stream URL from API
  useEffect(() => {
    const loadStreamUrl = async () => {
      setIsLoading(true);
      setHasError(false);
      
      try {
        const result = await streamConfigService.getStreamConfigByGame('SICBO', tableNumber);
        console.log('[Sicbo] Stream config API result:', result, 'tableNumber:', tableNumber);
        
        let streamKey = 'sicbo'; // Default fallback
        
        if (result.success && result.data && result.data.streamKey) {
          streamKey = result.data.streamKey;
          console.log('[Sicbo] Using stream key from API:', streamKey);
          // Check if live is paused or ended (only for non-admin users)
          if (!isAdmin) {
            setIsLivePaused(result.data.isLivePaused || false);
            setIsLiveEnded(result.data.isLiveEnded || false);
          } else {
            setIsLivePaused(false);
            setIsLiveEnded(false);
          }
        } else {
          console.warn('[Sicbo] API did not return stream key, using default:', streamKey);
        }
        
        const url = buildStreamUrlFromKey(streamKey);
        console.log('[Sicbo] Final stream URL:', url);
        setStreamUrl(url);
      } catch (error) {
        console.error('[Sicbo] Error loading stream config:', error);
        // Fallback to default stream key on error
        const url = buildStreamUrlFromKey('sicbo');
        console.log('[Sicbo] Using fallback stream URL after error:', url);
        setStreamUrl(url);
      }
    };
    loadStreamUrl();
    
    // Poll for live pause/ended status changes (only for non-admin users)
    if (!isAdmin) {
      const interval = setInterval(() => {
        streamConfigService.getStreamConfigByGame('SICBO', tableNumber).then((result) => {
          if (result?.success && result.data) {
            setIsLivePaused(result.data.isLivePaused || false);
            setIsLiveEnded(result.data.isLiveEnded || false);
          }
        }).catch(() => {
          // Ignore errors
        });
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [tableNumber, isAdmin]);

  useEffect(() => {
    if (!videoRef.current || !streamUrl) return;

    const video = videoRef.current;

    // Check if browser supports HLS natively (Safari)
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      video.addEventListener('loadeddata', () => {
        setIsLoading(false);
        setIsPlaying(true);
      });
      video.addEventListener('error', () => {
        setHasError(true);
        setIsLoading(false);
      });
      return;
    }

    // Use HLS.js for other browsers
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        maxBufferSize: 60 * 1000 * 1000,
        maxBufferHole: 0.5,
        highBufferWatchdogPeriod: 2,
        nudgeOffset: 0.1,
        nudgeMaxRetry: 3,
        maxFragLoadingTimeOut: 2000,
        fragLoadingTimeOut: 2000,
        manifestLoadingTimeOut: 5000,
        levelLoadingTimeOut: 10000,
        fragLoadingTimeOutRetry: 3,
        levelLoadingTimeOutRetry: 4,
        startFragPrefetch: true,
        testBandwidth: true,
        progressive: false,
        debug: false,
      });

      hlsRef.current = hls;

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        setIsPlaying(true);
        video.play().catch((err) => {
          console.error('Error playing video:', err);
        });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('Network error, trying to recover...');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error('Media error, trying to recover...');
              hls.recoverMediaError();
              break;
            default:
              console.error('Fatal error, destroying HLS instance');
              hls.destroy();
              setHasError(true);
              setIsLoading(false);
              break;
          }
        }
      });

      return () => {
        if (hls) {
          hls.destroy();
        }
      };
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  }, [streamUrl, tableNumber]);

  return (
    <section className="relative rounded-2xl bg-gray-900 aspect-[3/2] overflow-hidden shadow-lg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent)]" />
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center justify-between px-4 md:px-6 py-2 border-b border-white/10">
          <div className="flex items-center h-full gap-3">
            <span className="text-xs uppercase tracking-wide text-white/60">Live Stream</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-full border border-white/20 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white/80">
              {tableLabel}
            </span>

            <span className="flex items-center gap-2 text-sm text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              Đang phát
            </span>
          </div>
        </div>

        <div className="flex-1 relative bg-black">
          {!isAdmin && isLiveEnded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-30">
              <div className="flex flex-col items-center gap-3 text-white/90">
                <Icon icon="mdi:stop-circle" className="w-16 h-16 text-red-400" />
                <p className="text-lg font-semibold text-center">Phiên live đã kết thúc</p>
                <p className="text-sm text-center text-white/70 max-w-xs px-4">
                  Vui lòng chờ phiên live mới. Cảm ơn bạn đã tham gia!
                </p>
              </div>
            </div>
          )}

          {!isAdmin && isLivePaused && !isLiveEnded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-20">
              <div className="flex flex-col items-center gap-3 text-white/90">
                <Icon icon="mdi:pause-circle" className="w-16 h-16 text-amber-400" />
                <p className="text-lg font-semibold text-center">Phiên live đang được tạm dừng</p>
                <p className="text-sm text-center text-white/70 max-w-xs px-4">
                  Vui lòng chờ admin tiếp tục phát sóng live.
                </p>
              </div>
            </div>
          )}

          {isLoading && !isLivePaused && !isLiveEnded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
              <div className="flex flex-col items-center gap-2 text-white/70">
                <div className="w-16 h-16 border-4 border-white/20 border-t-white/60 rounded-full animate-spin" />
                <p className="text-sm text-center">Đang tải stream...</p>
              </div>
            </div>
          )}

          {hasError && !isLivePaused && !isLiveEnded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
              <div className="flex flex-col items-center gap-2 text-white/70">
                <Icon icon="mdi:alert-circle" className="w-12 h-12 text-red-400" />
                <p className="text-sm text-center">Không thể tải stream</p>
                <p className="text-xs text-center text-white/50">Vui lòng thử lại sau</p>
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            autoPlay
            playsInline
            muted
            controls={false}
            style={{ display: isPlaying && ((!isLivePaused && !isLiveEnded) || isAdmin) ? 'block' : 'none' }}
          />
        </div>
      </div>
      {resultOverlay}
      <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 z-20">
        <div className="flex items-center px-1 py-1">{countdownDisplay}</div>
      </div>
    </section>
  );
};

export default SicboLiveStream;


