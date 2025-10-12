import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

const MobilePopularGames = () => {
  const navigate = useNavigate();

  const popularGames = [
    {
      id: 'game-1',
      name: 'Game 1',
      image: '/images/games/gamephobien/imgi_7_25e25786-cd43-42a4-83eb-b6632bc87916.png',
      category: 'popular'
    },
    {
      id: 'game-2',
      name: 'Game 2',
      image: '/images/games/gamephobien/imgi_8_175208d4-8a6d-4047-8411-e814eb3a8173.png',
      category: 'popular'
    },
    {
      id: 'game-3',
      name: 'Game 3',
      image: '/images/games/gamephobien/imgi_9_b7342ee5-ea0b-4f47-8213-2567022d8d77.png',
      category: 'popular'
    },
    {
      id: 'game-4',
      name: 'Game 4',
      image: '/images/games/gamephobien/imgi_10_33b456e9-aacb-4969-b023-a032f11f0285.png',
      category: 'popular'
    },
    {
      id: 'game-5',
      name: 'Game 5',
      image: '/images/games/gamephobien/imgi_11_8db3f431-f268-4f1a-97be-c9c50a97b746.png',
      category: 'popular'
    },
    {
      id: 'game-6',
      name: 'Game 6',
      image: '/images/games/gamephobien/imgi_12_8c556842-fd16-47ab-b913-59293a01f920.png',
      category: 'popular'
    },
    {
      id: 'game-7',
      name: 'Game 7',
      image: '/images/games/gamephobien/imgi_13_598cf8e6-6719-4892-b19f-7c7dce9c668e.png',
      category: 'popular'
    },
    {
      id: 'game-8',
      name: 'Game 8',
      image: '/images/games/gamephobien/imgi_14_1cf73dcc-3418-45f3-8168-a0c60356044d.png',
      category: 'popular'
    },
    {
      id: 'game-9',
      name: 'Game 9',
      image: '/images/games/gamephobien/imgi_15_b9bd8ed8-4fa7-464d-b7c1-8a053b9eba6d.png',
      category: 'popular'
    },
    {
      id: 'game-10',
      name: 'Game 10',
      image: '/images/games/gamephobien/imgi_16_17de59db-6aa5-4d5d-8044-afd66e5a4f72.png',
      category: 'popular'
    },
    {
      id: 'game-11',
      name: 'Game 11',
      image: '/images/games/gamephobien/imgi_17_8d1e6090-b826-49b1-9b68-c826509ba573.png',
      category: 'popular'
    }
  ];

  const handleGameClick = (gameId) => {
    navigate(`/games/${gameId}`);
  };

  return (
    <div className="px-0 pt-0 pb-2 md:hidden">
      {/* Title */}
      <div className="px-0 mb-2">
        <div className="flex items-center justify-between px-0">
          <div className="flex items-center">
            <Icon icon="mdi:dots-vertical" className="w-5 h-5 text-gray-800 mr-2" />
            <h2 className="text-base font-bold text-gray-800">Phổ biến nhất</h2>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <img 
              src="/images/banners/maduthuong.png" 
              alt="Mã Dự Thưởng" 
              className="h-6 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => console.log('Mã Dự Thưởng clicked')}
            />
            <img 
              src="/images/banners/ketquatraothuong.png" 
              alt="Kết Quả Trao Thưởng" 
              className="h-6 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => console.log('Kết Quả Trao Thưởng clicked')}
            />
          </div>
        </div>
      </div>

      {/* Games Grid - 4 rows x 3 columns */}
      <div className="px-0">
        <div className="grid grid-cols-3 gap-2">
          {popularGames.map((game) => (
            <button
              key={game.id}
              onClick={() => handleGameClick(game.id)}
              className="group"
            >
              {/* Game Image - full image without background */}
              <div className="w-full aspect-square rounded-xl overflow-hidden group-hover:scale-105 transition-all duration-300">
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobilePopularGames;
