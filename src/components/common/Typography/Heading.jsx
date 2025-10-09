import { getTypographyStyle } from '../../../utils/typography';

/**
 * Heading Component - Tiêu đề thống nhất
 * 
 * Props:
 * - level: 1-6 (h1, h2, h3, h4, h5, h6)
 * - className, style: custom styling
 */

const Heading = ({ 
  level = 1, 
  children, 
  className = '', 
  style = {},
  ...props 
}) => {
  const variant = `h${level}`;
  const typographyStyle = getTypographyStyle(variant);
  const Tag = `h${level}`;

  return (
    <Tag 
      className={className}
      style={{ ...typographyStyle, ...style }}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default Heading;

