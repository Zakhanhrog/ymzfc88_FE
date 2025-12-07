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
        gameName="Chọn bàn Tài xỉu tà thiết"
        userName={userName}
        balanceDisplay={balanceDisplay}
        isLoadingBalance={false}
      />

      <main className="px-3 sm:px-3 md:px-5 lg:px-8 pt-2 md:pt-4 pb-4 md:pb-6">
        <div className="max-w-screen-2xl mx-auto space-y-4 md:space-y-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-800">Chọn bàn để tham gia</h2>
          <div className="grid gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tables.map((table) => {
              const backgroundImage = table.number === 1 
                ? '/images/casinolive/taixiuthuphe.jpg'
                : '/images/casinolive/taixiuthubao.jpg';
              
              return (
                <button
                  key={`sicbo-table-${table.number}`}
                  type="button"
                  onClick={() => navigate(`/casino/live/sicbo?table=${table.number}`)}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 text-left shadow-lg transition hover:border-[#f5c453] hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c453]/70 aspect-[4/3] min-h-[280px]"
                  style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  {/* Header */}
                  <div className="relative z-10 flex items-center justify-between px-4 py-2 border-b border-white/20 text-white/90 text-xs uppercase tracking-wide backdrop-blur-sm bg-black/20">
                    <span className="text-white/80">Live Stream</span>
                    <span className="inline-flex items-center rounded-full border border-white/30 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white bg-black/30 backdrop-blur-sm">
                      Bàn {table.number}
                    </span>
                    <span className="flex items-center gap-2 text-[11px] text-red-300">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      Đang phát
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SicboTableSelectionPage;


