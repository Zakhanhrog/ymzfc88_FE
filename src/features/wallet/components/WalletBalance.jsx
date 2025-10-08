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
  message,
  Spin
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
        // Fallback data nếu không thể tải được
        setWalletData({
          balance: 0,
          totalDeposit: 0,
          totalWithdraw: 0,
          totalBonus: 0,
          frozenAmount: 0
        });
        message.warning('Không thể tải số dữ liệu từ server, hiển thị dữ liệu mặc định');
      }
    } catch (error) {
      // Fallback data khi có lỗi
      setWalletData({
        balance: 0,
        totalDeposit: 0,
        totalWithdraw: 0,
        totalBonus: 0,
        frozenAmount: 0
      });
      message.error('Lỗi khi tải số dư ví: ' + error.message);
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
      console.error('Error loading user points:', error);
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

  if (loading && !walletData) {
    return (
      <Card style={{ textAlign: 'center', padding: '60px 0' }}>
        <Spin size="large" />
        <p style={{ marginTop: 16, color: '#666' }}>Đang tải thông tin ví...</p>
      </Card>
    );
  }

  const {
    balance = 0,
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

  const winRate = totalDeposit > 0 ? ((totalDeposit / (totalDeposit + totalWithdraw)) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-4">
      {/* Điểm  */}
      <Card
        className="shadow-sm"
        style={{
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          border: 'none'
        }}
        styles={{ body: { padding: window.innerWidth < 768 ? '20px' : '28px' } }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-orange-800/80 text-sm md:text-base font-normal mb-2">
              Điểm hiện tại
            </div>
            <div className="flex items-center gap-3">
              <span className="text-orange-900 text-2xl md:text-4xl font-bold">
                {formatPoints(totalPoints)}
              </span>
              <Tooltip title="Nạp 1.000 VNĐ = 1 điểm">
                <Button
                  type="text"
                  size="small"
                  className="text-orange-800/60 hover:text-orange-900 hover:bg-orange-900/10"
                >
                  ?
                </Button>
              </Tooltip>
            </div>
            <div className="mt-2 text-orange-800/70 text-xs">
              Đã nhận: {balanceVisible ? lifetimeEarned.toLocaleString() : '****'} |
              Đã dùng: {balanceVisible ? lifetimeSpent.toLocaleString() : '****'}
            </div>
          </div>
          <div className="hidden md:block">
            <div className="text-orange-900/40 text-5xl">
              <StarOutlined />
            </div>
          </div>
        </div>
      </Card>

      {/* Statistics - Compact Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="shadow-sm" style={{ borderRadius: '12px' }}>
          <div className="text-xs text-gray-500 mb-1">Tổng nạp</div>
          <div className="text-lg md:text-xl font-bold text-green-600 flex items-center gap-1">
            <ArrowUpOutlined className="text-sm" />
            {balanceVisible ? totalDeposit.toLocaleString() : '****'}
          </div>
        </Card>

        <Card className="shadow-sm" style={{ borderRadius: '12px' }}>
          <div className="text-xs text-gray-500 mb-1">Tổng rút</div>
          <div className="text-lg md:text-xl font-bold text-red-600 flex items-center gap-1">
            <ArrowDownOutlined className="text-sm" />
            {balanceVisible ? totalWithdraw.toLocaleString() : '****'}
          </div>
        </Card>

        <Card className="shadow-sm" style={{ borderRadius: '12px' }}>
          <div className="text-xs text-gray-500 mb-1">Tổng thưởng</div>
          <div className="text-lg md:text-xl font-bold text-blue-600 flex items-center gap-1">
            <GiftOutlined className="text-sm" />
            {balanceVisible ? totalBonus.toLocaleString() : '****'}
          </div>
        </Card>

        <Card className="shadow-sm" style={{ borderRadius: '12px' }}>
          <div className="text-xs text-gray-500 mb-1">Đang chờ</div>
          <div className="text-lg md:text-xl font-bold text-orange-500 flex items-center gap-1">
            <span className="text-sm">⏳</span>
            {balanceVisible ? frozenAmount.toLocaleString() : '****'}
          </div>
        </Card>

        <Card className="shadow-sm" style={{ borderRadius: '12px' }}>
          <div className="text-xs text-gray-500 mb-1">Điểm </div>
          <div className="text-lg md:text-xl font-bold text-yellow-600 flex items-center gap-1">
            <StarOutlined className="text-sm" />
            {balanceVisible ? totalPoints.toLocaleString() : '****'}
          </div>
        </Card>
      </div>

      {/* Quick Actions - Simple Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <Button
          type="primary"
          size="large"
          block
          icon={<ArrowUpOutlined />}
          className="h-12 font-semibold"
          style={{
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
            border: 'none'
          }}
          onClick={() => onTabChange && onTabChange('deposit-withdraw')}
        >
          Nạp tiền
        </Button>

        <Button
          size="large"
          block
          icon={<ArrowDownOutlined />}
          className="h-12 font-semibold"
          style={{
            borderRadius: '10px',
            borderColor: '#dc2626',
            color: '#dc2626',
            background: 'white'
          }}
          onClick={() => onTabChange && onTabChange('withdraw')}
        >
          Rút tiền
        </Button>

        <Button
          size="large"
          block
          icon={<StarOutlined />}
          className="h-12 font-semibold"
          style={{
            borderRadius: '10px',
            borderColor: '#FFD700',
            color: '#FF8C00',
            background: 'white'
          }}
          onClick={() => onTabChange && onTabChange('points')}
        >
          Điểm
        </Button>
      </div>
    </div>
  );
};

export default WalletBalance;