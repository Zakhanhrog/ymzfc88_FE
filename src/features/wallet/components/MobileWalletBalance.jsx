import React, { useState, useEffect } from 'react';
import { Card, CardContent, Button, Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../../../components/ui';
import { Icon } from '@iconify/react';
import { message } from '../../../utils/notification';
import walletService from '../services/walletService';
import pointService from '../../../services/pointService';

const MobileWalletBalance = ({ onTabChange }) => {
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

  const formatAmount = (amount) => {
    if (!balanceVisible) return '****';
    return amount ? amount.toLocaleString() + ' VNĐ' : '0 VNĐ';
  };

  const formatPoints = (points) => {
    if (!balanceVisible) return '****';
    return points ? points.toLocaleString() + ' điểm' : '0 điểm';
  };

  // Remove loading state, always show content with fallback data

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
        {/* Main Balance Card - Mobile Optimized */}
        <Card className="rounded-xl p-5 shadow-lg bg-gradient-to-br from-yellow-400 to-orange-500 border-none">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-orange-900/80 text-sm font-medium mb-2">
                  Điểm hiện tại
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-orange-900 text-xl font-bold">
                    {formatPoints(displayPoints)}
                  </span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="w-5 h-5 bg-orange-900/20 hover:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-900 text-xs font-medium transition-colors">
                        ?
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">1000 VNĐ = 1 điểm. Dùng điểm để đặt cược và rút tiền</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="text-orange-900/80 text-xs">
                  Đã nhận: {balanceVisible ? lifetimeEarned.toLocaleString() : '****'} | 
                  Đã dùng: {balanceVisible ? lifetimeSpent.toLocaleString() : '****'}
                </div>
              </div>
              <div className="text-orange-900/30">
                <Icon icon="mdi:star" className="w-10 h-10" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards - Horizontal Scroll */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          <Card className="bg-white rounded-xl shadow-sm min-w-[80px] flex-shrink-0">
            <CardContent className="p-3">
              <div className="text-xs text-gray-500 mb-1">Tổng nạp</div>
              <div className="text-lg font-bold text-green-600 flex items-center gap-1">
                <Icon icon="mdi:arrow-up" className="w-4 h-4" />
                <span className="text-sm">{balanceVisible ? totalDeposit.toLocaleString() : '****'}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl shadow-sm min-w-[80px] flex-shrink-0">
            <CardContent className="p-3">
              <div className="text-xs text-gray-500 mb-1">Tổng rút</div>
              <div className="text-lg font-bold text-green-600 flex items-center gap-1">
                <Icon icon="mdi:arrow-down" className="w-4 h-4" />
                <span className="text-sm">{balanceVisible ? totalWithdraw.toLocaleString() : '****'}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl shadow-sm min-w-[80px] flex-shrink-0">
            <CardContent className="p-3">
              <div className="text-xs text-gray-500 mb-1">Tổng thưởng</div>
              <div className="text-lg font-bold text-blue-600 flex items-center gap-1">
                <Icon icon="mdi:gift" className="w-4 h-4" />
                <span className="text-sm">{balanceVisible ? totalBonus.toLocaleString() : '****'}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl shadow-sm min-w-[80px] flex-shrink-0">
            <CardContent className="p-3">
              <div className="text-xs text-gray-500 mb-1">Đang chờ</div>
              <div className="text-lg font-bold text-orange-500 flex items-center gap-1">
                <Icon icon="mdi:clock-outline" className="w-4 h-4" />
                <span className="text-sm">{balanceVisible ? frozenAmount.toLocaleString() : '****'}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl shadow-sm min-w-[80px] flex-shrink-0">
            <CardContent className="p-3">
              <div className="text-xs text-gray-500 mb-1">Điểm hiện tại</div>
              <div className="text-lg font-bold text-yellow-600 flex items-center gap-1">
                <Icon icon="mdi:star" className="w-4 h-4" />
                <span className="text-sm">{balanceVisible ? displayPoints.toLocaleString() : '****'}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons - Mobile Optimized */}
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="primary"
            size="lg"
            className="h-12 font-semibold rounded-xl w-full"
            onClick={() => onTabChange && onTabChange('deposit-withdraw')}
          >
            <Icon icon="mdi:arrow-up" className="w-4 h-4" />
            <span className="text-sm">Nạp tiền</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-12 font-semibold rounded-xl border-2 border-green-600 text-green-600 hover:bg-green-50 w-full"
            onClick={() => onTabChange && onTabChange('withdraw')}
          >
            <Icon icon="mdi:arrow-down" className="w-4 h-4" />
            <span className="text-sm">Rút tiền</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-12 font-semibold rounded-xl border-2 border-yellow-500 text-orange-600 hover:bg-yellow-50 w-full"
            onClick={() => onTabChange && onTabChange('points')}
          >
            <Icon icon="mdi:star" className="w-4 h-4" />
            <span className="text-sm">Điểm</span>
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default MobileWalletBalance;
