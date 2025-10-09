import { BORDER_RADIUS, SHADOWS, TRANSITIONS } from '../../../utils/theme';

const SidebarBanner = ({ imageUrl, alt, onClick }) => {
  return (
    <div style={{ padding: '0 6px', marginBottom: '8px' }}>
      <div 
        className="relative rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
        style={{ 
          height: '60px',
          borderRadius: BORDER_RADIUS.lg,
          transition: TRANSITIONS.normal
        }}
        onClick={onClick}
      >
        <img 
          src={imageUrl}
          alt={alt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-10 hover:bg-opacity-5 transition-all duration-300"></div>
      </div>
    </div>
  );
};

export default SidebarBanner;

