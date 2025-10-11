// Dữ liệu mẫu kết quả xổ số để test chức năng đặt cược
export const mockLotteryResults = {
  // Kết quả Miền Bắc - 09/10/2025 (7 giải)
  mienBac: {
    date: "2025-10-09",
    region: "Miền Bắc",
    period: "Kỳ 09/10/2025",
    results: {
      "dac-biet": "00943", // Giải đặc biệt
      "giai-nhat": "43213", // Giải nhất
      "giai-nhi": ["66146", "15901"], // Giải nhì (2 số)
      "giai-ba": ["22906", "04955", "93893", "32538", "25660", "85773"], // Giải ba (6 số)
      "giai-tu": ["8964", "0803", "4867", "2405"], // Giải tư (4 số)
      "giai-nam": ["9122", "6281", "8813", "6672", "8101", "7293"], // Giải năm (6 số)
      "giai-sau": ["803", "301", "325"], // Giải sáu (3 số)
      "giai-bay": ["84", "09", "69", "79"] // Giải bảy (4 số)
    }
  },

  // Kết quả Miền Trung & Nam - 09/10/2025 (8 giải)
  mienTrungNam: {
    date: "2025-10-09", 
    region: "Miền Trung & Nam",
    period: "Kỳ 09/10/2025",
    results: {
      "dac-biet": "042293", // Giải đặc biệt (6 số)
      "giai-nhat": "02518", // Giải nhất (5 số)
      "giai-nhi": ["49226"], // Giải nhì (1 số)
      "giai-ba": ["03856", "04216"], // Giải ba (2 số)
      "giai-tu": ["00810", "02321", "00681", "51728", "24507", "58068", "96136"], // Giải tư (7 số)
      "giai-nam": ["8877"], // Giải năm (1 số)
      "giai-sau": ["5934", "7442", "3430"], // Giải sáu (3 số)
      "giai-bay": ["884"], // Giải bảy (1 số)
      "giai-tam": ["40"] // Giải tám (1 số)
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
      const giaiNhiArray = Array.isArray(results["giai-nhi"]) ? results["giai-nhi"] : [results["giai-nhi"]];
      const giaiNamArray = Array.isArray(results["giai-nam"]) ? results["giai-nam"] : [results["giai-nam"]];
      const giaiBayArray = Array.isArray(results["giai-bay"]) ? results["giai-bay"] : [results["giai-bay"]];
      
      winningNumbers = selectedNumbers.filter(num => 
        results["giai-nhat"].endsWith(num) ||
        giaiNhiArray.some(giai => giai.endsWith(num)) ||
        results["giai-ba"].some(giai => giai.endsWith(num)) ||
        results["giai-tu"].some(giai => giai.endsWith(num)) ||
        giaiNamArray.some(giai => giai.endsWith(num)) ||
        results["giai-sau"].some(giai => giai.endsWith(num)) ||
        giaiBayArray.some(giai => giai.endsWith(num)) ||
        (results["giai-tam"] && results["giai-tam"].some(giai => giai.endsWith(num)))
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
      const xien2GiaiNhiArray = Array.isArray(results["giai-nhi"]) ? results["giai-nhi"] : [results["giai-nhi"]];
      const xien2GiaiNamArray = Array.isArray(results["giai-nam"]) ? results["giai-nam"] : [results["giai-nam"]];
      const xien2GiaiBayArray = Array.isArray(results["giai-bay"]) ? results["giai-bay"] : [results["giai-bay"]];
      
      const xien2Wins = selectedNumbers.filter(num => 
        results["giai-nhat"].endsWith(num) ||
        xien2GiaiNhiArray.some(giai => giai.endsWith(num)) ||
        results["giai-ba"].some(giai => giai.endsWith(num)) ||
        results["giai-tu"].some(giai => giai.endsWith(num)) ||
        xien2GiaiNamArray.some(giai => giai.endsWith(num)) ||
        results["giai-sau"].some(giai => giai.endsWith(num)) ||
        xien2GiaiBayArray.some(giai => giai.endsWith(num)) ||
        (results["giai-tam"] && results["giai-tam"].some(giai => giai.endsWith(num)))
      );
      isWin = xien2Wins.length === 2;
      winningNumbers = xien2Wins;
      prize = isWin ? 99 : 0;
      break;

    case 'loto-xien-3':
      // Xiên 3 - cần trúng cả 3 số
      const xien3GiaiNhiArray = Array.isArray(results["giai-nhi"]) ? results["giai-nhi"] : [results["giai-nhi"]];
      const xien3GiaiNamArray = Array.isArray(results["giai-nam"]) ? results["giai-nam"] : [results["giai-nam"]];
      const xien3GiaiBayArray = Array.isArray(results["giai-bay"]) ? results["giai-bay"] : [results["giai-bay"]];
      
      const xien3Wins = selectedNumbers.filter(num => 
        results["giai-nhat"].endsWith(num) ||
        xien3GiaiNhiArray.some(giai => giai.endsWith(num)) ||
        results["giai-ba"].some(giai => giai.endsWith(num)) ||
        results["giai-tu"].some(giai => giai.endsWith(num)) ||
        xien3GiaiNamArray.some(giai => giai.endsWith(num)) ||
        results["giai-sau"].some(giai => giai.endsWith(num)) ||
        xien3GiaiBayArray.some(giai => giai.endsWith(num)) ||
        (results["giai-tam"] && results["giai-tam"].some(giai => giai.endsWith(num)))
      );
      isWin = xien3Wins.length === 3;
      winningNumbers = xien3Wins;
      prize = isWin ? 99 : 0;
      break;

    case 'loto-xien-4':
      // Xiên 4 - cần trúng cả 4 số
      const xien4GiaiNhiArray = Array.isArray(results["giai-nhi"]) ? results["giai-nhi"] : [results["giai-nhi"]];
      const xien4GiaiNamArray = Array.isArray(results["giai-nam"]) ? results["giai-nam"] : [results["giai-nam"]];
      const xien4GiaiBayArray = Array.isArray(results["giai-bay"]) ? results["giai-bay"] : [results["giai-bay"]];
      
      const xien4Wins = selectedNumbers.filter(num => 
        results["giai-nhat"].endsWith(num) ||
        xien4GiaiNhiArray.some(giai => giai.endsWith(num)) ||
        results["giai-ba"].some(giai => giai.endsWith(num)) ||
        results["giai-tu"].some(giai => giai.endsWith(num)) ||
        xien4GiaiNamArray.some(giai => giai.endsWith(num)) ||
        results["giai-sau"].some(giai => giai.endsWith(num)) ||
        xien4GiaiBayArray.some(giai => giai.endsWith(num)) ||
        (results["giai-tam"] && results["giai-tam"].some(giai => giai.endsWith(num)))
      );
      isWin = xien4Wins.length === 4;
      winningNumbers = xien4Wins;
      prize = isWin ? 99 : 0;
      break;

    case 'loto-3s':
    case 'loto3s':
      // Lô 3 số - kiểm tra 3 số cuối
      const lastThreeDigits = results["dac-biet"].slice(-3);
      const loto3sGiaiNhiArray = Array.isArray(results["giai-nhi"]) ? results["giai-nhi"] : [results["giai-nhi"]];
      
      winningNumbers = selectedNumbers.filter(num => 
        results["giai-nhat"].endsWith(num) ||
        loto3sGiaiNhiArray.some(giai => giai.endsWith(num)) ||
        results["giai-ba"].some(giai => giai.endsWith(num))
      );
      isWin = winningNumbers.length > 0;
      prize = isWin ? 999 : 0; // Tỷ lệ 1:999
      break;

    case 'loto-4s':
    case 'loto4s':
      // Lô 4 số - kiểm tra 4 số cuối
      const lastFourDigits = results["dac-biet"].slice(-4);
      const loto4sGiaiNhiArray = Array.isArray(results["giai-nhi"]) ? results["giai-nhi"] : [results["giai-nhi"]];
      
      winningNumbers = selectedNumbers.filter(num => 
        results["giai-nhat"].endsWith(num) ||
        loto4sGiaiNhiArray.some(giai => giai.endsWith(num))
      );
      isWin = winningNumbers.length > 0;
      prize = isWin ? 9999 : 0; // Tỷ lệ 1:9999
      break;

    default:
      // Mặc định kiểm tra lô 2 số
      const defaultGiaiNhiArray = Array.isArray(results["giai-nhi"]) ? results["giai-nhi"] : [results["giai-nhi"]];
      const defaultGiaiNamArray = Array.isArray(results["giai-nam"]) ? results["giai-nam"] : [results["giai-nam"]];
      const defaultGiaiBayArray = Array.isArray(results["giai-bay"]) ? results["giai-bay"] : [results["giai-bay"]];
      
      winningNumbers = selectedNumbers.filter(num => 
        results["giai-nhat"].endsWith(num) ||
        defaultGiaiNhiArray.some(giai => giai.endsWith(num)) ||
        results["giai-ba"].some(giai => giai.endsWith(num)) ||
        results["giai-tu"].some(giai => giai.endsWith(num)) ||
        defaultGiaiNamArray.some(giai => giai.endsWith(num)) ||
        results["giai-sau"].some(giai => giai.endsWith(num)) ||
        defaultGiaiBayArray.some(giai => giai.endsWith(num)) ||
        (results["giai-tam"] && results["giai-tam"].some(giai => giai.endsWith(num)))
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

  const formattedResults = {
    "Giải đặc biệt": result.results["dac-biet"],
    "Giải nhất": result.results["giai-nhat"],
    "Giải nhì": Array.isArray(result.results["giai-nhi"]) ? result.results["giai-nhi"].join(", ") : result.results["giai-nhi"],
    "Giải ba": result.results["giai-ba"].join(", "),
    "Giải tư": result.results["giai-tu"].join(", "),
    "Giải năm": Array.isArray(result.results["giai-nam"]) ? result.results["giai-nam"].join(", ") : result.results["giai-nam"],
    "Giải sáu": result.results["giai-sau"].join(", "),
    "Giải bảy": Array.isArray(result.results["giai-bay"]) ? result.results["giai-bay"].join(", ") : result.results["giai-bay"]
  };

  // Thêm giải tám cho miền Trung Nam
  if (region === 'mienTrungNam' && result.results["giai-tam"]) {
    formattedResults["Giải tám"] = result.results["giai-tam"].join(", ");
  }

  return {
    date: result.date,
    region: result.region,
    period: result.period,
    results: formattedResults
  };
};
