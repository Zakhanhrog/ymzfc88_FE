import { useState, useEffect } from 'react';
import { message } from '../../../utils/notification';
import Alert from '../../../components/ui/Alert';
import KycTable from './kyc/KycTable';
import KycDetailModal from './kyc/KycDetailModal';
import KycProcessModal from './kyc/KycProcessModal';
import kycService from '../../wallet/services/kycService';

const AdminKycVerification = () => {
  const [loading, setLoading] = useState(false);
  const [loadingApproved, setLoadingApproved] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [selectedKyc, setSelectedKyc] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [processModalVisible, setProcessModalVisible] = useState(false);
  const [processingAction, setProcessingAction] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pendingPagination, setPendingPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [approvedPagination, setApprovedPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  useEffect(() => {
    fetchKycRequests();
  }, [pendingPagination.current, pendingPagination.pageSize, approvedPagination.current, approvedPagination.pageSize]);

  const fetchKycRequests = async () => {
    setLoading(true);
    setLoadingApproved(true);
    try {
      // Fetch pending requests
      const pendingResponse = await kycService.getPendingKycRequests();
      if (pendingResponse.success) {
        const pendingData = pendingResponse.data || [];
        setPendingRequests(pendingData);
        setPendingPagination(prev => ({ ...prev, total: pendingData.length }));
      }
      
      // Fetch all requests and filter approved/rejected
      const allResponse = await kycService.getAllKycRequests();
      if (allResponse.success) {
        const allData = allResponse.data || [];
        const approvedData = allData.filter(item => 
          item.status === 'APPROVED' || item.status === 'REJECTED'
        );
        setApprovedRequests(approvedData);
        setApprovedPagination(prev => ({ ...prev, total: approvedData.length }));
      }
      
      setError('');
    } catch (error) {
      const errorMsg = error.message || 'Lỗi khi tải danh sách xác thực';
      setError(errorMsg);
      message.error(errorMsg);
    } finally {
      setLoading(false);
      setLoadingApproved(false);
    }
  };

  const handleViewDetails = (record) => {
    setSelectedKyc(record);
    setDetailModalVisible(true);
  };

  const handleApprove = (record) => {
    setSelectedKyc(record);
    setProcessingAction('approve');
    setProcessModalVisible(true);
  };

  const handleReject = (record) => {
    setSelectedKyc(record);
    setProcessingAction('reject');
    setProcessModalVisible(true);
  };

  const handleProcessConfirm = async (rejectedReason, adminNotes) => {
    if (processingAction === 'reject' && !rejectedReason.trim()) {
      message.error('Vui lòng nhập lý do từ chối');
      return;
    }

    try {
      const response = await kycService.processKyc(
        selectedKyc.id,
        processingAction,
        rejectedReason,
        adminNotes
      );

      if (response.success) {
        const successMsg = processingAction === 'approve' 
            ? 'Duyệt xác thực thành công' 
          : 'Từ chối xác thực thành công';
        setSuccess(successMsg);
        message.success(successMsg);
        setProcessModalVisible(false);
        setSelectedKyc(null);
        setError('');
        fetchKycRequests();
      } else {
        const errorMsg = response.message || 'Xử lý yêu cầu thất bại';
        setError(errorMsg);
        message.error(errorMsg);
      }
    } catch (error) {
      const errorMsg = error.message || 'Xử lý yêu cầu thất bại';
      setError(errorMsg);
      message.error(errorMsg);
    }
  };

  const handlePendingPaginationChange = (page, pageSize) => {
    setPendingPagination({
      current: page,
      pageSize: pageSize || pendingPagination.pageSize,
      total: pendingPagination.total
    });
  };

  const handleApprovedPaginationChange = (page, pageSize) => {
    setApprovedPagination({
      current: page,
      pageSize: pageSize || approvedPagination.pageSize,
      total: approvedPagination.total
    });
  };

  // Paginate data
  const paginatedPendingData = pendingRequests.slice(
    (pendingPagination.current - 1) * pendingPagination.pageSize,
    pendingPagination.current * pendingPagination.pageSize
  );

  const paginatedApprovedData = approvedRequests.slice(
    (approvedPagination.current - 1) * approvedPagination.pageSize,
    approvedPagination.current * approvedPagination.pageSize
  );

  return (
    <div className="space-y-6">
      {error && (
        <Alert 
          type="error" 
          description={error}
          className="rounded-lg"
        />
      )}

      {success && (
        <Alert 
          type="success" 
          description={success}
          className="rounded-lg"
          />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bảng Đang chờ duyệt */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Đang chờ duyệt</h3>
          </div>
          <div className="p-6">
            <KycTable
              data={paginatedPendingData}
              loading={loading}
              pagination={pendingPagination}
              onPaginationChange={handlePendingPaginationChange}
              onViewDetail={handleViewDetails}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </div>
        </div>

        {/* Bảng Đã duyệt */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Đã duyệt</h3>
          </div>
          <div className="p-6">
            <KycTable
              data={paginatedApprovedData}
              loading={loadingApproved}
              pagination={approvedPagination}
              onPaginationChange={handleApprovedPaginationChange}
              onViewDetail={handleViewDetails}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <KycDetailModal
        open={detailModalVisible}
        onClose={() => {
          setDetailModalVisible(false);
          setSelectedKyc(null);
        }}
        kyc={selectedKyc}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Process Modal */}
      <KycProcessModal
        open={processModalVisible}
        onClose={() => {
          setProcessModalVisible(false);
          setSelectedKyc(null);
          setProcessingAction('');
        }}
        kyc={selectedKyc}
        action={processingAction}
        onConfirm={handleProcessConfirm}
      />
    </div>
  );
};

export default AdminKycVerification;
