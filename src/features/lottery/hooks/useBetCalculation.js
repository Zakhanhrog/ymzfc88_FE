import { useMemo } from 'react';

/**
 * Hook tính toán tiền cược và tiền thắng
 * GIỮ NGUYÊN 100% logic từ MienBacGamePage.jsx
 */
export const useBetCalculation = (selectedGameType, selectedNumbers, betAmount, bettingOddsData) => {
  
  const getPricePerPoint = () => {
    if (bettingOddsData[selectedGameType]) {
      return bettingOddsData[selectedGameType].pricePerPoint;
    }
    return 0;
  };

  const getOdds = () => {
    if (bettingOddsData[selectedGameType]) {
      return bettingOddsData[selectedGameType].odds;
    }
    return 0;
  };

  // Tính tổng tiền cược
  const calculateTotalAmount = useMemo(() => {
    if (selectedGameType === 'loto2s' || selectedGameType === 'loto-2-so' || selectedGameType === 'loto-3s' || selectedGameType === 'loto3s' 
        || selectedGameType === 'loto-4s' || selectedGameType === 'loto4s'
        || selectedGameType === 'loto-xien-2'
        || selectedGameType === 'loto-xien-3'
        || selectedGameType === 'loto-xien-4'
        || selectedGameType === '3s-dac-biet'
        || selectedGameType === '4s-dac-biet'
        || selectedGameType === 'giai-nhat' || selectedGameType === 'dac-biet'
        || selectedGameType === 'dau-dac-biet' || selectedGameType === '3s-giai-nhat') {
      
      let count = selectedNumbers.length;
      
      // Đối với loto xiên 2, đếm số cặp
      if (selectedGameType === 'loto-xien-2') {
        count = selectedNumbers.filter(item => item.includes(',')).length;
      }
      
      // Đối với loto xiên 3, đếm số cụm
      if (selectedGameType === 'loto-xien-3') {
        count = selectedNumbers.filter(item => {
          const parts = item.split(',');
          return parts.length === 3;
        }).length;
      }
      
      // Đối với loto xiên 4, đếm số cụm
      if (selectedGameType === 'loto-xien-4') {
        count = selectedNumbers.filter(item => {
          const parts = item.split(',');
          return parts.length === 4;
        }).length;
      }
      
      return betAmount * getPricePerPoint() * count;
    }
    
    return selectedNumbers.length * betAmount * getPricePerPoint();
  }, [selectedGameType, selectedNumbers, betAmount, bettingOddsData]);

  // Tính tổng điểm
  const calculateTotalPoints = useMemo(() => {
    if (selectedGameType === 'loto2s' || selectedGameType === 'loto-2-so' || selectedGameType === 'loto-3s' || selectedGameType === 'loto3s'
        || selectedGameType === 'loto-4s' || selectedGameType === 'loto4s'
        || selectedGameType === 'loto-xien-2'
        || selectedGameType === 'loto-xien-3'
        || selectedGameType === 'loto-xien-4'
        || selectedGameType === '3s-dac-biet'
        || selectedGameType === '4s-dac-biet'
        || selectedGameType === 'giai-nhat' || selectedGameType === 'dac-biet'
        || selectedGameType === 'dau-dac-biet' || selectedGameType === '3s-giai-nhat') {
      
      let count = selectedNumbers.length;
      
      if (selectedGameType === 'loto-xien-2') {
        count = selectedNumbers.filter(item => item.includes(',')).length;
      }
      
      if (selectedGameType === 'loto-xien-3') {
        count = selectedNumbers.filter(item => {
          const parts = item.split(',');
          return parts.length === 3;
        }).length;
      }
      
      if (selectedGameType === 'loto-xien-4') {
        count = selectedNumbers.filter(item => {
          const parts = item.split(',');
          return parts.length === 4;
        }).length;
      }
      
      return betAmount * getPricePerPoint() * count;
    }
    
    const totalMoney = selectedNumbers.length * betAmount * getPricePerPoint();
    return Math.floor(totalMoney / 1000);
  }, [selectedGameType, selectedNumbers, betAmount, bettingOddsData]);

  // Tính tiền thắng ước tính
  const calculateWinnings = useMemo(() => {
    if (selectedGameType === 'loto2s' || selectedGameType === 'loto-2-so' || selectedGameType === 'loto-3s' || selectedGameType === 'loto3s'
        || selectedGameType === 'loto-4s' || selectedGameType === 'loto4s'
        || selectedGameType === 'loto-xien-2'
        || selectedGameType === 'loto-xien-3'
        || selectedGameType === 'loto-xien-4'
        || selectedGameType === '3s-dac-biet'
        || selectedGameType === '4s-dac-biet'
        || selectedGameType === 'giai-nhat' || selectedGameType === 'dac-biet'
        || selectedGameType === 'dau-dac-biet' || selectedGameType === '3s-giai-nhat') {
      
      let count = selectedNumbers.length;
      
      if (selectedGameType === 'loto-xien-2') {
        count = selectedNumbers.filter(item => item.includes(',')).length;
      }
      
      if (selectedGameType === 'loto-xien-3') {
        count = selectedNumbers.filter(item => {
          const parts = item.split(',');
          return parts.length === 3;
        }).length;
      }
      
      if (selectedGameType === 'loto-xien-4') {
        count = selectedNumbers.filter(item => {
          const parts = item.split(',');
          return parts.length === 4;
        }).length;
      }
      
      return betAmount * getOdds() * count;
    }
    
    return selectedNumbers.length * betAmount * getOdds();
  }, [selectedGameType, selectedNumbers, betAmount, bettingOddsData]);

  return {
    totalAmount: calculateTotalAmount,
    totalPoints: calculateTotalPoints,
    potentialWinnings: calculateWinnings,
    pricePerPoint: getPricePerPoint(),
    odds: getOdds()
  };
};

