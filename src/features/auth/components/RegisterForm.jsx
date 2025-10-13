import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Button, Input } from '../../../components/ui';
import { authService } from '../services/authService';
import { message } from '../../../utils/notification';

const RegisterForm = ({ onClose, onSwitchToLogin }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Vui lòng nhập họ tên!';
    else if (formData.name.length < 2) newErrors.name = 'Họ tên tối thiểu 2 ký tự!';
    
    if (!formData.username) newErrors.username = 'Vui lòng nhập tên đăng nhập!';
    else if (formData.username.length < 3) newErrors.username = 'Tên đăng nhập tối thiểu 3 ký tự!';
    
    if (!formData.email) newErrors.email = 'Vui lòng nhập email!';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email không hợp lệ!';
    
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Vui lòng nhập số điện thoại!';
    else if (!/^[0-9]{10,11}$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Số điện thoại không hợp lệ!';
    
    if (!formData.password) newErrors.password = 'Vui lòng nhập mật khẩu!';
    else if (formData.password.length < 6) newErrors.password = 'Mật khẩu tối thiểu 6 ký tự!';
    
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu!';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Mật khẩu không khớp!';
    
    if (!formData.agreedToTerms) newErrors.agreedToTerms = 'Vui lòng đồng ý với điều khoản!';
    
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
        onSwitchToLogin && onSwitchToLogin();
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
    <div className="flex h-[700px] w-[900px] bg-white rounded-lg overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
      {/* Left Side - Promotional Banner */}
      <div 
        className="w-1/2 relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url('/images/banners/login-bg.jpg')` }}
      >
      </div>

      {/* Right Side - Register Form */}
      <div className="w-1/2 p-8 bg-gray-50 flex flex-col relative overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors z-10"
        >
          <Icon icon="mdi:close" className="text-blue-600 text-lg" />
        </button>

        <div className="flex-1 flex flex-col justify-center">
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-gray-800 uppercase" style={{ fontFamily: 'Arial, sans-serif' }}>
              ĐĂNG KÝ
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" onClick={(e) => e.stopPropagation()}>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Họ và tên"
              prefix={<Icon icon="mdi:account" className="text-gray-400" />}
              error={errors.name}
              className="h-12 rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
              style={{ fontFamily: 'Arial, sans-serif' }}
            />

            <Input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Tên đăng nhập"
              prefix={<Icon icon="mdi:account-circle" className="text-gray-400" />}
              error={errors.username}
              className="h-12 rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
              style={{ fontFamily: 'Arial, sans-serif' }}
            />

            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              prefix={<Icon icon="mdi:email" className="text-gray-400" />}
              error={errors.email}
              className="h-12 rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
              style={{ fontFamily: 'Arial, sans-serif' }}
            />

            <Input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Số điện thoại"
              prefix={<Icon icon="mdi:phone" className="text-gray-400" />}
              error={errors.phoneNumber}
              className="h-12 rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
              style={{ fontFamily: 'Arial, sans-serif' }}
            />

            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mật khẩu"
              prefix={<Icon icon="mdi:lock" className="text-gray-400" />}
              error={errors.password}
              className="h-12 rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
              style={{ fontFamily: 'Arial, sans-serif' }}
            />

            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Xác nhận mật khẩu"
              prefix={<Icon icon="mdi:lock-check" className="text-gray-400" />}
              error={errors.confirmPassword}
              className="h-12 rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
              style={{ fontFamily: 'Arial, sans-serif' }}
            />

            <div className="flex items-start gap-2 py-2">
              <input
                type="checkbox"
                name="agreedToTerms"
                checked={formData.agreedToTerms}
                onChange={handleChange}
                className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <label className="text-sm text-gray-600" style={{ fontFamily: 'Arial, sans-serif' }}>
                Tôi đồng ý với <a href="#" className="text-red-600 hover:underline">Điều khoản sử dụng</a> và <a href="#" className="text-red-600 hover:underline">Chính sách bảo mật</a>
              </label>
            </div>
            {errors.agreedToTerms && <p className="text-sm text-red-600 -mt-2" style={{ fontFamily: 'Arial, sans-serif' }}>{errors.agreedToTerms}</p>}

            <div className="flex items-center justify-center py-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSwitchToLogin && onSwitchToLogin();
                }}
                className="text-sm text-red-600 hover:underline font-medium"
                style={{ fontFamily: 'Arial, sans-serif' }}
              >
                Đã có tài khoản? Đăng nhập ngay
              </button>
            </div>

            <Button 
              type="submit"
              variant="primary"
              size="lg"
              block
              loading={loading}
              className="h-10 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors text-sm"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              ĐĂNG KÝ
            </Button>
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
            className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-red-600 transition-colors"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            <Icon icon="mdi:home" className="text-red-600 text-sm" />
            TRANG CHỦ
          </button>
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-red-600 transition-colors"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            <Icon icon="mdi:headset" className="text-red-600 text-sm" />
            CSKH
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;