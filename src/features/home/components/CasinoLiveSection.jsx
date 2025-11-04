const CasinoLiveSection = () => {
  // 3 game casino trực tiếp
  const casinoGames = [
    {
      id: 'xocdia',
      name: 'Xóc Đĩa',
      image: '/images/casinolive/xocdia.png'
    },
    {
      id: 'taixiu',
      name: 'Tài Xỉu',
      image: '/images/casinolive/taixiu.png'
    },
    {
      id: 'baucua',
      name: 'Bầu Cua',
      image: '/images/casinolive/baucua.png'
    }
  ];

  const handleGameClick = (gameId) => {
    // Handle game click - có thể navigate hoặc mở game
    console.log('Game clicked:', gameId);
  };

  return (
    <div className="w-full bg-gray-100 py-6">
      <div className="w-full px-6">
        {/* Header */}
        <div className="flex items-center mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-black text-gray-800 px-4 py-2 rounded-lg bg-gradient-to-r from-green-400 via-green-200 to-transparent shadow-sm uppercase relative flex items-center" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 900, textShadow: '0 1px 2px rgba(0,0,0,0.3), 0 0 1px rgba(0,0,0,0.5)' }}>
              <span className="absolute left-0 w-1 h-8 bg-green-300 rounded-r-lg"></span>
              <span className="relative pl-2">Casino Trực Tiếp</span>
            </h2>
          </div>
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
            {casinoGames.map((game) => (
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

