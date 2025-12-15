import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import StatusTag from '../StatusTag';

const KycStatusTag = ({ status }) => {
  const statusConfig = {
    PENDING: {
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200',
      label: 'Chờ duyệt',
      icon: <Clock className="h-3 w-3" />
    },
    APPROVED: {
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      label: 'Đã duyệt',
      icon: <CheckCircle2 className="h-3 w-3" />
    },
    REJECTED: {
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
      label: 'Từ chối',
      icon: <XCircle className="h-3 w-3" />
    }
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <StatusTag
      status={status}
      customConfig={{
        [status]: {
          ...config,
          label: (
            <div className="flex items-center gap-1.5">
              {config.icon}
              <span>{config.label}</span>
            </div>
          )
        }
      }}
    />
  );
};

export default KycStatusTag;

