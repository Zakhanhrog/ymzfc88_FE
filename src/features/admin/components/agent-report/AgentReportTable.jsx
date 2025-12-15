import { useState, useCallback } from 'react';
import { Copy, History, Save, CheckCircle2 } from 'lucide-react';
import Table from '../../../../components/ui/Table';
import Pagination from '../../../../components/ui/Pagination';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import Modal from '../../../../components/ui/Modal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../components/ui/Tooltip';
import { formatPointsOnly, formatPointsFromVND } from '../../../../utils/helpers';
import dayjs from 'dayjs';

// Component hiển thị IP với chức năng copy
const IpCell = ({ ip }) => {
  const [showCopyIcon, setShowCopyIcon] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    if (!ip || ip === '-') return;
    
    try {
      await navigator.clipboard.writeText(ip);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy IP:', err);
    }
  };

  if (!ip || ip === '-') {
    return <span className="text-sm text-gray-900">-</span>;
  }

  const displayIp = ip.length > 12 ? `${ip.substring(0, 12)}...` : ip;

  return (
    <div
      className="relative group w-full"
      onMouseEnter={() => setShowCopyIcon(true)}
      onMouseLeave={() => setShowCopyIcon(false)}
    >
      <span 
        className="text-sm text-gray-900 block cursor-pointer hover:text-blue-600 transition-colors whitespace-nowrap relative"
        onClick={handleCopy}
        title={ip}
      >
        {displayIp}
      </span>
      {showCopyIcon && (
        <button
          onClick={handleCopy}
          className="absolute top-0 right-0 p-0.5 bg-white bg-opacity-90 rounded shadow-sm text-gray-400 hover:text-blue-600 transition-colors z-10"
          title={copied ? 'Đã sao chép!' : 'Sao chép IP'}
          onMouseEnter={(e) => e.stopPropagation()}
        >
          {copied ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      )}
    </div>
  );
};

// Component hiển thị mã giới thiệu với copy
const ReferralCodeCell = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    if (!code || code === '-') return;
    
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-900">{code || '-'}</span>
      {code && code !== '-' && (
        <button
          onClick={handleCopy}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title={copied ? 'Đã sao chép!' : 'Sao chép mã'}
        >
          {copied ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-gray-400" />
          )}
        </button>
      )}
    </div>
  );
};

