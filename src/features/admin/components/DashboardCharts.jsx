import { Card, Row, Col } from 'antd';
import { TrophyOutlined, UserOutlined } from '@ant-design/icons';
import { HEADING_STYLES, BODY_STYLES } from '../../../utils/typography';

const DashboardCharts = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={12}>
        <Card title={<span style={{ ...HEADING_STYLES.h5 }}>Biểu đồ thống kê</span>} className="h-80">
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <TrophyOutlined className="text-4xl mb-4" />
              <p style={{ ...BODY_STYLES.base }}>Biểu đồ sẽ được thêm sau</p>
            </div>
          </div>
        </Card>
      </Col>
      <Col xs={24} lg={12}>
        <Card title={<span style={{ ...HEADING_STYLES.h5 }}>Hoạt động gần đây</span>} className="h-80">
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <UserOutlined className="text-4xl mb-4" />
              <p style={{ ...BODY_STYLES.base }}>Danh sách hoạt động sẽ được thêm sau</p>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardCharts;

