import { Eye, Edit, Key, Lock, Unlock, Trash2, Shield } from 'lucide-react';
import Table from '../../../../components/ui/Table';
import Pagination from '../../../../components/ui/Pagination';
import StatusTag from '../StatusTag';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../components/ui/Tooltip';
import { formatPointsOnly } from '../../../../utils/helpers';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import Modal from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';

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

  // Hiển thị chỉ 12 ký tự đầu + "..."
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
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
};

const UserTable = ({
  data = [],
  loading = false,
  pagination = { current: 1, pageSize: 10, total: 0 },
  onPaginationChange,
  onViewDetail,
  onEdit,
  onResetPassword,
  onLockWithdrawal,
  onUnlockWithdrawal,
  onDelete,
  onViewC2Info,
  onSetC2Password,
  canManageC2
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, userId: null });

  const handleDeleteClick = (userId) => {
    setDeleteConfirm({ open: true, userId });
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm.userId) {
      onDelete(deleteConfirm.userId);
      setDeleteConfirm({ open: false, userId: null });
    }
  };

  const columns = [
    {
      key: 'userInfo',
      title: 'Thông tin',
      render: (_, record) => (
        <div>
          <div className="font-medium flex items-center gap-2">
            {record.fullName}
            {record.withdrawalLocked && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200 cursor-help">
                      <Lock className="h-3 w-3 mr-1" />
                      Khóa rút
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <div className="space-y-1">
                      <div><strong>Trạng thái:</strong> Đã khóa rút tiền</div>
                      <div><strong>Lý do:</strong> {record.withdrawalLockReason || 'Không có lý do'}</div>
                      {record.withdrawalLockedAt && (
                        <div><strong>Thời gian:</strong> {new Date(record.withdrawalLockedAt).toLocaleString('vi-VN')}</div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="text-gray-500 text-sm">@{record.username}</div>
          <div className="text-gray-400 text-xs">{record.email}</div>
        </div>
      ),
    },
    {
      key: 'role',
      title: 'Role',
      width: 100,
      render: (_, record) => {
        const isAgent = record.staffRole === 'AGENT';
        return (
          <StatusTag 
            status={isAgent ? 'AGENT' : 'USER'} 
            customConfig={{
              AGENT: { bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200', label: 'Agent' },
              USER: { bgColor: 'bg-blue-50', textColor: 'text-blue-700', borderColor: 'border-blue-200', label: 'User' }
            }}
          />
        );
      },
    },
    {
      key: 'status',
      title: 'Status',
      width: 120,
      render: (_, record) => {
        const statusMap = {
          ACTIVE: { bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200', label: 'Active' },
          INACTIVE: { bgColor: 'bg-orange-50', textColor: 'text-orange-700', borderColor: 'border-orange-200', label: 'Inactive' },
          SUSPENDED: { bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200', label: 'Suspended' },
          BANNED: { bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200', label: 'Banned' }
        };
        const config = statusMap[record.status] || statusMap.ACTIVE;
        return (
          <StatusTag 
            status={record.status} 
            customConfig={{ [record.status]: config }}
          />
        );
      },
    },
    {
      key: 'balance',
      title: 'Số dư',
      width: 120,
      render: (_, record) => {
        const balancePoints = Number(record.points) || 0;
        return (
          <span className={balancePoints > 0 ? 'text-green-600 font-medium' : 'text-gray-500'}>
            {formatPointsOnly(balancePoints)}
          </span>
        );
      },
    },
    {
      key: 'c2Password',
      title: 'Mật khẩu C2',
      width: 220,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <span className="text-sm">{record.hasC2Password ? '••••••' : 'Chưa có'}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => onViewC2Info(record)}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                >
                  <Eye className="h-4 w-4 text-gray-600" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Xem thông tin C2</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {canManageC2(record) && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => onSetC2Password(record)}
                    className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Shield className="h-4 w-4 text-gray-600" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {record.hasC2Password ? 'Đổi mật khẩu bảo vệ' : 'Thiết lập mật khẩu bảo vệ'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      ),
    },
    {
      key: 'createdAt',
      title: 'Ngày tạo',
      width: 120,
      render: (_, record) => (
        <span className="text-sm text-gray-600">
          {new Date(record.createdAt).toLocaleDateString('vi-VN')}
        </span>
      ),
    },
    {
      key: 'firstLoginIp',
      title: 'IP',
      width: 75,
      render: (_, record) => <IpCell ip={record.firstLoginIp} />,
    },
    {
      key: 'totalRefund',
      title: 'Hoàn trả',
      width: 140,
      className: 'text-right',
      render: (_, record) => (
        <span className="text-sm text-gray-900">{formatPointsOnly(Number(record.totalRefund ?? 0))}</span>
      ),
    },
    {
      key: 'totalDailyLossRefund',
      title: 'Hoàn thua theo ngày',
      width: 160,
      className: 'text-right',
      render: (_, record) => (
        <span className="text-sm text-gray-900">{formatPointsOnly(Number(record.totalDailyLossRefund ?? 0))}</span>
      ),
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: 200,
      render: (_, record) => (
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => onViewDetail(record)}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                >
                  <Eye className="h-4 w-4 text-gray-600" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Xem chi tiết</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => onEdit(record)}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                >
                  <Edit className="h-4 w-4 text-gray-600" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Chỉnh sửa</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => onResetPassword(record)}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                >
                  <Key className="h-4 w-4 text-gray-600" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Reset mật khẩu</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {record.withdrawalLocked ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => onUnlockWithdrawal(record)}
                    className="p-1.5 hover:bg-green-50 rounded transition-colors"
                  >
                    <Unlock className="h-4 w-4 text-green-600" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Mở khóa rút tiền</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => onLockWithdrawal(record)}
                    className="p-1.5 hover:bg-red-50 rounded transition-colors"
                  >
                    <Lock className="h-4 w-4 text-red-600" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Khóa rút tiền</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {record.status !== 'BANNED' && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(record.id)}
                    className="p-1.5 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Xóa</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          emptyText="Không có người dùng nào"
        />
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
                `${range[0]}-${range[1]} của ${total} người dùng`
              }
              className="ant-pagination-emerald-theme"
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, userId: null })}
        title="Xác nhận xóa"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm({ open: false, userId: null })}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              Xóa
            </Button>
          </>
        }
      >
        <p>Bạn có chắc muốn xóa người dùng này?</p>
      </Modal>
    </>
  );
};

export default UserTable;
