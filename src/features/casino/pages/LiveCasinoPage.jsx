import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/common/Layout';
import MainNavigationBar from '../../home/components/MainNavigationBar';
import liveCasinoGames from '../data/liveCasinoGames';

const LiveCasinoPage = () => {
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

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleGameClick = (gameId) => {
    if (!isLoggedIn) {
      const redirectPath = `/casino/live?game=${gameId}`;

      if (isMobile) {
        navigate('/login', {
          replace: false,
          state: {
            redirectAfterLogin: redirectPath
          }
        });
      } else {
        window.dispatchEvent(
          new CustomEvent('showLoginModal', {
            detail: { redirectAfterLogin: redirectPath }
          })
        );
      }
      return;
    }
    navigate(`/casino/live/${gameId}`);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
        {/* Desktop Navigation */}
        <div className="hidden md:block mb-4">
          <MainNavigationBar />
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block space-y-8">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="hover:text-green-600 transition-colors"
            >
              Trang chủ
            </button>
            <span className="mx-2">/</span>
            <span className="text-green-600 font-medium">Casino trực tiếp</span>
          </div>

          {/* Section header */}
          <div className="flex items-center justify-between">
            <div className="pl-2 pr-6 py-2 rounded-md bg-gradient-to-r from-green-400 via-green-200 to-transparent flex items-center relative">
              <span className="absolute left-0 w-1 h-7 bg-green-300 rounded-r-md"></span>
              <span className="relative pl-1 flex items-center gap-2">
                <span className="text-xs text-white font-bold bg-red-600 px-1.5 py-0.5 rounded">LIVE</span>
                <h1 className="text-2xl font-black text-gray-800 uppercase tracking-wide" style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 900 }}>
                  Casino trực tiếp
                </h1>
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/contact')}
              className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
            >
              Cần hỗ trợ?
            </button>
          </div>

          {/* Desktop grid */}
          <div className="grid grid-cols-3 gap-6">
            {liveCasinoGames.map((game) => (
              <button
                key={game.id}
                type="button"
                onClick={() => handleGameClick(game.id)}
                className="group relative rounded-xl overflow-hidden bg-white shadow hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-[3/2] overflow-hidden bg-white">
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-[-64px] bg-white/60 backdrop-blur px-4 py-3 flex items-center justify-between text-left transition-all duration-150 ease-out group-hover:bottom-0">
                  <h2 className="text-lg font-semibold text-gray-800">{game.name}</h2>
                  <span className={`text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full shadow-sm transition-colors duration-150 ${
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
    </Layout>
  );
};

const LiveCasinoMobilePage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const syncLoginState = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    const handleLoginSuccess = () => {
      syncLoginState();
    };

    syncLoginState();
    window.addEventListener('userLoginSuccess', handleLoginSuccess);
    window.addEventListener('storage', syncLoginState);

    return () => {
      window.removeEventListener('userLoginSuccess', handleLoginSuccess);
      window.removeEventListener('storage', syncLoginState);
    };
  }, []);

  const handleGameClick = (gameId) => {
    if (!isLoggedIn) {
      navigate('/login', {
        replace: false,
        state: {
          redirectAfterLogin: `/casino/live?game=${gameId}`
        }
      });
      return;
    }
    navigate(`/casino/live/${gameId}`);
  };

  return (
    <Layout>
      <div className="md:hidden min-h-screen bg-gray-50 pb-24">
        <div className="pt-3">
          <MainNavigationBar />
        </div>
        <div className="h-[65px]" aria-hidden="true"></div>

        <div className="space-y-4">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-600">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="hover:text-green-500 transition-colors"
            >
              Trang chủ
            </button>
            <span className="mx-1">/</span>
            <span className="text-green-600 font-medium">Casino trực tiếp</span>
          </div>

          {/* Section header */}
          <div className="pl-2 pr-6 py-2 rounded-md bg-gradient-to-r from-green-400 via-green-200 to-transparent flex items-center relative">
            <span className="absolute left-0 w-1 h-5 bg-green-300 rounded-r-md"></span>
            <span className="relative pl-1 flex items-center gap-2">
              <span className="text-xs text-white font-bold bg-red-600 px-1.5 py-0.5 rounded">LIVE</span>
              <h1 className="text-base font-black text-gray-800 uppercase tracking-wide" style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 900 }}>
                Casino trực tiếp
              </h1>
            </span>
          </div>

          {/* Mobile list */}
          <div className="space-y-3">
            {liveCasinoGames.map((game) => (
              <button
                key={game.id}
                type="button"
                onClick={() => handleGameClick(game.id)}
                className="w-full rounded-xl overflow-hidden bg-white shadow-sm"
              >
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full h-auto"
                />
                <div className="px-3 py-2.5 flex items-center justify-between text-left bg-white/70 backdrop-blur-sm">
                  <h2 className="text-sm font-semibold text-gray-800 uppercase">{game.name}</h2>
                  <span className={`text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full shadow-sm ${
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
    </Layout>
  );
};

const LiveCasinoResponsivePage = () => {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile ? <LiveCasinoMobilePage /> : <LiveCasinoPage />;
};

export default LiveCasinoResponsivePage;

