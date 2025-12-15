import { useState } from 'react';
import { Eye } from 'lucide-react';
import Table from '../../../../components/ui/Table';
import Pagination from '../../../../components/ui/Pagination';
import Select from '../../../../components/ui/Select';
import StatusTag from '../StatusTag';
import dayjs from 'dayjs';

// Component hiển thị IP với chức năng copy (tương tự như các trang khác)
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

const LoginHistoryTable = ({
  data = [],
  loading = false,
  pagination = { current: 1, pageSize: 20, total: 0 },
  pageSizeOptions = [10, 20, 50, 100],
  onPaginationChange,
  onPageSizeChange
}) => {
  const columns = [
    {
      key: 'loginAt',
      title: 'Thời gian',
      width: 190,
      render: (_, record) => (
        <span className="text-sm text-gray-900">
          {record.loginAt ? dayjs(record.loginAt).format('DD/MM/YYYY HH:mm:ss') : '—'}
        </span>
      )
    },
    {
      key: 'username',
      title: 'Tài khoản',
      width: 200,
      render: (_, record) => (
        <div>
          <div className="font-semibold text-sm text-gray-900">{record.username || '—'}</div>
          {record.fullName && (
            <div className="text-xs text-gray-500">{record.fullName}</div>
          )}
        </div>
      )
    },
    {
      key: 'ipAddress',
      title: 'IP',
      width: 75,
      render: (_, record) => <IpCell ip={record.ipAddress} />
    },
    {
      key: 'portal',
      title: 'Cổng',
      width: 110,
      render: (_, record) => (
        <span className="text-sm text-gray-900">{record.portal || 'USER'}</span>
      )
    },
    {
      key: 'success',
      title: 'Trạng thái',
      width: 120,
      render: (_, record) => (
        <StatusTag
          status={record.success ? 'SUCCESS' : 'FAILURE'}
          customConfig={{
            SUCCESS: {
              bgColor: 'bg-green-50',
              textColor: 'text-green-700',
              borderColor: 'border-green-200',
              label: 'Thành công'
            },
            FAILURE: {
              bgColor: 'bg-red-50',
              textColor: 'text-red-700',
              borderColor: 'border-red-200',
              label: 'Thất bại'
            }
          }}
        />
      )
    },
    {
      key: 'failureReason',
      title: 'Lý do thất bại',
      render: (_, record) => (
        <span className="text-sm text-gray-900">
          {record.success ? '—' : (record.failureReason || '—')}
        </span>
      )
    },
    {
      key: 'userAgent',
      title: 'User Agent',
      render: (_, record) => (
        <span 
          className="text-sm text-gray-900 truncate block max-w-md" 
          title={record.userAgent || ''}
        >
          {record.userAgent || '—'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey={(record) => record.id || `${record.username}-${record.loginAt}`}
          emptyText="Không có lịch sử đăng nhập nào"
        />
      </div>
      
      {pagination.total > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Tổng số: <strong className="text-gray-900">{pagination.total}</strong> bản ghi
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={pagination.pageSize}
              onChange={onPageSizeChange}
              options={pageSizeOptions.map((size) => ({
                label: `${size}/trang`,
                value: size
              }))}
              className="w-32"
            />
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={onPaginationChange}
              showSizeChanger={false}
              showQuickJumper
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginHistoryTable;

