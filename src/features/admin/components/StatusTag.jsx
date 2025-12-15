// Status tag component với style giống StatCard
const StatusTag = ({ status, customConfig = {} }) => {
  const defaultStatusConfig = {
    PENDING: {
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-200',
      label: 'Đang chờ',
    },
    WON: {
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      label: 'Thắng',
    },
    LOST: {
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
      label: 'Thua',
    },
    CANCELLED: {
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200',
      label: 'Hủy',
    },
    REFUNDED: {
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      label: 'Hoàn trả',
    },
    ACTIVE: {
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      label: 'Hoạt động',
    },
    INACTIVE: {
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200',
      label: 'Tạm khóa',
    },
    SUSPENDED: {
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
      label: 'Tạm dừng',
    },
    BANNED: {
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
      label: 'Bị cấm',
    },
  };

  const config = customConfig[status] || defaultStatusConfig[status] || {
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-200',
    label: status,
  };

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} border rounded-xl px-2 py-0.5 shadow-sm inline-block`}
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <span
        className={`text-xs font-semibold ${config.textColor}`}
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontWeight: 600,
        }}
      >
        {config.label || status}
      </span>
    </div>
  );
};

export default StatusTag;

