import { useNavigate } from 'react-router-dom';
import { HomeOutlined, StarOutlined, GiftOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { LAYOUT } from '../../../utils/theme';

const MobileBottomNav = () => {
  const navigate = useNavigate();

  const navItems = [
    {
      key: 'home',
      icon: <HomeOutlined className="text-xl mb-1" />,
      label: 'Trang chủ',
      onClick: () => navigate('/')
    },
    {
      key: 'ae888',
      icon: <StarOutlined className="text-xl mb-1" />,
      label: 'AE888',
      onClick: () => navigate('/')
    },
    {
      key: 'promotions',
      icon: <GiftOutlined className="text-xl mb-1" />,
      label: 'Khuyến mãi',
      onClick: () => console.log('Khuyến mãi clicked')
    },
    {
      key: 'contact',
      icon: <PhoneOutlined className="text-xl mb-1" />,
      label: 'Liên hệ',
      onClick: () => console.log('Liên hệ clicked')
    },
    {
      key: 'profile',
      icon: <UserOutlined className="text-xl mb-1" />,
      label: 'Cá nhân',
      onClick: () => navigate('/wallet')
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 md:hidden">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => (
          <button 
            key={item.key}
            className="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-red-600 transition-colors"
            onClick={item.onClick}
          >
            {item.icon}
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNav;

