import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Button, Input } from '../../../components/ui';
import { authService } from '../services/authService';
import { message } from '../../../utils/notification';

const LoginForm = ({ onClose, onSwitchToRegister }) => {
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
        window.location.reload();
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
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="flex h-[700px]" onClick={(e) => e.stopPropagation()}>
      {/* Left Side - Image */}
      <div className="w-1/2 relative overflow-hidden">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://th2club.net/images/1717680076846848.png.avif')`
          }}
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-1/2 p-8 bg-white flex items-start pt-12 relative">
        <div className="w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">ĐĂNG NHẬP</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" onClick={(e) => e.stopPropagation()}>
            <Input
              name="usernameOrEmail"
              value={formData.usernameOrEmail}
              onChange={handleChange}
              placeholder="Tên đăng nhập hoặc email"
              prefix={<Icon icon="mdi:account" className="text-gray-400" />}
              error={errors.usernameOrEmail}
              className="h-12"
            />

            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mật khẩu"
              prefix={<Icon icon="mdi:lock" className="text-gray-400" />}
              error={errors.password}
              className="h-12"
            />

            <div className="flex justify-between items-center my-6">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSwitchToRegister && onSwitchToRegister();
                }}
                className="text-[#D30102] hover:underline font-medium"
              >
                Đăng ký
              </button>
              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
                className="text-[#D30102] hover:underline font-medium"
              >
                Quên mật khẩu
              </button>
            </div>

            <Button 
              type="submit"
              variant="primary"
              size="lg"
              block
              loading={loading}
              className="font-semibold h-12"
            >
              ĐĂNG NHẬP
            </Button>
          </form>
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-between px-8">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose && onClose();
              navigate('/');
            }}
            className="flex items-center gap-2 font-medium text-[#D30102] hover:underline"
          >
            <Icon icon="mdi:home" />
            TRANG CHỦ
          </button>
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 font-medium text-[#D30102] hover:underline"
          >
            <Icon icon="mdi:headset" />
            CSKH
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
