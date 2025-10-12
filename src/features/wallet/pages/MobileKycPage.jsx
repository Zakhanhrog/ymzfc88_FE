import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import KycVerification from '../components/KycVerification';

const MobileKycPage = () => {
  const navigate = useNavigate();

  return (
    <div className="md:hidden fixed inset-0 z-50 bg-white overflow-y-auto">
      {/* Mobile Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 sticky top-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <Icon icon="mdi:arrow-left" className="text-gray-600 text-lg" />
          </button>
          <h1 className="text-lg font-bold text-gray-800">Xác thực tài khoản (KYC)</h1>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="p-4">
        <KycVerification />
      </div>
    </div>
  );
};

export default MobileKycPage;
