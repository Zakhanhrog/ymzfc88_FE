import React, { useState, useEffect } from 'react';
import {
  Tag,
  Button,
  Select,
  Modal,
  message,
  DatePicker
} from 'antd';
import {
  EyeOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import Loading from '../../../components/common/Loading';
import axios from 'axios';
import { calculateBetStatisticsByPeriod, getPeriodLabel } from '../../../utils/betStatisticsCalculator';

dayjs.extend(isBetween);

const { Option } = Select;
const { RangePicker } = DatePicker;

const MobileBettingHistory = () => {
  const [bets, setBets] = useState([]);
  const [allBets, setAllBets] = useState([]); // Lưu tất cả bets để filter
  const [loading, setLoading] = useState(false);
  const [gameFilter, setGameFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState(null);
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
  }, []);
  
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

  return (
    <div className="space-y-4">
      {/* Period Statistics Card - Mobile */}
      {periodStats && (
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl p-4 shadow-lg mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-white">📊 Thống kê theo kỳ</span>
            <Select
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              className="flex-1 ml-2"
              size="small"
              style={{ maxWidth: '140px' }}
            >
              <Option value="TODAY">Hôm nay</Option>
              <Option value="YESTERDAY">Hôm qua</Option>
              <Option value="THIS_WEEK">Tuần này</Option>
              <Option value="THIS_MONTH">Tháng này</Option>
              <Option value="LAST_MONTH">Tháng trước</Option>
            </Select>
          </div>
          
          {/* Period Stats Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-2 border border-white border-opacity-30">
              <div className="text-xs text-white text-opacity-80 mb-1">🏆 Tổng cược</div>
              <div className="text-yellow-300 font-bold text-lg">{periodStats.totalBets}</div>
            </div>
            
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-2 border border-white border-opacity-30">
              <div className="text-xs text-white text-opacity-80 mb-1">💰 Tiền cược</div>
              <div className="text-orange-300 font-bold text-sm">{periodStats.totalWagered.toLocaleString()}</div>
            </div>
            
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-2 border border-white border-opacity-30">
              <div className="text-xs text-white text-opacity-80 mb-1">📈 Tổng thắng</div>
              <div className="text-green-300 font-bold text-sm">{periodStats.totalWon.toLocaleString()}</div>
            </div>
            
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-2 border border-white border-opacity-30">
              <div className="text-xs text-white text-opacity-80 mb-1">📉 Tổng thua</div>
              <div className="text-red-300 font-bold text-sm">{periodStats.totalLost.toLocaleString()}</div>
            </div>
            
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-2 border border-white border-opacity-30">
              <div className="text-xs text-white text-opacity-80 mb-1">🎁 Hoàn tiền</div>
              <div className="text-cyan-300 font-bold text-sm">{periodStats.totalRefund.toLocaleString()}</div>
            </div>
            
            <div className={`bg-white bg-opacity-30 backdrop-blur-sm rounded-lg p-2 border-2 ${periodStats.netProfit >= 0 ? 'border-green-300' : 'border-red-300'}`}>
              <div className="text-xs text-white text-opacity-80 mb-1">{periodStats.netProfit >= 0 ? '💹' : '📊'} Lãi/Lỗ</div>
              <div className={`font-bold text-sm ${periodStats.netProfit >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                {periodStats.netProfit >= 0 ? '+' : ''}{periodStats.netProfit.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards - Mobile */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-white rounded-xl p-3 shadow-sm">
          <div className="text-xs text-gray-500 mb-1">Tổng số cược</div>
          <div className="text-blue-600 flex items-center gap-1 text-base font-bold">
            {stats.totalBets}
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 shadow-sm">
          <div className="text-xs text-gray-500 mb-1">Tổng tiền cược</div>
          <div className="text-orange-600 flex items-center gap-1 text-base font-bold">
            {stats.totalWagered.toLocaleString()}
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 shadow-sm">
          <div className="text-xs text-gray-500 mb-1">Tổng thắng</div>
          <div className="text-green-600 flex items-center gap-1 text-base font-bold">
            <CheckCircleOutlined className="text-sm" />
            {stats.totalWon.toLocaleString()}
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 shadow-sm">
          <div className="text-xs text-gray-500 mb-1">Tổng thua</div>
          <div className="text-red-600 flex items-center gap-1 text-base font-bold">
            <CloseCircleOutlined className="text-sm" />
            {stats.totalLost.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-3 shadow-sm space-y-2">
        <div className="flex gap-2 items-center">
          <Select
            value={gameFilter}
            onChange={setGameFilter}
            className="flex-1"
            placeholder="Chọn game"
            size="large"
            style={{ height: 40 }}
          >
            <Option value="ALL">Tất cả game</Option>
            <Option value="SICBO">Tài xỉu</Option>
            <Option value="XOCDIA">Xóc đĩa</Option>
          </Select>
          <button 
            onClick={loadBettingHistory}
            className="flex items-center justify-center gap-1 px-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 font-medium shadow-md rounded-lg cursor-pointer text-sm"
            style={{ 
              height: 40, 
              minWidth: 100,
              background: 'linear-gradient(to right, rgb(34, 197, 94), rgb(5, 150, 105))',
              fontSize: '14px'
            }}
          >
            <ReloadOutlined style={{ fontSize: '14px' }} />
            Làm mới
          </button>
        </div>
        <RangePicker
          value={dateRange}
          onChange={setDateRange}
          placeholder={['Từ ngày', 'Đến ngày']}
          format="DD/MM/YYYY"
          size="large"
          style={{ width: '100%', height: 40 }}
          allowClear
        />
      </div>

      {/* Betting List - Mobile Optimized */}
      {loading ? (
        <div className="bg-white rounded-xl p-8 shadow-sm text-center">
          <Loading />
        </div>
      ) : bets.length === 0 ? (
        <div className="bg-white rounded-xl p-8 shadow-sm text-center">
          <p className="text-gray-500 text-sm">Chưa có lịch sử cược</p>
          <p className="text-gray-400 text-xs mt-1">Hãy tham gia chơi game để xem lịch sử cược</p>
        </div>
      ) : (
        <div className="space-y-2">
          {bets.map((bet) => {
            const lostAmount = (bet.status === 'LOST' || bet.status === 'LOSE') ? (bet.betAmount || 0) : 0;
            return (
              <div key={bet.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{bet.gameTypeName}</span>
                  </div>
                  <Tag color={getStatusColor(bet.status)} className="text-xs">
                    {getStatusText(bet.status)}
                  </Tag>
                </div>
                
                <div className="mb-2">
                  <div className="text-xs text-gray-500 mb-1">Loại cược</div>
                  <div className="text-sm font-medium">{bet.betType}</div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-2 text-xs">
                  <div>
                    <div className="text-gray-500">Cược</div>
                    <div className="font-bold text-gray-900">{bet.betAmount?.toLocaleString()} điểm</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Thắng</div>
                    <div className={`font-bold ${bet.winAmount > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                      {bet.winAmount > 0 ? `+${bet.winAmount?.toLocaleString()}` : '0'} điểm
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Thua</div>
                    <div className={`font-bold ${lostAmount > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                      {lostAmount > 0 ? `-${lostAmount?.toLocaleString()}` : '0'} điểm
                    </div>
                  </div>
                </div>
                
                {bet.refundAmount > 0 && (
                  <div className="mb-2 p-2 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-xs text-gray-500 mb-1">Hoàn tiền</div>
                    <div className="font-bold text-green-600">
                      +{bet.refundAmount?.toLocaleString()} điểm
                      {bet.refundType === 'FULL_REFUND' && (
                        <span className="text-xs text-gray-600 font-normal"> (100%)</span>
                      )}
                      {bet.refundType === 'WIN_PERCENT' && (
                        <span className="text-xs text-gray-600 font-normal"> ({bet.refundPercentage}% thắng)</span>
                      )}
                      {bet.refundType === 'LOSS_PERCENT' && (
                        <span className="text-xs text-gray-600 font-normal"> ({bet.refundPercentage}% thua)</span>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-400">
                    {dayjs(bet.createdAt).format('DD/MM/YYYY HH:mm')}
                  </span>
                  <Button
                    type="link"
                    size="small"
                    icon={<EyeOutlined className="text-xs" />}
                    onClick={() => showBetDetail(bet)}
                    className="text-xs p-0 h-auto"
                  >
                    Chi tiết
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal - Mobile Optimized */}
      <Modal
        title={<span className="text-base font-bold">Chi tiết cược</span>}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)} className="text-sm">
            Đóng
          </Button>
        ]}
        width="90%"
        className="mobile-modal"
      >
        {selectedBet && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Game:</span>
                <div className="font-medium">
                  {selectedBet.gameTypeName}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Loại cược:</span>
                <div className="font-medium">{selectedBet.betType}</div>
              </div>
              <div>
                <span className="text-gray-500">Phiên:</span>
                <div className="font-mono text-xs">{selectedBet.sessionCode}</div>
              </div>
              <div>
                <span className="text-gray-500">Trạng thái:</span>
                <Tag color={getStatusColor(selectedBet.status)} className="text-xs">
                  {getStatusText(selectedBet.status)}
                </Tag>
              </div>
              <div>
                <span className="text-gray-500">Số tiền cược:</span>
                <div className="font-bold">{selectedBet.betAmount?.toLocaleString()} điểm</div>
              </div>
              <div>
                <span className="text-gray-500">Tiền thắng:</span>
                <div className={`font-bold ${selectedBet.winAmount > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                  {selectedBet.winAmount > 0 ? `+${selectedBet.winAmount?.toLocaleString()}` : '0'} điểm
                </div>
              </div>
              <div>
                <span className="text-gray-500">Tiền thua:</span>
                <div className={`font-bold ${(selectedBet.status === 'LOST' || selectedBet.status === 'LOSE') ? 'text-red-600' : 'text-gray-400'}`}>
                  {(selectedBet.status === 'LOST' || selectedBet.status === 'LOSE') ? `-${selectedBet.betAmount?.toLocaleString()}` : '0'} điểm
                </div>
              </div>
              {selectedBet.refundAmount > 0 && (
                <div>
                  <span className="text-gray-500">Hoàn tiền:</span>
                  <div className="font-bold text-green-600">
                    +{selectedBet.refundAmount?.toLocaleString()} điểm
                    {selectedBet.refundType === 'FULL_REFUND' && (
                      <span className="text-xs text-gray-600 font-normal"> (Hoàn 100%)</span>
                    )}
                    {selectedBet.refundType === 'WIN_PERCENT' && (
                      <span className="text-xs text-gray-600 font-normal"> (Hoàn {selectedBet.refundPercentage}% khi thắng)</span>
                    )}
                    {selectedBet.refundType === 'LOSS_PERCENT' && (
                      <span className="text-xs text-gray-600 font-normal"> (Hoàn {selectedBet.refundPercentage}% khi thua)</span>
                    )}
                  </div>
                </div>
              )}
              {selectedBet.resultCode && (
                <div>
                  <span className="text-gray-500">Kết quả:</span>
                  <div className="font-mono text-xs">{selectedBet.resultCode}</div>
                </div>
              )}
            </div>
            
            <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
              Đặt cược: {dayjs(selectedBet.createdAt).format('DD/MM/YYYY HH:mm:ss')}
            </div>
            {selectedBet.completedAt && (
              <div className="text-xs text-gray-400">
                Hoàn thành: {dayjs(selectedBet.completedAt).format('DD/MM/YYYY HH:mm:ss')}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MobileBettingHistory;

