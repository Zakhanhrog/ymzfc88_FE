import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Switch, 
  InputNumber, 
  message, 
  Space, 
  Popconfirm,
  Table,
  Typography,
  Tag,
  Alert
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import streamConfigService from '../../../services/streamConfigService';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const AdminStreamConfigManagement = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [form] = Form.useForm();

  const gameTypes = [
    { value: 'XOC_DIA', label: 'Xóc Đĩa' },
    { value: 'SICBO', label: 'Sicbo' }
  ];

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    setLoading(true);
    try {
      const response = await streamConfigService.getAllStreamConfigs();
      if (response.success) {
        setConfigs(response.data || []);
      } else {
        message.error(response.message || 'Lỗi khi tải danh sách stream config');
      }
    } catch (error) {
      console.error('Error loading stream configs:', error);
      message.error('Lỗi khi tải danh sách stream config');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingConfig(null);
    form.resetFields();
    form.setFieldsValue({ isActive: true });
    setModalVisible(true);
  };

  const handleEdit = (config) => {
    setEditingConfig(config);
    form.setFieldsValue({
      gameType: config.gameType,
      tableNumber: config.tableNumber,
      streamKey: config.streamKey,
      isActive: config.isActive,
      description: config.description
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await streamConfigService.deleteStreamConfig(id);
      if (response.success) {
        message.success('Xóa stream config thành công');
        loadConfigs();
      } else {
        message.error(response.message || 'Lỗi khi xóa stream config');
      }
    } catch (error) {
      console.error('Error deleting stream config:', error);
      message.error('Lỗi khi xóa stream config');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const configData = {
        gameType: values.gameType,
        tableNumber: values.tableNumber || null,
        streamKey: values.streamKey,
        isActive: values.isActive,
        description: values.description
      };

      let response;
      if (editingConfig) {
        response = await streamConfigService.updateStreamConfig(editingConfig.id, configData);
      } else {
        response = await streamConfigService.createStreamConfig(configData);
      }

      if (response.success) {
        message.success(editingConfig ? 'Cập nhật stream config thành công' : 'Tạo stream config thành công');
        setModalVisible(false);
        loadConfigs();
      } else {
        message.error(response.message || 'Lỗi khi lưu stream config');
      }
    } catch (error) {
      console.error('Error saving stream config:', error);
      message.error('Lỗi khi lưu stream config');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Game',
      dataIndex: 'gameType',
      key: 'gameType',
      filters: gameTypes.map(g => ({ text: g.label, value: g.value })),
      onFilter: (value, record) => record.gameType === value,
      render: (type) => {
        const game = gameTypes.find(g => g.value === type);
        return <Tag color={type === 'XOC_DIA' ? 'blue' : 'green'}>{game?.label || type}</Tag>;
      },
    },
    {
      title: 'Bàn số',
      dataIndex: 'tableNumber',
      key: 'tableNumber',
      sorter: (a, b) => (a.tableNumber || 0) - (b.tableNumber || 0),
      render: (num) => num ? `Bàn ${num}` : <Text type="secondary">-</Text>,
    },
    {
      title: 'Stream Key',
      dataIndex: 'streamKey',
      key: 'streamKey',
      render: (key) => <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '3px' }}>{key}</code>,
    },
    {
      title: 'Stream URL',
      key: 'streamUrl',
      render: (_, record) => {
        const url = `https://tathiet168.com/live/${record.streamKey}/index.m3u8`;
        return (
          <Text 
            copyable={{ text: url }}
            style={{ fontSize: '12px', maxWidth: '200px' }}
            ellipsis
          >
            {url}
          </Text>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      filters: [
        { text: 'Hoạt động', value: true },
        { text: 'Tạm dừng', value: false }
      ],
      onFilter: (value, record) => record.isActive === value,
      render: (active) => (
        <Tag color={active ? 'green' : 'red'}>
          {active ? 'Hoạt động' : 'Tạm dừng'}
        </Tag>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text) => text || <Text type="secondary">-</Text>,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa stream config này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title level={2}>Quản lý Stream Config</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          Thêm Stream Config
        </Button>
      </div>

      <Alert
        message="Hướng dẫn sử dụng"
        description={
          <div>
            <p style={{ margin: 0, marginBottom: '8px' }}>
              <strong>Cấu hình OBS:</strong>
            </p>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>Server: <code>rtmp://rtmp.tathiet168.com/live</code></li>
              <li>Stream Key: Nhập stream key đã tạo ở bảng bên dưới (ví dụ: xocdia, sicbo-table1)</li>
            </ul>
            <p style={{ margin: '8px 0 0 0' }}>
              <strong>Lưu ý:</strong> Stream key phải khớp với stream key trong OBS để video hiển thị đúng trên website.
            </p>
          </div>
        }
        type="info"
        icon={<InfoCircleOutlined />}
        showIcon
        style={{ marginBottom: '16px' }}
      />

      <Table
        columns={columns}
        dataSource={configs}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingConfig ? 'Chỉnh sửa Stream Config' : 'Thêm Stream Config mới'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="gameType"
            label="Game"
            rules={[{ required: true, message: 'Vui lòng chọn game' }]}
          >
            <Select placeholder="Chọn game">
              {gameTypes.map(type => (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="tableNumber"
            label="Bàn số (để trống nếu không có bàn)"
            extra="Chỉ dùng cho game có nhiều bàn chơi (ví dụ: Sicbo). Xóc Đĩa thường để trống."
          >
            <InputNumber 
              min={1} 
              max={99}
              placeholder="Bàn số (ví dụ: 1, 2, 3...)" 
              style={{ width: '100%' }} 
            />
          </Form.Item>

          <Form.Item
            name="streamKey"
            label="Stream Key"
            rules={[
              { required: true, message: 'Vui lòng nhập stream key' },
              { pattern: /^[a-z0-9-]+$/, message: 'Stream key chỉ được chứa chữ thường, số và dấu gạch ngang' },
              { min: 3, message: 'Stream key phải có ít nhất 3 ký tự' },
              { max: 50, message: 'Stream key không được vượt quá 50 ký tự' }
            ]}
            extra="Stream key dùng trong OBS. Ví dụ: xocdia, sicbo-table1, xocdia-table2"
          >
            <Input 
              placeholder="xocdia" 
              onInput={(e) => {
                e.target.value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
              }}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            extra="Ghi chú về stream config này để dễ quản lý"
          >
            <TextArea 
              rows={3} 
              placeholder="Mô tả stream config (ví dụ: Stream chính cho Xóc Đĩa, Stream bàn 1 Sicbo...)" 
              maxLength={200}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Trạng thái"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Tạm dừng" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingConfig ? 'Cập nhật' : 'Tạo mới'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminStreamConfigManagement;

