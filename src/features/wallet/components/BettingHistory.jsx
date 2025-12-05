import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Tag,
  Space,
  Button,
  Select,
  Modal,
  Descriptions,
  message,
  Statistic,
  DatePicker
} from 'antd';
import {
  EyeOutlined,
  ReloadOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
  GiftOutlined
} from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { HEADING_STYLES, BODY_STYLES, FONT_SIZE, FONT_WEIGHT, TEXT_COLORS } from '../../../utils/typography';
import Loading from '../../../components/common/Loading';
import axios from 'axios';
import { calculateBetStatisticsByPeriod, getPeriodLabel } from '../../../utils/betStatisticsCalculator';

dayjs.extend(isBetween);

const BettingHistory = () => {
  const [bets, setBets] = useState([]);
  const [allBets, setAllBets] = useState([]); // Lưu tất cả bets để filter
  const [loading, setLoading] = useState(false);
  const [gameFilter, setGameFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20, // Mỗi trang 20 records
    total: 0
  });
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedBet, setSelectedBet] = useState(null);
  const [stats, setStats] = useState({
    totalBets: 0,
    totalWagered: 0,
    totalWon: 0,
    totalLost: 0
  });
  const [periodStats, setPeriodStats] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('TODAY');

  // Load betting history - chỉ load 1 lần khi mount
  useEffect(() => {
    loadBettingHistory();
  }, []); // Load 1 lần duy nhất
  
  // Filter bets khi gameFilter hoặc dateRange thay đổi
  useEffect(() => {
    filterBets();
  }, [gameFilter, dateRange, allBets]);
  
  // Tính period statistics khi allBets hoặc selectedPeriod thay đổi
  useEffect(() => {
    if (allBets.length > 0) {
      const periodStatsData = calculateBetStatisticsByPeriod(allBets, selectedPeriod);
      setPeriodStats(periodStatsData);
    }
  }, [allBets, selectedPeriod]);

  const loadBettingHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      let allBets = [];
      
      // Fetch Sicbo betting history - Load 20 items mỗi lần
      try {
        let sicboAllBets = [];
        let sicboPage = 0;
        let sicboHasMore = true;
        
        while (sicboHasMore && sicboAllBets.length < 1000) {
          const sicboResponse = await axios.get(`http://localhost:8080/api/sicbo/bets/history`, {
            params: {
              page: sicboPage,
              size: 20
            },
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (sicboResponse.data.success && sicboResponse.data.data && sicboResponse.data.data.items) {
            const sicboBets = sicboResponse.data.data.items.map(bet => ({
              ...bet,
              gameType: 'SICBO',
              gameTypeName: 'Tài xỉu',
              betAmount: bet.stake || 0,
              sessionCode: bet.sessionId ? `Session #${bet.sessionId}` : 'N/A',
              betType: bet.betCode || 'N/A',
              completedAt: bet.settledAt,
              lostAmount: (bet.status === 'LOST' || bet.status === 'LOSE') ? (bet.stake || 0) : 0,
              // Refund info đã có sẵn từ backend
              refundAmount: bet.refundAmount || 0,
              refundType: bet.refundType || null,
              refundPercentage: bet.refundPercentage || null
            }));
            sicboAllBets = [...sicboAllBets, ...sicboBets];
            sicboHasMore = sicboResponse.data.data.hasMore || false;
            sicboPage++;
          } else {
            sicboHasMore = false;
          }
        }
        
        allBets = [...allBets, ...sicboAllBets];
      } catch (error) {
        console.warn('Không thể tải lịch sử Sicbo:', error.message);
      }

      // Fetch Xoc Dia betting history - Load 20 items mỗi lần
      try {
        let xocDiaAllBets = [];
        let xocDiaPage = 0;
        let xocDiaHasMore = true;
        
        while (xocDiaHasMore && xocDiaAllBets.length < 1000) {
          const xocDiaResponse = await axios.get(`http://localhost:8080/api/xoc-dia/bets/history`, {
            params: {
              page: xocDiaPage,
              size: 20
            },
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (xocDiaResponse.data.success && xocDiaResponse.data.data && xocDiaResponse.data.data.items) {
            const xocDiaBets = xocDiaResponse.data.data.items.map(bet => ({
              ...bet,
              gameType: 'XOCDIA',
              gameTypeName: 'Xóc đĩa',
              betAmount: bet.stake || 0,
              sessionCode: bet.sessionId ? `Session #${bet.sessionId}` : 'N/A',
              betType: bet.betCode || 'N/A',
              completedAt: bet.settledAt,
              lostAmount: (bet.status === 'LOST' || bet.status === 'LOSE') ? (bet.stake || 0) : 0,
              // Refund info đã có sẵn từ backend
              refundAmount: bet.refundAmount || 0,
              refundType: bet.refundType || null,
              refundPercentage: bet.refundPercentage || null
            }));
            xocDiaAllBets = [...xocDiaAllBets, ...xocDiaBets];
            xocDiaHasMore = xocDiaResponse.data.data.hasMore || false;
            xocDiaPage++;
          } else {
            xocDiaHasMore = false;
          }
        }
        
        allBets = [...allBets, ...xocDiaAllBets];
      } catch (error) {
        console.warn('Không thể tải lịch sử Xóc Đĩa:', error.message);
      }

      // Sort by createdAt DESC
      allBets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Lưu tất cả bets vào state
      setAllBets(allBets);
      
      // Show success message
      if (allBets.length > 0) {
        message.success(`Đã tải ${allBets.length} cược`);
      } else {
        message.info('Chưa có lịch sử cược nào');
      }

    } catch (error) {
      console.error('Lỗi khi tải lịch sử cược:', error);
      message.error('Lỗi khi tải lịch sử cược: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const filterBets = () => {
    let filteredBets = [...allBets];

    // Filter by game type
    if (gameFilter !== 'ALL') {
      filteredBets = filteredBets.filter(bet => bet.gameType === gameFilter);
    }

    // Filter by date range
    if (dateRange && dateRange.length === 2) {
      const [startDate, endDate] = dateRange;
      filteredBets = filteredBets.filter(bet => {
        const betDate = dayjs(bet.createdAt);
        return betDate.isBetween(startDate, endDate, 'day', '[]');
      });
    }

    setBets(filteredBets);
    setPagination(prev => ({
      ...prev,
      current: 1,
      total: filteredBets.length
    }));
    calculateStats(filteredBets);
  };

  const calculateStats = (betsData) => {
    const totalBets = betsData.length;
    const totalWagered = betsData.reduce((sum, bet) => sum + (bet.betAmount || 0), 0);
    const totalWon = betsData
      .filter(bet => bet.status === 'WON' || bet.status === 'COMPLETED')
      .reduce((sum, bet) => sum + (bet.winAmount || 0), 0);
    const totalLost = betsData
      .filter(bet => bet.status === 'LOST' || bet.status === 'LOSE')
      .reduce((sum, bet) => sum + (bet.betAmount || 0), 0);

    setStats({
      totalBets,
      totalWagered,
      totalWon,
      totalLost
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'WON':
      case 'COMPLETED':
        return 'green';
      case 'LOST':
        return 'red';
      case 'PENDING':
        return 'orange';
      case 'CANCELLED':
      case 'REFUNDED':
        return 'gray';
      default:
        return 'blue';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'WON': return 'Thắng';
      case 'LOST': return 'Thua';
      case 'PENDING': return 'Đang chờ';
      case 'CANCELLED': return 'Đã hủy';
      case 'REFUNDED': return 'Hoàn tiền';
      case 'COMPLETED': return 'Hoàn thành';
      default: return status;
    }
  };

  // Removed emoji icons as per request

  const showBetDetail = (bet) => {
    setSelectedBet(bet);
    setDetailModalVisible(true);
  };

  const columns = [
    {
      title: <span style={{ ...HEADING_STYLES.h6 }}>Game</span>,
      dataIndex: 'gameType',
      key: 'gameType',
      render: (gameType, record) => (
        <span style={{ fontSize: FONT_SIZE.base, fontWeight: FONT_WEIGHT.medium }}>
          {record.gameTypeName}
        </span>
      ),
    },
    {
      title: <span style={{ ...HEADING_STYLES.h6 }}>Loại cược</span>,
      dataIndex: 'betType',
      key: 'betType',
      render: (betType) => <span style={{ fontSize: FONT_SIZE.sm }}>{betType}</span>,
    },
    {
      title: <span style={{ ...HEADING_STYLES.h6 }}>Số tiền cược</span>,
      dataIndex: 'betAmount',
      key: 'betAmount',
      render: (amount) => (
        <span style={{
          fontSize: FONT_SIZE.md,
          fontWeight: FONT_WEIGHT.bold,
          color: TEXT_COLORS.primary
        }}>
          {amount?.toLocaleString()} điểm
        </span>
      ),
    },
    {
      title: <span style={{ ...HEADING_STYLES.h6 }}>Tiền thắng</span>,
      dataIndex: 'winAmount',
      key: 'winAmount',
      render: (amount, record) => (
        <span style={{
          fontSize: FONT_SIZE.md,
          fontWeight: FONT_WEIGHT.bold,
          color: (record.status === 'WON' || record.status === 'COMPLETED') && amount > 0 ? '#52c41a' : '#999'
        }}>
          {amount > 0 ? `+${amount?.toLocaleString()}` : '0'} điểm
        </span>
      ),
    },
    {
      title: <span style={{ ...HEADING_STYLES.h6 }}>Tiền thua</span>,
      dataIndex: 'lostAmount',
      key: 'lostAmount',
      render: (amount, record) => {
        const lostAmount = (record.status === 'LOST' || record.status === 'LOSE') ? (record.betAmount || 0) : 0;
        return (
          <span style={{
            fontSize: FONT_SIZE.md,
            fontWeight: FONT_WEIGHT.bold,
            color: lostAmount > 0 ? '#ff4d4f' : '#999'
          }}>
            {lostAmount > 0 ? `-${lostAmount?.toLocaleString()}` : '0'} điểm
          </span>
        );
      },
    },
    {
      title: <span style={{ ...HEADING_STYLES.h6 }}>Hoàn tiền</span>,
      dataIndex: 'refundAmount',
      key: 'refundAmount',
      render: (refundAmount, record) => {
        if (!refundAmount || refundAmount === 0) {
          return <span style={{ fontSize: FONT_SIZE.sm, color: '#999' }}>-</span>;
        }
        
        let refundLabel = '';
        if (record.refundType === 'FULL_REFUND') {
          refundLabel = ' (100%)';
        } else if (record.refundType === 'WIN_PERCENT') {
          refundLabel = ` (${record.refundPercentage}% thắng)`;
        } else if (record.refundType === 'LOSS_PERCENT') {
          refundLabel = ` (${record.refundPercentage}% thua)`;
        }
        
        return (
          <span style={{
            fontSize: FONT_SIZE.md,
            fontWeight: FONT_WEIGHT.bold,
            color: '#52c41a'
          }}>
            +{refundAmount?.toLocaleString()} điểm
            <span style={{ fontSize: FONT_SIZE.xs, color: '#888', fontWeight: FONT_WEIGHT.normal }}>
              {refundLabel}
            </span>
          </span>
        );
      },
    },
    {
      title: <span style={{ ...HEADING_STYLES.h6 }}>Trạng thái</span>,
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)} style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium }}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: <span style={{ ...HEADING_STYLES.h6 }}>Thời gian</span>,
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => <span style={{ fontSize: FONT_SIZE.sm }}>{dayjs(date).format('DD/MM/YYYY HH:mm')}</span>,
    },
    {
      title: <span style={{ ...HEADING_STYLES.h6 }}>Hành động</span>,
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => showBetDetail(record)}
          style={{ fontSize: FONT_SIZE.base }}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Period Statistics Card */}
      {periodStats && (
        <Card className="shadow-sm" style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <div className="flex items-center justify-between mb-4">
            <span style={{ ...HEADING_STYLES.h5, marginBottom: 0, color: 'white' }}>
              📊 Thống kê theo kỳ
            </span>
            <Select
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              style={{ width: 180 }}
            >
              <Option value="TODAY">Hôm nay</Option>
              <Option value="YESTERDAY">Hôm qua</Option>
              <Option value="THIS_WEEK">Tuần này</Option>
              <Option value="THIS_MONTH">Tháng này</Option>
              <Option value="LAST_MONTH">Tháng trước</Option>
            </Select>
          </div>
          
          <div className="grid grid-cols-6 gap-4">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3 text-center">
              <TrophyOutlined style={{ fontSize: '24px', color: '#ffd700' }} />
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: FONT_SIZE.xs, marginTop: '8px' }}>Tổng cược</div>
              <div style={{ color: 'white', fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold, marginTop: '4px' }}>
                {periodStats.totalBets}
              </div>
            </div>
            
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3 text-center">
              <DollarOutlined style={{ fontSize: '24px', color: '#ff9500' }} />
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: FONT_SIZE.xs, marginTop: '8px' }}>Tiền cược</div>
              <div style={{ color: 'white', fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, marginTop: '4px' }}>
                {periodStats.totalWagered.toLocaleString()}
              </div>
            </div>
            
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3 text-center">
              <RiseOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: FONT_SIZE.xs, marginTop: '8px' }}>Tổng thắng</div>
              <div style={{ color: '#52c41a', fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, marginTop: '4px' }}>
                {periodStats.totalWon.toLocaleString()}
              </div>
            </div>
            
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3 text-center">
              <FallOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: FONT_SIZE.xs, marginTop: '8px' }}>Tổng thua</div>
              <div style={{ color: '#ff4d4f', fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, marginTop: '4px' }}>
                {periodStats.totalLost.toLocaleString()}
              </div>
            </div>
            
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3 text-center">
              <GiftOutlined style={{ fontSize: '24px', color: '#13c2c2' }} />
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: FONT_SIZE.xs, marginTop: '8px' }}>Hoàn tiền</div>
              <div style={{ color: '#13c2c2', fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, marginTop: '4px' }}>
                {periodStats.totalRefund.toLocaleString()}
              </div>
            </div>
            
            <div className={`bg-white bg-opacity-30 backdrop-blur-sm rounded-lg p-3 text-center border-2 ${periodStats.netProfit >= 0 ? 'border-green-400' : 'border-red-400'}`}>
              <div style={{ fontSize: '24px' }}>{periodStats.netProfit >= 0 ? '📈' : '📉'}</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: FONT_SIZE.xs, marginTop: '8px' }}>Lãi/Lỗ</div>
              <div style={{ 
                color: periodStats.netProfit >= 0 ? '#52c41a' : '#ff4d4f', 
                fontSize: FONT_SIZE.lg, 
                fontWeight: FONT_WEIGHT.bold,
                marginTop: '4px'
              }}>
                {periodStats.netProfit >= 0 ? '+' : ''}{periodStats.netProfit.toLocaleString()}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <Card className="shadow-sm" style={{ borderRadius: '12px' }}>
          <div style={{ fontSize: FONT_SIZE.xs, color: TEXT_COLORS.secondary, marginBottom: '4px' }}>Tổng số cược</div>
          <div className="text-blue-600 flex items-center gap-1" style={{ fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold }}>
            <TrophyOutlined style={{ fontSize: FONT_SIZE.sm }} />
            {stats.totalBets}
          </div>
        </Card>

        <Card className="shadow-sm" style={{ borderRadius: '12px' }}>
          <div style={{ fontSize: FONT_SIZE.xs, color: TEXT_COLORS.secondary, marginBottom: '4px' }}>Tổng tiền cược</div>
          <div className="text-orange-600 flex items-center gap-1" style={{ fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold }}>
            💰
            {stats.totalWagered.toLocaleString()}
          </div>
        </Card>

        <Card className="shadow-sm" style={{ borderRadius: '12px' }}>
          <div style={{ fontSize: FONT_SIZE.xs, color: TEXT_COLORS.secondary, marginBottom: '4px' }}>Tổng thắng</div>
          <div className="text-green-600 flex items-center gap-1" style={{ fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold }}>
            <CheckCircleOutlined style={{ fontSize: FONT_SIZE.sm }} />
            {stats.totalWon.toLocaleString()}
          </div>
        </Card>

        <Card className="shadow-sm" style={{ borderRadius: '12px' }}>
          <div style={{ fontSize: FONT_SIZE.xs, color: TEXT_COLORS.secondary, marginBottom: '4px' }}>Tổng thua</div>
          <div className="text-red-600 flex items-center gap-1" style={{ fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold }}>
            <CloseCircleOutlined style={{ fontSize: FONT_SIZE.sm }} />
            {stats.totalLost.toLocaleString()}
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-sm" style={{ borderRadius: '12px' }}>
        <div className="flex gap-3 items-center flex-wrap" style={{ marginBottom: 16 }}>
          <Select
            value={gameFilter}
            onChange={setGameFilter}
            style={{ width: 200, height: 40 }}
            placeholder="Chọn game"
            size="large"
          >
            <Option value="ALL">Tất cả game</Option>
            <Option value="SICBO">Tài xỉu</Option>
            <Option value="XOCDIA">Xóc đĩa</Option>
          </Select>
          <RangePicker
            value={dateRange}
            onChange={setDateRange}
            placeholder={['Từ ngày', 'Đến ngày']}
            format="DD/MM/YYYY"
            size="large"
            style={{ height: 40, minWidth: 260 }}
            allowClear
          />
          <button 
            onClick={loadBettingHistory}
            className="flex items-center justify-center gap-2 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 font-semibold shadow-md rounded-lg cursor-pointer"
            style={{ 
              height: 40, 
              minWidth: 120,
              background: 'linear-gradient(to right, rgb(34, 197, 94), rgb(5, 150, 105))'
            }}
          >
            <ReloadOutlined style={{ fontSize: '16px' }} />
            Làm mới
          </button>
        </div>
      </Card>

      {/* Table */}
      <Card className="shadow-sm" style={{ borderRadius: '12px' }}>
        {loading ? (
          <Loading />
        ) : bets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.medium, color: TEXT_COLORS.primary, marginBottom: '8px' }}>
              Chưa có lịch sử cược
            </div>
            <div style={{ fontSize: FONT_SIZE.base, color: TEXT_COLORS.secondary }}>
              Hãy tham gia chơi game để xem lịch sử cược của bạn tại đây
            </div>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={bets}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => (
                <span style={{ fontSize: FONT_SIZE.sm }}>
                  {`${range[0]}-${range[1]} của ${total} cược`}
                </span>
              ),
            }}
            rowKey="id"
            onChange={(newPagination) => setPagination({
              ...pagination,
              current: newPagination.current,
              pageSize: newPagination.pageSize
            })}
            scroll={{ x: 1200 }}
          />
        )}
      </Card>

      {/* Detail Modal */}
      <Modal
        title={<span style={{ ...HEADING_STYLES.h4 }}>Chi tiết cược</span>}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)} style={{ fontSize: FONT_SIZE.base }}>
            Đóng
          </Button>
        ]}
        width={700}
      >
        {selectedBet && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label={<span style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium }}>Mã cược</span>}>
              <span style={{ fontFamily: 'monospace', fontSize: FONT_SIZE.sm }}>{selectedBet.betCode}</span>
            </Descriptions.Item>
            <Descriptions.Item label={<span style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium }}>Game</span>}>
              <span style={{ fontSize: FONT_SIZE.base, fontWeight: FONT_WEIGHT.medium }}>
                {selectedBet.gameTypeName}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label={<span style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium }}>Loại cược</span>}>
              <span style={{ fontSize: FONT_SIZE.base }}>{selectedBet.betType}</span>
            </Descriptions.Item>
            <Descriptions.Item label={<span style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium }}>Phiên</span>}>
              <span style={{ fontFamily: 'monospace', fontSize: FONT_SIZE.sm }}>{selectedBet.sessionCode}</span>
            </Descriptions.Item>
            <Descriptions.Item label={<span style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium }}>Kết quả</span>}>
              <span style={{ fontFamily: 'monospace', fontSize: FONT_SIZE.sm }}>{selectedBet.resultCode || 'Chưa có'}</span>
            </Descriptions.Item>
            <Descriptions.Item label={<span style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium }}>Số tiền cược</span>}>
              <span style={{ fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold }}>
                {selectedBet.betAmount?.toLocaleString()} điểm
              </span>
            </Descriptions.Item>
            <Descriptions.Item label={<span style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium }}>Tiền thắng</span>}>
              <span style={{
                fontSize: FONT_SIZE.md,
                fontWeight: FONT_WEIGHT.bold,
                color: selectedBet.winAmount > 0 ? '#52c41a' : '#999'
              }}>
                {selectedBet.winAmount > 0 ? `+${selectedBet.winAmount?.toLocaleString()}` : '0'} điểm
              </span>
            </Descriptions.Item>
            <Descriptions.Item label={<span style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium }}>Tiền thua</span>}>
              <span style={{
                fontSize: FONT_SIZE.md,
                fontWeight: FONT_WEIGHT.bold,
                color: (selectedBet.status === 'LOST' || selectedBet.status === 'LOSE') ? '#ff4d4f' : '#999'
              }}>
                {(selectedBet.status === 'LOST' || selectedBet.status === 'LOSE') ? `-${selectedBet.betAmount?.toLocaleString()}` : '0'} điểm
              </span>
            </Descriptions.Item>
            {selectedBet.refundAmount > 0 && (
              <Descriptions.Item label={<span style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium }}>Hoàn tiền</span>}>
                <span style={{
                  fontSize: FONT_SIZE.md,
                  fontWeight: FONT_WEIGHT.bold,
                  color: '#52c41a'
                }}>
                  +{selectedBet.refundAmount?.toLocaleString()} điểm
                  {selectedBet.refundType === 'FULL_REFUND' && (
                    <span style={{ fontSize: FONT_SIZE.xs, color: '#888', fontWeight: FONT_WEIGHT.normal }}>
                      {' '}(Hoàn tiền 100%)
                    </span>
                  )}
                  {selectedBet.refundType === 'WIN_PERCENT' && (
                    <span style={{ fontSize: FONT_SIZE.xs, color: '#888', fontWeight: FONT_WEIGHT.normal }}>
                      {' '}(Hoàn {selectedBet.refundPercentage}% khi thắng)
                    </span>
                  )}
                  {selectedBet.refundType === 'LOSS_PERCENT' && (
                    <span style={{ fontSize: FONT_SIZE.xs, color: '#888', fontWeight: FONT_WEIGHT.normal }}>
                      {' '}(Hoàn {selectedBet.refundPercentage}% khi thua)
                    </span>
                  )}
                </span>
              </Descriptions.Item>
            )}
            <Descriptions.Item label={<span style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium }}>Trạng thái</span>}>
              <Tag color={getStatusColor(selectedBet.status)} style={{ fontSize: FONT_SIZE.sm }}>
                {getStatusText(selectedBet.status)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={<span style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium }}>Thời gian đặt cược</span>}>
              <span style={{ fontSize: FONT_SIZE.base }}>{dayjs(selectedBet.createdAt).format('DD/MM/YYYY HH:mm:ss')}</span>
            </Descriptions.Item>
            {selectedBet.completedAt && (
              <Descriptions.Item label={<span style={{ fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium }}>Thời gian hoàn thành</span>}>
                <span style={{ fontSize: FONT_SIZE.base }}>{dayjs(selectedBet.completedAt).format('DD/MM/YYYY HH:mm:ss')}</span>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default BettingHistory;

