import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SicboHeader from './components/SicboHeader';

const tables = [
  { number: 1, dealerName: 'Anna', playerCount: 96 },
  { number: 2, dealerName: 'Mia', playerCount: 88 },
];

const formatPoints = (points) => `${Number(points || 0).toLocaleString('vi-VN')} điểm`;

const SicboTableSelectionPage = () => {
  const navigate = useNavigate();
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
    } else {
      setUserName('Người chơi');
      setUserPoints(0);
    }
  }, []);

  const balanceDisplay = useMemo(() => formatPoints(userPoints), [userPoints]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SicboHeader
        onBack={() => navigate('/casino/live')}
        gameName="Chọn bàn Sicbo"
        userName={userName}
        balanceDisplay={balanceDisplay}
        isLoadingBalance={false}
      />

      <main className="px-3 sm:px-3 md:px-5 lg:px-8 pt-2 md:pt-4 pb-4 md:pb-6">
        <div className="max-w-screen-2xl mx-auto space-y-4 md:space-y-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-800">Chọn bàn để tham gia</h2>
          <div className="grid gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tables.map((table) => (
              <button
                key={`sicbo-table-${table.number}`}
                type="button"
                onClick={() => navigate(`/casino/live/sicbo?table=${table.number}`)}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-left shadow-lg transition hover:border-[#f5c453] hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c453]/70"
              >
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 text-white/80 text-xs uppercase tracking-wide">
                  <span className="text-white/60">Live Stream</span>
                  <span className="inline-flex items-center rounded-full border border-white/20 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                    Bàn số {table.number}
                  </span>
                  <span className="flex items-center gap-2 text-[11px] text-red-300">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    Đang phát
                  </span>
                </div>
                <div className="flex-1 flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent)] px-4 py-6 text-sm text-white/70">
                  <div className="text-center space-y-2">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/30">
                      🎲
                    </div>
                    <div className="font-semibold text-white">Dealer: {table.dealerName}</div>
                    <div className="text-xs text-white/70">Người chơi đang xem: {table.playerCount}</div>
                    <div className="text-[11px] text-white/50">
                      Nhấn để vào bàn {table.number} và bắt đầu đặt cược
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SicboTableSelectionPage;


