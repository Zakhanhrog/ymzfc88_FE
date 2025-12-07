import { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import Hls from 'hls.js';
import { buildStreamUrlFromKey } from '../../../../../utils/domainUtils';
import streamConfigService from '../../../../../services/streamConfigService';

const XocDiaLiveStream = ({ resultOverlay, countdownDisplay, isAdmin = false }) => {
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
        const result = await streamConfigService.getStreamConfigByGame('XOC_DIA');
        console.log('[XocDia] Stream config API result:', result);
        
        let streamKey = 'xocdia'; // Default fallback
        
        if (result.success && result.data && result.data.streamKey) {
          streamKey = result.data.streamKey;
          console.log('[XocDia] Using stream key from API:', streamKey);
          // Check if live is paused or ended (only for non-admin users)
          if (!isAdmin) {
            setIsLivePaused(result.data.isLivePaused || false);
            setIsLiveEnded(result.data.isLiveEnded || false);
          } else {
            setIsLivePaused(false);
            setIsLiveEnded(false);
          }
        } else {
          console.warn('[XocDia] API did not return stream key, using default:', streamKey);
        }
        
        const url = buildStreamUrlFromKey(streamKey);
        console.log('[XocDia] Final stream URL:', url);
        setStreamUrl(url);
      } catch (error) {
        console.error('[XocDia] Error loading stream config:', error);
        // Fallback to default stream key on error
        const url = buildStreamUrlFromKey('xocdia');
        console.log('[XocDia] Using fallback stream URL after error:', url);
        setStreamUrl(url);
      }
    };
    loadStreamUrl();
    
    // Poll for live pause/ended status changes (only for non-admin users)
    if (!isAdmin) {
      const interval = setInterval(() => {
        streamConfigService.getStreamConfigByGame('XOC_DIA').then((result) => {
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
  }, [isAdmin]);

  useEffect(() => {
    if (!videoRef.current || !streamUrl) {
      console.log('[XocDia] Waiting for stream URL...', { hasVideoRef: !!videoRef.current, streamUrl });
      return;
    }

    console.log('[XocDia] Initializing video player with URL:', streamUrl);
    const video = videoRef.current;

    // Check if browser supports HLS natively (Safari)
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      console.log('[XocDia] Using native HLS support (Safari)');
      video.src = streamUrl;
      
      video.addEventListener('loadeddata', () => {
        console.log('[XocDia] Video loaded successfully');
        setIsLoading(false);
        setIsPlaying(true);
      });
      
      video.addEventListener('error', (e) => {
        const error = video.error;
        console.error('[XocDia] Video error:', {
          error,
          code: error?.code,
          message: error?.message,
          networkState: video.networkState,
          readyState: video.readyState,
          src: video.src
        });
        setHasError(true);
        setIsLoading(false);
      });
      
      video.addEventListener('loadstart', () => {
        console.log('[XocDia] Video load started');
      });
      
      video.addEventListener('progress', () => {
        console.log('[XocDia] Video loading progress');
      });
      
      return;
    }

    // Use HLS.js for other browsers
    if (Hls.isSupported()) {
      console.log('[XocDia] Using HLS.js for playback');
      
      // First, check if stream URL is accessible
      fetch(streamUrl, { method: 'HEAD' })
        .then(response => {
          console.log('[XocDia] Stream URL check:', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries())
          });
          if (!response.ok) {
            throw new Error(`Stream not available: ${response.status} ${response.statusText}`);
          }
        })
        .catch(error => {
          console.error('[XocDia] Stream URL check failed:', error);
          setHasError(true);
          setIsLoading(false);
        });

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
        manifestLoadingTimeOut: 10000,
        levelLoadingTimeOut: 15000,
        fragLoadingTimeOutRetry: 3,
        levelLoadingTimeOutRetry: 4,
        startFragPrefetch: true,
        testBandwidth: true,
        progressive: false,
        debug: false, // Disable debug in production
      });

      hlsRef.current = hls;

      console.log('[XocDia] Loading HLS source:', streamUrl);
      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('[XocDia] HLS manifest parsed, starting playback');
        setIsLoading(false);
        setIsPlaying(true);
        video.play().catch((err) => {
          console.error('[XocDia] Error playing video:', err);
          setHasError(true);
        });
      });
      
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('[XocDia] HLS Error:', data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('[XocDia] Network error, trying to recover...');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error('[XocDia] Media error, trying to recover...');
              hls.recoverMediaError();
              break;
            default:
              console.error('[XocDia] Fatal error, destroying HLS instance:', data);
              hls.destroy();
              setHasError(true);
              setIsLoading(false);
              break;
          }
        } else {
          console.warn('[XocDia] Non-fatal HLS error:', data);
        }
      });
      
      hls.on(Hls.Events.MANIFEST_LOADED, () => {
        console.log('[XocDia] HLS manifest loaded');
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
  }, [streamUrl]);

  return (
    <section className="relative rounded-2xl bg-gray-900 aspect-[3/2] overflow-hidden shadow-lg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent)]" />
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center justify-between px-4 md:px-6 py-2 border-b border-white/10">
          <div className="flex items-center h-full">
            <span className="text-xs uppercase tracking-wide text-white/60">Live Stream</span>
          </div>

          <span className="flex items-center gap-2 text-sm text-red-400">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            Đang phát
          </span>
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
                <p className="text-sm text-center font-medium">Không thể tải stream</p>
                <p className="text-xs text-center text-white/50 max-w-xs px-4">
                  Stream chưa sẵn sàng. Vui lòng đợi stream được kích hoạt hoặc thử lại sau.
                </p>
                <button
                  onClick={() => {
                    setHasError(false);
                    setIsLoading(true);
                    window.location.reload();
                  }}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                >
                  Thử lại
                </button>
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

export default XocDiaLiveStream;