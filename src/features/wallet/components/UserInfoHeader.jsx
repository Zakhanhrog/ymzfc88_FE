import { Card, CardContent, Avatar, Badge } from '../../../components/ui';
import { Icon } from '@iconify/react';

const UserInfoHeader = ({ userInfo, kycVerified }) => {
  return (
    <Card className="mb-6 border-0 shadow-lg bg-gradient-to-br from-green-500 via-green-600 to-green-700">
      <CardContent className="p-6">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <Avatar 
              size={80}
              icon={<Icon icon="mdi:account" />}
              className="bg-white/20 backdrop-blur-sm border-4 border-white/30 shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center">
              {kycVerified ? (
                <Icon icon="mdi:check-circle" className="w-5 h-5 text-green-600" />
              ) : (
                <Icon icon="mdi:alert-circle" className="w-5 h-5 text-amber-500" />
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-white text-2xl font-bold">
                Chào mừng, {userInfo.fullName || userInfo.username}
              </h2>
              <Badge 
                variant={kycVerified ? "default" : "destructive"}
                className={kycVerified ? "bg-green-500 hover:bg-green-600" : "bg-amber-500 hover:bg-amber-600"}
              >
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <Icon icon={kycVerified ? "mdi:check-circle" : "mdi:shield-alert"} className="w-3.5 h-3.5" />
                  <span>{kycVerified ? 'Đã xác thực' : 'Chưa xác thực'}</span>
                </div>
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-white/90 text-sm">
              <div className="flex items-center gap-2">
                <Icon icon="mdi:email" className="w-4 h-4 text-white/70" />
                <span className="font-medium">Email:</span>
                <span>{userInfo.email || 'Chưa cập nhật'}</span>
              </div>
              {userInfo.phone && (
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:phone" className="w-4 h-4 text-white/70" />
                  <span className="font-medium">SĐT:</span>
                  <span>{userInfo.phone}</span>
                </div>
              )}
              {kycVerified && userInfo.idNumber && (
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:card-account-details" className="w-4 h-4 text-white/70" />
                  <span className="font-medium">CCCD:</span>
                  <span>{userInfo.idNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfoHeader;
