import { useCallback, useEffect, useState } from 'react';
import { message } from '../../../utils/notification';
import adminService from '../services/adminService';
import { Button } from '../../../components/ui/Button';
import Table from '../../../components/ui/Table';
import Pagination from '../../../components/ui/Pagination';
import StatusTag from './StatusTag';
import { Plus, Edit, Shield, Trash2 } from 'lucide-react';
import CreateSubAdminModal from './sub-admin-management/CreateSubAdminModal';
import EditSubAdminModal from './sub-admin-management/EditSubAdminModal';
import C2PasswordModal from './staff-management/C2PasswordModal';

const DEFAULT_PAGE_SIZE = 20;

const AdminSubAdminManagement = () => {
  const [loading, setLoading] = useState(false);
  const [subAdmins, setSubAdmins] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showC2Modal, setShowC2Modal] = useState(false);
  const [selectedSubAdmin, setSelectedSubAdmin] = useState(null);

  const fetchSubAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminService.getSubAdmins(
        pagination.current - 1,
        pagination.pageSize
      );
      
      if (response.success && response.data) {
        // response.data là Page object trực tiếp từ Spring Data
        const pageData = response.data;
        
        // Spring Page object có structure: { content: [], totalElements: number, ... }
        const content = pageData.content || [];
        const total = pageData.totalElements || 0;
        
        setSubAdmins(Array.isArray(content) ? content : []);
        setPagination((prev) => ({
          ...prev,
          total: total,
        }));
      } else {
        setSubAdmins([]);
      setPagination((prev) => ({
        ...prev,
          total: 0,
      }));
      }
    } catch (error) {
      console.error('Error fetching sub-admins:', error);
      message.error(error.message || 'Không thể tải danh sách admin phụ');
      setSubAdmins([]);
      setPagination((prev) => ({
        ...prev,
        total: 0,
      }));
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize]);

  useEffect(() => {
    fetchSubAdmins();
  }, [pagination.current, pagination.pageSize]);

  const handlePaginationChange = (page, pageSize) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize: pageSize || prev.pageSize,
    }));
  };

  const handleCreateSubAdmin = async (formData) => {
    try {
      const response = await adminService.createSubAdmin(formData);
      if (response.success) {
        message.success('Tạo admin phụ thành công!');
        setShowCreateModal(false);
        // Reset về trang 1
        setPagination((prev) => ({
          ...prev,
          current: 1,
        }));
        // Fetch lại danh sách ngay lập tức
        // useEffect sẽ tự động trigger khi pagination.current thay đổi
      }
    } catch (error) {
      message.error(error.message || 'Không thể tạo admin phụ');
    }
  };

  const handleUpdateSubAdmin = async (formData) => {
    try {
      const response = await adminService.updateSubAdmin(selectedSubAdmin.id, formData);
      if (response.success) {
        message.success('Cập nhật thông tin thành công');
        setShowEditModal(false);
        setSelectedSubAdmin(null);
        fetchSubAdmins();
      }
    } catch (error) {
      message.error(error.message || 'Không thể cập nhật thông tin');
    }
  };

  const handleDeleteSubAdmin = async (subAdminId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa admin phụ này?')) {
      return;
    }
    try {
      const response = await adminService.deleteSubAdmin(subAdminId);
      if (response.success) {
        message.success('Xóa admin phụ thành công');
        fetchSubAdmins();
      }
    } catch (error) {
      message.error(error.message || 'Không thể xóa admin phụ');
    }
  };

  const handleUpdateStatus = async (subAdminId, status) => {
    try {
      const response = await adminService.updateSubAdminStatus(subAdminId, status);
      if (response.success) {
        message.success('Cập nhật trạng thái thành công');
        fetchSubAdmins();
      }
    } catch (error) {
      message.error(error.message || 'Không thể cập nhật trạng thái');
    }
  };

  const handleUpdateC2Password = async (newC2Password) => {
    try {
      const response = await adminService.updateSubAdminC2Password(selectedSubAdmin.id, newC2Password);
      if (response.success) {
        message.success('Đổi mật khẩu C2 thành công');
        setShowC2Modal(false);
        setSelectedSubAdmin(null);
      }
    } catch (error) {
      message.error(error.message || 'Không thể đổi mật khẩu C2');
    }
  };

  const columns = [
    {
      key: 'id',
      title: 'ID',
      width: 80,
      render: (_, record) => (
        <span className="text-sm text-gray-600">#{record.id}</span>
      )
    },
    {
      key: 'username',
      title: 'Tài khoản',
      width: 180,
      render: (_, record) => (
        <div>
          <div className="font-semibold text-sm text-gray-900">{record.username}</div>
          <div className="text-xs text-gray-500">{record.email}</div>
        </div>
      )
    },
    {
      key: 'fullName',
      title: 'Họ tên',
      width: 160,
      render: (_, record) => (
        <span className="text-sm text-gray-900">
          {record.fullName || <span className="text-gray-400">Chưa cập nhật</span>}
        </span>
      )
    },
    {
      key: 'phoneNumber',
      title: 'Số điện thoại',
      width: 140,
      render: (_, record) => (
        <span className="text-sm text-gray-900">
          {record.phoneNumber || <span className="text-gray-400">-</span>}
        </span>
      )
    },
    {
      key: 'status',
      title: 'Trạng thái',
      width: 120,
      render: (_, record) => {
        const statusMap = {
          ACTIVE: { bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200', label: 'Hoạt động' },
          INACTIVE: { bgColor: 'bg-orange-50', textColor: 'text-orange-700', borderColor: 'border-orange-200', label: 'Tạm khóa' },
          SUSPENDED: { bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200', label: 'Tạm dừng' },
          BANNED: { bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200', label: 'Bị cấm' }
        };
        const config = statusMap[record.status] || statusMap.ACTIVE;
        return (
          <StatusTag
            status={record.status}
            customConfig={{ [record.status]: config }}
          />
        );
      }
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: 200,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedSubAdmin(record);
              setShowEditModal(true);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedSubAdmin(record);
              setShowC2Modal(true);
            }}
          >
            <Shield className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteSubAdmin(record.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center">
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Tạo admin phụ
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={subAdmins}
        loading={loading}
      />

      <Pagination
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total}
        onChange={handlePaginationChange}
      />

      <CreateSubAdminModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateSubAdmin}
      />

      <EditSubAdminModal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedSubAdmin(null);
        }}
        subAdmin={selectedSubAdmin}
        onSubmit={handleUpdateSubAdmin}
        onUpdateStatus={handleUpdateStatus}
      />

      <C2PasswordModal
        open={showC2Modal}
        onClose={() => {
          setShowC2Modal(false);
          setSelectedSubAdmin(null);
        }}
        staff={selectedSubAdmin}
        onSubmit={handleUpdateC2Password}
      />
    </div>
  );
};

export default AdminSubAdminManagement;

