import { HEADING_STYLES, BODY_STYLES } from '../../../utils/typography';

const TabPageHeader = ({ title, description }) => {
  return (
    <div>
      <h1 style={{ ...HEADING_STYLES.h2, marginBottom: '8px' }}>{title}</h1>
      <p style={{ ...BODY_STYLES.base }}>{description}</p>
    </div>
  );
};

export default TabPageHeader;
