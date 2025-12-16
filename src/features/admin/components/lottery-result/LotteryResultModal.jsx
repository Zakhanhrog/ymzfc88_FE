import Modal from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import LotteryResultFormTable from '../../../../components/admin/LotteryResultFormTable';
import adminLotteryResultService from '../../services/adminLotteryResultService';

const provinces = [
  { value: 'phuyen', label: 'Phú Yên' },
  { value: 'thuathienhue', label: 'Thừa Thiên Huế' },
  { value: 'daklak', label: 'Đắk Lắk' },
  { value: 'quangnam', label: 'Quảng Nam' },
  { value: 'danang', label: 'Đà Nẵng' },
  { value: 'khanhhoa', label: 'Khánh Hòa' },
  { value: 'binhdinh', label: 'Bình Định' },
  { value: 'quangbinh', label: 'Quảng Bình' },
  { value: 'quangtri', label: 'Quảng Trị' },
  { value: 'gialai', label: 'Gia Lai' },
  { value: 'ninhthuan', label: 'Ninh Thuận' },
  { value: 'daknong', label: 'Đắk Nông' },
  { value: 'quangngai', label: 'Quảng Ngãi' },
  { value: 'kontum', label: 'Kon Tum' },
  { value: 'camau', label: 'Cà Mau' },
  { value: 'dongthap', label: 'Đồng Tháp' },
  { value: 'hcm', label: 'TP HCM' },
  { value: 'baclieu', label: 'Bạc Liêu' },
  { value: 'bentre', label: 'Bến Tre' },
  { value: 'vungtau', label: 'Vũng Tàu' },
  { value: 'cantho', label: 'Cần Thơ' },
  { value: 'dongnai', label: 'Đồng Nai' },
  { value: 'soctrang', label: 'Sóc Trăng' },
  { value: 'angiang', label: 'An Giang' },
  { value: 'binhthuan', label: 'Bình Thuận' },
  { value: 'tayninh', label: 'Tây Ninh' },
  { value: 'binhduong', label: 'Bình Dương' },
  { value: 'travinh', label: 'Trà Vinh' },
  { value: 'vinhlong', label: 'Vĩnh Long' },
  { value: 'binhphuoc', label: 'Bình Phước' },
  { value: 'haugiang', label: 'Hậu Giang' },
  { value: 'longan', label: 'Long An' },
  { value: 'dalat', label: 'Đà Lạt' },
  { value: 'kiengiang', label: 'Kiên Giang' },
  { value: 'tiengiang', label: 'Tiền Giang' }
];

const formatDate = (date) => {
  if (!date) return '';
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  try {
    const dateObj = new Date(date);
    return dateObj.toISOString().split('T')[0];
  } catch (error) {
    return date.toString();
  }
};

const getProvinceName = (provinceCode) => {
  if (!provinceCode) return '-';
  const province = provinces.find(p => p.value === provinceCode);
  return province ? province.label : provinceCode;
};

const LotteryResultModal = ({
  open,
  mode, // 'create', 'edit', 'view'
  result,
  formData,
  onClose,
  onSubmit,
  onFormDataChange,
  onRegionChange
}) => {
  const regionOptions = [
    { value: 'mienBac', label: 'Miền Bắc' },
    { value: 'mienTrungNam', label: 'Miền Trung Nam' },
  ];

  const statusOptions = [
    { value: 'DRAFT', label: 'Nháp (chưa dùng để check)' },
    { value: 'PUBLISHED', label: 'Đã công bố (dùng để check)' },
  ];

  const getTitle = () => {
    if (mode === 'create') return 'Tạo kết quả mới';
    if (mode === 'edit') return 'Sửa kết quả';
    return 'Xem kết quả';
  };

  if (mode === 'view') {
    return (
      <Modal
        open={open}
        onClose={onClose}
        title={getTitle()}
        width="max-w-4xl"
        footer={
          <Button variant="outline" onClick={onClose} className="rounded-2xl">
            Đóng
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Vùng miền:</strong> {result?.region === 'mienBac' ? 'Miền Bắc' : 'Miền Trung Nam'}
            </div>
            <div>
              <strong>Tỉnh:</strong> {result?.region === 'mienBac' ? '-' : getProvinceName(result?.province)}
            </div>
            <div>
              <strong>Ngày quay:</strong> {result?.drawDate ? formatDate(result.drawDate) : ''}
            </div>
            <div>
              <strong>Trạng thái:</strong> {result?.status === 'PUBLISHED' ? 'Đã công bố' : 'Nháp'}
            </div>
          </div>
          <div>
            <strong>Kết quả:</strong>
            <div className="mt-2">
              <LotteryResultFormTable
                initialResults={result?.results}
                isEditing={false}
                isReadOnly={true}
              />
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={getTitle()}
      width="max-w-4xl"
      footer={
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="rounded-2xl">
            Hủy
          </Button>
          <Button
            onClick={onSubmit}
            className="bg-[#4CAF50] text-white hover:bg-[#45a049] rounded-2xl"
          >
            {mode === 'create' ? 'Tạo' : 'Cập nhật'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Vùng miền *</label>
          <Select
            value={formData.region}
            onChange={(value) => onRegionChange(value)}
            options={regionOptions}
            size="sm"
            className="w-full"
          />
        </div>

        {formData.region === 'mienTrungNam' && (
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Tỉnh *</label>
            <Select
              value={formData.province}
              onChange={(value) => onFormDataChange({ ...formData, province: value })}
              options={provinces}
              placeholder="-- Chọn tỉnh --"
              size="sm"
              className="w-full"
            />
          </div>
        )}

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Ngày quay *</label>
          <Input
            type="date"
            value={formData.drawDate}
            onChange={(e) => onFormDataChange({ ...formData, drawDate: e.target.value })}
            className="w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Kết quả xổ số *</label>
          <LotteryResultFormTable
            initialResults={formData.results}
            onResultsChange={(jsonResults) => onFormDataChange({ ...formData, results: jsonResults })}
            isEditing={mode === 'edit'}
          />
          <p className="text-sm text-gray-500 mt-2">
            Nhập số vào các ô tương ứng với từng giải thưởng. Các ô trống sẽ không được lưu.
          </p>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Trạng thái *</label>
          <Select
            value={formData.status}
            onChange={(value) => onFormDataChange({ ...formData, status: value })}
            options={statusOptions}
            size="sm"
            className="w-full"
          />
        </div>
      </div>
    </Modal>
  );
};

export default LotteryResultModal;

