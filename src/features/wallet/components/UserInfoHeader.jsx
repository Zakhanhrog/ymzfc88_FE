import { Card, Avatar, Tag } from '../../../components/ui';
import { Icon } from '@iconify/react';

const UserInfoHeader = ({ userInfo, kycVerified }) => {
  return (
    <Card 
      className="mb-4 shadow-md bg-gradient-to-br from-red-500 to-red-600 border-none"
      bodyClassName='p-6'
    >
      <div className="flex flex-row items-center gap-4">
        {/* User Info */}
        <div className="flex items-center gap-4">
          <Avatar 
            size={80}
            icon={<Icon icon="mdi:account" />}
            className="bg-white/20 border-2 border-white/30"
          />
          <div>
            <h2 className="text-white mb-1 text-xl font-bold">
              Chào mừng, {userInfo.fullName || userInfo.username}
            </h2>
            <div className="text-white/90 space-y-0.5 text-sm">
              <div>Email: {userInfo.email}</div>
              {userInfo.phone && <div>SĐT: {userInfo.phone}</div>}
              {kycVerified && userInfo.idNumber && (
                <div>Số CCCD: {userInfo.idNumber}</div>
              )}
              {kycVerified ? (
                <Tag color="success" className="mt-1">
                  <div className="flex items-center gap-1">
                    <Icon icon="mdi:check-circle" />
                    <span>Đã xác thực</span>
                  </div>
                </Tag>
              ) : (
                <Tag color="warning" className="mt-1">
                  <div className="flex items-center gap-1">
                    <Icon icon="mdi:shield-alert" />
                    <span>Chưa xác thực</span>
                  </div>
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
