import Modal from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { AlertTriangle, CheckCircle, Loader2, X } from 'lucide-react';

const XocDiaResultRefundModal = ({
  open,
  refundingBets,
  onClose,
  onConfirm
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      width="max-w-xs"
      title={null}
      closable={false}
    >
      <div className="flex flex-col items-center text-center relative">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-amber-100 text-amber-600">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-2">
          Xác nhận hột kê
        </h3>
        <p className="text-xs text-gray-600 mb-4">
          Bạn có chắc chắn muốn đánh dấu kết quả là <strong>"Hột kê"</strong> và hoàn tiền cho tất cả người chơi?<br />
          <span className="text-amber-600 font-medium">Hành động này không thể hoàn tác.</span>
        </p>
        <div className="flex gap-2 w-full mt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={refundingBets}
            className="flex-1 rounded-2xl h-9 text-sm"
          >
            Hủy
          </Button>
          <Button
            onClick={onConfirm}
            disabled={refundingBets}
            className="flex-1 bg-amber-500 text-white hover:bg-amber-600 rounded-2xl h-9 text-sm gap-2"
          >
            {refundingBets ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <CheckCircle className="h-3 w-3" />
                Xác nhận
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default XocDiaResultRefundModal;

