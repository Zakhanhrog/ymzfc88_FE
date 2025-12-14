import React, { useState, useEffect } from 'react';
import {
  Card as AntCard,
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
  ReloadOutlined
} from '@ant-design/icons';
import { Card, CardContent } from '../../../components/ui/Card';

const { RangePicker } = DatePicker;
const { Option } = Select;

import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { HEADING_STYLES, BODY_STYLES, FONT_SIZE, FONT_WEIGHT, TEXT_COLORS } from '../../../utils/typography';
import Loading from '../../../components/common/Loading';
import axios from 'axios';

dayjs.extend(isBetween);

const BettingHistory = () => {
  const [bets, setBets] = useState([]);
  const [originalBets, setOriginalBets] = useState([]); // Lưu tất cả bets đã load để filter
  const [allBets, setAllBets] = useState([]); // Lưu tất cả bets để tính stats
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
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
    totalLost: 0,
    totalRefund: 0
  });
  const [hasMore, setHasMore] = useState(true);
  const [sicboPage, setSicboPage] = useState(0);
  const [xocDiaPage, setXocDiaPage] = useState(0);
  const [lotteryPage, setLotteryPage] = useState(0);

  // Load betting history - load 20 items đầu tiên cho hiển thị
  useEffect(() => {
    loadBettingHistory(true);
    // Load tất cả cho thống kê (chạy song song, không block UI)
    loadAllBetsForStatistics();
  }, []); // Load 1 lần duy nhất
  
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
      
      // Fetch tất cả Tài Xỉu bets cho thống kê
      try {
        let sicboAllBets = [];
        let sicboPage = 0;
        let sicboHasMore = true;
        
        while (sicboHasMore && sicboAllBets.length < 10000) { // Giới hạn 10000 để tránh quá tải
          const sicboResponse = await axios.get(`http://localhost:8080/api/sicbo/bets/history`, {
            params: {
              page: sicboPage,
              size: 100 // Load 100 items mỗi lần để tối ưu
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
            sicboAllBets = [...sicboAllBets, ...sicboBets];
            sicboHasMore = sicboResponse.data.data.hasMore || false;
            sicboPage++;
          } else {
            sicboHasMore = false;
          }
        }
        
        allBetsForStats = [...allBetsForStats, ...sicboAllBets];
      } catch (error) {
        console.warn('Không thể tải lịch sử Tài Xỉu cho thống kê:', error.message);
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
              refundPercentage: bet.refundPercentage || null,
              isRefundPaid: bet.isRefundPaid || false
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

      // Fetch tất cả Lottery bets cho thống kê
      try {
        let lotteryAllBets = [];
        let lotteryPage = 0;
        let lotteryHasMore = true;
        
        while (lotteryHasMore && lotteryAllBets.length < 10000) {
          const lotteryResponse = await axios.get(`http://localhost:8080/api/bets/my-bets`, {
            params: {
              page: lotteryPage,
              size: 100
            },
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (lotteryResponse.data.success && lotteryResponse.data.data) {
            const lotteryBets = lotteryResponse.data.data.map(bet => {
              // BetResponse có: betAmount, winAmount, status (Bet.BetStatus enum: WON, LOST, PENDING, CANCELLED)
              const statusStr = bet.status || 'PENDING';
              const betAmount = Number(bet.betAmount || bet.totalAmount || 0);
              const winAmount = Number(bet.winAmount || 0);
              
              return {
                ...bet,
                gameType: 'LOTTERY',
                gameTypeName: 'Xổ số',
                betAmount: betAmount,
                sessionCode: bet.resultDate ? `Ngày ${bet.resultDate}` : 'N/A',
                betType: bet.betType || 'N/A',
                completedAt: bet.resultCheckedAt || bet.updatedAt || bet.createdAt,
                winAmount: winAmount,
                status: statusStr,
                lostAmount: (statusStr === 'LOST' || statusStr === 'CANCELLED') ? betAmount : 0,
                refundAmount: 0,
                refundType: null,
                refundPercentage: null,
                isRefundPaid: false
              };
            });
            lotteryAllBets = [...lotteryAllBets, ...lotteryBets];
            lotteryHasMore = lotteryResponse.data.pagination && lotteryPage < lotteryResponse.data.pagination.totalPages - 1;
            lotteryPage++;
          } else {
            lotteryHasMore = false;
          }
        }
        
        allBetsForStats = [...allBetsForStats, ...lotteryAllBets];
      } catch (error) {
        console.warn('Không thể tải lịch sử Xổ số cho thống kê:', error.message);
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
        setLotteryPage(0);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }
      
      const token = localStorage.getItem('token');
      let newBets = [];
      let sicboHasMore = false;
      let xocDiaHasMore = false;
      let lotteryHasMore = false;
      
      // Fetch Tài Xỉu betting history
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
            refundPercentage: bet.refundPercentage || null
          }));
          newBets = [...newBets, ...sicboBets];
          // Chỉ set hasMore = true nếu thực sự có hasMore và có items
          sicboHasMore = (sicboResponse.data.data.hasMore || false) && sicboResponse.data.data.items.length > 0;
          if (!reset && sicboBets.length > 0) {
            setSicboPage(prev => prev + 1);
          }
        } else {
          sicboHasMore = false;
        }
      } catch (error) {
        console.warn('Không thể tải lịch sử Tài Xỉu:', error.message);
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
            refundPercentage: bet.refundPercentage || null
          }));
          newBets = [...newBets, ...xocDiaBets];
          // Chỉ set hasMore = true nếu thực sự có hasMore và có items
          xocDiaHasMore = (xocDiaResponse.data.data.hasMore || false) && xocDiaResponse.data.data.items.length > 0;
          if (!reset && xocDiaBets.length > 0) {
            setXocDiaPage(prev => prev + 1);
          }
        } else {
          xocDiaHasMore = false;
        }
      } catch (error) {
        console.warn('Không thể tải lịch sử Xóc Đĩa:', error.message);
      }

      // Fetch Lottery betting history
      try {
        const lotteryResponse = await axios.get(`http://localhost:8080/api/bets/my-bets`, {
          params: {
            page: reset ? 0 : lotteryPage,
            size: 10
          },
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (lotteryResponse.data.success && lotteryResponse.data.data && Array.isArray(lotteryResponse.data.data) && lotteryResponse.data.data.length > 0) {
          const lotteryBets = lotteryResponse.data.data.map(bet => {
            // BetResponse có: betAmount, winAmount, status (Bet.BetStatus enum: WON, LOST, PENDING, CANCELLED)
            const statusStr = bet.status || 'PENDING';
            const betAmount = Number(bet.betAmount || bet.totalAmount || 0);
            const winAmount = Number(bet.winAmount || 0);
            
            return {
              ...bet,
              gameType: 'LOTTERY',
              gameTypeName: 'Xổ số',
              betAmount: betAmount,
              sessionCode: bet.resultDate ? `Ngày ${bet.resultDate}` : 'N/A',
              betType: bet.betType || 'N/A',
              completedAt: bet.resultCheckedAt || bet.updatedAt || bet.createdAt,
              winAmount: winAmount,
              status: statusStr,
              lostAmount: (statusStr === 'LOST' || statusStr === 'CANCELLED') ? betAmount : 0,
              refundAmount: 0,
              refundType: null,
              refundPercentage: null,
              isRefundPaid: false
            };
          });
          newBets = [...newBets, ...lotteryBets];
          // Chỉ set hasMore = true nếu thực sự còn page tiếp theo và có items
          const pagination = lotteryResponse.data.pagination;
          lotteryHasMore = pagination && (lotteryPage + 1) < pagination.totalPages && lotteryBets.length > 0;
          if (!reset && lotteryBets.length > 0) {
            setLotteryPage(prev => prev + 1);
          }
        } else {
          lotteryHasMore = false;
        }
      } catch (error) {
        console.warn('Không thể tải lịch sử Xổ số:', error.message);
      }

      // Sort by createdAt DESC
      newBets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Merge với bets đã có (nếu load thêm) hoặc thay thế (nếu reset)
      let mergedBets = reset ? newBets : [...originalBets, ...newBets];
      
      // Loại bỏ duplicate bets (cùng id và gameType)
      const seenBets = new Map();
      mergedBets = mergedBets.filter(bet => {
        const key = `${bet.gameType}-${bet.id}`;
        if (seenBets.has(key)) {
          return false;
        }
        seenBets.set(key, true);
        return true;
      });
      
      mergedBets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Cập nhật hasMore: chỉ true nếu còn ít nhất 1 API có data VÀ có bets mới thực sự được thêm vào
      // Nếu không có bets mới nào được load, hoặc tất cả bets mới đều là duplicate, thì set hasMore = false
      if (reset) {
        // Khi reset: nếu không có bets nào, hoặc không còn API nào có data, thì set hasMore = false
        if (newBets.length === 0) {
          setHasMore(false);
        } else {
          setHasMore(sicboHasMore || xocDiaHasMore || lotteryHasMore);
        }
      } else {
        // Khi load thêm: chỉ set hasMore = true nếu có bets mới thực sự được thêm vào (không phải duplicate)
        const newBetsCount = mergedBets.length - originalBets.length;
        if (newBetsCount === 0) {
          // Không có bets mới nào được thêm vào (tất cả đều duplicate hoặc không có data)
          setHasMore(false);
        } else {
          // Có bets mới được thêm vào, kiểm tra xem còn API nào có data không
          setHasMore(sicboHasMore || xocDiaHasMore || lotteryHasMore);
        }
      }

      // Lưu bets gốc để filter
      setOriginalBets(mergedBets);
      // Lưu bets để hiển thị (sẽ được filter trong filterBets)
      setBets(mergedBets);
      
      // Cập nhật pagination
      setPagination(prev => ({
        ...prev,
        current: 1,
        total: mergedBets.length,
        pageSize: 20
      }));
      
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
    setPagination(prev => ({
      ...prev,
      current: 1,
      total: filteredBets.length
    }));
    
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

  // Kiểm tra xem có đang filter theo ngày hôm nay không
  const isFilteringToday = () => {
    if (!dateRange || !Array.isArray(dateRange) || dateRange.length !== 2) {
      return false;
    }
    const today = dayjs();
    const startOfToday = today.startOf('day');
    const endOfToday = today.endOf('day');
    const rangeStart = dayjs(dateRange[0]).startOf('day');
    const rangeEnd = dayjs(dateRange[1]).endOf('day');
    return rangeStart.isSame(startOfToday, 'day') && rangeEnd.isSame(endOfToday, 'day');
  };

  // Thống kê theo ngày hiện tại hoặc huỷ filter
  const toggleTodayFilter = () => {
    if (isFilteringToday()) {
      // Đang filter theo ngày, huỷ filter
      setDateRange(null);
      
      // Filter bets hiển thị (chỉ theo gameFilter)
      let filteredBets = [...originalBets];
      
      if (gameFilter !== 'ALL') {
        filteredBets = filteredBets.filter(bet => bet.gameType === gameFilter);
      }
      
      setBets(filteredBets);
      setPagination(prev => ({
        ...prev,
        current: 1,
        total: filteredBets.length
      }));
      
      // Recalculate stats với allBets (chỉ filter theo gameFilter)
      let filteredAllBets = [...allBets];
      
      if (gameFilter !== 'ALL') {
        filteredAllBets = filteredAllBets.filter(bet => bet.gameType === gameFilter);
      }
      
      calculateStats(filteredAllBets);
    } else {
      // Chưa filter theo ngày, filter theo ngày hôm nay
      const today = dayjs();
      const startOfToday = today.startOf('day');
      const endOfToday = today.endOf('day');
      
      // Set date range cho ngày hiện tại
      setDateRange([startOfToday, endOfToday]);
      
      // Filter bets hiển thị
      let filteredBets = [...originalBets];
      
      // Filter by game type
      if (gameFilter !== 'ALL') {
        filteredBets = filteredBets.filter(bet => bet.gameType === gameFilter);
      }
      
      // Filter by today
      filteredBets = filteredBets.filter(bet => {
        const betDate = dayjs(bet.createdAt);
        return betDate.isBetween(startOfToday, endOfToday, 'day', '[]');
      });
      
      setBets(filteredBets);
      setPagination(prev => ({
        ...prev,
        current: 1,
        total: filteredBets.length
      }));
      
      // Tính stats từ allBets (tất cả) đã filter theo gameFilter và ngày hiện tại
      let filteredAllBets = [...allBets];
      if (gameFilter !== 'ALL') {
        filteredAllBets = filteredAllBets.filter(bet => bet.gameType === gameFilter);
      }
      filteredAllBets = filteredAllBets.filter(bet => {
        const betDate = dayjs(bet.createdAt);
        return betDate.isBetween(startOfToday, endOfToday, 'day', '[]');
      });
      calculateStats(filteredAllBets);
    }
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
    // Tổng thắng: chỉ tính lãi (winAmount - stake), không tính gốc - nhất quán với admin
    const totalWon = betsData
      .filter(bet => {
        const status = bet.status || '';
        return status === 'WON' || status === 'COMPLETED';
      })
      .reduce((sum, bet) => {
        const winAmount = Number(bet.winAmount) || 0;
        const betAmount = Number(bet.betAmount) || 0;
        // Tính lãi: winAmount - betAmount (stake)
        const profit = winAmount - betAmount;
        return sum + (profit > 0 ? profit : 0);
      }, 0);
    const totalLost = betsData
      .filter(bet => {
        const status = bet.status || '';
        return status === 'LOST' || status === 'LOSE' || status === 'CANCELLED';
      })
      .reduce((sum, bet) => sum + (Number(bet.betAmount) || 0), 0);
    // Tính tổng tiền cược đã được hoàn (refundAmount > 0, refundType = LOSS_PERCENT, và isRefundPaid = true)
    // Đây là số tiền đã thực sự được hoàn về cho người chơi
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
        // Kiểm tra nếu là LOSS_PERCENT (hoàn cược khi thua)
        const isLossRefund = record.refundType === 'LOSS_PERCENT' && (record.status === 'LOST' || record.status === 'LOSE');
        
        if (isLossRefund) {
          // Nếu đã hoàn cược (isRefundPaid = true và refundAmount > 0)
          if (record.isRefundPaid === true && refundAmount && refundAmount > 0) {
            return (
              <div className="flex flex-col">
                <span style={{
                  fontSize: FONT_SIZE.md,
                  fontWeight: FONT_WEIGHT.bold,
                  color: '#52c41a'
                }}>
                  +{refundAmount?.toLocaleString()} điểm
                </span>
                <Tag color="green" style={{ fontSize: FONT_SIZE.xs, marginTop: '4px', width: 'fit-content' }}>
                  Đã hoàn cược
                </Tag>
              </div>
            );
          } else {
            // Chưa hoàn cược
            return (
              <Tag color="orange" style={{ fontSize: FONT_SIZE.sm }}>
                Chưa hoàn cược
              </Tag>
            );
          }
        }
        
        // Các trường hợp khác (FULL_REFUND, WIN_PERCENT)
        if (!refundAmount || refundAmount === 0) {
          return <span style={{ fontSize: FONT_SIZE.sm, color: '#999' }}>-</span>;
        }
        
        let refundLabel = '';
        if (record.refundType === 'FULL_REFUND') {
          refundLabel = ' (100%)';
        } else if (record.refundType === 'WIN_PERCENT') {
          refundLabel = ` (${record.refundPercentage}% thắng)`;
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
      {/* Statistics Cards */}
      <div className="grid grid-cols-5 gap-3 mb-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-1">Tổng số cược</div>
              <div className="text-lg font-bold text-blue-600">{stats.totalBets}</div>
          </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-1">Tổng tiền cược</div>
              <div className="text-lg font-bold text-orange-600">{stats.totalWagered.toLocaleString()}</div>
          </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-1">Tổng thắng</div>
              <div className="text-lg font-bold text-green-600">{stats.totalWon.toLocaleString()}</div>
          </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-1">Tổng thua</div>
              <div className="text-lg font-bold text-red-600">{stats.totalLost.toLocaleString()}</div>
          </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-1">Tổng hoàn cược</div>
              <div className="text-lg font-bold text-cyan-600">{stats.totalRefund.toLocaleString()}</div>
          </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <AntCard className="shadow-sm" style={{ borderRadius: '12px' }}>
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
            <Option value="LOTTERY">Xổ số</Option>
          </Select>
          <RangePicker
            value={dateRange}
            onChange={(dates) => {
              if (dates && dates.length === 2) {
                const [start, end] = dates;
                const daysDiff = end.diff(start, 'day');
                if (daysDiff > 14) {
                  message.warning('Chỉ được xem lịch sử tối đa 14 ngày');
                  return;
                }
                // Kiểm tra không được chọn quá 14 ngày từ ngày hiện tại
                const today = dayjs();
                const daysFromToday = today.diff(start, 'day');
                if (daysFromToday > 14) {
                  message.warning('Chỉ được xem lịch sử tối đa 14 ngày gần nhất');
                  return;
                }
              }
              setDateRange(dates);
            }}
            placeholder={['Từ ngày', 'Đến ngày']}
            format="DD/MM/YYYY"
            size="large"
            style={{ height: 40, minWidth: 260 }}
            allowClear
            disabledDate={(current) => {
              if (!current) return false;
              const today = dayjs();
              const daysDiff = today.diff(current, 'day');
              // Disable các ngày quá 14 ngày trước
              return daysDiff > 14 || current.isAfter(today, 'day');
            }}
          />
          <button 
            onClick={() => {
              loadBettingHistory(true);
              loadAllBetsForStatistics();
            }}
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
          <button 
            onClick={toggleTodayFilter}
            className="flex items-center justify-center gap-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 font-semibold shadow-md rounded-lg cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-colors"
            style={{ 
              height: 40, 
              minWidth: 160,
              background: isFilteringToday() 
                ? 'linear-gradient(to right, rgb(239, 68, 68), rgb(220, 38, 38))'
                : 'linear-gradient(to right, rgb(59, 130, 246), rgb(37, 99, 235))'
            }}
          >
            {isFilteringToday() ? 'Huỷ thống kê' : 'Thống kê theo ngày'}
          </button>
        </div>
      </AntCard>

      {/* Table */}
      <AntCard className="shadow-sm" style={{ borderRadius: '12px' }}>
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
          <>
          <Table
            columns={columns}
            dataSource={bets}
              pagination={false}
            rowKey="id"
            scroll={{ x: 1200 }}
          />
            {hasMore && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Button
                  type="primary"
                  loading={loadingMore}
                  onClick={loadMoreBets}
                  style={{
                    background: 'linear-gradient(to right, rgb(34, 197, 94), rgb(5, 150, 105))',
                    border: 'none',
                    height: '40px',
                    padding: '0 32px',
                    fontSize: FONT_SIZE.base,
                    fontWeight: FONT_WEIGHT.medium
                  }}
                >
                  {loadingMore ? 'Đang tải...' : 'Xem thêm'}
                </Button>
              </div>
            )}
          </>
        )}
      </AntCard>

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

