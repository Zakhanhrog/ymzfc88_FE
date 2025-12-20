import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { Button } from '../../../components/ui/Button';
import { Plus, RefreshCw } from 'lucide-react';
import PaymentMethodStats from './payment-method/PaymentMethodStats';
import PaymentMethodTable from './payment-method/PaymentMethodTable';
import PaymentMethodFormModal from './payment-method/PaymentMethodFormModal';
import PaymentMethodDetailModal from './payment-method/PaymentMethodDetailModal';
import { adminService } from '../services/adminService';

const AdminPaymentMethodManagement = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  });

  // Payment method types (chỉ các loại OKDPAY hỗ trợ)
  const paymentTypes = [
    { value: 'BANK', label: 'Ngân hàng', icon: '🏦', color: 'blue' },
    { value: 'MOMO', label: 'Ví MoMo', icon: '📱', color: 'pink' },
    { value: 'VIET_QR', label: 'VietQR', icon: '📲', color: 'green' },
    { value: 'ZALO_PAY', label: 'ZaloPay', icon: '💳', color: 'cyan' }
  ];

  useEffect(() => {
    loadPaymentMethods();
  }, [pagination.current, pagination.pageSize]);

  const loadPaymentMethods = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllPaymentMethods();
      if (response.success) {
        const data = Array.isArray(response.data) ? response.data : [];
        setPaymentMethods(data);
        setPagination(prev => ({
          ...prev,
          total: data.length
        }));
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePaymentMethod = async (values) => {
    try {
      const response = await adminService.createPaymentMethod(values);
      if (response.success) {
        message.success('Tạo phương thức thanh toán thành công!');
        setShowCreateModal(false);
        loadPaymentMethods();
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleUpdatePaymentMethod = async (values) => {
    try {
      const response = await adminService.updatePaymentMethod(selectedPaymentMethod.id, values);
      if (response.success) {
        message.success('Cập nhật phương thức thanh toán thành công!');
        setShowEditModal(false);
        setSelectedPaymentMethod(null);
        loadPaymentMethods();
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleDeletePaymentMethod = async (id) => {
    try {
      const response = await adminService.deletePaymentMethod(id);
      if (response.success) {
        message.success('Xóa phương thức thanh toán thành công!');
        loadPaymentMethods();
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const response = await adminService.togglePaymentMethodStatus(id);
      if (response.success) {
        message.success('Cập nhật trạng thái thành công!');
        loadPaymentMethods();
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleViewDetail = (paymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
    setShowDetailModal(true);
  };

  const handleEdit = (paymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
    setShowEditModal(true);
    setShowDetailModal(false);
  };

  const handlePageChange = (page, pageSize) => {
    setPagination({
      current: page,
      pageSize: pageSize || pagination.pageSize,
      total: pagination.total
    });
  };

  const paginatedData = paymentMethods.slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize
  );

  return (
    <div className="space-y-6">
      <PaymentMethodStats 
        paymentMethods={paymentMethods} 
        paymentTypes={paymentTypes}
      />

      <div className="rounded-lg bg-white p-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Danh sách phương thức thanh toán</h2>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowCreateModal(true)}
              className="gap-2 bg-[#4CAF50] text-white hover:bg-[#45a049]"
            >
              <Plus className="h-4 w-4" />
              Thêm phương thức
            </Button>
            <Button
              variant="outline"
              onClick={loadPaymentMethods}
              disabled={loading}
              className="gap-2 rounded-lg"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
          </div>
        </div>

        <PaymentMethodTable
          paymentMethods={paginatedData}
          paymentTypes={paymentTypes}
          loading={loading}
          onViewDetail={handleViewDetail}
          onEdit={handleEdit}
          onDelete={handleDeletePaymentMethod}
          onToggleStatus={handleToggleStatus}
          currentPage={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onPageChange={handlePageChange}
          onPageSizeChange={(pageSize) => handlePageChange(1, pageSize)}
        />
      </div>

      <PaymentMethodFormModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreatePaymentMethod}
        paymentTypes={paymentTypes}
        mode="create"
      />

      <PaymentMethodFormModal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedPaymentMethod(null);
        }}
        onSubmit={handleUpdatePaymentMethod}
        paymentTypes={paymentTypes}
        initialData={selectedPaymentMethod}
        mode="edit"
      />

      <PaymentMethodDetailModal
        paymentMethod={selectedPaymentMethod}
        paymentTypes={paymentTypes}
        open={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedPaymentMethod(null);
        }}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
};

export default AdminPaymentMethodManagement;
