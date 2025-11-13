import { useEffect, useState, useMemo } from 'react';
import { Card, Form, Input, Button, Space, Tag, Typography, message, Row, Col, Modal } from 'antd';
import dayjs from 'dayjs';
import TabPageHeader from './TabPageHeader';
import { adminService } from '../services/adminService';
import { adminAuthService } from '../services/adminAuthService';

const { Text } = Typography;

const AdminProfile = () => {
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [c2PasswordForm] = Form.useForm();
  const [profileC2Form] = Form.useForm();
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingC2Password, setSavingC2Password] = useState(false);
  const [profileMeta, setProfileMeta] = useState(null);
  const [profileC2ModalVisible, setProfileC2ModalVisible] = useState(false);
  const [pendingProfileValues, setPendingProfileValues] = useState(null);

  const session = useMemo(() => adminAuthService.getCurrentAdmin(), []);

  const loadProfile = async () => {
    setLoadingProfile(true);
    try {
      const response = await adminService.getAdminProfile();
      if (response.success) {
        const data = response.data;
        profileForm.setFieldsValue({
          username: data.username,
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber,
        });
        setProfileMeta(data);
        adminAuthService.updateCurrentAdmin({
          hasC2Password: data.hasC2Password,
          c2PasswordUpdatedAt: data.c2PasswordUpdatedAt,
        });
      }
    } catch (error) {
      message.error(error.message || 'Không thể tải thông tin admin');
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const executeSaveProfile = async (values, c2Password) => {
    setSavingProfile(true);
    try {
      const response = await adminService.updateAdminProfile({
        ...values,
        c2Password,
      });
      if (response.success) {
        message.success('Cập nhật thông tin thành công');
        const updatedUser = response.data;
        adminAuthService.updateCurrentAdmin({
          username: updatedUser.username,
          fullName: updatedUser.fullName,
          email: updatedUser.email,
          hasC2Password: updatedUser.hasC2Password,
          c2PasswordUpdatedAt: updatedUser.c2PasswordUpdatedAt,
        });
        setProfileMeta(updatedUser);
        setProfileC2ModalVisible(false);
        profileC2Form.resetFields();
        setPendingProfileValues(null);
      }
    } catch (error) {
      message.error(error.message || 'Không thể cập nhật thông tin');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleProfileSubmit = (values) => {
    setPendingProfileValues(values);
    setProfileC2ModalVisible(true);
  };

  const confirmProfileUpdate = async () => {
    try {
      if (!pendingProfileValues) {
        message.error('Không có dữ liệu cần cập nhật');
        return;
      }
      const { c2Password } = await profileC2Form.validateFields();
      await executeSaveProfile(pendingProfileValues, c2Password);
    } catch (error) {
      // validation error already displayed
    }
  };

  const handleChangePassword = async ({ newPassword }) => {
    if (!session?.id) {
      message.error('Không xác định được tài khoản hiện tại');
      return;
    }
    setSavingPassword(true);
    try {
      const response = await adminService.updateAdminPassword(session.id, newPassword);
      if (response.success) {
        message.success('Đổi mật khẩu thành công');
        passwordForm.resetFields();
      }
    } catch (error) {
      message.error(error.message || 'Không thể đổi mật khẩu');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleChangeC2Password = async ({ newC2Password }) => {
    setSavingC2Password(true);
    try {
      const response = await adminService.updateAdminC2Password(newC2Password);
      if (response.success) {
        message.success('Cập nhật mật khẩu bảo vệ thành công');
        c2PasswordForm.resetFields();
        await loadProfile();
      }
    } catch (error) {
      message.error(error.message || 'Không thể cập nhật mật khẩu bảo vệ');
    } finally {
      setSavingC2Password(false);
    }
  };

  return (
    <div className="space-y-6">
      <TabPageHeader
        title="Thông tin cá nhân"
        description="Cập nhật thông tin tài khoản quản trị và bảo mật"
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title="Thông tin cơ bản"
            loading={loadingProfile}
            extra={
              <Button onClick={loadProfile} disabled={savingProfile}>
                Tải lại
              </Button>
            }
          >
            <Form
              layout="vertical"
              form={profileForm}
              onFinish={handleProfileSubmit}
              requiredMark={false}
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="username"
                    label="Tên đăng nhập"
                    rules={[
                      { required: true, message: 'Vui lòng nhập tên đăng nhập' },
                      { min: 3, message: 'Tên đăng nhập tối thiểu 3 ký tự' },
                      { max: 20, message: 'Tên đăng nhập tối đa 20 ký tự' },
                      {
                        pattern: /^[a-zA-Z0-9_]+$/,
                        message: 'Chỉ được phép dùng chữ cái, số và dấu gạch dưới',
                      },
                    ]}
                  >
                    <Input placeholder="Tên đăng nhập" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="fullName"
                    label="Họ và tên"
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                  >
                    <Input placeholder="Họ và tên" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email' },
                      { type: 'email', message: 'Email không hợp lệ' },
                    ]}
                  >
                    <Input placeholder="Email" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="phoneNumber"
                    label="Số điện thoại"
                    rules={[
                      { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' },
                    ]}
                  >
                    <Input placeholder="Số điện thoại" />
                  </Form.Item>
                </Col>
              </Row>

              <Space className="mt-4">
                <Button type="primary" htmlType="submit" loading={savingProfile}>
                  Lưu thay đổi
                </Button>
              </Space>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Thông tin hệ thống" loading={loadingProfile}>
            <Space direction="vertical" className="w-full" size="large">
              <div className="flex justify-between">
                <Text strong>Vai trò</Text>
                <Tag color="red">{profileMeta?.role || 'ADMIN'}</Tag>
              </div>
              {profileMeta?.staffRole && (
                <div className="flex justify-between">
                  <Text strong>Phân quyền</Text>
                  <Tag color="blue">{profileMeta.staffRole}</Tag>
                </div>
              )}
              <div className="flex justify-between">
                <Text strong>Ngày tạo</Text>
                <Text>
                  {profileMeta?.createdAt
                    ? dayjs(profileMeta.createdAt).format('DD/MM/YYYY HH:mm')
                    : '--'}
                </Text>
              </div>
              <div className="flex justify-between">
                <Text strong>Cập nhật gần nhất</Text>
                <Text>
                  {profileMeta?.updatedAt
                    ? dayjs(profileMeta.updatedAt).format('DD/MM/YYYY HH:mm')
                    : '--'}
                </Text>
              </div>
              <div className="flex justify-between">
                <Text strong>Mật khẩu bảo vệ</Text>
                <Tag color={profileMeta?.hasC2Password ? 'green' : 'default'}>
                  {profileMeta?.hasC2Password ? 'Đã thiết lập' : 'Chưa thiết lập'}
                </Tag>
              </div>
              {profileMeta?.c2PasswordUpdatedAt && (
                <div className="flex justify-between">
                  <Text strong>Đổi C2 gần nhất</Text>
                  <Text>
                    {dayjs(profileMeta.c2PasswordUpdatedAt).format('DD/MM/YYYY HH:mm')}
                  </Text>
                </div>
              )}
            </Space>
          </Card>

          <Card title="Đổi mật khẩu" className="mt-4">
            <Form
              layout="vertical"
              form={passwordForm}
              onFinish={handleChangePassword}
              requiredMark={false}
            >
              <Form.Item
                name="newPassword"
                label="Mật khẩu mới"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                  { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu mới" />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                label="Xác nhận mật khẩu"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Nhập lại mật khẩu mới" />
              </Form.Item>
              <Form.Item className="mb-0">
                <Space>
                  <Button type="primary" htmlType="submit" loading={savingPassword}>
                    Đổi mật khẩu
                  </Button>
                  <Button
                    onClick={() => passwordForm.resetFields()}
                    disabled={savingPassword}
                  >
                    Hủy
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>

          <Card title="Mật khẩu bảo vệ (C2)" className="mt-4">
            <Form
              layout="vertical"
              form={c2PasswordForm}
              onFinish={handleChangeC2Password}
              requiredMark={false}
            >
              <Form.Item
                name="newC2Password"
                label={profileMeta?.hasC2Password ? 'Mật khẩu bảo vệ mới' : 'Thiết lập mật khẩu bảo vệ'}
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu bảo vệ' },
                  { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu bảo vệ" />
              </Form.Item>
              <Form.Item className="mb-0">
                <Space>
                  <Button type="primary" htmlType="submit" loading={savingC2Password}>
                    {profileMeta?.hasC2Password ? 'Cập nhật C2' : 'Thiết lập C2'}
                  </Button>
                  <Button
                    onClick={() => c2PasswordForm.resetFields()}
                    disabled={savingC2Password}
                  >
                    Hủy
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      <Card title="Ghi chú">
        <Space direction="vertical">
          <Text type="secondary">
            - Đổi tên đăng nhập sẽ áp dụng cho lần đăng nhập tiếp theo.
          </Text>
          <Text type="secondary">
            - Nếu đổi mật khẩu, hãy đăng xuất và đăng nhập lại để đảm bảo an toàn.
          </Text>
        </Space>
      </Card>

      <Modal
        title="Xác nhận mật khẩu bảo vệ (C2)"
        open={profileC2ModalVisible}
        onCancel={() => {
          setProfileC2ModalVisible(false);
          profileC2Form.resetFields();
          setPendingProfileValues(null);
        }}
        onOk={confirmProfileUpdate}
        confirmLoading={savingProfile}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Form form={profileC2Form} layout="vertical">
          <Form.Item
            name="c2Password"
            label="Mật khẩu bảo vệ"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu bảo vệ C2' },
              { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu bảo vệ C2 để xác nhận" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminProfile;

