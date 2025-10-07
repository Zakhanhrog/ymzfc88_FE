import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Table, 
  Tag, 
  Space,
  Modal,
  Form,
  Input,
  Select,
  Radio,
  message,
  Divider,
  Tooltip,
  Avatar,
  Empty,
  Spin
} from 'antd';
import {
  BankOutlined,
  MobileOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CreditCardOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  QrcodeOutlined,
  WalletOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { THEME_COLORS } from '../../../utils/theme';
import walletService from '../services/walletService';

const { Option } = Select;

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      const response = await walletService.getPaymentMethods();
      
      if (response.success) {
        setPaymentMethods(response.data);
      }
    } catch (error) {
      message.error('Lỗi khi tải phương thức thanh toán: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getMethodIcon = (type) => {
    switch (type) {
      case 'MOMO':
        return <MobileOutlined style={{ color: '#d82d8b' }} />;
      case 'BANK':
        return <BankOutlined style={{ color: '#1890ff' }} />;
      case 'USDT':
        return <CreditCardOutlined style={{ color: '#f7931a' }} />;
      case 'ZALO_PAY':
        return <MobileOutlined style={{ color: '#0068ff' }} />;
      case 'VIET_QR':
        return <QrcodeOutlined style={{ color: '#00a84f' }} />;
      default:
        return <CreditCardOutlined />;
    }
  };

  const getMethodTypeText = (type) => {
    switch (type) {
      case 'MOMO':
        return 'MoMo';
      case 'BANK':
        return 'Ngân hàng';
      case 'USDT':
        return 'USDT';
      case 'ZALO_PAY':
        return 'ZaloPay';
      case 'VIET_QR':
        return 'VietQR';
      default:
        return type;
    }
  };

  const getBankLogo = (bankCode) => {
    // Trong thực tế sẽ có logo thật của các ngân hàng
    const colors = {
      'VCB': '#007ACC',
      'TCB': '#FF6B35',
      'ACB': '#1B5E20',
      'MB': '#8BC34A',
      'VTB': '#2196F3',
      'BIDV': '#4CAF50',
      'TPB': '#9C27B0',
      'STB': '#FF9800',
      'VPB': '#E91E63'
    };
    
    return (
      <Avatar 
        size={40}
        style={{ 
          backgroundColor: colors[bankCode] || '#666',
          fontSize: '12px',
          fontWeight: 'bold'
        }}
      >
        {bankCode || 'N/A'}
      </Avatar>
    );
  };

  const columns = [
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => (
        <div className="flex items-center gap-2">
          {getMethodIcon(type)}
          <span className="font-medium">{getMethodTypeText(type)}</span>
        </div>
      ),
    },
    {
      title: 'Thông tin tài khoản',
      key: 'account',
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {record.type === 'BANK' && getBankLogo(record.bankCode)}
            <div>
              <div className="font-semibold">{record.accountName}</div>
              <div className="text-sm text-gray-500">{record.accountNumber}</div>
              <div className="text-sm text-blue-600">{record.name}</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 120,
      render: (_, record) => (
        <div className="space-y-2">
          {record.displayOrder === 1 && (
            <Tag color="gold" icon={<CheckCircleOutlined />}>
              Ưu tiên
            </Tag>
          )}
          <div>
            {record.isActive ? (
              <Tag color="green" icon={<SafetyOutlined />}>
                Hoạt động
              </Tag>
            ) : (
              <Tag color="red" icon={<ExclamationCircleOutlined />}>
                Tạm dừng
              </Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Tải lại danh sách">
            <Button 
              size="small"
              icon={<ReloadOutlined />}
              onClick={loadPaymentMethods}
              loading={loading}
            />
          </Tooltip>
          <Tooltip title="Xem chi tiết">
            <Button 
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                Modal.info({
                  title: 'Chi tiết phương thức thanh toán',
                  content: (
                    <div className="space-y-2">
                      <p><strong>Tên:</strong> {record.name}</p>
                      <p><strong>Loại:</strong> {getMethodTypeText(record.type)}</p>
                      <p><strong>Số tài khoản:</strong> {record.accountNumber}</p>
                      <p><strong>Tên tài khoản:</strong> {record.accountName}</p>
                      {record.bankCode && <p><strong>Mã ngân hàng:</strong> {record.bankCode}</p>}
                      <p><strong>Giới hạn:</strong> {record.minAmount?.toLocaleString()} - {record.maxAmount?.toLocaleString()} VNĐ</p>
                      {record.description && <p><strong>Mô tả:</strong> {record.description}</p>}
                      {record.processingTime && <p><strong>Thời gian xử lý:</strong> {record.processingTime}</p>}
                    </div>
                  ),
                  width: 500
                });
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Title Header */}
      <div className="text-center pb-3">
        <div className="flex items-center justify-center gap-2 mb-1">
          <BankOutlined className="text-2xl text-red-600" />
          <h3 className="text-xl md:text-2xl font-bold mb-0 text-gray-800">Phương thức nạp tiền</h3>
        </div>
        <p className="text-sm text-gray-500">
          Xem danh sách phương thức thanh toán có sẵn trong hệ thống
        </p>
      </div>
      
      {/* Payment Methods Table */}
      <Card 
        className="shadow-sm"
        style={{ borderRadius: '12px' }}
        extra={
          <Button 
            size="small"
            icon={<ReloadOutlined />}
            onClick={loadPaymentMethods}
            loading={loading}
          >
            Tải lại
          </Button>
        }
      >
        {paymentMethods.length > 0 ? (
          <Table
            columns={columns}
            dataSource={paymentMethods}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} phương thức`,
            }}
            className="payment-methods-table"
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            {loading ? (
              <Spin size="large" />
            ) : (
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Chưa có phương thức thanh toán nào"
              >
                <Button 
                  type="primary" 
                  icon={<ReloadOutlined />}
                  onClick={loadPaymentMethods}
                  style={{ 
                    background: THEME_COLORS.primaryGradient,
                    border: 'none',
                    borderRadius: '8px'
                  }}
                >
                  Tải lại
                </Button>
              </Empty>
            )}
          </div>
        )}
      </Card>

      <style dangerouslySetInnerHTML={{
        __html: `
          .payment-methods-table .ant-table-thead > tr > th {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
            border-bottom: 2px solid #e2e8f0 !important;
            font-weight: 600 !important;
          }
          
          .payment-methods-table .ant-table-tbody > tr:hover > td {
            background: #fafafa !important;
          }
        `
      }} />
    </div>
  );
};

export default PaymentMethods;