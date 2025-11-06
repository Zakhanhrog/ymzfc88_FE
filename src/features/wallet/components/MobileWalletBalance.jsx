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
      </div>
    </TooltipProvider>
  );
};

export default MobileWalletBalance;
