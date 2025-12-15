import { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import Modal from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import StatCard from '../analytics/components/StatCard';
import { adminService } from '../services/adminService';
import { formatCurrency, formatPointsOnly } from '../../../utils/helpers';
import AgentCustomerDetailItemModal from './AgentCustomerDetailItemModal';

const AgentCustomerDetailModal = ({ open, onClose, customer, dateRange }) => {
  const [loading, setLoading] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [itemType, setItemType] = useState(null);

  const loadDetail = useCallback(async () => {
    if (!customer) return;
    
    try {
      setLoading(true);
      const params = {};
      if (dateRange && dateRange.length === 2) {
        params.startDate = dateRange[0].format('YYYY-MM-DD');
        params.endDate = dateRange[1].format('YYYY-MM-DD');
      }

      const response = await adminService.getAgentCustomerDetail(customer.id, params);
      if (response?.success && response.data) {
        setDetailData(response.data);
      }
    } catch (error) {
      console.error('Error loading customer detail:', error);
    } finally {
      setLoading(false);
    }
  }, [customer, dateRange]);

  useEffect(() => {
    if (open && customer) {
      loadDetail();
    }
  }, [open, customer, loadDetail]);

  const handleViewDetail = (type) => {
    setItemType(type);
    setItemModalVisible(true);
  };

  if (!customer) return null;

  const detailItems = [
    {
      key: 'totalDeposit',
      title: 'Tổng nạp',
      value: detailData ? formatCurrency(detailData.totalDeposit) : '0',
      bgColor: 'bg-green-600',
      type: 'deposit'
    },
    {
      key: 'totalWithdraw',
      title: 'Tổng rút',
      value: detailData ? formatCurrency(detailData.totalWithdraw) : '0',
      bgColor: 'bg-orange-600',
      type: 'withdraw'
    },
    {
      key: 'totalBet',
      title: 'Tổng cược',
      value: detailData ? formatCurrency(detailData.totalBet) : '0',
      bgColor: 'bg-purple-600',
      type: 'bet'
    },
    {
      key: 'totalWin',
      title: 'Tổng thắng',
      value: detailData ? formatCurrency(detailData.totalWin) : '0',
      bgColor: 'bg-emerald-600',
      type: 'win'
    },
    {
      key: 'totalLoss',
      title: 'Tổng thua',
      value: detailData ? formatCurrency(detailData.totalLoss) : '0',
      bgColor: 'bg-red-600',
      type: 'loss'
    },
    {
      key: 'totalWinLoss',
      title: 'Tổng Thắng/Thua',
      value: detailData ? formatCurrency(detailData.totalWinLoss) : '0',
      bgColor: detailData && detailData.totalWinLoss >= 0 ? 'bg-emerald-600' : 'bg-red-600',
      type: 'winloss'
    },
    {
      key: 'totalGameRefund',
      title: 'Hoàn cược',
      value: detailData ? formatCurrency(detailData.totalGameRefund) : '0',
      bgColor: 'bg-indigo-600',
      type: 'gameRefund'
    },
    {
      key: 'totalDailyLossRefund',
      title: 'Hoàn thua theo ngày',
      value: detailData ? formatCurrency(detailData.totalDailyLossRefund) : '0',
      bgColor: 'bg-pink-600',
      type: 'dailyLossRefund'
    },
    {
      key: 'totalPromotionalMoney',
      title: 'Khuyến mãi',
      value: detailData ? formatCurrency(detailData.totalPromotionalMoney) : '0',
      bgColor: 'bg-cyan-600',
      type: 'promotional'
    }
  ];

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={`Chi tiết khách hàng - ${customer.username}`}
        width="max-w-6xl"
      >
        <div className="space-y-4 max-h-[80vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-8 h-8 border-4 border-[#4CAF50] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {detailItems.map((item) => (
                <div key={item.key} className="relative">
                  <StatCard
                    title={item.title}
                    value={item.value}
                    bgColor={item.bgColor}
                    textColor="text-white"
                    valueColor="text-white"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                    onClick={() => handleViewDetail(item.type)}
                  >
                    Chi tiết
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {itemModalVisible && (
        <AgentCustomerDetailItemModal
          open={itemModalVisible}
          onClose={() => {
            setItemModalVisible(false);
            setItemType(null);
          }}
          customer={customer}
          itemType={itemType}
          dateRange={dateRange}
        />
      )}
    </>
  );
};

export default AgentCustomerDetailModal;

