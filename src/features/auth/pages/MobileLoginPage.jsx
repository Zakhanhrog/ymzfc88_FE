import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Button, Input } from '../../../components/ui';
import { authService } from '../services/authService';
import { message } from '../../../utils/notification';

const MobileLoginPage = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Trigger animation khi component mount
    setTimeout(() => {
      setIsAnimating(true);
    }, 10);
  }, []);
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
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
      
      // Get redirect path from location state or default to homepage
      const redirectPath = location.state?.redirectAfterLogin || '/';
      
      window.dispatchEvent(new CustomEvent('userLoginSuccess', {
        detail: {
          user: response.user
        }
      }));

      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 500);
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
    <div className="md:hidden fixed inset-0 z-50 bg-gray-50 overflow-y-auto">
      {/* Top Image Section */}
      <div className={`relative w-full h-64 overflow-hidden transition-transform duration-500 ease-out ${
        isAnimating ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <img 
          src="/bgauth/imgi_35_login-mb.avif" 
          alt="Login Banner" 
          className="w-full h-full object-cover"
        />
        {/* Close Button */}
        <button
          onClick={() => navigate('/', { replace: true })}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-800/50 hover:bg-gray-800/70 rounded-full flex items-center justify-center transition-colors"
        >
          <Icon icon="mdi:close" className="text-white text-lg" />
        </button>
      </div>

      {/* Login Form Section */}
      <div className={`bg-gray-50 -mt-8 rounded-t-3xl relative z-10 min-h-[calc(100vh-256px)] transition-transform duration-500 ease-out ${
        isAnimating ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="p-6 pt-8">
          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center tracking-wide uppercase">
            ĐĂNG NHẬP
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                Tên đăng nhập
              </label>
              <Input
                name="usernameOrEmail"
                value={formData.usernameOrEmail}
                onChange={handleChange}
                placeholder="Nhập ít nhất 6 ký tự"
                error={errors.usernameOrEmail}
                className="h-10 text-sm rounded-lg bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập ít nhất 6 ký tự"
                  error={errors.password}
                  className="h-10 text-sm rounded-lg bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-green-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1"
              >
                Quên Mật Khẩu?
                <Icon icon="mdi:arrow-right" className="w-4 h-4" />
              </button>
            </div>

            {/* Login Button */}
            <Button 
              type="submit"
              variant="primary"
              size="lg"
              block
              loading={loading}
              className="w-full h-10 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-600 hover:from-yellow-500 hover:to-amber-700 text-white font-bold rounded-lg transition-colors text-base mt-4"
            >
              Đăng Nhập
            </Button>

            {/* Register Link */}
            <div className="text-center mt-6">
              <span className="text-gray-900 text-sm">
                Bạn chưa có tài khoản?{' '}
                        <button
                          type="button"
                          onClick={() => navigate('/register', { replace: true })}
                          className="text-green-600 hover:text-green-700 font-medium"
                        >
                          Đăng Ký
                        </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MobileLoginPage;

