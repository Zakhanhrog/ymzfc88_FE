import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Table from '../../../components/ui/Table';
import Modal from '../../../components/ui/Modal';
import DateRangePicker from '../../../components/ui/DateRangePicker';
import StatCard from '../../admin/analytics/components/StatCard';
import Loading from '../../../components/common/Loading';
import { Badge } from '../../../components/ui/Badge';
import {
  Gamepad2,
  Coins,
  Trophy,
  TrendingDown,
  RefreshCw,
  Eye,
  Calendar
} from 'lucide-react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import axios from 'axios';
import { message } from 'antd';
import { defaultSicboQuickBetConfigs } from '../../casino/pages/games/sicboConfig';
import { defaultQuickBetConfigs as xocDiaConfigs } from '../../casino/pages/games/xocDiaConfig';

dayjs.extend(isBetween);

// Map dice faces to icons
const diceFaceIconMap = {
  1: '/matxucxac/1cham.svg',
  2: '/matxucxac/2cham.svg',
  3: '/matxucxac/3cham.svg',
  4: '/matxucxac/4cham.svg',
  5: '/matxucxac/5cham.svg',
  6: '/matxucxac/6cham.svg',
};

// Create map of bet codes to display info
const betCodeDisplayMap = {};
defaultSicboQuickBetConfigs.forEach((config) => {
  betCodeDisplayMap[config.code] = config.name;
});

// Add Xoc Dia bet codes
const xocDiaBetCodeMap = {};
xocDiaConfigs.forEach((config) => {
  xocDiaBetCodeMap[config.code] = config.label;
});

// Function to render bet code with visual representation
const renderBetCode = (betCode) => {
  if (!betCode) return <span className="text-sm text-gray-500">—</span>;

  // Check if it's in the config map first
  if (betCodeDisplayMap[betCode]) {
    const displayName = betCodeDisplayMap[betCode];
    
    // Primary bets (Tài/Xỉu) - just show text with color
    if (betCode === 'sicbo_primary_big') {
      return (
        <span className="text-sm font-bold text-red-600">Tài</span>
      );
    }
    if (betCode === 'sicbo_primary_small') {
      return (
        <span className="text-sm font-bold text-green-700">Xỉu</span>
      );
    }
    
    // Parity bets
    if (betCode === 'sicbo_parity_even') {
      return <span className="text-sm font-semibold text-blue-600">Chẵn</span>;
    }
    if (betCode === 'sicbo_parity_odd') {
      return <span className="text-sm font-semibold text-orange-600">Lẻ</span>;
    }
    
    // Total bets - show number
    const totalMatch = betCode.match(/sicbo_total_(\d+)/);
    if (totalMatch) {
      return <span className="text-sm font-semibold text-purple-600">Tổng {totalMatch[1]}</span>;
    }
    
    // Triple combo - show 3 dice faces
    const tripleMatch = betCode.match(/sicbo_combo_triple_(\d+)/);
    if (tripleMatch) {
      const face = parseInt(tripleMatch[1]);
      return (
        <div className="flex items-center gap-1">
          {[face, face, face].map((f, idx) => (
            <img
              key={idx}
              src={diceFaceIconMap[f]}
              alt={`Mặt ${f}`}
              className="h-5 w-5 object-contain"
              draggable={false}
            />
          ))}
        </div>
      );
    }
    
    // Single face - show 1 dice face
    const singleMatch = betCode.match(/sicbo_single_(\d+)/);
    if (singleMatch) {
      const face = parseInt(singleMatch[1]);
      return (
        <div className="flex items-center">
          <img
            src={diceFaceIconMap[face]}
            alt={`Mặt ${face}`}
            className="h-5 w-5 object-contain"
            draggable={false}
          />
        </div>
      );
    }
    
    // Pair (different faces) - show 2 dice faces
    const pairMatch = betCode.match(/sicbo_pair_(\d+)_(\d+)/);
    if (pairMatch) {
      const face1 = parseInt(pairMatch[1]);
      const face2 = parseInt(pairMatch[2]);
      return (
        <div className="flex items-center gap-1">
          <img
            src={diceFaceIconMap[face1]}
            alt={`Mặt ${face1}`}
            className="h-5 w-5 object-contain"
            draggable={false}
          />
          <img
            src={diceFaceIconMap[face2]}
            alt={`Mặt ${face2}`}
            className="h-5 w-5 object-contain"
            draggable={false}
          />
        </div>
      );
    }
    
    // Pair double (same faces) - show 2 dice faces of same number
    const pairDoubleMatch = betCode.match(/sicbo_pair_double_(\d+)/);
    if (pairDoubleMatch) {
      const face = parseInt(pairDoubleMatch[1]);
      return (
        <div className="flex items-center gap-1">
          <img
            src={diceFaceIconMap[face]}
            alt={`Mặt ${face}`}
            className="h-5 w-5 object-contain"
            draggable={false}
          />
          <img
            src={diceFaceIconMap[face]}
            alt={`Mặt ${face}`}
            className="h-5 w-5 object-contain"
            draggable={false}
          />
        </div>
      );
    }
    
    // Fallback to display name if available
    return <span className="text-sm font-medium text-gray-700">{displayName}</span>;
  }

  // Xoc Dia bet codes
  let xocDiaCode = betCode;
  if (betCode.startsWith('xocdia_')) {
    xocDiaCode = betCode.replace('xocdia_', '');
  }
  if (xocDiaBetCodeMap[xocDiaCode]) {
    const label = xocDiaBetCodeMap[xocDiaCode];
    // Special styling for common xocdia bets
    if (xocDiaCode === 'tai') {
      return <span className="text-sm font-bold text-red-600">Tài</span>;
    }
    if (xocDiaCode === 'xiu') {
      return <span className="text-sm font-bold text-green-700">Xỉu</span>;
    }
    if (xocDiaCode === 'chan') {
      return <span className="text-sm font-semibold text-blue-600">Chẵn</span>;
    }
    if (xocDiaCode === 'le') {
      return <span className="text-sm font-semibold text-orange-600">Lẻ</span>;
    }
    return <span className="text-sm font-medium text-indigo-600">{label}</span>;
  }

  // Lottery bet codes
  if (betCode.startsWith('lottery_')) {
    const lotteryCode = betCode.replace('lottery_', '').replace(/_/g, ' ');
    return <span className="text-sm font-medium text-purple-600">{lotteryCode}</span>;
  }
  
  // Ultimate fallback
  return <span className="text-sm text-gray-600 font-mono">{betCode}</span>;
};

