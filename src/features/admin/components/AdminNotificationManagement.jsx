import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Space,
  message,
  Popconfirm,
  Radio,
  DatePicker,
  Tooltip,
  Typography,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  BellOutlined,
  PlusOutlined,
  DeleteOutlined,
  SendOutlined,
  UserOutlined,
  GlobalOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  AlertOutlined,
} from '@ant-design/icons';
import notificationService from '../../notification/services/notificationService';
import { adminService } from '../services/adminService';
import moment from 'moment';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const AdminNotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [form] = Form.useForm();

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    broadcast: 0,
    individual: 0,
  });

  useEffect(() => {
    loadNotifications();
    loadUsers();
  }, [pagination.current, pagination.pageSize]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.getAllNotifications(
        pagination.current - 1,
        pagination.pageSize
      );

      if (response.success && response.data) {
        setNotifications(response.data.content);
        setPagination(prev => ({
          ...prev,
          total: response.data.totalElements,
        }));

        // Calculate stats
        const broadcast = response.data.content.filter(n => !n.targetUserId).length;
        setStats({
          total: response.data.totalElements,
          broadcast: broadcast,
          individual: response.data.totalElements - broadcast,
        });
      }
    } catch (error) {
      message.error('Lỗi khi tải danh sách thông báo: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await adminService.getAllUsers();
      if (response.success && response.data) {
        setUsers(response.data);
      }
    } catch (error) {
    }
  };

  const handleCreateNotification = async (values) => {
    setLoading(true);
    try {
      const notificationData = {
        title: values.title,
        message: values.message,
        priority: values.priority,
        type: values.type,
        targetUserId: values.scope === 'individual' ? values.targetUserId : null,
        expiresAt: values.expiresAt ? values.expiresAt.toISOString() : null,
      };

      const response = await notificationService.createNotification(notificationData);

      if (response.success) {
        message.success('Gửi thông báo thành công!');
        setCreateModalVisible(false);
        form.resetFields();
        loadNotifications();
      }
    } catch (error) {
      message.error('Lỗi khi gửi thông báo: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    setLoading(true);
    try {
      const response = await notificationService.deleteNotification(notificationId);
      if (response.success) {
        message.success('Xóa thông báo thành công!');
        loadNotifications();
      }
    } catch (error) {
      message.error('Lỗi khi xóa thông báo: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityTag = (priority, priorityLevel, priorityColor) => {
    const icons = {
      URGENT: <AlertOutlined />,
      WARNING: <WarningOutlined />,
      INFO: <InfoCircleOutlined />,
    };

    return (
      <Tag color={priorityColor} icon={icons[priority]}>
        {priorityLevel === 1 && 'Khẩn cấp'}
        {priorityLevel === 2 && 'Cảnh báo'}
        {priorityLevel === 3 && 'Thông thường'}
      </Tag>
    );
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: 250,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Mức độ',
      key: 'priority',
      width: 130,
      render: (_, record) => getPriorityTag(record.priority, record.priorityLevel, record.priorityColor),
    },
    {
      title: 'Phạm vi',
      key: 'scope',
      width: 150,
      render: (_, record) => (
        record.targetUserId ? (
          <Tag icon={<UserOutlined />} color="blue">
            {record.targetUsername}
          </Tag>
        ) : (
          <Tag icon={<GlobalOutlined />} color="green">
            Toàn hệ thống
          </Tag>
        )
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type) => <Tag>{type}</Tag>,
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdByUsername',
      key: 'createdByUsername',
      width: 120,
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (date) => moment(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Hết hạn',
      dataIndex: 'expiresAt',
      key: 'expiresAt',
      width: 160,
      render: (date) => date ? moment(date).format('DD/MM/YYYY HH:mm') : 'Không',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Xác nhận xóa thông báo này?"
            onConfirm={() => handleDeleteNotification(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  return (
    <div className="space-y-6">
      <div>
        <Title level={3} className="mb-2">
          <BellOutlined /> Quản lý thông báo
        </Title>
        <Text type="secondary">Gửi và quản lý thông báo hệ thống đến người chơi.</Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng thông báo"
              value={stats.total}
              prefix={<BellOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Toàn hệ thống"
              value={stats.broadcast}
              prefix={<GlobalOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Cá nhân"
              value={stats.individual}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Create Button */}
      <Card>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateModalVisible(true)}
          size="large"
        >
          Tạo thông báo mới
        </Button>
      </Card>

      {/* Notifications Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={notifications}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          scroll={{ x: 1500 }}
        />
      </Card>

      {/* Create Notification Modal */}
      <Modal
        title={<span><SendOutlined /> Tạo thông báo mới</span>}
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateNotification}
          initialValues={{
            priority: 3,
            type: 'SYSTEM',
            scope: 'broadcast',
          }}
        >
          <Form.Item
            name="title"
            label="Tiêu đề thông báo"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input placeholder="Nhập tiêu đề thông báo..." />
          </Form.Item>

          <Form.Item
            name="message"
            label="Nội dung thông báo"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
          >
            <TextArea rows={4} placeholder="Nhập nội dung thông báo..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="Mức độ ưu tiên"
                rules={[{ required: true }]}
              >
                <Radio.Group>
                  <Radio.Button value={1}>
                    <AlertOutlined style={{ color: '#ff4d4f' }} /> Khẩn cấp (Đỏ)
                  </Radio.Button>
                  <Radio.Button value={2}>
                    <WarningOutlined style={{ color: '#faad14' }} /> Cảnh báo (Vàng)
                  </Radio.Button>
                  <Radio.Button value={3}>
                    <InfoCircleOutlined style={{ color: '#52c41a' }} /> Thông thường (Xanh)
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="type"
                label="Loại thông báo"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="SYSTEM">Hệ thống</Option>
                  <Option value="MAINTENANCE">Bảo trì</Option>
                  <Option value="PROMOTION">Khuyến mãi</Option>
                  <Option value="SECURITY">Bảo mật</Option>
                  <Option value="TRANSACTION">Giao dịch</Option>
                  <Option value="ACCOUNT">Tài khoản</Option>
                  <Option value="ANNOUNCEMENT">Thông báo chung</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="scope"
            label="Phạm vi gửi"
            rules={[{ required: true }]}
          >
            <Radio.Group>
              <Radio value="broadcast">
                <GlobalOutlined /> Toàn hệ thống (Gửi cho tất cả)
              </Radio>
              <Radio value="individual">
                <UserOutlined /> Cá nhân (Gửi cho 1 người)
              </Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.scope !== currentValues.scope}
          >
            {({ getFieldValue }) =>
              getFieldValue('scope') === 'individual' ? (
                <Form.Item
                  name="targetUserId"
                  label="Chọn người dùng"
                  rules={[{ required: true, message: 'Vui lòng chọn người dùng' }]}
                >
                  <Select
                    showSearch
                    placeholder="Chọn người dùng..."
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {users.map((user) => (
                      <Option key={user.id} value={user.id}>
                        {user.username} ({user.email})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : null
            }
          </Form.Item>

          <Form.Item
            name="expiresAt"
            label={
              <span>
                Thời gian hết hạn{' '}
                <Tooltip title="Để trống nếu thông báo không hết hạn">
                  <InfoCircleOutlined />
                </Tooltip>
              </span>
            }
          >
            <DatePicker
              showTime
              format="DD/MM/YYYY HH:mm"
              placeholder="Chọn thời gian hết hạn (tùy chọn)"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => {
                setCreateModalVisible(false);
                form.resetFields();
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" icon={<SendOutlined />} loading={loading}>
                Gửi thông báo
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminNotificationManagement;

