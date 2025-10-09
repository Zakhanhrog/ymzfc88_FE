import { Card } from 'antd';
import { BODY_STYLES } from '../../../utils/typography';

const PlaceholderContent = ({ icon: Icon, message }) => {
  return (
    <Card>
      <div className="flex items-center justify-center h-96 text-gray-400">
        <div className="text-center">
          <Icon className="text-6xl mb-4" />
          <p style={{ ...BODY_STYLES.large }}>{message}</p>
        </div>
      </div>
    </Card>
  );
};

export default PlaceholderContent;
