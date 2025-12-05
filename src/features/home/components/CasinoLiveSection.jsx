import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import liveCasinoGames from '../../casino/data/liveCasinoGames';

const CasinoLiveSection = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const syncLoginState = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    const handleLoginSuccess = (event) => {
      setIsLoggedIn(true);
      if (event?.detail?.user) {
        try {
          localStorage.setItem('user', JSON.stringify(event.detail.user));
        } catch (e) {
          // ignore storage errors
        }
      }
    };

    syncLoginState();

    window.addEventListener('userLoginSuccess', handleLoginSuccess);
    window.addEventListener('storage', syncLoginState);

    return () => {
      window.removeEventListener('userLoginSuccess', handleLoginSuccess);
      window.removeEventListener('storage', syncLoginState);
    };
  }, []);

  const handleGameClick = (game) => {
    const gameId = game.redirectTo || game.id;
    
    if (!isLoggedIn) {
      const redirectPath = `/casino/live?game=${gameId}`;
      window.dispatchEvent(
        new CustomEvent('showLoginModal', {
          detail: { redirectAfterLogin: redirectPath }
        })
      );
      return;
    }

    if (gameId === 'xocdia') {
      navigate('/casino/live/xocdia');
    } else if (gameId === 'sicbo') {
      navigate('/casino/live/sicbo');
    } else {
      navigate(`/casino/live/${gameId}`);
    }
  };

  const handleViewAll = () => {
    navigate('/casino/live');
  };

  return (
    <div className="w-full bg-gray-100 py-6">
      <div className="w-full px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-black text-gray-800 pl-2 pr-8 py-2 rounded-md bg-gradient-to-r from-green-400 via-green-200 to-transparent uppercase relative flex items-center tracking-wide font-oswald" style={{ fontWeight: 900, fontFamily: "'Oswald', sans-serif" }}>
              <span className="absolute left-0 w-1 h-8 bg-green-300 rounded-r-md"></span>
              <span className="relative pl-1 flex items-center gap-1.5" style={{ fontFamily: "'Oswald', sans-serif" }}>
                <span className="text-xs text-white font-bold bg-red-600 px-1.5 py-0.5 rounded">Live</span>
                <span>Casino Trực Tiếp</span>
              </span>
            </h2>
          </div>
          <button
            type="button"
            onClick={handleViewAll}
            className="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
          >
            Xem tất cả
          </button>
        </div>

        {/* Container với background image - Full width như phần trên */}
        <div 
          className="relative w-full rounded-lg overflow-hidden"
          style={{
            backgroundImage: 'url(/images/casinolive/bg_casinolive.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'left center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#f3f4f6',
            minHeight: '250px',
            padding: '20px'
          }}
        >
          {/* Games Grid - 3 cards - To hơn một chút */}
          <div className="grid grid-cols-3 gap-4 max-w-5xl">
            {liveCasinoGames.map((game) => (
              <button
                key={game.id}
                type="button"
                onClick={handleViewAll}
                className="group relative overflow-hidden cursor-pointer bg-transparent block"
              >
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full h-auto block"
                />
                <div className="absolute inset-x-0 bottom-0 bg-white/70 backdrop-blur px-3 py-1.5 flex items-center justify-between text-left transition-all duration-200 ease-out translate-y-full group-hover:translate-y-0">
                  <h2 className="text-xs font-semibold text-gray-800">{game.name}</h2>
                  <span className={`text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full shadow-sm transition-colors duration-150 ${
                    isLoggedIn ? 'bg-yellow-400 text-gray-900' : 'bg-green-500 text-white'
                  }`}>
                    {isLoggedIn ? 'Chơi ngay' : 'Đăng nhập để chơi'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasinoLiveSection;

