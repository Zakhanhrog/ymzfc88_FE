import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Button, Input } from '../../../components/ui';
import { authService } from '../services/authService';
import { message } from '../../../utils/notification';

const MobileLoginForm = ({ onClose, onSwitchToRegister, redirectAfterLogin }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.usernameOrEmail) {
      newErrors.usernameOrEmail = 'Vui lòng nhập tên đăng nhập hoặc email!';
    }
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu!';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu tối thiểu 6 ký tự!';
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
    message.info('Đang xử lý đăng nhập...');
    
    try {
      const response = await authService.login(formData);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      message.success('Đăng nhập thành công!');
      
      setTimeout(() => {
        onClose && onClose();
        
        if (redirectAfterLogin) {
          navigate(redirectAfterLogin);
        } else {
          window.location.reload();
        }
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      message.error(error.message || 'Đăng nhập thất bại!');
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

      {/* Login Form */}
      <div className="bg-gray-50 -mt-8 mx-4 rounded-t-2xl relative z-10">
        <div className="p-6 pt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Đăng nhập</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                * Tên Đăng Nhập
              </label>
              <div className="relative">
                <Input
                  name="usernameOrEmail"
                  value={formData.usernameOrEmail}
                  onChange={handleChange}
                  placeholder="Vui lòng nhập tài khoản"
                  prefix={<Icon icon="mdi:account" className="text-gray-400" />}
                  error={errors.usernameOrEmail}
                  className="h-12 rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                * Vui lòng nhập mật khẩu
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Vui lòng nhập mật khẩu"
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

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                Nhớ mật khẩu tài khoản của bạn
              </label>
            </div>

            {/* Login Button */}
            <Button 
              type="submit"
              variant="primary"
              size="lg"
              block
              loading={loading}
              className="h-12 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-colors text-sm mt-6"
            >
              Đăng nhập
            </Button>

            {/* Register Button */}
            <Button 
              type="button"
              variant="outline"
              size="lg"
              block
              onClick={(e) => {
                e.stopPropagation();
                onSwitchToRegister && onSwitchToRegister();
              }}
              className="h-12 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full transition-colors text-sm"
            >
              Đăng ký
            </Button>


            {/* AE888 Branding */}
            <div className="text-center mt-4">
              <span className="text-sm text-gray-400">AE888</span>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
};

export default MobileLoginForm;
