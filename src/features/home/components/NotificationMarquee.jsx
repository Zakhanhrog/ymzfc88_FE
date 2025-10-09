import { FONT_SIZE, FONT_WEIGHT } from '../../../utils/typography';
import { THEME_COLORS } from '../../../utils/theme';

const NotificationMarquee = ({ message }) => {
  // Default message nếu không có props
  const defaultMessage = "🎉 CHÀO MỪNG ĐẾN VỚI AE888 - NỀN TẢNG CÁ CƯỢC HÀNG ĐẦU VIỆT NAM! 🎉 TẶNG NGAY 100% TIỀN NẠP LẦN ĐẦU + 50 FREE SPIN! 🎰 ĐĂNG KÝ NGAY ĐỂ NHẬN ƯU ĐÃI ĐẶC BIỆT! 💰";
  
  const displayMessage = message || defaultMessage;
  
  return (
    <div className="w-full bg-white py-2 mb-3 overflow-hidden shadow-sm border border-red-200" style={{ borderRadius: '50px' }}>
      <div className="whitespace-nowrap animate-marquee">
        <span style={{ 
          fontSize: FONT_SIZE.xs, 
          fontWeight: FONT_WEIGHT.semibold, 
          color: THEME_COLORS.error 
        }}>
          {displayMessage}
        </span>
      </div>
    </div>
  );
};

export default NotificationMarquee;

