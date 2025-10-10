// Dữ liệu mẫu kết quả xổ số để test chức năng đặt cược
export const mockLotteryResults = {
  // Kết quả Miền Bắc - 09/10/2025
  mienBac: {
    date: "2025-10-09",
    region: "Miền Bắc",
    period: "Kỳ 09/10/2025",
    results: {
      "dac-biet": "09565", // Giải đặc biệt
      "giai-nhat": "14729", // Giải nhất
      "giai-nhi": ["68722", "61754"], // Giải nhì (2 số)
      "giai-ba": ["41093", "33880", "22844", "39220", "89108", "22328"], // Giải ba (6 số)
      "giai-tu": ["4631", "1236", "6574", "0622"], // Giải tư (4 số)
      "giai-nam": ["6850", "3557", "0740", "6760", "9439", "9164"], // Giải năm (6 số)
      "giai-sau": ["592", "108", "449"], // Giải sáu (3 số)
      "giai-bay": ["76", "24", "77", "01"] // Giải bảy (4 số)
    }
  },

  // Kết quả Miền Trung & Nam - 09/10/2025 (dữ liệu mẫu)
  mienTrungNam: {
    date: "2025-10-09", 
    region: "Miền Trung & Nam",
    period: "Kỳ 09/10/2025",
    results: {
      "dac-biet": "12345", // Giải đặc biệt
      "giai-nhat": "67890", // Giải nhất
      "giai-nhi": ["12345", "67890"], // Giải nhì
      "giai-ba": ["11111", "22222", "33333", "44444", "55555", "66666"], // Giải ba
      "giai-tu": ["7777", "8888", "9999", "0000"], // Giải tư
      "giai-nam": ["1111", "2222", "3333", "4444", "5555", "6666"], // Giải năm
      "giai-sau": ["777", "888", "999"], // Giải sáu
      "giai-bay": ["11", "22", "33", "44"] // Giải bảy
    }
  }
};

// Hàm lấy kết quả theo region
export const getLotteryResult = (region) => {
  return mockLotteryResults[region] || null;
};

