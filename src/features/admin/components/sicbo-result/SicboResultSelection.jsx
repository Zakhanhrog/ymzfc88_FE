import { useRef, useEffect } from 'react';
import { Button } from '../../../../components/ui/Button';
import { Card, CardContent } from '../../../../components/ui/Card';
import { Input } from '../../../../components/ui/Input';
import { diceFaceIconMap } from '../AdminSicboResultManagement';

const SicboResultSelection = ({
  tableNumber,
  selectedFaces,
  canSaveResult,
  canRefundBets,
  savingResult,
  refundingBets,
  onSelectFace,
  onClearSelection,
  onSaveResult,
  onOpenRefundModal,
}) => {
  const inputRefs = [useRef(null), useRef(null), useRef(null)];
  const allFacesSelected = selectedFaces.every((face) => typeof face === 'number');
  const selectedResultLabel = allFacesSelected ? selectedFaces.join(' - ') : 'Chưa chọn';

  const handleInputChange = (index, value) => {
    // Chỉ cho phép số từ 1-6
    const numValue = parseInt(value);
    if (value === '' || (numValue >= 1 && numValue <= 6)) {
      onSelectFace(index, value === '' ? null : numValue);
      
      // Tự động chuyển sang ô tiếp theo nếu nhập đúng số
      if (value && numValue >= 1 && numValue <= 6 && index < 2) {
        setTimeout(() => {
          const nextInput = inputRefs[index + 1].current;
          if (nextInput) {
            nextInput.focus();
            if (!selectedFaces[index + 1]) {
              nextInput.select();
            }
          }
        }, 0);
      } else if (value && numValue >= 1 && numValue <= 6 && index === 2) {
        // Khi nhập xong ô cuối cùng, tự động focus vào ô cuối để có thể xóa ngay
        setTimeout(() => {
          const lastInput = inputRefs[2].current;
          if (lastInput) {
            lastInput.focus();
            lastInput.select();
          }
        }, 0);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Xử lý backspace để xóa từ cuối về đầu
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (selectedFaces[index]) {
        // Nếu ô hiện tại có số, xóa số đó
        onSelectFace(index, null);
        // Nếu không phải ô đầu tiên, focus vào ô trước đó
        if (index > 0) {
          setTimeout(() => {
            const prevInput = inputRefs[index - 1].current;
            if (prevInput) {
              prevInput.focus();
              if (selectedFaces[index - 1]) {
                // Nếu ô trước cũng có số, select để có thể xóa tiếp
                prevInput.select();
              }
            }
          }, 0);
        } else {
          // Nếu là ô đầu tiên, focus lại vào ô đó để nhập lại
          setTimeout(() => {
            const input = inputRefs[0].current;
            if (input) {
              input.focus();
              input.select();
            }
          }, 0);
        }
      } else if (index > 0) {
        // Nếu ô hiện tại trống, quay lại ô trước và xóa số ở đó
        const prevIndex = index - 1;
        if (selectedFaces[prevIndex]) {
          onSelectFace(prevIndex, null);
        }
        setTimeout(() => {
          const input = inputRefs[prevIndex].current;
          if (input) {
            input.focus();
            input.select();
          }
        }, 0);
      }
      return;
    }
    
    // Xử lý arrow keys để di chuyển giữa các ô
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      const input = inputRefs[index - 1].current;
      if (input) {
        input.focus();
        if (selectedFaces[index - 1]) {
          input.select();
        }
      }
    }
    if (e.key === 'ArrowRight' && index < 2) {
      e.preventDefault();
      const input = inputRefs[index + 1].current;
      if (input) {
        input.focus();
        if (selectedFaces[index + 1]) {
          input.select();
        }
      }
    }
    
    // Xử lý Delete để xóa số hiện tại
    if (e.key === 'Delete' && selectedFaces[index]) {
      e.preventDefault();
      onSelectFace(index, null);
      setTimeout(() => {
        const input = inputRefs[index].current;
        if (input) {
          input.focus();
          input.select();
        }
      }, 0);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    const numbers = pastedData.split(/[\s,-]+/).filter(n => n).map(n => parseInt(n)).filter(n => n >= 1 && n <= 6);
    
    if (numbers.length > 0) {
      numbers.slice(0, 3).forEach((num, idx) => {
        if (idx < 3) {
          onSelectFace(idx, num);
        }
      });
      // Focus vào ô cuối cùng được điền
      setTimeout(() => {
        const lastFilledIndex = Math.min(numbers.length - 1, 2);
        const input = inputRefs[lastFilledIndex].current;
        if (input) {
          input.focus();
          input.select();
        }
      }, 0);
    }
  };

  // Tự động focus vào ô cuối cùng khi nhập xong cả 3 ô
  useEffect(() => {
    if (allFacesSelected) {
      setTimeout(() => {
        const lastInput = inputRefs[2].current;
        if (lastInput) {
          lastInput.focus();
          lastInput.select();
        }
      }, 100);
    }
  }, [allFacesSelected]);


  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* OTP-style Input Section */}
        <div className="flex flex-col items-center gap-3">
          <label className="text-sm font-medium text-gray-700">
            Nhập kết quả 3 xúc xắc (1-6)
          </label>
          <div className="flex items-center gap-3">
            {[0, 1, 2].map((index) => (
              <div key={`input-${index}`} className="relative">
                {selectedFaces[index] ? (
                  <div 
                    className={`w-16 h-16 flex items-center justify-center border-2 rounded-xl cursor-pointer ${
                      selectedFaces[index]
                        ? 'border-[#f5c453] bg-[#fff8e6] shadow-lg shadow-[#f5c453]/40'
                        : 'border-gray-300'
                    }`}
                    onClick={() => {
                      // Click vào icon để focus và có thể xóa
                      const input = inputRefs[index].current;
                      if (input) {
                        input.focus();
                        input.select();
                      }
                    }}
                  >
                    <img
                      src={diceFaceIconMap[selectedFaces[index]]}
                      alt={`Mặt ${selectedFaces[index]}`}
                      className="h-12 w-12 object-contain pointer-events-none"
                      draggable={false}
                    />
                  </div>
                ) : (
                  <Input
                    ref={inputRefs[index]}
                    type="text"
                    inputMode="numeric"
                    value=""
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    maxLength={1}
                    className={`w-16 h-16 text-center text-2xl font-bold border-2 rounded-xl focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 border-gray-300`}
                    style={{ outline: 'none', boxShadow: 'none' }}
                    placeholder="?"
                  />
                )}
                {/* Hidden input để giữ focus và xử lý keyboard khi đã có số */}
                {selectedFaces[index] && (
                  <input
                    ref={inputRefs[index]}
                    type="text"
                    inputMode="numeric"
                    value={selectedFaces[index]}
                    onChange={(e) => {
                      // Cho phép xóa bằng cách xóa hết text
                      if (e.target.value === '') {
                        handleInputChange(index, '');
                      } else {
                        handleInputChange(index, e.target.value);
                      }
                    }}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    maxLength={1}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    style={{ fontSize: '1px', width: '100%', height: '100%' }}
                    tabIndex={0}
                    autoFocus={index === 2 && allFacesSelected}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 sm:flex-row pt-2 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClearSelection}
            className="flex-1 h-9 rounded-2xl text-sm"
          >
            Xóa lựa chọn
          </Button>
          <Button
            onClick={onSaveResult}
            disabled={!canSaveResult || savingResult}
            className="flex-1 h-9 bg-[#0f4c2c] text-white hover:bg-[#0f4c2c]/90 rounded-2xl disabled:bg-gray-300 text-sm"
          >
            {savingResult ? 'Đang lưu...' : 'Lưu kết quả'}
          </Button>
          <Button
            onClick={onOpenRefundModal}
            disabled={!canRefundBets || refundingBets}
            className="flex-1 h-9 bg-amber-500 text-white hover:bg-amber-600 rounded-2xl disabled:bg-gray-300 text-sm"
          >
            Hột kê
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SicboResultSelection;

