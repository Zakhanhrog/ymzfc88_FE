import { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import Modal from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import Table from '../../../components/ui/Table';
import Pagination from '../../../components/ui/Pagination';
import { adminService } from '../services/adminService';
import { formatCurrency, formatPointsOnly } from '../../../utils/helpers';
import StatusTag from './StatusTag';

const AgentCustomerDetailItemModal = ({ open, onClose, customer, itemType, dateRange }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const loadData = useCallback(async () => {
    if (!customer || !itemType) return;

    try {
      setLoading(true);
      const params = {
        page: pagination.current - 1,
        size: pagination.pageSize
      };

      if (dateRange && dateRange.length === 2) {
        params.startDate = dateRange[0].format('YYYY-MM-DD');
        params.endDate = dateRange[1].format('YYYY-MM-DD');
      }

      let response;
      switch (itemType) {
        case 'deposit':
          response = await adminService.getAgentCustomerDeposits(customer.id, params);
          break;
        case 'withdraw':
          response = await adminService.getAgentCustomerWithdrawals(customer.id, params);
          break;
        case 'bet':
          response = await adminService.getAgentCustomerBets(customer.id, params);
          break;
        case 'win':
          response = await adminService.getAgentCustomerWins(customer.id, params);
          break;
        case 'loss':
          response = await adminService.getAgentCustomerLosses(customer.id, params);
          break;
        case 'winloss':
          response = await adminService.getAgentCustomerBetHistory(customer.id, params);
          break;
        case 'gameRefund':
          response = await adminService.getAgentCustomerGameRefunds(customer.id, params);
          break;
        case 'dailyLossRefund':
          response = await adminService.getAgentCustomerDailyLossRefunds(customer.id, params);
          break;
        case 'promotional':
          response = await adminService.getAgentCustomerPromotions(customer.id, params);
          break;
        default:
          return;
      }

      if (response?.success && response.data) {
        const payload = response.data;
        setData(payload.items || []);
        setPagination((prev) => ({
          ...prev,
          current: (payload.page || 0) + 1,
          pageSize: payload.size || prev.pageSize,
          total: payload.totalItems || 0
        }));
      }
    } catch (error) {
      console.error('Error loading detail data:', error);
    } finally {
      setLoading(false);
    }
  }, [customer, itemType, dateRange, pagination.current, pagination.pageSize]);

  useEffect(() => {
    if (open && customer && itemType) {
      loadData();
    }
  }, [open, customer, itemType, loadData]);

  const handleTableChange = ({ current, pageSize }) => {
    setPagination((prev) => ({
      ...prev,
      current,
      pageSize
    }));
  };

  const getTitle = () => {
    const titles = {
      deposit: 'Chi tiết nạp tiền',
      withdraw: 'Chi tiết rút tiền',
      bet: 'Chi tiết cược',
      win: 'Chi tiết thắng',
      loss: 'Chi tiết thua',
      winloss: 'Chi tiết Thắng/Thua',
      gameRefund: 'Chi tiết hoàn cược',
      dailyLossRefund: 'Chi tiết hoàn thua theo ngày',
      promotional: 'Chi tiết khuyến mãi'
    };
    return titles[itemType] || 'Chi tiết';
  };

  const getColumns = () => {
    switch (itemType) {
      case 'deposit':
        return [
          {
            title: 'Thời gian',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (value) => value ? dayjs(value).format('DD/MM/YYYY HH:mm:ss') : '-'
          },
          {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            render: (value) => formatCurrency(value)
          },
          {
            title: 'Phương thức',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
            render: (value) => value?.name || '-'
          },
          {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => <StatusTag status={status} />
          }
        ];
      case 'withdraw':
        return [
          {
            title: 'Thời gian',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (value) => value ? dayjs(value).format('DD/MM/YYYY HH:mm:ss') : '-'
          },
          {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            render: (value) => formatCurrency(value)
          },
          {
            title: 'Phương thức',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
            render: (value) => value?.name || '-'
          },
          {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => <StatusTag status={status} />
          }
        ];
      case 'bet':
      case 'win':
      case 'loss':
      case 'winloss':
        return [
          {
            title: 'Thời gian',
            dataIndex: 'placedAt',
            key: 'placedAt',
            render: (value) => value ? dayjs(value).format('DD/MM/YYYY HH:mm:ss') : '-'
          },
          {
            title: 'Trò chơi',
            dataIndex: 'gameType',
            key: 'gameType',
            render: (value) => {
              const gameMap = {
                lottery: 'Lô đề',
                sicbo: 'Tài Xỉu',
                'xoc-dia': 'Xóc Đĩa'
              };
              return gameMap[value] || value;
            }
          },
          {
            title: 'Mã cược',
            dataIndex: 'betCode',
            key: 'betCode'
          },
          {
            title: 'Tiền cược',
            dataIndex: 'stake',
            key: 'stake',
            render: (value) => formatCurrency(value)
          },
          {
            title: 'Tiền thắng',
            dataIndex: 'winAmount',
            key: 'winAmount',
            render: (value) => formatCurrency(value)
          },
          {
            title: 'Kết quả',
            dataIndex: 'netResult',
            key: 'netResult',
            render: (value) => {
              const amount = Number(value ?? 0);
              const formatted = formatCurrency(Math.abs(amount));
              if (amount > 0) {
                return <span className="text-emerald-500">+{formatted}</span>;
              }
              if (amount < 0) {
                return <span className="text-red-500">-{formatted}</span>;
              }
              return formatted;
            }
          },
          {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => <StatusTag status={status} />
          }
        ];
      case 'gameRefund':
        return [
          {
            title: 'Thời gian',
            dataIndex: 'paidAt',
            key: 'paidAt',
            render: (value) => value ? dayjs(value).format('DD/MM/YYYY HH:mm:ss') : '-'
          },
          {
            title: 'Trò chơi',
            dataIndex: 'gameType',
            key: 'gameType',
            render: (value) => {
              const gameMap = {
                SICBO: 'Tài Xỉu',
                XOC_DIA: 'Xóc Đĩa'
              };
              return gameMap[value] || value;
            }
          },
          {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            render: (value) => formatCurrency(value)
          },
          {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description'
          }
        ];
      case 'dailyLossRefund':
        return [
          {
            title: 'Ngày',
            dataIndex: 'refundDate',
            key: 'refundDate',
            render: (value) => value ? dayjs(value).format('DD/MM/YYYY') : '-'
          },
          {
            title: 'Thời gian hoàn',
            dataIndex: 'paidAt',
            key: 'paidAt',
            render: (value) => value ? dayjs(value).format('DD/MM/YYYY HH:mm:ss') : '-'
          },
          {
            title: 'Số tiền',
            dataIndex: 'refundAmount',
            key: 'refundAmount',
            render: (value) => formatCurrency(value)
          },
          {
            title: 'Tổng thắng',
            dataIndex: 'totalWinAmount',
            key: 'totalWinAmount',
            render: (value) => formatCurrency(value)
          },
          {
            title: 'Tổng thua',
            dataIndex: 'totalLossAmount',
            key: 'totalLossAmount',
            render: (value) => formatCurrency(value)
          },
          {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => <StatusTag status={status} />
          }
        ];
      case 'promotional':
        return [
          {
            title: 'Thời gian',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (value) => value ? dayjs(value).format('DD/MM/YYYY HH:mm:ss') : '-'
          },
          {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            render: (value) => formatCurrency(value)
          },
          {
            title: 'Ghi chú',
            dataIndex: 'note',
            key: 'note'
          }
        ];
      default:
        return [];
    }
  };

  if (!customer || !itemType) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${getTitle()} - ${customer.username}`}
      width="max-w-6xl"
    >
      <div className="space-y-4 max-h-[80vh] overflow-y-auto">
        <Table
          columns={getColumns()}
          dataSource={data}
          loading={loading}
          rowKey="id"
          emptyText="Không có dữ liệu"
        />
        {pagination.total > 0 && (
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handleTableChange}
            showSizeChanger
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} của ${total} bản ghi`
            }
          />
        )}
      </div>
    </Modal>
  );
};

export default AgentCustomerDetailItemModal;

