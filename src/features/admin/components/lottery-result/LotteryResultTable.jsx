import Table from '../../../../components/ui/Table';
import Tag from '../../../../components/ui/Tag';
import { Button } from '../../../../components/ui/Button';
import { Card, CardContent } from '../../../../components/ui/Card';
import { Eye, Edit, Trash2, Loader2, Database, CheckCircle2, XCircle } from 'lucide-react';

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
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }
  
  try {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    return date.toString();
  }
};

const getProvinceName = (provinceCode) => {
  if (!provinceCode) return '-';
  const province = provinces.find(p => p.value === provinceCode);
  return province ? province.label : provinceCode;
};

const LotteryResultTable = ({ 
  results = [], 
  loading = false,
  currentPage = 0,
  totalPages = 0,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish
}) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-gray-400" />
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </CardContent>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Database className="h-12 w-12 mx-auto text-gray-400" />
          <p className="mt-4 text-gray-600">Chưa có kết quả nào</p>
        </CardContent>
      </Card>
    );
  }

  const columns = [
    {
      key: 'id',
      title: 'ID',
      width: 80,
      align: 'center',
      render: (_, record) => (
        <span className="text-sm font-medium text-gray-900">{record.id}</span>
      )
    },
    {
      key: 'region',
      title: 'Vùng miền',
      width: 150,
      render: (_, record) => (
        <span className="text-sm text-gray-900">
          {record.region === 'mienBac' ? 'Miền Bắc' : 'Miền Trung Nam'}
        </span>
      )
    },
    {
      key: 'province',
      title: 'Tỉnh',
      width: 150,
      render: (_, record) => (
        <span className="text-sm text-gray-900">
          {record.region === 'mienBac' ? '-' : getProvinceName(record.province)}
        </span>
      )
    },
    {
      key: 'drawDate',
      title: 'Ngày quay',
      width: 120,
      render: (_, record) => (
        <span className="text-sm text-gray-900">{formatDate(record.drawDate)}</span>
      )
    },
    {
      key: 'status',
      title: 'Trạng thái',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Tag color={record.status === 'PUBLISHED' ? 'green' : 'yellow'} className="text-xs">
          {record.status === 'PUBLISHED' ? 'Đã công bố' : 'Nháp'}
        </Tag>
      )
    },
    {
      key: 'createdAt',
      title: 'Ngày tạo',
      width: 120,
      render: (_, record) => (
        <span className="text-sm text-gray-600">{formatDate(record.createdAt)}</span>
      )
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: 200,
      align: 'center',
      render: (_, record) => (
        <div className="flex justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(record)}
            className="h-8 w-8 p-0"
            title="Xem"
          >
            <Eye className="h-4 w-4 text-gray-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(record)}
            className="h-8 w-8 p-0"
            title="Sửa"
          >
            <Edit className="h-4 w-4 text-yellow-600" />
          </Button>
          {record.status === 'DRAFT' ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPublish(record.id)}
              className="h-8 w-8 p-0"
              title="Công bố"
            >
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUnpublish(record.id)}
              className="h-8 w-8 p-0"
              title="Hủy công bố"
            >
              <XCircle className="h-4 w-4 text-orange-600" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(record.id)}
            className="h-8 w-8 p-0"
            title="Xóa"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <Card>
      <CardContent className="p-0">
        <Table
          columns={columns}
          dataSource={results}
          rowKey="id"
          loading={false}
          emptyText="Chưa có kết quả nào"
        />
        {totalPages > 1 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="rounded-2xl"
            >
              Trước
            </Button>
            <span className="px-3 py-1 text-sm text-gray-700">
              Trang {currentPage + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage >= totalPages - 1}
              className="rounded-2xl"
            >
              Sau
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LotteryResultTable;

