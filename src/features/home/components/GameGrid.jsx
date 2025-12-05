import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Modal } from 'antd';
import { HEADING_STYLES, BUTTON_TEXT_STYLES } from '../../../utils/typography';

const GameGrid = () => {
  const [showDevModal, setShowDevModal] = useState(false);
  
  const games = [
    {
      id: 1,
      name: 'Casino',
      imageUrl: 'https://th2club.net/images/figure_39636407564188.png.avif',
      gradient: 'from-pink-400 to-red-400',
    },
    {
      id: 2,
      name: 'Đá Gà',
      imageUrl: 'https://th2club.net/images/figure_8840968486572375835.png.avif',
      gradient: 'from-pink-300 to-red-300',
    },
    {
      id: 3,
      name: 'Thể thao',
      imageUrl: 'https://th2club.net/images/figure_362857114342923387.png.avif',
      gradient: 'from-blue-400 to-cyan-400',
    },
    {
      id: 4,
      name: 'Casino 2',
      imageUrl: 'https://th2club.net/images/subclass41465988833800.png.avif',
      gradient: 'from-purple-400 to-pink-400',
    },
    {
      id: 5,
      name: 'Đá Gà 2',
      imageUrl: 'https://th2club.net/images/taixiu.png',
      gradient: 'from-green-300 to-emerald-400',
    },
    {
      id: 6,
      name: 'Game Khác',
      imageUrl: 'https://th2club.net/images/subclass6861705028422769039.png.avif',
      gradient: 'from-red-400 to-orange-400',
    },
  ];

  const handleGameClick = (gameName) => {
    setShowDevModal(true);
  };

  return (
    <div className="pt-0 pb-4 px-2">
      {/* Header with buttons */}
      <div className="flex items-center justify-between mb-4">
        {/* Left side - Title */}
        <h2 style={{ ...HEADING_STYLES.h4 }}>Phổ Biến Nhất</h2>
        
        {/* Right side - Buttons */}
        <div className="flex gap-2">
          <button 
            className="bg-gradient-to-r from-green-500 to-orange-500 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-md active:scale-95 transition-transform"
            style={{ ...BUTTON_TEXT_STYLES.small }}
          >
            <Icon icon="mdi:magnify" className="text-sm" />
            <span>MÃ DỰ THƯỞNG</span>
          </button>
        </div>
      </div>
      
      {/* Grid of games */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {games.map((game) => (
          <div
            key={game.id}
            onClick={() => handleGameClick(game.name)}
            className="rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 shadow-md"
          >
            <div className={`aspect-[4/3] bg-gradient-to-br ${game.gradient} flex items-center justify-center p-4`}>
              <img 
                src={game.imageUrl} 
                alt={game.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Modal thông báo game đang phát triển */}
      <Modal
        open={showDevModal}
        onCancel={() => setShowDevModal(false)}
        footer={null}
        centered
        width={400}
        closeIcon={<Icon icon="mdi:close" className="text-gray-500" />}
      >
        <div className="text-center py-6">
          <div className="mb-4">
            <Icon icon="mdi:hammer-wrench" className="text-6xl text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Game đang phát triển</h3>
          <p className="text-gray-600 mb-6">
            Trò chơi này đang được phát triển.<br />
            Vui lòng quay lại sau!
          </p>
          <button
            onClick={() => setShowDevModal(false)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Đã hiểu
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default GameGrid;

