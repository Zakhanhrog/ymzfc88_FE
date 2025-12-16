import Modal from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import adminBetService from '../../services/adminBetService';

const BetEditModal = ({ 
  open, 
  bet, 
  editForm, 
  onClose, 
  onSubmit,
  onGroupNumberChange
}) => {
  if (!bet) return null;

  const isGroupedBet = bet.betType.includes('xien') || bet.betType.includes('truot');

  return (
    <Modal open={open} onClose={onClose} title={`Chỉnh sửa số đã chọn - Bet #${bet.id}`}>

        <div className="space-y-4">
          {/* Bet info */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            <div className="text-gray-600">
              <strong>User:</strong> {bet.username} (ID: {bet.userId})
            </div>
            <div className="text-gray-600">
              <strong>Loại cược:</strong> {adminBetService.getBetTypeName(bet.betType)}
            </div>
            <div className="text-gray-600">
              <strong>Tiền cược:</strong> {adminBetService.formatMoney(bet.totalAmount)}
            </div>
          </div>

          {/* Selected numbers input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Số đã chọn
            </label>
            
            {isGroupedBet ? (
              editForm.groupedNumbers.map((group, groupIndex) => (
                <div key={groupIndex} className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      Cụm {groupIndex + 1}:
                    </span>
                    <span className="text-xs text-gray-500">
                      ({group.length} số)
                    </span>
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    {group.map((number, numberIndex) => (
                      <Input
                        key={numberIndex}
                        type="text"
                        value={number || ''}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                          onGroupNumberChange(groupIndex, numberIndex, value);
                        }}
                        className="w-16 h-12 text-center text-lg font-mono"
                        placeholder="00"
                        maxLength="4"
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex gap-2 flex-wrap">
                {editForm.groupedNumbers.flat().map((number, index) => {
                  let currentIndex = 0;
                  let groupIndex = 0;
                  let numberIndex = 0;
                  
                  for (let g = 0; g < editForm.groupedNumbers.length; g++) {
                    const group = editForm.groupedNumbers[g];
                    for (let n = 0; n < group.length; n++) {
                      if (currentIndex === index) {
                        groupIndex = g;
                        numberIndex = n;
                        break;
                      }
                      currentIndex++;
                    }
                  }
                  
                  return (
                    <Input
                      key={index}
                      type="text"
                      value={number || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                        onGroupNumberChange(groupIndex, numberIndex, value);
                      }}
                      className="w-16 h-12 text-center text-lg font-mono"
                      placeholder="00"
                      maxLength="4"
                    />
                  );
                })}
              </div>
            )}
            
            {/* Instructions */}
            <div className="text-xs text-gray-500 mt-3 space-y-1">
              <p><strong>Hướng dẫn:</strong></p>
              {bet.betType.includes('xien') && (
                <>
                  <p>• {bet.betType === 'loto-xien-2' && 'Xiên 2: mỗi cụm 2 số, cả 2 số trong cụm phải trúng'}
                    {bet.betType === 'loto-xien-3' && 'Xiên 3: mỗi cụm 3 số, cả 3 số trong cụm phải trúng'}
                    {bet.betType === 'loto-xien-4' && 'Xiên 4: mỗi cụm 4 số, cả 4 số trong cụm phải trúng'}
                  </p>
                  <p>• Chỉ được sửa số, không được thêm/xóa cụm</p>
                </>
              )}
              {bet.betType.includes('truot') && (
                <>
                  <p>• {bet.betType === 'loto-truot-4' && 'Trượt 4: mỗi cụm 4 số, cả 4 số trong cụm đều không trúng'}
                    {bet.betType === 'loto-truot-8' && 'Trượt 8: mỗi cụm 8 số, cả 8 số trong cụm đều không trúng'}
                    {bet.betType === 'loto-truot-10' && 'Trượt 10: mỗi cụm 10 số, cả 10 số trong cụm đều không trúng'}
                  </p>
                  <p>• Chỉ được sửa số, không được thêm/xóa cụm</p>
                </>
              )}
              {!bet.betType.includes('xien') && !bet.betType.includes('truot') && (
                <>
                  <p>• Mỗi số được đánh riêng lẻ, hiển thị trên 1 dòng</p>
                  <p>• Chỉ được sửa số, không được thêm/xóa số</p>
                </>
              )}
              <p>• Nhập tối đa 4 chữ số cho mỗi ô</p>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
            <p className="text-yellow-800 text-sm">
              ⚠️ Chỉ có thể chỉnh sửa số đã chọn của bet đang chờ (PENDING). 
              Thay đổi này sẽ ảnh hưởng đến kết quả thắng/thua.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-2xl"
            >
              Hủy
            </Button>
            <Button
              onClick={onSubmit}
              className="flex-1 bg-[#4CAF50] text-white hover:bg-[#45a049] rounded-2xl"
            >
              Cập nhật
            </Button>
          </div>
        </div>
    </Modal>
  );
};

export default BetEditModal;

