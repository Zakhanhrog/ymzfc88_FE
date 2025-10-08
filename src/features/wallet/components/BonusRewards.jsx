import { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Progress,
  Tag,
  Table,
  Modal,
  Steps,
  Alert,
  Space,
  Statistic,
  Tooltip,
  Badge,
  message
} from 'antd';
import {
  GiftOutlined,
  TrophyOutlined,
  StarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  FireOutlined,
  CrownOutlined,
  HeartOutlined,
  ThunderboltOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { THEME_COLORS } from '../../../utils/theme';

const { Step } = Steps;

const BonusRewards = ({ formatCurrency }) => {
  const [activeBonus, setActiveBonus] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [claimModalVisible, setClaimModalVisible] = useState(false);

  // Mock data
  const userStats = {
    vipLevel: 'Gold',
    vipPoints: 2450,
    nextVipPoints: 5000,
    totalDeposit: 50000000,
    totalBet: 120000000,
    winRate: 68.5,
    consecutiveDays: 12
  };

  const bonusData = [
    {
      id: 1,
      type: 'daily',
      title: 'Điểm danh hàng ngày',
      description: 'Nhận  mỗi ngày đăng nhập',
      icon: <CalendarOutlined className="text-orange-500" />,
      amount: 10000,
      status: 'available',
      expiry: '23:59 hôm nay',
      conditions: 'Đăng nhập mỗi ngày',
      progress: 100,
      claimed: false,
      claimedDays: 12,
      totalDays: 30
    },
    {
      id: 2,
      type: 'deposit',
      title: ' nạp đầu',
      description: 'Thưởng 100% lần nạp đầu tiên',
      icon: <GiftOutlined className="text-green-500" />,
      amount: 1000000,
      status: 'completed',
      conditions: 'Nạp tối thiểu 100,000 VND',
      progress: 100,
      claimed: true
    },
    {
      id: 3,
      type: 'vip',
      title: 'Thưởng VIP Gold',
      description: 'Thưởng hàng tuần cho thành viên VIP',
      icon: <CrownOutlined className="text-yellow-500" />,
      amount: 500000,
      status: 'available',
      expiry: 'Chủ nhật tuần này',
      conditions: 'Đạt cấp VIP Gold',
      progress: 100,
      claimed: false
    },
    {
      id: 4,
      type: 'referral',
      title: 'Thưởng giới thiệu',
      description: 'Thưởng khi bạn bè đăng ký qua link của bạn',
      icon: <HeartOutlined className="text-pink-500" />,
      amount: 200000,
      status: 'pending',
      conditions: 'Bạn bè nạp tối thiểu 500,000 VND',
      progress: 60,
      claimed: false,
      referralCount: 3,
      targetCount: 5
    },
    {
      id: 5,
      type: 'achievement',
      title: 'Thành tích Cao thủ',
      description: 'Thưởng khi đạt tỷ lệ thắng 70%',
      icon: <TrophyOutlined className="text-blue-500" />,
      amount: 300000,
      status: 'locked',
      conditions: 'Tỷ lệ thắng ≥ 70% trong 100 ván',
      progress: 68.5,
      claimed: false
    },
    {
      id: 6,
      type: 'cashback',
      title: 'Hoàn tiền hàng ngày',
      description: 'Hoàn 5% tổng cược của ngày hôm qua',
      icon: <ThunderboltOutlined className="text-purple-500" />,
      amount: 150000,
      status: 'available',
      expiry: '12:00 ngày mai',
      conditions: 'Cược tối thiểu 1,000,000 VND/ngày',
      progress: 100,
      claimed: false,
      yesterdayBet: 3000000
    }
  ];

  const vipLevels = [
    { level: 'Bronze', minDeposit: 0, weeklyBonus: 50000, color: '#CD7F32' },
    { level: 'Silver', minDeposit: 5000000, weeklyBonus: 100000, color: '#C0C0C0' },
    { level: 'Gold', minDeposit: 20000000, weeklyBonus: 250000, color: '#FFD700' },
    { level: 'Platinum', minDeposit: 50000000, weeklyBonus: 500000, color: '#E5E4E2' },
    { level: 'Diamond', minDeposit: 100000000, weeklyBonus: 1000000, color: '#B9F2FF' },
    { level: 'VIP', minDeposit: 200000000, weeklyBonus: 2000000, color: '#FF6B6B' }
  ];

  const recentBonusHistory = [
    {
      id: 1,
      title: 'Điểm danh ngày 11',
      amount: 10000,
      type: 'daily',
      claimedAt: '2024-01-19 08:30:00',
      status: 'completed'
    },
    {
      id: 2,
      title: 'Thưởng VIP Gold tuần 3',
      amount: 500000,
      type: 'vip',
      claimedAt: '2024-01-15 00:01:00',
      status: 'completed'
    },
    {
      id: 3,
      title: 'Hoàn tiền ngày 18/01',
      amount: 120000,
      type: 'cashback',
      claimedAt: '2024-01-19 12:00:00',
      status: 'completed'
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return <Badge status="processing" text="Có thể nhận" />;
      case 'completed':
        return <Badge status="success" text="Đã nhận" />;
      case 'pending':
        return <Badge status="warning" text="Chờ điều kiện" />;
      case 'locked':
        return <Badge status="default" text="Chưa đủ điều kiện" />;
      default:
        return null;
    }
  };

  const handleClaimBonus = (bonus) => {
    setActiveBonus(bonus);
    setClaimModalVisible(true);
  };

  const handleViewDetail = (bonus) => {
    setActiveBonus(bonus);
    setDetailModalVisible(true);
  };

  const getCurrentVipLevel = () => {
    const currentLevel = vipLevels.find(level => 
      userStats.totalDeposit >= level.minDeposit
    );
    return currentLevel || vipLevels[0];
  };

  const getNextVipLevel = () => {
    const currentLevel = getCurrentVipLevel();
    const currentIndex = vipLevels.findIndex(level => level.level === currentLevel.level);
    return currentIndex < vipLevels.length - 1 ? vipLevels[currentIndex + 1] : null;
  };

  const bonusColumns = [
    {
      title: 'Loại thưởng',
      dataIndex: 'title',
      key: 'title',
      render: (title, record) => (
        <div className="flex items-center gap-3">
          <div className="text-2xl">{record.icon}</div>
          <div>
            <div className="font-semibold">{title}</div>
            <div className="text-sm text-gray-500">{record.description}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => (
        <span className="font-bold text-lg text-green-600">
          {formatCurrency(amount)}
        </span>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusBadge(status)
    },
    {
      title: 'Tiến độ',
      key: 'progress',
      render: (_, record) => (
        <div className="w-32">
          <Progress 
            percent={record.progress} 
            size="small"
            strokeColor={
              record.progress >= 100 ? '#52c41a' : 
              record.progress >= 50 ? '#faad14' : '#ff4d4f'
            }
          />
        </div>
      )
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            size="small"
            onClick={() => handleViewDetail(record)}
          >
            Chi tiết
          </Button>
          {record.status === 'available' && !record.claimed && (
            <Button 
              type="primary"
              size="small"
              onClick={() => handleClaimBonus(record)}
              style={{ 
                background: THEME_COLORS.primaryGradient,
                border: 'none'
              }}
            >
              Nhận thưởng
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* VIP Status */}
      <Card 
        className="shadow-lg"
        style={{ 
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          border: 'none'
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <div className="text-white">
              <div className="flex items-center gap-3 mb-3">
                <CrownOutlined className="text-3xl" />
                <div>
                  <h2 className="text-2xl font-bold mb-1">VIP {getCurrentVipLevel().level}</h2>
                  <p className="text-white/80">Thành viên ưu tú</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Điểm VIP hiện tại:</span>
                  <span className="font-bold">{userStats.vipPoints.toLocaleString()}</span>
                </div>
                
                {getNextVipLevel() && (
                  <>
                    <div className="flex justify-between items-center">
                      <span>Cần để lên {getNextVipLevel().level}:</span>
                      <span className="font-bold">
                        {(getNextVipLevel().minDeposit - userStats.totalDeposit).toLocaleString()} VND
                      </span>
                    </div>
                    <Progress 
                      percent={(userStats.totalDeposit / getNextVipLevel().minDeposit) * 100}
                      strokeColor="rgba(255,255,255,0.8)"
                      trailColor="rgba(255,255,255,0.2)"
                      showInfo={false}
                    />
                  </>
                )}
              </div>
            </div>
          </Col>
          
          <Col>
            <div className="text-center text-white">
              <div className="text-3xl font-bold mb-1">
                {formatCurrency(getCurrentVipLevel().weeklyBonus)}
              </div>
              <div className="text-white/80">Thưởng tuần</div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Quick Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={12} md={6}>
          <Card className="text-center shadow-md" style={{ borderRadius: '12px' }}>
            <Statistic
              title="Điểm danh liên tục"
              value={userStats.consecutiveDays}
              suffix="ngày"
              valueStyle={{ color: THEME_COLORS.primary }}
              prefix={<FireOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card className="text-center shadow-md" style={{ borderRadius: '12px' }}>
            <Statistic
              title="Tỷ lệ thắng"
              value={userStats.winRate}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card className="text-center shadow-md" style={{ borderRadius: '12px' }}>
            <Statistic
              title="Thưởng có thể nhận"
              value={bonusData.filter(b => b.status === 'available' && !b.claimed).length}
              valueStyle={{ color: '#faad14' }}
              prefix={<GiftOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card className="text-center shadow-md" style={{ borderRadius: '12px' }}>
            <Statistic
              title="Đã nhận tuần này"
              value={bonusData.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.amount, 0)}
              formatter={(value) => formatCurrency(value)}
              valueStyle={{ color: '#1890ff' }}
              prefix={<StarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Available Bonuses */}
      <Card 
        title={
          <div className="flex items-center gap-2">
            <GiftOutlined style={{ color: THEME_COLORS.primary }} />
            <span>Thưởng & Khuyến mãi</span>
          </div>
        }
        className="shadow-lg"
        style={{ borderRadius: '16px' }}
      >
        <Table
          columns={bonusColumns}
          dataSource={bonusData}
          rowKey="id"
          pagination={false}
          className="bonus-table"
        />
      </Card>

      {/* Recent Bonus History */}
      <Card 
        title="Lịch sử nhận thưởng gần đây"
        className="shadow-lg"
        style={{ borderRadius: '16px' }}
      >
        <div className="space-y-3">
          {recentBonusHistory.map((bonus) => (
            <div 
              key={bonus.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <div className="font-semibold">{bonus.title}</div>
                <div className="text-sm text-gray-500">
                  {new Date(bonus.claimedAt).toLocaleString('vi-VN')}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg text-green-600">
                  +{formatCurrency(bonus.amount)}
                </div>
                <Tag color="green" size="small">Đã nhận</Tag>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết thưởng"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={500}
      >
        {activeBonus && (
          <div className="space-y-4">
            <div className="text-center p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
              <div className="text-4xl mb-2">{activeBonus.icon}</div>
              <h3 className="text-xl font-bold mb-1">{activeBonus.title}</h3>
              <p className="text-white/80">{activeBonus.description}</p>
              <div className="text-3xl font-bold mt-3">
                {formatCurrency(activeBonus.amount)}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <strong>Điều kiện:</strong>
                <div className="text-gray-600 mt-1">{activeBonus.conditions}</div>
              </div>

              <div>
                <strong>Tiến độ:</strong>
                <Progress 
                  percent={activeBonus.progress} 
                  className="mt-2"
                  strokeColor={THEME_COLORS.primaryGradient}
                />
              </div>

              {activeBonus.expiry && (
                <div>
                  <strong>Hết hạn:</strong>
                  <span className="text-red-600 ml-2">{activeBonus.expiry}</span>
                </div>
              )}

              <div>
                <strong>Trạng thái:</strong>
                <div className="mt-1">{getStatusBadge(activeBonus.status)}</div>
              </div>
            </div>

            {activeBonus.status === 'available' && !activeBonus.claimed && (
              <Button 
                type="primary"
                block
                size="large"
                onClick={() => {
                  setDetailModalVisible(false);
                  handleClaimBonus(activeBonus);
                }}
                style={{ 
                  background: THEME_COLORS.primaryGradient,
                  border: 'none',
                  borderRadius: '8px'
                }}
              >
                Nhận thưởng ngay
              </Button>
            )}
          </div>
        )}
      </Modal>

      {/* Claim Modal */}
      <Modal
        title="Nhận thưởng"
        open={claimModalVisible}
        onCancel={() => setClaimModalVisible(false)}
        footer={null}
        width={400}
      >
        {activeBonus && (
          <div className="text-center space-y-6">
            <div className="text-6xl">{activeBonus.icon}</div>
            
            <div>
              <h3 className="text-xl font-bold mb-2">{activeBonus.title}</h3>
              <div className="text-3xl font-bold text-green-600 mb-4">
                {formatCurrency(activeBonus.amount)}
              </div>
            </div>

            <Alert
              message="Xác nhận nhận thưởng"
              description={`Bạn sẽ nhận ${formatCurrency(activeBonus.amount)} vào ví chính của mình.`}
              type="success"
              showIcon
            />

            <div className="flex gap-3">
              <Button 
                size="large"
                onClick={() => setClaimModalVisible(false)}
                className="flex-1"
              >
                Hủy
              </Button>
              <Button 
                type="primary"
                size="large"
                className="flex-1"
                onClick={() => {
                  // Giả lập nhận thưởng
                  setClaimModalVisible(false);
                  // Cập nhật trạng thái bonus
                  message.success(`Đã nhận thưởng ${formatCurrency(activeBonus.amount)} thành công!`);
                }}
                style={{ 
                  background: THEME_COLORS.primaryGradient,
                  border: 'none'
                }}
              >
                Xác nhận nhận
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <style dangerouslySetInnerHTML={{
        __html: `
          .bonus-table .ant-table-thead > tr > th {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
            border-bottom: 2px solid #e2e8f0 !important;
            font-weight: 600 !important;
          }
          
          .bonus-table .ant-table-tbody > tr:hover > td {
            background: #fafafa !important;
          }
        `
      }} />
    </div>
  );
};

export default BonusRewards;