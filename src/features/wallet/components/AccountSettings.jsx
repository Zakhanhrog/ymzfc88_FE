import { useEffect, useState, useMemo } from 'react';
import { Form, Input, Button, Space, Divider } from 'antd';
import { message } from '../../../utils/notification';
import { Icon } from '@iconify/react';
import walletService from '../services/walletService';

const AccountSettings = ({ onProfileUpdate }) => {
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileMeta, setProfileMeta] = useState(null);

  const loadProfile = async () => {
    setLoadingProfile(true);
    try {
      const response = await walletService.getUserProfile();
      if (response?.success) {
        const data = response.data;
        profileForm.setFieldsValue({
          fullName: data.fullName || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || ''
        });
        setProfileMeta(data);
        onProfileUpdate?.(data);
      } else {
        message.error(response?.message || 'Không thể tải thông tin tài khoản');
      }
    } catch (error) {
      message.error(error.message || 'Không thể tải thông tin tài khoản');
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const updateLocalUserCache = (updatedUser) => {
    try {
      const stored = localStorage.getItem('user');
      const parsed = stored ? JSON.parse(stored) : {};
      const merged = {
        ...parsed,
        username: updatedUser.username ?? parsed.username,
        fullName: updatedUser.fullName ?? parsed.fullName,
        email: updatedUser.email ?? parsed.email,
        phoneNumber: updatedUser.phoneNumber ?? parsed.phoneNumber,
      };
      localStorage.setItem('user', JSON.stringify(merged));
    } catch (error) {
      // ignore cache errors
    }
  };

  const handleSaveProfile = async (values) => {
    setSavingProfile(true);
    try {
      const response = await walletService.updateUserProfile(values);
      if (response?.success) {
        message.success('Cập nhật thông tin thành công');
        const data = response.data;
        setProfileMeta(data);
        updateLocalUserCache(data);
        onProfileUpdate?.(data);
      } else {
        message.error(response?.message || 'Không thể cập nhật thông tin');
      }
    } catch (error) {
      message.error(error.message || 'Không thể cập nhật thông tin');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('Mật khẩu xác nhận không khớp');
      return;
    }
    setSavingPassword(true);
    try {
      const response = await walletService.changeUserPassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      if (response?.success) {
        message.success('Đổi mật khẩu thành công');
        passwordForm.resetFields();
      } else {
        message.error(response?.message || 'Không thể đổi mật khẩu');
      }
    } catch (error) {
      message.error(error.message || 'Không thể đổi mật khẩu');
    } finally {
      setSavingPassword(false);
    }
  };

  const summaryTiles = useMemo(() => {
    if (!profileMeta) return [];
    return [
      {
        icon: 'mdi:account-circle',
        label: 'Tên đăng nhập',
        value: profileMeta.username || '--',
      },
      {
        icon: 'mdi:key-variant',
        label: 'Mã mời',
        value: profileMeta.referralCode || 'Chưa có',
      },
      {
        icon: 'mdi:calendar',
        label: 'Tham gia từ',
        value: profileMeta.createdAt
          ? new Date(profileMeta.createdAt).toLocaleString('vi-VN')
          : '--',
      },
    ];
  }, [profileMeta]);

  return (
    <div className="bg-gray-50">
      <div className="space-y-6 pb-6">
        <div className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 text-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-sm text-white/80 uppercase tracking-widest">Thông tin tài khoản</p>
              <h2 className="text-2xl font-semibold mt-1">
                {profileMeta?.fullName || profileMeta?.username || 'Tài khoản của bạn'}
              </h2>
              <p className="text-white/80 text-sm mt-1">
                Quản lý thông tin cá nhân và bảo mật tài khoản của bạn.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto lg:min-w-[420px]">
              {summaryTiles.map((tile) => (
                <div
                  key={tile.label}
                  className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center gap-3 border border-white/10 shadow-sm"
                >
                  <Icon icon={tile.icon} className="w-8 h-8 text-white flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs uppercase text-white/70 tracking-wide truncate">{tile.label}</p>
                    <p className="text-sm font-semibold text-white truncate">{tile.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Thông tin cá nhân</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Cập nhật thông tin liên hệ để nhận thông báo và hỗ trợ nhanh chóng.
                </p>
              </div>
              <div className="px-6 py-5">
                <Form
                  layout="vertical"
                  form={profileForm}
                  onFinish={handleSaveProfile}
                  requiredMark={false}
                  disabled={loadingProfile}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item
                        name="fullName"
                        label="Họ và tên"
                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                      >
                        <Input placeholder="Nhập họ và tên" size="large" />
                      </Form.Item>
                      <Form.Item
                        name="phoneNumber"
                        label="Số điện thoại"
                        rules={[
                          {
                            pattern: /^[0-9]{10,11}$/,
                            message: 'Số điện thoại không hợp lệ',
                          },
                        ]}
                      >
                        <Input placeholder="Nhập số điện thoại" size="large" />
                      </Form.Item>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                      <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                          { required: true, message: 'Vui lòng nhập email' },
                          { type: 'email', message: 'Email không hợp lệ' },
                        ]}
                      >
                        <Input placeholder="Nhập email" size="large" />
                      </Form.Item>
                  </div>
                  <Space className="mt-2">
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      loading={savingProfile}
                      className="bg-emerald-500 hover:bg-emerald-600"
                    >
                      Lưu thay đổi
                    </Button>
                    <Button onClick={loadProfile} disabled={loadingProfile || savingProfile} size="large">
                      Tải lại
                    </Button>
                  </Space>
                </Form>
              </div>
            </div>
          </div>

          <div className="xl:col-span-1">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm h-full">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Đổi mật khẩu</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Đảm bảo mật khẩu mới đủ mạnh để bảo vệ tài khoản.
                </p>
              </div>
              <div className="px-6 py-5">
                <Form layout="vertical" form={passwordForm} onFinish={handleChangePassword} requiredMark={false}>
                  <Form.Item
                    name="currentPassword"
                    label="Mật khẩu hiện tại"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
                  >
                    <Input.Password placeholder="Nhập mật khẩu hiện tại" size="large" />
                  </Form.Item>
                  <Divider />
                  <Form.Item
                    name="newPassword"
                    label="Mật khẩu mới"
                    rules={[
                      { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                      { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
                    ]}
                  >
                    <Input.Password placeholder="Nhập mật khẩu mới" size="large" />
                  </Form.Item>
                  <Form.Item
                    name="confirmPassword"
                    label="Xác nhận mật khẩu mới"
                    dependencies={['newPassword']}
                    rules={[
                      { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
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
                    <Input.Password placeholder="Nhập lại mật khẩu mới" size="large" />
                  </Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={savingPassword}
                    size="large"
                    className="w-full bg-emerald-500 hover:bg-emerald-600"
                  >
                    Đổi mật khẩu
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;

