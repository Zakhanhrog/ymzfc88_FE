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
  Image,
  Card,
  Row,
  Col,
  Typography,
  Upload
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UploadOutlined
} from '@ant-design/icons';
import { adminBannerService } from '../services/adminBannerService';

const { Title } = Typography;
const { Option } = Select;

const AdminBannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [form] = Form.useForm();

  const bannerTypes = [
    { value: 'MAIN_BANNER', label: 'Banner chính (4:1) - 5 cái', aspectRatio: '4:1', maxCount: 5 },
    { value: 'SIDEBAR_BANNER', label: 'Banner sidebar (2:3) - 3 cái', aspectRatio: '2:3', maxCount: 3 }
  ];

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    setLoading(true);
    try {
      const response = await adminBannerService.getAllBanners(0, 100, 'displayOrder', 'asc');
      console.log('Banner response:', response);
      if (response.success) {
        // Handle both paginated and non-paginated responses
        const banners = response.data.content || response.data || [];
        setBanners(banners);
      }
    } catch (error) {
      console.error('Error loading banners:', error);
      message.error('Lỗi khi tải danh sách banner');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingBanner(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    form.setFieldsValue({
      ...banner,
      image: banner.imageUrl ? [{
        uid: '-1',
        name: 'current-image.jpg',
        status: 'done',
        url: banner.imageUrl,
      }] : []
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await adminBannerService.deleteBanner(id);
      message.success('Xóa banner thành công');
      loadBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
      message.error('Lỗi khi xóa banner: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('bannerType', values.bannerType);
      formData.append('displayOrder', values.displayOrder);
      formData.append('isActive', values.isActive);
      
      if (values.image && values.image.length > 0) {
        formData.append('image', values.image[0].originFileObj);
      }
      
      console.log('Submitting banner:', { values, formData });
      
      if (editingBanner) {
        await adminBannerService.updateBanner(editingBanner.id, formData);
        message.success('Cập nhật banner thành công');
      } else {
        await adminBannerService.createBanner(formData);
        message.success('Tạo banner thành công');
      }
      
      setModalVisible(false);
      loadBanners();
    } catch (error) {
      console.error('Error saving banner:', error);
      message.error('Lỗi khi lưu banner: ' + (error.response?.data?.message || error.message));
    }
  };

  const getBannersByType = (type) => {
    return banners.filter(banner => banner.bannerType === type);
  };

  const getAspectRatioInfo = (bannerType) => {
    const type = bannerTypes.find(t => t.value === bannerType);
    return type ? type.aspectRatio : '1:1';
  };

  const getMaxCount = (bannerType) => {
    const type = bannerTypes.find(t => t.value === bannerType);
    return type ? type.maxCount : 1;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title level={2}>Quản lý Banner</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          Thêm Banner
        </Button>
      </div>

      {/* Banner chính */}
      <Card title="Banner chính (4:1) - Tối đa 5 cái" className="mb-6">
        <Row gutter={[16, 16]}>
          {getBannersByType('MAIN_BANNER').map((banner) => (
            <Col key={banner.id} xs={24} sm={12} md={8} lg={6} xl={4}>
              <Card
                hoverable
                cover={
                  <Image
                    src={banner.imageUrl.startsWith('http') ? banner.imageUrl : `http://localhost:8080/api${banner.imageUrl}`}
                    alt={`Banner ${banner.displayOrder}`}
                    style={{ height: '120px', objectFit: 'cover' }}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3MoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7uz39gV7TeD4n0HIw8QcACtK4oTx4mZgAAAABJRU5ErkJggg=="
                  />
                }
                actions={[
                  <Button
                    key="edit"
                    type="primary"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(banner)}
                  />,
                  <Popconfirm
                    key="delete"
                    title="Bạn có chắc muốn xóa banner này?"
                    onConfirm={() => handleDelete(banner.id)}
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
                ]}
              >
                <div className="text-center">
                  <div className="text-sm text-gray-600">Thứ tự: {banner.displayOrder}</div>
                  <div className="text-xs text-gray-500">Tỷ lệ: {getAspectRatioInfo(banner.bannerType)}</div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Banner sidebar */}
      <Card title="Banner sidebar (2:3) - Tối đa 3 cái">
        <Row gutter={[16, 16]}>
          {getBannersByType('SIDEBAR_BANNER').map((banner) => (
            <Col key={banner.id} xs={24} sm={12} md={8}>
              <Card
                hoverable
                cover={
                  <Image
                    src={banner.imageUrl.startsWith('http') ? banner.imageUrl : `http://localhost:8080/api${banner.imageUrl}`}
                    alt={`Banner ${banner.displayOrder}`}
                    style={{ height: '200px', objectFit: 'cover' }}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3MoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7uz39gV7TeD4n0HIw8QcACtK4oTx4mZgAAAABJRU5ErkJggg=="
                  />
                }
                actions={[
                  <Button
                    key="edit"
                    type="primary"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(banner)}
                  />,
                  <Popconfirm
                    key="delete"
                    title="Bạn có chắc muốn xóa banner này?"
                    onConfirm={() => handleDelete(banner.id)}
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
                ]}
              >
                <div className="text-center">
                  <div className="text-sm text-gray-600">Thứ tự: {banner.displayOrder}</div>
                  <div className="text-xs text-gray-500">Tỷ lệ: {getAspectRatioInfo(banner.bannerType)}</div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      <Modal
        title={editingBanner ? 'Chỉnh sửa Banner' : 'Thêm Banner mới'}
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
            name="bannerType"
            label="Loại Banner"
            rules={[{ required: true, message: 'Vui lòng chọn loại banner' }]}
          >
            <Select placeholder="Chọn loại banner">
              {bannerTypes.map(type => (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="image"
            label="Ảnh banner"
            rules={[{ required: true, message: 'Vui lòng chọn ảnh banner' }]}
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
          >
            <Upload
              name="image"
              listType="picture-card"
              beforeUpload={(file) => {
                const isImage = file.type.startsWith('image/');
                if (!isImage) {
                  message.error('Chỉ được upload file ảnh!');
                  return false;
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                  message.error('Kích thước ảnh phải nhỏ hơn 2MB!');
                  return false;
                }
                return false; // Prevent auto upload
              }}
              maxCount={1}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item
            name="displayOrder"
            label="Thứ tự hiển thị"
            rules={[{ required: true, message: 'Vui lòng nhập thứ tự' }]}
          >
            <InputNumber min={1} placeholder="Thứ tự" style={{ width: '100%' }} />
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
                {editingBanner ? 'Cập nhật' : 'Tạo mới'}
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

export default AdminBannerManagement;