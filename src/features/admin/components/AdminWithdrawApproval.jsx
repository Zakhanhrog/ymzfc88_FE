import React, { useState, useEffect } from 'react';
import { message } from '../../../utils/notification';
import WithdrawStats from './withdraw-approval/WithdrawStats';
import WithdrawFilters from './withdraw-approval/WithdrawFilters';
import WithdrawTable from './withdraw-approval/WithdrawTable';
import WithdrawDetailModal from './withdraw-approval/WithdrawDetailModal';
import ApproveWithdrawModal from './withdraw-approval/ApproveWithdrawModal';
import RejectWithdrawModal from './withdraw-approval/RejectWithdrawModal';
import adminService from '../services/adminService';

const AdminWithdrawApproval = () => {
  const [withdraws, setWithdraws] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedWithdraw, setSelectedWithdraw] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [statistics, setStatistics] = useState({});
  const [filters, setFilters] = useState({
    status: 'PENDING',
    dateRange: null,
    searchText: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  });

  useEffect(() => {
    loadWithdraws();
    loadStatistics();
  }, [filters, pagination.current, pagination.pageSize]);

  const loadWithdraws = async () => {
    try {
      setLoading(true);
      const response = await adminService.getWithdrawRequests({
        ...filters,
        page: pagination.current - 1,
        size: pagination.pageSize
      });
      if (response.success) {
        const data = response.data.content || response.data;
        setWithdraws(Array.isArray(data) ? data : []);
        if (response.data.totalElements !== undefined) {
          setPagination(prev => ({
            ...prev,
            total: response.data.totalElements
          }));
        }
      }
    } catch (error) {
      message.error(error.message || 'Lỗi khi tải danh sách rút tiền');
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await adminService.getWithdrawStatistics();
      if (response.success) {
        setStatistics(response.data);
      }
    } catch (error) {
      // Silent fail for statistics
    }
  };

  const showApproveModal = (withdrawId) => {
    setSelectedWithdraw(withdraws.find(w => w.id === withdrawId));
    setApproveModalVisible(true);
  };

  const showRejectModal = (withdrawId) => {
    setSelectedWithdraw(withdraws.find(w => w.id === withdrawId));
    setRejectModalVisible(true);
  };

  const confirmApprove = async () => {
    try {
      const response = await adminService.approveWithdraw(selectedWithdraw.id);
      if (response.success) {
        message.success('Đã duyệt lệnh rút tiền thành công!');
        setApproveModalVisible(false);
        setSelectedWithdraw(null);
        loadWithdraws();
        loadStatistics();
      } else {
        message.error(response.message || 'Lỗi khi duyệt lệnh rút tiền');
      }
    } catch (error) {
      message.error(error.message || 'Lỗi khi duyệt lệnh rút tiền');
    }
  };

  const confirmReject = async (rejectReason) => {
    if (!rejectReason || !rejectReason.trim()) {
      message.error('Vui lòng nhập lý do từ chối');
      return;
    }
    
    try {
      const response = await adminService.rejectWithdraw(selectedWithdraw.id, rejectReason);
      if (response.success) {
        message.success('Đã từ chối lệnh rút tiền thành công!');
        setRejectModalVisible(false);
        setSelectedWithdraw(null);
        loadWithdraws();
        loadStatistics();
      } else {
        message.error(response.message || 'Lỗi khi từ chối lệnh rút tiền');
      }
    } catch (error) {
      message.error(error.message || 'Lỗi khi từ chối lệnh rút tiền');
    }
  };

  const showWithdrawDetail = (withdraw) => {
    setSelectedWithdraw(withdraw);
    setDetailModalVisible(true);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handlePageChange = (page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize || prev.pageSize
    }));
  };

  return (
    <div className="space-y-6">
      <WithdrawStats statistics={statistics} />
      
      <WithdrawFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onRefresh={loadWithdraws}
        loading={loading}
      />

      <WithdrawTable
        withdraws={withdraws}
        loading={loading}
        onViewDetail={showWithdrawDetail}
        onApprove={showApproveModal}
        onReject={showRejectModal}
        currentPage={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total}
        onPageChange={handlePageChange}
        onPageSizeChange={(pageSize) => handlePageChange(1, pageSize)}
      />

      <WithdrawDetailModal
        withdraw={selectedWithdraw}
        visible={detailModalVisible}
        onClose={() => {
          setDetailModalVisible(false);
          setSelectedWithdraw(null);
        }}
        onApprove={showApproveModal}
        onReject={showRejectModal}
      />

      <ApproveWithdrawModal
        withdraw={selectedWithdraw}
        visible={approveModalVisible}
        onClose={() => {
          setApproveModalVisible(false);
          setSelectedWithdraw(null);
        }}
        onConfirm={confirmApprove}
      />

      <RejectWithdrawModal
        withdraw={selectedWithdraw}
        visible={rejectModalVisible}
        onClose={() => {
          setRejectModalVisible(false);
          setSelectedWithdraw(null);
        }}
        onConfirm={confirmReject}
      />
    </div>
  );
};

export default AdminWithdrawApproval;
