import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import Loading from '../../../components/common/Loading';
import Spinner from '../../../components/ui/Spinner';
import { RotateCcw, Eye, EyeOff } from 'lucide-react';
import { message } from '../../../utils/notification';
import { THEME_COLORS } from '../../../utils/theme';
import dayjs from 'dayjs';
import TabPageHeader from './TabPageHeader';
import { adminService } from '../services/adminService';
import { adminAuthService } from '../services/adminAuthService';

const AdminProfile = () => {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    phoneNumber: ''
  });
  const [formErrors, setFormErrors] = useState({});
  
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  
  const [c2PasswordData, setC2PasswordData] = useState({
    newC2Password: ''
  });
  const [c2PasswordErrors, setC2PasswordErrors] = useState({});
  
  const [profileC2Data, setProfileC2Data] = useState({
    c2Password: ''
  });
  const [profileC2Errors, setProfileC2Errors] = useState({});
  
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
    newC2Password: false,
    c2Password: false
  });
  
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
        setFormData({
          username: data.username || '',
          fullName: data.fullName || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || ''
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

  const validateForm = () => {
    const errors = {};
    
    if (!formData.username) {
      errors.username = 'Vui lòng nhập tên đăng nhập';
    } else if (formData.username.length < 3) {
      errors.username = 'Tên đăng nhập tối thiểu 3 ký tự';
    } else if (formData.username.length > 20) {
      errors.username = 'Tên đăng nhập tối đa 20 ký tự';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = 'Chỉ được phép dùng chữ cái, số và dấu gạch dưới';
    }
    
    if (!formData.fullName) {
      errors.fullName = 'Vui lòng nhập họ và tên';
    }
    
    if (!formData.email) {
      errors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email không hợp lệ';
    }
    
    if (formData.phoneNumber && !/^[0-9]{10,11}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Số điện thoại không hợp lệ';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePassword = () => {
    const errors = {};
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'Mật khẩu tối thiểu 6 ký tự';
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateC2Password = () => {
    const errors = {};
    
    if (!c2PasswordData.newC2Password) {
      errors.newC2Password = 'Vui lòng nhập mật khẩu bảo vệ';
    } else if (c2PasswordData.newC2Password.length < 6) {
      errors.newC2Password = 'Mật khẩu tối thiểu 6 ký tự';
    }
    
    setC2PasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateProfileC2 = () => {
    const errors = {};
    
    if (!profileC2Data.c2Password) {
      errors.c2Password = 'Vui lòng nhập mật khẩu bảo vệ C2';
    } else if (profileC2Data.c2Password.length < 6) {
      errors.c2Password = 'Mật khẩu tối thiểu 6 ký tự';
    }
    
    setProfileC2Errors(errors);
    return Object.keys(errors).length === 0;
  };

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
        setFormData({
          username: updatedUser.username || '',
          fullName: updatedUser.fullName || '',
          email: updatedUser.email || '',
          phoneNumber: updatedUser.phoneNumber || ''
        });
        setProfileC2ModalVisible(false);
        setProfileC2Data({ c2Password: '' });
        setProfileC2Errors({});
        setPendingProfileValues(null);
      }
    } catch (error) {
      message.error(error.message || 'Không thể cập nhật thông tin');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleProfileSubmit = (e) => {
    e?.preventDefault();
    if (!validateForm()) {
      return;
    }
    setPendingProfileValues(formData);
    setProfileC2ModalVisible(true);
  };

  const confirmProfileUpdate = async () => {
    if (!validateProfileC2()) {
      return;
    }
      if (!pendingProfileValues) {
        message.error('Không có dữ liệu cần cập nhật');
        return;
      }
    await executeSaveProfile(pendingProfileValues, profileC2Data.c2Password);
  };

  const handleChangePassword = async (e) => {
    e?.preventDefault();
    if (!session?.id) {
      message.error('Không xác định được tài khoản hiện tại');
      return;
    }
    if (!validatePassword()) {
      return;
    }
    setSavingPassword(true);
    try {
      const response = await adminService.updateAdminPassword(session.id, passwordData.newPassword);
      if (response.success) {
        message.success('Đổi mật khẩu thành công');
        setPasswordData({ newPassword: '', confirmPassword: '' });
        setPasswordErrors({});
      }
    } catch (error) {
      message.error(error.message || 'Không thể đổi mật khẩu');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleChangeC2Password = async (e) => {
    e?.preventDefault();
    if (!validateC2Password()) {
      return;
    }
    setSavingC2Password(true);
    try {
      const response = await adminService.updateAdminC2Password(c2PasswordData.newC2Password);
      if (response.success) {
        message.success('Cập nhật mật khẩu bảo vệ thành công');
        setC2PasswordData({ newC2Password: '' });
        setC2PasswordErrors({});
        await loadProfile();
      }
    } catch (error) {
      message.error(error.message || 'Không thể cập nhật mật khẩu bảo vệ');
    } finally {
      setSavingC2Password(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="space-y-6">
      <TabPageHeader
        title="Thông tin cá nhân"
        description="Cập nhật thông tin tài khoản quản trị và bảo mật"
      />

      {/* Thông tin hệ thống - Compact ở trên */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          {loadingProfile ? (
            <div className="flex justify-center py-4">
              <Spinner size="sm" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">Vai trò</span>
                <Badge className="bg-red-100 text-red-800 border-red-200 text-xs px-2 py-0.5 w-fit">
                  {profileMeta?.role || 'ADMIN'}
                </Badge>
              </div>
              {profileMeta?.staffRole && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Phân quyền</span>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs px-2 py-0.5 w-fit">
                    {profileMeta.staffRole}
                  </Badge>
                </div>
              )}
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">Ngày tạo</span>
                <span className="text-sm font-medium text-gray-900">
                  {profileMeta?.createdAt
                    ? dayjs(profileMeta.createdAt).format('DD/MM/YYYY')
                    : '--'}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">Cập nhật gần nhất</span>
                <span className="text-sm font-medium text-gray-900">
                  {profileMeta?.updatedAt
                    ? dayjs(profileMeta.updatedAt).format('DD/MM/YYYY')
                    : '--'}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">Mật khẩu bảo vệ</span>
                <Badge className={`text-xs px-2 py-0.5 w-fit ${
                  profileMeta?.hasC2Password 
                    ? 'bg-green-100 text-green-800 border-green-200' 
                    : 'bg-gray-100 text-gray-800 border-gray-200'
                }`}>
                  {profileMeta?.hasC2Password ? 'Đã thiết lập' : 'Chưa thiết lập'}
                </Badge>
              </div>
              {profileMeta?.c2PasswordUpdatedAt && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Đổi C2 gần nhất</span>
                  <span className="text-sm font-medium text-gray-900">
                    {dayjs(profileMeta.c2PasswordUpdatedAt).format('DD/MM/YYYY')}
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
          </Card>

      {/* Grid 2 cột: Thông tin cơ bản và Bảo mật */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Thông tin cơ bản */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold">Thông tin cơ bản</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={loadProfile}
              disabled={savingProfile || loadingProfile}
              className="h-8 px-3 text-xs rounded-lg gap-1.5"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${loadingProfile ? 'animate-spin' : ''}`} />
              Tải lại
            </Button>
          </CardHeader>
          <CardContent>
            {loadingProfile ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Tên đăng nhập <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.username}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, username: e.target.value }));
                        setFormErrors(prev => ({ ...prev, username: '' }));
                      }}
                      placeholder="Tên đăng nhập"
                      className={`h-10 ${formErrors.username ? 'border-red-500' : ''}`}
                    />
                    {formErrors.username && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.username}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, fullName: e.target.value }));
                        setFormErrors(prev => ({ ...prev, fullName: '' }));
                      }}
                      placeholder="Họ và tên"
                      className={`h-10 ${formErrors.fullName ? 'border-red-500' : ''}`}
                    />
                    {formErrors.fullName && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.fullName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, email: e.target.value }));
                        setFormErrors(prev => ({ ...prev, email: '' }));
                      }}
                      placeholder="Email"
                      className={`h-10 ${formErrors.email ? 'border-red-500' : ''}`}
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Số điện thoại
                    </label>
                    <Input
                      value={formData.phoneNumber}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, phoneNumber: e.target.value }));
                        setFormErrors(prev => ({ ...prev, phoneNumber: '' }));
                      }}
                      placeholder="Số điện thoại"
                      className={`h-10 ${formErrors.phoneNumber ? 'border-red-500' : ''}`}
                    />
                    {formErrors.phoneNumber && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.phoneNumber}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={savingProfile}
                    className="h-10 px-6 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white font-semibold text-sm rounded-lg transition-all shadow-sm"
                  >
                    {savingProfile ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Bảo mật - Nhóm các form mật khẩu */}
        <div className="space-y-4">
          {/* Đổi mật khẩu */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Đổi mật khẩu</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Mật khẩu mới <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword.newPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => {
                        setPasswordData(prev => ({ ...prev, newPassword: e.target.value }));
                        setPasswordErrors(prev => ({ ...prev, newPassword: '' }));
                      }}
                      placeholder="Nhập mật khẩu mới"
                      className={`h-10 pr-10 ${passwordErrors.newPassword ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('newPassword')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword.newPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-xs text-red-500">{passwordErrors.newPassword}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Xác nhận mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword.confirmPassword ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => {
                        setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }));
                        setPasswordErrors(prev => ({ ...prev, confirmPassword: '' }));
                      }}
                      placeholder="Nhập lại mật khẩu mới"
                      className={`h-10 pr-10 ${passwordErrors.confirmPassword ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirmPassword')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword.confirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">{passwordErrors.confirmPassword}</p>
                  )}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={savingPassword}
                    className="h-10 px-6 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white font-semibold text-sm rounded-lg transition-all shadow-sm"
                  >
                    {savingPassword ? 'Đang đổi...' : 'Đổi mật khẩu'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setPasswordData({ newPassword: '', confirmPassword: '' });
                      setPasswordErrors({});
                    }}
                    disabled={savingPassword}
                    className="h-10 px-6 text-sm rounded-lg transition-all shadow-sm"
                  >
                    Hủy
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Mật khẩu bảo vệ (C2) */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Mật khẩu bảo vệ (C2)</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangeC2Password} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {profileMeta?.hasC2Password ? 'Mật khẩu bảo vệ mới' : 'Thiết lập mật khẩu bảo vệ'} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword.newC2Password ? 'text' : 'password'}
                      value={c2PasswordData.newC2Password}
                      onChange={(e) => {
                        setC2PasswordData(prev => ({ ...prev, newC2Password: e.target.value }));
                        setC2PasswordErrors(prev => ({ ...prev, newC2Password: '' }));
                      }}
                      placeholder="Nhập mật khẩu bảo vệ"
                      className={`h-10 pr-10 ${c2PasswordErrors.newC2Password ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('newC2Password')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword.newC2Password ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {c2PasswordErrors.newC2Password && (
                    <p className="mt-1 text-xs text-red-500">{c2PasswordErrors.newC2Password}</p>
                  )}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={savingC2Password}
                    className="h-10 px-6 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white font-semibold text-sm rounded-lg transition-all shadow-sm"
                  >
                    {savingC2Password ? 'Đang cập nhật...' : (profileMeta?.hasC2Password ? 'Cập nhật C2' : 'Thiết lập C2')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setC2PasswordData({ newC2Password: '' });
                      setC2PasswordErrors({});
                    }}
                    disabled={savingC2Password}
                    className="h-10 px-6 text-sm rounded-lg transition-all shadow-sm"
                  >
                    Hủy
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Ghi chú */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Ghi chú</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>- Đổi tên đăng nhập sẽ áp dụng cho lần đăng nhập tiếp theo.</p>
            <p>- Nếu đổi mật khẩu, hãy đăng xuất và đăng nhập lại để đảm bảo an toàn.</p>
          </div>
        </CardContent>
      </Card>

      {/* Modal xác nhận C2 */}
      <Modal
        title="Xác nhận mật khẩu bảo vệ (C2)"
        open={profileC2ModalVisible}
        onClose={() => {
          setProfileC2ModalVisible(false);
          setProfileC2Data({ c2Password: '' });
          setProfileC2Errors({});
          setPendingProfileValues(null);
        }}
        width="max-w-md"
      >
        <form onSubmit={(e) => { e.preventDefault(); confirmProfileUpdate(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Mật khẩu bảo vệ <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                type={showPassword.c2Password ? 'text' : 'password'}
                value={profileC2Data.c2Password}
                onChange={(e) => {
                  setProfileC2Data(prev => ({ ...prev, c2Password: e.target.value }));
                  setProfileC2Errors(prev => ({ ...prev, c2Password: '' }));
                }}
                placeholder="Nhập mật khẩu bảo vệ C2 để xác nhận"
                className={`h-10 pr-10 ${profileC2Errors.c2Password ? 'border-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('c2Password')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword.c2Password ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {profileC2Errors.c2Password && (
              <p className="mt-1 text-xs text-red-500">{profileC2Errors.c2Password}</p>
            )}
          </div>
          
          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setProfileC2ModalVisible(false);
                setProfileC2Data({ c2Password: '' });
                setProfileC2Errors({});
                setPendingProfileValues(null);
              }}
              className="h-10 px-6 text-sm rounded-lg transition-all shadow-sm"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={savingProfile}
              className="h-10 px-6 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white font-semibold text-sm rounded-lg transition-all shadow-sm"
            >
              {savingProfile ? 'Đang xác nhận...' : 'Xác nhận'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminProfile;
