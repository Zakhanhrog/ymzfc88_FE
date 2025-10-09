import { getTypographyStyle } from '../../../utils/typography';

/**
 * Text Component - Typography thống nhất
 * 
 * Variants:
 * - Headings: h1, h2, h3, h4, h5, h6
 * - Body: large, base, small
 * - Labels: label, caption, helper
 * - Menu: menuItem, menuItemActive, submenuItem
 * - Custom: menuLabel, username, balance, navButton
 */

const Text = ({ 
  variant = 'base',
  children, 
  className = '', 
  style = {},
  as = 'span',
  ...props 
}) => {
  const typographyStyle = getTypographyStyle(variant);
  const Component = as;

  return (
    <Component 
      className={className}
      style={{ ...typographyStyle, ...style }}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Text;

