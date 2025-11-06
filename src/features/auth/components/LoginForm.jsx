import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Button, Input } from '../../../components/ui';
import { authService } from '../services/authService';
import { message } from '../../../utils/notification';

const LoginForm = ({ onClose, onSwitchToRegister, redirectAfterLogin }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
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
    <div className="flex h-[600px] w-[800px] bg-white rounded-lg overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
      {/* Left Side - Promotional Banner */}
      <div 
        className="w-1/2 relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url('/images/banners/login-bg.jpg')` }}
      >
      </div>

      {/* Right Side - Login Form */}
      <div className="w-1/2 p-8 bg-gray-50 flex flex-col relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors"
        >
          <Icon icon="mdi:close" className="text-blue-600 text-lg" />
        </button>

        <div className="flex-1 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h2 className="text-lg font-semibold text-gray-900 uppercase tracking-wide">
              Đăng nhập
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tên đăng nhập hoặc email
              </label>
              <Input
                name="usernameOrEmail"
                value={formData.usernameOrEmail}
                onChange={handleChange}
                placeholder="Nhập tên đăng nhập hoặc email"
                prefix={<Icon icon="mdi:account" className="text-gray-400 text-base" />}
                error={errors.usernameOrEmail}
                className="h-11 text-sm rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mật khẩu
              </label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                prefix={<Icon icon="mdi:lock" className="text-gray-400 text-base" />}
                suffix={<Icon icon="mdi:eye" className="text-gray-400 cursor-pointer text-base" />}
                error={errors.password}
                className="h-11 text-sm rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div className="flex justify-between items-center my-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSwitchToRegister && onSwitchToRegister();
                }}
                className="text-sm font-medium text-green-600 hover:text-green-700 hover:underline transition-colors"
              >
                Đăng ký
              </button>
              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
                className="text-sm font-medium text-green-600 hover:text-green-700 hover:underline transition-colors"
              >
                Quên mật khẩu
              </button>
            </div>

            <div className="flex justify-center">
              <Button 
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="h-11 w-full max-w-[280px] bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white font-semibold rounded-lg transition-colors text-sm"
              >
                Đăng nhập
              </Button>
            </div>
          </form>
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose && onClose();
              navigate('/');
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-green-600 transition-colors"
          >
            <Icon icon="mdi:home" className="text-green-600 text-base" />
            TRANG CHỦ
          </button>
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-green-600 transition-colors"
          >
            <Icon icon="mdi:headset" className="text-green-600 text-base" />
            CSKH
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;