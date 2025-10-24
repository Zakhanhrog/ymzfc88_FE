import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { getProvinceImagePathWithMapping } from '../utils/imageUtils';
import { getProvincesByDay } from '../data/provincesData';
import Layout from '../../../components/common/Layout';

const MobileLotteryPage = () => {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(new Date().getDay()); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // Lấy tỉnh theo ngày được chọn
  const selectedDayProvinces = getProvincesByDay(selectedDay);
  
  // Fallback data nếu không có dữ liệu
  const fallbackTrung = [
    {
      id: 'gia-lai-fallback',
      name: 'Xổ Số Gia Lai',
      province: 'Gia Lai',
      image: getProvinceImagePathWithMapping('Gia Lai')
    },
    {
      id: 'ninh-thuan-fallback',
      name: 'Xổ Số Ninh Thuận',
      province: 'Ninh Thuận',
      image: getProvinceImagePathWithMapping('Ninh Thuận')
    }
  ];
  
  const fallbackNam = [
    {
      id: 'binh-duong-fallback',
      name: 'Xổ Số Bình Dương',
      province: 'Bình Dương',
      image: getProvinceImagePathWithMapping('Bình Dương')
    },
    {
      id: 'tra-vinh-fallback',
      name: 'Xổ Số Trà Vinh',
      province: 'Trà Vinh',
      image: getProvinceImagePathWithMapping('Trà Vinh')
    },
    {
      id: 'vinh-long-fallback',
      name: 'Xổ Số Vĩnh Long',
      province: 'Vĩnh Long',
      image: getProvinceImagePathWithMapping('Vĩnh Long')
    }
  ];

  // Lottery regions data - Miền Bắc luôn cố định, Miền Trung và Nam thay đổi theo ngày
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
      games: selectedDayProvinces?.trung || fallbackTrung
    },
    nam: {
      name: 'Miền Nam',
      color: 'from-green-500 to-green-600', 
      games: selectedDayProvinces?.nam || fallbackNam
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

  const handleDaySelect = (dayKey) => {
    // Update selected day and refresh provinces data
    setSelectedDay(dayKey);
    // The regions will automatically update based on selectedDay
  };

  return (
    <Layout>
      <div className="md:hidden mt-0">
        {/* Back to Home Button */}
        <div className="mb-2 px-2">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Icon icon="mdi:arrow-left" className="w-5 h-5" />
            <span className="text-sm font-medium">Quay về trang chủ</span>
          </button>
        </div>
        
        <div className="h-[calc(120vh-400px)] flex flex-col">
          {/* Fixed Header Section - No Scroll */}
          <div className="flex-shrink-0">
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
          </div>
          
          {/* Scrollable Game Area - Only this section scrolls */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 px-2">
            <div className="space-y-4 pb-4">
              {/* Miền Trung Section - White Background */}
              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                <div className="text-left mb-3">
                  <span className="text-gray-600 text-sm font-semibold">Miền Trung</span>
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

               {/* Miền Nam Section - White Background */}
               <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                 <div className="text-left mb-4">
                   <span className="text-gray-600 text-sm font-semibold">Miền Nam</span>
                 </div>
                 <div className="grid grid-cols-3 gap-3">
                   {regions.nam.games.map((game) => (
                     <div
                       key={game.id}
                       className="h-24 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
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
    </Layout>
  );
};

export default MobileLotteryPage;
