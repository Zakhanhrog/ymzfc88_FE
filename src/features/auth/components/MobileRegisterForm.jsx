import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Button, Input } from '../../../components/ui';
import { authService } from '../services/authService';
import { message } from '../../../utils/notification';

const MobileRegisterForm = ({ onClose, onSwitchToLogin, redirectAfterLogin }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    
    if (!formData.username) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập!';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Tên đăng nhập tối thiểu 3 ký tự!';
    }
    
    if (!formData.email) {
      newErrors.email = 'Vui lòng nhập email!';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ!';
    }
    
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu!';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu tối thiểu 6 ký tự!';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu!';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp!';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Vui lòng nhập số điện thoại!';
    }
    
    if (!agreeTerms) {
      newErrors.terms = 'Vui lòng đồng ý với điều khoản!';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      const firstError = Object.values(errors)[0];
      if (firstError) message.error(firstError);
      return;
    }

    setLoading(true);
    message.info('Đang xử lý đăng ký...');
    
    try {
      const response = await authService.register(formData);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      message.success('Đăng ký thành công!');
      
      setTimeout(() => {
        onClose && onClose();
        
        if (redirectAfterLogin) {
          navigate(redirectAfterLogin);
        } else {
          window.location.reload();
        }
      }, 1000);
    } catch (error) {
      console.error('Register error:', error);
      message.error(error.message || 'Đăng ký thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="md:hidden fixed inset-0 z-50 bg-white overflow-y-auto" onClick={(e) => e.stopPropagation()}>
      {/* Header */}
      <div className="bg-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src="/logo.webp" 
            alt="AE888 Logo" 
            className="h-6 w-auto"
          />
        </div>
        <button
          onClick={() => {
            onClose && onClose();
            navigate('/');
          }}
          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
        >
          <Icon icon="mdi:close" className="text-gray-600 text-lg" />
        </button>
      </div>

      {/* Top Banner */}
      <div className="relative h-48 overflow-hidden -mt-1">
        <img 
          src="/images/banners/ad-log.jpg" 
          alt="Promotional Banner" 
          className="w-full h-full object-contain"
        />
      </div>

      {/* Register Form */}
      <div className="bg-gray-50 -mt-8 mx-4 rounded-t-2xl relative z-10">
        <div className="p-6 pt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Đăng ký</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                * Tên đăng nhập
              </label>
              <div className="relative">
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Nhập tên đăng nhập"
                  prefix={<Icon icon="mdi:account" className="text-gray-400" />}
                  error={errors.username}
                  className="h-12 rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                * Email
              </label>
              <div className="relative">
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập email"
                  prefix={<Icon icon="mdi:email" className="text-gray-400" />}
                  error={errors.email}
                  className="h-12 rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                * Số điện thoại
              </label>
              <div className="relative">
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại"
                  prefix={<Icon icon="mdi:phone" className="text-gray-400" />}
                  error={errors.phone}
                  className="h-12 rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                * Mật khẩu
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu"
                  prefix={<Icon icon="mdi:lock" className="text-gray-400" />}
                  suffix={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} className="w-5 h-5" />
                    </button>
                  }
                  error={errors.password}
                  className="h-12 rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                * Xác nhận mật khẩu
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu"
                  prefix={<Icon icon="mdi:lock" className="text-gray-400" />}
                  suffix={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Icon icon={showConfirmPassword ? "mdi:eye-off" : "mdi:eye"} className="w-5 h-5" />
                    </button>
                  }
                  error={errors.confirmPassword}
                  className="h-12 rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="agreeTerms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 mt-1"
              />
              <label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-700">
                Tôi đồng ý với <span className="text-red-600 hover:underline cursor-pointer">điều khoản và điều kiện</span>
              </label>
            </div>
            {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms}</p>}

            {/* Register Button */}
            <Button 
              type="submit"
              variant="primary"
              size="lg"
              block
              loading={loading}
              className="h-12 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-colors text-sm mt-6"
            >
              Đăng ký
            </Button>

            {/* Login Button */}
            <Button 
              type="button"
              variant="outline"
              size="lg"
              block
              onClick={(e) => {
                e.stopPropagation();
                onSwitchToLogin && onSwitchToLogin();
              }}
              className="h-12 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full transition-colors text-sm"
            >
              Đăng nhập
            </Button>

            {/* AE888 Branding */}
            <div className="text-center mt-6">
              <span className="text-sm text-gray-400">AE888</span>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
};

export default MobileRegisterForm;
