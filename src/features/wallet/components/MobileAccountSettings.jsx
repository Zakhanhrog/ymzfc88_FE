import { useEffect, useState } from 'react';
import { Form, Input, Button, Divider } from 'antd';
import { message } from '../../../utils/notification';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import walletService from '../services/walletService';

const MobileAccountSettings = ({ onBack, onProfileUpdate }) => {
  const navigate = useNavigate();
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileMeta, setProfileMeta] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoadingProfile(true);
    try {
      const response = await walletService.getUserProfile();
      if (response?.success) {
        const data = response.data;
        profileForm.setFieldsValue({
          username: data.username || '',
          referralCode: data.referralCode || '',
          joinDate: data.createdAt
            ? new Date(data.createdAt).toLocaleDateString('vi-VN')
            : '',
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
    } catch {
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

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/account');
    }
  };

  return (
    <div className="md:hidden fixed inset-0 z-50 bg-gray-50 overflow-y-auto">
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="px-4 py-2.5 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="p-1.5 -ml-1.5 text-gray-700 hover:text-emerald-600 transition-colors"
            aria-label="Quay lại"
          >
            <Icon icon="mdi:arrow-left" className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Cài đặt tài khoản
          </h1>
          <div className="w-6" />
        </div>
      </div>

      <div className="space-y-5 px-3 pt-4 pb-24">
        <section className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 text-white rounded-3xl shadow-lg p-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/10">
            <img src="/iconacc/imgi_29_account.avif" alt="Account" className="w-10 h-10" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold truncate">
              {profileMeta?.fullName || profileMeta?.username || 'Tài khoản của bạn'}
            </h2>
            <p className="text-sm text-white/80 mt-1 truncate">
              {profileMeta?.email || 'Cập nhật email của bạn để nhận thông báo'}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-3xl shadow-sm border border-gray-100">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">Thông tin cá nhân</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Cập nhật thông tin liên hệ để nhận hỗ trợ nhanh chóng.
          </p>
        </div>
        <div className="px-5 py-4">
          <Form
            layout="vertical"
            form={profileForm}
            onFinish={handleSaveProfile}
            requiredMark={false}
            disabled={loadingProfile}
          >
            <Form.Item
              name="username"
              label="Tên đăng nhập"
            >
              <Input id="mobile-username" disabled size="large" />
            </Form.Item>
            <Form.Item
              name="referralCode"
              label="Mã mời"
            >
              <Input
                id="mobile-referral-code"
                disabled
                size="large"
                placeholder="Chưa có"
                suffix={
                  profileMeta?.referralCode ? (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(profileMeta.referralCode);
                        message.success('Đã sao chép mã mời');
                      }}
                      className="text-emerald-500 text-xs font-semibold hover:text-emerald-600 transition-colors"
                    >
                      Sao chép
                    </button>
                  ) : null
                }
              />
            </Form.Item>
            <Form.Item
              name="joinDate"
              label="Ngày tham gia"
            >
              <Input id="mobile-join-date" disabled size="large" />
            </Form.Item>
            <Form.Item
              name="fullName"
              label="Họ và tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
            >
              <Input id="mobile-full-name" size="large" placeholder="Nhập họ và tên" />
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
              <Input id="mobile-phone" size="large" placeholder="Nhập số điện thoại" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
            >
              <Input id="mobile-email" size="large" placeholder="Nhập email" />
            </Form.Item>
            <div className="flex items-center gap-2 mt-3">
              <Button
                type="primary"
                htmlType="submit"
                loading={savingProfile}
                className="flex-1 h-10 text-sm font-semibold bg-emerald-500 hover:bg-emerald-600"
              >
                Lưu thay đổi
              </Button>
              <Button
                onClick={loadProfile}
                disabled={loadingProfile || savingProfile}
                className="flex-1 h-10 text-sm font-semibold"
              >
                Tải lại
              </Button>
            </div>
          </Form>
        </div>
      </section>

      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-6">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">Đổi mật khẩu</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Tạo mật khẩu mạnh để bảo vệ tài khoản của bạn.
          </p>
        </div>
        <div className="px-5 py-4">
          <Form
            layout="vertical"
            form={passwordForm}
            onFinish={handleChangePassword}
            requiredMark={false}
          >
            <Form.Item
              name="currentPassword"
              label="Mật khẩu hiện tại"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
            >
              <Input.Password id="mobile-current-password" size="large" placeholder="Nhập mật khẩu hiện tại" />
            </Form.Item>
            <Divider className="my-2" />
            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
              ]}
            >
              <Input.Password id="mobile-new-password" size="large" placeholder="Nhập mật khẩu mới" />
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
              <Input.Password id="mobile-confirm-password" size="large" placeholder="Nhập lại mật khẩu mới" />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={savingPassword}
              className="w-full h-11 text-sm font-semibold bg-emerald-500 hover:bg-emerald-600"
            >
              Đổi mật khẩu
            </Button>
          </Form>
        </div>
      </section>
      </div>
    </div>
  );
};

export default MobileAccountSettings;

