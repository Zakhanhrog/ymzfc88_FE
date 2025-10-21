import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Spin,
  Tabs,
  Space,
  Typography,
  Alert,
  Divider,
  Row,
  Col
} from 'antd';
import {
  SettingOutlined,
  SaveOutlined,
  ReloadOutlined,
  LockOutlined,
  UnlockOutlined,
  DollarOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { adminService } from '../services/adminService';

const { Title, Text } = Typography;
const { TextArea } = Input;

const AdminSystemSettings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({});
  const [form] = Form.useForm();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllSystemSettings();
      if (response.success) {
        // Convert array to object by settingKey
        const settingsMap = {};
        response.data.forEach(setting => {
          settingsMap[setting.settingKey] = setting.settingValue;
        });
        setSettings(settingsMap);
        form.setFieldsValue(settingsMap);
      }
    } catch (error) {
      message.error('Lỗi khi tải cài đặt: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSetting = async (settingKey, settingValue, description, category) => {
    try {
      setLoading(true);
      const response = await adminService.createOrUpdateSystemSetting({
        settingKey,
        settingValue,
        description,
        category
      });
      
      if (response.success) {
        message.success('Cập nhật cài đặt thành công!');
        loadSettings();
      }
    } catch (error) {
      message.error('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWithdrawalSettings = (values) => {
    handleSaveSetting(
      'default_withdrawal_lock_reason',
      values.default_withdrawal_lock_reason,
      'Lý do mặc định khi khóa rút tiền của người dùng',
      'WITHDRAWAL'
    );
  };

  const handleSaveAmountSettings = (values) => {
    // Save multiple settings
    Promise.all([
      handleSaveSetting(
        'min_withdrawal_amount',
        values.min_withdrawal_amount,
        'Số tiền rút tối thiểu',
        'WITHDRAWAL'
      ),
      handleSaveSetting(
        'max_withdrawal_amount',
        values.max_withdrawal_amount,
        'Số tiền rút tối đa',
        'WITHDRAWAL'
      ),
      handleSaveSetting(
        'min_deposit_amount',
        values.min_deposit_amount,
        'Số tiền nạp tối thiểu',
        'DEPOSIT'
      ),
      handleSaveSetting(
        'max_deposit_amount',
        values.max_deposit_amount,
        'Số tiền nạp tối đa',
        'DEPOSIT'
      )
    ]);
  };

  const handleInitializeDefaults = async () => {
    try {
      setLoading(true);
      const response = await adminService.initializeDefaultSettings();
      if (response.success) {
        message.success('Khởi tạo cài đặt mặc định thành công!');
        loadSettings();
      }
    } catch (error) {
      message.error('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="mb-0">
            <SettingOutlined className="mr-2" />
            Cài đặt hệ thống
          </Title>
          <Text type="secondary">
            Quản lý các cài đặt và tùy chỉnh hệ thống
          </Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={loadSettings} loading={loading}>
            Làm mới
          </Button>
          <Button 
            type="default"
            onClick={handleInitializeDefaults} 
            loading={loading}
          >
            Khởi tạo mặc định
          </Button>
        </Space>
      </div>

      <Spin spinning={loading}>
        <Tabs 
          defaultActiveKey="withdrawal" 
          type="card"
          items={[
            {
              key: 'withdrawal',
              label: (
                <span>
                  <LockOutlined />
                  Quản lý khóa rút tiền
                </span>
              ),
              children: (
                <Card>
                  <Alert
                    message="Quản lý khóa rút tiền cho từng người dùng"
                    description="Tính năng này cho phép admin khóa rút tiền cho từng người dùng cụ thể với lý do riêng biệt. Để khóa rút tiền, hãy vào mục 'Quản lý người dùng' và click vào biểu tượng khóa."
                    type="info"
                    icon={<InfoCircleOutlined />}
                    showIcon
                    className="mb-6"
                  />

                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <Title level={4} className="text-blue-800 mb-2">
                        <LockOutlined className="mr-2" />
                        Hướng dẫn khóa rút tiền
                      </Title>
                      <div className="space-y-2 text-blue-700">
                        <p>1. Vào mục <strong>"Quản lý người dùng"</strong> trong menu bên trái</p>
                        <p>2. Tìm người dùng cần khóa rút tiền</p>
                        <p>3. Click vào biểu tượng <strong>🔒</strong> trong cột "Thao tác"</p>
                        <p>4. Nhập lý do khóa rút tiền cụ thể cho người dùng đó</p>
                        <p>5. Click <strong>"Khóa rút tiền"</strong> để xác nhận</p>
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <Title level={4} className="text-green-800 mb-2">
                        <UnlockOutlined className="mr-2" />
                        Hướng dẫn mở khóa rút tiền
                      </Title>
                      <div className="space-y-2 text-green-700">
                        <p>1. Vào mục <strong>"Quản lý người dùng"</strong></p>
                        <p>2. Tìm người dùng đã bị khóa (có tag đỏ "Khóa rút")</p>
                        <p>3. Click vào biểu tượng <strong>🔓</strong> để mở khóa ngay lập tức</p>
                        <p>4. Không cần nhập lý do khi mở khóa</p>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <Title level={4} className="text-yellow-800 mb-2">
                        <InfoCircleOutlined className="mr-2" />
                        Lưu ý quan trọng
                      </Title>
                      <div className="space-y-2 text-yellow-700">
                        <p>• Lý do khóa rút tiền sẽ được hiển thị cho người dùng khi họ cố gắng rút tiền</p>
                        <p>• Mỗi người dùng có thể có lý do khóa rút tiền khác nhau</p>
                        <p>• Admin có thể xem lý do khóa rút tiền trong chi tiết người dùng</p>
                        <p>• Việc khóa/mở khóa rút tiền sẽ được ghi nhận thời gian</p>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            },
            {
              key: 'amounts',
              label: (
                <span>
                  <DollarOutlined />
                  Giới hạn số tiền
                </span>
              ),
              children: (
                <Card>
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSaveAmountSettings}
                  >
                    <Title level={4}>Cài đặt rút tiền</Title>
                    <Row gutter={16}>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name="min_withdrawal_amount"
                          label="Số tiền rút tối thiểu (VNĐ)"
                          rules={[{ required: true, message: 'Vui lòng nhập số tiền' }]}
                        >
                          <Input 
                            type="number"
                            placeholder="50000"
                            addonBefore="₫"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name="max_withdrawal_amount"
                          label="Số tiền rút tối đa (VNĐ)"
                          rules={[{ required: true, message: 'Vui lòng nhập số tiền' }]}
                        >
                          <Input 
                            type="number"
                            placeholder="50000000"
                            addonBefore="₫"
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Divider />

                    <Title level={4}>Cài đặt nạp tiền</Title>
                    <Row gutter={16}>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name="min_deposit_amount"
                          label="Số tiền nạp tối thiểu (VNĐ)"
                          rules={[{ required: true, message: 'Vui lòng nhập số tiền' }]}
                        >
                          <Input 
                            type="number"
                            placeholder="50000"
                            addonBefore="₫"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name="max_deposit_amount"
                          label="Số tiền nạp tối đa (VNĐ)"
                          rules={[{ required: true, message: 'Vui lòng nhập số tiền' }]}
                        >
                          <Input 
                            type="number"
                            placeholder="100000000"
                            addonBefore="₫"
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item>
                      <Button 
                        type="primary" 
                        htmlType="submit" 
                        icon={<SaveOutlined />}
                        loading={loading}
                      >
                        Lưu tất cả cài đặt
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              )
            }
          ]}
        />
      </Spin>
    </div>
  );
};

export default AdminSystemSettings;

