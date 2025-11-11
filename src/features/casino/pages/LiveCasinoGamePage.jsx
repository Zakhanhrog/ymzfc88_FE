import { useLocation, useParams } from 'react-router-dom';
import XocDiaGamePage from './games/XocDiaGamePage';
import SicboGamePage from './games/SicboGamePage';
import SicboTableSelectionPage from './games/SicboTableSelectionPage';
import liveCasinoGames from '../data/liveCasinoGames';

const LiveCasinoGamePage = () => {
  const { gameId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tableParam = searchParams.get('table');

  switch (gameId) {
    case 'xocdia':
      return <XocDiaGamePage />;
    case 'sicbo':
      if (!tableParam) {
        return <SicboTableSelectionPage />;
      }
      return <SicboGamePage tableNumber={tableParam} />;
    default: {
      const fallbackGame = liveCasinoGames.find((game) => game.id === gameId);
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-xl w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-10 text-center space-y-4">
            <h1 className="text-2xl font-semibold text-gray-900">Đang phát triển</h1>
            <p className="text-sm text-gray-600">
              Giao diện cho bàn {fallbackGame?.name || 'Live Casino'} đang được xây dựng. Vui lòng quay lại sau.
            </p>
          </div>
        </div>
      );
    }
  }
};

export default LiveCasinoGamePage;

