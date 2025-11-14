import React, { useEffect, useState } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Input,
  Select,
  Tag,
  Switch,
  Modal,
  Form,
  InputNumber,
  message,
  Popconfirm,
  Tooltip,
  Drawer,
  Descriptions,
  Row,
  Col,
  Statistic
} from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  KeyOutlined,
  ApiOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { adminService } from '../services/adminService';

const { Option } = Select;
const { Search } = Input;

const DEFAULT_PAGE_SIZE = 10;

const AdminDepositGatewayConfig = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    keyword: '',
    active: 'all'
  });
  const [pagination, setPagination] = useState({
    page: 0,
    size: DEFAULT_PAGE_SIZE,
    total: 0
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadConfigs({ page: 0, size: pagination.size });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const loadConfigs = async ({ page = pagination.page, size = pagination.size } = {}) => {
    setLoading(true);
    try {
      const response = await adminService.getDepositGatewayConfigs({
        page,
        size,
        keyword: filters.keyword || undefined,
        active: filters.active === 'all' ? undefined : filters.active === 'active'
      });

      if (response.success) {
        const pageData = response.data;
        setConfigs(pageData?.content || []);
        setPagination({
          page: pageData?.number ?? 0,
          size: pageData?.size ?? size,
          total: pageData?.totalElements ?? 0
        });
      }
    } catch (error) {
      message.error(error.message || 'Không thể tải danh sách cấu hình');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (paginationInfo) => {
    loadConfigs({
      page: paginationInfo.current - 1,
      size: paginationInfo.pageSize
    });
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setSelectedConfig(null);
    form.resetFields();
    form.setFieldsValue({
      active: true,
      priorityOrder: configs.length + 1
    });
    setModalVisible(true);
  };

  const openEditModal = (config) => {
    setIsEditing(true);
    setSelectedConfig(config);
    form.setFieldsValue({
      bankCode: config.bankCode,
      bankName: config.bankName,
      channelCode: config.channelCode,
      merchantId: config.merchantId,
      apiKey: config.apiKey,
      notifyUrl: config.notifyUrl,
      returnUrl: config.returnUrl,
      active: config.active,
      minAmount: config.minAmount,
      maxAmount: config.maxAmount,
      priorityOrder: config.priorityOrder,
      description: config.description
    });
    setModalVisible(true);
  };

  const handleSubmitConfig = async () => {
    try {
      const values = await form.validateFields();
      if (isEditing && selectedConfig) {
        const response = await adminService.updateDepositGatewayConfig(selectedConfig.id, values);
        if (response.success) {
          message.success('Cập nhật cấu hình thành công');
        }
      } else {
        const response = await adminService.createDepositGatewayConfig(values);
        if (response.success) {
          message.success('Thêm cấu hình mới thành công');
        }
      }
      setModalVisible(false);
      loadConfigs();
    } catch (error) {
      if (error?.errorFields) {
        return;
      }
      message.error(error.message || 'Không thể lưu cấu hình');
    }
  };

  const handleDeleteConfig = async (id) => {
    try {
      const response = await adminService.deleteDepositGatewayConfig(id);
      if (response.success) {
        message.success('Xóa cấu hình thành công');
        loadConfigs({ page: 0 });
      }
    } catch (error) {
      message.error(error.message || 'Không thể xóa cấu hình');
    }
  };

  const handleToggleStatus = async (record) => {
    try {
      const response = await adminService.toggleDepositGatewayConfigStatus(record.id);
      if (response.success) {
        message.success('Cập nhật trạng thái thành công');
        loadConfigs();
      }
    } catch (error) {
      message.error(error.message || 'Không thể cập nhật trạng thái');
    }
  };

  const handleViewDetail = (record) => {
    setSelectedConfig(record);
    setDrawerVisible(true);
  };

  const getStatusTag = (active) => (
    <Tag color={active ? 'green' : 'red'}>
      {active ? 'Đang hoạt động' : 'Tạm khóa'}
    </Tag>
  );

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '-';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDateTime = (value) => {
    if (!value) return '-';
    return new Date(value).toLocaleString('vi-VN');
  };

  const maskedApiKey = (key) => {
    if (!key) return '-';
    if (key.length <= 6) return key;
    return `${key.slice(0, 3)}****${key.slice(-3)}`;
  };

  const columns = [
    {
      title: 'Ngân hàng / Ví',
      dataIndex: 'bankName',
      key: 'bankName',
      render: (_, record) => (
        <div>
          <div className="font-semibold">{record.bankName}</div>
          <div className="text-xs text-gray-500">Bank code: {record.bankCode}</div>
        </div>
      )
    },
    {
      title: 'Mã kênh',
      dataIndex: 'channelCode',
      key: 'channelCode',
      render: (value) => (
        <Tag color="blue">{value}</Tag>
      )
    },
    {
      title: 'Merchant ID',
      dataIndex: 'merchantId',
      key: 'merchantId',
      render: (value) => (
        <span className="font-mono text-sm">{value}</span>
      )
    },
    {
      title: 'API Key',
      dataIndex: 'apiKey',
      key: 'apiKey',
      render: (value) => (
        <Tooltip title={value}>
          <span className="font-mono text-xs">{maskedApiKey(value)}</span>
        </Tooltip>
      )
    },
    {
      title: 'Giới hạn',
      key: 'limits',
      render: (_, record) => (
        <div className="text-xs">
          <div>Min: {formatCurrency(record.minAmount)}</div>
          <div>Max: {formatCurrency(record.maxAmount)}</div>
        </div>
      )
    },
    {
      title: 'Độ ưu tiên',
      dataIndex: 'priorityOrder',
      key: 'priorityOrder',
      width: 110,
      render: (value) => (
        <Tag color="purple">{value ?? '-'}</Tag>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      key: 'active',
      width: 140,
      render: (active, record) => (
        <Switch
          checked={active}
          checkedChildren="Hoạt động"
          unCheckedChildren="Tạm khóa"
          onChange={() => handleToggleStatus(record)}
        />
      )
    },
    {
      title: 'Cập nhật',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (value) => formatDateTime(value)
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 160,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button icon={<EyeOutlined />} onClick={() => handleViewDetail(record)} />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button type="primary" ghost icon={<EditOutlined />} onClick={() => openEditModal(record)} />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc muốn xóa cấu hình này?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDeleteConfig(record.id)}
          >
            <Tooltip title="Xóa">
              <Button danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const activeCount = configs.filter((item) => item.active).length;
  const inactiveCount = configs.length - activeCount;

  return (
    <div className="space-y-6">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng kênh"
              value={configs.length}
              prefix={<ApiOutlined className="text-blue-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đang hoạt động"
              value={activeCount}
              valueStyle={{ color: '#52c41a' }}
              prefix={<SafetyCertificateOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tạm khóa"
              value={inactiveCount}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<KeyOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Độ ưu tiên thấp nhất"
              value={configs.length ? Math.max(...configs.map((item) => item.priorityOrder || 0)) : 0}
              prefix={<KeyOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
          <Space size="middle" wrap>
            <Search
              placeholder="Tìm theo tên ngân hàng, mã kênh..."
              allowClear
              onSearch={(value) => setFilters((prev) => ({ ...prev, keyword: value }))}
              style={{ width: 280 }}
            />
            <Select
              value={filters.active}
              onChange={(value) => setFilters((prev) => ({ ...prev, active: value }))}
              style={{ width: 180 }}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="active">Đang hoạt động</Option>
              <Option value="inactive">Tạm khóa</Option>
            </Select>
          </Space>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => loadConfigs()} loading={loading}>
              Làm mới
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
              Thêm cấu hình
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={configs}
          rowKey="id"
          loading={loading}
          onChange={handleTableChange}
          pagination={{
            current: pagination.page + 1,
            pageSize: pagination.size,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} trong ${total} cấu hình`
          }}
          scroll={{ x: 900 }}
        />
      </Card>

      <Modal
        title={isEditing ? 'Cập nhật cấu hình cổng nạp' : 'Thêm cấu hình cổng nạp'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmitConfig}
        okText={isEditing ? 'Cập nhật' : 'Thêm mới'}
        width={720}
        destroyOnClose
      >
        <Form layout="vertical" form={form}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="bankCode"
                label="Mã ngân hàng / viết tắt"
                rules={[{ required: true, message: 'Vui lòng nhập mã ngân hàng' }]}
              >
                <Input placeholder="Ví dụ: ACB, VCB, MOMO" maxLength={50} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="bankName"
                label="Tên ngân hàng / ví"
                rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
              >
                <Input placeholder="Ngân hàng TMCP Á Châu" maxLength={150} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="channelCode"
                label="Mã kênh (code)"
                rules={[{ required: true, message: 'Vui lòng nhập mã kênh' }]}
              >
                <Input placeholder="Code do đối tác cung cấp" maxLength={100} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="merchantId"
                label="Merchant ID"
                rules={[{ required: true, message: 'Vui lòng nhập merchant id' }]}
              >
                <Input placeholder="Mã merchant" maxLength={120} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="apiKey"
                label="API Key"
                rules={[{ required: true, message: 'Vui lòng nhập API key' }]}
              >
                <Input.Password placeholder="Key được cấp" maxLength={255} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="priorityOrder" label="Độ ưu tiên hiển thị">
                <InputNumber min={1} style={{ width: '100%' }} placeholder="Ví dụ: 1" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="minAmount" label="Giới hạn tối thiểu (VND)">
                <InputNumber
                  min={0}
                  step={10000}
                  style={{ width: '100%' }}
                  formatter={(value) => (value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '')}
                  parser={(value) => (value ? value.replace(/,/g, '') : '')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="maxAmount" label="Giới hạn tối đa (VND)">
                <InputNumber
                  min={0}
                  step={10000}
                  style={{ width: '100%' }}
                  formatter={(value) => (value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '')}
                  parser={(value) => (value ? value.replace(/,/g, '') : '')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="notifyUrl" label="Notify URL">
                <Input placeholder="https://example.com/notify" maxLength={255} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="returnUrl" label="Return URL">
                <Input placeholder="https://example.com/return" maxLength={255} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Ghi chú">
            <Input.TextArea rows={3} maxLength={500} />
          </Form.Item>

          <Form.Item name="active" label="Trạng thái" valuePropName="checked">
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Tạm khóa" />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title="Chi tiết cấu hình cổng nạp"
        width={520}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      >
        {selectedConfig && (
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="Ngân hàng">{selectedConfig.bankName}</Descriptions.Item>
            <Descriptions.Item label="Bank code">{selectedConfig.bankCode}</Descriptions.Item>
            <Descriptions.Item label="Mã kênh">{selectedConfig.channelCode}</Descriptions.Item>
            <Descriptions.Item label="Merchant ID">
              <span className="font-mono">{selectedConfig.merchantId}</span>
            </Descriptions.Item>
            <Descriptions.Item label="API Key">
              <span className="font-mono">{selectedConfig.apiKey}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Notify URL">{selectedConfig.notifyUrl || '-'}</Descriptions.Item>
            <Descriptions.Item label="Return URL">{selectedConfig.returnUrl || '-'}</Descriptions.Item>
            <Descriptions.Item label="Giới hạn">
              Min: {formatCurrency(selectedConfig.minAmount)} - Max: {formatCurrency(selectedConfig.maxAmount)}
            </Descriptions.Item>
            <Descriptions.Item label="Độ ưu tiên">{selectedConfig.priorityOrder ?? '-'}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">{getStatusTag(selectedConfig.active)}</Descriptions.Item>
            <Descriptions.Item label="Ghi chú">{selectedConfig.description || '-'}</Descriptions.Item>
            <Descriptions.Item label="Tạo lúc">{formatDateTime(selectedConfig.createdAt)}</Descriptions.Item>
            <Descriptions.Item label="Cập nhật lúc">{formatDateTime(selectedConfig.updatedAt)}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
};

export default AdminDepositGatewayConfig;

