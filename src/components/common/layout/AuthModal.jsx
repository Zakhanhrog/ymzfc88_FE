import { useState, useEffect } from 'react';
import { Modal } from '../../ui';
import LoginForm from '../../../features/auth/components/LoginForm';
import RegisterForm from '../../../features/auth/components/RegisterForm';

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

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      width="max-w-4xl"
      closable={true}
      maskClosable={true}
      className="min-h-[750px]"
    >
      <div className="transition-all duration-300 ease-in-out">
        {currentView === 'login' ? (
          <LoginForm 
            onClose={handleClose} 
            onSwitchToRegister={handleSwitchToRegister}
            redirectAfterLogin={redirectAfterLogin}
          />
        ) : (
          <RegisterForm 
            onClose={handleClose} 
            onSwitchToLogin={handleSwitchToLogin}
            redirectAfterLogin={redirectAfterLogin}
          />
        )}
      </div>
    </Modal>
  );
};

export default AuthModal;

