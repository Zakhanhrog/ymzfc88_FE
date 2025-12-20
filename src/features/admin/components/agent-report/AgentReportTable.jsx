import { useState, useCallback } from 'react';
import { Copy, History, Save, CheckCircle2, Settings } from 'lucide-react';
import Table from '../../../../components/ui/Table';
import Pagination from '../../../../components/ui/Pagination';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import Modal from '../../../../components/ui/Modal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../components/ui/Tooltip';
import { formatPointsOnly, formatPointsFromVND } from '../../../../utils/helpers';
import dayjs from 'dayjs';
import { adminService } from '../../services/adminService';
import { message } from '../../../../utils/notification';

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
  onPaginationChange
}) => {
  const [payoutConfirm, setPayoutConfirm] = useState({ open: false, agent: null });
  const [actionModal, setActionModal] = useState({ open: false, agent: null });
  const [payoutHistory, setPayoutHistory] = useState({ loading: false, data: [], show: false });

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
      setActionModal({ open: false, agent: null });
    }
  };

  const handleOpenActionModal = (agent) => {
    setActionModal({ open: true, agent });
  };

  const handleCloseActionModal = () => {
    setActionModal({ open: false, agent: null });
    setPayoutHistory({ loading: false, data: [], show: false });
  };

  const handleShowPayoutHistory = async (agentId) => {
    try {
      setPayoutHistory({ loading: true, data: [], show: false });
      const month = selectedMonth.format('YYYY-MM');
      const response = await adminService.getAgentPayoutHistory(agentId, month);
      if (response?.success) {
        setPayoutHistory({ loading: false, data: response.data || [], show: true });
      } else {
        message.error(response?.message || 'Không thể tải lịch sử');
        setPayoutHistory({ loading: false, data: [], show: false });
      }
    } catch (error) {
      message.error(error.message || 'Không thể tải lịch sử');
      setPayoutHistory({ loading: false, data: [], show: false });
    }
  };

  const handlePayoutFromModal = (agent) => {
    const customCommission = customCommissions[agent.agentId];
    if (!customCommission || Number(customCommission) <= 0) {
      return;
    }
    setPayoutConfirm({ open: true, agent });
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
      key: 'action',
      title: 'Thao tác',
      width: 100,
      fixed: 'right',
      className: 'text-center',
      render: (_, record) => {
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenActionModal(record)}
            className="w-full"
          >
            <Settings className="h-4 w-4" />
          </Button>
        );
      }
    }
  ];

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
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

      {/* Action Modal - Hiển thị Hoa hồng, Đã chia, Ghi chú, Thao tác */}
      <Modal
        title={`Quản lý đại lý: ${actionModal.agent?.username || ''}`}
        open={actionModal.open}
        onClose={handleCloseActionModal}
        width={payoutHistory.show ? "max-w-4xl" : "max-w-xl"}
        className={`transition-all duration-300 ease-in-out ${payoutHistory.show ? 'scale-[1.02]' : 'scale-100'}`}
      >
        {actionModal.agent && (
          <div className="space-y-4">
            {/* Thông tin đại lý - Compact */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div>
                <p className="text-sm font-semibold text-gray-900">{actionModal.agent.username}</p>
                {actionModal.agent.fullName && (
                  <p className="text-xs text-gray-500 mt-0.5">{actionModal.agent.fullName}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Mã giới thiệu</p>
                <p className="text-sm font-semibold text-gray-900">{actionModal.agent.referralCode || '-'}</p>
              </div>
            </div>

            {/* Hoa hồng và Đã chia - Cùng hàng */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Hoa hồng
                </label>
                <Input
                  type="number"
                  value={customCommissions[actionModal.agent.agentId] || ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    onCustomCommissionChange(actionModal.agent.agentId, value);
                  }}
                  placeholder="Nhập hoa hồng"
                  className="w-full"
                  min={0}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Đã chia
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-50 rounded-md px-3 py-2">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatPointsOnly(Number(actionModal.agent.paidCommissionAmount ?? 0))}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShowPayoutHistory(actionModal.agent.agentId)}
                    disabled={payoutHistory.loading}
                    className="flex-shrink-0 px-3"
                  >
                    {payoutHistory.loading ? (
                      <div className="h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    ) : (
                      <History className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Ghi chú - Compact */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-gray-700">
                  Ghi chú
                </label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onSaveNote(actionModal.agent.agentId);
                  }}
                  disabled={!!noteLoading[actionModal.agent.agentId]}
                  className="h-7 px-3 text-xs"
                >
                  <Save className={`h-3 w-3 mr-1.5 ${noteLoading[actionModal.agent.agentId] ? 'animate-spin' : ''}`} />
                  Lưu
                </Button>
              </div>
              <textarea
                rows={3}
                value={notes[actionModal.agent.agentId] || ''}
                onChange={(e) => onNoteChange(actionModal.agent.agentId, e.target.value)}
                placeholder="Nhập ghi chú cho đại lý"
                className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Thao tác - Compact */}
            <div className="pt-2 border-t border-gray-200">
              <Button
                onClick={() => handlePayoutFromModal(actionModal.agent)}
                disabled={!customCommissions[actionModal.agent.agentId] || Number(customCommissions[actionModal.agent.agentId]) <= 0}
                loading={!!payoutLoading[actionModal.agent.agentId]}
                className="w-full"
              >
                Chia hoa hồng
              </Button>
              {(!customCommissions[actionModal.agent.agentId] || Number(customCommissions[actionModal.agent.agentId]) <= 0) && (
                <p className="text-xs text-gray-500 mt-1.5 text-center">
                  Vui lòng nhập hoa hồng trước khi chia
                </p>
              )}
            </div>

            {/* Lịch sử chia hoa hồng - Slide down animation */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                payoutHistory.show
                  ? 'max-h-[500px] opacity-100 mt-4'
                  : 'max-h-0 opacity-0 mt-0'
              }`}
            >
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900">Lịch sử chia hoa hồng</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPayoutHistory({ loading: false, data: [], show: false })}
                    className="h-6 px-2 text-xs"
                  >
                    Ẩn
                  </Button>
                </div>
                <div className="max-h-[400px] overflow-y-auto rounded-lg border border-gray-200">
                  <Table
                    columns={[
                      {
                        key: 'periodMonth',
                        title: 'Tháng',
                        width: 100,
                        render: (_, record) => (
                          <span className="text-sm text-gray-900">{record.periodMonth || '-'}</span>
                        )
                      },
                      {
                        key: 'commissionAmount',
                        title: 'Số tiền',
                        width: 150,
                        className: 'text-right',
                        render: (_, record) => (
                          <span className="text-sm font-semibold text-gray-900">
                            {formatPointsOnly(Number(record.commissionAmount ?? 0))}
                          </span>
                        )
                      },
                      {
                        key: 'paidAt',
                        title: 'Ngày chia',
                        width: 150,
                        render: (_, record) => (
                          <span className="text-sm text-gray-900">
                            {record.paidAt ? dayjs(record.paidAt).format('DD/MM/YYYY HH:mm') : '-'}
                          </span>
                        )
                      },
                      {
                        key: 'notes',
                        title: 'Ghi chú',
                        render: (_, record) => (
                          <span className="text-sm text-gray-900">{record.notes || '-'}</span>
                        )
                      }
                    ]}
                    dataSource={payoutHistory.data}
                    rowKey="id"
                    emptyText="Chưa có lịch sử chia hoa hồng"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

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

