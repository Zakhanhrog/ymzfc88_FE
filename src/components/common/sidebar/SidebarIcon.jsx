import { Icon } from '@iconify/react';
import { THEME_COLORS } from '../../../utils/theme';

// Custom icon component - Không có background
export const CustomIcon = ({ icon, iconColor, noMargin }) => (
  <Icon 
    icon={icon} 
    style={{ 
      fontSize: '32px', 
      color: iconColor || THEME_COLORS.secondary,
      marginRight: noMargin ? '0' : '16px'
    }} 
  />
);

// Custom image icon component cho sidebar menu items
export const ImageIcon = ({ src, alt, noMargin }) => (
  <img 
    src={src}
    alt={alt}
    style={{ 
      width: '32px',
      height: '32px',
      objectFit: 'contain',
      marginRight: noMargin ? '0' : '16px'
    }} 
  />
);

