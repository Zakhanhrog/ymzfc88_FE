import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Switch, 
  InputNumber, 
  ColorPicker, 
  Space, 
  Popconfirm, 
  message, 
  Card, 
  Tag,
  Tooltip,
  Select
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  EyeInvisibleOutlined,
  DragOutlined
} from '@ant-design/icons';
import { marqueeNotificationService } from '../services/adminMarqueeNotificationService';

const { TextArea } = Input;
const { Option } = Select;

const AdminMarqueeNotificationManagement = () => {
  const [marqueeNotifications, setMarqueeNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchKeyword, setSearchKeyword] = useState('');

  // Load data
  const loadMarqueeNotifications = async (page = 1, keyword = '') => {
    setLoading(true);
    try {
      const response = await marqueeNotificationService.getMarqueeNotifications(page - 1, 10, keyword);
      if (response.success) {
        setMarqueeNotifications(response.data.content);
        setPagination(prev => ({
          ...prev,
          current: page,
          total: response.data.totalElements
        }));
      }
    } catch (error) {
      message.error('Lỗi khi tải danh sách thông báo');
      console.error('Error loading marquee notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMarqueeNotifications();
  }, []);

  // Handle create/update
  const handleSubmit = async (values) => {
    try {
      if (editingItem) {
        await marqueeNotificationService.updateMarqueeNotification(editingItem.id, values);
        message.success('Cập nhật thông báo thành công');
      } else {
        await marqueeNotificationService.createMarqueeNotification(values);
        message.success('Tạo thông báo thành công');
      }
      
      setModalVisible(false);
      setEditingItem(null);
      form.resetFields();
      loadMarqueeNotifications(pagination.current, searchKeyword);
    } catch (error) {
      message.error('Lỗi khi lưu thông báo');
      console.error('Error saving marquee notification:', error);
    }
  };

  // Handle edit
  const handleEdit = (record) => {
    setEditingItem(record);
    form.setFieldsValue({
      content: record.content,
      isActive: record.isActive,
      displayOrder: record.displayOrder,
      textColor: record.textColor,
      backgroundColor: record.backgroundColor,
      fontSize: record.fontSize,
      speed: record.speed
    });
    setModalVisible(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await marqueeNotificationService.deleteMarqueeNotification(id);
      message.success('Xóa thông báo thành công');
      loadMarqueeNotifications(pagination.current, searchKeyword);
    } catch (error) {
      message.error('Lỗi khi xóa thông báo');
      console.error('Error deleting marquee notification:', error);
    }
  };

  // Handle toggle active status
  const handleToggleActive = async (id) => {
    try {
      await marqueeNotificationService.toggleActiveStatus(id);
      message.success('Thay đổi trạng thái thành công');
      loadMarqueeNotifications(pagination.current, searchKeyword);
    } catch (error) {
      message.error('Lỗi khi thay đổi trạng thái');
      console.error('Error toggling active status:', error);
    }
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchKeyword(value);
    loadMarqueeNotifications(1, value);
  };

  // Table columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (text) => (
        <div style={{ maxWidth: 300 }}>
          <div dangerouslySetInnerHTML={{ __html: text }} />
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Hoạt động' : 'Tạm dừng'}
        </Tag>
      ),
    },
    {
      title: 'Thứ tự',
      dataIndex: 'displayOrder',
      key: 'displayOrder',
      width: 100,
      sorter: (a, b) => a.displayOrder - b.displayOrder,
    },
    {
      title: 'Màu chữ',
      dataIndex: 'textColor',
      key: 'textColor',
      width: 100,
      render: (color) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div 
            style={{ 
              width: 20, 
              height: 20, 
              backgroundColor: color, 
              border: '1px solid #d9d9d9',
              borderRadius: 4
            }} 
          />
          <span style={{ fontSize: 12 }}>{color}</span>
        </div>
      ),
    },
    {
      title: 'Cỡ chữ',
      dataIndex: 'fontSize',
      key: 'fontSize',
      width: 80,
      render: (size) => `${size}px`,
    },
    {
      title: 'Tốc độ',
      dataIndex: 'speed',
      key: 'speed',
      width: 80,
      render: (speed) => `${speed}px/s`,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="primary" 
              size="small" 
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          
          <Tooltip title={record.isActive ? 'Tạm dừng' : 'Kích hoạt'}>
            <Button 
              type={record.isActive ? 'default' : 'primary'}
              size="small" 
              icon={record.isActive ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              onClick={() => handleToggleActive(record.id)}
            />
          </Tooltip>
          
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa thông báo này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button 
              type="primary" 
              danger 
              size="small" 
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Quản lý Thông báo Chạy</h3>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingItem(null);
              form.resetFields();
              setModalVisible(true);
            }}
          >
            Thêm thông báo mới
          </Button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Input.Search
            placeholder="Tìm kiếm theo nội dung..."
            onSearch={handleSearch}
            style={{ width: 300 }}
            allowClear
          />
        </div>

        <Table
          columns={columns}
          dataSource={marqueeNotifications}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            onChange: (page) => loadMarqueeNotifications(page, searchKeyword),
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} thông báo`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title={editingItem ? 'Chỉnh sửa thông báo' : 'Thêm thông báo mới'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingItem(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            isActive: true,
            displayOrder: 0,
            textColor: '#FF0000',
            backgroundColor: '#FFFFFF',
            fontSize: 16,
            speed: 50
          }}
        >
          <Form.Item
            name="content"
            label="Nội dung thông báo"
            rules={[
              { required: true, message: 'Vui lòng nhập nội dung thông báo' },
              { max: 1000, message: 'Nội dung không được vượt quá 1000 ký tự' }
            ]}
          >
            <TextArea 
              rows={4} 
              placeholder="Nhập nội dung thông báo (có thể sử dụng HTML và emoji)..."
            />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Trạng thái hoạt động"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item
              name="displayOrder"
              label="Thứ tự hiển thị"
              style={{ flex: 1 }}
            >
              <InputNumber 
                min={0} 
                style={{ width: '100%' }}
                placeholder="Thứ tự hiển thị"
              />
            </Form.Item>

            <Form.Item
              name="fontSize"
              label="Cỡ chữ (px)"
              style={{ flex: 1 }}
            >
              <InputNumber 
                min={12} 
                max={48} 
                style={{ width: '100%' }}
                placeholder="Cỡ chữ"
              />
            </Form.Item>

            <Form.Item
              name="speed"
              label="Tốc độ (px/s)"
              style={{ flex: 1 }}
            >
              <InputNumber 
                min={10} 
                max={200} 
                style={{ width: '100%' }}
                placeholder="Tốc độ chạy"
              />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item
              name="textColor"
              label="Màu chữ"
              style={{ flex: 1 }}
            >
              <Input 
                placeholder="#FF0000"
                addonBefore="#"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              name="backgroundColor"
              label="Màu nền"
              style={{ flex: 1 }}
            >
              <Input 
                placeholder="#FFFFFF"
                addonBefore="#"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </div>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingItem ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminMarqueeNotificationManagement;
