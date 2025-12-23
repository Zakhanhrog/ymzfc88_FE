import React, { useState, useEffect } from 'react';
import { message } from '../../../utils/notification';
import DepositStats from './deposit-approval/DepositStats';
import DepositFilters from './deposit-approval/DepositFilters';
import DepositTable from './deposit-approval/DepositTable';
import DepositDetailModal from './deposit-approval/DepositDetailModal';
import ApproveDepositModal from './deposit-approval/ApproveDepositModal';
import RejectDepositModal from './deposit-approval/RejectDepositModal';
import adminService from '../services/adminService';

const AdminDepositApproval = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
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
    loadDeposits();
    loadStatistics();
  }, [filters, pagination.current, pagination.pageSize]);

  const loadDeposits = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDepositRequests({
        ...filters,
        page: pagination.current - 1,
        size: pagination.pageSize
      });
      if (response.success) {
        const data = response.data.content || response.data;
        setDeposits(Array.isArray(data) ? data : []);
        if (response.data.totalElements !== undefined) {
          setPagination(prev => ({
            ...prev,
            total: response.data.totalElements
          }));
        }
      }
    } catch (error) {
      message.error(error.message || 'Lỗi khi tải danh sách nạp tiền');
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await adminService.getDepositStatistics();
      if (response.success) {
        setStatistics(response.data);
      }
    } catch (error) {
      // Silent fail for statistics
    }
  };

  const showApproveModal = (e, depositId) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedDeposit(deposits.find(d => d.id === depositId));
    setApproveModalVisible(true);
  };

  const showRejectModal = (e, depositId) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedDeposit(deposits.find(d => d.id === depositId));
    setRejectModalVisible(true);
  };

  const confirmApprove = async () => {
    try {
      const response = await adminService.approveDeposit(selectedDeposit.id);
      if (response.success) {
        message.success('Đã duyệt lệnh nạp tiền thành công!');
        setApproveModalVisible(false);
        setSelectedDeposit(null);
        loadDeposits();
        loadStatistics();
      } else {
        message.error(response.message || 'Lỗi khi duyệt lệnh nạp tiền');
      }
    } catch (error) {
      message.error(error.message || 'Lỗi khi duyệt lệnh nạp tiền');
    }
  };

  const confirmReject = async (rejectReason) => {
    if (!rejectReason || !rejectReason.trim()) {
      message.error('Vui lòng nhập lý do từ chối');
      return;
    }
    
    try {
      const response = await adminService.rejectDeposit(selectedDeposit.id, rejectReason);
      if (response.success) {
        message.success('Đã từ chối lệnh nạp tiền thành công!');
        setRejectModalVisible(false);
        setSelectedDeposit(null);
        loadDeposits();
        loadStatistics();
      } else {
        message.error(response.message || 'Lỗi khi từ chối lệnh nạp tiền');
      }
    } catch (error) {
      message.error(error.message || 'Lỗi khi từ chối lệnh nạp tiền');
    }
  };

  const showDepositDetail = (deposit) => {
    setSelectedDeposit(deposit);
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
      <DepositStats statistics={statistics} />
      
      <DepositFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onRefresh={loadDeposits}
        loading={loading}
      />

      <DepositTable
        deposits={deposits}
        loading={loading}
        onViewDetail={showDepositDetail}
        onApprove={showApproveModal}
        onReject={showRejectModal}
        currentPage={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total}
        onPageChange={handlePageChange}
        onPageSizeChange={(pageSize) => handlePageChange(1, pageSize)}
      />

      <DepositDetailModal
        deposit={selectedDeposit}
        visible={detailModalVisible}
        onClose={() => {
          setDetailModalVisible(false);
          setSelectedDeposit(null);
        }}
        onApprove={showApproveModal}
        onReject={showRejectModal}
      />

      <ApproveDepositModal
        deposit={selectedDeposit}
        visible={approveModalVisible}
        onClose={() => {
          setApproveModalVisible(false);
          setSelectedDeposit(null);
        }}
        onConfirm={confirmApprove}
      />

      <RejectDepositModal
        deposit={selectedDeposit}
        visible={rejectModalVisible}
        onClose={() => {
          setRejectModalVisible(false);
          setSelectedDeposit(null);
        }}
        onConfirm={confirmReject}
      />
    </div>
  );
};

export default AdminDepositApproval;
