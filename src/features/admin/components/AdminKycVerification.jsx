import { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Tag, 
  Button, 
  Modal, 
  Image, 
  Space, 
  Input,
  message,
  Tabs,
  Descriptions
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import kycService from '../../wallet/services/kycService';

const { TextArea } = Input;

const AdminKycVerification = () => {
  const [loading, setLoading] = useState(false);
  const [kycRequests, setKycRequests] = useState([]);
  const [selectedKyc, setSelectedKyc] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [processModalVisible, setProcessModalVisible] = useState(false);
  const [processingAction, setProcessingAction] = useState('');
  const [rejectedReason, setRejectedReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchKycRequests();
  }, [activeTab]);

  const fetchKycRequests = async () => {
    setLoading(true);
    try {
      // Debug: Check admin token
      const adminToken = localStorage.getItem('adminToken');
      console.log('🔐 Admin Token exists:', !!adminToken);
      console.log('🔄 Fetching KYC requests, activeTab:', activeTab);
      
      const response = activeTab === 'pending' 
        ? await kycService.getPendingKycRequests()
        : await kycService.getAllKycRequests();
      
      console.log('✅ KYC Response:', response);
      
      if (response.success) {
        setKycRequests(response.data || []);
        console.log('📊 KYC Requests:', response.data);
      } else {
        console.error('❌ Response not success:', response);
      }
    } catch (error) {
      message.error(error.message || 'Lỗi khi tải danh sách xác thực');
      console.error('❌ Error fetching KYC requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (record) => {
    setSelectedKyc(record);
    setModalVisible(true);
  };

  const handleProcessKyc = (record, action) => {
    setSelectedKyc(record);
    setProcessingAction(action);
    setProcessModalVisible(true);
    setRejectedReason('');
    setAdminNotes('');
  };

  const confirmProcess = async () => {
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
        fetchKycRequests();
      }
    } catch (error) {
      message.error(error.message || 'Xử lý yêu cầu thất bại');
    }
  };

  const statusConfig = {
    PENDING: { color: 'orange', text: 'Chờ duyệt', icon: <ClockCircleOutlined /> },
    APPROVED: { color: 'green', text: 'Đã duyệt', icon: <CheckCircleOutlined /> },
    REJECTED: { color: 'red', text: 'Từ chối', icon: <CloseCircleOutlined /> }
  };

  const isMobile = window.innerWidth <= 768;

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      responsive: ['md']
    },
    {
      title: 'Người dùng',
      key: 'user',
      render: (_, record) => (
        <div>
          <div className="font-semibold">{record.username}</div>
          <div className="text-xs text-gray-500">{record.email}</div>
        </div>
      )
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
      responsive: ['lg']
    },
    {
      title: 'Số CCCD',
      dataIndex: 'idNumber',
      key: 'idNumber',
      responsive: ['lg']
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => {
        const config = statusConfig[record.status];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      }
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (date) => new Date(date).toLocaleString('vi-VN'),
      responsive: ['md']
    },
    {
      title: 'Thao tác',
      key: 'actions',
      fixed: 'right',
      width: isMobile ? 120 : 200,
      render: (_, record) => (
        <Space size="small" direction={isMobile ? 'vertical' : 'horizontal'}>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            {!isMobile && 'Xem'}
          </Button>
          {record.status === 'PENDING' && (
            <>
              <Button
                size="small"
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleProcessKyc(record, 'approve')}
              >
                {!isMobile && 'Duyệt'}
              </Button>
              <Button
                size="small"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleProcessKyc(record, 'reject')}
              >
                {!isMobile && 'Từ chối'}
              </Button>
            </>
          )}
        </Space>
      )
    }
  ];

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <SafetyCertificateOutlined />
          <span>Quản lý xác thực tài khoản</span>
        </div>
      }
      extra={
        <Button onClick={fetchKycRequests} loading={loading}>
          Tải lại
        </Button>
      }
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'pending',
            label: (
              <span>
                <ClockCircleOutlined /> Chờ duyệt
              </span>
            )
          },
          {
            key: 'all',
            label: (
              <span>
                <SafetyCertificateOutlined /> Tất cả
              </span>
            )
          }
        ]}
      />

      <Table
        columns={columns}
        dataSource={kycRequests}
        rowKey="id"
        loading={loading}
        scroll={{ x: 'max-content' }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} yêu cầu`
        }}
      />

      {/* Modal xem chi tiết */}
      <Modal
        title="Chi tiết xác thực"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={isMobile ? '95%' : 800}
      >
        {selectedKyc && (
          <div>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Người dùng">{selectedKyc.username}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedKyc.email}</Descriptions.Item>
              <Descriptions.Item label="Họ tên">{selectedKyc.fullName}</Descriptions.Item>
              <Descriptions.Item label="Số CCCD">{selectedKyc.idNumber}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={statusConfig[selectedKyc.status].color}>
                  {statusConfig[selectedKyc.status].text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày gửi">
                {new Date(selectedKyc.submittedAt).toLocaleString('vi-VN')}
              </Descriptions.Item>
              {selectedKyc.verifiedAt && (
                <Descriptions.Item label="Ngày duyệt">
                  {new Date(selectedKyc.verifiedAt).toLocaleString('vi-VN')}
                </Descriptions.Item>
              )}
              {selectedKyc.rejectedReason && (
                <Descriptions.Item label="Lý do từ chối">
                  <span className="text-red-600">{selectedKyc.rejectedReason}</span>
                </Descriptions.Item>
              )}
              {selectedKyc.adminNotes && (
                <Descriptions.Item label="Ghi chú admin">
                  {selectedKyc.adminNotes}
                </Descriptions.Item>
              )}
            </Descriptions>

            <div className="mt-4">
              <h4 className="font-semibold mb-2 text-center">Ảnh căn cước:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center">
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-500 mb-2">Mặt trước</p>
                  <div className="border rounded-lg overflow-hidden" style={{ height: '200px', width: '350px' }}>
                    <Image
                      src={`http://localhost:8080/api/files/kyc/${selectedKyc.frontImageUrl}`}
                      alt="Mặt trước"
                      width={350}
                      height={200}
                      style={{ objectFit: 'cover', borderRadius: '8px' }}
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-500 mb-2">Mặt sau</p>
                  <div className="border rounded-lg overflow-hidden" style={{ height: '200px', width: '350px' }}>
                    <Image
                      src={`http://localhost:8080/api/files/kyc/${selectedKyc.backImageUrl}`}
                      alt="Mặt sau"
                      width={350}
                      height={200}
                      style={{ objectFit: 'cover', borderRadius: '8px' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {selectedKyc.status === 'PENDING' && (
              <div className="mt-4 flex gap-2">
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={() => {
                    setModalVisible(false);
                    handleProcessKyc(selectedKyc, 'approve');
                  }}
                  block
                >
                  Duyệt
                </Button>
                <Button
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() => {
                    setModalVisible(false);
                    handleProcessKyc(selectedKyc, 'reject');
                  }}
                  block
                >
                  Từ chối
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal xử lý (duyệt/từ chối) */}
      <Modal
        title={processingAction === 'approve' ? 'Duyệt xác thực' : 'Từ chối xác thực'}
        open={processModalVisible}
        onOk={confirmProcess}
        onCancel={() => setProcessModalVisible(false)}
        okText={processingAction === 'approve' ? 'Duyệt' : 'Từ chối'}
        cancelText="Hủy"
        okButtonProps={{ 
          danger: processingAction === 'reject',
          type: processingAction === 'approve' ? 'primary' : 'default'
        }}
      >
        {selectedKyc && (
          <div>
            <p className="mb-4">
              Bạn có chắc chắn muốn {processingAction === 'approve' ? 'duyệt' : 'từ chối'} yêu cầu xác thực của{' '}
              <strong>{selectedKyc.username}</strong>?
            </p>

            {processingAction === 'reject' && (
              <div className="mb-4">
                <label className="block mb-2 font-semibold text-red-600">
                  Lý do từ chối: <span className="text-red-500">*</span>
                </label>
                <TextArea
                  rows={3}
                  placeholder="Nhập lý do từ chối..."
                  value={rejectedReason}
                  onChange={(e) => setRejectedReason(e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="block mb-2 font-semibold">Ghi chú của admin:</label>
              <TextArea
                rows={3}
                placeholder="Thêm ghi chú (tùy chọn)..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
              />
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default AdminKycVerification;

