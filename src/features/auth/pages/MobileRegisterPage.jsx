import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Button, Input } from '../../../components/ui';
import { authService } from '../services/authService';
import { message } from '../../../utils/notification';

const MobileRegisterPage = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    phoneNumber: '',
    inviteCode: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger animation khi component mount
    setTimeout(() => {
      setIsAnimating(true);
    }, 10);

    // Load inviteCode from URL params
    const params = new URLSearchParams(window.location.search);
    const inviteCode = params.get('inviteCode');
    if (inviteCode) {
      setFormData((prev) => ({
        ...prev,
        inviteCode
      }));
    }
  }, []);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Vui lòng nhập họ tên!';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Họ tên tối thiểu 2 ký tự!';
    }
    
    if (!formData.username) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập!';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Tên đăng nhập tối thiểu 3 ký tự!';
    }
    
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Vui lòng nhập số điện thoại!';
    } else if (!/^[0-9]{10,11}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ!';
    }
    
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu!';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu tối thiểu 6 ký tự!';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu!';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp!';
    }

    if (formData.inviteCode && !/^[A-Za-z0-9]{5,10}$/.test(formData.inviteCode)) {
      newErrors.inviteCode = 'Mã mời chỉ gồm chữ và số (5-10 ký tự)';
    }
    
    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'Vui lòng đồng ý với điều khoản!';
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
      const { confirmPassword, agreedToTerms, ...userData } = formData;
      await authService.register(userData);
      
      message.success('Đăng ký thành công! Vui lòng đăng nhập.');
      
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1500);
    } catch (error) {
      message.error(error.message || 'Đăng ký thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
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
          src="/bgauth/imgi_35_register-mb.avif" 
          alt="Register Banner" 
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

      {/* Register Form Section */}
      <div className={`bg-gray-50 -mt-8 rounded-t-3xl relative z-10 min-h-[calc(100vh-256px)] transition-transform duration-500 ease-out ${
        isAnimating ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="p-6 pt-8">
          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center tracking-wide uppercase">
            ĐĂNG KÝ
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                Họ và tên
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                error={errors.name}
                className="h-10 text-sm rounded-lg bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                Tên đăng nhập
              </label>
              <Input
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nhập tên đăng nhập"
                error={errors.username}
                className="h-10 text-sm rounded-lg bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            {/* Phone Number Field */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                Số điện thoại
              </label>
              <Input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                error={errors.phoneNumber}
                className="h-10 text-sm rounded-lg bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            {/* Invite Code Field */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                Mã mời (nếu có)
              </label>
              <Input
                name="inviteCode"
                value={formData.inviteCode}
                onChange={handleChange}
                placeholder="Nhập mã mời của bạn"
                error={errors.inviteCode}
                maxLength={10}
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
                  placeholder="Nhập mật khẩu"
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

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu"
                  error={errors.confirmPassword}
                  className="h-10 text-sm rounded-lg bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-green-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Icon icon={showConfirmPassword ? "mdi:eye-off" : "mdi:eye"} className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                name="agreedToTerms"
                checked={formData.agreedToTerms}
                onChange={handleChange}
                className="mt-0.5 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label className="text-sm font-normal text-gray-900 leading-relaxed">
                Tôi đồng ý với <a href="#" className="text-green-600 hover:underline font-medium">Điều khoản sử dụng</a> và <a href="#" className="text-green-600 hover:underline font-medium">Chính sách bảo mật</a>
              </label>
            </div>
            {errors.agreedToTerms && <p className="text-sm text-green-600 -mt-1 font-medium">{errors.agreedToTerms}</p>}

            {/* Register Button */}
            <Button 
              type="submit"
              variant="primary"
              size="lg"
              block
              loading={loading}
              className="w-full h-10 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-600 hover:from-yellow-500 hover:to-amber-700 text-white font-bold rounded-lg transition-colors text-base mt-4"
            >
              Đăng Ký
            </Button>

            {/* Login Link */}
            <div className="text-center mt-6">
              <span className="text-gray-900 text-sm">
                Bạn đã có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login', { replace: true })}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Đăng Nhập
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MobileRegisterPage;