// Hàm kiểm tra số trúng thưởng (sẽ dùng để tính toán kết quả cược)
export const checkWinningNumbers = (region, betType, selectedNumbers) => {
  const result = getLotteryResult(region);
  if (!result) return { isWin: false, winningNumbers: [], prize: 0 };

  const results = result.results;
  let isWin = false;
  let winningNumbers = [];
  let prize = 0;

  // Logic kiểm tra trúng thưởng theo từng loại cược
  switch (betType) {
    case 'loto2s':
    case 'loto-2-so':
      // Kiểm tra 2 số cuối của giải đặc biệt và các giải khác
      const lastTwoDigits = results["dac-biet"].slice(-2);
      winningNumbers = selectedNumbers.filter(num => 
        results["giai-nhat"].endsWith(num) ||
        results["giai-nhi"].some(giai => giai.endsWith(num)) ||
        results["giai-ba"].some(giai => giai.endsWith(num)) ||
        results["giai-tu"].some(giai => giai.endsWith(num)) ||
        results["giai-nam"].some(giai => giai.endsWith(num)) ||
        results["giai-sau"].some(giai => giai.endsWith(num)) ||
        results["giai-bay"].some(giai => giai.endsWith(num))
      );
      isWin = winningNumbers.length > 0;
      prize = isWin ? 99 : 0; // Tỷ lệ 1:99
      break;

    case 'dac-biet':
      // Đề đặc biệt - so sánh 2 số cuối
      const deDacBiet = results["dac-biet"].slice(-2);
      winningNumbers = selectedNumbers.filter(num => num === deDacBiet);
      isWin = winningNumbers.length > 0;
      prize = isWin ? 99 : 0;
      break;

    case 'giai-nhat':
      // Đề giải nhất - so sánh 2 số cuối
      const deGiaiNhat = results["giai-nhat"].slice(-2);
      winningNumbers = selectedNumbers.filter(num => num === deGiaiNhat);
      isWin = winningNumbers.length > 0;
      prize = isWin ? 99 : 0;
      break;

    case 'dau-duoi':
      // Đầu đuôi - kiểm tra số đầu và số cuối của giải đặc biệt
      const dacBietFull = results["dac-biet"];
      const dau = dacBietFull.slice(0, 1);
      const duoi = dacBietFull.slice(-1);
      winningNumbers = selectedNumbers.filter(num => 
        num.slice(0, 1) === dau || num.slice(-1) === duoi
      );
      isWin = winningNumbers.length > 0;
      prize = isWin ? 99 : 0;
      break;

    case 'loto-xien-2':
      // Xiên 2 - cần trúng cả 2 số
      const xien2Wins = selectedNumbers.filter(num => 
        results["giai-nhat"].endsWith(num) ||
        results["giai-nhi"].some(giai => giai.endsWith(num)) ||
        results["giai-ba"].some(giai => giai.endsWith(num)) ||
        results["giai-tu"].some(giai => giai.endsWith(num)) ||
        results["giai-nam"].some(giai => giai.endsWith(num)) ||
        results["giai-sau"].some(giai => giai.endsWith(num)) ||
        results["giai-bay"].some(giai => giai.endsWith(num))
      );
      isWin = xien2Wins.length === 2;
      winningNumbers = xien2Wins;
      prize = isWin ? 99 : 0;
      break;

    case 'loto-xien-3':
      // Xiên 3 - cần trúng cả 3 số
      const xien3Wins = selectedNumbers.filter(num => 
        results["giai-nhat"].endsWith(num) ||
        results["giai-nhi"].some(giai => giai.endsWith(num)) ||
        results["giai-ba"].some(giai => giai.endsWith(num)) ||
        results["giai-tu"].some(giai => giai.endsWith(num)) ||
        results["giai-nam"].some(giai => giai.endsWith(num)) ||
        results["giai-sau"].some(giai => giai.endsWith(num)) ||
        results["giai-bay"].some(giai => giai.endsWith(num))
      );
      isWin = xien3Wins.length === 3;
      winningNumbers = xien3Wins;
      prize = isWin ? 99 : 0;
      break;

    case 'loto-xien-4':
      // Xiên 4 - cần trúng cả 4 số
      const xien4Wins = selectedNumbers.filter(num => 
        results["giai-nhat"].endsWith(num) ||
        results["giai-nhi"].some(giai => giai.endsWith(num)) ||
        results["giai-ba"].some(giai => giai.endsWith(num)) ||
        results["giai-tu"].some(giai => giai.endsWith(num)) ||
        results["giai-nam"].some(giai => giai.endsWith(num)) ||
        results["giai-sau"].some(giai => giai.endsWith(num)) ||
        results["giai-bay"].some(giai => giai.endsWith(num))
      );
      isWin = xien4Wins.length === 4;
      winningNumbers = xien4Wins;
      prize = isWin ? 99 : 0;
      break;

    case 'loto-3s':
    case 'loto3s':
      // Lô 3 số - kiểm tra 3 số cuối
      const lastThreeDigits = results["dac-biet"].slice(-3);
      winningNumbers = selectedNumbers.filter(num => 
        results["giai-nhat"].endsWith(num) ||
        results["giai-nhi"].some(giai => giai.endsWith(num)) ||
        results["giai-ba"].some(giai => giai.endsWith(num))
      );
      isWin = winningNumbers.length > 0;
      prize = isWin ? 999 : 0; // Tỷ lệ 1:999
      break;

    case 'loto-4s':
    case 'loto4s':
      // Lô 4 số - kiểm tra 4 số cuối
      const lastFourDigits = results["dac-biet"].slice(-4);
      winningNumbers = selectedNumbers.filter(num => 
        results["giai-nhat"].endsWith(num) ||
        results["giai-nhi"].some(giai => giai.endsWith(num))
      );
      isWin = winningNumbers.length > 0;
      prize = isWin ? 9999 : 0; // Tỷ lệ 1:9999
      break;

    default:
      // Mặc định kiểm tra lô 2 số
      winningNumbers = selectedNumbers.filter(num => 
        results["giai-nhat"].endsWith(num) ||
        results["giai-nhi"].some(giai => giai.endsWith(num)) ||
        results["giai-ba"].some(giai => giai.endsWith(num)) ||
        results["giai-tu"].some(giai => giai.endsWith(num)) ||
        results["giai-nam"].some(giai => giai.endsWith(num)) ||
        results["giai-sau"].some(giai => giai.endsWith(num)) ||
        results["giai-bay"].some(giai => giai.endsWith(num))
      );
      isWin = winningNumbers.length > 0;
      prize = isWin ? 99 : 0;
      break;
  }

  return {
    isWin,
    winningNumbers,
    prize,
    totalWin: isWin ? winningNumbers.length * prize : 0
  };
};

// Hàm format hiển thị kết quả
export const formatLotteryResult = (region) => {
  const result = getLotteryResult(region);
  if (!result) return null;

  return {
    date: result.date,
    region: result.region,
    period: result.period,
    results: {
      "Giải đặc biệt": result.results["dac-biet"],
      "Giải nhất": result.results["giai-nhat"],
      "Giải nhì": result.results["giai-nhi"].join(", "),
      "Giải ba": result.results["giai-ba"].join(", "),
      "Giải tư": result.results["giai-tu"].join(", "),
      "Giải năm": result.results["giai-nam"].join(", "),
      "Giải sáu": result.results["giai-sau"].join(", "),
      "Giải bảy": result.results["giai-bay"].join(", ")
    }
  };
};
