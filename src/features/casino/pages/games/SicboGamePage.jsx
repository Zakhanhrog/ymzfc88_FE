import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SicboHeader from './components/SicboHeader';
import SicboLiveStream from './components/SicboLiveStream';
import SicboBetPanelPlaceholder from './components/SicboBetPanelPlaceholder';
import SicboHistoryDrawer from './components/SicboHistoryDrawer';

const SicboGamePage = () => {
  const navigate = useNavigate();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUserName(parsed?.username || parsed?.name || 'Người chơi');
        const points = parsed?.points ?? parsed?.balance ?? 0;
        setUserPoints(points);
      } catch (error) {
        setUserName('Người chơi');
        setUserPoints(0);
      }
    }
  }, []);

  const balanceDisplay = useMemo(() => {
    if (!userPoints) {
      return '0 điểm';
    }
    return `${userPoints.toLocaleString('vi-VN')} điểm`;
  }, [userPoints]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SicboHeader
        onBack={() => navigate('/casino/live')}
        gameName="Sicbo Bigwin"
        userName={userName}
        balanceDisplay={balanceDisplay}
        isLoadingBalance={false}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      <main className="px-3 sm:px-3 md:px-5 lg:px-8 pt-2 md:pt-4 pb-4 md:pb-6">
        <div className="max-w-screen-2xl mx-auto space-y-4 md:space-y-6">
          <div className="grid gap-2 sm:gap-3 lg:gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
            <SicboLiveStream />

            <div className="grid gap-1 sm:gap-2 lg:gap-3.5 content-start">
              <SicboBetPanelPlaceholder />
              <button
                type="button"
                onClick={() => setIsHistoryOpen(true)}
                className="w-full rounded-2xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 hover:border-gray-300 hover:text-gray-900 transition"
              >
                Xem lịch sử cược (đang phát triển)
              </button>
            </div>
          </div>
        </div>
      </main>

      <SicboHistoryDrawer isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
    </div>
  );
};

export default SicboGamePage;


