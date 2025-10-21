import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Button, 
  message, 
  Spin,
  Space,
  Modal,
  Form,
  Input,
  Switch,
  InputNumber,
  Image,
  Popconfirm,
  Upload
} from 'antd';
import {
  GiftOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  ReloadOutlined,
  UploadOutlined
} from '@ant-design/icons';
import promotionService from '../../../services/promotionService';

const { Title, Text } = Typography;
const { TextArea } = Input;

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [form] = Form.useForm();

  // Load promotions
  const loadPromotions = async () => {
    try {
      setLoading(true);
      const response = await promotionService.getAllPromotions();
      setPromotions(response);
    } catch (error) {
      message.error('Không thể tải danh sách khuyến mãi: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (file) => {
    try {
      setUploading(true);
      console.log('Uploading file:', file.name);
      const imageUrl = await promotionService.uploadPromotionImage(file);
      console.log('Upload successful, imageUrl:', imageUrl);
      form.setFieldsValue({ imageUrl: imageUrl });
      setUploadedImageUrl(imageUrl);
      message.success('Upload ảnh thành công');
      return false; // Prevent default upload
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Upload ảnh thất bại: ' + (error.response?.data?.error || error.message));
      return false;
    } finally {
      setUploading(false);
    }
  };

  // Create/Update promotion
  const handleSubmit = async (values) => {
    try {
      // Kiểm tra có ảnh không
      const imageUrl = uploadedImageUrl || values.imageUrl;
      if (!imageUrl) {
        message.error('Vui lòng chọn ảnh khuyến mãi!');
        return;
      }
      
      // Đảm bảo imageUrl là string
      const formData = {
        ...values,
        imageUrl: imageUrl
      };
      
      console.log('Submitting promotion data:', formData);
      
      if (editingPromotion) {
        await promotionService.updatePromotion(editingPromotion.id, formData);
        message.success('Cập nhật khuyến mãi thành công!');
      } else {
        await promotionService.createPromotion(formData);
        message.success('Tạo khuyến mãi thành công!');
      }
      
      setModalVisible(false);
      setEditingPromotion(null);
      setUploadedImageUrl(null);
      form.resetFields();
      loadPromotions();
    } catch (error) {
      message.error('Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  // Delete promotion
  const handleDelete = async (id) => {
    try {
      await promotionService.deletePromotion(id);
      message.success('Xóa khuyến mãi thành công!');
      loadPromotions();
    } catch (error) {
      message.error('Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  // Toggle status
  const handleToggleStatus = async (id) => {
    try {
      await promotionService.togglePromotionStatus(id);
      message.success('Cập nhật trạng thái thành công!');
      loadPromotions();
    } catch (error) {
      message.error('Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  // Open modal for create
  const handleCreate = () => {
    setEditingPromotion(null);
    setUploadedImageUrl(null);
    form.resetFields();
    setModalVisible(true);
  };

  // Open modal for edit
  const handleEdit = (promotion) => {
    setEditingPromotion(promotion);
    setUploadedImageUrl(promotion.imageUrl);
    form.setFieldsValue({
      title: promotion.title,
      description: promotion.description,
      isActive: promotion.isActive,
      displayOrder: promotion.displayOrder
    });
    setModalVisible(true);
  };

  // Load data when component mounts
  useEffect(() => {
    loadPromotions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Title level={2} className="mb-2">
            Quản lý Khuyến mãi
          </Title>
          <Text type="secondary" className="text-lg">
            Quản lý các chương trình khuyến mãi
          </Text>
        </div>
        <Space>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={loadPromotions}
            loading={loading}
          >
            Làm mới
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Thêm khuyến mãi
          </Button>
        </Space>
      </div>

      {/* Promotions List */}
      <Row gutter={[24, 24]}>
        {promotions.map((promotion) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={promotion.id}>
            <Card
              className="shadow-md hover:shadow-xl transition-all duration-300 h-full"
              cover={
                promotion.imageUrl ? (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      alt={promotion.title}
                      src={promotion.imageUrl.startsWith('http') ? promotion.imageUrl : `http://localhost:8080/api${promotion.imageUrl}`}
                      className="w-full h-full object-cover"
                      fallback={
                        <div className="h-48 bg-gray-200 flex items-center justify-center">
                          <GiftOutlined className="text-4xl text-gray-400" />
                        </div>
                      }
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                    <GiftOutlined className="text-white text-6xl" />
                  </div>
                )
              }
              actions={[
                <Button 
                  key="edit" 
                  icon={<EditOutlined />} 
                  onClick={() => handleEdit(promotion)}
                  size="small"
                >
                  Sửa
                </Button>,
                <Button 
                  key="toggle" 
                  icon={promotion.isActive ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                  onClick={() => handleToggleStatus(promotion.id)}
                  size="small"
                  type={promotion.isActive ? "default" : "primary"}
                >
                  {promotion.isActive ? 'Ẩn' : 'Hiện'}
                </Button>,
                <Popconfirm
                  key="delete"
                  title="Xóa khuyến mãi"
                  description="Bạn có chắc chắn muốn xóa khuyến mãi này?"
                  onConfirm={() => handleDelete(promotion.id)}
                  okText="Xóa"
                  cancelText="Hủy"
                >
                  <Button 
                    key="delete" 
                    icon={<DeleteOutlined />} 
                    danger
                    size="small"
                  >
                    Xóa
                  </Button>
                </Popconfirm>
              ]}
            >
              <Card.Meta
                title={
                  <div className="flex items-center justify-between">
                    <Title level={4} className="text-gray-800 mb-0">
                      {promotion.title}
                    </Title>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      promotion.isActive 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {promotion.isActive ? 'Đang hiển thị' : 'Đã ẩn'}
                    </span>
                  </div>
                }
                description={
                  <div>
                    <Text className="text-gray-600 block mb-2" ellipsis={{ rows: 2 }}>
                      {promotion.description}
                    </Text>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Thứ tự: {promotion.displayOrder}</span>
                      <span>{new Date(promotion.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Empty State */}
      {promotions.length === 0 && (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <GiftOutlined className="text-6xl text-gray-300 mb-4" />
            <Title level={4} className="text-gray-500">Chưa có khuyến mãi nào</Title>
            <Text className="text-gray-400">Hãy thêm khuyến mãi đầu tiên</Text>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        title={editingPromotion ? 'Chỉnh sửa khuyến mãi' : 'Thêm khuyến mãi mới'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingPromotion(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            isActive: true,
            displayOrder: 0
          }}
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[
              { required: true, message: 'Vui lòng nhập tiêu đề' },
              { max: 255, message: 'Tiêu đề không được vượt quá 255 ký tự' }
            ]}
          >
            <Input placeholder="Nhập tiêu đề khuyến mãi" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              { max: 2000, message: 'Mô tả không được vượt quá 2000 ký tự' }
            ]}
          >
            <TextArea 
              rows={4} 
              placeholder="Nhập mô tả khuyến mãi"
            />
          </Form.Item>

          <Form.Item
            label="Ảnh khuyến mãi"
            required
          >
            <div>
              <Upload
                beforeUpload={handleFileUpload}
                showUploadList={false}
                accept="image/*"
                disabled={uploading}
              >
                <Button icon={<UploadOutlined />} loading={uploading}>
                  {uploading ? 'Đang upload...' : 'Chọn ảnh'}
                </Button>
              </Upload>
              {(uploadedImageUrl || form.getFieldValue('imageUrl')) && (
                <div className="mt-2">
                  <Image
                    src={(uploadedImageUrl || form.getFieldValue('imageUrl')).startsWith('http') ? 
                      (uploadedImageUrl || form.getFieldValue('imageUrl')) : 
                      `http://localhost:8080/api${uploadedImageUrl || form.getFieldValue('imageUrl')}`}
                    alt="Preview"
                    style={{ maxWidth: 200, maxHeight: 200 }}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    URL: {uploadedImageUrl || form.getFieldValue('imageUrl')}
                  </div>
                </div>
              )}
              <input
                type="hidden"
                name="imageUrl"
                value={uploadedImageUrl || form.getFieldValue('imageUrl') || ''}
              />
            </div>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="isActive"
                label="Trạng thái"
                valuePropName="checked"
              >
                <Switch checkedChildren="Hiển thị" unCheckedChildren="Ẩn" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="displayOrder"
                label="Thứ tự hiển thị"
              >
                <InputNumber 
                  min={0} 
                  placeholder="0" 
                  className="w-full"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item className="mb-0">
            <Space>
              <Button type="primary" htmlType="submit">
                {editingPromotion ? 'Cập nhật' : 'Tạo mới'}
              </Button>
              <Button onClick={() => {
                setModalVisible(false);
                setEditingPromotion(null);
                setUploadedImageUrl(null);
                form.resetFields();
              }}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PromotionManagement;
