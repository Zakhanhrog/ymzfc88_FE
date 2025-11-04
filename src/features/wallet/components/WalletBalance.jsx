import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, Spinner } from '../../../components/ui';
import { Icon } from '@iconify/react';
import { message } from '../../../utils/notification';
import walletService from '../services/walletService';
import pointService from '../../../services/pointService';

const WalletBalance = ({ onTabChange }) => {
  const [walletData, setWalletData] = useState(null);
  const [pointData, setPointData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);

  useEffect(() => {
    loadWalletBalance();
    loadUserPoints();
  }, []);

  const loadWalletBalance = async () => {
    try {
      setLoading(true);
      const response = await walletService.getWalletBalance();

      if (response.success) {
        setWalletData(response.data);
      } else {
        // Fallback data nếu không thể tải được - không hiển thị error cho 403
        setWalletData({
          points: 0,
          totalDeposit: 0,
          totalWithdraw: 0,
          totalBonus: 0,
          frozenAmount: 0
        });
        // Chỉ hiển thị warning nếu không phải lỗi 403
        if (response.status !== 403) {
          message.warning('Không thể tải số dữ liệu từ server, hiển thị dữ liệu mặc định');
        }
      }
    } catch (error) {
      // Fallback data khi có lỗi - không hiển thị error cho 403
      setWalletData({
        points: 0,
        totalDeposit: 0,
        totalWithdraw: 0,
        totalBonus: 0,
        frozenAmount: 0
      });
      // Chỉ hiển thị error nếu không phải lỗi permission
      if (!error.message?.includes('không có quyền') && !error.message?.includes('403')) {
        message.error('Lỗi khi tải thông tin ví: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadUserPoints = async () => {
    try {
      const response = await pointService.getMyPoints();
      if (response.success) {
        setPointData(response.data);
      } else {
        setPointData({
          totalPoints: 0,
          lifetimeEarned: 0,
          lifetimeSpent: 0
        });
      }
    } catch (error) {
      setPointData({
        totalPoints: 0,
        lifetimeEarned: 0,
        lifetimeSpent: 0
      });
    }
  };

  const onToggleBalance = () => {
    setBalanceVisible(!balanceVisible);
  };

  const formatPoints = (points) => {
    if (!balanceVisible) return '****';
    return points ? points.toLocaleString() + ' điểm' : '0 điểm';
  };

  if (loading && !walletData) {
    return (
      <Card className="text-center">
        <CardContent className="py-16">
          <Spinner size="lg" />
          <p className="mt-4 text-sm text-gray-600">Đang tải thông tin ví...</p>
        </CardContent>
      </Card>
    );
  }

  const {
    points = 0,
    totalDeposit = 0,
    totalWithdraw = 0,
    totalBonus = 0,
    frozenAmount = 0
  } = walletData || {};

  const {
    totalPoints = 0,
    lifetimeEarned = 0,
    lifetimeSpent = 0
  } = pointData || {};
  
  const displayPoints = points || totalPoints;

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Main Balance Card - Tinh tế, không gradient */}
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                    <Icon icon="mdi:wallet" className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs font-medium">Số dư ví</p>
                    <p className="text-gray-400 text-xs">Điểm hiện tại</p>
                  </div>
                </div>
                
                <div className="flex items-baseline gap-2 mb-3">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {balanceVisible ? displayPoints.toLocaleString() : '****'}
                  </h2>
                  <span className="text-gray-500 text-sm font-medium">điểm</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={onToggleBalance}
                        className="w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs flex items-center justify-center transition-all"
                      >
                        <Icon icon={balanceVisible ? "mdi:eye" : "mdi:eye-off"} className="w-3.5 h-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{balanceVisible ? 'Ẩn' : 'Hiện'} số dư</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <div className="flex items-center gap-4 text-gray-600 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Icon icon="mdi:arrow-up-circle" className="w-3.5 h-3.5" />
                    <span>Đã nhận: <strong className="font-semibold">{balanceVisible ? lifetimeEarned.toLocaleString() : '****'}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Icon icon="mdi:arrow-down-circle" className="w-3.5 h-3.5" />
                    <span>Đã dùng: <strong className="font-semibold">{balanceVisible ? lifetimeSpent.toLocaleString() : '****'}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Grid - Compact */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          <Card className="border border-gray-200 hover:shadow-sm transition-shadow bg-white">
            <CardContent className="p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-6 h-6 rounded-md bg-green-50 flex items-center justify-center">
                  <Icon icon="mdi:arrow-up" className="w-3.5 h-3.5 text-green-600" />
                </div>
              </div>
              <p className="text-gray-500 text-xs font-medium mb-0.5">Tổng nạp</p>
              <p className="text-base font-bold text-gray-900">
                {balanceVisible ? totalDeposit.toLocaleString() : '****'}
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-sm transition-shadow bg-white">
            <CardContent className="p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-6 h-6 rounded-md bg-green-50 flex items-center justify-center">
                  <Icon icon="mdi:arrow-down" className="w-3.5 h-3.5 text-green-600" />
                </div>
              </div>
              <p className="text-gray-500 text-xs font-medium mb-0.5">Tổng rút</p>
              <p className="text-base font-bold text-gray-900">
                {balanceVisible ? totalWithdraw.toLocaleString() : '****'}
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-sm transition-shadow bg-white">
            <CardContent className="p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center">
                  <Icon icon="mdi:gift" className="w-3.5 h-3.5 text-blue-600" />
                </div>
              </div>
              <p className="text-gray-500 text-xs font-medium mb-0.5">Tổng thưởng</p>
              <p className="text-base font-bold text-gray-900">
                {balanceVisible ? totalBonus.toLocaleString() : '****'}
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-sm transition-shadow bg-white">
            <CardContent className="p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-6 h-6 rounded-md bg-orange-50 flex items-center justify-center">
                  <Icon icon="mdi:clock-outline" className="w-3.5 h-3.5 text-orange-600" />
                </div>
              </div>
              <p className="text-gray-500 text-xs font-medium mb-0.5">Đang chờ</p>
              <p className="text-base font-bold text-gray-900">
                {balanceVisible ? frozenAmount.toLocaleString() : '****'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions - Compact */}
        <Card className="border border-gray-200 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-gray-900">Thao tác nhanh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                variant="primary"
                size="lg"
                className="h-11 font-semibold text-sm w-full"
                onClick={() => onTabChange && onTabChange('deposit-withdraw')}
              >
                <Icon icon="mdi:arrow-up-circle" className="w-4 h-4" />
                Nạp tiền
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-11 border-2 border-green-500 text-green-600 hover:bg-green-50 font-semibold text-sm w-full"
                onClick={() => onTabChange && onTabChange('withdraw')}
              >
                <Icon icon="mdi:arrow-down-circle" className="w-4 h-4" />
                Rút tiền
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-11 border-2 border-amber-500 text-amber-600 hover:bg-amber-50 font-semibold text-sm w-full"
                onClick={() => onTabChange && onTabChange('points')}
              >
                <Icon icon="mdi:star-circle" className="w-4 h-4" />
                Điểm thưởng
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default WalletBalance;
