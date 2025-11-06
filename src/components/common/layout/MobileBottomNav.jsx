import { useNavigate, useLocation } from 'react-router-dom';

const MobileBottomNav = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  const navItems = [
    {
      id: 'home',
      label: 'Trang chủ',
      icon: '/iconacc/imgi_75_icon-home.avif',
      path: '/',
      isActive: location.pathname === '/',
      requiresAuth: false
    },
    {
      id: 'support',
      label: 'Hỗ trợ',
      icon: '/iconacc/imgi_76_icon-help.avif',
      path: '/contact',
      isActive: location.pathname === '/contact' || location.pathname.startsWith('/contact'),
      requiresAuth: false
    },
    {
      id: 'deposit',
      label: 'Nạp tiền',
      icon: '/iconacc/imgi_25_deposit.avif',
      path: '/wallet?tab=deposit-withdraw',
      isActive: location.pathname === '/wallet' && new URLSearchParams(location.search).get('tab') === 'deposit-withdraw',
      requiresAuth: true
    },
    {
      id: 'withdraw',
      label: 'Rút tiền',
      icon: '/iconacc/imgi_26_withdraw.avif',
      path: '/wallet?tab=withdraw',
      isActive: location.pathname === '/wallet' && new URLSearchParams(location.search).get('tab') === 'withdraw',
      requiresAuth: true
    },
    {
      id: 'account',
      label: 'Tài khoản',
      icon: '/iconacc/imgi_29_account.avif',
      path: '/account',
      isActive: location.pathname === '/account',
      requiresAuth: true
    }
  ];

  const handleNavClick = (item) => {
    if (item.path) {
      // Check if route requires authentication
      if (item.requiresAuth && !isAuthenticated()) {
        // Redirect to login page with return path
        navigate('/login', { 
          state: { 
            redirectAfterLogin: item.path
          },
          replace: false
        });
        return;
      }
      navigate(item.path);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] md:hidden bg-white border-t border-gray-200 shadow-lg">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const isActive = item.isActive;
          
          return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
              className="flex flex-col items-center justify-center flex-1 relative min-w-0 py-1 px-2 rounded-lg transition-colors"
            >
              {/* Active indicator: top border and gradient background */}
              {isActive && (
                <>
                  {/* Top border line - sát mép trên navbar */}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                  {/* Gradient background fading down */}
                  <div className="absolute inset-0 bg-gradient-to-b from-green-100/80 via-green-50/40 to-transparent rounded-lg"></div>
                </>
              )}
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                {/* Icon */}
                <div className="mb-0.5">
                    <img
                      src={item.icon}
                      alt={item.label}
                    className={`w-6 h-6 transition-all ${isActive ? 'opacity-100' : 'opacity-70'}`}
                    />
                </div>
                
                {/* Label */}
                <span className={`text-[10px] font-medium transition-colors whitespace-nowrap ${
                  isActive ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {item.label}
                </span>
              </div>
              </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
