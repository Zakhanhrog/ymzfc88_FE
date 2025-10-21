import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Layout from '../../../components/common/Layout';
import { getProvinceImagePathWithMapping } from '../utils/imageUtils';
import { getProvincesByDay } from '../data/provincesData';

const LotteryPage = () => {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState('bac');
  const [selectedDay, setSelectedDay] = useState(new Date().getDay()); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // Lấy tỉnh theo ngày được chọn
  const selectedDayProvinces = getProvincesByDay(selectedDay);

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
      games: selectedDayProvinces.trung
    },
    nam: {
      name: 'Miền Nam',
      color: 'from-green-500 to-green-600', 
      games: selectedDayProvinces.nam
    }
  };

  const handleGameSelect = (gameId) => {
    if (gameId === 'mien-bac') {
      navigate('/lottery/mien-bac');
    } else {
      // Tất cả các cổng game Miền Trung và Nam đều vào trang chung với tên cổng
      const allGames = regions.trung.games.concat(regions.nam.games);
      const game = allGames.find(g => g.id === gameId);
      if (game) {
        navigate(`/lottery/mien-trung-nam?port=${gameId}&name=${encodeURIComponent(game.name)}`);
      }
    }
  };

  return (
    <Layout>
      {/* Desktop Layout */}
      <div className="hidden md:block p-6">
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

        {/* Weekday Horizontal Bar */}
        <div className="mb-6">
          <div className="flex gap-1 justify-center">
            {[
              { day: 'T2', dayIndex: 1, color: 'bg-gray-100 hover:bg-gray-200' },
              { day: 'T3', dayIndex: 2, color: 'bg-gray-100 hover:bg-gray-200' },
              { day: 'T4', dayIndex: 3, color: 'bg-gray-100 hover:bg-gray-200' },
              { day: 'T5', dayIndex: 4, color: 'bg-gray-100 hover:bg-gray-200' },
              { day: 'T6', dayIndex: 5, color: 'bg-gray-100 hover:bg-gray-200' },
              { day: 'T7', dayIndex: 6, color: 'bg-gray-100 hover:bg-gray-200' },
              { day: 'CN', dayIndex: 0, color: 'bg-gray-100 hover:bg-gray-200' }
            ].map((item, index) => (
              <div
                key={index}
                onClick={() => setSelectedDay(item.dayIndex)}
                className={`${selectedDay === item.dayIndex ? 'bg-red-500 text-white shadow-lg' : `${item.color} hover:scale-105 hover:shadow-md`} rounded-lg p-2 cursor-pointer transition-all duration-300 transform flex-1 text-center max-w-20`}
              >
                <div className="text-xs font-semibold">{item.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-6 gap-4">
          {regions[selectedRegion].games.map((game) => (
            <div
              key={game.id}
              className="group cursor-pointer transition-all duration-300 transform relative overflow-hidden rounded-lg shadow-none hover:shadow-[0_0_30px_rgba(211,1,2,0.5)]"
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

      {/* Mobile Layout */}
      <div className="md:hidden mt-0">
        <div className="flex gap-2 h-[calc(100vh-410px)]">
          {/* Game Categories Sidebar */}
          <div className="w-1/5">
            <div className="bg-white rounded-lg p-2 h-full">
              <div className="overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {/* HOT GAMES */}
                <div className="flex flex-col items-center p-1 bg-gray-100 rounded-lg mb-1 aspect-square">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Icon icon="mdi:fire" className="text-gray-600 text-lg" />
                  </div>
                  <span className="text-xs text-gray-700 text-center">HOT</span>
                </div>
                
                {/* THỂ THAO */}
                <div className="flex flex-col items-center p-1 bg-gray-50 rounded-lg mb-1 aspect-square">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Icon icon="mdi:soccer" className="text-gray-600 text-lg" />
                  </div>
                  <span className="text-xs text-gray-700 text-center">Thể Thao</span>
                </div>
                
                {/* SÒNG BÀI */}
                <div className="flex flex-col items-center p-1 bg-gray-50 rounded-lg mb-1 aspect-square">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Icon icon="mdi:cards-playing" className="text-gray-600 text-lg" />
                  </div>
                  <span className="text-xs text-gray-700 text-center">Sòng Bài</span>
                </div>
                
                {/* SLOTS */}
                <div className="flex flex-col items-center p-1 bg-gray-50 rounded-lg mb-1 aspect-square">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Icon icon="mdi:slot-machine" className="text-gray-600 text-lg" />
                  </div>
                  <span className="text-xs text-gray-700 text-center">Slots</span>
                </div>
                
                {/* ĐÁ GÀ */}
                <div className="flex flex-col items-center p-1 bg-gray-50 rounded-lg mb-1 aspect-square">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Icon icon="game-icons:rooster" className="text-gray-600 text-lg" />
                  </div>
                  <span className="text-xs text-gray-700 text-center">Đá Gà</span>
                </div>
                
                {/* GAME BÀI */}
                <div className="flex flex-col items-center p-1 bg-gray-50 rounded-lg mb-1 aspect-square">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Icon icon="mdi:cards" className="text-gray-600 text-lg" />
                  </div>
                  <span className="text-xs text-gray-700 text-center">Game Bài</span>
                </div>
                
                {/* RACING BALL */}
                <div className="flex flex-col items-center p-1 bg-gray-50 rounded-lg mb-1 aspect-square">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Icon icon="mdi:basketball" className="text-gray-600 text-lg" />
                  </div>
                  <span className="text-xs text-gray-700 text-center">Racing</span>
                </div>
                
                {/* XỔ SỐ */}
                <div className="flex flex-col items-center p-1 bg-red-100 rounded-lg mb-1 aspect-square">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Icon icon="mdi:dice-multiple" className="text-red-600 text-lg" />
                  </div>
                  <span className="text-xs text-red-700 text-center">Xổ Số</span>
                </div>
                
                {/* E-SPORTS */}
                <div className="flex flex-col items-center p-1 bg-gray-50 rounded-lg mb-1 aspect-square">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Icon icon="mdi:controller" className="text-gray-600 text-lg" />
                  </div>
                  <span className="text-xs text-gray-700 text-center">E-Sports</span>
                </div>
                
                {/* KHUYẾN MÃI */}
                <div className="flex flex-col items-center p-1 bg-gray-50 rounded-lg mb-1 aspect-square">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Icon icon="mdi:gift" className="text-gray-600 text-lg" />
                  </div>
                  <span className="text-xs text-gray-700 text-center">Khuyến Mãi</span>
                </div>
                
                {/* VIP */}
                <div className="flex flex-col items-center p-1 bg-gray-50 rounded-lg mb-1 aspect-square">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Icon icon="mdi:crown" className="text-gray-600 text-lg" />
                  </div>
                  <span className="text-xs text-gray-700 text-center">VIP</span>
                </div>
                
                {/* APP */}
                <div className="flex flex-col items-center p-1 bg-gray-50 rounded-lg aspect-square">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Icon icon="mdi:cellphone" className="text-gray-600 text-lg" />
                  </div>
                  <span className="text-xs text-gray-700 text-center">APP</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Lottery Content */}
          <div className="w-4/5">
            <div className="px-2 py-2 bg-white rounded-lg h-full flex flex-col">
              {/* Mobile Weekday Bar */}
              <div className="mb-3">
                <div className="flex gap-1">
                  {[
                    { day: 'T2', dayIndex: 1, color: 'bg-gray-100 hover:bg-gray-200' },
                    { day: 'T3', dayIndex: 2, color: 'bg-gray-100 hover:bg-gray-200' },
                    { day: 'T4', dayIndex: 3, color: 'bg-gray-100 hover:bg-gray-200' },
                    { day: 'T5', dayIndex: 4, color: 'bg-gray-100 hover:bg-gray-200' },
                    { day: 'T6', dayIndex: 5, color: 'bg-gray-100 hover:bg-gray-200' },
                    { day: 'T7', dayIndex: 6, color: 'bg-gray-100 hover:bg-gray-200' },
                    { day: 'CN', dayIndex: 0, color: 'bg-gray-100 hover:bg-gray-200' }
                  ].map((item, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedDay(item.dayIndex)}
                      className={`${selectedDay === item.dayIndex ? 'bg-red-500 text-white shadow-lg' : `${item.color} hover:scale-105 hover:shadow-md`} rounded-lg p-1 cursor-pointer transition-all duration-300 transform flex-1 text-center`}
                    >
                      <div className="text-xs font-semibold">{item.day}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Region Tabs for Mobile */}
              <div className="mb-3">
                <div className="flex gap-1">
                  {Object.entries(regions).map(([key, region]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedRegion(key)}
                      className={`px-3 py-2 rounded-md text-xs font-medium transition-all flex-1 ${
                        selectedRegion === key
                          ? `bg-gradient-to-r ${region.color} text-white shadow-md`
                          : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {region.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Miền Bắc Card - Above Weekday Bar */}
              <div className="mb-3">
                <div className="bg-white border border-red-300 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden">
                        <img
                          src={regions.bac.games[0].image}
                          alt={regions.bac.games[0].name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-base font-semibold text-gray-800">Miền Bắc</span>
                          <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">HOT</span>
                        </div>
                        <div className="text-sm text-gray-600">Ngày: {new Date().toLocaleDateString('vi-VN')}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <button 
                      className="bg-red-500 text-white text-xs px-3 py-1 rounded-lg hover:bg-red-600 transition-colors"
                      onClick={() => handleGameSelect(regions.bac.games[0].id)}
                    >
                      Đặt cược
                    </button>
                    <div className="flex space-x-1">
                      {['0', '7', '0', '8', '1'].map((number, index) => (
                        <div key={index} className="w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {number}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Mobile Game Layout - Region Headers with Games */}
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <div className="space-y-3">

                  {/* Miền Trung Section */}
                  <div>
                    <div className="text-left mb-2">
                      <span className="text-gray-600 text-xs font-semibold">Miền Trung</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {regions.trung.games.map((game) => (
                        <div
                          key={game.id}
                          className="h-20 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
                          onClick={() => handleGameSelect(game.id)}
                        >
                          <img
                            src={game.image}
                            alt={game.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Miền Nam Section */}
                  <div>
                    <div className="text-left mb-2">
                      <span className="text-gray-600 text-xs font-semibold">Miền Nam</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {regions.nam.games.map((game) => (
                        <div
                          key={game.id}
                          className="h-20 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
                          onClick={() => handleGameSelect(game.id)}
                        >
                          <img
                            src={game.image}
                            alt={game.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LotteryPage;
