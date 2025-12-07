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

dayjs.extend(isBetween);

const { Option } = Select;
const { RangePicker } = DatePicker;

const MobileBettingHistory = () => {
  const [bets, setBets] = useState([]);
  const [originalBets, setOriginalBets] = useState([]); // Lưu tất cả bets đã load để filter
  const [allBets, setAllBets] = useState([]); // Lưu tất cả bets để tính stats
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [gameFilter, setGameFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedBet, setSelectedBet] = useState(null);
  const [stats, setStats] = useState({
    totalBets: 0,
    totalWagered: 0,
    totalWon: 0,
    totalLost: 0,
    totalRefund: 0
  });
  const [hasMore, setHasMore] = useState(true);
  const [sicboPage, setSicboPage] = useState(0);
  const [xocDiaPage, setXocDiaPage] = useState(0);

  // Load betting history - load 20 items đầu tiên cho hiển thị
  useEffect(() => {
    loadBettingHistory(true);
    // Load tất cả cho thống kê (chạy song song, không block UI)
    loadAllBetsForStatistics();
  }, []);
  
  // Tính stats khi allBets thay đổi
  useEffect(() => {
    if (allBets.length > 0) {
      calculateStats(allBets);
    }
  }, [allBets]);
  
  // Filter bets khi gameFilter hoặc dateRange thay đổi
  useEffect(() => {
    filterBets();
  }, [gameFilter, dateRange, originalBets]);
  

  // Load tất cả bets cho thống kê (chạy song song)
  const loadAllBetsForStatistics = async () => {
    try {
      const token = localStorage.getItem('token');
      let allBetsForStats = [];
      
      // Fetch tất cả Sicbo bets cho thống kê
      try {
        let sicboAllBets = [];
        let sicboPage = 0;
        let sicboHasMore = true;
        
        while (sicboHasMore && sicboAllBets.length < 10000) {
          const sicboResponse = await axios.get(`http://localhost:8080/api/sicbo/bets/history`, {
            params: {
              page: sicboPage,
              size: 100
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
        
        allBetsForStats = [...allBetsForStats, ...sicboAllBets];
      } catch (error) {
        console.warn('Không thể tải lịch sử Sicbo cho thống kê:', error.message);
      }

      // Fetch tất cả Xoc Dia bets cho thống kê
      try {
        let xocDiaAllBets = [];
        let xocDiaPage = 0;
        let xocDiaHasMore = true;
        
        while (xocDiaHasMore && xocDiaAllBets.length < 10000) {
          const xocDiaResponse = await axios.get(`http://localhost:8080/api/xoc-dia/bets/history`, {
            params: {
              page: xocDiaPage,
              size: 100
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
        
        allBetsForStats = [...allBetsForStats, ...xocDiaAllBets];
      } catch (error) {
        console.warn('Không thể tải lịch sử Xóc Đĩa cho thống kê:', error.message);
      }

      // Sort by createdAt DESC
      allBetsForStats.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Lưu tất cả bets cho thống kê
      setAllBets(allBetsForStats);
    } catch (error) {
      console.error('Lỗi khi tải lịch sử cược cho thống kê:', error);
    }
  };

  // Load betting history - reset hoặc load thêm
  const loadBettingHistory = async (reset = true) => {
    try {
      if (reset) {
        setLoading(true);
        setSicboPage(0);
        setXocDiaPage(0);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }
      
      const token = localStorage.getItem('token');
      let newBets = [];
      let sicboHasMore = false;
      let xocDiaHasMore = false;
      
      // Fetch Sicbo betting history
      try {
        const sicboResponse = await axios.get(`http://localhost:8080/api/sicbo/bets/history`, {
          params: {
            page: reset ? 0 : sicboPage,
            size: 10
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
            refundAmount: bet.refundAmount || 0,
            refundType: bet.refundType || null,
            refundPercentage: bet.refundPercentage || null,
            isRefundPaid: bet.isRefundPaid || false
          }));
          newBets = [...newBets, ...sicboBets];
          sicboHasMore = sicboResponse.data.data.hasMore || false;
          if (!reset) {
            setSicboPage(prev => prev + 1);
          }
        }
      } catch (error) {
        console.warn('Không thể tải lịch sử Sicbo:', error.message);
      }

      // Fetch Xoc Dia betting history
      try {
        const xocDiaResponse = await axios.get(`http://localhost:8080/api/xoc-dia/bets/history`, {
          params: {
            page: reset ? 0 : xocDiaPage,
            size: 10
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
            refundAmount: bet.refundAmount || 0,
            refundType: bet.refundType || null,
            refundPercentage: bet.refundPercentage || null,
            isRefundPaid: bet.isRefundPaid || false
          }));
          newBets = [...newBets, ...xocDiaBets];
          xocDiaHasMore = xocDiaResponse.data.data.hasMore || false;
          if (!reset) {
            setXocDiaPage(prev => prev + 1);
          }
        }
      } catch (error) {
        console.warn('Không thể tải lịch sử Xóc Đĩa:', error.message);
      }

      // Sort by createdAt DESC
      newBets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Merge với bets đã có (nếu load thêm) hoặc thay thế (nếu reset)
      const mergedBets = reset ? newBets : [...originalBets, ...newBets];
      mergedBets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Cập nhật hasMore
      setHasMore(sicboHasMore || xocDiaHasMore);

      // Lưu bets gốc để filter
      setOriginalBets(mergedBets);
      // Lưu bets để hiển thị (sẽ được filter trong filterBets)
      setBets(mergedBets);
      
      // Show success message
      if (reset) {
        if (mergedBets.length > 0) {
          message.success(`Đã tải ${mergedBets.length} cược gần nhất`);
        } else {
          message.info('Chưa có lịch sử cược nào');
        }
      } else {
        if (newBets.length > 0) {
          message.success(`Đã tải thêm ${newBets.length} cược`);
        }
      }

    } catch (error) {
      console.error('Lỗi khi tải lịch sử cược:', error);
      message.error('Lỗi khi tải lịch sử cược: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load thêm 20 items
  const loadMoreBets = async () => {
    if (!hasMore || loadingMore) return;
    await loadBettingHistory(false);
  };

  const filterBets = () => {
    // Filter trên originalBets (20 items gốc) để hiển thị
    let filteredBets = [...originalBets];

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
    
    // Tính stats từ allBets (tất cả) đã filter theo gameFilter và dateRange
    let filteredAllBets = [...allBets];
    if (gameFilter !== 'ALL') {
      filteredAllBets = filteredAllBets.filter(bet => bet.gameType === gameFilter);
    }
    if (dateRange && dateRange.length === 2) {
      const [startDate, endDate] = dateRange;
      filteredAllBets = filteredAllBets.filter(bet => {
        const betDate = dayjs(bet.createdAt);
        return betDate.isBetween(startDate, endDate, 'day', '[]');
      });
    }
    calculateStats(filteredAllBets);
  };

  const calculateStats = (betsData) => {
    if (!betsData || betsData.length === 0) {
      setStats({
        totalBets: 0,
        totalWagered: 0,
        totalWon: 0,
        totalLost: 0,
        totalRefund: 0
      });
      return;
    }
    
    const totalBets = betsData.length;
    const totalWagered = betsData.reduce((sum, bet) => sum + (Number(bet.betAmount) || 0), 0);
    const totalWon = betsData
      .filter(bet => bet.status === 'WON' || bet.status === 'COMPLETED')
      .reduce((sum, bet) => sum + (Number(bet.winAmount) || 0), 0);
    const totalLost = betsData
      .filter(bet => bet.status === 'LOST' || bet.status === 'LOSE')
      .reduce((sum, bet) => sum + (Number(bet.betAmount) || 0), 0);
    // Tính tổng tiền cược đã được hoàn (refundAmount > 0, refundType = LOSS_PERCENT, và isRefundPaid = true)
    const totalRefund = betsData
      .filter(bet => bet.refundType === 'LOSS_PERCENT' && (bet.status === 'LOST' || bet.status === 'LOSE') && (Number(bet.refundAmount) || 0) > 0 && bet.isRefundPaid === true)
      .reduce((sum, bet) => sum + (Number(bet.refundAmount) || 0), 0);

    setStats({
      totalBets,
      totalWagered,
      totalWon,
      totalLost,
      totalRefund
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
            onClick={() => {
              loadBettingHistory(true);
              loadAllBetsForStatistics();
            }}
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
        <>
        <div className="space-y-2">
          {bets.map((bet) => {
            const lostAmount = (bet.status === 'LOST' || bet.status === 'LOSE') ? (bet.betAmount || 0) : 0;
            const netAmount = (bet.winAmount || 0) - lostAmount + (bet.refundAmount || 0);
            return (
              <div key={bet.id} className="bg-white rounded-lg p-2.5 shadow-sm border border-gray-100">
                {/* Header: Game name + Status */}
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-semibold text-base text-gray-900">{bet.gameTypeName}</span>
                  <Tag color={getStatusColor(bet.status)} className="text-sm px-2 py-0.5 m-0">
                    {getStatusText(bet.status)}
                  </Tag>
                </div>
                
                {/* Bet Type */}
                <div className="mb-1">
                  <span className="text-sm text-gray-500">Loại cược: </span>
                  <span className="text-sm font-medium text-gray-900">{bet.betType}</span>
                </div>
                
                {/* Amounts Grid - Compact */}
                <div className="grid grid-cols-3 gap-1.5 mb-1">
                  <div className="bg-gray-50 rounded-md p-1.5 text-center">
                    <div className="text-sm text-gray-500 mb-0.5">Cược</div>
                    <div className="text-base font-bold text-gray-900">{bet.betAmount?.toLocaleString()}</div>
                  </div>
                  <div className="bg-green-50 rounded-md p-1.5 text-center">
                    <div className="text-sm text-gray-500 mb-0.5">Thắng</div>
                    <div className={`text-base font-bold ${bet.winAmount > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                      {bet.winAmount > 0 ? `+${bet.winAmount?.toLocaleString()}` : '0'}
                    </div>
                  </div>
                  <div className="bg-red-50 rounded-md p-1.5 text-center">
                    <div className="text-sm text-gray-500 mb-0.5">Thua</div>
                    <div className={`text-base font-bold ${lostAmount > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                      {lostAmount > 0 ? `-${lostAmount?.toLocaleString()}` : '0'}
                    </div>
                  </div>
                </div>
                
                {/* Refund - Inline with net result */}
                {bet.refundAmount > 0 && (
                  <div className="mb-1 flex items-center gap-2 bg-green-50 rounded-md px-2 py-1 border border-green-200">
                    <span className="text-xs text-gray-600">Hoàn tiền:</span>
                    <span className="text-sm font-bold text-green-600">
                      +{bet.refundAmount?.toLocaleString()} điểm
                    </span>
                    {bet.refundType === 'FULL_REFUND' && (
                      <span className="text-xs text-gray-500">(100%)</span>
                    )}
                    {bet.refundType === 'WIN_PERCENT' && (
                      <span className="text-xs text-gray-500">({bet.refundPercentage}% thắng)</span>
                    )}
                    {bet.refundType === 'LOSS_PERCENT' && (
                      <span className="text-xs text-gray-500">({bet.refundPercentage}% thua)</span>
                    )}
                  </div>
                )}
                
                {/* Footer: Date + Detail button */}
                <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                  <span className="text-xs text-gray-400">
                    {dayjs(bet.createdAt).format('DD/MM/YYYY HH:mm')}
                  </span>
                  <Button
                    type="link"
                    size="small"
                    icon={<EyeOutlined className="text-sm" />}
                    onClick={() => showBetDetail(bet)}
                    className="text-xs p-0 h-auto text-blue-600 hover:text-blue-700"
                  >
                    Chi tiết
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
          {hasMore && (
            <div className="text-center py-4">
              <Button
                type="primary"
                loading={loadingMore}
                onClick={loadMoreBets}
                className="w-full"
                style={{
                  background: 'linear-gradient(to right, rgb(34, 197, 94), rgb(5, 150, 105))',
                  border: 'none',
                  height: '40px',
                  fontSize: '14px',
                  fontWeight: 500
                }}
              >
                {loadingMore ? 'Đang tải...' : 'Xem thêm'}
              </Button>
            </div>
          )}
          <div className="text-center text-xs text-gray-500 py-2">
            Hiển thị {bets.length} cược. Thống kê được tính trên tất cả lịch sử cược.
          </div>
        </>
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
                  <div className="text-sm font-bold text-green-600">
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

