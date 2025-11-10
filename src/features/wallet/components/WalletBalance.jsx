import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../../../components/ui';
import { Icon } from '@iconify/react';
import { message } from '../../../utils/notification';
import Loading from '../../../components/common/Loading';
import walletService from '../services/walletService';
import pointService from '../../../services/pointService';
import promotionService from '../../../services/promotionService';
import { useNavigate } from 'react-router-dom';
import { Tag, Typography, Card as AntCard } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const WalletBalance = ({ onTabChange }) => {
  const navigate = useNavigate();
  const [walletData, setWalletData] = useState(null);
  const [pointData, setPointData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [userName, setUserName] = useState('');
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [transactionTab, setTransactionTab] = useState('DEPOSIT');
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [loadingPromotions, setLoadingPromotions] = useState(false);
  const promotionsScrollRef = useRef(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  useEffect(() => {
    loadWalletBalance();
    loadUserPoints();
    loadRecentTransactions();
    loadPromotions();
    // Get username from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserName(userData.username || userData.name || '');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Reload transactions when component becomes visible (e.g., after deposit/withdraw)
  useEffect(() => {
    const handleFocus = () => {
      loadRecentTransactions();
    };
    
    // Listen for transaction created event
    const handleTransactionCreated = () => {
      // Refresh immediately and then retry after delay to ensure backend has processed
      loadRecentTransactions();
      loadWalletBalance();
      
      // Retry after delay to catch any transactions that might take longer to process
      setTimeout(() => {
        loadRecentTransactions();
        loadWalletBalance();
      }, 1000);
      
      // One more retry after longer delay
      setTimeout(() => {
        loadRecentTransactions();
        loadWalletBalance();
      }, 3000);
    };
    
    window.addEventListener('focus', handleFocus);
    window.addEventListener('transactionCreated', handleTransactionCreated);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('transactionCreated', handleTransactionCreated);
    };
  }, [transactionTab]);

  useEffect(() => {
    loadRecentTransactions();
  }, [transactionTab]);

  // Track scroll position for promotions
  useEffect(() => {
    const scrollContainer = promotionsScrollRef.current;
    if (!scrollContainer) return;

    const checkScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      // Show indicator if not scrolled to bottom (with 5px threshold)
      const canScrollDown = scrollTop + clientHeight < scrollHeight - 5;
      setShowScrollIndicator(canScrollDown);
    };

    // Initial check
    checkScroll();

    // Check on scroll
    scrollContainer.addEventListener('scroll', checkScroll);
    // Check when promotions change
    const resizeObserver = new ResizeObserver(checkScroll);
    resizeObserver.observe(scrollContainer);

    return () => {
      scrollContainer.removeEventListener('scroll', checkScroll);
      resizeObserver.disconnect();
    };
  }, [promotions, loadingPromotions]);

  const loadRecentTransactions = async () => {
    try {
      setLoadingTransactions(true);
      // Load tất cả giao dịch với size lớn
      const response = await walletService.getTransactionHistory(0, 100);
      if (response.success) {
        let transactions = response.data.content || [];
        // Filter by type if not 'all'
        if (transactionTab !== 'all') {
          transactions = transactions.filter(t => t.type === transactionTab);
        }
        // Sắp xếp theo createdAt DESC (mới nhất trước) để đảm bảo thứ tự đúng
        transactions.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA; // DESC order
        });
        setRecentTransactions(transactions);
      }
    } catch (error) {
      console.error('Error loading recent transactions:', error);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const loadPromotions = async () => {
    try {
      setLoadingPromotions(true);
      const response = await promotionService.getActivePromotions();
      setPromotions(response.slice(0, 3));
    } catch (error) {
      console.error('Error loading promotions:', error);
    } finally {
      setLoadingPromotions(false);
    }
  };

  const loadWalletBalance = async () => {
    try {
      setLoading(true);
      console.log('Loading wallet balance...');
      const response = await walletService.getWalletBalance();
      console.log('Wallet balance response:', response);

      if (response && response.success) {
        setWalletData(response.data);
      } else {
        console.warn('Wallet balance response not successful:', response);
        // Fallback data nếu không thể tải được - không hiển thị error cho 403
        setWalletData({
          points: 0,
          totalDeposit: 0,
          totalWithdraw: 0,
          totalBonus: 0,
          frozenAmount: 0
        });
        // Chỉ hiển thị warning nếu không phải lỗi 403
        if (response?.status !== 403) {
          message.warning('Không thể tải số dữ liệu từ server, hiển thị dữ liệu mặc định');
        }
      }
    } catch (error) {
      console.error('Error loading wallet balance:', error);
      // Fallback data khi có lỗi - không hiển thị error cho 403
      setWalletData({
        points: 0,
        totalDeposit: 0,
        totalWithdraw: 0,
        totalBonus: 0,
        frozenAmount: 0
      });
      // Chỉ hiển thị error nếu không phải lỗi permission
      if (!error.message?.includes('không có quyền') && !error.message?.includes('403')) {
        message.error('Lỗi khi tải thông tin ví: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadUserPoints = async () => {
    try {
      console.log('Loading user points...');
      const response = await pointService.getMyPoints();
      console.log('User points response:', response);
      if (response.success) {
        setPointData(response.data);
      } else {
        console.warn('User points response not successful:', response);
        setPointData({
          totalPoints: 0,
          lifetimeEarned: 0,
          lifetimeSpent: 0
        });
      }
    } catch (error) {
      console.error('Error loading user points:', error);
      setPointData({
        totalPoints: 0,
        lifetimeEarned: 0,
        lifetimeSpent: 0
      });
    }
  };

  const onToggleBalance = () => {
    setBalanceVisible(!balanceVisible);
  };

  const formatPoints = (points) => {
    if (!balanceVisible) return '****';
    return points ? points.toLocaleString() + ' điểm' : '0 điểm';
  };

  if (loading && !walletData) {
    return (
      <Card className="text-center">
        <CardContent className="py-16">
          <Loading />
        </CardContent>
      </Card>
    );
  }

  const {
    points = 0,
    totalDeposit = 0,
    totalWithdraw = 0,
    totalBonus = 0,
    frozenAmount = 0
  } = walletData || {};

  const {
    totalPoints = 0,
    lifetimeEarned = 0,
    lifetimeSpent = 0
  } = pointData || {};
  
  const displayPoints = points || totalPoints;

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Welcome/Info Card - Top of page */}
        <Card className="border border-gray-200 shadow-sm bg-white rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4">
              {/* Left Section - User Profile */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <img 
                    src="/iconacc/imgi_29_account.avif" 
                    alt="Account"
                    className="w-10 h-10"
                  />
                </div>
                <div className="flex flex-col justify-center" style={{ justifyContent: 'center', height: '100%' }}>
                  <p className="text-gray-600 text-sm whitespace-nowrap" style={{ lineHeight: '1.2', margin: 0, padding: 0 }}>Xin chào,</p>
                  <p className="text-gray-900 text-lg font-semibold whitespace-nowrap" style={{ lineHeight: '1.2', margin: 0, padding: 0, marginTop: '2px' }}>{userName || 'Người dùng'}</p>
                </div>
              </div>

              {/* Right Section - Promotion Banner */}
              <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 w-1/2 ml-auto">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center justify-center flex-shrink-0">
                    <img 
                      src="/iconacc/imgi_34_wallet.svg" 
                      alt="Wallet"
                      className="w-14 h-14"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 text-base font-bold mb-0.5">Tăng Số Dư, Nâng Cơ Hội!</p>
                    <p className="text-gray-600 text-sm">Nạp ngay để nhận thưởng !</p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  className="h-11 px-6 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white font-semibold border-none flex-shrink-0"
                  onClick={() => onTabChange && onTabChange('deposit-withdraw')}
                >
                  Nạp Ngay
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Two Column Section: Recent Transactions & Promotions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left: Recent Transactions */}
          <Card className="border border-gray-200 shadow-sm bg-white rounded-2xl flex flex-col">
            <CardHeader className="pb-3 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src="/iconacc/imgi_28_history.avif" alt="History" className="w-5 h-5" />
                  <CardTitle className="text-lg font-semibold text-gray-900">Giao Dịch Gần Đây</CardTitle>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  className="text-green-600 hover:text-green-700 p-0 h-auto"
                  onClick={() => onTabChange && onTabChange('transaction-history')}
                >
                  Xem Thêm <Icon icon="mdi:chevron-right" className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
              {/* Tabs */}
              <div className="flex gap-2 mb-4 flex-shrink-0">
                <button
                  onClick={() => setTransactionTab('DEPOSIT')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    transactionTab === 'DEPOSIT'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Nạp
                </button>
                <button
                  onClick={() => setTransactionTab('WITHDRAW')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    transactionTab === 'WITHDRAW'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Rút
                </button>
              </div>

              {/* Transaction List */}
              {loadingTransactions ? (
                <div className="flex justify-center py-8">
                  <Loading />
                </div>
              ) : recentTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  Chưa có giao dịch nào
                </div>
              ) : (
                <div className="flex-1 overflow-hidden flex flex-col">
                  {/* Table Header */}
                  <div className="grid grid-cols-4 gap-4 pb-2 border-b border-gray-200 flex-shrink-0">
                    <div className="text-sm font-semibold text-gray-700">Ngày</div>
                    <div className="text-sm font-semibold text-gray-700">Số Tiền</div>
                    <div className="text-sm font-semibold text-gray-700">Phương Thức</div>
                    <div className="text-sm font-semibold text-gray-700">Trạng Thái</div>
                  </div>
                  
                  {/* Transaction Items - Scrollable */}
                  <div className="flex-1 overflow-y-auto pr-2 -mr-2 mt-3" style={{ maxHeight: '400px' }}>
                    <div className="space-y-3">
                      {recentTransactions.map((transaction) => {
                        const statusConfig = {
                          'COMPLETED': { text: 'Đã hoàn thành', dotColor: '#10b981', textColor: '#10b981' },
                          'APPROVED': { text: 'Đã hoàn thành', dotColor: '#10b981', textColor: '#10b981' },
                          'PENDING': { text: 'Đang xử lý', dotColor: '#fbbf24', textColor: '#fbbf24' },
                          'FAILED': { text: 'Thất bại', dotColor: '#ef4444', textColor: '#ef4444' },
                          'REJECTED': { text: 'Thất bại', dotColor: '#ef4444', textColor: '#ef4444' }
                        };
                    const config = statusConfig[transaction.status] || { text: transaction.status, dotColor: '#9ca3af', textColor: '#9ca3af' };
                    const amountColor = transaction.type === 'DEPOSIT' || transaction.type === 'BONUS' ? '#52c41a' : '#ff4d4f';
                    
                        return (
                      <div
                        key={transaction.id}
                        className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center">
                          <span className="text-sm text-gray-700">
                            {dayjs(transaction.createdAt).format('DD/MM/YYYY')}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span 
                            className="text-sm font-semibold"
                            style={{ color: amountColor }}
                          >
                            {transaction.type === 'DEPOSIT' || transaction.type === 'BONUS' ? '+' : '-'}
                            {transaction.amount?.toLocaleString() || 0} K
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-700">
                            {transaction.paymentMethod?.name || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="flex items-center gap-1.5">
                            <span 
                              className="w-1.5 h-1.5 rounded-full" 
                              style={{ backgroundColor: config.dotColor }}
                            ></span>
                            <span 
                              className="text-sm" 
                              style={{ color: config.textColor }}
                            >
                              {config.text}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right: Promotions */}
          <Card className="border border-gray-200 shadow-sm bg-white rounded-2xl flex flex-col">
            <CardHeader className="pb-3 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src="/iconacc/imgi_30_promotion.avif" alt="Promotion" className="w-5 h-5" />
                  <CardTitle className="text-lg font-semibold text-gray-900">Khuyến Mãi</CardTitle>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  className="text-green-600 hover:text-green-700 p-0 h-auto"
                  onClick={() => onTabChange && onTabChange('promotions')}
                >
                  Xem Thêm <Icon icon="mdi:chevron-right" className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
              {loadingPromotions ? (
                <div className="flex justify-center py-8">
                  <Loading />
                </div>
              ) : promotions.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  Chưa có khuyến mãi nào
                </div>
              ) : (
                <div className="flex-1 overflow-hidden flex flex-col relative">
                  <div 
                    ref={promotionsScrollRef}
                    className="flex-1 overflow-y-auto pr-2 -mr-2" 
                    style={{ maxHeight: '490px' }}
                  >
                    <div className="space-y-4">
                  {promotions.map((promotion) => (
                        <AntCard
                      key={promotion.id}
                          className="shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden p-0 cursor-pointer rounded-2xl"
                          bodyStyle={{ padding: 0, borderRadius: '16px' }}
                      onClick={() => navigate(`/promotions/${promotion.id}`)}
                    >
                      <div
                            className="relative h-44 p-5 flex flex-col justify-between"
                        style={{
                          backgroundImage: promotion.imageUrl
                            ? `url(${promotion.imageUrl.startsWith('http') ? promotion.imageUrl : `https://api.tathiet168.com/api${promotion.imageUrl}`})`
                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat'
                        }}
                      >
                            {/* Content overlay */}
                            <div className="relative z-10">
                              {/* Title - Oswald font, smaller */}
                              <Title 
                                level={4} 
                                className="text-white mb-1 !text-white drop-shadow-lg font-oswald !text-base !font-bold uppercase !mb-1"
                                style={{ fontFamily: "'Oswald', sans-serif" }}
                              >
                            {promotion.title}
                              </Title>

                              {/* Description - Larger than title, keep current font */}
                              <Text className="block text-lg md:text-xl font-bold mb-4 text-white drop-shadow-md uppercase">
                                {promotion.description || promotion.shortDescription || 'Ưu đãi hấp dẫn đang diễn ra, tham gia ngay!'}
                              </Text>

                              {/* CTA Button */}
                        <Button
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/promotions/${promotion.id}`);
                          }}
                                className="!bg-gradient-to-r !from-yellow-400 !to-amber-500 !border-none hover:!from-yellow-500 hover:!to-amber-600 !text-gray-900 !font-semibold !text-xs"
                                style={{ 
                                  borderRadius: '8px',
                                  background: 'linear-gradient(to right, #facc15, #f59e0b)',
                                  border: 'none',
                                  color: '#111827',
                                  padding: '6px 12px',
                                  height: 'auto'
                                }}
                              >
                                Xem khuyến mãi
                        </Button>
                            </div>
                          </div>
                        </AntCard>
                      ))}
                    </div>
                  </div>
                  {/* Scroll indicator */}
                  {showScrollIndicator && (
                    <div 
                      className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10 cursor-pointer"
                      onClick={() => {
                        if (promotionsScrollRef.current) {
                          promotionsScrollRef.current.scrollBy({ 
                            top: 200, 
                            behavior: 'smooth' 
                          });
                        }
                      }}
                    >
                      <div className="animate-bounce-subtle">
                        <Icon 
                          icon="mdi:chevron-down" 
                          className="text-green-600 text-2xl hover:text-green-700 transition-colors"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default WalletBalance;
