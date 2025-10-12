import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Layout from '../../../components/common/Layout';

const MobileLotteryPage = () => {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState('bac');

  const regions = {
    bac: {
      name: 'Miền Bắc',
      color: 'from-red-500 to-red-600',
      games: [
        {
          id: 'mien-bac',
          name: 'Xổ Số Miền Bắc',
          image: '/images/games/mienbac.png',
          description: 'Xổ số miền Bắc hàng ngày'
        }
      ]
    },
    trung: {
      name: 'Miền Trung', 
      color: 'from-blue-500 to-blue-600',
      games: [
        {
          id: 'gia-lai',
          name: 'Xổ Số Gia Lai', 
          image: '/images/games/gialai.png',
          description: 'Xổ số Gia Lai'
        },
        {
          id: 'ninh-thuan',
          name: 'Xổ Số Ninh Thuận',
          image: '/images/games/ninhthuan.png', 
          description: 'Xổ số Ninh Thuận'
        }
      ]
    },
    nam: {
      name: 'Miền Nam',
      color: 'from-green-500 to-green-600', 
      games: [
        {
          id: 'binh-duong',
          name: 'Xổ Số Bình Dương',
          image: '/images/games/binhduong.png',
          description: 'Xổ số Bình Dương'
        },
        {
          id: 'tra-vinh',
          name: 'Xổ Số Trà Vinh',
          image: '/images/games/travinh.png',
          description: 'Xổ số Trà Vinh'
        },
        {
          id: 'vinh-long',
          name: 'Xổ Số Vĩnh Long',
          image: '/images/games/vinhlong.png',
          description: 'Xổ số Vĩnh Long'
        }
      ]
    }
  };

  const handleGameSelect = (gameId) => {
    console.log('Selected game:', gameId);
    if (gameId === 'mien-bac') {
      navigate('/lottery/mien-bac');
    } else if (['binh-duong', 'gia-lai', 'ninh-thuan', 'tra-vinh', 'vinh-long'].includes(gameId)) {
      // Tất cả các cổng game Miền Trung và Nam đều vào trang chung với tên cổng
      const gameName = regions.trung.games.concat(regions.nam.games).find(game => game.id === gameId)?.name || '';
      navigate(`/lottery/mien-trung-nam?port=${gameId}&name=${encodeURIComponent(gameName)}`);
    }
  };

  return (
    <Layout>
      <div className="px-4 py-4 md:hidden">
        {/* Title */}
        <div className="mb-4">
          <div className="flex items-center">
            <Icon icon="mdi:dots-vertical" className="w-5 h-5 text-gray-800 mr-2" />
            <h1 className="text-lg font-bold text-gray-800">Xổ Số</h1>
          </div>
        </div>

        {/* Region Tabs */}
        <div className="mb-4">
          <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <div className="flex">
              {Object.entries(regions).map(([key, region]) => (
                <button
                  key={key}
                  onClick={() => setSelectedRegion(key)}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    selectedRegion === key
                      ? `bg-gradient-to-r ${region.color} text-white shadow-md`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {region.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Games Grid - Layout giống trang chủ */}
        <div className="grid grid-cols-3 gap-2">
          {regions[selectedRegion].games.map((game) => (
            <button
              key={game.id}
              onClick={() => handleGameSelect(game.id)}
              className="group"
            >
              {/* Game Image - full image without background, giống trang chủ */}
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
    </Layout>
  );
};

export default MobileLotteryPage;
