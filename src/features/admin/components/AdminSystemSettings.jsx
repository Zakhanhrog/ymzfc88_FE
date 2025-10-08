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
  DollarOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { adminService } from '../services/adminService';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

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
        <Tabs defaultActiveKey="withdrawal" type="card">
          {/* Withdrawal Settings */}
          <TabPane 
            tab={
              <span>
                <LockOutlined />
                Cài đặt rút tiền
              </span>
            } 
            key="withdrawal"
          >
            <Card>
              <Alert
                message="Lý do khóa rút tiền mặc định"
                description="Lý do này sẽ được sử dụng tự động khi admin khóa rút tiền cho người dùng. Admin có thể ghi đè lý do này khi cần."
                type="info"
                icon={<InfoCircleOutlined />}
                showIcon
                className="mb-6"
              />

              <Form
                form={form}
                layout="vertical"
                onFinish={handleSaveWithdrawalSettings}
              >
                <Form.Item
                  name="default_withdrawal_lock_reason"
                  label="Lý do khóa rút tiền mặc định"
                  rules={[
                    { required: true, message: 'Vui lòng nhập lý do' },
                    { min: 20, message: 'Lý do tối thiểu 20 ký tự' }
                  ]}
                >
                  <TextArea 
                    rows={6}
                    placeholder="Nhập lý do mặc định khi khóa rút tiền..."
                    maxLength={500}
                    showCount
                  />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<SaveOutlined />}
                    loading={loading}
                  >
                    Lưu cài đặt
                  </Button>
                </Form.Item>
              </Form>

              <Divider />

              <Alert
                message="Cách sử dụng"
                description={
                  <div className="space-y-2">
                    <p>1. Nhập lý do mặc định vào ô text trên</p>
                    <p>2. Click "Lưu cài đặt" để áp dụng</p>
                    <p>3. Từ giờ khi khóa rút tiền, lý do này sẽ tự động được sử dụng</p>
                    <p>4. Admin vẫn có thể nhập lý do khác nếu muốn (optional)</p>
                  </div>
                }
                type="success"
              />
            </Card>
          </TabPane>

          {/* Amount Limits */}
          <TabPane 
            tab={
              <span>
                <DollarOutlined />
                Giới hạn số tiền
              </span>
            } 
            key="amounts"
          >
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
          </TabPane>
        </Tabs>
      </Spin>
    </div>
  );
};

export default AdminSystemSettings;

