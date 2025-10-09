import { Button } from 'antd';
import { getButtonStyle, BORDER_RADIUS } from '../../../utils/theme';

const AuthButtons = ({ isMobile, onLoginOpen, onRegisterOpen }) => {
  return (
    <div className={`flex gap-3 ${isMobile ? 'mobile-auth-buttons' : ''}`}>
      <Button 
        type="ghost" 
        onClick={onLoginOpen}
        className={`font-semibold ${isMobile ? 'px-4 py-1 h-9 text-sm' : 'px-5 py-1 h-10 text-sm'} shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105`}
        style={{
          borderRadius: BORDER_RADIUS.round,
          borderWidth: '2px',
          borderColor: '#4a5568',
          color: '#4a5568',
          backgroundColor: 'transparent'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#4a5568';
          e.currentTarget.style.color = 'white';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#4a5568';
        }}
      >
        Đăng nhập
      </Button>
      <Button 
        type="primary"
        onClick={onRegisterOpen}
        className={`text-white font-bold ${isMobile ? 'px-5 py-1 h-9 text-sm' : 'px-6 py-1 h-10 text-sm'} shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105`}
        style={{
          borderRadius: BORDER_RADIUS.round,
          borderWidth: '2px',
          ...getButtonStyle('primary')
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = getButtonStyle('primary').hover.backgroundColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = getButtonStyle('primary').backgroundColor;
        }}
      >
        Đăng ký
      </Button>
    </div>
  );
};

export default AuthButtons;

