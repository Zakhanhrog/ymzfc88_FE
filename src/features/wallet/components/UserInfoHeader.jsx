import { Card, Avatar, Tag } from 'antd';
import { UserOutlined, CheckCircleOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { HEADING_STYLES, FONT_SIZE, FONT_WEIGHT } from '../../../utils/typography';

const UserInfoHeader = ({ userInfo, kycVerified }) => {
  return (
    <Card 
      className="mb-4 shadow-md"
      style={{ 
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        border: 'none'
      }}
      styles={{ body: { padding: window.innerWidth < 768 ? '16px' : '24px' } }}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* User Info */}
        <div className="flex items-center gap-3 md:gap-4">
          <Avatar 
            size={window.innerWidth < 768 ? 60 : 80}
            icon={<UserOutlined />} 
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.2)',
              border: '2px solid rgba(255,255,255,0.3)'
            }}
          />
          <div>
            <h2 className="text-white mb-1" style={{ fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold }}>
              Chào mừng, {userInfo.fullName || userInfo.username}
            </h2>
            <div className="text-white/90 space-y-0.5" style={{ fontSize: FONT_SIZE.sm }}>
              <div>Email: {userInfo.email}</div>
              {userInfo.phone && <div>SĐT: {userInfo.phone}</div>}
              {kycVerified && userInfo.idNumber && (
                <div>Số CCCD: {userInfo.idNumber}</div>
              )}
              {kycVerified ? (
                <Tag color="green" className="mt-1" style={{ fontSize: FONT_SIZE.xs }}>
                  <CheckCircleOutlined /> Đã xác thực
                </Tag>
              ) : (
                <Tag color="orange" className="mt-1" style={{ fontSize: FONT_SIZE.xs }}>
                  <SafetyCertificateOutlined /> Chưa xác thực
                </Tag>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UserInfoHeader;
