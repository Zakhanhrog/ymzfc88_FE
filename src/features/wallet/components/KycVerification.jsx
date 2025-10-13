import { useState, useEffect } from 'react';
import { 
  Card, 
  Upload, 
  Button, 
  Form, 
  Input, 
  message, 
  Spin,
  Result,
  Tag,
  Space,
  Image
} from 'antd';
import {
  UploadOutlined,
  IdcardOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { HEADING_STYLES, BODY_STYLES, FONT_SIZE, FONT_WEIGHT } from '../../../utils/typography';
import kycService from '../services/kycService';

const KycVerification = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchingStatus, setFetchingStatus] = useState(true);
  const [kycStatus, setKycStatus] = useState(null);
  const [frontFileList, setFrontFileList] = useState([]);
  const [backFileList, setBackFileList] = useState([]);

  useEffect(() => {
    fetchKycStatus();
  }, []);

  const fetchKycStatus = async () => {
    setFetchingStatus(true);
    try {
      // Debug: Check user token
      const userToken = localStorage.getItem('token');
      
      const response = await kycService.getKycStatus();
      
      if (response.success && response.data) {
        setKycStatus(response.data);
      } else {
      }
    } catch (error) {
    } finally {
      setFetchingStatus(false);
    }
  };

  const handleSubmit = async (values) => {
    if (frontFileList.length === 0 || backFileList.length === 0) {
      message.error('Vui lòng tải lên cả 2 ảnh căn cước');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('frontImage', frontFileList[0].originFileObj);
      formData.append('backImage', backFileList[0].originFileObj);
      formData.append('idNumber', values.idNumber);
      formData.append('fullName', values.fullName);

      const response = await kycService.submitKyc(formData);
      
      if (response.success) {
        message.success('Gửi yêu cầu xác thực thành công! Chờ admin duyệt.');
        form.resetFields();
        setFrontFileList([]);
        setBackFileList([]);
        fetchKycStatus();
      }
    } catch (error) {
      message.error(error.message || 'Gửi yêu cầu thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleFrontChange = ({ fileList }) => {
    setFrontFileList(fileList.slice(-1)); // Chỉ giữ 1 file
  };

  const handleBackChange = ({ fileList }) => {
    setBackFileList(fileList.slice(-1)); // Chỉ giữ 1 file
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Chỉ có thể tải lên file ảnh!');
      return Upload.LIST_IGNORE;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Ảnh phải nhỏ hơn 5MB!');
      return Upload.LIST_IGNORE;
    }
    return false; // Prevent auto upload
  };


  if (fetchingStatus) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  // Nếu đã có yêu cầu KYC
  if (kycStatus) {
    const statusConfig = {
      PENDING: {
        icon: <ClockCircleOutlined style={{ fontSize: '48px', color: '#faad14' }} />,
        title: 'Đang chờ duyệt',
        description: 'Yêu cầu xác thực của bạn đang được xem xét',
        color: 'warning',
        tagColor: 'orange'
      },
      APPROVED: {
        icon: <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a' }} />,
        title: 'Đã xác thực',
        description: 'Tài khoản của bạn đã được xác thực thành công',
        color: 'success',
        tagColor: 'green'
      },
      REJECTED: {
        icon: <CloseCircleOutlined style={{ fontSize: '48px', color: '#ff4d4f' }} />,
        title: 'Bị từ chối',
        description: kycStatus.rejectedReason || 'Yêu cầu xác thực của bạn bị từ chối',
        color: 'error',
        tagColor: 'red'
      }
    };

    const config = statusConfig[kycStatus.status] || statusConfig.PENDING;

    return (
      <Card className="shadow-md" style={{ borderRadius: '16px' }}>
        <Result
          icon={config.icon}
          title={config.title}
          subTitle={config.description}
          extra={[
            <Space key="info" direction="vertical" size="large" style={{ width: '100%', marginTop: '20px' }}>
              <div className="bg-gray-50 p-4 rounded-lg">
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Họ tên:</span>
                    <strong>{kycStatus.fullName}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Số CCCD:</span>
                    <strong>{kycStatus.idNumber}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Trạng thái:</span>
                    <Tag color={config.tagColor}>{config.title}</Tag>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Ngày gửi:</span>
                    <span>{new Date(kycStatus.submittedAt).toLocaleString('vi-VN')}</span>
                  </div>
                  {kycStatus.verifiedAt && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Ngày duyệt:</span>
                      <span>{new Date(kycStatus.verifiedAt).toLocaleString('vi-VN')}</span>
                    </div>
                  )}
                </Space>
              </div>

              {/* Hiển thị ảnh đã upload */}
              {kycStatus.frontImageUrl && kycStatus.backImageUrl && (
                <div className="mt-4">
                  <p className="text-gray-600 mb-2 text-center">Ảnh căn cước đã gửi:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center">
                    <div className="flex flex-col items-center">
                      <p className="text-sm text-gray-500 mb-2">Mặt trước</p>
                      <div className="border rounded-lg overflow-hidden" style={{ height: '180px', width: '300px' }}>
                        <Image
                          src={`http://localhost:8080/api/files/kyc/${kycStatus.frontImageUrl}`}
                          alt="Mặt trước"
                          width={300}
                          height={180}
                          style={{ objectFit: 'cover' }}
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-sm text-gray-500 mb-2">Mặt sau</p>
                      <div className="border rounded-lg overflow-hidden" style={{ height: '180px', width: '300px' }}>
                        <Image
                          src={`http://localhost:8080/api/files/kyc/${kycStatus.backImageUrl}`}
                          alt="Mặt sau"
                          width={300}
                          height={180}
                          style={{ objectFit: 'cover' }}
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {kycStatus.status === 'REJECTED' && (
                <Button 
                  type="primary" 
                  danger
                  onClick={() => {
                    setKycStatus(null);
                    form.resetFields();
                  }}
                  style={{ borderRadius: '8px' }}
                >
                  Gửi lại yêu cầu xác thực
                </Button>
              )}
            </Space>
          ]}
        />
      </Card>
    );
  }

  // Form gửi yêu cầu xác thực
  return (
    <Card 
      className="shadow-md"
      style={{ borderRadius: '16px' }}
      title={
        <div className="flex items-center gap-2">
          <IdcardOutlined className="text-red-600" />
          <span>Xác thực tài khoản</span>
        </div>
      }
    >
      <div className="mb-4">
        <p className="text-gray-600 mb-2">
          Xác thực tài khoản giúp bảo vệ tài khoản của bạn và tăng mức độ tin cậy.
        </p>
        <p className="text-sm text-gray-500">
          Vui lòng tải lên ảnh căn cước công dân/chứng minh nhân dân mặt trước và mặt sau.
        </p>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          label="Họ và tên (theo CCCD)"
          name="fullName"
          rules={[
            { required: true, message: 'Vui lòng nhập họ tên!' },
            { min: 3, message: 'Họ tên phải có ít nhất 3 ký tự!' }
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Nguyễn Văn A"
            size='large'
            style={{ borderRadius: '8px' }}
          />
        </Form.Item>

        <Form.Item
          label="Số căn cước công dân"
          name="idNumber"
          rules={[
            { required: true, message: 'Vui lòng nhập số CCCD!' },
            { pattern: /^[0-9]{9,12}$/, message: 'Số CCCD phải từ 9-12 chữ số!' }
          ]}
        >
          <Input
            prefix={<IdcardOutlined />}
            placeholder="001234567890"
            size='large'
            style={{ borderRadius: '8px' }}
          />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Form.Item
            label="Ảnh mặt trước CCCD"
            required
          >
            <Upload
              listType="picture-card"
              fileList={frontFileList}
              onChange={handleFrontChange}
              beforeUpload={beforeUpload}
              maxCount={1}
            >
              {frontFileList.length === 0 && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Tải lên</div>
                </div>
              )}
            </Upload>
            <p className="text-xs text-gray-500 mt-2">
              Ảnh rõ nét, không bị mờ hoặc che
            </p>
          </Form.Item>

          <Form.Item
            label="Ảnh mặt sau CCCD"
            required
          >
            <Upload
              listType="picture-card"
              fileList={backFileList}
              onChange={handleBackChange}
              beforeUpload={beforeUpload}
              maxCount={1}
            >
              {backFileList.length === 0 && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Tải lên</div>
                </div>
              )}
            </Upload>
            <p className="text-xs text-gray-500 mt-2">
              Ảnh rõ nét, không bị mờ hoặc che
            </p>
          </Form.Item>
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size='large'
            loading={loading}
            block
            style={{
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              border: 'none',
              height: '48px',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Gửi yêu cầu xác thực
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default KycVerification;

