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
  ReloadOutlined
} from '@ant-design/icons';
import { THEME_COLORS } from '../../../utils/theme';
import walletService from '../services/walletService';

const WalletBalance = ({ onTabChange }) => {
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);

  useEffect(() => {
    loadWalletBalance();
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

  const onToggleBalance = () => {
    setBalanceVisible(!balanceVisible);
  };

  const formatAmount = (amount) => {
    if (!balanceVisible) return '****';
    return amount ? amount.toLocaleString() + ' VNĐ' : '0 VNĐ';
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

  const winRate = totalDeposit > 0 ? ((totalDeposit / (totalDeposit + totalWithdraw)) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Số dư chính */}
      <Card 
        className="shadow-lg"
        style={{ 
          borderRadius: '16px',
          background: THEME_COLORS.primaryGradient,
          border: 'none'
        }}
        styles={{ body: { padding: '32px' } }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <Space direction="vertical" size="small">
              <div className="text-white/80 text-lg font-medium">
                Số dư khả dụng
              </div>
              <div className="flex items-center gap-4">
                <span className="text-white text-4xl font-bold">
                  {formatAmount(balance)}
                </span>
                <Button 
                  type="text"
                  icon={balanceVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                  onClick={onToggleBalance}
                  className="text-white/60 hover:text-white hover:bg-white/10"
                  size="large"
                />
              </div>
            </Space>
          </Col>
          <Col>
            <div className="text-white/60 text-6xl">
              <WalletOutlined />
            </div>
          </Col>
        </Row>
        
        {/* Reload button */}
        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Button 
            type="text"
            icon={<ReloadOutlined />}
            onClick={loadWalletBalance}
            loading={loading}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            Làm mới
          </Button>
        </div>
      </Card>

      {/* Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Tổng nạp"
              value={totalDeposit}
              precision={0}
              valueStyle={{ color: '#52c41a' }}
              prefix={<ArrowUpOutlined />}
              suffix="VNĐ"
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Tổng rút"
              value={totalWithdraw}
              precision={0}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<ArrowDownOutlined />}
              suffix="VNĐ"
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Tổng thưởng"
              value={totalBonus}
              precision={0}
              valueStyle={{ color: '#1890ff' }}
              prefix={<GiftOutlined />}
              suffix="VNĐ"
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Đang khóa"
              value={frozenAmount}
              precision={0}
              valueStyle={{ color: '#faad14' }}
              prefix="🔒"
              suffix="VNĐ"
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions - Chỉ giữ nạp/rút tiền */}
      <Row gutter={[16, 16]}>
        <Col xs={12}>
          <Button 
            type="primary"
            size="large"
            block
            icon={<ArrowUpOutlined />}
            className="h-16 font-semibold text-lg"
            style={{
              borderRadius: '12px',
              background: THEME_COLORS.primaryGradient,
              border: 'none'
            }}
            onClick={() => onTabChange && onTabChange('deposit-withdraw')}
          >
            Nạp tiền
          </Button>
        </Col>
        <Col xs={12}>
          <Button 
            size="large"
            block
            icon={<ArrowDownOutlined />}
            className="h-16 font-semibold text-lg"
            style={{
              borderRadius: '12px',
              borderColor: THEME_COLORS.primary,
              color: THEME_COLORS.primary
            }}
            onClick={() => onTabChange && onTabChange('deposit-withdraw')}
          >
            Rút tiền
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default WalletBalance;