import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

const MobileDepositHeader = ({ title, backPath }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      // Quay lại trang trước đó
      window.history.back();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-[56px] bg-gray-50 border-b border-gray-200 z-20 md:hidden">
      <div className="w-full h-full flex items-center justify-between px-4">
        {/* Nút quay lại */}
        <button
          onClick={handleBack}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Icon icon="mdi:arrow-left" className="w-6 h-6 text-gray-700" />
        </button>

        {/* Tiêu đề */}
        <h1 className="flex-1 text-center text-base font-semibold text-gray-900">
          {title}
        </h1>

        {/* Spacer để căn giữa tiêu đề */}
        <div className="w-10"></div>
      </div>
    </header>
  );
};

export default MobileDepositHeader;

