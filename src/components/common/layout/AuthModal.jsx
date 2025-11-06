import { useState, useEffect } from 'react';
import LoginForm from '../../../features/auth/components/LoginForm';
import MobileLoginForm from '../../../features/auth/components/MobileLoginForm';
import RegisterForm from '../../../features/auth/components/RegisterForm';
import MobileRegisterForm from '../../../features/auth/components/MobileRegisterForm';

const AuthModal = ({ 
  isLoginOpen, 
  isRegisterOpen, 
  onLoginClose, 
  onRegisterClose, 
  onSwitchToRegister, 
  onSwitchToLogin,
  redirectAfterLogin 
}) => {
  const [currentView, setCurrentView] = useState('login');
  
  const isOpen = isLoginOpen || isRegisterOpen;
  
  useEffect(() => {
    if (isLoginOpen) {
      setCurrentView('login');
    } else if (isRegisterOpen) {
      setCurrentView('register');
    }
  }, [isLoginOpen, isRegisterOpen]);

  const handleClose = () => {
    if (isLoginOpen) {
      onLoginClose?.();
    } else if (isRegisterOpen) {
      onRegisterClose?.();
    }
  };

  const handleSwitchToRegister = () => {
    setCurrentView('register');
    onLoginClose?.();
    onSwitchToRegister?.();
  };

  const handleSwitchToLogin = () => {
    setCurrentView('login');
    onRegisterClose?.();
    onSwitchToLogin?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-[900px] flex items-center justify-center min-h-[600px]">
        {/* Login Form with animation */}
        <div 
          className={`${
            currentView === 'login' 
              ? 'opacity-100 translate-x-0 scale-100 relative z-10' 
              : 'opacity-0 translate-x-[-20px] scale-95 pointer-events-none absolute z-0'
          } transition-all duration-300 ease-in-out flex items-center justify-center`}
        >
          {/* Desktop Login Form */}
          <div className="hidden md:block">
            <LoginForm 
              onClose={handleClose} 
              onSwitchToRegister={handleSwitchToRegister}
              redirectAfterLogin={redirectAfterLogin}
            />
          </div>
          {/* Mobile Login Form */}
          <div className="md:hidden px-4 w-full">
            <MobileLoginForm 
              onClose={handleClose} 
              onSwitchToRegister={handleSwitchToRegister}
              redirectAfterLogin={redirectAfterLogin}
            />
          </div>
        </div>

        {/* Register Form with animation */}
        <div 
          className={`${
            currentView === 'register' 
              ? 'opacity-100 translate-x-0 scale-100 relative z-10' 
              : 'opacity-0 translate-x-[20px] scale-95 pointer-events-none absolute z-0'
          } transition-all duration-300 ease-in-out flex items-center justify-center`}
        >
          {/* Desktop Register Form */}
          <div className="hidden md:block">
            <RegisterForm 
              onClose={handleClose} 
              onSwitchToLogin={handleSwitchToLogin}
              redirectAfterLogin={redirectAfterLogin}
            />
          </div>
          {/* Mobile Register Form */}
          <div className="md:hidden px-4 w-full">
            <MobileRegisterForm 
              onClose={handleClose} 
              onSwitchToLogin={handleSwitchToLogin}
              redirectAfterLogin={redirectAfterLogin}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

