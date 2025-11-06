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

  const formatWalletBalance = (points) => {
    if (!balanceVisible) return '****';
    return points ? points.toLocaleString() + ' điểm' : '0 điểm';
  };

  const maskUsername = (username) => {
    if (!username) return '';
    if (username.length <= 4) return username;
    return username.substring(0, 4) + '****';
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
        {/* User Profile & Wallet Card - Mobile */}
        <Card className="rounded-xl bg-white border-none">
          <CardContent className="p-4">
            {/* User Profile Section */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-200 to-teal-300 flex items-center justify-center flex-shrink-0">
                <img 
                  src="/iconacc/imgi_29_account.avif" 
                  alt="Account"
                  className="w-8 h-8"
                />
              </div>
              <div className="flex-1">
                <div className="text-gray-900 text-sm font-medium mb-1">
                  {maskUsername(userName) || 'Người dùng'}
                </div>
                <div className="text-gray-700 text-xs">
                  Số dư ví: {formatWalletBalance(displayPoints)}
                </div>
              </div>
              </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => onTabChange && onTabChange('deposit-withdraw')}
                className="flex flex-col items-center gap-1.5 p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <img 
                  src="/iconacc/imgi_25_deposit.avif" 
                  alt="Deposit"
                  className="w-9 h-9"
                />
                <span className="text-xs text-gray-700 font-medium">Nạp Tiền</span>
              </button>

              <button
                onClick={() => onTabChange && onTabChange('withdraw')}
                className="flex flex-col items-center gap-1.5 p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <img 
                  src="/iconacc/imgi_26_withdraw.avif" 
                  alt="Withdraw"
                  className="w-9 h-9"
                />
                <span className="text-xs text-gray-700 font-medium">Rút Tiền</span>
              </button>

              <button
                onClick={() => onTabChange && onTabChange('account')}
                className="flex flex-col items-center gap-1.5 p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <img 
                  src="/iconacc/imgi_29_account.avif" 
                  alt="Account"
                  className="w-9 h-9"
                />
                <span className="text-xs text-gray-700 font-medium">Tài Khoản</span>
              </button>

              <button
                onClick={() => onTabChange && onTabChange('transaction-history')}
                className="flex flex-col items-center gap-1.5 p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <img 
                  src="/iconacc/imgi_28_history.avif" 
                  alt="History"
                  className="w-9 h-9"
                />
                <span className="text-xs text-gray-700 font-medium">Lịch Sử</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default MobileWalletBalance;
