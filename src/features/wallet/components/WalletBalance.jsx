import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../../../components/ui';
import { Icon } from '@iconify/react';
import { message } from '../../../utils/notification';
import Loading from '../../../components/common/Loading';
import walletService from '../services/walletService';
import pointService from '../../../services/pointService';

const WalletBalance = ({ onTabChange }) => {
  const [walletData, setWalletData] = useState(null);
  const [pointData, setPointData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    loadWalletBalance();
    loadUserPoints();
    // Get username from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserName(userData.username || userData.name || '');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
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
          <Loading />
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
        {/* Welcome/Info Card - Top of page */}
        <Card className="border border-gray-200 shadow-sm bg-white rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4">
              {/* Left Section - User Profile */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <img 
                    src="/iconacc/imgi_29_account.avif" 
                    alt="Account"
                    className="w-10 h-10"
                  />
                </div>
                <div className="flex flex-col justify-center pt-0.5">
                  <p className="text-gray-600 text-sm leading-tight mb-0.5 whitespace-nowrap">Xin chào,</p>
                  <p className="text-gray-900 text-lg font-semibold leading-tight whitespace-nowrap">{userName || 'Người dùng'}</p>
                </div>
              </div>

              {/* Right Section - Promotion Banner */}
              <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 w-1/2 ml-auto">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center justify-center flex-shrink-0">
                    <img 
                      src="/iconacc/imgi_34_wallet.svg" 
                      alt="Wallet"
                      className="w-14 h-14"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 text-base font-bold mb-0.5">Tăng Số Dư, Nâng Cơ Hội!</p>
                    <p className="text-gray-600 text-sm">Nạp ngay để nhận thưởng !</p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  className="h-11 px-6 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white font-semibold border-none flex-shrink-0"
                  onClick={() => onTabChange && onTabChange('deposit-withdraw')}
                >
                  Nạp Ngay
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Balance Card - Tinh tế, không gradient */}
        <Card className="border border-gray-200 shadow-sm bg-white rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                    <Icon icon="mdi:wallet" className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Số dư ví</p>
                    <p className="text-gray-400 text-sm">Điểm hiện tại</p>
                  </div>
                </div>
                
                <div className="flex items-baseline gap-2 mb-3">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {balanceVisible ? displayPoints.toLocaleString() : '****'}
                  </h2>
                  <span className="text-gray-500 text-base font-medium">điểm</span>
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

                <div className="flex items-center gap-4 text-gray-600 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Icon icon="mdi:arrow-up-circle" className="w-4 h-4" />
                    <span>Đã nhận: <strong className="font-semibold">{balanceVisible ? lifetimeEarned.toLocaleString() : '****'}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Icon icon="mdi:arrow-down-circle" className="w-4 h-4" />
                    <span>Đã dùng: <strong className="font-semibold">{balanceVisible ? lifetimeSpent.toLocaleString() : '****'}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default WalletBalance;
