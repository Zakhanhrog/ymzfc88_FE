import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Layout from '../../../components/common/Layout';
import { getProvinceImagePathWithMapping } from '../utils/imageUtils';

const LotteryPage = () => {
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
          image: getProvinceImagePathWithMapping('Miền Bắc'),
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
          image: getProvinceImagePathWithMapping('Gia Lai'),
          description: 'Xổ số Gia Lai'
        },
        {
          id: 'ninh-thuan',
          name: 'Xổ Số Ninh Thuận',
          image: getProvinceImagePathWithMapping('Ninh Thuận'), 
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
          image: getProvinceImagePathWithMapping('Bình Dương'),
          description: 'Xổ số Bình Dương'
        },
        {
          id: 'tra-vinh',
          name: 'Xổ Số Trà Vinh',
          image: getProvinceImagePathWithMapping('Trà Vinh'),
          description: 'Xổ số Trà Vinh'
        },
        {
          id: 'vinh-long',
          name: 'Xổ Số Vĩnh Long',
          image: getProvinceImagePathWithMapping('Vĩnh Long'),
          description: 'Xổ số Vĩnh Long'
        }
      ]
    }
  };

  const handleGameSelect = (gameId) => {
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
      <div className="p-6">
        {/* Region Tabs */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg p-0.5 shadow-sm border border-gray-200">
            {Object.entries(regions).map(([key, region]) => (
              <button
                key={key}
                onClick={() => setSelectedRegion(key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
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

        {/* Games Grid */}
        <div className="grid grid-cols-6 gap-4">
          {regions[selectedRegion].games.map((game) => (
            <div
              key={game.id}
              className="group cursor-pointer transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden rounded-lg shadow-none hover:shadow-[0_0_30px_rgba(211,1,2,0.5)]"
              onClick={() => handleGameSelect(game.id)}
            >
              {/* Game Image */}
              <img
                src={game.image}
                alt={game.name}
                className="w-full aspect-square object-contain bg-gray-50"
              />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default LotteryPage;
