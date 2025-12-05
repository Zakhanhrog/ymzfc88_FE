import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

/**
 * Tính toán statistics từ danh sách bets theo period
 * @param {Array} bets - Danh sách bets
 * @param {String} period - Period (TODAY, YESTERDAY, THIS_WEEK, THIS_MONTH, LAST_MONTH)
 * @returns {Object} Statistics object
 */
export const calculateBetStatisticsByPeriod = (bets, period) => {
  if (!Array.isArray(bets) || bets.length === 0) {
    return {
      totalBets: 0,
      totalWagered: 0,
      totalWon: 0,
      totalLost: 0,
      totalRefund: 0,
      netProfit: 0
    };
  }

  const now = dayjs();
  let startDate, endDate;

  switch (period) {
    case 'TODAY':
      startDate = now.startOf('day');
      endDate = now.endOf('day');
      break;
    case 'YESTERDAY':
      startDate = now.subtract(1, 'day').startOf('day');
      endDate = now.subtract(1, 'day').endOf('day');
      break;
    case 'THIS_WEEK':
      startDate = now.startOf('week');
      endDate = now.endOf('week');
      break;
    case 'THIS_MONTH':
      startDate = now.startOf('month');
      endDate = now.endOf('month');
      break;
    case 'LAST_MONTH':
      startDate = now.subtract(1, 'month').startOf('month');
      endDate = now.subtract(1, 'month').endOf('month');
      break;
    default:
      // ALL - không filter
      startDate = null;
      endDate = null;
  }

  // Filter bets theo period
  const filteredBets = startDate && endDate
    ? bets.filter(bet => {
        const betDate = dayjs(bet.createdAt);
        return betDate.isBetween(startDate, endDate, null, '[]');
      })
    : bets;

  // Tính toán statistics
  const totalBets = filteredBets.length;
  const totalWagered = filteredBets.reduce((sum, bet) => sum + (bet.betAmount || 0), 0);
  const totalWon = filteredBets
    .filter(bet => bet.status === 'WON' || bet.status === 'COMPLETED')
    .reduce((sum, bet) => sum + (bet.winAmount || 0), 0);
  const totalLost = filteredBets
    .filter(bet => bet.status === 'LOST' || bet.status === 'LOSE')
    .reduce((sum, bet) => sum + (bet.betAmount || 0), 0);
  const totalRefund = filteredBets.reduce((sum, bet) => sum + (bet.refundAmount || 0), 0);
  const netProfit = totalWon - totalLost + totalRefund;

  return {
    totalBets,
    totalWagered,
    totalWon,
    totalLost,
    totalRefund,
    netProfit
  };
};

/**
 * Lấy label cho period
 */
export const getPeriodLabel = (period) => {
  const labels = {
    'TODAY': 'Hôm nay',
    'YESTERDAY': 'Hôm qua',
    'THIS_WEEK': 'Tuần này',
    'THIS_MONTH': 'Tháng này',
    'LAST_MONTH': 'Tháng trước'
  };
  return labels[period] || period;
};

