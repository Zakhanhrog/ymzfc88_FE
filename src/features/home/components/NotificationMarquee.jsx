import { FONT_SIZE, FONT_WEIGHT } from '../../../utils/typography';
import { THEME_COLORS } from '../../../utils/theme';

const NotificationMarquee = ({ message }) => {
  return (
    <div className="w-full bg-white py-2 mb-3 overflow-hidden shadow-sm border border-red-200" style={{ borderRadius: '50px' }}>
      <div className="whitespace-nowrap animate-marquee">
        <span style={{ 
          fontSize: FONT_SIZE.xs, 
          fontWeight: FONT_WEIGHT.semibold, 
          color: THEME_COLORS.error 
        }}>
          {message}
        </span>
      </div>
    </div>
  );
};

export default NotificationMarquee;

