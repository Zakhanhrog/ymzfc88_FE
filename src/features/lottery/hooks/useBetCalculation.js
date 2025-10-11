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
        || selectedGameType === 'dau-dac-biet' || selectedGameType === '3s-giai-nhat'
        || selectedGameType === '3s-giai-6' || selectedGameType === 'de-giai-7' || selectedGameType === 'dau-duoi' || selectedGameType === '3s-dau-duoi' || selectedGameType === 'de-giai-8' || selectedGameType === '3s-giai-7'
        || selectedGameType === 'loto-truot-4' || selectedGameType === 'loto-truot-8' || selectedGameType === 'loto-truot-10') {
      
      let count = selectedNumbers.length;
      
      // ĐẶC BIỆT: multiplier cho các loại đặc biệt
      let multiplier = 1;
      if (selectedGameType === 'de-giai-7') {
        multiplier = 4; // Giải 7 có 4 số
      } else if (selectedGameType === '3s-giai-6') {
        multiplier = 3; // Giải 6 có 3 số
      } else if (selectedGameType === 'dau-duoi') {
        multiplier = 5; // Giải đặc biệt (1) + Giải 7 (4) = 5 số
      } else if (selectedGameType === '3s-dau-duoi') {
        multiplier = 4; // Giải đặc biệt (1) + Giải 6 (3) = 4 số
      }
      
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
      
      // Loto trượt 4: đếm số cụm 4 số hoàn chỉnh
      if (selectedGameType === 'loto-truot-4') {
        count = selectedNumbers.filter(item => {
          const parts = item.split(',');
          return parts.length === 4;
        }).length;
      }
      
      // Loto trượt 8: đếm số cụm 8 số hoàn chỉnh
      if (selectedGameType === 'loto-truot-8') {
        count = selectedNumbers.filter(item => {
          const parts = item.split(',');
          return parts.length === 8;
        }).length;
      }
      
      // Loto trượt 10: đếm số cụm 10 số hoàn chỉnh
      if (selectedGameType === 'loto-truot-10') {
        count = selectedNumbers.filter(item => {
          const parts = item.split(',');
          return parts.length === 10;
        }).length;
      }
      
      return betAmount * getPricePerPoint() * count * multiplier;
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
        || selectedGameType === 'dau-dac-biet' || selectedGameType === '3s-giai-nhat'
        || selectedGameType === '3s-giai-6' || selectedGameType === 'de-giai-7' || selectedGameType === 'dau-duoi' || selectedGameType === '3s-dau-duoi' || selectedGameType === 'de-giai-8' || selectedGameType === '3s-giai-7'
        || selectedGameType === 'loto-truot-4' || selectedGameType === 'loto-truot-8' || selectedGameType === 'loto-truot-10') {
      
      let count = selectedNumbers.length;
      
      let multiplier = 1;
      if (selectedGameType === 'de-giai-7') {
        multiplier = 4;
      } else if (selectedGameType === '3s-giai-6') {
        multiplier = 3;
      } else if (selectedGameType === 'dau-duoi') {
        multiplier = 5;
      } else if (selectedGameType === '3s-dau-duoi') {
        multiplier = 4;
      }
      
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
      
      if (selectedGameType === 'loto-truot-4') {
        count = selectedNumbers.filter(item => {
          const parts = item.split(',');
          return parts.length === 4;
        }).length;
      }
      
      if (selectedGameType === 'loto-truot-8') {
        count = selectedNumbers.filter(item => {
          const parts = item.split(',');
          return parts.length === 8;
        }).length;
      }
      
      if (selectedGameType === 'loto-truot-10') {
        count = selectedNumbers.filter(item => {
          const parts = item.split(',');
          return parts.length === 10;
        }).length;
      }
      
      return betAmount * getPricePerPoint() * count * multiplier;
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
        || selectedGameType === 'dau-dac-biet' || selectedGameType === '3s-giai-nhat'
        || selectedGameType === '3s-giai-6' || selectedGameType === 'de-giai-7' || selectedGameType === 'dau-duoi' || selectedGameType === '3s-dau-duoi' || selectedGameType === 'de-giai-8' || selectedGameType === '3s-giai-7'
        || selectedGameType === 'loto-truot-4' || selectedGameType === 'loto-truot-8' || selectedGameType === 'loto-truot-10') {
      
      let count = selectedNumbers.length;
      
      // LƯU Ý: de-giai-7 tiền THẮNG KHÔNG × 4, 3s-giai-6 KHÔNG × 3, dau-duoi KHÔNG × 5, 3s-dau-duoi KHÔNG × 4 (chỉ tiền cược nhân)
      
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
      
      if (selectedGameType === 'loto-truot-4') {
        count = selectedNumbers.filter(item => {
          const parts = item.split(',');
          return parts.length === 4;
        }).length;
      }
      
      if (selectedGameType === 'loto-truot-8') {
        count = selectedNumbers.filter(item => {
          const parts = item.split(',');
          return parts.length === 8;
        }).length;
      }
      
      if (selectedGameType === 'loto-truot-10') {
        count = selectedNumbers.filter(item => {
          const parts = item.split(',');
          return parts.length === 10;
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

