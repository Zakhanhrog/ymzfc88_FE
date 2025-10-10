import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import pointService from '../../../services/pointService';
import bettingOddsService from '../../../services/bettingOddsService';
import betService from '../../../services/betService';
import { showNotification } from '../../../utils/notification';

const MienTrungNamGamePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedGameType, setSelectedGameType] = useState('loto-2-so');
  
  // Lấy tên cổng từ URL parameters
  const portName = searchParams.get('name') || 'Miền Trung & Nam';
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [betMultiplier, setBetMultiplier] = useState(1);
  const [betAmount, setBetAmount] = useState(1);
  const [activeTab, setActiveTab] = useState('selection');
  const [selectionMode, setSelectionMode] = useState('quick'); // 'quick' or 'input'
  const [numberInput, setNumberInput] = useState('');
  const [userPoints, setUserPoints] = useState(0);
  const [loadingPoints, setLoadingPoints] = useState(false);
  const [bettingOddsData, setBettingOddsData] = useState({});
  const [loadingOdds, setLoadingOdds] = useState(true);
  const [placingBet, setPlacingBet] = useState(false);
  const [recentBet, setRecentBet] = useState(null);

  // Game types for Miền Trung & Nam
  const gameTypes = [
    { id: 'loto-2-so', name: 'Loto 2 số', description: 'Lô 2 số' },
    { id: 'loto-xien-2', name: 'Loto xiên 2', description: 'Xiên 2 số' },
    { id: 'loto-xien-3', name: 'Loto xiên 3', description: 'Xiên 3 số' },
    { id: 'loto-xien-4', name: 'Loto xiên 4', description: 'Xiên 4 số' },
    { id: 'loto-3s', name: 'Loto 3s', description: 'Lô 3 số' },
    { id: 'loto-4s', name: 'Loto 4s', description: 'Lô 4 số' },
    { id: 'dac-biet', name: 'Đặc biệt', description: 'Đề đặc biệt' },
    { id: 'dau-duoi', name: 'Đầu / đuôi', description: 'Đầu đuôi' },
    { id: 'dau-dac-biet', name: 'Đầu đặc biệt', description: 'Đề đầu đặc biệt' },
    { id: 'de-giai-8', name: 'Đề giải 8', description: 'Đề giải 8' },
    { id: '3s-giai-7', name: '3s giải 7', description: '3 số giải 7' },
    { id: '3s-dau-duoi', name: '3s đầu đuôi', description: '3 số đầu đuôi' },
    { id: '3s-dac-biet', name: '3s đặc biệt', description: '3 số đặc biệt' },
    { id: '4s-dac-biet', name: '4s đặc biệt', description: '4 số đặc biệt' },
    { id: 'loto-truot-4', name: 'Loto trượt 4', description: 'Lô trượt 4' },
    { id: 'loto-truot-5', name: 'Loto trượt 5', description: 'Lô trượt 5' },
    { id: 'loto-truot-6', name: 'Loto trượt 6', description: 'Lô trượt 6' },
    { id: 'loto-truot-7', name: 'Loto trượt 7', description: 'Lô trượt 7' },
    { id: 'loto-truot-8', name: 'Loto trượt 8', description: 'Lô trượt 8' },
    { id: 'loto-truot-9', name: 'Loto trượt 9', description: 'Lô trượt 9' },
    { id: 'loto-truot-10', name: 'Loto trượt 10', description: 'Lô trượt 10' }
  ];

  const multipliers = [
    { value: 1, label: '1X', color: 'bg-purple-500' },
    { value: 3, label: '3X', color: 'bg-red-500' },
    { value: 5, label: '5X', color: 'bg-orange-500' },
    { value: 10, label: '10X', color: 'bg-green-500' }
  ];

  // Generate numbers 00-99 for selection
  const generateNumbers = () => {
    const numbers = [];
    for (let i = 0; i <= 99; i++) {
      numbers.push(i.toString().padStart(2, '0'));
    }
    return numbers;
  };

  const numbers = generateNumbers();

  const handleNumberSelect = (number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== number));
    } else {
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };

  const handleNumberInput = () => {
    // Parse input numbers separated by comma or space
    const inputNumbers = numberInput
      .split(/[,\s]+/)
      .map(num => num.trim())
      .filter(num => num.length > 0)
      .map(num => num.padStart(2, '0'))
      .filter(num => /^\d{2}$/.test(num) && parseInt(num) >= 0 && parseInt(num) <= 99);
    
    setSelectedNumbers([...new Set(inputNumbers)]); // Remove duplicates
    setNumberInput('');
  };

  const getCurrentGameType = () => {
    return gameTypes.find(gt => gt.id === selectedGameType);
  };

  const getOdds = () => {
    // Lấy tỷ lệ từ API data
    if (bettingOddsData[selectedGameType]) {
      return bettingOddsData[selectedGameType].odds;
    }
    // Nếu không có dữ liệu từ API, trả về 0
    return 0;
  };

  const getPricePerPoint = () => {
    // Lấy đơn giá từ API data
    if (bettingOddsData[selectedGameType]) {
      return bettingOddsData[selectedGameType].pricePerPoint;
    }
    // Nếu không có dữ liệu từ API, trả về 0
    return 0;
  };

  const calculateTotalAmount = () => {
    // Tính tổng tiền: số lô × số điểm × đơn giá 1 điểm
    return selectedNumbers.length * betAmount * getPricePerPoint();
  };

  const calculateTotalPoints = () => {
    // Tính tổng tiền thực tế rồi chia 1000 để quy thành điểm
    const totalMoney = selectedNumbers.length * betAmount * getPricePerPoint();
    return Math.floor(totalMoney / 1000); // Chia 1000 để quy thành điểm
  };

  const handleMultiplierClick = (multiplierValue) => {
    // Cộng nhanh số điểm khi bấm hệ số
    setBetAmount(prev => prev + multiplierValue);
  };

  // Load user points và betting odds khi component mount
  useEffect(() => {
    loadUserPoints();
    loadBettingOdds();
  }, []);

  const loadUserPoints = async () => {
    try {
      setLoadingPoints(true);
      
      // Thử gọi API wallet/balance trước (có points)
      const walletResponse = await fetch('http://localhost:8080/api/wallet/balance', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (walletResponse.ok) {
        const walletData = await walletResponse.json();
        if (walletData.success && walletData.data.points !== undefined) {
          setUserPoints(walletData.data.points || 0);
          return;
        }
      }
      
      // Fallback: gọi pointService
      const response = await pointService.getMyPoints();
      if (response.success) {
        const pointsAmount = response.data.totalPoints || 0;
        setUserPoints(pointsAmount);
      } else {
        setUserPoints(0);
      }
    } catch (error) {
      console.error('Error loading user points:', error);
      setUserPoints(0);
    } finally {
      setLoadingPoints(false);
    }
  };

  const loadBettingOdds = async () => {
    try {
      setLoadingOdds(true);
      const response = await bettingOddsService.getMienTrungNamBettingOdds();
      
      if (response.success) {
        // Convert array to map for easy lookup
        const oddsMap = {};
        response.data.forEach(odds => {
          oddsMap[odds.betType] = {
            odds: odds.odds,
            pricePerPoint: odds.pricePerPoint,
            betName: odds.betName,
            description: odds.description
          };
        });
        setBettingOddsData(oddsMap);
      } else {
        console.error('Error loading betting odds:', response.message);
        // Use default values if API fails
        setBettingOddsData({});
      }
    } catch (error) {
      console.error('Error loading betting odds:', error);
      setBettingOddsData({});
    } finally {
      setLoadingOdds(false);
    }
  };

  const handlePlaceBet = async () => {
    if (selectedNumbers.length === 0) {
      showNotification('Vui lòng chọn ít nhất 1 số', 'error');
      return;
    }

    if (betAmount <= 0) {
      showNotification('Số điểm cược phải lớn hơn 0', 'error');
      return;
    }

    const totalCost = calculateTotalPoints();
    if (userPoints < totalCost) {
      showNotification('Số dư không đủ để đặt cược', 'error');
      return;
    }

    try {
      setPlacingBet(true);

      const betData = betService.formatBetData(
        'mienTrungNam',
        selectedGameType,
        selectedNumbers,
        betAmount,
        getPricePerPoint(),
        getOdds()
      );

      const response = await betService.placeBet(betData);

      if (response.success) {
        setRecentBet(response.data);
        showNotification('Đặt cược thành công! Kết quả sẽ có sau 5 giây', 'success');
        
        // Cập nhật số dư user
        await loadUserPoints();
        
        // Reset form
        setSelectedNumbers([]);
        setBetAmount(1);
        
        // Sau 5 giây kiểm tra kết quả
        setTimeout(() => {
          checkBetResult(response.data.id);
        }, 5000);
        
      } else {
        showNotification(response.message || 'Có lỗi xảy ra khi đặt cược', 'error');
      }
    } catch (error) {
      console.error('Error placing bet:', error);
      showNotification(error.message || 'Có lỗi xảy ra khi đặt cược', 'error');
    } finally {
      setPlacingBet(false);
    }
  };

  const checkBetResult = async (betId) => {
    try {
      const response = await betService.getBetById(betId);
      if (response.success) {
        const bet = response.data;
        if (bet.status === 'WON') {
          showNotification(`🎉 Chúc mừng! Bạn đã thắng ${bet.winAmount.toLocaleString()} điểm!`, 'success');
        } else if (bet.status === 'LOST') {
          showNotification('😔 Rất tiếc, bạn đã thua cược này', 'info');
        }
        
        // Cập nhật số dư
        await loadUserPoints();
      }
    } catch (error) {
      console.error('Error checking bet result:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Custom Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/lottery')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Icon icon="mdi:arrow-left" className="w-5 h-5" />
          Quay lại
        </button>
        
        <div className="text-right">
          <div className="text-sm text-gray-600">hung5285</div>
          <div className="text-sm font-semibold text-[#D30102]">
            {loadingPoints ? 'Đang tải...' : `${userPoints.toLocaleString()} điểm`}
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)] bg-gray-50 justify-center pt-6">
        <div className="flex max-w-7xl w-full gap-4 items-start">
          {/* Left Sidebar - Game Types */}
          <div className="w-56 bg-white shadow-lg overflow-y-auto rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-800">{portName}</h3>
            </div>
            
            <div className="p-4">
              <h3 className="text-base font-semibold text-gray-800 mb-3">Loại chơi</h3>
              <div className="space-y-1">
                {gameTypes.map((gameType) => (
                  <button
                    key={gameType.id}
                    onClick={() => setSelectedGameType(gameType.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all text-base ${
                      selectedGameType === gameType.id
                        ? 'bg-yellow-100 text-gray-900 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {gameType.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 max-w-4xl mx-auto p-4 overflow-y-auto bg-white shadow-lg rounded-lg">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#D30102] to-[#B80102] text-white p-4 rounded-lg mb-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-bold mb-1">{portName}</h1>
                  <div className="flex items-center gap-3 text-red-100 text-sm">
                    <span>Thứ 6</span>
                    <span>Lượt xổ: 10/10/2025</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-red-700 px-3 py-1.5 rounded-lg">
                    <span className="text-base font-mono">17 : 40 : 09</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-red-100">Kỳ 09/10/2025, giải đặc biệt</div>
                    <div className="flex gap-1 mt-1">
                      {['0', '9', '5', '6', '5'].map((num, index) => (
                        <div key={index} className="w-6 h-6 bg-red-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {num}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Game Selection */}
            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold">{getCurrentGameType()?.name}</h2>
              </div>
              
              <div className="mb-3">
                {loadingOdds ? (
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
                    <span>Đang tải tỷ lệ cược...</span>
                  </div>
                ) : (
                  <>
                    <span className="text-gray-600 text-sm">Tỷ lệ cược: 1 ăn {getOdds()}</span>
                    <br />
                    <span className="text-gray-600 text-sm">Đơn giá: {getPricePerPoint().toLocaleString()}đ/điểm</span>
                  </>
                )}
              </div>

              {/* Selection Mode Tabs */}
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  onClick={() => setSelectionMode('quick')}
                  className={`flex-1 py-3 px-4 text-center font-medium transition-colors text-base ${
                    selectionMode === 'quick'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Chọn số nhanh
                </button>
                <button
                  onClick={() => setSelectionMode('input')}
                  className={`flex-1 py-3 px-4 text-center font-medium transition-colors text-base ${
                    selectionMode === 'input'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Nhập số
                </button>
              </div>

              {/* Selection Content */}
              {selectionMode === 'quick' ? (
                /* Number Grid */
                <div className="grid grid-cols-10 gap-1.5">
                  {numbers.map((number) => (
                    <button
                      key={number}
                      onClick={() => handleNumberSelect(number)}
                      className={`w-10 h-10 rounded-lg font-medium transition-all text-base ${
                        selectedNumbers.includes(number)
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                </div>
              ) : (
                /* Number Input */
                <div>
                  <div className="mb-3">
                    <h3 className="text-base font-medium text-gray-800 mb-2">Cách chơi:</h3>
                    <p className="text-sm text-gray-600">
                      Giữa mỗi cược cần phân cách bởi dấu , hoặc khoảng trống. Ví dụ: 10,20,30 hoặc 10 20 30
                    </p>
                  </div>
                  <div className="space-y-3">
                    <textarea
                      value={numberInput}
                      onChange={(e) => setNumberInput(e.target.value)}
                      placeholder="Nhập các số bạn muốn chọn..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={4}
                    />
                    <button
                      onClick={handleNumberInput}
                      className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-base"
                    >
                      Áp dụng số đã nhập
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Bet Summary */}
          <div className="w-72 bg-white shadow-lg overflow-y-auto rounded-lg">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('selection')}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors text-base ${
                activeTab === 'selection'
                  ? 'bg-[#D30102] text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Bảng chọn
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors text-base ${
                activeTab === 'history'
                  ? 'bg-[#D30102] text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Lịch sử
            </button>
          </div>

            <div className="p-4">
              {/* Multipliers */}
              <div className="mb-4">
                <h3 className="text-base font-semibold mb-2">Hệ số</h3>
                <div className="flex gap-2">
                  {multipliers.map((mult) => (
                    <button
                      key={mult.value}
                      onClick={() => handleMultiplierClick(mult.value)}
                      className="w-10 h-10 rounded-full text-white font-bold transition-all text-base bg-gray-300 hover:bg-gray-400"
                    >
                      {mult.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bet Amount */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điểm cược
                </label>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  min="1"
                />
              </div>

              {/* Summary */}
              <div className="space-y-2 mb-4 text-base">
                {selectedNumbers.length > 0 && (
                  <div className="text-gray-600 text-sm">
                    Số đã chọn: {selectedNumbers.join(', ')}
                  </div>
                )}
                {selectedNumbers.length > 0 && (
                  <>
                    <div className="text-gray-600">
                      Tổng tiền cược: {calculateTotalPoints().toLocaleString()}
                    </div>
                    <div className="text-gray-600">
                      Tiền thắng: {(calculateTotalPoints() * getOdds()).toLocaleString()}
                    </div>
                  </>
                )}
                <div className="text-gray-600">
                  Số dư: {loadingPoints ? 'Đang tải...' : userPoints.toLocaleString()}
                </div>

                {/* Recent Bet Info */}
                {recentBet && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm text-blue-800">
                      <div className="font-medium mb-1">Cược gần đây:</div>
                      <div>Số: {recentBet.selectedNumbers?.join(', ')}</div>
                      <div>Tiền cược: {recentBet.totalAmount?.toLocaleString()}đ</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span>Trạng thái:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          recentBet.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          recentBet.status === 'WON' ? 'bg-green-100 text-green-800' :
                          recentBet.status === 'LOST' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {recentBet.status === 'PENDING' ? 'Chờ kết quả' :
                           recentBet.status === 'WON' ? 'Thắng' :
                           recentBet.status === 'LOST' ? 'Thua' : recentBet.status}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setSelectedNumbers([]);
                    setBetAmount(1);
                  }}
                  className="w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-base"
                >
                  Cài lại
                </button>
                <button
                  onClick={handlePlaceBet}
                  disabled={placingBet || selectedNumbers.length === 0}
                  className={`w-full py-2 text-white rounded-lg transition-colors font-medium text-base ${
                    placingBet || selectedNumbers.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#D30102] hover:bg-[#B80102]'
                  }`}
                >
                  {placingBet ? (
                    <div className="flex items-center justify-center gap-2">
                      <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
                      <span>Đang đặt cược...</span>
                    </div>
                  ) : (
                    'Đặt cược'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
  );
};

export default MienTrungNamGamePage;
