import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Progress,
  Space,
  Tooltip,
  message
} from 'antd';
import {
  WalletOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  GiftOutlined,
  TrophyOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ReloadOutlined,
  StarOutlined
} from '@ant-design/icons';
import { THEME_COLORS } from '../../../utils/theme';
import { FONT_SIZE, FONT_WEIGHT, HEADING_STYLES, BODY_STYLES } from '../../../utils/typography';
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
        message.warning('Không thể tải số dữ liệu từ server, hiển thị dữ liệu mặc định');
      }
    } catch (error) {
      setWalletData({
        points: 0,
        totalDeposit: 0,
        totalWithdraw: 0,
        totalBonus: 0,
        frozenAmount: 0
      });
      message.error('Lỗi khi tải thông tin ví: ' + error.message);
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
    <div className="space-y-4">
      {/* Main Balance Card - Mobile Optimized */}
      <div
        className="rounded-2xl p-6 shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-orange-800/80 text-sm mb-2">
              Điểm hiện tại
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-orange-900 text-2xl font-bold">
                {formatPoints(displayPoints)}
              </span>
              <Tooltip title="1000 VNĐ = 1 điểm. Dùng điểm để đặt cược và rút tiền">
                <button className="w-5 h-5 bg-orange-800/20 rounded-full flex items-center justify-center text-orange-800 text-xs">
                  ?
                </button>
              </Tooltip>
            </div>
            <div className="text-orange-800/70 text-xs">
              Đã nhận: {balanceVisible ? lifetimeEarned.toLocaleString() : '****'} | 
              Đã dùng: {balanceVisible ? lifetimeSpent.toLocaleString() : '****'}
            </div>
          </div>
          <div className="text-orange-900/40 text-4xl">
            <StarOutlined />
          </div>
        </div>
      </div>

      {/* Statistics Cards - Horizontal Scroll */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        <div className="bg-white rounded-xl p-3 shadow-sm min-w-[80px] flex-shrink-0">
          <div className="text-xs text-gray-500 mb-1">Tổng nạp</div>
          <div className="text-lg font-bold text-green-600 flex items-center gap-1">
            <ArrowUpOutlined className="text-sm" />
            <span className="text-sm">{balanceVisible ? totalDeposit.toLocaleString() : '****'}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 shadow-sm min-w-[80px] flex-shrink-0">
          <div className="text-xs text-gray-500 mb-1">Tổng rút</div>
          <div className="text-lg font-bold text-red-600 flex items-center gap-1">
            <ArrowDownOutlined className="text-sm" />
            <span className="text-sm">{balanceVisible ? totalWithdraw.toLocaleString() : '****'}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 shadow-sm min-w-[80px] flex-shrink-0">
          <div className="text-xs text-gray-500 mb-1">Tổng thưởng</div>
          <div className="text-lg font-bold text-blue-600 flex items-center gap-1">
            <GiftOutlined className="text-sm" />
            <span className="text-sm">{balanceVisible ? totalBonus.toLocaleString() : '****'}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 shadow-sm min-w-[80px] flex-shrink-0">
          <div className="text-xs text-gray-500 mb-1">Đang chờ</div>
          <div className="text-lg font-bold text-orange-500 flex items-center gap-1">
            <span className="text-sm">⏳</span>
            <span className="text-sm">{balanceVisible ? frozenAmount.toLocaleString() : '****'}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 shadow-sm min-w-[80px] flex-shrink-0">
          <div className="text-xs text-gray-500 mb-1">Điểm hiện tại</div>
          <div className="text-lg font-bold text-yellow-600 flex items-center gap-1">
            <StarOutlined className="text-sm" />
            <span className="text-sm">{balanceVisible ? displayPoints.toLocaleString() : '****'}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons - Mobile Optimized */}
      <div className="grid grid-cols-3 gap-3">
        <Button
          type="primary"
          size="large"
          block
          icon={<ArrowUpOutlined />}
          className="h-12 font-semibold rounded-xl border-none"
          style={{
            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)'
          }}
          onClick={() => onTabChange && onTabChange('deposit-withdraw')}
        >
          <span className="text-sm">Nạp tiền</span>
        </Button>

        <Button
          size="large"
          block
          icon={<ArrowDownOutlined />}
          className="h-12 font-semibold rounded-xl border-2"
          style={{
            borderColor: '#dc2626',
            color: '#dc2626',
            background: 'white',
            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.1)'
          }}
          onClick={() => onTabChange && onTabChange('withdraw')}
        >
          <span className="text-sm">Rút tiền</span>
        </Button>

        <Button
          size="large"
          block
          icon={<StarOutlined />}
          className="h-12 font-semibold rounded-xl border-2"
          style={{
            borderColor: '#FFD700',
            color: '#FF8C00',
            background: 'white',
            boxShadow: '0 2px 8px rgba(255, 215, 0, 0.2)'
          }}
          onClick={() => onTabChange && onTabChange('points')}
        >
          <span className="text-sm">Điểm</span>
        </Button>
      </div>
    </div>
  );
};

export default MobileWalletBalance;
