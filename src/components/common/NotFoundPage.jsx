import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-black text-gray-800 mb-4">404</div>
          <div className="text-2xl font-bold text-gray-800">Trang không tồn tại</div>
        </div>


        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleGoHome}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Icon icon="mdi:home" className="w-5 h-5" />
            Về trang chủ
          </button>
          
          <button
            onClick={handleGoBack}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Icon icon="mdi:arrow-left" className="w-5 h-5" />
            Quay lại
          </button>
        </div>

      </div>
    </div>
  );
};

export default NotFoundPage;