const AgentReportTable = ({
  data = [],
  loading = false,
  pagination = { current: 1, pageSize: 10, total: 0 },
  customCommissions,
  onCustomCommissionChange,
  notes,
  onNoteChange,
  onSaveNote,
  noteLoading,
  onPayout,
  payoutLoading,
  selectedMonth,
  onShowPayoutHistory,
  onPaginationChange
}) => {
  const [payoutConfirm, setPayoutConfirm] = useState({ open: false, agent: null });

  const handlePayoutClick = (agent) => {
    const customCommission = customCommissions[agent.agentId];
    if (!customCommission || Number(customCommission) <= 0) {
      return;
    }
    setPayoutConfirm({ open: true, agent });
  };

  const handlePayoutConfirm = () => {
    if (payoutConfirm.agent) {
      onPayout(payoutConfirm.agent);
      setPayoutConfirm({ open: false, agent: null });
    }
  };

  const columns = [
    {
      key: 'username',
      title: 'Đại lý',
      width: 150,
      fixed: 'left',
      render: (_, record) => (
        <div>
          <div className="font-semibold text-sm text-gray-900">{record.username}</div>
          {record.fullName && (
            <div className="text-xs text-gray-500">{record.fullName}</div>
          )}
        </div>
      )
    },
    {
      key: 'referralCode',
      title: 'Mã giới thiệu',
      width: 120,
      render: (_, record) => <ReferralCodeCell code={record.referralCode} />
    },
    {
      key: 'customerCount',
      title: 'Khách hàng',
      width: 100,
      className: 'text-right',
      render: (_, record) => (
        <span className="text-sm text-gray-900">{record.customerCount || 0}</span>
      )
    },
    {
      key: 'totalBetAmount',
      title: 'Tổng cược',
      width: 130,
      className: 'text-right',
      render: (_, record) => (
        <span className="text-sm text-gray-900">
          {formatPointsOnly(Number(record.totalBetAmount ?? 0))}
        </span>
      )
    },
    {
      key: 'totalLostAmount',
      title: 'Tổng thua',
      width: 130,
      className: 'text-right',
      render: (_, record) => (
        <span className="text-sm text-gray-900">
          {formatPointsOnly(Number(record.totalLostAmount ?? 0))}
        </span>
      )
    },
    {
      key: 'totalDepositAmount',
      title: 'Tổng Nạp',
      width: 130,
      className: 'text-right',
      render: (_, record) => (
        <span className="text-sm text-gray-900">
          {formatPointsFromVND(Number(record.totalDepositAmount ?? 0))}
        </span>
      )
    },
    {
      key: 'totalWithdrawAmount',
      title: 'Tổng Rút',
      width: 130,
      className: 'text-right',
      render: (_, record) => (
        <span className="text-sm text-gray-900">
          {formatPointsFromVND(Number(record.totalWithdrawAmount ?? 0))}
        </span>
      )
    },
    {
      key: 'totalDailyLossRefund',
      title: 'Tổng hoàn thua',
      width: 140,
      className: 'text-right',
      render: (_, record) => (
        <span className="text-sm text-gray-900">
          {formatPointsOnly(Number(record.totalDailyLossRefund ?? 0))}
        </span>
      )
    },
    {
      key: 'totalRefund',
      title: 'Tổng hoàn cược',
      width: 140,
      className: 'text-right',
      render: (_, record) => (
        <span className="text-sm text-gray-900">
          {formatPointsOnly(Number(record.totalRefund ?? 0))}
        </span>
      )
    },
    {
      key: 'totalPromotionalMoney',
      title: 'Tổng KM',
      width: 120,
      className: 'text-right',
      render: (_, record) => (
        <span className="text-sm text-gray-900">
          {formatPointsOnly(Number(record.totalPromotionalMoney ?? 0))}
        </span>
      )
    },
    {
      key: 'finalBalance',
      title: 'Số dư cuối',
      width: 140,
      className: 'text-right',
      render: (_, record) => {
        const balance = Number(record.finalBalance ?? 0);
        return (
          <span className={`text-sm font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatPointsOnly(balance)}
          </span>
        );
      }
    },
    {
      key: 'firstLoginIp',
      title: 'IP',
      width: 75,
      render: (_, record) => <IpCell ip={record.firstLoginIp} />
    },
    {
      key: 'commission',
      title: 'Hoa hồng',
      width: 180,
      className: 'text-right',
      render: (_, record) => {
        const custom = customCommissions[record.agentId];
        return (
          <Input
            type="number"
            value={custom || ''}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              onCustomCommissionChange(record.agentId, value);
            }}
            placeholder="Nhập hoa hồng"
            className="w-full"
            min={0}
          />
        );
      }
    },
    {
      key: 'paidHistory',
      title: 'Đã chia',
      width: 140,
      className: 'text-center',
      render: (_, record) => {
        const paidAmount = Number(record.paidCommissionAmount ?? 0);
        return (
          <div className="space-y-2">
            <div className="text-sm text-gray-900">{formatPointsOnly(paidAmount)}</div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShowPayoutHistory(record.agentId)}
              className="w-full"
            >
              <History className="h-3 w-3 mr-1" />
              Lịch sử
            </Button>
          </div>
        );
      }
    },
    {
      key: 'note',
      title: 'Ghi chú',
      width: 250,
      render: (_, record) => (
        <div className="space-y-2">
          <textarea
            rows={2}
            value={notes[record.agentId] || ''}
            onChange={(e) => onNoteChange(record.agentId, e.target.value)}
            placeholder="Nhập ghi chú cho đại lý"
            className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <Button
            size="sm"
            onClick={() => onSaveNote(record.agentId)}
            disabled={!!noteLoading[record.agentId]}
            className="w-full"
          >
            <Save className={`h-3 w-3 mr-1 ${noteLoading[record.agentId] ? 'animate-spin' : ''}`} />
            Lưu
          </Button>
        </div>
      )
    },
    {
      key: 'action',
      title: 'Thao tác',
      width: 120,
      fixed: 'right',
      className: 'text-center',
      render: (_, record) => {
        const customCommission = customCommissions[record.agentId];
        const hasCustomCommission = customCommission && Number(customCommission) > 0;
        
        return (
          <Button
            onClick={() => handlePayoutClick(record)}
            disabled={!hasCustomCommission}
            loading={!!payoutLoading[record.agentId]}
            size="sm"
            className="w-full"
          >
            Chia
          </Button>
        );
      }
    }
  ];

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            rowKey="agentId"
            emptyText="Chưa có dữ liệu đại lý cho tháng này"
          />
        </div>
        {pagination.total > 0 && (
          <div className="border-t border-gray-200 px-4 py-3">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={onPaginationChange}
              showSizeChanger
              showQuickJumper
              showTotal={(total, range) =>
                `Tổng ${total} đại lý`
              }
            />
          </div>
        )}
      </div>

      {/* Payout Confirmation Modal */}
      <Modal
        title="Xác nhận chia hoa hồng"
        open={payoutConfirm.open}
        onClose={() => setPayoutConfirm({ open: false, agent: null })}
        width="max-w-md"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setPayoutConfirm({ open: false, agent: null })}
            >
              Hủy
            </Button>
            <Button onClick={handlePayoutConfirm}>
              Chia
            </Button>
          </div>
        }
      >
        {payoutConfirm.agent && (
          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              Chia hoa hồng <strong>{formatPointsOnly(Number(customCommissions[payoutConfirm.agent.agentId] || 0))}</strong> tháng {dayjs(selectedMonth).format('YYYY-MM')} cho đại lý <strong>{payoutConfirm.agent.username}</strong>?
            </p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default AgentReportTable;

