import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  message,
  Spin,
  Tabs,
  Space,
  Typography,
  Alert,
  Divider,
  Row,
  Col,
  TimePicker
} from 'antd';
import {
  SettingOutlined,
  SaveOutlined,
  ReloadOutlined,
  LockOutlined,
  UnlockOutlined,
  DollarOutlined,
  InfoCircleOutlined,
  PercentageOutlined
} from '@ant-design/icons';
import { adminService } from '../services/adminService';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const { Title, Text } = Typography;
const { TextArea } = Input;
const REFUND_TIME_FORMAT = 'HH:mm';
const DEFAULT_REFUND_TIME = '12:00';

const AdminSystemSettings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({});
  const [form] = Form.useForm();
  const [commissionForm] = Form.useForm();
  const [gameRefundForm] = Form.useForm();
  const currentCommissionValue =
    settings.agent_commission_percentage !== undefined &&
    settings.agent_commission_percentage !== null &&
    settings.agent_commission_percentage !== ''
      ? parseFloat(settings.agent_commission_percentage)
      : undefined;

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
        const commissionValueRaw = settingsMap.agent_commission_percentage;
        commissionForm.setFieldsValue({
          agent_commission_percentage:
            commissionValueRaw !== undefined &&
            commissionValueRaw !== null &&
            commissionValueRaw !== ''
              ? parseFloat(commissionValueRaw)
              : undefined
        });
        gameRefundForm.setFieldsValue({
          sicbo_refund_win_percentage: parsePercentage(settingsMap.sicbo_refund_win_percentage),
          sicbo_refund_loss_percentage: parsePercentage(settingsMap.sicbo_refund_loss_percentage),
          xocdia_refund_win_percentage: parsePercentage(settingsMap.xocdia_refund_win_percentage),
          xocdia_refund_loss_percentage: parsePercentage(settingsMap.xocdia_refund_loss_percentage),
          sicbo_refund_payout_time: parseTimeSetting(settingsMap.sicbo_refund_payout_time),
          xocdia_refund_payout_time: parseTimeSetting(settingsMap.xocdia_refund_payout_time)
        });
      }
    } catch (error) {
      message.error('Lỗi khi tải cài đặt: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const parsePercentage = (value) => {
    if (value === undefined || value === null || value === '') {
      return 0;
    }
    const parsed = Number.parseFloat(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const parseTimeSetting = (value) => {
    if (!value || typeof value !== 'string') {
      return dayjs(DEFAULT_REFUND_TIME, REFUND_TIME_FORMAT);
    }
    const parsed = dayjs(value, REFUND_TIME_FORMAT, true);
    return parsed.isValid() ? parsed : dayjs(DEFAULT_REFUND_TIME, REFUND_TIME_FORMAT);
  };

  const formatTimeValue = (timeValue) => {
    if (!timeValue) {
      return DEFAULT_REFUND_TIME;
    }
    return dayjs(timeValue).format(REFUND_TIME_FORMAT);
  };

  const handleSaveSetting = async (settingKey, settingValue, description, category) => {
    try {
      setLoading(true);
      const normalizedValue =
        settingValue === undefined || settingValue === null
          ? ''
          : String(settingValue);

      const response = await adminService.createOrUpdateSystemSetting({
        settingKey,
        settingValue: normalizedValue,
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

  const handleSaveCommissionSettings = (values) => {
    handleSaveSetting(
      'agent_commission_percentage',
      values.agent_commission_percentage,
      'Tỷ lệ hoa hồng mặc định cho đại lý (đơn vị %)',
      'COMMISSION'
    );
  };

  const handleSaveGameRefundSettings = async (values) => {
    const entries = [
      {
        key: 'sicbo_refund_win_percentage',
        value: values.sicbo_refund_win_percentage,
        description: 'Tỷ lệ hoàn trả (%) cho lệnh thắng Sicbo',
        category: 'GAME_REFUND'
      },
      {
        key: 'sicbo_refund_loss_percentage',
        value: values.sicbo_refund_loss_percentage,
        description: 'Tỷ lệ hoàn trả (%) cho lệnh thua Sicbo',
        category: 'GAME_REFUND'
      },
      {
        key: 'xocdia_refund_win_percentage',
        value: values.xocdia_refund_win_percentage,
        description: 'Tỷ lệ hoàn trả (%) cho lệnh thắng Xóc Đĩa',
        category: 'GAME_REFUND'
      },
      {
        key: 'xocdia_refund_loss_percentage',
        value: values.xocdia_refund_loss_percentage,
        description: 'Tỷ lệ hoàn trả (%) cho lệnh thua Xóc Đĩa',
        category: 'GAME_REFUND'
      },
      {
        key: 'sicbo_refund_payout_time',
        value: formatTimeValue(values.sicbo_refund_payout_time),
        description: 'Thời gian chạy hoàn trả Sicbo hằng ngày (HH:mm)',
        category: 'GAME_REFUND'
      },
      {
        key: 'xocdia_refund_payout_time',
        value: formatTimeValue(values.xocdia_refund_payout_time),
        description: 'Thời gian chạy hoàn trả Xóc Đĩa hằng ngày (HH:mm)',
        category: 'GAME_REFUND'
      }
    ];

    try {
      setLoading(true);
      await Promise.all(
        entries.map(entry =>
          adminService.createOrUpdateSystemSetting({
            settingKey: entry.key,
            settingValue:
              entry.value === undefined || entry.value === null
                ? '0'
                : String(entry.value),
            description: entry.description,
            category: entry.category
          })
        )
      );
      message.success('Cập nhật tỷ lệ hoàn trả trò chơi thành công!');
      await loadSettings();
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
            },
            {
              key: 'commission',
              label: (
                <span>
                  <PercentageOutlined />
                  Cài đặt hoa hồng
                </span>
              ),
              children: (
                <Card>
                  <Space direction="vertical" size="large" className="w-full">
                    <Alert
                      type="info"
                      showIcon
                      message="Thiết lập tỷ lệ hoa hồng cho đại lý"
                      description="Giá trị này được áp dụng làm tỷ lệ hoa hồng mặc định cho toàn bộ hệ thống đại lý. Bạn có thể thay đổi bất kỳ lúc nào khi chính sách thay đổi."
                    />

                    <div>
                      <Title level={4} className="mb-1">
                        Hoa hồng đại lý
                      </Title>
                      <Text type="secondary">
                        Hiện tại đang áp dụng:{' '}
                        <Text strong>
                          {currentCommissionValue !== undefined && !Number.isNaN(currentCommissionValue)
                            ? `${currentCommissionValue}%`
                            : 'Chưa thiết lập'}
                        </Text>
                      </Text>
                    </div>

                    <Form
                      form={commissionForm}
                      layout="vertical"
                      onFinish={handleSaveCommissionSettings}
                    >
                      <Form.Item
                        name="agent_commission_percentage"
                        label="Tỷ lệ hoa hồng đại lý (%)"
                        rules={[
                          { required: true, message: 'Vui lòng nhập tỷ lệ hoa hồng' },
                          {
                            validator: (_, value) => {
                              if (value === undefined || value === null) {
                                return Promise.resolve();
                              }
                              if (value < 0 || value > 100) {
                                return Promise.reject(
                                  new Error('Tỷ lệ hoa hồng phải nằm trong khoảng 0 - 100%')
                                );
                              }
                              return Promise.resolve();
                            }
                          }
                        ]}
                      >
                        <InputNumber
                          min={0}
                          max={100}
                          step={0.1}
                          placeholder="5"
                          style={{ width: '100%' }}
                          formatter={(value) =>
                            value === undefined || value === null ? '' : `${value}%`
                          }
                          parser={(value) =>
                            value ? value.replace(/\s?%/g, '').replace(',', '.') : ''
                          }
                        />
                      </Form.Item>

                      <Form.Item>
                        <Space>
                          <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            loading={loading}
                          >
                            Lưu tỷ lệ hoa hồng
                          </Button>
                          <Button
                            onClick={() =>
                              commissionForm.setFieldsValue({
                                agent_commission_percentage: currentCommissionValue
                              })
                            }
                            disabled={loading}
                          >
                            Đặt lại
                          </Button>
                        </Space>
                      </Form.Item>
                    </Form>
                  </Space>
                </Card>
              )
            },
            {
              key: 'game-refund',
              label: (
                <span>
                  <PercentageOutlined />
                  Hoàn trả trò chơi
                </span>
              ),
              children: (
                <Card>
                  <Space direction="vertical" size="large" className="w-full">
                    <Alert
                      type="info"
                      showIcon
                      message="Thiết lập tỷ lệ hoàn trả theo từng trò chơi"
                      description="Tỷ lệ hoàn trả được tính dựa trên số tiền cược (stake) của mỗi lệnh cược Sicbo và Xóc Đĩa. Hệ thống sẽ cộng thêm điểm hoàn trả tương ứng sau khi lệnh được xử lý."
                    />

                    <Form
                      form={gameRefundForm}
                      layout="vertical"
                      onFinish={handleSaveGameRefundSettings}
                    >
                      <Divider orientation="left">Sicbo</Divider>
                      <Row gutter={16}>
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="sicbo_refund_win_percentage"
                            label="Hoàn trả lệnh thắng (%)"
                            rules={[
                              { required: true, message: 'Vui lòng nhập tỷ lệ hoàn trả lệnh thắng' },
                              {
                                validator: (_, value) => {
                                  if (value === undefined || value === null) {
                                    return Promise.resolve();
                                  }
                                  if (value < 0 || value > 100) {
                                    return Promise.reject(
                                      new Error('Tỷ lệ phải nằm trong khoảng 0 - 100%')
                                    );
                                  }
                                  return Promise.resolve();
                                }
                              }
                            ]}
                          >
                            <InputNumber
                              min={0}
                              max={100}
                              step={0.1}
                              style={{ width: '100%' }}
                              formatter={(value) =>
                                value === undefined || value === null ? '' : `${value}%`
                              }
                              parser={(value) =>
                                value ? value.replace(/\s?%/g, '').replace(',', '.') : ''
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="sicbo_refund_loss_percentage"
                            label="Hoàn trả lệnh thua (%)"
                            rules={[
                              { required: true, message: 'Vui lòng nhập tỷ lệ hoàn trả lệnh thua' },
                              {
                                validator: (_, value) => {
                                  if (value === undefined || value === null) {
                                    return Promise.resolve();
                                  }
                                  if (value < 0 || value > 100) {
                                    return Promise.reject(
                                      new Error('Tỷ lệ phải nằm trong khoảng 0 - 100%')
                                    );
                                  }
                                  return Promise.resolve();
                                }
                              }
                            ]}
                          >
                            <InputNumber
                              min={0}
                              max={100}
                              step={0.1}
                              style={{ width: '100%' }}
                              formatter={(value) =>
                                value === undefined || value === null ? '' : `${value}%`
                              }
                              parser={(value) =>
                                value ? value.replace(/\s?%/g, '').replace(',', '.') : ''
                              }
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="sicbo_refund_payout_time"
                            label="Thời gian hoàn trả hằng ngày"
                            rules={[{ required: true, message: 'Vui lòng chọn thời gian hoàn trả' }]}
                          >
                            <TimePicker
                              className="w-full"
                              format={REFUND_TIME_FORMAT}
                              minuteStep={5}
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Divider orientation="left">Xóc Đĩa</Divider>
                      <Row gutter={16}>
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="xocdia_refund_win_percentage"
                            label="Hoàn trả lệnh thắng (%)"
                            rules={[
                              { required: true, message: 'Vui lòng nhập tỷ lệ hoàn trả lệnh thắng' },
                              {
                                validator: (_, value) => {
                                  if (value === undefined || value === null) {
                                    return Promise.resolve();
                                  }
                                  if (value < 0 || value > 100) {
                                    return Promise.reject(
                                      new Error('Tỷ lệ phải nằm trong khoảng 0 - 100%')
                                    );
                                  }
                                  return Promise.resolve();
                                }
                              }
                            ]}
                          >
                            <InputNumber
                              min={0}
                              max={100}
                              step={0.1}
                              style={{ width: '100%' }}
                              formatter={(value) =>
                                value === undefined || value === null ? '' : `${value}%`
                              }
                              parser={(value) =>
                                value ? value.replace(/\s?%/g, '').replace(',', '.') : ''
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="xocdia_refund_loss_percentage"
                            label="Hoàn trả lệnh thua (%)"
                            rules={[
                              { required: true, message: 'Vui lòng nhập tỷ lệ hoàn trả lệnh thua' },
                              {
                                validator: (_, value) => {
                                  if (value === undefined || value === null) {
                                    return Promise.resolve();
                                  }
                                  if (value < 0 || value > 100) {
                                    return Promise.reject(
                                      new Error('Tỷ lệ phải nằm trong khoảng 0 - 100%')
                                    );
                                  }
                                  return Promise.resolve();
                                }
                              }
                            ]}
                          >
                            <InputNumber
                              min={0}
                              max={100}
                              step={0.1}
                              style={{ width: '100%' }}
                              formatter={(value) =>
                                value === undefined || value === null ? '' : `${value}%`
                              }
                              parser={(value) =>
                                value ? value.replace(/\s?%/g, '').replace(',', '.') : ''
                              }
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="xocdia_refund_payout_time"
                            label="Thời gian hoàn trả hằng ngày"
                            rules={[{ required: true, message: 'Vui lòng chọn thời gian hoàn trả' }]}
                          >
                            <TimePicker
                              className="w-full"
                              format={REFUND_TIME_FORMAT}
                              minuteStep={5}
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Alert
                        type="warning"
                        showIcon
                        message="Lưu ý"
                        description="Tỷ lệ hoàn trả được tính trên tiền cược ban đầu và sẽ được cộng vào tài khoản vào đúng thời gian đã cấu hình hằng ngày."
                      />

                      <Form.Item className="mt-4">
                        <Space>
                          <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            loading={loading}
                          >
                            Lưu cài đặt hoàn trả
                          </Button>
                          <Button
                            onClick={() =>
                              gameRefundForm.setFieldsValue({
                                sicbo_refund_win_percentage: parsePercentage(settings.sicbo_refund_win_percentage),
                                sicbo_refund_loss_percentage: parsePercentage(settings.sicbo_refund_loss_percentage),
                                xocdia_refund_win_percentage: parsePercentage(settings.xocdia_refund_win_percentage),
                                xocdia_refund_loss_percentage: parsePercentage(settings.xocdia_refund_loss_percentage),
                                sicbo_refund_payout_time: parseTimeSetting(settings.sicbo_refund_payout_time),
                                xocdia_refund_payout_time: parseTimeSetting(settings.xocdia_refund_payout_time)
                              })
                            }
                            disabled={loading}
                          >
                            Đặt lại
                          </Button>
                        </Space>
                      </Form.Item>
                    </Form>
                  </Space>
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

