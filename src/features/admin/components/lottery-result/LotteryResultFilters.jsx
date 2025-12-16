import { Card, CardContent } from '../../../../components/ui/Card';
import Select from '../../../../components/ui/Select';
import { Button } from '../../../../components/ui/Button';
import { Plus } from 'lucide-react';

const provinces = [
  // Miền Trung (14 tỉnh)
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
  
  // Miền Nam (17 tỉnh)
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

const mienTrungProvinces = provinces.filter(p => 
  ['phuyen', 'thuathienhue', 'daklak', 'quangnam', 'danang', 'khanhhoa', 'binhdinh', 'quangbinh', 'quangtri', 'gialai', 'ninhthuan', 'daknong', 'quangngai', 'kontum'].includes(p.value)
);

const mienNamProvinces = provinces.filter(p => 
  ['camau', 'dongthap', 'hcm', 'baclieu', 'bentre', 'vungtau', 'cantho', 'dongnai', 'soctrang', 'angiang', 'binhthuan', 'tayninh', 'binhduong', 'travinh', 'vinhlong', 'binhphuoc', 'haugiang', 'longan', 'dalat', 'kiengiang', 'tiengiang'].includes(p.value)
);

const LotteryResultFilters = ({ filterRegion, onFilterChange, onCreate }) => {
  const regionOptions = [
    { value: '', label: 'Tất cả vùng miền' },
    { value: 'mienBac', label: 'Miền Bắc' },
    ...mienTrungProvinces,
    ...mienNamProvinces
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <Select
            value={filterRegion}
            onChange={(value) => onFilterChange(value)}
            options={regionOptions}
            placeholder="Chọn vùng miền"
            size="sm"
            className="w-64"
          />
          <Button
            onClick={onCreate}
            className="gap-2 bg-[#4CAF50] text-white hover:bg-[#45a049] rounded-2xl"
          >
            <Plus className="h-4 w-4" />
            Tạo kết quả mới
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LotteryResultFilters;

