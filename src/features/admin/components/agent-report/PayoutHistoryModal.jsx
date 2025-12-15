import Modal from '../../../../components/ui/Modal';
import Table from '../../../../components/ui/Table';
import { formatPointsOnly } from '../../../../utils/helpers';
import dayjs from 'dayjs';

const PayoutHistoryModal = ({ open, onClose, history = [] }) => {
  const columns = [
    {
      key: 'periodMonth',
      title: 'Tháng',
      render: (_, record) => (
        <span className="text-sm text-gray-900">{record.periodMonth || '-'}</span>
      )
    },
    {
      key: 'commissionAmount',
      title: 'Số tiền',
      className: 'text-right',
      render: (_, record) => (
        <span className="text-sm text-gray-900">
          {formatPointsOnly(Number(record.commissionAmount ?? 0))}
        </span>
      )
    },
    {
      key: 'paidAt',
      title: 'Ngày chia',
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
  ];

  return (
    <Modal
      title="Lịch sử chia hoa hồng"
      open={open}
      onClose={onClose}
      width="max-w-3xl"
    >
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table
          columns={columns}
          dataSource={history}
          rowKey="id"
          emptyText="Chưa có lịch sử chia hoa hồng"
        />
      </div>
    </Modal>
  );
};

export default PayoutHistoryModal;

