import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { FONT_SIZE, FONT_WEIGHT } from '../../../utils/typography';

const QuickActionButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-5 px-0.5 hidden">
      <div className="flex gap-0.5 justify-between">
        {/* Nạp Tiền - Large card style */}
        <div className="flex-shrink-0 w-[78px] bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-1.5 shadow-sm active:scale-95 transition-transform duration-150">
          {/* Icon với dấu + trang trí */}
          <div className="relative mb-1">
            <div className="absolute top-0.5 left-0 text-red-300 text-[10px]">+</div>
            <div className="absolute bottom-0 left-3 text-red-200 text-[7px]">+</div>
            <div className="absolute top-1 right-0 text-red-300 text-[9px]">+</div>
            <div className="flex justify-center">
              <div className="relative w-10 h-10 bg-gradient-to-br from-red-400 to-orange-500 rounded-xl shadow-md flex items-center justify-center transform -rotate-6">
                <img src="/images/icons/icon-deposit.png" alt="Nạp Tiền" className="w-5 h-5 object-contain" />
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white text-[7px] font-bold leading-none">+</span>
                </div>
              </div>
            </div>
          </div>
          {/* Button pill */}
          <button
            onClick={() => navigate('/wallet?tab=deposit-withdraw')}
            className="w-full bg-gradient-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500 rounded-full py-0.5 px-1.5 flex items-center justify-center gap-0.5 shadow-sm transition-all"
          >
            <span className="text-white font-semibold text-[9px] whitespace-nowrap">Nạp Tiền</span>
            <div className="w-2.5 h-2.5 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
              <Icon icon="mdi:plus" className="text-white text-[7px]" />
            </div>
          </button>
        </div>

        {/* Rút Tiền - Large card style */}
        <div className="flex-shrink-0 w-[78px] bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-1.5 shadow-sm active:scale-95 transition-transform duration-150">
          {/* Icon với dấu + trang trí */}
          <div className="relative mb-1">
            <div className="absolute top-0.5 left-0 text-green-300 text-[10px]">+</div>
            <div className="absolute bottom-0 left-3 text-green-200 text-[7px]">+</div>
            <div className="absolute top-1 right-0 text-green-300 text-[9px]">+</div>
            <div className="flex justify-center">
              <div className="relative w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-md flex items-center justify-center transform rotate-6">
                <Icon icon="mdi:cash-multiple" className="text-xl text-white" />
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-600 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white text-[7px] font-bold leading-none">+</span>
                </div>
              </div>
            </div>
          </div>
          {/* Button pill */}
          <button
            onClick={() => navigate('/wallet?tab=withdraw')}
            className="w-full bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 rounded-full py-0.5 px-1.5 flex items-center justify-center gap-0.5 shadow-sm transition-all"
          >
            <span className="text-white font-semibold text-[9px] whitespace-nowrap">Rút Tiền</span>
            <div className="w-2.5 h-2.5 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
              <Icon icon="mdi:arrow-right" className="text-white text-[7px]" />
            </div>
          </button>
        </div>

        {/* Điểm danh - Simple style */}
        <button
          className="flex-shrink-0 w-[52px] active:scale-95 transition-transform duration-150 flex flex-col items-center justify-start gap-1.5"
        >
          <div className="w-11 h-11 bg-white rounded-xl shadow-sm flex items-center justify-center">
            <img src="/images/icons/sm-check.png" alt="Điểm danh" className="w-7 h-7 object-contain" />
          </div>
          <span className="text-gray-600 font-normal text-[9px] leading-tight text-center">Điểm<br/>danh</span>
        </button>

        {/* Vòng quay - Simple style */}
        <button
          className="flex-shrink-0 w-[52px] active:scale-95 transition-transform duration-150 flex flex-col items-center justify-start gap-1.5"
        >
          <div className="w-11 h-11 bg-white rounded-xl shadow-sm flex items-center justify-center">
            <img src="/images/icons/sm-wheel.png" alt="Vòng quay" className="w-7 h-7 object-contain" />
          </div>
          <span className="text-gray-600 font-normal text-[9px] leading-tight text-center">Vòng<br/>quay</span>
        </button>

        {/* VIP - Simple style */}
        <button
          className="flex-shrink-0 w-[52px] active:scale-95 transition-transform duration-150 flex flex-col items-center justify-start gap-1.5"
        >
          <div className="w-11 h-11 bg-white rounded-xl shadow-sm flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-[9px]">VIP</span>
            </div>
          </div>
          <span className="text-gray-600 font-normal text-[9px] leading-none">VIP</span>
        </button>

        {/* Mỗi Ngày - Simple style */}
        <button
          className="flex-shrink-0 w-[52px] active:scale-95 transition-transform duration-150 flex flex-col items-center justify-start gap-1.5"
        >
          <div className="w-11 h-11 bg-white rounded-xl shadow-sm flex items-center justify-center">
            <img src="/images/icons/sm-mb.webp" alt="Mỗi Ngày" className="w-7 h-7 object-contain" />
          </div>
          <span className="text-gray-600 font-normal text-[9px] leading-tight text-center">Mỗi<br/>Ngày</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActionButtons;

