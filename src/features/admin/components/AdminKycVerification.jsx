import { useState, useEffect } from 'react';
import { Clock, ShieldCheck, RefreshCw } from 'lucide-react';
import { message } from '../../../utils/notification';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import Tabs from '../../../components/ui/Tabs';
import KycTable from './kyc/KycTable';
import KycDetailModal from './kyc/KycDetailModal';
import KycProcessModal from './kyc/KycProcessModal';
import kycService from '../../wallet/services/kycService';

const AdminKycVerification = () => {
  const [loading, setLoading] = useState(false);
  const [kycRequests, setKycRequests] = useState([]);
  const [selectedKyc, setSelectedKyc] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [processModalVisible, setProcessModalVisible] = useState(false);
  const [processingAction, setProcessingAction] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  useEffect(() => {
    fetchKycRequests();
  }, [activeTab, pagination.current, pagination.pageSize]);

  const fetchKycRequests = async () => {
    setLoading(true);
    try {
      const response = activeTab === 'pending' 
        ? await kycService.getPendingKycRequests()
        : await kycService.getAllKycRequests();
      
      if (response.success) {
        const data = response.data || [];
        setKycRequests(data);
        setPagination(prev => ({ ...prev, total: data.length }));
      } else {
        message.error(response.message || 'Không thể tải danh sách xác thực');
      }
    } catch (error) {
      message.error(error.message || 'Lỗi khi tải danh sách xác thực');
    } finally {
      setLoading(false);
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
        message.success(
          processingAction === 'approve' 
            ? 'Duyệt xác thực thành công' 
            : 'Từ chối xác thực thành công'
        );
        setProcessModalVisible(false);
        setSelectedKyc(null);
        fetchKycRequests();
      } else {
        message.error(response.message || 'Xử lý yêu cầu thất bại');
      }
    } catch (error) {
      message.error(error.message || 'Xử lý yêu cầu thất bại');
    }
  };

  const handlePaginationChange = (page, pageSize) => {
    setPagination({
      current: page,
      pageSize: pageSize || pagination.pageSize,
      total: pagination.total
    });
  };

  // Paginate data
  const paginatedData = kycRequests.slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <span>Quản lý xác thực tài khoản</span>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchKycRequests}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Tải lại
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: 'pending',
                label: 'Chờ duyệt',
                icon: <Clock className="h-4 w-4" />,
                children: (
                  <KycTable
                    data={paginatedData}
                    loading={loading}
                    pagination={pagination}
                    onPaginationChange={handlePaginationChange}
                    onViewDetail={handleViewDetails}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                )
              },
              {
                key: 'all',
                label: 'Tất cả',
                icon: <ShieldCheck className="h-4 w-4" />,
                children: (
                  <KycTable
                    data={paginatedData}
                    loading={loading}
                    pagination={pagination}
                    onPaginationChange={handlePaginationChange}
                    onViewDetail={handleViewDetails}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                )
              }
            ]}
            contentClassName="p-0"
          />
        </CardContent>
      </Card>

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
