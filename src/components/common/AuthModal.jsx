import { Modal } from 'antd';
import React, { useState, useEffect } from 'react';
import LoginForm from '../../features/auth/components/LoginForm';
import RegisterForm from '../../features/auth/components/RegisterForm';

const AuthModal = ({ 
  isLoginOpen, 
  isRegisterOpen, 
  onLoginClose, 
  onRegisterClose, 
  onSwitchToRegister, 
  onSwitchToLogin 
}) => {
  const [currentView, setCurrentView] = useState('login'); // 'login' hoặc 'register'
  
  const isOpen = isLoginOpen || isRegisterOpen;
  
  // Xác định view hiện tại dựa trên props
  useEffect(() => {
    if (isLoginOpen) {
      setCurrentView('login');
    } else if (isRegisterOpen) {
      setCurrentView('register');
    }
  }, [isLoginOpen, isRegisterOpen]);

  const handleClose = () => {
    // Đóng modal dựa trên props hiện tại
    if (isLoginOpen) {
      onLoginClose && onLoginClose();
    } else if (isRegisterOpen) {
      onRegisterClose && onRegisterClose();
    }
  };

  const handleSwitchToRegister = () => {
    setCurrentView('register');
    // Chuyển đổi state đúng cách
    if (onLoginClose) onLoginClose();
    if (onSwitchToRegister) onSwitchToRegister();
  };

  const handleSwitchToLogin = () => {
    setCurrentView('login');
    // Chuyển đổi state đúng cách
    if (onRegisterClose) onRegisterClose();
    if (onSwitchToLogin) onSwitchToLogin();
  };

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      width={1000}
      centered
      destroyOnClose={true}
      maskClosable={true}
      className="auth-modal"
      style={{ top: 20, minHeight: '750px' }}
      transitionName=""
      getContainer={false}
    >
      <div className="transition-all duration-300 ease-in-out">
        {currentView === 'login' ? (
          <LoginForm 
            onClose={handleClose} 
            onSwitchToRegister={handleSwitchToRegister}
          />
        ) : (
          <RegisterForm 
            onClose={handleClose} 
            onSwitchToLogin={handleSwitchToLogin}
          />
        )}
      </div>
    </Modal>
  );
};

export default AuthModal;