const BettingHistory = () => {
  const [bets, setBets] = useState([]);
  const [originalBets, setOriginalBets] = useState([]);
  const [allBets, setAllBets] = useState([]);
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
  const [lotteryPage, setLotteryPage] = useState(0);

  // Load betting history - load 20 items đầu tiên cho hiển thị
  useEffect(() => {
    loadBettingHistory(true);
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

  // Load tất cả bets cho thống kê
  const loadAllBetsForStatistics = async () => {
    try {
      const token = localStorage.getItem('token');
      let allBetsForStats = [];
      
      // Fetch tất cả Tài Xỉu bets
      try {
        let sicboAllBets = [];
        let sicboPage = 0;
        let sicboHasMore = true;
        
        while (sicboHasMore && sicboAllBets.length < 10000) {
          const sicboResponse = await axios.get(`https://api.tathiet168.com/api/sicbo/bets/history`, {
            params: { page: sicboPage, size: 100 },
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (sicboResponse.data.success && sicboResponse.data.data?.items) {
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

      // Fetch tất cả Xoc Dia bets
      try {
        let xocDiaAllBets = [];
        let xocDiaPage = 0;
        let xocDiaHasMore = true;
        
        while (xocDiaHasMore && xocDiaAllBets.length < 10000) {
          const xocDiaResponse = await axios.get(`https://api.tathiet168.com/api/xoc-dia/bets/history`, {
            params: { page: xocDiaPage, size: 100 },
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (xocDiaResponse.data.success && xocDiaResponse.data.data?.items) {
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

      // Fetch tất cả Lottery bets
      try {
        let lotteryAllBets = [];
        let lotteryPage = 0;
        let lotteryHasMore = true;
        
        while (lotteryHasMore && lotteryAllBets.length < 10000) {
          const lotteryResponse = await axios.get(`https://api.tathiet168.com/api/bets/my-bets`, {
            params: { page: lotteryPage, size: 100 },
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (lotteryResponse.data.success && lotteryResponse.data.data) {
            const lotteryBets = lotteryResponse.data.data.map(bet => {
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

      allBetsForStats.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAllBets(allBetsForStats);
    } catch (error) {
      console.error('Lỗi khi tải lịch sử cược cho thống kê:', error);
    }
  };

  // Load betting history
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
      
      // Fetch Tài Xỉu
      try {
        const sicboResponse = await axios.get(`https://api.tathiet168.com/api/sicbo/bets/history`, {
          params: { page: reset ? 0 : sicboPage, size: 10 },
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (sicboResponse.data.success && sicboResponse.data.data?.items) {
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
          sicboHasMore = (sicboResponse.data.data.hasMore || false) && sicboResponse.data.data.items.length > 0;
          if (!reset && sicboBets.length > 0) {
            setSicboPage(prev => prev + 1);
          }
        }
      } catch (error) {
        console.warn('Không thể tải lịch sử Tài Xỉu:', error.message);
      }

      // Fetch Xoc Dia
      try {
        const xocDiaResponse = await axios.get(`https://api.tathiet168.com/api/xoc-dia/bets/history`, {
          params: { page: reset ? 0 : xocDiaPage, size: 10 },
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (xocDiaResponse.data.success && xocDiaResponse.data.data?.items) {
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
          xocDiaHasMore = (xocDiaResponse.data.data.hasMore || false) && xocDiaResponse.data.data.items.length > 0;
          if (!reset && xocDiaBets.length > 0) {
            setXocDiaPage(prev => prev + 1);
          }
        }
      } catch (error) {
        console.warn('Không thể tải lịch sử Xóc Đĩa:', error.message);
      }

      // Fetch Lottery
      try {
        const lotteryResponse = await axios.get(`https://api.tathiet168.com/api/bets/my-bets`, {
          params: { page: reset ? 0 : lotteryPage, size: 10 },
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (lotteryResponse.data.success && lotteryResponse.data.data && Array.isArray(lotteryResponse.data.data) && lotteryResponse.data.data.length > 0) {
          const lotteryBets = lotteryResponse.data.data.map(bet => {
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
          const pagination = lotteryResponse.data.pagination;
          lotteryHasMore = pagination && (lotteryPage + 1) < pagination.totalPages && lotteryBets.length > 0;
          if (!reset && lotteryBets.length > 0) {
            setLotteryPage(prev => prev + 1);
          }
        }
      } catch (error) {
        console.warn('Không thể tải lịch sử Xổ số:', error.message);
      }

      newBets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      let mergedBets = reset ? newBets : [...originalBets, ...newBets];
      const seenBets = new Map();
      mergedBets = mergedBets.filter(bet => {
        const key = `${bet.gameType}-${bet.id}`;
        if (seenBets.has(key)) return false;
        seenBets.set(key, true);
        return true;
      });
      mergedBets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      if (reset) {
        if (newBets.length === 0) {
          setHasMore(false);
        } else {
          setHasMore(sicboHasMore || xocDiaHasMore || lotteryHasMore);
        }
      } else {
        const newBetsCount = mergedBets.length - originalBets.length;
        if (newBetsCount === 0) {
          setHasMore(false);
        } else {
          setHasMore(sicboHasMore || xocDiaHasMore || lotteryHasMore);
        }
      }

      setOriginalBets(mergedBets);
      setBets(mergedBets);
      
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

  const loadMoreBets = async () => {
    if (!hasMore || loadingMore) return;
    await loadBettingHistory(false);
  };

  const filterBets = () => {
    let filteredBets = [...originalBets];

    if (gameFilter !== 'ALL') {
      filteredBets = filteredBets.filter(bet => bet.gameType === gameFilter);
    }

    if (dateRange && dateRange.length === 2) {
      const [startDate, endDate] = dateRange;
      filteredBets = filteredBets.filter(bet => {
        const betDate = dayjs(bet.createdAt);
        return betDate.isBetween(startDate, endDate, 'day', '[]');
      });
    }

    setBets(filteredBets);
    
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

  const toggleTodayFilter = () => {
    if (isFilteringToday()) {
      setDateRange(null);
      let filteredBets = [...originalBets];
      if (gameFilter !== 'ALL') {
        filteredBets = filteredBets.filter(bet => bet.gameType === gameFilter);
      }
      setBets(filteredBets);
      let filteredAllBets = [...allBets];
      if (gameFilter !== 'ALL') {
        filteredAllBets = filteredAllBets.filter(bet => bet.gameType === gameFilter);
      }
      calculateStats(filteredAllBets);
    } else {
      const today = dayjs();
      const startOfToday = today.startOf('day');
      const endOfToday = today.endOf('day');
      setDateRange([startOfToday, endOfToday]);
      let filteredBets = [...originalBets];
      if (gameFilter !== 'ALL') {
        filteredBets = filteredBets.filter(bet => bet.gameType === gameFilter);
      }
      filteredBets = filteredBets.filter(bet => {
        const betDate = dayjs(bet.createdAt);
        return betDate.isBetween(startOfToday, endOfToday, 'day', '[]');
      });
      setBets(filteredBets);
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
    const totalWon = betsData
      .filter(bet => {
        const status = bet.status || '';
        return status === 'WON' || status === 'COMPLETED';
      })
      .reduce((sum, bet) => {
        const winAmount = Number(bet.winAmount) || 0;
        const betAmount = Number(bet.betAmount) || 0;
        const profit = winAmount - betAmount;
        return sum + (profit > 0 ? profit : 0);
      }, 0);
    const totalLost = betsData
      .filter(bet => {
        const status = bet.status || '';
        return status === 'LOST' || status === 'LOSE' || status === 'CANCELLED';
      })
      .reduce((sum, bet) => sum + (Number(bet.betAmount) || 0), 0);
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
        return 'bg-green-50 text-green-700 border-green-200';
      case 'LOST':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'PENDING':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'CANCELLED':
      case 'REFUNDED':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
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

  const showBetDetail = (bet) => {
    setSelectedBet(bet);
    setDetailModalVisible(true);
  };

  const formatPoints = (points) => {
    if (!points && points !== 0) return '0';
    return new Intl.NumberFormat('vi-VN').format(Number(points));
  };

  const columns = [
    {
      key: 'gameType',
      dataIndex: 'gameType',
      title: 'Game',
      render: (_, record) => (
        <span className="text-sm font-medium text-gray-900">{record.gameTypeName}</span>
      ),
    },
    {
      key: 'betType',
      dataIndex: 'betType',
      title: 'Loại cược',
      render: (betType) => renderBetCode(betType),
    },
    {
      key: 'betAmount',
      dataIndex: 'betAmount',
      title: 'Số tiền cược',
      render: (amount) => (
        <span className="text-sm font-semibold text-gray-900">
          {formatPoints(amount)} điểm
        </span>
      ),
    },
    {
      key: 'winAmount',
      dataIndex: 'winAmount',
      title: 'Tiền thắng',
      render: (amount, record) => (
        <span className={`text-sm font-semibold ${
          (record.status === 'WON' || record.status === 'COMPLETED') && amount > 0 
            ? 'text-green-600' 
            : 'text-gray-500'
        }`}>
          {amount > 0 ? `+${formatPoints(amount)}` : '0'} điểm
        </span>
      ),
    },
    {
      key: 'lostAmount',
      dataIndex: 'lostAmount',
      title: 'Tiền thua',
      render: (amount, record) => {
        const lostAmount = (record.status === 'LOST' || record.status === 'LOSE') ? (record.betAmount || 0) : 0;
        return (
          <span className={`text-sm font-semibold ${lostAmount > 0 ? 'text-red-600' : 'text-gray-500'}`}>
            {lostAmount > 0 ? `-${formatPoints(lostAmount)}` : '0'} điểm
          </span>
        );
      },
    },
    {
      key: 'refundAmount',
      dataIndex: 'refundAmount',
      title: 'Hoàn tiền',
      render: (refundAmount, record) => {
        const isLossRefund = record.refundType === 'LOSS_PERCENT' && (record.status === 'LOST' || record.status === 'LOSE');
        
        if (isLossRefund) {
          if (record.isRefundPaid === true && refundAmount && refundAmount > 0) {
            return (
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-green-600">
                  +{formatPoints(refundAmount)} điểm
                </span>
                <Badge className="bg-green-50 text-green-700 border-green-200 text-xs w-fit">
                  Đã hoàn cược
                </Badge>
              </div>
            );
          } else {
            return (
              <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs w-fit">
                Chưa hoàn cược
              </Badge>
            );
          }
        }
        
        if (!refundAmount || refundAmount === 0) {
          return <span className="text-sm text-gray-400">—</span>;
        }
        
        let refundLabel = '';
        if (record.refundType === 'FULL_REFUND') {
          refundLabel = ' (100%)';
        } else if (record.refundType === 'WIN_PERCENT') {
          refundLabel = ` (${record.refundPercentage}% thắng)`;
        }
        
        return (
          <span className="text-sm font-semibold text-green-600">
            +{formatPoints(refundAmount)} điểm
            <span className="text-xs text-gray-500 font-normal">{refundLabel}</span>
          </span>
        );
      },
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: 'Trạng thái',
      render: (status) => (
        <Badge className={`${getStatusColor(status)} border text-xs`}>
          {getStatusText(status)}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      dataIndex: 'createdAt',
      title: 'Thời gian',
      render: (date) => (
        <span className="text-sm text-gray-700">{dayjs(date).format('DD/MM/YYYY HH:mm')}</span>
      ),
    },
    {
      key: 'action',
      title: 'Hành động',
      render: (_, record) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => showBetDetail(record)}
          className="h-8"
        >
          <Eye className="h-4 w-4 mr-1" />
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Tổng số cược"
          value={formatPoints(stats.totalBets)}
          icon={Gamepad2}
          bgColor="bg-blue-600"
          valueColor="text-white"
          textColor="text-white"
        />
        <StatCard
          title="Tổng tiền cược"
          value={formatPoints(stats.totalWagered)}
          icon={Coins}
          bgColor="bg-orange-600"
          valueColor="text-white"
          textColor="text-white"
        />
        <StatCard
          title="Tổng thắng"
          value={formatPoints(stats.totalWon)}
          icon={Trophy}
          bgColor="bg-green-600"
          valueColor="text-white"
          textColor="text-white"
        />
        <StatCard
          title="Tổng thua"
          value={formatPoints(stats.totalLost)}
          icon={TrendingDown}
          bgColor="bg-red-600"
          valueColor="text-white"
          textColor="text-white"
        />
        <StatCard
          title="Tổng hoàn cược"
          value={formatPoints(stats.totalRefund)}
          icon={Coins}
          bgColor="bg-cyan-600"
          valueColor="text-white"
          textColor="text-white"
        />
      </div>

      {/* Filters */}
      <Card className="rounded-2xl">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Khoảng thời gian
              </label>
              <DateRangePicker
                value={dateRange}
                onChange={(dates) => {
                  if (dates && dates.length === 2) {
                    const [start, end] = dates;
                    const today = dayjs();
                    const daysDiff = end.diff(start, 'day');
                    const daysFromToday = today.diff(start, 'day');
                    
                    if (start.isAfter(today, 'day')) {
                      message.warning('Không được chọn ngày trong tương lai');
                      return;
                    }
                    if (daysFromToday > 14) {
                      message.warning('Chỉ được xem lịch sử tối đa 14 ngày gần nhất');
                      return;
                    }
                    if (daysDiff > 14) {
                      message.warning('Chỉ được xem lịch sử tối đa 14 ngày');
                      return;
                    }
                  }
                  setDateRange(dates);
                }}
                placeholder={['Từ ngày', 'Đến ngày']}
                format="DD/MM/YYYY"
                bordered
              />
            </div>

            <div className="w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Game
              </label>
              <Select
                value={gameFilter}
                onChange={setGameFilter}
                options={[
                  { label: 'Tất cả game', value: 'ALL' },
                  { label: 'Tài xỉu', value: 'SICBO' },
                  { label: 'Xóc đĩa', value: 'XOCDIA' },
                  { label: 'Xổ số', value: 'LOTTERY' },
                ]}
                bordered
              />
            </div>

            <Button
              variant="primary"
              onClick={() => {
                loadBettingHistory(true);
                loadAllBetsForStatistics();
              }}
              className="h-10"
            >
              <RefreshCw className="h-4 w-4" />
              Làm mới
            </Button>

            <Button
              variant={isFilteringToday() ? 'destructive' : 'outline'}
              onClick={toggleTodayFilter}
              className="h-10"
            >
              <Calendar className="h-4 w-4" />
              {isFilteringToday() ? 'Huỷ thống kê' : 'Thống kê theo ngày'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="rounded-2xl">
        <CardContent className="p-0">
          {loading ? (
            <div className="py-12">
              <Loading />
            </div>
          ) : bets.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-base font-medium mb-2">Chưa có lịch sử cược</p>
              <p className="text-sm">Hãy tham gia chơi game để xem lịch sử cược của bạn tại đây</p>
            </div>
          ) : (
            <>
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Lịch sử cược</h3>
              </div>
              <div className="overflow-x-auto">
                <Table
                  columns={columns}
                  dataSource={bets}
                  loading={false}
                  rowKey={(record) => `${record.gameType}-${record.id}`}
                  emptyText="Không có dữ liệu cược"
                />
              </div>
              {hasMore && (
                <div className="px-6 py-4 border-t border-gray-200 text-center">
                  <Button
                    variant="primary"
                    onClick={loadMoreBets}
                    disabled={loadingMore}
                    className="h-10"
                  >
                    {loadingMore ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Đang tải...
                      </>
                    ) : (
                      'Xem thêm'
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Modal
        open={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        title="Chi tiết cược"
        width="max-w-2xl"
      >
        {selectedBet && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mã cược</label>
                <p className="text-sm font-mono text-gray-900 mt-1">{selectedBet.betCode}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Game</label>
                <p className="text-sm font-medium text-gray-900 mt-1">{selectedBet.gameTypeName}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Loại cược</label>
                <div className="mt-1">{renderBetCode(selectedBet.betType)}</div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phiên</label>
                <p className="text-sm font-mono text-gray-900 mt-1">{selectedBet.sessionCode}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Kết quả</label>
                <p className="text-sm font-mono text-gray-900 mt-1">{selectedBet.resultCode || 'Chưa có'}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</label>
                <div className="mt-1">
                  <Badge className={`${getStatusColor(selectedBet.status)} border text-xs`}>
                    {getStatusText(selectedBet.status)}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Thông tin tài chính</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Số tiền cược</label>
                  <p className="text-base font-bold text-gray-900 mt-1">
                    {formatPoints(selectedBet.betAmount)} điểm
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tiền thắng</label>
                  <p className={`text-base font-bold mt-1 ${
                    selectedBet.winAmount > 0 ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {selectedBet.winAmount > 0 ? `+${formatPoints(selectedBet.winAmount)}` : '0'} điểm
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tiền thua</label>
                  <p className={`text-base font-bold mt-1 ${
                    (selectedBet.status === 'LOST' || selectedBet.status === 'LOSE') ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {(selectedBet.status === 'LOST' || selectedBet.status === 'LOSE') 
                      ? `-${formatPoints(selectedBet.betAmount)}` 
                      : '0'} điểm
                  </p>
                </div>
                {selectedBet.refundAmount > 0 && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Hoàn tiền</label>
                    <p className="text-base font-bold text-green-600 mt-1">
                      +{formatPoints(selectedBet.refundAmount)} điểm
                      {selectedBet.refundType === 'FULL_REFUND' && (
                        <span className="text-xs text-gray-500 font-normal ml-1">(Hoàn tiền 100%)</span>
                      )}
                      {selectedBet.refundType === 'WIN_PERCENT' && (
                        <span className="text-xs text-gray-500 font-normal ml-1">(Hoàn {selectedBet.refundPercentage}% khi thắng)</span>
                      )}
                      {selectedBet.refundType === 'LOSS_PERCENT' && (
                        <span className="text-xs text-gray-500 font-normal ml-1">(Hoàn {selectedBet.refundPercentage}% khi thua)</span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Thông tin thời gian</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Thời gian đặt cược</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {dayjs(selectedBet.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                  </p>
                </div>
                {selectedBet.completedAt && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Thời gian hoàn thành</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {dayjs(selectedBet.completedAt).format('DD/MM/YYYY HH:mm:ss')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BettingHistory;
