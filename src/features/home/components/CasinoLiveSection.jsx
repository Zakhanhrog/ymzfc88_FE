import { useNavigate } from 'react-router-dom';
import liveCasinoGames from '../../casino/data/liveCasinoGames';

const CasinoLiveSection = () => {
  const navigate = useNavigate();

  const handleGameClick = (gameId) => {
    // Handle game click - có thể navigate hoặc mở game
    console.log('Game clicked:', gameId);
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
          <div className="grid grid-cols-3 gap-4 max-w-6xl">
            {liveCasinoGames.map((game) => (
              <div
                key={game.id}
                onClick={() => handleGameClick(game.id)}
                className="rounded-lg overflow-hidden cursor-pointer"
              >
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-transparent">
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasinoLiveSection;

